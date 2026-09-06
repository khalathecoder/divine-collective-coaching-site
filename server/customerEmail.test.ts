import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  sendPrivateEmail: vi.fn().mockResolvedValue({ messageId: "test-message-id" }),
  syncContactToGhl: vi.fn().mockResolvedValue(false),
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

vi.mock("./_core/privateEmail", () => ({ sendPrivateEmail: mocks.sendPrivateEmail }));
vi.mock("./_core/gohighlevel", () => ({ syncContactToGhl: mocks.syncContactToGhl }));
vi.mock("./_core/notification", () => ({ notifyOwner: mocks.notifyOwner }));

import {
  buildBoldOutConfirmationMessage,
  getPreferredCustomerName,
  sendBoldOutConfirmationEmail,
} from "./_core/customerEmail";

describe("B.O.L.D. OUT Customer Confirmation Emails", () => {
  it("uses the full name and renders prominent clickable workbook and survey links", async () => {
    mocks.sendPrivateEmail.mockClear();
    mocks.syncContactToGhl.mockClear();
    mocks.notifyOwner.mockClear();

    const result = await sendBoldOutConfirmationEmail({
      customerName: "Jane Doe",
      customerEmail: "jane@example.com",
      tier: "general",
      productName: "B.O.L.D. OUT Voice Activation Experience™",
      surveyToken: "survey-token",
    });

    expect(result).toBe(true);
    expect(mocks.sendPrivateEmail).toHaveBeenCalledTimes(1);
    const message = mocks.sendPrivateEmail.mock.calls[0][0];
    expect(message.to).toBe("jane@example.com");
    expect(message.subject).toContain("Your B.O.L.D. OUT Voice Activation Experience");
    expect(message.subject).toContain("participant receipt");
    expect(message.subject).toContain("Jane Doe");
    expect(message.text).toContain("Dear Jane Doe,");
    expect(message.text).not.toContain("Dear jane@example.com,");
    expect(message.text).toContain("September 12, 2026");
    expect(message.html).toContain('href="https://');
    expect(message.html).toContain("Download the Participant Workbook");
    expect(message.html).toContain("https://dicollectivellc.com/manus-storage/Participant_Workbook_BOLD_OUT_Masterclass_16d991e8.docx");
    expect(message.html).toContain("Complete or Save the Private Survey");
    expect(message.html).toContain("https://dicollectivellc.com/bold-out-intake?token=survey-token");
    expect(message.html).toContain("color:#ffffff");
    expect(message.html).toContain("background:#f0c76a;color:#111111");
    expect(mocks.syncContactToGhl).toHaveBeenCalledWith(expect.objectContaining({ name: "Jane Doe", tags: ["BOLD MCG"] }));
    expect(mocks.notifyOwner).toHaveBeenCalledWith(expect.objectContaining({
      title: expect.stringContaining("[Internal Audit]"),
      content: expect.stringContaining("Internal audit only — this is not the participant-facing receipt."),
    }));
  });

  it("prefers the full Stripe customer name over an email-like metadata value", () => {
    expect(getPreferredCustomerName("Nancy Marie Dixon", "nmd.dixon", "nmd.dixon@gmail.com")).toBe("Nancy Marie Dixon");
    expect(getPreferredCustomerName("nmd.dixon", "nmd.dixon@gmail.com", "nmd.dixon@gmail.com")).toBe("there");
  });

  it("falls back to a neutral salutation when no full name is available", () => {
    const message = buildBoldOutConfirmationMessage({
      customerName: "jane@example.com",
      customerEmail: "jane@example.com",
      tier: "general",
      productName: "B.O.L.D. OUT Voice Activation Experience™",
    });

    expect(message.text).toContain("Dear there,");
    expect(message.html).toContain("Dear there,");
  });
});
