import { describe, expect, it } from "vitest";
import { MASTERCLASS_SCHEDULE } from "./masterclassSchedule";

describe("Masterclass schedule", () => {
  it("uses the revised September 12, 2026 schedule", () => {
    expect(MASTERCLASS_SCHEDULE.dateIso).toBe("2026-09-12");
    expect(MASTERCLASS_SCHEDULE.dateLabel).toBe("Saturday, September 12, 2026");
    expect(MASTERCLASS_SCHEDULE.timeLabel).toBe("11:00 AM ET");
    expect(MASTERCLASS_SCHEDULE.windowLabel).toBe("11:00 AM - 12:30 PM ET");
    expect(MASTERCLASS_SCHEDULE.imageUrl).toBe("/manus-storage/BOLDOUTVAEXPIMAGE_ea1e680f.png");
    expect(MASTERCLASS_SCHEDULE.reminderSchedules).toEqual([
      { key: "workbook", sendLabel: "Wednesday, September 9, 2026 at 6:00 PM Eastern", cronUtc: "0 0 22 9 9 *" },
      { key: "survey", sendLabel: "Friday, September 11, 2026 at 6:00 PM Eastern", cronUtc: "0 0 22 11 9 *" },
      { key: "day_of", sendLabel: "Saturday, September 12, 2026 at 9:00 AM Eastern", cronUtc: "0 0 13 12 9 *" },
    ]);
  });

  it("does not contain the superseded August 29 date", () => {
    expect(JSON.stringify(MASTERCLASS_SCHEDULE)).not.toContain("August 29");
    expect(JSON.stringify(MASTERCLASS_SCHEDULE)).not.toContain("2026-08-29");
  });
});
