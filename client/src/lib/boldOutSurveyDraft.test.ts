import { describe, expect, it } from "vitest";
import {
  parseBoldOutSurveyDraft,
  serializeBoldOutSurveyDraft,
  type BoldOutSurveyDraft,
} from "./boldOutSurveyDraft";

const draft: BoldOutSurveyDraft = {
  answers: { 1: "3", 5: "Launch my platform" },
  contactInfo: { name: "Jane Doe", email: "jane@example.com", phone: "216-555-0199" },
  currentIndex: 4,
  savedAt: 1787856000000,
};

describe("B.O.L.D. OUT survey draft persistence", () => {
  it("round-trips a valid draft", () => {
    expect(parseBoldOutSurveyDraft(serializeBoldOutSurveyDraft(draft))).toEqual(draft);
  });

  it("rejects missing, malformed, or incomplete drafts", () => {
    expect(parseBoldOutSurveyDraft(null)).toBeNull();
    expect(parseBoldOutSurveyDraft("not-json")).toBeNull();
    expect(parseBoldOutSurveyDraft(JSON.stringify({ answers: {}, currentIndex: 1 }))).toBeNull();
    expect(parseBoldOutSurveyDraft(JSON.stringify({
      answers: {},
      contactInfo: { name: "", email: "", phone: "" },
      currentIndex: 1.5,
      savedAt: Date.now(),
    }))).toBeNull();
  });
});
