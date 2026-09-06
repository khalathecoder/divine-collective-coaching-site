import { describe, it, expect } from "vitest";

describe("GoHighLevel Integration", () => {
  it("should have valid GoHighLevel API credentials configured", async () => {
    const apiKey = process.env.GOHIGHLEVEL_API_KEY;
    const locationId = process.env.GOHIGHLEVEL_LOCATION_ID;

    expect(apiKey).toBeDefined();
    expect(locationId).toBeDefined();
    expect(apiKey).toMatch(/^pit-/);
    expect(locationId).toBeTruthy();
  });

  it("should validate GoHighLevel API connection", async () => {
    const apiKey = process.env.GOHIGHLEVEL_API_KEY;
    const locationId = process.env.GOHIGHLEVEL_LOCATION_ID;

    if (!apiKey || !locationId) {
      throw new Error("GoHighLevel credentials not configured");
    }

    try {
      // Test API connection by fetching account info
      const response = await fetch(
        `https://rest.gohighlevel.com/v1/locations/${locationId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toBeDefined();
      expect(data.location || data.data).toBeDefined();
    } catch (error) {
      throw new Error(`GoHighLevel API validation failed: ${error}`);
    }
  });
});
