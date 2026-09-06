import { describe, expect, it } from "vitest";
import { waitlistInputSchema } from "./routers/contact";

describe("Waitlist submission contract", () => {
  it("accepts a valid waitlist request with an optional phone number", () => {
    const parsed = waitlistInputSchema.parse({
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "216-555-0199",
      program: "V.O.I.C.E. Activated",
    });

    expect(parsed).toEqual({
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "216-555-0199",
      program: "V.O.I.C.E. Activated",
    });
  });

  it("rejects missing name, invalid email, or missing program", () => {
    const result = waitlistInputSchema.safeParse({
      name: "",
      email: "not-an-email",
      program: "",
    });

    expect(result.success).toBe(false);
  });
});
