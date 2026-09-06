/*
Design reminder for this file:
Additions sit below the article and must read as part of it, not as bolted-on
SEO furniture. Scripture is set apart like a pull quote; questions stay quiet
and typographic. Restrained gold, generous spacing, no boxes fighting for
attention.
*/

/**
 * Renders the proposed additions in shared/blogEnrichment.ts beneath a post.
 *
 * Nancy's own words are rendered above this by <ArticleBody/> and are not
 * touched. If she does not want these sections, delete shared/blogEnrichment.ts
 * and remove this component from BlogArticle.tsx.
 */

import { Link } from "wouter";
import { getArticleEnrichment } from "@shared/blogEnrichment";

export default function ArticleEnrichment({ slug }: { slug: string }) {
  const enrichment = getArticleEnrichment(slug);
  if (!enrichment) return null;

  const { scripture, scriptureHeading, faq, resources } = enrichment;

  return (
    <>
      {scripture && scripture.length > 0 && (
        <section className="mt-14 border-t border-border pt-10">
          <h2 className="mb-6 font-display text-2xl text-foreground md:text-3xl">
            {scriptureHeading ?? "Scripture"}
          </h2>
          <div className="space-y-6">
            {scripture.map(verse => (
              <figure
                key={verse.reference}
                className="border-l-2 border-brand-gold/60 pl-5"
              >
                <blockquote className="font-display text-lg italic leading-relaxed text-foreground md:text-xl">
                  {verse.text}
                </blockquote>
                <figcaption className="mt-2 text-xs uppercase tracking-[0.2em] text-brand-gold">
                  {verse.reference}
                  <span className="ml-2 text-muted-foreground">{verse.translation}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {faq && faq.length > 0 && (
        <section className="mt-14 border-t border-border pt-10">
          <h2 className="mb-6 font-display text-2xl text-foreground md:text-3xl">
            Questions women ask about this
          </h2>
          <div className="space-y-7">
            {faq.map(entry => (
              <div key={entry.question}>
                {/* h3 keeps the heading order legal under the h2 above, and the
                    question wording matches what people type into Google. */}
                <h3 className="mb-2 text-base font-semibold leading-snug text-foreground">
                  {entry.question}
                </h3>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {entry.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {resources && resources.length > 0 && (
        <section className="mt-14 border-t border-border pt-10">
          <h2 className="mb-6 font-display text-2xl text-foreground md:text-3xl">
            Where to go next
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {resources.map(resource => (
              <Link
                key={resource.href}
                href={resource.href}
                className="block rounded-lg bg-card p-5 transition hover:bg-card/80"
              >
                <span className="mb-2 block text-sm font-semibold text-foreground">
                  {resource.label}
                </span>
                <span className="block text-sm leading-relaxed text-muted-foreground">
                  {resource.description}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
