export const MASTERCLASS_SCHEDULE = {
  eventName: "B.O.L.D. OUT Voice Activation Experience™",
  formatLabel: "Virtual (Zoom)",
  durationLabel: "90 minutes",
  workbookTitle: "B.O.L.D. OUT Voice Activation Experience Participant Workbook",
  workbookUrl: "/manus-storage/Participant_Workbook_BOLD_OUT_Masterclass_16d991e8.docx",
  workbookEmailUrl: "https://dicollectivellc.com/manus-storage/Participant_Workbook_BOLD_OUT_Masterclass_16d991e8.docx",
  imageUrl: "/manus-storage/BOLDOUTVAEXPIMAGE_ea1e680f.png",
  dateIso: "2026-09-12",
  dateLabel: "Saturday, September 12, 2026",
  dateShortLabel: "Sep 12, 2026",
  timeLabel: "11:00 AM ET",
  windowLabel: "11:00 AM - 12:30 PM ET",
  reminderSchedules: [
    { key: "workbook", sendLabel: "Wednesday, September 9, 2026 at 6:00 PM Eastern", cronUtc: "0 0 22 9 9 *" },
    { key: "survey", sendLabel: "Friday, September 11, 2026 at 6:00 PM Eastern", cronUtc: "0 0 22 11 9 *" },
    { key: "day_of", sendLabel: "Saturday, September 12, 2026 at 9:00 AM Eastern", cronUtc: "0 0 13 12 9 *" },
  ],
} as const;
