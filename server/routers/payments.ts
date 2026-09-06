import Stripe from "stripe";
import { createOrder, getUserOrders, getBoldOutSurveyAccessByPaymentIntentId } from "../db";
import { getProduct } from "../products";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-05-27.dahlia",
});

export const getCoachingSuccessUrl = (origin: string, productId: string) =>
  productId === "crown-hour"
    ? `${origin}/coaching?checkout=success&program=crown-hour`
    : `${origin}/survey?session_id={CHECKOUT_SESSION_ID}`;

export const getGuestCheckoutSuccessUrl = (origin: string, productId: string) =>
  `${origin}/shop?product=${encodeURIComponent(productId)}&success=true&session_id={CHECKOUT_SESSION_ID}`;

export function isPaidBoldOutThankYouSession(
  session: { status: string | null; payment_status: string; mode: string; metadata: Stripe.Metadata | null } | null,
) {
  return Boolean(
    session &&
      session.status === "complete" &&
      session.payment_status === "paid" &&
      session.mode === "payment" &&
      session.metadata?.product_id === "bold-out-masterclass",
  );
}

export function isPaidDigitalDeliverySession(
  session: { status: string | null; payment_status: string; mode: string; metadata: Stripe.Metadata | null } | null,
  productId: string,
) {
  return Boolean(
    session &&
      session.status === "complete" &&
      session.payment_status === "paid" &&
      session.mode === "payment" &&
      session.metadata?.product_id === productId,
  );
}

