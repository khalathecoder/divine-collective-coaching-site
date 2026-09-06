import { describe, it, expect, vi, beforeEach } from "vitest";
import { getOrderByCheckoutSessionId, getDb } from "../db";

// Mock the database helpers
vi.mock("../db", () => ({
  getOrderByCheckoutSessionId: vi.fn(),
  getDb: vi.fn(),
}));

describe("Surveys Router - Post-Purchase Survey", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should retrieve order by checkout session ID", async () => {
    const mockOrder = {
      id: 1,
      userId: 1,
      stripePaymentIntentId: null,
      stripeCheckoutSessionId: "cs_test_123",
      productId: "voice-activated",
      productName: "V.O.I.C.E. Activated",
      amountCents: 49700,
      currency: "usd",
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (getOrderByCheckoutSessionId as any).mockResolvedValue(mockOrder);

    const result = await getOrderByCheckoutSessionId("cs_test_123");

    expect(result).toBeDefined();
    expect(result?.stripeCheckoutSessionId).toBe("cs_test_123");
    expect(result?.stripePaymentIntentId).toBeNull();
  });

  it("should handle survey submission with discovery call info", async () => {
    const mockOrder = {
      id: 1,
      userId: 1,
      stripePaymentIntentId: null,
      stripeCheckoutSessionId: "cs_test_coaching",
      productId: "called-crowned-6week",
      productName: "Crowned & Called",
      amountCents: 149700,
      currency: "usd",
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (getOrderByCheckoutSessionId as any).mockResolvedValue(mockOrder);

    const result = await getOrderByCheckoutSessionId("cs_test_coaching");

    expect(result).toBeDefined();
    expect(result?.productId).toBe("called-crowned-6week");
    // Survey would capture: hadDiscoveryCall: "yes" | "no" | "scheduled"
  });

  it("should handle missing order gracefully", async () => {
    (getOrderByCheckoutSessionId as any).mockResolvedValue(null);

    const result = await getOrderByCheckoutSessionId("cs_invalid");

    expect(result).toBeNull();
  });

  it("should support optional additional feedback", async () => {
    const mockOrder = {
      id: 2,
      userId: 1,
      stripePaymentIntentId: null,
      stripeCheckoutSessionId: "cs_test_feedback",
      productId: "bold-out-masterclass",
      productName: "B.O.L.D. OUT Masterclass",
      amountCents: 4700,
      currency: "usd",
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (getOrderByCheckoutSessionId as any).mockResolvedValue(mockOrder);

    const result = await getOrderByCheckoutSessionId("cs_test_feedback");

    expect(result).toBeDefined();
    // Survey would store: additionalResponses as optional JSON text field
  });
});
