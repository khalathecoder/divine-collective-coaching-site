import { describe, expect, it } from "vitest";
import { filterSubmissions, getSubmissionTypeLabel } from "./adminSubmissionUtils";

describe("admin submission helpers", () => {
  it("keeps waitlist submissions in the waitlist filter", () => {
    const rows = [
      { submissionType: "bold_out", customerName: "Masterclass Guest" },
      { submissionType: "waitlist", customerName: "Waitlist Member" },
    ];

    expect(filterSubmissions(rows, "waitlist")).toEqual([
      { submissionType: "waitlist", customerName: "Waitlist Member" },
    ]);
  });

  it("renders the waitlist dashboard label", () => {
    expect(getSubmissionTypeLabel("waitlist")).toBe("Waitlist Signup");
  });
});
