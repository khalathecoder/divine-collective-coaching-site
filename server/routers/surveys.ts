import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb, getOrderByCheckoutSessionId, saveSurveyResponse, createAdminSubmission } from "../db";
import { surveyResponses, orders } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { sendSubmissionNotification } from "../_core/emailNotification";

export const surveysRouter = router({
  /**
   * Submit a post-purchase survey response.
   * Called after successful Stripe checkout to capture customer feedback.
   */
  submitPostPurchaseSurvey: protectedProcedure
    .input(
      z.object({
        stripeCheckoutSessionId: z.string(),
        hadDiscoveryCall: z.enum(["yes", "no", "scheduled"]),
        additionalResponses: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;
      if (!user) {
        throw new Error("User not authenticated");
      }

      try {
        // Find the order by checkout session ID
        const order = await getOrderByCheckoutSessionId(input.stripeCheckoutSessionId);
        if (!order) {
          throw new Error("Order not found");
        }

        // Verify order belongs to current user
        if (order.userId !== user.id) {
          throw new Error("Unauthorized: Order does not belong to current user");
        }

        // Create survey response
        const db = await getDb();
        if (!db) {
          throw new Error("Database not available");
        }

        const result = await db.insert(surveyResponses).values({
          userId: user.id,
          orderId: order.id,
          hadDiscoveryCall: input.hadDiscoveryCall,
          additionalResponses: input.additionalResponses || null,
        });

        // Create admin submission for tracking
        const surveyContent = `Discovery Call: ${input.hadDiscoveryCall}${
          input.additionalResponses ? `\n\nAdditional Info: ${input.additionalResponses}` : ""
        }`;

        await createAdminSubmission({
          submissionType: "survey",
          customerName: user.name || "Unknown",
          customerEmail: user.email || "",
          content: surveyContent,
          metadata: JSON.stringify({
            userId: user.id,
            orderId: order.id,
            productId: order.productId,
            productName: order.productName,
            hadDiscoveryCall: input.hadDiscoveryCall,
          }),
        });

        // Send email notification
        await sendSubmissionNotification({
          type: "survey",
          customerName: user.name || "Unknown",
          customerEmail: user.email || "",
          content: surveyContent,
          metadata: {
            productName: order.productName,
            discoveryCall: input.hadDiscoveryCall,
          },
        });

        return {
          success: true,
          surveyId: result[0],
        };
      } catch (error) {
        console.error("[Survey] Failed to submit survey:", error);
        throw new Error("Failed to submit survey response");
      }
    }),

  /**
   * Get survey responses for the current user.
   */
  getUserSurveys: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      const responses = await db
        .select()
        .from(surveyResponses)
        .where(eq(surveyResponses.userId, user.id));

      return responses;
    } catch (error) {
      console.error("[Survey] Failed to fetch surveys:", error);
      throw new Error("Failed to fetch survey responses");
    }
  }),

  /**
   * Get a specific survey response by ID.
   */
  getSurveyById: protectedProcedure
    .input(z.object({ surveyId: z.number() }))
    .query(async ({ ctx, input }) => {
      const user = ctx.user;
      if (!user) {
        throw new Error("User not authenticated");
      }

      try {
        const db = await getDb();
        if (!db) {
          throw new Error("Database not available");
        }

        const result = await db
          .select()
          .from(surveyResponses)
          .where(eq(surveyResponses.id, input.surveyId))
          .limit(1);

        const response = result.length > 0 ? result[0] : null;
        if (!response) {
          throw new Error("Survey not found");
        }

        // Verify ownership
        if (response.userId !== user.id) {
          throw new Error("Unauthorized");
        }

        return response;
      } catch (error) {
        console.error("[Survey] Failed to fetch survey:", error);
        throw new Error("Failed to fetch survey response");
      }
    }),
});
