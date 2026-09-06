import { describe, it, expect } from "vitest";
import { currentEvents, pastEvents } from "@/content/events";

describe("Events Data", () => {
  it("should have current events", () => {
    expect(currentEvents.length).toBeGreaterThan(0);
  });

  it("should have past events", () => {
    expect(pastEvents.length).toBeGreaterThan(0);
  });

  it("should sort current events by date (soonest first)", () => {
    const sorted = [...currentEvents].sort((a, b) => a.date.getTime() - b.date.getTime());
    for (let i = 0; i < sorted.length - 1; i++) {
      expect(sorted[i].date.getTime()).toBeLessThanOrEqual(sorted[i + 1].date.getTime());
    }
  });

  it("should have required event properties", () => {
    const allEvents = [...currentEvents, ...pastEvents];
    allEvents.forEach((event) => {
      expect(event.id).toBeDefined();
      expect(event.title).toBeDefined();
      expect(event.description).toBeDefined();
      expect(event.date).toBeDefined();
      expect(event.time).toBeDefined();
      expect(event.location).toBeDefined();
      expect(event.type).toBeDefined();
      expect(["workshop", "coaching", "community", "intensive"]).toContain(event.type);
    });
  });

  it("current events should have registration URLs", () => {
    currentEvents.forEach((event) => {
      expect(event.registrationUrl).toBeDefined();
    });
  });

  it("should format dates correctly", () => {
    const event = currentEvents[0];
    expect(event.date).toBeInstanceOf(Date);
    expect(event.date.getTime()).toBeGreaterThan(0);
  });
});
