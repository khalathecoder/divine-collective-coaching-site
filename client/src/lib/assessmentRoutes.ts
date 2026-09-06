export const assessmentRoutes = {
  voiceQuiz: "/voice-quiz",
  divineMindset: "/divine-mindset-assessment",
} as const;

export function assessmentHref(path: string, from: "/" | "/shop") {
  return `${path}?from=${encodeURIComponent(from)}`;
}
