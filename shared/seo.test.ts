import { describe, it, expect } from "vitest";
import { allArticles } from "./blogArticles";
import {
  ARTICLE_SEO,
  ROUTE_SEO,
  SITE_URL,
  absoluteUrl,
  classifyLink,
  getRouteSeo,
  normalisePath,
  relForLink,
  sitemapPaths,
} from "./seo";
import { matchArticlePath, resolvePageSeo } from "./seoMeta";

/**
 * Routes registered in client/src/App.tsx. If a route is added there without a
 * ROUTE_SEO entry it inherits no title and never reaches the sitemap, which is
 * the exact failure this suite exists to catch.
 */
const APP_ROUTES = [
  "/",
  "/shop",
  "/voice-quiz",
  "/divine-mindset-assessment",
  "/bold-out-intake",
  "/coaching",
  "/blog",
  "/blog/archive",
  "/about",
  "/events",
  "/programs",
  "/contact",
  "/privacy",
  "/orders",
  "/survey",
  "/login",
  "/admin",
  "/admin/submissions",
  "/404",
];

describe("route metadata", () => {
  it("covers every route registered in the app", () => {
    for (const path of APP_ROUTES) {
      expect(getRouteSeo(path), `no ROUTE_SEO entry for ${path}`).toBeDefined();
    }
  });

  it("does not define metadata for routes the app never serves", () => {
    for (const route of ROUTE_SEO) {
      expect(APP_ROUTES, `ROUTE_SEO has an orphan entry: ${route.path}`).toContain(
        route.path
      );
    }
  });

  it("gives every route a unique title and description", () => {
    const titles = ROUTE_SEO.map(route => route.title);
    const descriptions = ROUTE_SEO.map(route => route.description);

    // The original bug: one title shared by all 19 routes.
    const indexable = ROUTE_SEO.filter(route => !route.noindex);
    expect(new Set(indexable.map(r => r.title)).size).toBe(indexable.length);
    expect(new Set(indexable.map(r => r.description)).size).toBe(indexable.length);
    expect(titles.length).toBe(ROUTE_SEO.length);
    expect(descriptions.length).toBe(ROUTE_SEO.length);
  });

  it("keeps indexable titles and descriptions inside Google's display limits", () => {
    for (const route of ROUTE_SEO) {
      if (route.noindex) continue;
      expect(route.title.length, `title too long: ${route.path}`).toBeLessThanOrEqual(60);
      expect(
        route.description.length,
        `description too long: ${route.path}`
      ).toBeLessThanOrEqual(160);
      expect(
        route.description.length,
        `description too short: ${route.path}`
      ).toBeGreaterThanOrEqual(70);
    }
  });

  it("keeps private areas out of the index", () => {
    for (const path of ["/admin", "/admin/submissions", "/login", "/orders", "/survey"]) {
      expect(getRouteSeo(path)?.noindex, `${path} should be noindex`).toBe(true);
    }
  });
});

describe("article metadata", () => {
  it("has an entry for every article, and no entries for missing articles", () => {
    const articleIds = allArticles.map(article => article.id).sort();
    const seoSlugs = ARTICLE_SEO.map(article => article.slug).sort();
    expect(seoSlugs).toEqual(articleIds);
  });

  it("keeps article titles short enough to survive the brand suffix", () => {
    for (const article of ARTICLE_SEO) {
      // Rendered as "<title> | Purely Divine Coaching" (25 extra characters).
      expect(article.title.length, `too long: ${article.slug}`).toBeLessThanOrEqual(60);
      expect(
        article.description.length,
        `description too long: ${article.slug}`
      ).toBeLessThanOrEqual(160);
    }
  });

  it("gives every article a distinct title", () => {
    const titles = ARTICLE_SEO.map(article => article.title);
    expect(new Set(titles).size).toBe(titles.length);
  });
});

describe("path helpers", () => {
  it("normalises query strings, hashes and trailing slashes", () => {
    expect(normalisePath("/blog/")).toBe("/blog");
    expect(normalisePath("/blog?utm_source=x")).toBe("/blog");
    expect(normalisePath("/blog#section")).toBe("/blog");
    expect(normalisePath("/")).toBe("/");
    expect(normalisePath("")).toBe("/");
  });

  it("builds absolute URLs without a double slash", () => {
    expect(absoluteUrl("/")).toBe(`${SITE_URL}/`);
    expect(absoluteUrl("/blog")).toBe(`${SITE_URL}/blog`);
  });

  it("matches article paths but not the blog index or archive", () => {
    expect(matchArticlePath("/blog/you-are-worthy")).toBe("you-are-worthy");
    expect(matchArticlePath("/blog")).toBeNull();
    expect(matchArticlePath("/blog/archive")).toBeNull();
    expect(matchArticlePath("/blog/a/b")).toBeNull();
  });
});

