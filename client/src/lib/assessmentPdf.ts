type VoiceQuizReport = {
  archetypeName: string;
  badge: string;
  subtitle: string;
  description: string;
  recommendation: string;
  recommendationDescription: string;
  truths: string[];
  scores: Record<string, number>;
  email?: string;
};

type MindsetReport = {
  score: number;
  maxScore: number;
  name?: string;
  email?: string;
};

export async function createVoiceQuizReport(report: VoiceQuizReport) {
  const { createVoiceQuizReport } = await import("./assessmentPdfCore");
  return createVoiceQuizReport(report);
}

export async function createMindsetReport(report: MindsetReport) {
  const { createMindsetReport } = await import("./assessmentPdfCore");
  return createMindsetReport(report);
}

export async function downloadVoiceQuizReport(report: VoiceQuizReport) {
  const { createVoiceQuizReport } = await import("./assessmentPdfCore");
  createVoiceQuizReport(report).save("purely-divine-voice-profile.pdf");
}

export async function downloadMindsetReport(report: MindsetReport) {
  const { createMindsetReport } = await import("./assessmentPdfCore");
  createMindsetReport(report).save("purely-divine-mindset-results.pdf");
}

export type { MindsetReport, VoiceQuizReport };

export const mindsetTierForPercentage = (percentage: number) =>
  percentage >= 80 ? "Elevated Foundation" : percentage >= 60 ? "Growing Foundation" : "Foundation in Progress";
