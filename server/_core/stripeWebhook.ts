import express, { Express } from "express";
import Stripe from "stripe";
import { randomBytes } from "node:crypto";
import { updateOrderStatus, getOrderByPaymentIntentId, getOrderByCheckoutSessionId, updateOrderPaymentIntent, createAdminSubmission } from "../db";
import { notifyOwner } from "./notification";
import { getPreferredCustomerName, sendBoldOutConfirmationEmail } from "./customerEmail";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-05-27.dahlia",
});

export function constructVerifiedStripeEvent(
  payload: string | Buffer,
  signature: string,
  secrets: string[],
): Stripe.Event {
  let lastError: unknown;
  for (const secret of secrets) {
    try {
      return stripe.webhooks.constructEvent(payload, signature, secret);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Webhook signature verification failed");
}

export function registerStripeWebhook(app: Express) {
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req, res) => {
      const sig = req.headers["stripe-signature"] as string;
      const webhookSecrets = [process.env.STRIPE_WEBHOOK_SECRET, process.env.STRIPE_TEST_WEBHOOK_SECRET].filter(
        (secret): secret is string => Boolean(secret),
      );

      if (webhookSecrets.length === 0) {
        console.error("[Stripe Webhook] No webhook signing secret is configured");
        return res.status(500).json({ error: "Webhook not configured" });
      }

      let event: Stripe.Event;

      try {
        event = constructVerifiedStripeEvent(req.body, sig, webhookSecrets);
      } catch (error) {
        console.error("[Stripe Webhook] Signature verification failed:", error);
        return res.status(400).json({ error: "Signature verification failed" });
      }

      // Handle test events for webhook verification
      if (event.id.startsWith("evt_test_")) {
        console.log("[Webhook] Test event detected, returning verification response");
        return res.json({ verified: true });
      }

      try {
        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            console.log("[Stripe Webhook] Checkout session completed:", session.id);

            // Handle both one-time payments and subscriptions
            if (session.mode === "subscription" && session.subscription) {
              // Subscription checkout - store subscription ID
              console.log("[Stripe Webhook] Subscription checkout:", session.subscription);
            } else if (session.payment_intent) {
              // One-time payment checkout - link payment intent to order
              const paymentIntentId = typeof session.payment_intent === "string"
                ? session.payment_intent
                : session.payment_intent.id;

              await updateOrderPaymentIntent(session.id, paymentIntentId);
              console.log("[Stripe Webhook] Updated order with payment_intent:", paymentIntentId);
            }

            break;
          }

          case "payment_intent.succeeded": {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            console.log("[Stripe Webhook] Payment succeeded:", paymentIntent.id);

            // Update order status to succeeded
            await updateOrderStatus(paymentIntent.id, "succeeded");

            // Notify owner of successful payment
            const order = await getOrderByPaymentIntentId(paymentIntent.id);
            if (order) {
              await notifyOwner({
                title: "New Purchase",
                content: `${order.productName} purchased for ${(order.amountCents / 100).toFixed(2)} ${order.currency.toUpperCase()}`,
              });

              // Check if this is a B.O.L.D. OUT Masterclass purchase and send tailored confirmation email
              if (order.productId.startsWith("bold-out-masterclass")) {
                const isHistoricalVip = order.productId.includes("vip");
                const tier = "general" as const;
                const surveyToken = randomBytes(32).toString("hex");

                let customerName = "Valued Participant";
                let customerEmail = "";

                try {
                  const sessions = await stripe.checkout.sessions.list({ payment_intent: paymentIntent.id, limit: 1 });
                  if (sessions.data.length > 0) {
                    const session = sessions.data[0];
                    customerEmail = session.customer_details?.email || session.metadata?.customer_email || "";
                    customerName = getPreferredCustomerName(
                      session.customer_details?.name,
                      session.metadata?.customer_name,
                      customerEmail,
                    );
                  }
                } catch (err) {
                  console.error("[Stripe Webhook] Failed to retrieve session details for B.O.L.D. OUT confirmation:", err);
                }

                if (customerEmail) {
                  await sendBoldOutConfirmationEmail({
                    customerName,
                    customerEmail,
                    tier,
                    productName: order.productName,
                    surveyToken,
                  });

                  await createAdminSubmission({
                    submissionType: "bold_out",
                    customerName,
                    customerEmail,
                    content: `B.O.L.D. OUT Registration Confirmed - General Admission`,
                    metadata: JSON.stringify({
                      tier,
                      ghl_tag: "BOLD MCG",
                      historical_tier: isHistoricalVip ? "vip" : "general",
                      survey_token: surveyToken,
                      survey_access: "paid_general",
                      payment_intent_id: paymentIntent.id,
                      amount_paid: order.amountCents,
                    }),
                  });
                }
              }
            }

            break;
          }

          case "payment_intent.payment_failed": {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            console.log("[Stripe Webhook] Payment failed:", paymentIntent.id);

            // Update order status to failed
            await updateOrderStatus(paymentIntent.id, "failed");
            break;
          }

          case "charge.refunded": {
            const charge = event.data.object as Stripe.Charge;
            console.log("[Stripe Webhook] Charge refunded:", charge.id);

            if (charge.payment_intent) {
              // Update order status to canceled
              await updateOrderStatus(charge.payment_intent.toString(), "canceled");
            }
            break;
          }

          case "customer.subscription.created": {
            const subscription = event.data.object as Stripe.Subscription;
            console.log("[Stripe Webhook] Subscription created:", subscription.id);
            // Subscription created - will be linked to order via checkout.session.completed
            break;
          }

          case "customer.subscription.updated": {
            const subscription = event.data.object as Stripe.Subscription;
            console.log("[Stripe Webhook] Subscription updated:", subscription.id);
            // Subscription updated - could be status change, plan change, etc.
            break;
          }

          case "invoice.payment_succeeded": {
            const invoice = event.data.object as Stripe.Invoice;
            console.log("[Stripe Webhook] Invoice payment succeeded:", invoice.id);
            // Recurring payment succeeded - notify owner
            const subscriptionId = (invoice as any).subscription;
            if (subscriptionId) {
              await notifyOwner({
                title: "Subscription Payment Received",
                content: `Payment of ${(invoice.amount_paid / 100).toFixed(2)} ${invoice.currency.toUpperCase()} received for subscription ${subscriptionId}`,
              });
            }
            break;
          }

          case "invoice.payment_failed": {
            const invoice = event.data.object as Stripe.Invoice;
            console.log("[Stripe Webhook] Invoice payment failed:", invoice.id);
            // Recurring payment failed - notify owner
            const subscriptionId = (invoice as any).subscription;
            if (subscriptionId) {
              await notifyOwner({
                title: "Subscription Payment Failed",
                content: `Payment failed for subscription ${subscriptionId}. Amount: ${(invoice.amount_due / 100).toFixed(2)} ${invoice.currency.toUpperCase()}`,
              });
            }
            break;
          }

          default:
            console.log("[Stripe Webhook] Unhandled event type:", event.type);
        }

        res.json({ received: true });
      } catch (error) {
        console.error("[Stripe Webhook] Error processing event:", error);
        res.status(500).json({ error: "Webhook processing failed" });
      }
    }
  );
}
