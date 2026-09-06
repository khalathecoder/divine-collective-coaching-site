/**
 * Single source of truth for every SEO surface on the site.
 *
 * Consumed by three places, which must never disagree:
 *   1. server/_core/seo.ts - injects real <title>/<meta> into the HTML shell so
 *      crawlers that do not run JavaScript still see them.
 *   2. client/src/components/Seo.tsx - keeps the tags correct after client-side
 *      navigation, using React 19 native metadata hoisting.
 *   3. The generated /sitemap.xml and /robots.txt.
 *
 * Editing the copy below changes what Google displays in search results.
 * Nothing in this file is visible on the page itself.
 */

export const SITE_URL = "https://dicollectivellc.com";
export const SITE_NAME = "Purely Divine Coaching";
export const LEGAL_NAME = "Divine Collective LLC";
export const AUTHOR_NAME = "Nancy Marie Dixon";
export const AUTHOR_TITLE = "Certified Christian Life Coach";
export const CONTACT_EMAIL = "info@dicollectivellc.com";
export const BOOKING_URL =
  "https://link.kopsystem.com/widget/bookings/nancy-dixon-personal-calendar-0svswpnv8";

/** Used by LocalBusiness schema. Matches the address in the privacy policy. */
export const BUSINESS_ADDRESS = {
  streetAddress: "3765 Grosvenor Rd",
  addressLocality: "South Euclid",
  addressRegion: "OH",
  postalCode: "44118",
  addressCountry: "US",
} as const;

export const SERVICE_AREAS = [
  "South Euclid, Ohio",
  "Cleveland Heights, Ohio",
  "Cleveland, Ohio",
  "United States",
] as const;

/** Default social preview image. Swap for a branded 1200x630 asset when one exists. */
export const DEFAULT_OG_IMAGE =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663579583960/EZFePBM4Ud2fpCqaQdntax/blog-hero-banner-Ey7oUkdmgmokGmsTBrTqrk.webp";

export const DEFAULT_TITLE = "Christian Life Coach for Women | Purely Divine Coaching";
export const DEFAULT_DESCRIPTION =
  "Faith-rooted coaching for women reclaiming their voice and self-worth. Work with Nancy Marie Dixon, certified Christian life coach. Book a free discovery call.";

export type ChangeFreq = "daily" | "weekly" | "monthly" | "yearly";

export interface RouteSeo {
  /** Route path exactly as registered in App.tsx. */
  path: string;
  /** <title>. Keyword first, brand second. Aim for 60 characters or fewer. */
  title: string;
  /** <meta name="description">. Aim for 140-158 characters. */
  description: string;
  /** true = keep out of the index (admin, duplicates, thin utility pages). */
  noindex?: boolean;
  priority?: number;
  changefreq?: ChangeFreq;
}

/**
 * Every route the app registers. Anything not marked noindex goes in the sitemap.
 * Must stay in sync with the <Route> table in client/src/App.tsx -- seo.test.ts
 * enforces that.
 */
