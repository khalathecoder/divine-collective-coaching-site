export type SubmissionFilter = string | null;

export interface SubmissionSummary {
  submissionType: string;
  [key: string]: unknown;
}

export function filterSubmissions(submissions: SubmissionSummary[] | undefined, filterType: SubmissionFilter) {
  const rows = submissions || [];
  return filterType ? rows.filter((submission) => submission.submissionType === filterType) : rows;
}

export function getSubmissionTypeLabel(type: string) {
  switch (type) {
    case "contact": return "Contact Form";
    case "survey": return "Post-Purchase Survey";
    case "assessment": return "Assessment/Quiz";
    case "lead_magnet": return "Lead Magnet";
    case "waitlist": return "Waitlist Signup";
    case "bold_out": return "B.O.L.D. OUT Registration";
    case "she_found_her_voice_event": return "She Found Her Voice Event";
    default: return type;
  }
}
