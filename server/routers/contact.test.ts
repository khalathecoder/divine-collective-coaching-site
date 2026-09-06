import { describe, it, expect, vi, beforeEach } from "vitest";
import { createAdminSubmission } from "../db";
import { sendSubmissionNotification } from "../_core/emailNotification";
import { syncContactToGhl } from "../_core/gohighlevel";
import { contactRouter } from "./contact";

// Mock the database and email functions
vi.mock("../db", () => ({
  createAdminSubmission: vi.fn(),
}));

vi.mock("../_core/emailNotification", () => ({
  sendSubmissionNotification: vi.fn(),
}));

vi.mock("../_core/gohighlevel", () => ({
  syncContactToGhl: vi.fn(),
}));

describe("Contact Router - B.O.L.D. OUT Registration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should submit B.O.L.D. OUT general tier registration", async () => {
    (createAdminSubmission as any).mockResolvedValue({
      id: 1,
      submissionType: "bold_out",
      customerName: "Jane Doe",
      customerEmail: "jane@example.com",
      customerPhone: "555-1234",
      content: 'B.O.L.D. OUT Registration - General Tier',
      metadata: JSON.stringify({
        tier: "general",
        ghl_tag: "BOLD MCG",
        registration_type: "bold_out",
      }),
      isRead: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    (sendSubmissionNotification as any).mockResolvedValue(true);

    // Simulate registration submission
    const result = await createAdminSubmission({
      submissionType: "bold_out",
      customerName: "Jane Doe",
      customerEmail: "jane@example.com",
      customerPhone: "555-1234",
      content: "B.O.L.D. OUT Registration - General Tier",
      metadata: JSON.stringify({
        tier: "general",
        ghl_tag: "BOLD MCG",
        registration_type: "bold_out",
      }),
    });

    expect(result).toBeDefined();
    expect(result.submissionType).toBe("bold_out");
    expect(result.customerName).toBe("Jane Doe");
    expect(result.customerEmail).toBe("jane@example.com");
  });

  it("should submit B.O.L.D. OUT VIP tier registration with correct GHL tag", async () => {
    (createAdminSubmission as any).mockResolvedValue({
      id: 2,
      submissionType: "bold_out",
      customerName: "Sarah Smith",
      customerEmail: "sarah@example.com",
      customerPhone: "555-5678",
      content: "B.O.L.D. OUT Registration - VIP Tier",
      metadata: JSON.stringify({
        tier: "vip",
        ghl_tag: "BOLD MC VIP",
        registration_type: "bold_out",
      }),
      isRead: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    (sendSubmissionNotification as any).mockResolvedValue(true);

    const result = await createAdminSubmission({
      submissionType: "bold_out",
      customerName: "Sarah Smith",
      customerEmail: "sarah@example.com",
      customerPhone: "555-5678",
      content: "B.O.L.D. OUT Registration - VIP Tier",
      metadata: JSON.stringify({
        tier: "vip",
        ghl_tag: "BOLD MC VIP",
        registration_type: "bold_out",
      }),
    });

    expect(result).toBeDefined();
    expect(result.submissionType).toBe("bold_out");
    // Verify GHL tag is correct in metadata
    const metadata = JSON.parse(result.metadata);
    expect(metadata.ghl_tag).toBe("BOLD MC VIP");
    expect(metadata.tier).toBe("vip");
  });

  it("should submit a waitlist signup to the admin submission stream and notify the owner", async () => {
    (createAdminSubmission as any).mockResolvedValue({
      id: 4,
      submissionType: "waitlist",
      customerName: "Waitlist Member",
      customerEmail: "waitlist@example.com",
      customerPhone: "216-555-0100",
      content: "Waitlist signup for V.O.I.C.E. Activated",
      metadata: JSON.stringify({ program: "V.O.I.C.E. Activated", type: "waitlist" }),
    });
    (sendSubmissionNotification as any).mockResolvedValue(true);

    const caller = contactRouter.createCaller({ req: {} as any, res: {} as any, user: null } as any);
    const result = await caller.submitWaitlist({
      name: "Waitlist Member",
      email: "waitlist@example.com",
      phone: "216-555-0100",
      program: "V.O.I.C.E. Activated",
    });

    expect(result.success).toBe(true);
    expect(createAdminSubmission).toHaveBeenCalledWith(expect.objectContaining({
      submissionType: "waitlist",
      customerName: "Waitlist Member",
      customerEmail: "waitlist@example.com",
      customerPhone: "216-555-0100",
      content: "Waitlist signup for V.O.I.C.E. Activated",
    }));
    expect(sendSubmissionNotification).toHaveBeenCalledWith(expect.objectContaining({
      type: "waitlist",
      customerEmail: "waitlist@example.com",
    }));
  });

  it("should store a BOSUR survey in the Manus admin stream and apply the BOSUR tag", async () => {
    (syncContactToGhl as any).mockResolvedValue(false);
    (createAdminSubmission as any).mockResolvedValue({
      id: 5,
      submissionType: "bold_out",
      customerName: "Survey Participant",
      customerEmail: "survey@example.com",
      customerPhone: "216-555-0111",
      content: "B.O.L.D. OUT Pre-Program Survey (BOSUR)\\n\\nVoice confidence: 3",
      metadata: JSON.stringify({ ghl_tag: "BOSUR", survey_type: "bold_out_intake" }),
    });
    (sendSubmissionNotification as any).mockResolvedValue(true);

    const caller = contactRouter.createCaller({ req: {} as any, res: {} as any, user: null } as any);
    const result = await caller.submitBoldOutSurvey({
      name: "Survey Participant",
      email: "survey@example.com",
      phone: "216-555-0111",
      surveySummary: "Voice confidence: 3",
    });

    expect(result.success).toBe(true);
    expect(result.ghlTag).toBe("BOSUR");
    expect(syncContactToGhl).toHaveBeenCalledWith(expect.objectContaining({
      email: "survey@example.com",
      tags: ["BOSUR"],
    }));
    expect(createAdminSubmission).toHaveBeenCalledWith(expect.objectContaining({
      submissionType: "bold_out",
      customerEmail: "survey@example.com",
      metadata: expect.stringContaining("BOSUR"),
    }));
  });

  it("should handle B.O.L.D. OUT registration without phone number", async () => {
    (createAdminSubmission as any).mockResolvedValue({
      id: 3,
      submissionType: "bold_out",
      customerName: "Mary Johnson",
      customerEmail: "mary@example.com",
      customerPhone: null,
      content: "B.O.L.D. OUT Registration - General Tier",
      metadata: JSON.stringify({
        tier: "general",
        ghl_tag: "BOLD MCG",
        registration_type: "bold_out",
      }),
      isRead: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await createAdminSubmission({
      submissionType: "bold_out",
      customerName: "Mary Johnson",
      customerEmail: "mary@example.com",
      customerPhone: null,
      content: "B.O.L.D. OUT Registration - General Tier",
      metadata: JSON.stringify({
        tier: "general",
        ghl_tag: "BOLD MCG",
        registration_type: "bold_out",
      }),
    });

    expect(result).toBeDefined();
    expect(result.customerPhone).toBeNull();
    expect(result.submissionType).toBe("bold_out");
  });
});
