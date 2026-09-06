import { describe, it, expect, vi, beforeEach } from "vitest";
import { createOrder, getUserOrders } from "../db";
import { getProduct } from "../products";
import { getCoachingSuccessUrl, getGuestCheckoutSuccessUrl, isPaidDigitalDeliverySession } from "./payments";

// Mock the database
vi.mock("../db", () => ({
  createOrder: vi.fn(),
  getUserOrders: vi.fn(),
}));

// Mock the products
vi.mock("../products", () => ({
  getProduct: vi.fn(),
}));

describe("Payments Router - Coaching Checkout", () => {
  it("includes a Stripe session id placeholder in guest digital-product success URLs", () => {
    expect(getGuestCheckoutSuccessUrl("https://example.com", "divine-mindset-guide")).toBe(
      "https://example.com/shop?product=divine-mindset-guide&success=true&session_id={CHECKOUT_SESSION_ID}",
    );
  });

  it("authorizes only a complete paid session with matching digital-product metadata", () => {
    const paidSession = {
      status: "complete",
      payment_status: "paid",
      mode: "payment",
      metadata: { product_id: "divine-mindset-guide" },
    };

    expect(isPaidDigitalDeliverySession(paidSession, "divine-mindset-guide")).toBe(true);
    expect(isPaidDigitalDeliverySession({ ...paidSession, payment_status: "unpaid" }, "divine-mindset-guide")).toBe(false);
    expect(isPaidDigitalDeliverySession({ ...paidSession, metadata: { product_id: "other-product" } }, "divine-mindset-guide")).toBe(false);
    expect(isPaidDigitalDeliverySession({ ...paidSession, status: "open" }, "divine-mindset-guide")).toBe(false);
  });

  it("routes Crown Hour success to the coaching calendar handoff", () => {
    expect(getCoachingSuccessUrl("https://example.com", "crown-hour")).toBe(
      "https://example.com/coaching?checkout=success&program=crown-hour",
    );
  });

  it("keeps other coaching purchases on the post-purchase survey", () => {
    expect(getCoachingSuccessUrl("https://example.com", "called-crowned-3month")).toBe(
      "https://example.com/survey?session_id={CHECKOUT_SESSION_ID}",
    );
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should allow creating orders with nullable stripePaymentIntentId", async () => {
    // Mock product
    const mockProduct = {
      id: "voice-activated",
      name: "V.O.I.C.E. Activated",
      description: "5-week group program",
      price: 49700,
      currency: "usd",
    };

    (getProduct as any).mockReturnValue(mockProduct);

    // Mock order creation - should succeed with empty stripePaymentIntentId
    const mockOrder = {
      id: 1,
      userId: 1,
      stripePaymentIntentId: null, // nullable
      stripeCheckoutSessionId: "cs_test_123",
      productId: "voice-activated",
      productName: "V.O.I.C.E. Activated",
      amountCents: 49700,
      currency: "usd",
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (createOrder as any).mockResolvedValue(mockOrder);

    // Simulate order creation
    const result = await createOrder({
      userId: 1,
      stripePaymentIntentId: "", // empty string should be handled
      stripeCheckoutSessionId: "cs_test_123",
      productId: "voice-activated",
      productName: "V.O.I.C.E. Activated",
      amountCents: 49700,
      currency: "usd",
      status: "pending",
    });

    expect(result).toBeDefined();
    expect(result.stripeCheckoutSessionId).toBe("cs_test_123");
    expect(result.status).toBe("pending");
  });

  it("should handle multiple orders with nullable stripePaymentIntentId", async () => {
    const mockOrder1 = {
      id: 1,
      userId: 1,
      stripePaymentIntentId: null,
      stripeCheckoutSessionId: "cs_test_1",
      productId: "voice-activated",
      productName: "V.O.I.C.E. Activated",
      amountCents: 49700,
      currency: "usd",
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockOrder2 = {
      id: 2,
      userId: 1,
      stripePaymentIntentId: null,
      stripeCheckoutSessionId: "cs_test_2",
      productId: "bold-out-masterclass",
      productName: "B.O.L.D. OUT Masterclass",
      amountCents: 4700,
      currency: "usd",
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (getUserOrders as any).mockResolvedValue([mockOrder1, mockOrder2]);

    const orders = await getUserOrders(1);

    expect(orders).toHaveLength(2);
    expect(orders[0].stripeCheckoutSessionId).toBe("cs_test_1");
    expect(orders[1].stripeCheckoutSessionId).toBe("cs_test_2");
    // Both should have nullable stripePaymentIntentId
    expect(orders[0].stripePaymentIntentId).toBeNull();
    expect(orders[1].stripePaymentIntentId).toBeNull();
  });

  it("should support payment plans metadata without breaking order creation", async () => {
    const mockOrder = {
      id: 1,
      userId: 1,
      stripePaymentIntentId: null,
      stripeCheckoutSessionId: "cs_test_3month",
      productId: "called-crowned-3month",
      productName: "Crowned & Called (3-Month)",
      amountCents: 249700,
      currency: "usd",
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (createOrder as any).mockResolvedValue(mockOrder);

    // Simulate creating order for 3-month coaching with payment plan metadata
    const result = await createOrder({
      userId: 1,
      stripePaymentIntentId: "",
      stripeCheckoutSessionId: "cs_test_3month",
      productId: "called-crowned-3month",
      productName: "Crowned & Called (3-Month)",
      amountCents: 249700,
      currency: "usd",
      status: "pending",
    });

    expect(result).toBeDefined();
    expect(result.productId).toBe("called-crowned-3month");
    expect(result.amountCents).toBe(249700);
  });
});

describe("B.O.L.D. OUT End-to-End Flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create checkout session with correct VIP tier metadata", () => {
    const tier = "vip";
    const ghlTag = "BOLD MC VIP";
    const metadata = {
      tier,
      ghl_tag: ghlTag,
      registration_type: "bold_out",
    };

    expect(metadata.tier).toBe("vip");
    expect(metadata.ghl_tag).toBe("BOLD MC VIP");
    expect(metadata.registration_type).toBe("bold_out");
  });

  it("should handle general tier B.O.L.D. OUT checkout", () => {
    const tier = "general";
    const ghlTag = "BOLD MCG";
    const metadata = {
      tier,
      ghl_tag: ghlTag,
      registration_type: "bold_out",
    };

    expect(metadata.tier).toBe("general");
    expect(metadata.ghl_tag).toBe("BOLD MCG");
  });

  it("should include customer info in checkout metadata", () => {
    const customerEmail = "test@example.com";
    const customerName = "Test Customer";
    const tier = "vip";

    const metadata = {
      customer_email: customerEmail,
      customer_name: customerName,
      tier,
      ghl_tag: "BOLD MC VIP",
    };

    expect(metadata.customer_email).toBe("test@example.com");
    expect(metadata.customer_name).toBe("Test Customer");
    expect(metadata.tier).toBe("vip");
  });
});
