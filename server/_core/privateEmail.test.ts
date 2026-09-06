import { describe, expect, it } from "vitest";
import { getPrivateEmailConfig, verifyPrivateEmailSmtp } from "./privateEmail";

describe("Private Email SMTP configuration", () => {
  it("loads the configured sender without exposing the password", () => {
    const config = getPrivateEmailConfig();
    expect(config.host).toBeTruthy();
    expect(config.port).toBeGreaterThan(0);
    expect(config.user).toBe("info@dicollectivellc.com");
    expect(config.from).toBe("info@dicollectivellc.com");
    expect(config.password).toBeTruthy();
  });

  it("authenticates with Private Email without sending a message", async () => {
    const result = await verifyPrivateEmailSmtp();
    expect(result).toBe(true);
  }, 20_000);
});
