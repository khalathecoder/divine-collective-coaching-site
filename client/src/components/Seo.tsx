/**
 * Keeps document metadata correct across client-side navigation.
 *
 * The Express server already injects the right tags for whichever URL was first
 * requested (see server/_core/seo.ts), which is what crawlers read. Once the SPA
 * takes over, wouter changes the URL without a page load, so those tags would go
 * stale. This component rewrites them on every route change.
 *
 * It edits document.head imperatively rather than rendering <title>/<meta> as
 * JSX. React 19 would hoist rendered tags into <head>, but it cannot dedupe
 * against the ones the server already put there, so the page would end up with
 * two titles and two canonicals. Upserting by selector guarantees exactly one.
 */

import { useEffect } from "react";
import { useLocation } from "wouter";
import { resolvePageSeo } from "@shared/seoMeta";

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`;
  let tag = document.head.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function upsertLink(rel: string, href: string | null) {
  const selector = `link[rel="${rel}"]`;
  const existing = document.head.querySelector<HTMLLinkElement>(selector);

  if (href === null) {
    existing?.remove();
    return;
  }

  const tag = existing ?? document.createElement("link");
  tag.setAttribute("rel", rel);
  tag.setAttribute("href", href);
  if (!existing) document.head.appendChild(tag);
}

function removeMeta(attr: "name" | "property", key: string) {
  document.head.querySelector(`meta[${attr}="${key}"]`)?.remove();
}

function replaceJsonLd(blocks: Record<string, unknown>[]) {
  document.head
    .querySelectorAll('script[type="application/ld+json"]')
    .forEach(node => node.remove());

  for (const block of blocks) {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(block);
    document.head.appendChild(script);
  }
}

export default function Seo() {
  const [location] = useLocation();

  useEffect(() => {
    const seo = resolvePageSeo(location);

    document.title = seo.title;

    upsertMeta("name", "description", seo.description);
    upsertMeta(
      "name",
      "robots",
      seo.noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large"
    );

    // An unmatched URL must not claim to be its own canonical.
    upsertLink("canonical", seo.canonical || null);

    upsertMeta("property", "og:type", seo.ogType);
    upsertMeta("property", "og:site_name", "Purely Divine Coaching");
    upsertMeta("property", "og:title", seo.title);
    upsertMeta("property", "og:description", seo.description);
    upsertMeta("property", "og:image", seo.ogImage);
    upsertMeta("property", "og:locale", "en_US");
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", seo.title);
    upsertMeta("name", "twitter:description", seo.description);
    upsertMeta("name", "twitter:image", seo.ogImage);

    if (seo.canonical) {
      upsertMeta("property", "og:url", seo.canonical);
    } else {
      removeMeta("property", "og:url");
    }

    if (seo.article) {
      upsertMeta("property", "article:published_time", seo.article.publishedTime);
      upsertMeta("property", "article:modified_time", seo.article.modifiedTime);
      upsertMeta("property", "article:author", seo.article.author);
      if (seo.article.section) {
        upsertMeta("property", "article:section", seo.article.section);
      } else {
        removeMeta("property", "article:section");
      }
    } else {
      // Leaving article tags behind after navigating to a non-article page
      // makes a static page look like a post to social scrapers.
      removeMeta("property", "article:published_time");
      removeMeta("property", "article:modified_time");
      removeMeta("property", "article:author");
      removeMeta("property", "article:section");
    }

    replaceJsonLd(seo.jsonLd);
  }, [location]);

  return null;
}
