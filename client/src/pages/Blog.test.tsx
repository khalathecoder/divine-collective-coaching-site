import { describe, it, expect } from "vitest";
import { currentArticles, pastArticles } from "@/content/blogArticles";

describe("Blog Articles Data", () => {
  it("should have current articles", () => {
    expect(currentArticles.length).toBeGreaterThan(0);
  });

  it("should have past articles", () => {
    expect(pastArticles.length).toBeGreaterThan(0);
  });

  it("should have required article properties", () => {
    const allArticles = [...currentArticles, ...pastArticles];
    allArticles.forEach((article) => {
      expect(article.id).toBeDefined();
      expect(article.title).toBeDefined();
      expect(article.excerpt).toBeDefined();
      expect(article.content).toBeDefined();
      expect(article.date).toBeDefined();
      expect(article.author).toBeDefined();
    });
  });

  it("current articles should be sorted by date (newest first)", () => {
    for (let i = 0; i < currentArticles.length - 1; i++) {
      expect(currentArticles[i].date.getTime()).toBeGreaterThanOrEqual(
        currentArticles[i + 1].date.getTime()
      );
    }
  });

  it("should have unique article IDs", () => {
    const allArticles = [...currentArticles, ...pastArticles];
    const ids = allArticles.map((a) => a.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("article content should be substantial", () => {
    const allArticles = [...currentArticles, ...pastArticles];
    allArticles.forEach((article) => {
      expect(article.content.length).toBeGreaterThan(100);
      expect(article.excerpt.length).toBeGreaterThan(20);
    });
  });

  it("should have valid dates", () => {
    const allArticles = [...currentArticles, ...pastArticles];
    allArticles.forEach((article) => {
      expect(article.date).toBeInstanceOf(Date);
      expect(article.date.getTime()).toBeGreaterThan(0);
    });
  });

  it("current articles should have author Nancy Marie Dixon", () => {
    currentArticles.forEach((article) => {
      expect(article.author).toBe("Nancy Marie Dixon");
    });
  });
});
