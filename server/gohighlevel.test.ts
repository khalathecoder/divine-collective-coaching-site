import { describe, it, expect, vi } from "vitest";
import { syncContactToGhl } from "./_core/gohighlevel";

describe("GoHighLevel Workflow Integration & Tagging", () => {
  it("should format contact payload correctly for GHL upsert with General tag", async () => {
    const contactData = {
      email: "test.general@example.com",
      name: "Jane Doe",
      phone: "2165550199",
      tags: ["BOLD MCG"],
    };

    // Mock fetch for GHL API
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true, contact: { id: "contact_123" } }),
    } as Response);

    process.env.GOHIGHLEVEL_API_KEY = "pit-test-key";
    process.env.GOHIGHLEVEL_LOCATION_ID = "loc_test_123";

    const success = await syncContactToGhl(contactData);
    expect(success).toBe(true);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url, options] = fetchSpy.mock.calls[0];
    expect(url).toBe("https://rest.gohighlevel.com/v1/contacts/");
    
    const body = JSON.parse(options?.body as string);
    expect(body.email).toBe("test.general@example.com");
    expect(body.firstName).toBe("Jane");
    expect(body.lastName).toBe("Doe");
    expect(body.tags).toEqual(["BOLD MCG"]);

    fetchSpy.mockRestore();
  });

  it("should format contact payload correctly for GHL upsert with VIP tag", async () => {
    const contactData = {
      email: "test.vip@example.com",
      name: "VIP Participant",
      phone: "2165550188",
      tags: ["BOLD MC VIP"],
    };

    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true, contact: { id: "contact_vip_123" } }),
    } as Response);

    process.env.GOHIGHLEVEL_API_KEY = "pit-test-key";
    process.env.GOHIGHLEVEL_LOCATION_ID = "loc_test_123";

    const success = await syncContactToGhl(contactData);
    expect(success).toBe(true);

    const [, options] = fetchSpy.mock.calls[0];
    const body = JSON.parse(options?.body as string);
    expect(body.email).toBe("test.vip@example.com");
    expect(body.tags).toEqual(["BOLD MC VIP"]);

    fetchSpy.mockRestore();
  });
});
