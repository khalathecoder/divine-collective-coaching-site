import { notifyOwner } from "./notification";
import { sendPrivateEmail } from "./privateEmail";
import { syncContactToGhl } from "./gohighlevel";
import { MASTERCLASS_SCHEDULE } from "@shared/masterclassSchedule";

const EVENT_NAME = "B.O.L.D. OUT Voice Activation Experience™";
const ZOOM_LINK = "https://us06web.zoom.us/j/83079974714?pwd=ntvSUetlgammUMsGfZjcFnZ5lD2yaU.1&jst=5";
const SURVEY_BASE_URL = "https://dicollectivellc.com/bold-out-intake";

export interface BoldOutConfirmationData {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  tier: "general";
  productName: string;
  surveyToken?: string;
}

export interface BoldOutConfirmationMessage {
  subject: string;
  text: string;
  html: string;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);
}

export function getPreferredCustomerName(
  primaryName: string | null | undefined,
  fallbackName: string | null | undefined,
  customerEmail: string,
): string {
  const email = customerEmail.trim().toLowerCase();
  for (const candidate of [primaryName, fallbackName]) {
    const name = candidate?.trim() || "";
    const words = name.split(/\s+/).filter(Boolean);
    const looksLikeEmailAlias = name.includes("@") || name.toLowerCase() === email || /^[a-z0-9._-]+$/.test(name);
    if (name && !looksLikeEmailAlias && words.length >= 2) return name;
  }
  return "there";
}

function getDisplayName(customerName: string, customerEmail: string): string {
  return getPreferredCustomerName(customerName, undefined, customerEmail);
}

