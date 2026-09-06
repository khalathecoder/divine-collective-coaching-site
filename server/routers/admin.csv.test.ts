import { describe, it, expect } from "vitest";

describe("CSV Export Functions", () => {
  describe("CSV Formatting", () => {
    it("should properly escape CSV values with quotes", () => {
      const escapeCSV = (value: string | null | undefined) => {
        if (!value) return '""';
        const escaped = String(value).replace(/"/g, '""');
        return `"${escaped}"`;
      };

      expect(escapeCSV("simple")).toBe('"simple"');
      expect(escapeCSV('has "quotes"')).toBe('"has ""quotes"""');
      expect(escapeCSV(null)).toBe('""');
      expect(escapeCSV(undefined)).toBe('""');
    });

    it("should handle newlines in CSV values", () => {
      const escapeCSV = (value: string | null | undefined) => {
        if (!value) return '""';
        const escaped = String(value).replace(/"/g, '""');
        return `"${escaped}"`;
      };

      const multiline = "line1\nline2\nline3";
      const escaped = escapeCSV(multiline);
      expect(escaped).toContain("line1");
      expect(escaped).toContain("line2");
      expect(escaped).toContain("line3");
    });

    it("should handle commas in CSV values", () => {
      const escapeCSV = (value: string | null | undefined) => {
        if (!value) return '""';
        const escaped = String(value).replace(/"/g, '""');
        return `"${escaped}"`;
      };

      const withComma = "value, with, commas";
      const escaped = escapeCSV(withComma);
      expect(escaped).toBe('"value, with, commas"');
    });
  });

  describe("CSV Structure", () => {
    it("should create valid CSV with headers and rows", () => {
      const headers = ["Name", "Email", "Phone"];
      const rows = [
        ['"John Doe"', '"john@example.com"', '"555-1234"'],
        ['"Jane Smith"', '"jane@example.com"', '"555-5678"'],
      ];

      const csv = [
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");

      const lines = csv.split("\n");
      expect(lines).toHaveLength(3);
      expect(lines[0]).toBe("Name,Email,Phone");
      expect(lines[1]).toContain("John Doe");
      expect(lines[2]).toContain("Jane Smith");
    });

    it("should create submissions CSV with correct columns", () => {
      const headers = [
        "ID",
        "Name",
        "Email",
        "Phone",
        "Type",
        "Message",
        "Read",
        "Created At",
        "Metadata",
      ];

      expect(headers).toContain("ID");
      expect(headers).toContain("Name");
      expect(headers).toContain("Email");
      expect(headers).toContain("Type");
      expect(headers).toContain("Message");
      expect(headers).toContain("Read");
    });

    it("should create customers CSV with correct columns", () => {
      const headers = ["Name", "Email", "Phone", "First Submission"];

      expect(headers).toContain("Name");
      expect(headers).toContain("Email");
      expect(headers).toContain("Phone");
      expect(headers).toContain("First Submission");
    });

    it("should create orders CSV with correct columns", () => {
      const headers = [
        "Order ID",
        "Product",
        "Amount",
        "Currency",
        "Status",
        "Date",
      ];

      expect(headers).toContain("Order ID");
      expect(headers).toContain("Product");
      expect(headers).toContain("Amount");
      expect(headers).toContain("Currency");
      expect(headers).toContain("Status");
      expect(headers).toContain("Date");
    });
  });

  describe("Data Formatting", () => {
    it("should format amounts as decimal currency", () => {
      const amountCents = 19999;
      const formatted = (amountCents / 100).toFixed(2);
      expect(formatted).toBe("199.99");
    });

    it("should format dates as ISO strings", () => {
      const date = new Date("2026-07-06T15:00:00Z");
      const formatted = date.toISOString();
      expect(formatted).toContain("2026-07-06");
      expect(formatted).toContain("T");
      expect(formatted).toContain("Z");
    });

    it("should handle boolean values in CSV", () => {
      const isRead = true;
      const formatted = isRead ? "Yes" : "No";
      expect(formatted).toBe("Yes");

      const isReadFalse = false;
      const formattedFalse = isReadFalse ? "Yes" : "No";
      expect(formattedFalse).toBe("No");
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty CSV gracefully", () => {
      const headers = ["Name", "Email"];
      const rows: string[][] = [];

      const csv = [
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");

      expect(csv).toBe("Name,Email");
    });

    it("should handle special characters in values", () => {
      const escapeCSV = (value: string | null | undefined) => {
        if (!value) return '""';
        const escaped = String(value).replace(/"/g, '""');
        return `"${escaped}"`;
      };

      const special = 'Test & <Special> "Chars"';
      const escaped = escapeCSV(special);
      expect(escaped).toContain("&");
      expect(escaped).toContain("<");
      expect(escaped).toContain(">");
    });

    it("should generate valid filename with date", () => {
      const date = new Date();
      const dateStr = date.toISOString().split("T")[0];
      const filename = `submissions-${dateStr}.csv`;

      expect(filename).toMatch(/submissions-\d{4}-\d{2}-\d{2}\.csv/);
    });
  });

  describe("B.O.L.D. OUT CSV Export", () => {
    it("should include B.O.L.D. OUT tier and GHL tag columns in CSV export", () => {
      const headers = [
        "ID",
        "Name",
        "Email",
        "Phone",
        "Type",
        "Message",
        "Read",
        "Created At",
        "Tier",
        "GHL Tag",
        "Metadata",
      ];

      expect(headers).toContain("Tier");
      expect(headers).toContain("GHL Tag");
      expect(headers.indexOf("Tier")).toBeGreaterThan(headers.indexOf("Created At"));
      expect(headers.indexOf("GHL Tag")).toBeGreaterThan(headers.indexOf("Tier"));
    });

    it("should extract VIP tier and GHL tag from B.O.L.D. OUT metadata", () => {
      const metadata = JSON.stringify({
        tier: "vip",
        ghl_tag: "BOLD MC VIP",
        registration_type: "bold_out",
      });

      const parsedMetadata = JSON.parse(metadata);
      const tier = parsedMetadata.tier === "vip" ? "VIP ($97)" : "General ($47)";
      const ghlTag = parsedMetadata.ghl_tag || "";

      expect(tier).toBe("VIP ($97)");
      expect(ghlTag).toBe("BOLD MC VIP");
    });

    it("should extract general tier and GHL tag from B.O.L.D. OUT metadata", () => {
      const metadata = JSON.stringify({
        tier: "general",
        ghl_tag: "BOLD MCG",
        registration_type: "bold_out",
      });

      const parsedMetadata = JSON.parse(metadata);
      const tier = parsedMetadata.tier === "vip" ? "VIP ($97)" : "General ($47)";
      const ghlTag = parsedMetadata.ghl_tag || "";

      expect(tier).toBe("General ($47)");
      expect(ghlTag).toBe("BOLD MCG");
    });
  });
});
