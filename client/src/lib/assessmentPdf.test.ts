import { describe, expect, it } from "vitest";
import {
  createMindsetReport,
  createVoiceQuizReport,
  mindsetTierForPercentage,
} from "./assessmentPdf";

describe("assessment PDF reports", () => {
  it("builds a branded Voice Quiz PDF with one page", async () => {
    const document = await createVoiceQuizReport({
      archetypeName: "The Awakening Voice",
      badge: "Voice Awakening",
      subtitle: "Your voice is ready to rise.",
      description: "A report for a participant who is beginning to speak with courage.",
      recommendation: "Voice Activation Coaching",
      recommendationDescription: "Build a consistent practice for bold expression.",
      truths: ["Your voice matters.", "Your story carries wisdom."],
      scores: { fear: 4, silence: 3, identity: 5, readiness: 8 },
      email: "participant@example.com",
    });

    expect(document.getNumberOfPages()).toBe(1);
    expect(document.output("datauristring")).toContain("data:application/pdf");
  });

  it("builds a branded Divine Mindset PDF with one page", async () => {
    const document = await createMindsetReport({
      score: 24,
      maxScore: 30,
      name: "Nancy",
      email: "nancy@example.com",
    });

    expect(document.getNumberOfPages()).toBe(1);
    expect(document.output("datauristring")).toContain("data:application/pdf");
  });

  it("maps mindset percentages to the correct result tier", () => {
    expect(mindsetTierForPercentage(45)).toBe("Foundation in Progress");
    expect(mindsetTierForPercentage(60)).toBe("Growing Foundation");
    expect(mindsetTierForPercentage(80)).toBe("Elevated Foundation");
  });
});
