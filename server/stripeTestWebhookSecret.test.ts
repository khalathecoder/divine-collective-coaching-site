import Stripe from "stripe";
import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { constructVerifiedStripeEvent } from "./_core/stripeWebhook";

function createSignedPayload(secret: string) {
  const timestamp = Math.floor(Date.now() / 1000);
  const payload = JSON.stringify({
    id: "evt_test_secret_validation",
    object: "event",
    api_version: "2026-05-27.dahlia",
    created: timestamp,
    livemode: false,
    pending_webhooks: 1,
    type: "payment_intent.succeeded",
    data: { object: { id: "pi_test_secret_validation", object: "payment_intent" } },
  });
  const digest = createHmac("sha256", secret).update(`${timestamp}.${payload}`).digest("hex");
  return { payload, signature: `t=${timestamp},v1=${digest}` };
}

describe("Stripe Sandbox webhook secret", () => {
  it("verifies a signed test webhook payload with the configured secret", () => {
    const secret = process.env.STRIPE_TEST_WEBHOOK_SECRET;
    expect(secret).toMatch(/^whsec_/);

    const { payload, signature } = createSignedPayload(secret);
    const stripe = new Stripe("sk_test_secret_validation", { apiVersion: "2026-05-27.dahlia" });

    expect(() => stripe.webhooks.constructEvent(payload, signature, secret)).not.toThrow();
    const event = stripe.webhooks.constructEvent(payload, signature, secret);
    expect(event.id).toBe("evt_test_secret_validation");
    expect(event.livemode).toBe(false);
  });

  it("accepts the Sandbox signature through the application verifier after the live secret fails", () => {
    const secret = process.env.STRIPE_TEST_WEBHOOK_SECRET;
    expect(secret).toMatch(/^whsec_/);
    const { payload, signature } = createSignedPayload(secret);

    const event = constructVerifiedStripeEvent(payload, signature, ["whsec_live_placeholder", secret]);
    expect(event.type).toBe("payment_intent.succeeded");
    expect(event.livemode).toBe(false);
  });
});