describe("sitemap contents", () => {
  const paths = sitemapPaths();

  it("lists every article", () => {
    for (const article of allArticles) {
      expect(paths).toContain(`/blog/${article.id}`);
    }
  });

  it("excludes every noindex route", () => {
    for (const route of ROUTE_SEO) {
      if (!route.noindex) continue;
      expect(paths, `${route.path} should not be in the sitemap`).not.toContain(route.path);
    }
  });

  it("has no duplicates", () => {
    expect(new Set(paths).size).toBe(paths.length);
  });
});

describe("resolvePageSeo", () => {
  it("gives each article its own title, canonical and article metadata", () => {
    const seo = resolvePageSeo("/blog/you-are-worthy");
    expect(seo.title).toContain("What the Bible Says About Self-Worth");
    expect(seo.canonical).toBe(`${SITE_URL}/blog/you-are-worthy`);
    expect(seo.ogType).toBe("article");
    expect(seo.article?.author).toBe("Nancy Marie Dixon");
    expect(seo.noindex).toBe(false);
  });

  it("emits no canonical for an unmatched URL", () => {
    // The original bug: junk URLs returned 200 and declared themselves canonical.
    const seo = resolvePageSeo("/this-page-does-not-exist-123");
    expect(seo.canonical).toBe("");
    expect(seo.noindex).toBe(true);
    expect(seo.jsonLd).toHaveLength(0);
  });

  it("treats an unknown article slug as a 404 rather than an empty article", () => {
    const seo = resolvePageSeo("/blog/no-such-article");
    expect(seo.canonical).toBe("");
    expect(seo.noindex).toBe(true);
  });

  it("points the duplicate archive at the blog index", () => {
    const seo = resolvePageSeo("/blog/archive");
    expect(seo.noindex).toBe(true);
    expect(seo.canonical).toBe(`${SITE_URL}/blog`);
  });

  it("resolves a route ignoring query strings", () => {
    expect(resolvePageSeo("/about?utm_source=newsletter").canonical).toBe(
      `${SITE_URL}/about`
    );
  });

  it("builds a schema graph on indexable pages", () => {
    const home = resolvePageSeo("/");
    expect(home.jsonLd).toHaveLength(1);
    const graph = home.jsonLd[0]["@graph"] as Record<string, unknown>[];
    const types = graph.flatMap(node =>
      Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]]
    );
    // ProfessionalService is a LocalBusiness subtype, so this still carries the
    // local signals without implying a storefront clients visit.
    expect(types).toContain("ProfessionalService");
    expect(types).toContain("Organization");
    expect(types).toContain("Person");
    expect(types).toContain("WebSite");
  });

  it("claims both the Cleveland area and the whole US as served", () => {
    const graph = resolvePageSeo("/")["jsonLd"][0]["@graph"] as Record<string, unknown>[];
    const org = graph.find(node =>
      (node["@type"] as string[]).includes?.("ProfessionalService")
    );
    const areas = (org?.areaServed as { name: string }[]).map(area => area.name);
    expect(areas).toContain("Cleveland, Ohio");
    expect(areas).toContain("United States");
  });

  it("never publishes a street address", () => {
    // The only address on file is a home address. A service-area business does
    // not need it to rank locally, and publishing it would expose where she lives.
    const serialised = JSON.stringify(resolvePageSeo("/").jsonLd);
    expect(serialised).not.toContain("streetAddress");
    expect(serialised).not.toContain("Grosvenor");
  });

  it("describes an article as a BlogPosting written by Nancy", () => {
    const seo = resolvePageSeo("/blog/appointed-not-nominated");
    const graph = seo.jsonLd[0]["@graph"] as Record<string, unknown>[];
    const posting = graph.find(node => node["@type"] === "BlogPosting");
    expect(posting).toBeDefined();
    expect(posting?.datePublished).toBeTypeOf("string");
    expect(posting?.wordCount).toBeGreaterThan(100);
    const breadcrumb = graph.find(node => node["@type"] === "BreadcrumbList");
    expect(breadcrumb).toBeDefined();
  });
});

describe("outbound link policy", () => {
  it("marks affiliate links as sponsored so they are disclosed to Google", () => {
    expect(classifyLink("https://www.amazon.com/dp/123")).toBe("affiliate");
    expect(classifyLink("https://amzn.to/abc")).toBe("affiliate");
    expect(relForLink("affiliate")).toContain("sponsored");
    expect(relForLink("affiliate")).toContain("nofollow");
  });

  it("treats ordinary outbound links as external, not sponsored", () => {
    expect(classifyLink("https://www.biblegateway.com/passage")).toBe("external");
    expect(relForLink("external")).toBe("noopener noreferrer");
  });

  it("treats own-site and relative links as internal", () => {
    expect(classifyLink("/blog/you-are-worthy")).toBe("internal");
    expect(classifyLink(`${SITE_URL}/about`)).toBe("internal");
    expect(relForLink("internal")).toBeUndefined();
  });
});