export const ROUTE_SEO: RouteSeo[] = [
  {
    path: "/",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    priority: 1.0,
    changefreq: "weekly",
  },
  {
    path: "/about",
    title: "Nancy Marie Dixon — Certified Christian Life Coach",
    description:
      "Meet Nancy Marie Dixon, certified Christian life coach and founder of Divine Collective LLC, helping women build self-worth and speak with confidence.",
    priority: 0.9,
    changefreq: "monthly",
  },
  {
    path: "/programs",
    title: "Christian Life Coaching Programs for Women",
    description:
      "One-to-one and group coaching for women: Crowned & Called, V.O.I.C.E. Activated, and the Faith & Courage Intensive. Find the program for your season.",
    priority: 0.9,
    changefreq: "monthly",
  },
  {
    path: "/coaching",
    title: "Faith-Based Coaching for Women | Purely Divine",
    description:
      "Faith-based coaching that starts with self-worth, not strategy. See how Nancy's approach helps women move from hesitation to bold, aligned action.",
    priority: 0.9,
    changefreq: "monthly",
  },
  {
    path: "/shop",
    title: "Self-Worth Guides & Assessments for Christian Women",
    description:
      "Books, guides and assessments on self-worth, mindset and voice, including the Divine Mindset Guide and Research Companion. Instant digital delivery.",
    priority: 0.8,
    changefreq: "weekly",
  },
  {
    path: "/blog",
    title: "Faith, Voice & Self-Worth | Purely Divine Coaching",
    description:
      "Scripture-grounded writing on self-worth, courage and finding your voice, from certified Christian life coach Nancy Marie Dixon.",
    priority: 0.9,
    changefreq: "weekly",
  },
  {
    path: "/events",
    title: "Women's Faith & Confidence Workshops and Circles",
    description:
      "Upcoming workshops, coaching circles and voice activation experiences for Christian women. See the schedule and reserve your place.",
    priority: 0.7,
    changefreq: "weekly",
  },
  {
    path: "/voice-quiz",
    title: "Free Voice Activation Quiz for Christian Women",
    description:
      "Discover your voice archetype in five minutes and get personalised insight into what is keeping you quiet. Free, no account needed.",
    priority: 0.8,
    changefreq: "monthly",
  },
  {
    path: "/divine-mindset-assessment",
    title: "Free Divine Mindset Assessment | Purely Divine",
    description:
      "Assess your mindset patterns and receive a personalised roadmap for building self-worth from a biblical foundation. Free assessment, instant results.",
    priority: 0.8,
    changefreq: "monthly",
  },
  {
    path: "/contact",
    title: "Book a Discovery Call | Christian Life Coach, Cleveland",
    description:
      "Book a free discovery call with Nancy Marie Dixon, certified Christian life coach serving Cleveland Heights, South Euclid and clients nationwide online.",
    priority: 0.8,
    changefreq: "monthly",
  },
  {
    path: "/privacy",
    title: "Privacy Policy | Purely Divine Coaching",
    description:
      "How Divine Collective LLC collects, uses and protects the personal information you share with Purely Divine Coaching.",
    priority: 0.2,
    changefreq: "yearly",
  },

  // --- Deliberately kept out of the index ------------------------------------
  {
    // Republishes the same five articles as /blog. Canonicalised to /blog so the
    // two URLs never compete; individual articles now live at /blog/<slug>.
    path: "/blog/archive",
    title: "Article Archive | Purely Divine Coaching",
    description:
      "Earlier articles from Nancy Marie Dixon on self-worth, courage and finding your voice.",
    noindex: true,
  },
  {
    path: "/bold-out-intake",
    title: "B.O.L.D. OUT Intake | Purely Divine Coaching",
    description: "Private intake survey for B.O.L.D. OUT participants.",
    noindex: true,
  },
  {
    path: "/orders",
    title: "Your Orders | Purely Divine Coaching",
    description: "Access your Purely Divine Coaching purchases and digital downloads.",
    noindex: true,
  },
  {
    path: "/survey",
    title: "Post-Purchase Survey | Purely Divine Coaching",
    description: "Share feedback on your Purely Divine Coaching purchase.",
    noindex: true,
  },
  {
    path: "/login",
    title: "Sign In | Purely Divine Coaching",
    description: "Sign in to your Purely Divine Coaching account.",
    noindex: true,
  },
  {
    path: "/admin",
    title: "Admin | Purely Divine Coaching",
    description: "Administrative area.",
    noindex: true,
  },
  {
    path: "/admin/submissions",
    title: "Admin Submissions | Purely Divine Coaching",
    description: "Administrative area.",
    noindex: true,
  },
  {
    path: "/404",
    title: "Page Not Found | Purely Divine Coaching",
    description: "That page could not be found.",
    noindex: true,
  },
];

/**
 * Search-facing copy for each blog article.
 *
 * `title` is the <title> tag only -- written around the term people actually
 * type into Google. The headline a reader sees on the page is unchanged and
 * still comes from client/src/content/blogArticles.ts.
 *
 * `slug` must match the article `id` in blogArticles.ts; seo.test.ts enforces it.
 */
export interface ArticleSeo {
  slug: string;
  title: string;
  description: string;
  /** Primary term this article is written to rank for. Documentation, not markup. */
  targetKeyword: string;
}

