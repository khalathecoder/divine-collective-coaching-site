import { describe, it, expect } from "vitest";
import { allArticles } from "./blogArticles";
import { ARTICLE_ENRICHMENT, getArticleEnrichment } from "./blogEnrichment";
import { ROUTE_SEO } from "./seo";
import { resolvePageSeo } from "./seoMeta";

describe("article enrichment", () => {
  it("only enriches articles that exist", () => {
    const ids = new Set(allArticles.map(article => article.id));
    for (const entry of ARTICLE_ENRICHMENT) {
      expect(ids.has(entry.slug), `no article named ${entry.slug}`).toBe(true);
    }
  });

  it("covers every article", () => {
    for (const article of allArticles) {
      expect(getArticleEnrichment(article.id), `nothing for ${article.id}`).toBeDefined();
    }
  });

  it("asks questions rather than making statements", () => {
    for (const entry of ARTICLE_ENRICHMENT) {
      for (const faq of entry.faq ?? []) {
        expect(faq.question.endsWith("?"), `not a question: ${faq.question}`).toBe(true);
        // Too short an answer wins nothing; too long is not a snippet.
        expect(faq.answer.length, `answer too short: ${faq.question}`).toBeGreaterThan(80);
      }
    }
  });

  it("does not repeat a question within one article", () => {
    for (const entry of ARTICLE_ENRICHMENT) {
      const questions = (entry.faq ?? []).map(faq => faq.question.toLowerCase());
      expect(new Set(questions).size, `duplicate question in ${entry.slug}`).toBe(
        questions.length
      );
    }
  });

  it("cites a reference and a translation for every verse", () => {
    for (const entry of ARTICLE_ENRICHMENT) {
      for (const verse of entry.scripture ?? []) {
        expect(verse.reference).toMatch(/^[1-3]?\s?[A-Z][a-z]+\s\d+:\d+/);
        expect(verse.translation.length).toBeGreaterThan(1);
        expect(verse.text.length).toBeGreaterThan(20);
      }
    }
  });

  it("links only to routes that exist", () => {
    const paths = new Set(ROUTE_SEO.map(route => route.path));
    for (const entry of ARTICLE_ENRICHMENT) {
      for (const resource of entry.resources ?? []) {
        expect(paths.has(resource.href), `dead link: ${resource.href}`).toBe(true);
      }
    }
  });

  it("gives every article at least one internal link, which none had before", () => {
    for (const article of allArticles) {
      const resources = getArticleEnrichment(article.id)?.resources ?? [];
      expect(resources.length, `no internal links on ${article.id}`).toBeGreaterThan(0);
    }
  });

  it("publishes the questions as FAQPage structured data", () => {
    const seo = resolvePageSeo("/blog/you-are-worthy");
    const graph = seo.jsonLd[0]["@graph"] as Record<string, unknown>[];
    const faqNode = graph.find(node => node["@type"] === "FAQPage");
    expect(faqNode).toBeDefined();
    const entities = faqNode?.mainEntity as Record<string, unknown>[];
    expect(entities.length).toBeGreaterThan(0);
    expect(entities[0]["@type"]).toBe("Question");
  });

  it("puts the target search phrase into the added copy", () => {
    // The measured gap: no post contained its own target keyword anywhere.
    const checks: [string, string][] = [
      ["you-are-worthy", "what the bible says about self-worth"],
      ["self-worth-vs-confidence", "difference between self-esteem and self-worth"],
      ["appointed-not-nominated", "what does jeremiah 1:5 mean"],
      ["cost-of-silence", "what does proverbs 18:21 mean"],
    ];

    for (const [slug, phrase] of checks) {
      const entry = getArticleEnrichment(slug)!;
      const text = [
        entry.scriptureHeading ?? "",
        ...(entry.faq ?? []).map(faq => `${faq.question} ${faq.answer}`),
      ]
        .join(" ")
        .toLowerCase();
      expect(text, `${slug} never says "${phrase}"`).toContain(phrase);
    }
  });
});
