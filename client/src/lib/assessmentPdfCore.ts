import jsPDF from "jspdf";

const COLORS = {
  black: "#111111",
  ivory: "#F7F2E7",
  gold: "#C8A84B",
  plum: "#6B4C9A",
  muted: "#5D5664",
};

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

function addHeader(doc: jsPDF, title: string, subtitle: string) {
  doc.setFillColor(COLORS.black);
  doc.rect(0, 0, 210, 297, "F");
  doc.setFillColor(COLORS.ivory);
  doc.rect(12, 12, 186, 273, "F");
  doc.setDrawColor(COLORS.gold);
  doc.setLineWidth(0.7);
  doc.rect(16, 16, 178, 277 - 16, "S");
  doc.setTextColor(COLORS.plum);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("DIVINE COLLECTIVE LLC", 24, 31);
  doc.setTextColor(COLORS.black);
  doc.setFontSize(24);
  doc.text(title, 24, 51);
  doc.setTextColor(COLORS.muted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(subtitle, 24, 61);
  doc.setDrawColor(COLORS.gold);
  doc.line(24, 69, 186, 69);
}

function addWrappedText(doc: jsPDF, text: string, x: number, y: number, width: number, lineHeight = 6) {
  const lines = doc.splitTextToSize(text, width) as string[];
  doc.text(lines, x, y, { lineHeightFactor: lineHeight / 5 });
  return y + lines.length * lineHeight;
}

export function createVoiceQuizReport(report: VoiceQuizReport) {
  const doc = new jsPDF();
  addHeader(doc, "Your Voice Profile", "A personalized reflection from the Voice Activation Quiz");
  let y = 83;

  doc.setFillColor(COLORS.plum);
  doc.roundedRect(24, y - 7, 162, 15, 3, 3, "F");
  doc.setTextColor("#FFFFFF");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(report.badge, 30, y + 2);
  y += 25;

  doc.setTextColor(COLORS.black);
  doc.setFontSize(20);
  doc.text(report.archetypeName, 24, y);
  y += 8;
  doc.setTextColor(COLORS.muted);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(11);
  y = addWrappedText(doc, report.subtitle, 24, y, 162, 6) + 7;
  doc.setFont("helvetica", "normal");
  y = addWrappedText(doc, report.description, 24, y, 162, 6) + 8;

  doc.setTextColor(COLORS.plum);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Your Voice Journey", 24, y);
  y += 8;
  doc.setTextColor(COLORS.black);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  report.truths.forEach((truth) => {
    doc.setFillColor(COLORS.gold);
    doc.circle(27, y - 1.5, 1.3, "F");
    y = addWrappedText(doc, truth, 33, y, 153, 5) + 4;
  });

  y += 3;
  doc.setFillColor("#F3EFFE");
  doc.roundedRect(24, y - 5, 162, 27, 3, 3, "F");
  doc.setTextColor(COLORS.plum);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(report.recommendation, 31, y + 3);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  addWrappedText(doc, report.recommendationDescription, 31, y + 10, 148, 5);

  doc.setTextColor(COLORS.muted);
  doc.setFontSize(8);
  doc.text(`Prepared for ${report.email || "your personal reflection"}`, 24, 270);
  doc.text("Purely Divine Coaching · Nancy Marie Dixon", 24, 278);
  return doc;
}

export function createMindsetReport(report: MindsetReport) {
  const doc = new jsPDF();
  addHeader(doc, "Divine Mindset Results", "A self-worth and confidence reflection");
  const percentage = Math.round((report.score / report.maxScore) * 100);
  const tier = percentage >= 80 ? "Elevated Foundation" : percentage >= 60 ? "Growing Foundation" : "Foundation in Progress";
  let y = 88;

  if (report.name) {
    doc.setTextColor(COLORS.muted);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Prepared for ${report.name}`, 24, y);
    y += 15;
  }

  doc.setFillColor(COLORS.gold);
  doc.circle(105, y + 27, 27, "F");
  doc.setTextColor(COLORS.black);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(25);
  doc.text(`${percentage}%`, 105, y + 35, { align: "center" });
  y += 75;

  doc.setTextColor(COLORS.plum);
  doc.setFontSize(18);
  doc.text(tier, 24, y);
  y += 12;
  doc.setTextColor(COLORS.black);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  y = addWrappedText(
    doc,
    "Your results offer a starting point for reflection. Continue strengthening the beliefs, boundaries, and practices that support your God-given voice.",
    24,
    y,
    162,
    6,
  ) + 14;

  doc.setFillColor("#F3EFFE");
  doc.roundedRect(24, y - 5, 162, 34, 3, 3, "F");
  doc.setTextColor(COLORS.plum);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("A grounding reminder", 31, y + 4);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  addWrappedText(doc, '“We rise to the level of our self-worth. Full stop.”', 31, y + 13, 148, 6);

  doc.setTextColor(COLORS.muted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Score: ${report.score} of ${report.maxScore}${report.email ? ` · ${report.email}` : ""}`, 24, 270);
  doc.text("Purely Divine Coaching · Nancy Marie Dixon", 24, 278);
  return doc;
}

export function downloadVoiceQuizReport(report: VoiceQuizReport) {
  createVoiceQuizReport(report).save("purely-divine-voice-profile.pdf");
}

export function downloadMindsetReport(report: MindsetReport) {
  createMindsetReport(report).save("purely-divine-mindset-results.pdf");
}

export type { MindsetReport, VoiceQuizReport };

export const mindsetTierForPercentage = (percentage: number) =>
  percentage >= 80 ? "Elevated Foundation" : percentage >= 60 ? "Growing Foundation" : "Foundation in Progress";