export const ARTICLE_SEO: ArticleSeo[] = [
  {
    slug: "self-worth-vs-confidence",
    title: "Self-Esteem vs Self-Worth: The Difference That Matters",
    description:
      "Self-confidence is built on what you do. Self-worth was established by God before you did anything. Nancy Marie Dixon on the gap between them.",
    targetKeyword: "self esteem vs self worth",
  },
  {
    slug: "appointed-not-nominated",
    title: "Jeremiah 1:5 Meaning: Appointed Before You Were Formed",
    description:
      "What Jeremiah 1:5 says about being known, set apart and appointed before birth, and what it means for the voice you have been afraid to use.",
    targetKeyword: "jeremiah 1:5 meaning",
  },
  {
    slug: "cost-of-silence",
    title: "Proverbs 18:21 Meaning: The Real Cost of Staying Silent",
    description:
      "Death and life are in the power of the tongue. What silence costs a called woman, why your quiet season was preparation, and how to speak now.",
    targetKeyword: "proverbs 18:21 meaning",
  },
  {
    slug: "voice-youve-been-waiting-for",
    title: "How to Find Your Voice as a Christian Woman",
    description:
      "You do not need a platform or permission to start speaking. A faith-rooted look at how to find your voice, and the one step that begins it.",
    targetKeyword: "how to find your voice",
  },
  {
    slug: "you-are-worthy",
    title: "What the Bible Says About Self-Worth",
    description:
      "Scripture on self-worth, and why your value was never based on how you were treated. Nancy Marie Dixon on breaking the lie of unworthiness.",
    targetKeyword: "what the bible says about self worth",
  },
  {
    slug: "fear-has-a-name",
    title: "2 Timothy 1:7: The Four Fears That Silence You",
    description:
      "Rejection, failure, judgment, the unknown. Name the four fears that steal a woman's voice, with the scripture and the habit that answers each one.",
    targetKeyword: "bible verses about fear",
  },
  {
    slug: "finding-your-voice-framework",
    title: "The V.O.I.C.E. Framework: 5 Steps to Find Your Purpose",
    description:
      "Vision, Opportunity, Inspiration, Commitment, Elevation. The five-part framework from Nancy Marie Dixon's book, and how to use it to find purpose.",
    targetKeyword: "how to find your purpose",
  },
  {
    slug: "permission-to-lead",
    title: "You Don't Need Permission to Lead as a Christian Woman",
    description:
      "The permission you are waiting for is not coming from anyone else. On claiming leadership without a title, a platform, or anyone's approval.",
    targetKeyword: "christian women leadership",
  },
  {
    slug: "silence-costs",
    title: "What Your Silence Is Costing You",
    description:
      "Silence feels like protection. It is one of the most expensive choices a woman can make. What you pay for staying quiet, and what speaking returns.",
    targetKeyword: "cost of staying silent",
  },
];

// --- Lookup helpers ---------------------------------------------------------

const ROUTE_INDEX = new Map(ROUTE_SEO.map(route => [route.path, route]));
const ARTICLE_INDEX = new Map(ARTICLE_SEO.map(article => [article.slug, article]));

/** Strips query strings, hashes and trailing slashes so lookups are stable. */
export function normalisePath(path: string): string {
  const withoutQuery = path.split("?")[0].split("#")[0];
  if (withoutQuery === "/" || withoutQuery === "") return "/";
  return withoutQuery.replace(/\/+$/, "") || "/";
}

export function getRouteSeo(path: string): RouteSeo | undefined {
  return ROUTE_INDEX.get(normalisePath(path));
}

export function getArticleSeo(slug: string): ArticleSeo | undefined {
  return ARTICLE_INDEX.get(slug);
}

export function absoluteUrl(path: string): string {
  const clean = normalisePath(path);
  return clean === "/" ? `${SITE_URL}/` : `${SITE_URL}${clean}`;
}

export function articlePath(slug: string): string {
  return `/blog/${slug}`;
}

/** Everything that belongs in sitemap.xml: indexable routes plus every article. */
export function sitemapPaths(): string[] {
  const routes = ROUTE_SEO.filter(route => !route.noindex).map(route => route.path);
  return [...routes, ...ARTICLE_SEO.map(article => articlePath(article.slug))];
}