export const paymentsRouter = router({
  /**
   * Create a Stripe checkout session for purchasing a product.
   * Returns the checkout URL to redirect the user to Stripe's hosted checkout.
   */
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const product = getProduct(input.productId);
      if (!product) {
        throw new Error("Product not found");
      }

      const user = ctx.user;
      if (!user) {
        throw new Error("User not authenticated");
      }

      try {
        // Create a checkout session for the product
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",
          customer_email: user.email || undefined,
          client_reference_id: user.id.toString(),
          metadata: {
            user_id: user.id.toString(),
            customer_email: user.email || "",
            customer_name: user.name || "",
            product_id: product.id,
          },
          line_items: [
            {
              price_data: {
                currency: product.currency,
                product_data: {
                  name: product.name,
                  description: product.description,
                },
                unit_amount: product.price,
              },
              quantity: 1,
            },
          ],
          success_url: `${ctx.req.headers.origin}/survey?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${ctx.req.headers.origin}/shop`,
          allow_promotion_codes: true,
        });

        // Create a pending order in the database
        if (session.id) {
          await createOrder({
            userId: user.id,
            stripePaymentIntentId: "", // Will be updated by webhook
            stripeCheckoutSessionId: session.id,
            productId: product.id,
            productName: product.name,
            amountCents: product.price,
            currency: product.currency,
            status: "pending",
          });
        }

        return {
          checkoutUrl: session.url,
          sessionId: session.id,
        };
      } catch (error) {
        console.error("[Stripe] Failed to create checkout session:", error);
        throw new Error("Failed to create checkout session");
      }
    }),

  /**
   * Create a Stripe checkout session for coaching packages with subscription support.
   * Handles both one-time payments and recurring subscription payments.
   */
  createCoachingCheckout: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        paymentPlanId: z.string(),
        customerName: z.string().optional(),
        customerEmail: z.string().optional(),
        customerPhone: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const product = getProduct(input.productId);
      if (!product) {
        throw new Error("Product not found");
      }

      const user = ctx.user;
      if (!user) {
        throw new Error("User not authenticated");
      }

      try {
        // Find the selected payment plan by ID
        const paymentPlan = product.paymentPlans?.find(
          (plan) => plan.id === input.paymentPlanId
        );

        // Determine if this is a subscription or one-time payment
        const isSubscription = paymentPlan && paymentPlan.installments > 1;
        const installmentAmount = paymentPlan?.monthlyPrice || product.price;
        const installments = paymentPlan?.installments || 1;

        if (isSubscription) {
          // Create a subscription checkout session
          const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "subscription",
            customer_email: input.customerEmail || user.email || undefined,
            client_reference_id: user.id.toString(),
            metadata: {
              user_id: user.id.toString(),
              customer_email: input.customerEmail || user.email || "",
              customer_name: input.customerName || user.name || "",
              customer_phone: input.customerPhone || "",
              product_id: product.id,
              payment_plan_id: input.paymentPlanId,
              installments: (paymentPlan?.installments || 1).toString(),
            },
            line_items: [
              {
                price_data: {
                  currency: product.currency,
                  product_data: {
                    name: product.name,
                    description: `${paymentPlan?.name || 'Payment Plan'}`,
                  },
                  unit_amount: installmentAmount,
                  recurring: {
                    interval: "month",
                    interval_count: 1,
                  },
                },
                quantity: 1,
              },
            ],
            subscription_data: {
              metadata: {
                installments: (paymentPlan?.installments || 1).toString(),
                payment_plan_id: input.paymentPlanId,
              },
            },
            success_url: getCoachingSuccessUrl(ctx.req.headers.origin || "", product.id),
            cancel_url: `${ctx.req.headers.origin}/coaching`,
            allow_promotion_codes: true,
          });

          // Create a pending order in the database
          if (session.id) {
            await createOrder({
              userId: user.id,
              stripePaymentIntentId: "", // Will be updated by webhook
              stripeCheckoutSessionId: session.id,
              productId: product.id,
              productName: product.name,
              amountCents: installmentAmount, // First installment amount
              currency: product.currency,
              status: "pending",
              stripeSubscriptionId: undefined, // Will be set by webhook
              paymentPlanId: input.paymentPlanId,
              installments: installments,
              installmentAmountCents: installmentAmount,
            });
          }

          return {
            checkoutUrl: session.url,
            sessionId: session.id,
            isSubscription: true,
          };
        } else {
          // Create a one-time payment checkout session
          const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            customer_email: input.customerEmail || user.email || undefined,
            client_reference_id: user.id.toString(),
            metadata: {
              user_id: user.id.toString(),
              customer_email: input.customerEmail || user.email || "",
              customer_name: input.customerName || user.name || "",
              customer_phone: input.customerPhone || "",
              product_id: product.id,
              payment_plan_id: input.paymentPlanId,
            },
            line_items: [
              {
                price_data: {
                  currency: product.currency,
                  product_data: {
                    name: product.name,
                    description: product.description,
                  },
                  unit_amount: product.price,
                },
                quantity: 1,
              },
            ],
            success_url: getCoachingSuccessUrl(ctx.req.headers.origin || "", product.id),
            cancel_url: `${ctx.req.headers.origin}/coaching`,
            allow_promotion_codes: true,
          });

          // Create a pending order in the database
          if (session.id) {
            await createOrder({
              userId: user.id,
              stripePaymentIntentId: "", // Will be updated by webhook
              stripeCheckoutSessionId: session.id,
              productId: product.id,
              productName: product.name,
              amountCents: product.price,
              currency: product.currency,
              status: "pending",
              paymentPlanId: input.paymentPlanId,
              installments: 1,
            });
          }

          return {
            checkoutUrl: session.url,
            sessionId: session.id,
            isSubscription: false,
          };
        }
      } catch (error) {
        console.error("[Stripe] Failed to create coaching checkout session:", error);
        throw new Error("Failed to create checkout session");
      }
    }),

  verifyDigitalDelivery: publicProcedure
    .input(z.object({ sessionId: z.string().min(1), productId: z.string().min(1) }))
    .query(async ({ input }) => {
      const product = getProduct(input.productId);
      if (!product || product.type !== "digital" || !product.guideUrl) {
        return { authorized: false as const };
      }

      try {
        const session = await stripe.checkout.sessions.retrieve(input.sessionId);
        if (!isPaidDigitalDeliverySession(session, input.productId)) {
          return { authorized: false as const };
        }

        return {
          authorized: true as const,
          productId: product.id,
          productName: product.name,
          downloadUrl: product.guideUrl,
        };
      } catch (error) {
        console.error("[Stripe] Failed to verify digital delivery session:", error);
        return { authorized: false as const };
      }
    }),

  /**
   * Create a Stripe checkout session for any product (guest checkout - no auth required).
   * Returns the checkout URL to redirect the user to Stripe's hosted checkout.
   */
  createGuestCheckout: publicProcedure
    .input(
      z.object({
        productId: z.string().default("divine-mindset-guide"),
        email: z.string().email().optional(),
        name: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const product = getProduct(input.productId);
      if (!product) {
        throw new Error("Product not found");
      }

      try {
        // Create a checkout session for guest checkout
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",
          customer_email: input.email || undefined,
          metadata: {
            customer_email: input.email || "guest",
            customer_name: input.name || "Guest",
            product_id: product.id,
          },
          line_items: [
            {
              price_data: {
                currency: product.currency,
                product_data: {
                  name: product.name,
                  description: product.description,
                },
                unit_amount: product.price,
              },
              quantity: 1,
            },
          ],
          success_url: getGuestCheckoutSuccessUrl(ctx.req.headers.origin || "", input.productId),
          cancel_url: `${ctx.req.headers.origin}/shop`,
          allow_promotion_codes: true,
        });

        return {
          checkoutUrl: session.url,
          sessionId: session.id,
        };
      } catch (error) {
        console.error("[Stripe] Failed to create guest checkout session:", error);
        throw new Error("Failed to create checkout session");
      }
    }),

  /**
   * Create a Stripe checkout session for B.O.L.D. OUT Masterclass (public - guest checkout).
   * Handles the current General Admission ($47) offer. Historical VIP orders remain queryable but cannot be newly purchased.
   * Captures customer info and creates a registration record.
   */
  createBoldOutCheckout: publicProcedure
    .input(
      z.object({
        tier: z.literal("general"),
        email: z.string().email("Invalid email address"),
        name: z.string().min(1, "Name is required"),
        phone: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const productId = "bold-out-masterclass";
      const product = getProduct(productId);
      if (!product) {
        throw new Error("Product not found");
      }

      try {
        // Create a checkout session for B.O.L.D. OUT
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",
          customer_email: input.email,
          metadata: {
            customer_email: input.email,
            customer_name: input.name,
            customer_phone: input.phone || "",
            product_id: product.id,
            tier: "general",
            ghl_tag: "BOLD MCG",
          },
          line_items: [
            {
              price_data: {
                currency: product.currency,
                product_data: {
                  name: product.name,
                  description: product.description,
                },
                unit_amount: product.price,
              },
              quantity: 1,
            },
          ],
          success_url: `${ctx.req.headers.origin}/programs?bold-out=success&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${ctx.req.headers.origin}/programs`,
          allow_promotion_codes: true,
        });

        return {
          checkoutUrl: session.url,
          sessionId: session.id,
        };
      } catch (error) {
        console.error("[B.O.L.D. OUT] Failed to create checkout session:", error);
        throw new Error("Failed to create checkout session");
      }
    }),

  /**
   * Get all orders for the current user.
   */
  getBoldOutThankYou: publicProcedure
    .input(z.object({ sessionId: z.string().min(20) }))
    .query(async ({ input }) => {
      try {
        const session = await stripe.checkout.sessions.retrieve(input.sessionId);
        if (!isPaidBoldOutThankYouSession(session)) {
          return { valid: false, surveyUrl: null, customerName: null };
        }

        const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
        if (!paymentIntentId) return { valid: false, surveyUrl: null, customerName: null };
        const submission = await getBoldOutSurveyAccessByPaymentIntentId(paymentIntentId);
        if (!submission?.metadata) return { valid: false, surveyUrl: null, customerName: null };
        const metadata = JSON.parse(submission.metadata) as Record<string, unknown>;
        const token = typeof metadata.survey_token === "string" ? metadata.survey_token : "";
        if (!token) return { valid: false, surveyUrl: null, customerName: null };
        return {
          valid: true,
          surveyUrl: `https://dicollectivellc.com/bold-out-intake?token=${encodeURIComponent(token)}`,
          customerName: submission.customerName,
        };
      } catch (error) {
        console.error("[B.O.L.D. OUT] Failed to load paid thank-you details:", error);
        return { valid: false, surveyUrl: null, customerName: null };
      }
    }),

  /**
   * Get all orders for the current user.
   */
  getOrders: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const orders = await getUserOrders(user.id);
      return orders;
    } catch (error) {
      console.error("[Stripe] Failed to fetch orders:", error);
      throw new Error("Failed to fetch orders");
    }
  }),
});
