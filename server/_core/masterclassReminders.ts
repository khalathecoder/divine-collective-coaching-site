import type { Express, Request, Response } from "express";
import { sdk } from "./sdk";
import { getAdminSubmissions, markAdminSubmissionReminderSent } from "../db";
import { notifyOwner } from "./notification";
import { syncContactToGhl } from "./gohighlevel";
import { sendPrivateEmail } from "./privateEmail";
import { MASTERCLASS_SCHEDULE } from "@shared/masterclassSchedule";

const ZOOM_LINK = "https://us06web.zoom.us/j/83079974714?pwd=ntvSUetlgammUMsGfZjcFnZ5lD2yaU.1&jst=5";
type ReminderKey = "workbook" | "survey" | "day_of";

export const MASTERCLASS_REMINDER_TAGS: Record<ReminderKey, string> = {
  workbook: "BOLD REMINDER 09-09",
  survey: "BOLD REMINDER 09-11",
  day_of: "BOLD REMINDER DAY-OF",
};

export function reminderSubject(reminder: ReminderKey): string {
  if (reminder === "workbook") return "Your B.O.L.D. OUT workbook and Voice Starting Point survey";
  if (reminder === "survey") return "B.O.L.D. OUT preparation reminder";
  return "Today: B.O.L.D. OUT Voice Activation Experience™";
}

export function reminderContent(name: string, reminder: ReminderKey, surveyUrl: string): string {
  if (reminder === "workbook") {
    return `Dear ${name},\n\nYour ${MASTERCLASS_SCHEDULE.eventName} is Saturday, September 12, 2026, at 11:00 AM Eastern.\n\nWorkbook: ${MASTERCLASS_SCHEDULE.workbookEmailUrl}\nPrivate Voice Starting Point Survey: ${surveyUrl}\nZoom: ${ZOOM_LINK}\n\nPlease complete the survey if you have not already and bring your workbook to the experience.\n\nBlessings,\nNancy Marie Dixon`;
  }
  if (reminder === "survey") {
    return `Dear ${name},\n\nA quick reminder to complete your private Voice Starting Point Survey before the ${MASTERCLASS_SCHEDULE.eventName}.\n\nSurvey: ${surveyUrl}\nWorkbook: ${MASTERCLASS_SCHEDULE.workbookEmailUrl}\n\nPreparation: record a 15–30 second voice memo answering “What is one thing I have been afraid to say out loud?” Bring your workbook, phone or voice recorder, a hand mirror or front-facing camera, a blank index card or sticky note, and a glass of water.\n\nYour saved draft remains available on this device if you need to finish later.\n\nBlessings,\nNancy Marie Dixon`;
  }
  return `Dear ${name},\n\nToday is the ${MASTERCLASS_SCHEDULE.eventName}. We begin at 11:00 AM Eastern.\n\nJoin on Zoom: ${ZOOM_LINK}\nWorkbook: ${MASTERCLASS_SCHEDULE.workbookEmailUrl}\nSurvey: ${surveyUrl}\n\nPreparation: bring your workbook, phone or voice recorder, a hand mirror or front-facing camera, a blank index card or sticky note, and a glass of water.\n\nWe look forward to welcoming you.\n\nBlessings,\nNancy Marie Dixon`;
}

export async function runReminder(req: Request, res: Response, reminder: ReminderKey): Promise<void> {
  try {
    const user = await sdk.authenticateRequest(req);
    if (!user.isCron || !user.taskUid) {
      res.status(403).json({ error: "cron-only" });
      return;
    }

    const submissions = await getAdminSubmissions(1000, 0);
    let sent = 0;
    for (const submission of submissions) {
      if (submission.submissionType !== "bold_out" || !submission.customerEmail || !submission.metadata) continue;
      let metadata: Record<string, unknown>;
      try {
        metadata = JSON.parse(submission.metadata) as Record<string, unknown>;
      } catch {
        continue;
      }
      if (metadata.ghl_tag !== "BOLD MCG" || metadata.historical_tier === "vip") continue;
      const token = typeof metadata.survey_token === "string" ? metadata.survey_token : "";
      if (!token) continue;
      const sentKeys = Array.isArray(metadata.reminder_sent) ? metadata.reminder_sent : [];
      if (sentKeys.includes(reminder)) continue;

      const surveyUrl = `https://dicollectivellc.com/bold-out-intake?token=${token}`;
      const content = reminderContent(submission.customerName, reminder, surveyUrl);
      const ghlDelivered = await syncContactToGhl({
        email: submission.customerEmail,
        name: submission.customerName,
        phone: submission.customerPhone || undefined,
        tags: ["BOLD MCG", MASTERCLASS_REMINDER_TAGS[reminder]],
      });
      await sendPrivateEmail({
        to: submission.customerEmail,
        subject: reminderSubject(reminder),
        text: content,
        html: content.replace(/\n/g, "<br />"),
      });
      await notifyOwner({
        title: `[Scheduled ${reminder}] ${MASTERCLASS_SCHEDULE.eventName}`,
        content: `Recipient: ${submission.customerEmail}\nGHL workflow tag: ${MASTERCLASS_REMINDER_TAGS[reminder]}\nGHL contact sync: ${ghlDelivered ? "success" : "unavailable/failed"}\n\n${content}`,
      });
      await markAdminSubmissionReminderSent(submission, reminder);
      sent += 1;
    }

    res.json({ ok: true, reminder, sent, taskUid: user.taskUid });
  } catch (error) {
    console.error(`[Scheduled ${reminder}] failed`, error);
    res.status(500).json({ error: String(error), reminder, timestamp: new Date().toISOString() });
  }
}

export function registerMasterclassReminderRoutes(app: Express): void {
  app.post("/api/scheduled/masterclass-workbook", (req, res) => void runReminder(req, res, "workbook"));
  app.post("/api/scheduled/masterclass-survey", (req, res) => void runReminder(req, res, "survey"));
  app.post("/api/scheduled/masterclass-day-of", (req, res) => void runReminder(req, res, "day_of"));
}
