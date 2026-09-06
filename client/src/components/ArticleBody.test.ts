import { describe, it, expect } from "vitest";
import { parseArticleContent } from "./ArticleBody";
import { allArticles } from "@shared/blogArticles";

describe("parseArticleContent", () => {
  it("turns a fully wrapped line into a heading", () => {
    const blocks = parseArticleContent("**Two Different Foundations**");
    expect(blocks).toEqual([{ kind: "heading", text: "Two Different Foundations" }]);
  });

  it("does not mistake a line that merely starts with bold for a heading", () => {
    // "**Vision** is about seeing yourself differently" is a paragraph.
    const blocks = parseArticleContent("**Vision** is about seeing yourself differently.");
    expect(blocks[0].kind).toBe("paragraph");
  });

  it("groups consecutive dashes into one list", () => {
    const blocks = parseArticleContent("- first\n- second\n- third");
    expect(blocks).toHaveLength(1);
    expect(blocks[0]).toEqual({
      kind: "list",
      items: ["first", "second", "third"],
    });
  });

  it("separates paragraphs on blank lines and joins wrapped lines", () => {
    const blocks = parseArticleContent("one\ntwo\n\nthree");
    expect(blocks).toEqual([
      { kind: "paragraph", text: "one two" },
      { kind: "paragraph", text: "three" },
    ]);
  });

  it("handles a heading directly followed by a list, as the articles do", () => {
    const blocks = parseArticleContent("**Ask Yourself This**\n- one\n- two");
    expect(blocks.map(block => block.kind)).toEqual(["heading", "list"]);
  });

  it("trims indented lines rather than treating them as separate blocks", () => {
    const blocks = parseArticleContent("    Which of the five resonates most?");
    expect(blocks).toEqual([
      { kind: "paragraph", text: "Which of the five resonates most?" },
    ]);
  });

  it("leaves no stray asterisks in any rendered text", () => {
    // The original bug: content went into a pre-wrap div, so readers saw
    // literal ** around every section heading.
    for (const article of allArticles) {
      for (const block of parseArticleContent(article.content)) {
        if (block.kind === "heading") {
          expect(block.text, `heading in ${article.id}`).not.toContain("**");
        }
      }
    }
  });

  it("gives every real article at least one heading to structure it", () => {
    const withHeadings = allArticles.filter(article =>
      parseArticleContent(article.content).some(block => block.kind === "heading")
    );
    // Two of the shorter posts are single-section pieces with no subheads.
    expect(withHeadings.length).toBeGreaterThanOrEqual(allArticles.length - 3);
  });

  it("preserves every word of the original content", () => {
    for (const article of allArticles) {
      const rendered = parseArticleContent(article.content)
        .flatMap(block =>
          block.kind === "list"
            ? block.items
            : [block.kind === "heading" ? block.text : block.text]
        )
        .join(" ")
        .replace(/\*\*/g, "");

      const original = article.content.replace(/\*\*/g, "").replace(/^- /gm, "");

      const normalise = (text: string) => text.split(/\s+/).filter(Boolean).join(" ");
      expect(normalise(rendered), `content changed in ${article.id}`).toBe(
        normalise(original)
      );
    }
  });
});
