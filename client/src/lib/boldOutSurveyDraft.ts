export const BOLD_OUT_SURVEY_DRAFT_KEY = "bold-out-intake-draft-v1";

export interface BoldOutSurveyDraft {
  answers: Record<number, string>;
  contactInfo: { name: string; email: string; phone: string };
  currentIndex: number;
  savedAt: number;
}

export function serializeBoldOutSurveyDraft(draft: BoldOutSurveyDraft): string {
  return JSON.stringify(draft);
}

export function parseBoldOutSurveyDraft(raw: string | null): BoldOutSurveyDraft | null {
  if (!raw) return null;

  try {
    const draft = JSON.parse(raw) as Partial<BoldOutSurveyDraft>;
    if (
      !draft.answers ||
      typeof draft.answers !== "object" ||
      !draft.contactInfo ||
      typeof draft.contactInfo.name !== "string" ||
      typeof draft.contactInfo.email !== "string" ||
      typeof draft.contactInfo.phone !== "string" ||
      !Number.isInteger(draft.currentIndex) ||
      !Number.isFinite(draft.savedAt)
    ) {
      return null;
    }

    const answers = draft.answers as Record<number, string>;
    const contactInfo = draft.contactInfo as { name: string; email: string; phone: string };
    const currentIndex = draft.currentIndex as number;
    const savedAt = draft.savedAt as number;

    return { answers, contactInfo, currentIndex, savedAt };
  } catch {
    return null;
  }
}
