import { describe, expect, it } from "vitest";
import { assessmentHref, assessmentRoutes } from "./assessmentRoutes";

describe("public assessment routes", () => {
  it("keeps stable direct routes for both assessments", () => {
    expect(assessmentRoutes.voiceQuiz).toBe("/voice-quiz");
    expect(assessmentRoutes.divineMindset).toBe("/divine-mindset-assessment");
  });

  it("preserves the originating page when building assessment links", () => {
    expect(assessmentHref(assessmentRoutes.voiceQuiz, "/")).toBe("/voice-quiz?from=%2F");
    expect(assessmentHref(assessmentRoutes.divineMindset, "/shop")).toBe("/divine-mindset-assessment?from=%2Fshop");
  });
});
