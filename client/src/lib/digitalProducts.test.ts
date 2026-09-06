import { describe, expect, it } from "vitest";
import { getDigitalDelivery } from "./digitalProducts";

describe("digital product delivery", () => {
  it("returns the Divine Mindset Guide delivery asset", () => {
    expect(getDigitalDelivery("divine-mindset-guide")).toEqual({
      productId: "divine-mindset-guide",
      productName: "The Divine Mindset Guide",
      downloadUrl: "/manus-storage/divine-mindset-guide_9ca7aba7.html",
    });
  });

  it("does not expose a delivery link for unknown or missing products", () => {
    expect(getDigitalDelivery("unknown-product")).toBeUndefined();
    expect(getDigitalDelivery(null)).toBeUndefined();
    expect(getDigitalDelivery(undefined)).toBeUndefined();
  });
});
