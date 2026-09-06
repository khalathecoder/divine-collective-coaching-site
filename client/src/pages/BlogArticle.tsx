/*
Design reminder for this file:
A single article, presented as a letter from Nancy. Sacred editorial luxury:
generous whitespace, calm hierarchy, restrained purple-and-gold accents.
Matches the typography and shell of the main blog page.
*/

/**
 * One indexable URL per article: /blog/<id>.
 *
 * Before this page existed, all nine articles lived behind tab and button state
 * on /blog. They shared one URL, so no article could be linked to, shared, or
 * ranked on its own -- the entire blog was a single page to Google.
 */

import BrandShell from "@/components/BrandShell";
import ArticleBody from "@/components/ArticleBody";
import ArticleEnrichment from "@/components/ArticleEnrichment";
import NotFound from "@/pages/NotFound";
import { allArticles, getArticleById } from "@/content/blogArticles";
import { brand } from "@/content/siteContent";
import { Link, useRoute } from "wouter";
import ShareRow from "@/components/ShareRow";
import { ArrowLeft, ArrowRight } from "lucide-react";

const authorImageUrl =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663579583960/EZFePBM4Ud2fpCqaQdntax/blog-hero-profile-transparent-76aN8Xxo9HUeNaaMywn875.webp";

const WORDS_PER_MINUTE = 220;

function readingTimeMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogArticle() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug;
  const article = slug ? getArticleById(slug) : undefined;

  // An unknown slug renders the 404 page. The server has already sent a 404
  // status for this URL, so the two agree.
  if (!article) {
    return <NotFound />;
  }

  const index = allArticles.findIndex(item => item.id === article.id);
  const previous = index > 0 ? allArticles[index - 1] : undefined;
  const next = index < allArticles.length - 1 ? allArticles[index + 1] : undefined;

  // Prefer articles in the same category, then fall back to recency, so the
  // related links stay topically close where possible.
  const related = allArticles
    .filter(item => item.id !== article.id)
    .sort((a, b) => {
      const aMatch = a.category === article.category ? 0 : 1;
      const bMatch = b.category === article.category ? 0 : 1;
      if (aMatch !== bMatch) return aMatch - bMatch;
      return b.date.getTime() - a.date.getTime();
    })
    .slice(0, 3);

  const canonicalUrl = `${brand.primaryUrl}/blog/${article.id}`;

  return (
    <BrandShell currentPath="/blog">
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-4 py-12 md:py-20">
          {/* Breadcrumb: gives Google a crawlable path and the reader a way back. */}
          <nav aria-label="Breadcrumb" className="mb-10">
            <ol className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <li>
                <Link href="/" className="transition hover:text-brand-gold">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/blog" className="transition hover:text-brand-gold">
                  Blog
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-brand-gold" aria-current="page">
                {article.category ?? "Article"}
              </li>
            </ol>
          </nav>

          <article>
            <header className="mb-10">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                {article.category && (
                  <span className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
                    {article.category}
                  </span>
                )}
                <time
                  dateTime={new Date(article.date).toISOString()}
                  className="text-xs text-muted-foreground"
                >
                  {formatDate(article.date)}
                </time>
                <span className="text-xs text-muted-foreground">
                  {readingTimeMinutes(article.content)} min read
                </span>
              </div>

              <h1 className="mb-5 font-display text-3xl leading-tight text-foreground md:text-5xl">
                {article.title}
              </h1>

              <p className="text-xl italic leading-relaxed text-muted-foreground">
                {article.excerpt}
              </p>

              {/* Visible byline. Named authorship with a face is the E-E-A-T
                  signal Google looks for in a life-advice niche, and it matches
                  the Person schema in the head. */}
              <div className="mt-8 flex items-center gap-3">
                <img
                  src={authorImageUrl}
                  alt={article.author}
                  className="h-11 w-11 rounded-full object-cover"
                  width={44}
                  height={44}
                />
                <p className="text-sm text-muted-foreground">
                  By{" "}
                  <Link
                    href="/about"
                    rel="author"
                    className="font-semibold text-foreground transition hover:text-brand-gold"
                  >
                    {article.author}
                  </Link>
                </p>
              </div>
            </header>

            <ArticleBody content={article.content} />

            {/* Proposed additions (scripture, FAQ, internal links). See
                shared/blogEnrichment.ts -- pending Nancy's approval. */}
            <ArticleEnrichment slug={article.id} />

            {/* Author block: a visible, on-page E-E-A-T signal that matches the
                Person schema in the head. */}
            <div className="mt-14 border-t border-border pt-8">
              <div className="flex items-center gap-4">
                <img
                  src={authorImageUrl}
                  alt={`${article.author}, founder of Divine Collective LLC`}
                  className="h-16 w-16 rounded-full object-cover"
                  loading="lazy"
                  width={64}
                  height={64}
                />
                <div>
                  <p className="font-semibold text-foreground">
                    <Link href="/about" className="transition hover:text-brand-gold">
                      {article.author}
                    </Link>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Founder of Divine Collective LLC | Author | Coach | Speaker
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 border-t border-border pt-8">
              <ShareRow url={canonicalUrl} title={article.title} excerpt={article.excerpt} />
            </div>
          </article>

          {/* Previous / next: keeps every article at most one click from another,
              so none of them sit as orphans in the crawl. */}
          {(previous || next) && (
            <nav
              aria-label="More articles"
              className="mt-12 grid gap-4 border-t border-border pt-8 sm:grid-cols-2"
            >
              {previous ? (
                <Link
                  href={`/blog/${previous.id}`}
                  className="group rounded-lg bg-card p-5 transition hover:bg-card/80"
                >
                  <span className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-brand-gold">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Newer
                  </span>
                  <span className="block text-sm font-semibold leading-snug text-foreground">
                    {previous.title}
                  </span>
                </Link>
              ) : (
                <span />
              )}

              {next && (
                <Link
                  href={`/blog/${next.id}`}
                  className="group rounded-lg bg-card p-5 text-right transition hover:bg-card/80 sm:col-start-2"
                >
                  <span className="mb-2 flex items-center justify-end gap-2 text-xs uppercase tracking-[0.2em] text-brand-gold">
                    Older
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                  <span className="block text-sm font-semibold leading-snug text-foreground">
                    {next.title}
                  </span>
                </Link>
              )}
            </nav>
          )}

          {related.length > 0 && (
            <section className="mt-16 border-t border-border pt-10">
              <h2 className="mb-6 font-display text-2xl text-foreground">Keep reading</h2>
              <div className="grid gap-5 sm:grid-cols-3">
                {related.map(item => (
                  <Link
                    key={item.id}
                    href={`/blog/${item.id}`}
                    className="block rounded-lg bg-card p-5 transition hover:bg-card/80"
                  >
                    {item.category && (
                      <span className="mb-2 block text-[0.65rem] font-semibold uppercase tracking-wide text-brand-gold">
                        {item.category}
                      </span>
                    )}
                    <span className="block text-sm font-semibold leading-snug text-foreground">
                      {item.title}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-brand-gold transition hover:text-brand-gold/80"
            >
              <ArrowLeft className="h-4 w-4" />
              All articles
            </Link>
          </div>
        </div>
      </div>
    </BrandShell>
  );
}
