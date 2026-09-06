/**
 * Turns a URL path into the complete set of head tags and JSON-LD for that page.
 *
 * Both the Express server (server/_core/seo.ts) and the React client
 * (client/src/components/Seo.tsx) call resolvePageSeo() so a crawler and a
 * browser always receive identical metadata.
 */

import { getArticleById, type BlogArticle } from "./blogArticles";
import { getArticleEnrichment } from "./blogEnrichment";
import {
  ARTICLE_SEO,
  AUTHOR_NAME,
  AUTHOR_TITLE,
  BUSINESS_REGION,
  BOOKING_URL,
  CONTACT_EMAIL,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  LEGAL_NAME,
  SERVICE_AREAS,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
  getArticleSeo,
  getRouteSeo,
  normalisePath,
} from "./seo";

export interface ArticleMeta {
  publishedTime: string;
  modifiedTime: string;
  author: string;
  section?: string;
}

export interface ResolvedSeo {
  title: string;
  description: string;
  canonical: string;
  noindex: boolean;
  ogType: "website" | "article";
  ogImage: string;
  article?: ArticleMeta;
  /** JSON-LD objects to embed as <script type="application/ld+json">. */
  jsonLd: Record<string, unknown>[];
}

// --- Stable @id anchors so the graph nodes can reference each other ----------

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const PERSON_ID = `${SITE_URL}/#nancy-marie-dixon`;

/** Matches /blog/<slug>, but not /blog or /blog/archive. */
export function matchArticlePath(path: string): string | null {
  const clean = normalisePath(path);
  const match = /^\/blog\/([A-Za-z0-9-]+)$/.exec(clean);
  if (!match) return null;
  const slug = match[1];
  if (slug === "archive") return null;
  return slug;
}

/**
 * Typed as ProfessionalService rather than LocalBusiness directly.
 *
 * ProfessionalService is a subtype of LocalBusiness in schema.org, so this
 * still carries every local signal, but without implying a storefront that
 * clients visit. areaServed then does the real work: it names the Cleveland
 * cities and the United States together, so the same markup supports the local
 * terms and the national ones instead of forcing a choice between them.
 */
function organizationLd(): Record<string, unknown> {
  return {
    "@type": ["Organization", "ProfessionalService"],
    "@id": ORG_ID,
    name: SITE_NAME,
    legalName: LEGAL_NAME,
    alternateName: [LEGAL_NAME, "Divine Collective", "DI Collective LLC"],
    url: `${SITE_URL}/`,
    email: CONTACT_EMAIL,
    description: DEFAULT_DESCRIPTION,
    image: DEFAULT_OG_IMAGE,
    founder: { "@id": PERSON_ID },
    address: {
      "@type": "PostalAddress",
      ...BUSINESS_REGION,
    },
    areaServed: SERVICE_AREAS.map(area => ({ "@type": area.type, name: area.name })),
    availableLanguage: "en-US",
    knowsAbout: [
      "Christian life coaching",
      "Self-worth",
      "Faith-based coaching for women",
      "Public speaking and voice",
    ],
    potentialAction: {
      "@type": "ReserveAction",
      name: "Book a discovery call",
      target: BOOKING_URL,
    },
  };
}

function websiteLd(): Record<string, unknown> {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    publisher: { "@id": ORG_ID },
    inLanguage: "en-US",
  };
}

function personLd(): Record<string, unknown> {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: AUTHOR_NAME,
    jobTitle: AUTHOR_TITLE,
    description:
      "Certified Christian life coach, author and speaker helping women move from silence and self-doubt into bold, purpose-filled expression.",
    url: `${SITE_URL}/about`,
    email: CONTACT_EMAIL,
    worksFor: { "@id": ORG_ID },
    knowsAbout: [
      "Christian life coaching",
      "Self-worth",
      "Finding your voice",
      "Faith and purpose",
    ],
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "certification",
      name: "Certified Christian Life Coach",
    },
  };
}

function breadcrumbLd(trail: { name: string; path: string }[]): Record<string, unknown> {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

function blogPostingLd(article: BlogArticle): Record<string, unknown> {
  const url = absoluteUrl(`/blog/${article.id}`);
  const published = article.date.toISOString();
  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: article.title,
    description: article.excerpt,
    articleSection: article.category,
    datePublished: published,
    dateModified: published,
    wordCount: countWords(article.content),
    inLanguage: "en-US",
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@id": PERSON_ID },
    publisher: { "@id": ORG_ID },
    image: DEFAULT_OG_IMAGE,
    isPartOf: { "@id": `${SITE_URL}/blog#blog` },
  };
}

