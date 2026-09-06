# B.O.L.D. OUT Voice Activation Experience™ Reminder Schedule

The live event is **Saturday, September 12, 2026 at 11:00 AM Eastern**, virtual on Zoom, with a 90-minute duration. Only paid General Admission registrants carrying the `BOLD MCG` tag are eligible.

| Reminder | Eastern send time | UTC Heartbeat cron | Workflow tag | Callback |
|---|---|---|---|---|
| Workbook and survey | Wednesday, September 9, 2026 at 6:00 PM Eastern | `0 0 22 9 9 *` | `BOLD REMINDER 09-09` | `/api/scheduled/masterclass-workbook` |
| Preparation reminder | Friday, September 11, 2026 at 6:00 PM Eastern | `0 0 22 11 9 *` | `BOLD REMINDER 09-11` | `/api/scheduled/masterclass-survey` |
| Day-of reminder | Saturday, September 12, 2026 at 9:00 AM Eastern | `0 0 13 12 9 *` | `BOLD REMINDER DAY-OF` | `/api/scheduled/masterclass-day-of` |

Each callback requires a valid platform cron identity, filters to paid General records with a secure survey token, applies the corresponding GHL workflow tag, and records an idempotent `reminder_sent` marker. The callback routes are mounted in the server, but the production schedules must not be created until this checkpoint is published and the live GHL credential/workflow sender is verified. The current configured GHL credential returns HTTP 401, so no participant email is sent during development.

The participant workbook is served from the managed project URL in `shared/masterclassSchedule.ts`. Every reminder body includes the personalized survey URL and workbook URL; the September 11 and day-of messages also include the supplied preparation checklist.
