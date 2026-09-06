import { router, publicProcedure } from "../_core/trpc";
import { saveContactMessage, createAdminSubmission, getBoldOutSurveyAccessByToken } from "../db";
import { sendSubmissionNotification } from "../_core/emailNotification";
import { syncContactToGhl } from "../_core/gohighlevel";
import { z } from "zod";

export const waitlistInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  program: z.string().min(1, "Program is required"),
});

export const contactRouter = router({
  /**
   * Submit a lead magnet request (email capture for free resource).
   * No authentication required - public endpoint.
   */
  createLeadMagnet: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email address"),
        leadMagnetType: z.string(),
        downloadUrl: z.string().url(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await createAdminSubmission({
          submissionType: "lead_magnet",
          customerName: input.name,
          customerEmail: input.email,
          content: `Requested: ${input.leadMagnetType}`,
          metadata: JSON.stringify({
            leadMagnetType: input.leadMagnetType,
            downloadUrl: input.downloadUrl,
          }),
        });

        await sendSubmissionNotification({
          type: "lead_magnet",
          customerName: input.name,
          customerEmail: input.email,
          content: `Lead magnet request: ${input.leadMagnetType}`,
          metadata: {
            leadMagnetType: input.leadMagnetType,
          },
        });

        return {
          success: true,
          message: "Thank you! Your download is ready.",
        };
      } catch (error) {
        console.error("[LeadMagnet] Failed to save request:", error);
        throw new Error("Failed to process lead magnet request");
      }
    }),

  /**
   * Submit a contact form message.
   * No authentication required - public endpoint.
   */
  submitMessage: publicProcedure
    .input(
      z.object({
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
        address: z.string().min(1, "Address is required"),
        city: z.string().min(1, "City is required"),
        state: z.string().min(1, "State is required"),
        zip: z.string().min(1, "Zip code is required"),
        email: z.string().email("Invalid email address"),
        phone: z.string().min(1, "Phone number is required"),
        message: z.string().min(1, "Message is required"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await saveContactMessage({
          firstName: input.firstName,
          lastName: input.lastName,
          address: input.address,
          city: input.city,
          state: input.state,
          zip: input.zip,
          email: input.email,
          phone: input.phone,
          message: input.message,
        });

        const fullAddress = `${input.address}, ${input.city}, ${input.state} ${input.zip}`;
        await createAdminSubmission({
          submissionType: "contact",
          customerName: `${input.firstName} ${input.lastName}`,
          customerEmail: input.email,
          customerPhone: input.phone,
          content: input.message,
          metadata: JSON.stringify({
            address: fullAddress,
            city: input.city,
            state: input.state,
            zip: input.zip,
          }),
        });

        await sendSubmissionNotification({
          type: "contact",
          customerName: `${input.firstName} ${input.lastName}`,
          customerEmail: input.email,
          customerPhone: input.phone,
          content: input.message,
          metadata: {
            address: fullAddress,
          },
        });

        return {
          success: true,
          message: "Thank you! Your message has been received.",
        };
      } catch (error) {
        console.error("[Contact] Failed to save message:", error);
        throw new Error("Failed to save contact message");
      }
    }),

  /**
   * Submit a waitlist signup for upcoming programs.
   * No authentication required - public endpoint.
   */
  submitWaitlist: publicProcedure.input(waitlistInputSchema)
    .mutation(async ({ input }) => {
      try {
        await createAdminSubmission({
          submissionType: "waitlist",
          customerName: input.name,
          customerEmail: input.email,
          customerPhone: input.phone || null,
          content: `Waitlist signup for ${input.program}`,
          metadata: JSON.stringify({
            program: input.program,
            type: "waitlist",
          }),
        });

        await sendSubmissionNotification({
          type: "waitlist",
          customerName: input.name,
          customerEmail: input.email,
          content: `Waitlist signup for ${input.program}`,
          metadata: {
            program: input.program,
          },
        });

        return {
          success: true,
          message: "Thank you! We'll contact you when this program becomes available.",
        };
      } catch (error) {
        console.error("[Waitlist] Failed to save request:", error);
        throw new Error("Failed to process waitlist request");
      }
    }),

  /**
   * Submit B.O.L.D. OUT registration with tier information and GHL tagging.
   * No authentication required - public endpoint.
   */
  submitBoldOutRegistration: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email address"),
        phone: z.string().optional(),
        tier: z.literal("general"),
        stripeSessionId: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const ghlTag = "BOLD MCG";

        await createAdminSubmission({
          submissionType: "bold_out",
          customerName: input.name,
          customerEmail: input.email,
          customerPhone: input.phone || null,
          content: "B.O.L.D. OUT Voice Activation Experience™ Registration - General Admission",
          metadata: JSON.stringify({
            tier: "general",
            ghl_tag: ghlTag,
            stripe_session_id: input.stripeSessionId,
            registration_type: "bold_out",
          }),
        });

        await sendSubmissionNotification({
          type: "bold_out",
          customerName: input.name,
          customerEmail: input.email,
          content: "B.O.L.D. OUT Voice Activation Experience™ Registration - General Admission",
          metadata: {
            tier: "general",
            ghl_tag: ghlTag,
          },
        });

        return {
          success: true,
          message: "Thank you for registering! Check your email for confirmation and access details.",
          ghlTag: ghlTag,
        };
      } catch (error) {
        console.error("[B.O.L.D. OUT] Failed to save registration:", error);
        throw new Error("Failed to process registration");
      }
    }),

  /** Validate a paid General registrant's private survey token. */
  getBoldOutSurveyAccess: publicProcedure
    .input(z.object({ token: z.string().min(32) }))
    .query(async ({ input }) => {
      const submission = await getBoldOutSurveyAccessByToken(input.token);
      return submission
        ? { valid: true, name: submission.customerName, email: submission.customerEmail, phone: submission.customerPhone ?? "" }
        : { valid: false, name: "", email: "", phone: "" };
    }),

  /**
   * Submit B.O.L.D. OUT Pre-Program Survey (BOSUR) with GHL contact sync and admin recording.
   */
  submitBoldOutSurvey: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email address"),
        phone: z.string().optional(),
        surveySummary: z.string().min(1, "Survey responses are required"),
        surveyToken: z.string().min(32).optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const ghlTag = "BOSUR";

        await syncContactToGhl({
          email: input.email,
          name: input.name,
          phone: input.phone || undefined,
          tags: [ghlTag],
        });

        await createAdminSubmission({
          submissionType: "bold_out",
          customerName: input.name,
          customerEmail: input.email,
          customerPhone: input.phone || null,
          content: `B.O.L.D. OUT Pre-Program Survey (BOSUR)\n\n${input.surveySummary}`,
          metadata: JSON.stringify({
            ghl_tag: ghlTag,
            survey_type: "bold_out_intake",
            survey_token: input.surveyToken,
            survey_access: "paid_general",
          }),
        });

        await sendSubmissionNotification({
          type: "bold_out",
          customerName: input.name,
          customerEmail: input.email,
          customerPhone: input.phone || undefined,
          content: `B.O.L.D. OUT Pre-Program Survey (BOSUR) submitted by ${input.name}`,
          metadata: {
            ghl_tag: ghlTag,
          },
        });

        return {
          success: true,
          message: "Pre-program survey submitted successfully and tagged BOSUR in GHL.",
          ghlTag,
        };
      } catch (error) {
        console.error("[BoldOutSurvey] Failed to submit survey:", error);
        throw new Error("Failed to process survey submission");
      }
    }),
});
