import { describe, expect, it } from "vitest";
import { isPaidBoldOutThankYouSession } from "./payments";

describe("B.O.L.D. OUT thank-you session eligibility", () => {
  const paidSession = {
    status: "complete",
    payment_status: "paid",
    mode: "payment",
    metadata: { product_id: "bold-out-masterclass" },
  } as const;

  it("accepts a completed paid General Masterclass session", () => {
    expect(isPaidBoldOutThankYouSession(paidSession)).toBe(true);
  });

  it("rejects incomplete, unpaid, subscription, and mismatched product sessions", () => {
    expect(isPaidBoldOutThankYouSession({ ...paidSession, status: "open" })).toBe(false);
    expect(isPaidBoldOutThankYouSession({ ...paidSession, payment_status: "unpaid" })).toBe(false);
    expect(isPaidBoldOutThankYouSession({ ...paidSession, mode: "subscription" })).toBe(false);
    expect(isPaidBoldOutThankYouSession({ ...paidSession, metadata: { product_id: "divine-mindset-guide" } })).toBe(false);
    expect(isPaidBoldOutThankYouSession(null)).toBe(false);
  });
});
