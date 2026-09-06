import { describe, it, expect } from "vitest";
import { allArticles } from "../../shared/blogArticles";
import { SITE_URL } from "../../shared/seo";
import {
  buildHeadTags,
  buildRobotsTxt,
  buildSitemapXml,
  injectSeoIntoHtml,
  isUnknownRoute,
  serialiseJsonLd,
} from "./seo";
import { resolvePageSeo } from "../../shared/seoMeta";

/** Mirrors the real shell in client/index.html. */
const SHELL = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Purely Divine Coaching | Nancy Marie Dixon</title>
    <meta
      name="description"
      content="Faith-rooted voice coaching, resources, and reinvention support."
    />
  </head>
  <body><div id="root"></div></body>
</html>`;

function countOccurrences(haystack: string, needle: RegExp): number {
  return haystack.match(needle)?.length ?? 0;
}

describe("robots.txt", () => {
  const robots = buildRobotsTxt();

  it("points at the sitemap", () => {
    expect(robots).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
  });

  it("blocks the admin and account areas", () => {
    for (const path of ["/admin", "/login", "/orders", "/survey"]) {
      expect(robots).toContain(`Disallow: ${path}`);
    }
  });

  it("leaves the blog crawlable", () => {
    expect(robots).not.toMatch(/^Disallow: \/blog$/m);
    expect(robots).not.toMatch(/^Disallow: \/$/m);
  });

  it("does not block the archive, whose noindex tag must stay readable", () => {
    expect(robots).not.toMatch(/^Disallow: \/blog\/archive$/m);
  });

  it("declares a single user-agent group", () => {
    expect(countOccurrences(robots, /^User-agent:/gm)).toBe(1);
  });
});

describe("sitemap.xml", () => {
  const sitemap = buildSitemapXml();

  it("is well-formed XML with a urlset root", () => {
    expect(sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(sitemap).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(sitemap.trimEnd().endsWith("</urlset>")).toBe(true);
    expect(countOccurrences(sitemap, /<url>/g)).toBe(countOccurrences(sitemap, /<\/url>/g));
  });

  it("lists every article with its publication date", () => {
    for (const article of allArticles) {
      expect(sitemap).toContain(`<loc>${SITE_URL}/blog/${article.id}</loc>`);
    }
    expect(countOccurrences(sitemap, /<lastmod>/g)).toBe(allArticles.length);
  });

  it("lists the public pages", () => {
    for (const path of ["/", "/about", "/blog", "/programs", "/contact"]) {
      const loc = path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
      expect(sitemap).toContain(`<loc>${loc}</loc>`);
    }
  });

  it("omits admin, login and the duplicate archive", () => {
    for (const path of ["/admin", "/login", "/orders", "/blog/archive"]) {
      expect(sitemap).not.toContain(`<loc>${SITE_URL}${path}</loc>`);
    }
  });

  it("escapes ampersands so the XML stays valid", () => {
    expect(sitemap).not.toMatch(/&(?!amp;|lt;|gt;|quot;)/);
  });
});

describe("head tag construction", () => {
  it("emits exactly one title and description per page", () => {
    const tags = buildHeadTags(resolvePageSeo("/about"));
    expect(countOccurrences(tags, /<title>/g)).toBe(1);
    expect(countOccurrences(tags, /name="description"/g)).toBe(1);
  });

  it("escapes HTML in attribute values", () => {
    const tags = buildHeadTags({
      title: 'Quote " and <tag>',
      description: "Ampersand & angle <",
      canonical: `${SITE_URL}/x`,
      noindex: false,
      ogType: "website",
      ogImage: "https://example.com/a.png",
      jsonLd: [],
    });
    expect(tags).toContain("&quot;");
    expect(tags).toContain("&lt;tag&gt;");
    expect(tags).not.toMatch(/content="[^"]*<tag>/);
  });

  it("marks private pages noindex and public pages index", () => {
    expect(buildHeadTags(resolvePageSeo("/admin"))).toContain("noindex, nofollow");
    expect(buildHeadTags(resolvePageSeo("/"))).toContain("index, follow");
  });

  it("adds article metadata only on articles", () => {
    const article = buildHeadTags(resolvePageSeo("/blog/you-are-worthy"));
    expect(article).toContain('property="article:published_time"');
    expect(article).toContain('property="og:type" content="article"');

    const page = buildHeadTags(resolvePageSeo("/about"));
    expect(page).not.toContain("article:published_time");
  });
});

describe("JSON-LD serialisation", () => {
  it("neutralises anything that could close the script tag early", () => {
    const output = serialiseJsonLd({ headline: "</script><img onerror=alert(1)>" });
    expect(output).not.toContain("</script>");
    expect(output).not.toContain("<");
    expect(output).not.toContain(">");
    // Still valid JSON that parses back to the original string.
    expect(JSON.parse(output).headline).toBe("</script><img onerror=alert(1)>");
  });
});

describe("injectSeoIntoHtml", () => {
  it("replaces the shell title rather than adding a second one", () => {
    const html = injectSeoIntoHtml(SHELL, "/about");
    expect(countOccurrences(html, /<title>/g)).toBe(1);
    expect(countOccurrences(html, /name="description"/g)).toBe(1);
    expect(html).toContain("Nancy Marie Dixon — Certified Christian Life Coach");
    expect(html).not.toContain("Purely Divine Coaching | Nancy Marie Dixon");
  });

  it("gives different routes different titles", () => {
    // The original bug: all 19 routes served one identical title.
    const seen = new Set<string>();
    for (const path of ["/", "/about", "/blog", "/shop", "/contact", "/programs"]) {
      const title = /<title>(.*?)<\/title>/.exec(injectSeoIntoHtml(SHELL, path))?.[1];
      expect(title).toBeTruthy();
      seen.add(title as string);
    }
    expect(seen.size).toBe(6);
  });

  it("adds a canonical on real pages and none on invented ones", () => {
    expect(injectSeoIntoHtml(SHELL, "/blog")).toContain(
      `<link rel="canonical" href="${SITE_URL}/blog" />`
    );
    expect(injectSeoIntoHtml(SHELL, "/nonsense-url-42")).not.toContain('rel="canonical"');
  });

  it("embeds structured data on public pages", () => {
    const html = injectSeoIntoHtml(SHELL, "/blog/you-are-worthy");
    expect(html).toContain('<script type="application/ld+json">');
    expect(html).toContain("BlogPosting");
  });

  it("keeps the document body untouched", () => {
    expect(injectSeoIntoHtml(SHELL, "/about")).toContain('<div id="root"></div>');
  });

  it("leaves the document alone if there is no head to inject into", () => {
    const noHead = "<html><body>hi</body></html>";
    expect(injectSeoIntoHtml(noHead, "/about")).toBe(noHead);
  });
});

describe("404 detection", () => {
  it("flags invented URLs", () => {
    expect(isUnknownRoute("/this-page-does-not-exist-123")).toBe(true);
    expect(isUnknownRoute("/blog/not-a-real-article")).toBe(true);
  });

  it("does not flag real routes or articles", () => {
    for (const path of ["/", "/about", "/blog", "/blog/archive", "/admin", "/404"]) {
      expect(isUnknownRoute(path), `${path} should not 404`).toBe(false);
    }
    for (const article of allArticles) {
      expect(isUnknownRoute(`/blog/${article.id}`)).toBe(false);
    }
  });

  it("does not flag a real route carrying a tracking query string", () => {
    expect(isUnknownRoute("/about?utm_source=facebook")).toBe(false);
  });
});
