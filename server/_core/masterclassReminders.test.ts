import { describe, expect, it } from "vitest";
import { MASTERCLASS_REMINDER_TAGS, reminderContent } from "./masterclassReminders";

describe("Masterclass reminder content", () => {
  it("uses the single General workflow tags for all reminder windows", () => {
    expect(MASTERCLASS_REMINDER_TAGS).toEqual({
      workbook: "BOLD REMINDER 09-09",
      survey: "BOLD REMINDER 09-11",
      day_of: "BOLD REMINDER DAY-OF",
    });
  });

  it("includes the personalized survey and workbook links in the first reminder", () => {
    const body = reminderContent("Nancy Participant", "workbook", "https://dicollectivellc.com/bold-out-intake?token=secret");
    expect(body).toContain("B.O.L.D. OUT Voice Activation Experience™");
    expect(body).toContain("Saturday, September 12, 2026");
    expect(body).toContain("https://dicollectivellc.com/manus-storage/Participant_Workbook_BOLD_OUT_Masterclass_16d991e8.docx");
    expect(body).toContain("token=secret");
    expect(body).toContain("Please complete the survey if you have not already");
  });

  it("includes the preparation checklist in the same-day reminder", () => {
    const body = reminderContent("Nancy Participant", "day_of", "https://dicollectivellc.com/bold-out-intake?token=secret");
    expect(body).toContain("Today is the B.O.L.D. OUT Voice Activation Experience™");
    expect(body).toContain("Workbook:");
    expect(body).toContain("Survey:");
    expect(body).toContain("glass of water");
  });
});