/**
 * FAQPage markup for the question block appended to a post.
 *
 * Google stopped showing FAQ rich results for most sites in 2023, so this will
 * not produce the expandable snippet it once did. It is still worth emitting:
 * it states plainly which text answers which question, which helps the passage
 * be selected for a featured snippet or an AI overview.
 */
function faqLd(slug: string, url: string): Record<string, unknown> | null {
  const faq = getArticleEnrichment(slug)?.faq;
  if (!faq || faq.length === 0) return null;

  return {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: faq.map(entry => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: { "@type": "Answer", text: entry.answer },
    })),
  };
}

function blogLd(): Record<string, unknown> {
  return {
    "@type": "Blog",
    "@id": `${SITE_URL}/blog#blog`,
    name: "Speak From Purpose",
    description:
      "Scripture-grounded writing on self-worth, courage and finding your voice, from Nancy Marie Dixon.",
    url: absoluteUrl("/blog"),
    publisher: { "@id": ORG_ID },
    author: { "@id": PERSON_ID },
    blogPost: ARTICLE_SEO.map(article => ({
      "@type": "BlogPosting",
      "@id": `${absoluteUrl(`/blog/${article.slug}`)}#article`,
      headline: article.title,
      url: absoluteUrl(`/blog/${article.slug}`),
    })),
  };
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/** Wraps graph nodes in the single @context envelope Google prefers. */
function graph(nodes: Record<string, unknown>[]): Record<string, unknown>[] {
  return [{ "@context": "https://schema.org", "@graph": nodes }];
}

/**
 * Resolves any path -- static route or /blog/<slug> -- into head metadata.
 * Unknown paths resolve to the noindex 404 entry.
 */
export function resolvePageSeo(path: string): ResolvedSeo {
  const clean = normalisePath(path);
  const slug = matchArticlePath(clean);

  if (slug) {
    return resolveArticleSeo(slug);
  }

  const route = getRouteSeo(clean);

  // Unknown path: a real 404. Never let it self-canonicalise.
  if (!route) {
    return {
      title: "Page Not Found | Purely Divine Coaching",
      description: "That page could not be found.",
      canonical: "",
      noindex: true,
      ogType: "website",
      ogImage: DEFAULT_OG_IMAGE,
      jsonLd: [],
    };
  }

  return {
    title: route.title,
    description: route.description,
    // A noindex page still gets a canonical only when it points somewhere real.
    canonical: route.path === "/blog/archive" ? absoluteUrl("/blog") : absoluteUrl(route.path),
    noindex: Boolean(route.noindex),
    ogType: "website",
    ogImage: DEFAULT_OG_IMAGE,
    jsonLd: route.noindex ? [] : graph(jsonLdForRoute(route.path)),
  };
}

function jsonLdForRoute(path: string): Record<string, unknown>[] {
  const base = [organizationLd(), websiteLd()];

  switch (path) {
    case "/":
      return [...base, personLd()];
    case "/about":
      return [
        ...base,
        personLd(),
        breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]),
      ];
    case "/blog":
      return [
        ...base,
        personLd(),
        blogLd(),
        breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ]),
      ];
    default:
      return [
        ...base,
        breadcrumbLd([
          { name: "Home", path: "/" },
          { name: titleCaseFromPath(path), path },
        ]),
      ];
  }
}

function titleCaseFromPath(path: string): string {
  const segment = path.replace(/^\//, "").split("/").pop() ?? "";
  return segment
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function resolveArticleSeo(slug: string): ResolvedSeo {
  const article = getArticleById(slug);
  const seo = getArticleSeo(slug);

  if (!article) {
    return {
      title: "Page Not Found | Purely Divine Coaching",
      description: "That article could not be found.",
      canonical: "",
      noindex: true,
      ogType: "website",
      ogImage: DEFAULT_OG_IMAGE,
      jsonLd: [],
    };
  }

  const published = article.date.toISOString();
  const faq = faqLd(article.id, absoluteUrl(`/blog/${article.id}`));
  const articleFaq = faq ? [faq] : [];

  return {
    // Falls back to the on-page headline if no search-facing title is written yet.
    title: seo ? `${seo.title} | ${SITE_NAME}` : `${article.title} | ${SITE_NAME}`,
    description: seo?.description ?? article.excerpt,
    canonical: absoluteUrl(`/blog/${article.id}`),
    noindex: false,
    ogType: "article",
    ogImage: DEFAULT_OG_IMAGE,
    article: {
      publishedTime: published,
      modifiedTime: published,
      author: article.author,
      section: article.category,
    },
    jsonLd: graph([
      organizationLd(),
      websiteLd(),
      personLd(),
      blogPostingLd(article),
      ...articleFaq,
      breadcrumbLd([
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blog" },
        { name: article.title, path: `/blog/${article.id}` },
      ]),
    ]),
  };
}

export { DEFAULT_TITLE, DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL };
