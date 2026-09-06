/**
 * Server-side SEO. Three jobs:
 *
 *  1. Serve real /robots.txt and /sitemap.xml files. Previously both fell
 *     through to the SPA catch-all and returned the HTML app shell with a 200,
 *     which Search Console rejects as an invalid sitemap format.
 *  2. Inject per-route <title>, description, canonical, Open Graph, Twitter and
 *     JSON-LD into the HTML shell before it is sent. The app is a client-rendered
 *     SPA, so without this every route ships the same title and no crawler that
 *     skips JavaScript sees anything else.
 *  3. Return a real 404 status for unmatched routes instead of 200, and omit the
 *     canonical tag on that response so junk URLs stop self-canonicalising.
 *
 * Imports use relative paths rather than the @shared alias because this file is
 * bundled by esbuild with --packages=external, which would treat "@shared/..."
 * as an external package and fail to resolve it at runtime.
 */

import type { Express, Request, Response } from "express";
import { allArticles } from "../../shared/blogArticles";
import {
  ARTICLE_SEO,
  ROUTE_SEO,
  SITE_URL,
  absoluteUrl,
  articlePath,
  normalisePath,
} from "../../shared/seo";
import { resolvePageSeo, type ResolvedSeo } from "../../shared/seoMeta";

/** Paths crawlers should not spend budget on. Kept in step with ROUTE_SEO. */
const DISALLOWED_PATHS = ["/admin", "/login", "/orders", "/survey", "/bold-out-intake"];

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * JSON-LD sits inside a <script> block, so the only real hazard is a literal
 * "</script>" or an HTML comment opener inside a string value.
 */
export function serialiseJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

function metaTag(attr: "name" | "property", key: string, content: string): string {
  return `<meta ${attr}="${key}" content="${escapeHtml(content)}" />`;
}

/** Builds the full head block for a resolved page. */
export function buildHeadTags(seo: ResolvedSeo): string {
  const tags: string[] = [
    `<title>${escapeHtml(seo.title)}</title>`,
    metaTag("name", "description", seo.description),
  ];

  if (seo.noindex) {
    tags.push(metaTag("name", "robots", "noindex, nofollow"));
  } else {
    tags.push(metaTag("name", "robots", "index, follow, max-image-preview:large"));
  }

  // Never emit a canonical for an unmatched URL -- that is what let invented
  // paths declare themselves canonical.
  if (seo.canonical) {
    tags.push(`<link rel="canonical" href="${escapeHtml(seo.canonical)}" />`);
  }

  tags.push(
    metaTag("property", "og:type", seo.ogType),
    metaTag("property", "og:site_name", "Purely Divine Coaching"),
    metaTag("property", "og:title", seo.title),
    metaTag("property", "og:description", seo.description),
    metaTag("property", "og:image", seo.ogImage),
    metaTag("property", "og:locale", "en_US"),
    metaTag("name", "twitter:card", "summary_large_image"),
    metaTag("name", "twitter:title", seo.title),
    metaTag("name", "twitter:description", seo.description),
    metaTag("name", "twitter:image", seo.ogImage)
  );

  if (seo.canonical) {
    tags.push(metaTag("property", "og:url", seo.canonical));
  }

  if (seo.article) {
    tags.push(
      metaTag("property", "article:published_time", seo.article.publishedTime),
      metaTag("property", "article:modified_time", seo.article.modifiedTime),
      metaTag("property", "article:author", seo.article.author)
    );
    if (seo.article.section) {
      tags.push(metaTag("property", "article:section", seo.article.section));
    }
  }

  for (const block of seo.jsonLd) {
    tags.push(
      `<script type="application/ld+json">${serialiseJsonLd(block)}</script>`
    );
  }

  return tags.join("\n    ");
}

/**
 * Replaces the shell's static title/description with the ones for this path.
 * Strips the originals first so the document never carries two of either.
 */
export function injectSeoIntoHtml(html: string, path: string): string {
  const seo = resolvePageSeo(path);

  const stripped = html
    .replace(/<title>[\s\S]*?<\/title>\s*/i, "")
    .replace(/<meta\s+name=["']description["'][^>]*>\s*/i, "");

  const headTags = buildHeadTags(seo);

  if (stripped.includes("</head>")) {
    return stripped.replace("</head>", `    ${headTags}\n  </head>`);
  }

  // No </head> to anchor to (unexpected) -- leave the document untouched rather
  // than risk emitting malformed HTML.
  return html;
}

/** True when the path matches no known route, so the response should be a 404. */
export function isUnknownRoute(path: string): boolean {
  return resolvePageSeo(path).canonical === "" && normalisePath(path) !== "/404";
}

export function buildRobotsTxt(): string {
  const lines = [
    "# Purely Divine Coaching - https://dicollectivellc.com",
    "",
    "User-agent: *",
    "Allow: /",
    "",
    "# Private and administrative areas.",
    "# Note: /blog/archive is intentionally NOT disallowed. It carries a noindex",
    "# tag and a canonical to /blog, and Google has to be able to crawl it to see",
    "# them. Blocking it here would leave the duplicate eligible for indexing.",
    ...DISALLOWED_PATHS.map(path => `Disallow: ${path}`),
    "",
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    "",
  ];
  return lines.join("\n");
}

export function buildSitemapXml(): string {
  const articleDates = new Map(
    allArticles.map(article => [article.id, article.date.toISOString().slice(0, 10)])
  );

  const entries: string[] = [];

  for (const route of ROUTE_SEO) {
    if (route.noindex) continue;
    entries.push(
      urlEntry({
        loc: absoluteUrl(route.path),
        changefreq: route.changefreq,
        priority: route.priority,
      })
    );
  }

  for (const article of ARTICLE_SEO) {
    entries.push(
      urlEntry({
        loc: absoluteUrl(articlePath(article.slug)),
        lastmod: articleDates.get(article.slug),
        changefreq: "monthly",
        priority: 0.7,
      })
    );
  }

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    "</urlset>",
    "",
  ].join("\n");
}

function urlEntry(input: {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
}): string {
  const parts = [`    <loc>${escapeHtml(input.loc)}</loc>`];
  if (input.lastmod) parts.push(`    <lastmod>${input.lastmod}</lastmod>`);
  if (input.changefreq) parts.push(`    <changefreq>${input.changefreq}</changefreq>`);
  if (input.priority !== undefined) {
    parts.push(`    <priority>${input.priority.toFixed(1)}</priority>`);
  }
  return ["  <url>", ...parts, "  </url>"].join("\n");
}

/**
 * Registers /robots.txt and /sitemap.xml. Must run before the SPA catch-all so
 * these paths return real files instead of the app shell.
 */
export function registerSeoRoutes(app: Express) {
  app.get("/robots.txt", (_req: Request, res: Response) => {
    res
      .status(200)
      .type("text/plain")
      .set("Cache-Control", "public, max-age=3600")
      .send(buildRobotsTxt());
  });

  app.get("/sitemap.xml", (_req: Request, res: Response) => {
    res
      .status(200)
      .type("application/xml")
      .set("Cache-Control", "public, max-age=3600")
      .send(buildSitemapXml());
  });
}
