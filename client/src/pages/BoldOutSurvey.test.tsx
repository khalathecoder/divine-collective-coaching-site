// @vitest-environment jsdom

import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import BoldOutSurvey from "./BoldOutSurvey";
import { BOLD_OUT_SURVEY_DRAFT_KEY } from "@/lib/boldOutSurveyDraft";

class TestResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = TestResizeObserver;

const mutateAsync = vi.fn();
const paidAccessResult = { data: { valid: true, name: "", email: "", phone: "" }, isLoading: false };

vi.mock("@/components/BrandShell", () => ({
  default: ({ children }: { children: React.ReactNode }) => <main>{children}</main>,
}));

vi.mock("@/lib/trpc", () => ({
  trpc: {
    contact: {
      getBoldOutSurveyAccess: {
        useQuery: () => paidAccessResult,
      },
      submitBoldOutSurvey: {
        useMutation: () => ({ mutateAsync }),
      },
    },
  },
}));

vi.mock("@/lib/pdfGenerator", () => ({
  generateBoldOutPdf: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("framer-motion", () => ({
  motion: { div: "div" },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  mutateAsync.mockReset();
});

describe("B.O.L.D. OUT survey controls", () => {
  it("shows the current step and visual progress percentage", () => {
    render(<BoldOutSurvey />);

    expect(screen.getByText("Step 1 of 10")).toBeTruthy();
    expect(screen.getByText("10% complete")).toBeTruthy();
    expect(screen.getByRole("progressbar", { name: "Survey progress: 10 percent complete" })).toBeTruthy();
    expect(screen.getByText("Begin")).toBeTruthy();
    expect(screen.getByText("Almost there")).toBeTruthy();
    expect(screen.getByText("Complete")).toBeTruthy();
    expect(screen.getByText("Voice Activation Intake Assessment").className).toContain("text-white");
    expect(screen.getByText(/Complete your pre-masterclass reflection/).className).toContain("text-white\/80");
    expect(screen.getAllByText("Voice Confidence & Expression").some((element) => element.className.includes("text-white") || element.parentElement?.className.includes("text-white"))).toBe(true);
  });

  it("exposes a clear save-and-continue-later action that persists the current draft", () => {
    render(<BoldOutSurvey />);

    const saveButton = screen.getByRole("button", { name: "Save and Continue Later" });
    expect(saveButton).toBeTruthy();

    fireEvent.click(saveButton);

    const savedDraft = window.localStorage.getItem(BOLD_OUT_SURVEY_DRAFT_KEY);
    expect(savedDraft).toBeTruthy();
    expect(JSON.parse(savedDraft ?? "{}")).toMatchObject({
      currentIndex: 0,
      answers: {},
      contactInfo: { name: "", email: "", phone: "" },
    });
  });
});
