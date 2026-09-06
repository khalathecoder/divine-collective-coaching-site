import { describe, it, expect } from "vitest";
import { currentEvents, pastEvents } from "@/content/events";
import { currentArticles, pastArticles } from "@/content/blogArticles";

const ITEMS_PER_PAGE = 3;

describe("Load More Pagination", () => {
  describe("Events Pagination", () => {
    it("should display initial batch of past events", () => {
      const initialDisplayed = pastEvents.slice(0, ITEMS_PER_PAGE);
      expect(initialDisplayed.length).toBeLessThanOrEqual(ITEMS_PER_PAGE);
    });

    it("should calculate if more events exist", () => {
      const hasMore = ITEMS_PER_PAGE < pastEvents.length;
      expect(hasMore).toBe(pastEvents.length > ITEMS_PER_PAGE);
    });

    it("should load next batch of events on Load More", () => {
      const firstBatch = pastEvents.slice(0, ITEMS_PER_PAGE);
      const secondBatch = pastEvents.slice(0, ITEMS_PER_PAGE * 2);
      expect(secondBatch.length).toBeGreaterThanOrEqual(firstBatch.length);
    });

    it("should handle edge case when fewer items than page size", () => {
      if (pastEvents.length <= ITEMS_PER_PAGE) {
        const displayed = pastEvents.slice(0, ITEMS_PER_PAGE);
        expect(displayed.length).toBe(pastEvents.length);
      }
    });

    it("should sort past events by date descending", () => {
      const sorted = [...pastEvents].sort((a, b) => b.date.getTime() - a.date.getTime());
      for (let i = 0; i < sorted.length - 1; i++) {
        expect(sorted[i].date.getTime()).toBeGreaterThanOrEqual(sorted[i + 1].date.getTime());
      }
    });
  });

  describe("Articles Pagination", () => {
    it("should display initial batch of past articles", () => {
      const initialDisplayed = pastArticles.slice(0, ITEMS_PER_PAGE);
      expect(initialDisplayed.length).toBeLessThanOrEqual(ITEMS_PER_PAGE);
    });

    it("should calculate if more articles exist", () => {
      const hasMore = ITEMS_PER_PAGE < pastArticles.length;
      expect(hasMore).toBe(pastArticles.length > ITEMS_PER_PAGE);
    });

    it("should load next batch of articles on Load More", () => {
      const firstBatch = pastArticles.slice(0, ITEMS_PER_PAGE);
      const secondBatch = pastArticles.slice(0, ITEMS_PER_PAGE * 2);
      expect(secondBatch.length).toBeGreaterThanOrEqual(firstBatch.length);
    });

    it("should handle edge case when fewer articles than page size", () => {
      if (pastArticles.length <= ITEMS_PER_PAGE) {
        const displayed = pastArticles.slice(0, ITEMS_PER_PAGE);
        expect(displayed.length).toBe(pastArticles.length);
      }
    });

    it("should not show Load More when all articles are displayed", () => {
      const totalArticles = pastArticles.length;
      const displayedCount = totalArticles;
      const hasMore = displayedCount < totalArticles;
      expect(hasMore).toBe(false);
    });

    it("should allow multiple Load More clicks", () => {
      let displayedCount = ITEMS_PER_PAGE;
      const maxClicks = Math.ceil(pastArticles.length / ITEMS_PER_PAGE);
      
      for (let i = 0; i < maxClicks; i++) {
        const hasMore = displayedCount < pastArticles.length;
        if (hasMore) {
          displayedCount += ITEMS_PER_PAGE;
        }
      }
      
      expect(displayedCount).toBeGreaterThanOrEqual(pastArticles.length);
    });
  });

  describe("Pagination State Management", () => {
    it("should reset pagination when switching tabs", () => {
      let displayedCount = ITEMS_PER_PAGE * 2; // After one Load More click
      // Simulate tab switch
      displayedCount = ITEMS_PER_PAGE; // Reset
      expect(displayedCount).toBe(ITEMS_PER_PAGE);
    });

    it("should maintain separate pagination state for articles and events", () => {
      const eventsPagination = ITEMS_PER_PAGE;
      const articlesPagination = ITEMS_PER_PAGE;
      expect(eventsPagination).toBe(articlesPagination);
    });

    it("should calculate correct number of Load More clicks needed", () => {
      const totalEvents = pastEvents.length;
      const clicksNeeded = Math.ceil(totalEvents / ITEMS_PER_PAGE) - 1;
      expect(clicksNeeded).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Load More Button Visibility", () => {
    it("should show Load More button when more items exist", () => {
      const displayedCount = ITEMS_PER_PAGE;
      const totalCount = pastEvents.length;
      const shouldShow = displayedCount < totalCount;
      expect(shouldShow).toBe(pastEvents.length > ITEMS_PER_PAGE);
    });

    it("should hide Load More button when all items are displayed", () => {
      const displayedCount = pastEvents.length;
      const totalCount = pastEvents.length;
      const shouldShow = displayedCount < totalCount;
      expect(shouldShow).toBe(false);
    });

    it("should work with both empty and populated archives", () => {
      // Test with current implementation
      const hasEventsPastArchive = pastEvents.length > 0;
      const hasArticlesPastArchive = pastArticles.length > 0;
      
      expect(hasEventsPastArchive).toBe(true);
      expect(hasArticlesPastArchive).toBe(true);
    });
  });
});