export function buildBoldOutConfirmationMessage(data: BoldOutConfirmationData): BoldOutConfirmationMessage {
  const displayName = getDisplayName(data.customerName, data.customerEmail);
  const surveyUrl = data.surveyToken ? `${SURVEY_BASE_URL}?token=${encodeURIComponent(data.surveyToken)}` : SURVEY_BASE_URL;
  const subject = `Your ${EVENT_NAME} participant receipt — ${getDisplayName(data.customerName, data.customerEmail)}`;
  const text = `Dear ${displayName},

Thank you for registering for the ${EVENT_NAME}! I am excited to welcome you into this faith-rooted, practical voice activation experience.

YOUR EXPERIENCE DETAILS
Event: ${EVENT_NAME}
Date & Time: ${MASTERCLASS_SCHEDULE.dateLabel} | 11:00 AM Eastern Time
Format: Virtual (Zoom) · 90 minutes
Zoom Meeting Link: ${ZOOM_LINK}
Receipt: Your Stripe receipt is being sent to this registration email address.
Participant Workbook: ${MASTERCLASS_SCHEDULE.workbookEmailUrl}
Voice Starting Point Survey: ${surveyUrl}

Please bring an open heart, your participant workbook, a phone or voice recorder, a hand mirror or front-facing camera, a blank index card or sticky note, and a glass of water.

Blessings,
Nancy Marie Dixon
Purely Divine Coaching / Divine Collective LLC`.trim();

  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#090909;color:#ffffff;font-family:Arial,Helvetica,sans-serif;line-height:1.6;">
    <div style="max-width:680px;margin:0 auto;padding:32px 20px;background:#090909;color:#ffffff;">
      <div style="border:1px solid #6f5624;border-radius:12px;padding:28px;background:#111111;color:#ffffff;">
        <p style="margin:0 0 18px;color:#ffffff;font-size:17px;">Dear ${escapeHtml(displayName)},</p>
        <h1 style="margin:0 0 18px;color:#f0c76a;font-size:26px;line-height:1.2;">${escapeHtml(EVENT_NAME)}</h1>
        <p style="margin:0 0 24px;color:#ffffff;font-size:16px;">Thank you for registering! I am excited to welcome you into this faith-rooted, practical voice activation experience.</p>
        <h2 style="margin:0 0 12px;color:#ffffff;font-size:18px;">Your Experience Details</h2>
        <p style="margin:8px 0;color:#ffffff;"><strong style="color:#f0c76a;">Event:</strong> ${escapeHtml(EVENT_NAME)}</p>
        <p style="margin:8px 0;color:#ffffff;"><strong style="color:#f0c76a;">Date &amp; Time:</strong> ${escapeHtml(MASTERCLASS_SCHEDULE.dateLabel)} | 11:00 AM Eastern Time</p>
        <p style="margin:8px 0;color:#ffffff;"><strong style="color:#f0c76a;">Format:</strong> Virtual (Zoom) · 90 minutes</p>
        <p style="margin:8px 0;color:#ffffff;"><strong style="color:#f0c76a;">Zoom Meeting Link:</strong> <a href="${escapeHtml(ZOOM_LINK)}" style="color:#f0c76a;text-decoration:underline;font-weight:700;">Join the Experience</a></p>
        <p style="margin:8px 0;color:#ffffff;"><strong style="color:#f0c76a;">Receipt:</strong> Your Stripe receipt is being sent to this registration email address.</p>
        <p style="margin:8px 0;color:#ffffff;"><strong style="color:#f0c76a;">Participant Workbook:</strong><br /><a href="${escapeHtml(MASTERCLASS_SCHEDULE.workbookEmailUrl)}" style="display:inline-block;margin-top:6px;padding:10px 16px;border-radius:6px;background:#f0c76a;color:#111111;text-decoration:none;font-weight:700;">Download the Participant Workbook</a></p>
        <p style="margin:22px 0 8px;color:#ffffff;"><strong style="color:#f0c76a;">Voice Starting Point Survey:</strong></p>
        <p style="margin:0 0 22px;"><a href="${escapeHtml(surveyUrl)}" style="display:inline-block;padding:10px 16px;border-radius:6px;background:#f0c76a;color:#111111;text-decoration:none;font-weight:700;">Complete or Save the Private Survey</a></p>
        <p style="margin:0 0 24px;color:#ffffff;">Please bring an open heart, your participant workbook, a phone or voice recorder, a hand mirror or front-facing camera, a blank index card or sticky note, and a glass of water.</p>
        <p style="margin:0;color:#ffffff;">Blessings,<br /><strong>Nancy Marie Dixon</strong><br />Purely Divine Coaching / Divine Collective LLC</p>
      </div>
    </div>
  </body>
</html>`;

  return { subject, text, html };
}

/** Prepare and deliver the General Admission confirmation. Manus remains the system of record; GHL is additive. */
export async function sendBoldOutConfirmationEmail(data: BoldOutConfirmationData): Promise<boolean> {
  const senderInfo = { name: "Nancy Marie Dixon", email: "info@dicollectivellc.com" };
  const message = buildBoldOutConfirmationMessage(data);

  console.log(`[CustomerEmail] Preparing ${EVENT_NAME} confirmation for ${data.customerEmail} from ${senderInfo.name} <${senderInfo.email}>...`);

  let ghlSynced = false;
  try {
    ghlSynced = await syncContactToGhl({
      email: data.customerEmail,
      name: data.customerName.trim() || "Valued Participant",
      phone: data.customerPhone,
      tags: ["BOLD MCG"],
    });
  } catch (error) {
    console.error("[CustomerEmail] GHL sync failed; continuing with Private Email delivery:", error);
  }

  try {
    const delivery = await sendPrivateEmail({
      to: data.customerEmail,
      subject: message.subject,
      text: message.text,
      html: message.html,
    });
    console.log(`[CustomerEmail] Private Email accepted confirmation for ${data.customerEmail}: ${delivery.messageId || "accepted"}`);
    await notifyOwner({
      title: `[Internal Audit] ${EVENT_NAME} participant email delivered`,
      content: [
        `Internal audit only — this is not the participant-facing receipt.`,
        `Recipient: ${data.customerEmail}`,
        `Name captured at checkout: ${data.customerName.trim() || "Not provided"}`,
        `SMTP message ID: ${delivery.messageId || "accepted"}`,
        `HTML links included: Zoom meeting, participant workbook, and private survey.`,
        `GHL sync attempted: ${ghlSynced ? "succeeded" : "unavailable"} (Manus capture remains authoritative).`,
      ].join("\n"),
    });
    return true;
  } catch (error) {
    console.error("[CustomerEmail] Failed to dispatch confirmation notification:", error);
    return false;
  }
}
