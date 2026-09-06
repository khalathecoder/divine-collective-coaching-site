// @ts-ignore
import { jsPDF } from "jspdf";

interface BoldOutPdfData {
  name: string;
  email: string;
  answers: Record<number, string>;
  questions: Array<{ id: number; title: string; prompt: string; options?: Array<{ value: string; label: string }> }>;
}

export function generateBoldOutPdf(data: BoldOutPdfData) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const primaryColor = [212, 178, 78]; // Gold #D4B24E
  const darkBg = [18, 18, 24]; // #121218
  const textColor = [50, 50, 50];

  // Header background
  doc.setFillColor(darkBg[0], darkBg[1], darkBg[2]);
  doc.rect(0, 0, 210, 45, "F");

  // Gold accent bar
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 45, 210, 3, "F");

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("B.O.L.D. OUT Pre-Program Intake Summary", 15, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("B.O.L.D. OUT Voice Activation Experience™ (September 12, 2026) — Tagged: BOSUR", 15, 30);

  // Participant info
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Participant Details:", 15, 58);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Name: ${data.name}`, 15, 65);
  doc.text(`Email: ${data.email}`, 15, 72);
  doc.text(`Submission Date: ${new Date().toLocaleDateString()}`, 15, 79);

  doc.setDrawColor(200, 200, 200);
  doc.line(15, 85, 195, 85);

  let y = 95;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Intake Responses:", 15, y);
  y += 8;

  data.questions.forEach((q, index) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(`Q${index + 1}: ${q.title}`, 15, y);
    y += 5;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    const answerVal = data.answers[q.id] || "No response provided";
    
    let displayAnswer = answerVal;
    if (q.options) {
      const matchedOpt = q.options.find(opt => opt.value === answerVal);
      if (matchedOpt) displayAnswer = matchedOpt.label;
    }

    const splitText = doc.splitTextToSize(displayAnswer, 180);
    doc.text(splitText, 15, y);
    y += (splitText.length * 5) + 8;
  });

  const pageCount = (doc.internal as any).getNumberOfPages ? (doc.internal as any).getNumberOfPages() : doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Purely Divine Coaching / Divine Collective LLC — Confidential Participant Intake", 15, 290);
  }

  doc.save(`BOLD_OUT_Intake_${data.name.replace(/\s+/g, "_")}.pdf`);
}
