import { notifyOwner } from "./notification";

export type SubmissionType = "contact" | "survey" | "assessment" | "lead_magnet" | "waitlist" | "bold_out";

export interface SubmissionNotificationData {
  type: SubmissionType;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  content: string;
  metadata?: Record<string, any>;
}

/**
 * Send email notification to admin when a customer submits information
 */
export async function sendSubmissionNotification(
  data: SubmissionNotificationData
): Promise<boolean> {
  const typeLabels: Record<SubmissionType, string> = {
    contact: "Contact Form Inquiry",
    survey: "Post-Purchase Survey",
    assessment: "Assessment/Quiz Submission",
    lead_magnet: "Lead Magnet Request",
    waitlist: "Waitlist Signup",
    bold_out: "B.O.L.D. OUT Registration",
  };

  const typeLabel = typeLabels[data.type];

  // Format the notification content
  let contentPreview = data.content;
  if (typeof data.content === "string" && data.content.length > 200) {
    contentPreview = data.content.substring(0, 200) + "...";
  }

  const title = `New ${typeLabel} from ${data.customerName}`;
  const content = `
**Customer:** ${data.customerName}
**Email:** ${data.customerEmail}
${data.customerPhone ? `**Phone:** ${data.customerPhone}` : ""}
**Type:** ${typeLabel}

**Message/Response:**
${contentPreview}

${data.metadata ? `**Additional Info:** ${JSON.stringify(data.metadata, null, 2)}` : ""}

---
Log in to the admin dashboard to view full details and manage this submission.
  `.trim();

  try {
    const success = await notifyOwner({
      title,
      content,
    });

    if (!success) {
      console.warn("[EmailNotification] Failed to send notification to owner");
      return false;
    }

    return true;
  } catch (error) {
    console.error("[EmailNotification] Error sending notification:", error);
    return false;
  }
}
