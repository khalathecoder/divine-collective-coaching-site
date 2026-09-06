import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  sendMail: vi.fn(),
  verify: vi.fn(),
  createTransport: vi.fn(),
}));

vi.mock("nodemailer", () => ({
  default: {
    createTransport: mocks.createTransport,
  },
}));

import { getPrivateEmailConfig, sendPrivateEmail } from "./privateEmail";

describe("Private Email delivery observability", () => {
  it("returns provider acceptance metadata without exposing credentials", async () => {
    const accepted = {
      accepted: ["info@dicollectivellc.com"],
      rejected: [],
      response: "250 2.0.0 Ok: queued as diagnostic-test",
      messageId: "<diagnostic-test@dicollectivellc.com>",
    };
    mocks.sendMail.mockResolvedValueOnce(accepted);
    mocks.createTransport.mockReturnValueOnce({ sendMail: mocks.sendMail });

    const result = await sendPrivateEmail({
      to: "info@dicollectivellc.com",
      subject: "observability test",
      text: "controlled test",
    });

    expect(result).toEqual(accepted);
    expect(result.messageId).toContain("diagnostic-test");
    expect(result.response).toContain("250 2.0.0");
    expect(mocks.sendMail).toHaveBeenCalledWith({
      from: getPrivateEmailConfig().from,
      to: "info@dicollectivellc.com",
      subject: "observability test",
      text: "controlled test",
      html: undefined,
    });
    expect(JSON.stringify(result)).not.toContain(getPrivateEmailConfig().password);
  });
});
