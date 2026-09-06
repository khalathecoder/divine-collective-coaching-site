// @vitest-environment jsdom

import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import StandaloneAssessment from "./StandaloneAssessment";

const NAVIGATION_LABELS = new Set([
  "Back",
  "Next",
  "See Results",
  "Send Results",
  "Skip",
  "Download Branded PDF",
  "Retake Quiz",
  "Retake Assessment",
  "Close Voice Activation Quiz",
  "Close Divine Mindset Assessment",
]);

function getAnswerButtons(panel: HTMLElement) {
  return Array.from(panel.querySelectorAll("button")).filter((button) => {
    const label = button.textContent?.trim() ?? "";
    return label.length > 0 && !NAVIGATION_LABELS.has(label) && !button.hasAttribute("aria-label");
  });
}

async function completeAssessment(panel: HTMLElement, questionCount: number) {
  for (let question = 0; question < questionCount; question += 1) {
    const answer = getAnswerButtons(panel)[0];
    if (!answer) throw new Error(`Assessment answer missing at question ${question + 1}`);
    fireEvent.click(answer);

    const nextLabel = question === questionCount - 1 ? "See Results" : "Next";
    const next = Array.from(panel.querySelectorAll("button")).find((button) => button.textContent?.trim() === nextLabel);
    if (!next) throw new Error(`Assessment navigation missing at question ${question + 1}`);
    fireEvent.click(next);
    await waitFor(() => {
      if (question < questionCount - 1) {
        expect(panel.textContent).toContain(`Question ${question + 2} of ${questionCount}`);
      } else {
        expect(panel.textContent).toContain("Get Your Full Results");
      }
    });
  }

  fireEvent.click(screen.getByRole("button", { name: "Skip" }));
}

describe("persistent assessment routes", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/voice-quiz?from=%2F");
  });

  afterEach(() => {
    cleanup();
  });

  it("completes the Voice Quiz and preserves results and return controls", async () => {
    render(<StandaloneAssessment kind="voice" />);
    const panel = screen.getByRole("region", { name: "Voice Quiz" });

    fireEvent.click(await screen.findByRole("button", { name: "Begin the Quiz" }));
    await waitFor(() => expect(panel.textContent).toContain("Question 1 of 8"));
    await completeAssessment(panel, 8);

    expect(screen.getByRole("button", { name: "Download Branded PDF" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Retake Quiz" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Close Voice Activation Quiz" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Close Voice Activation Quiz" }));
    await waitFor(() => expect(window.location.pathname).toBe("/"));
  });

  it("completes the Divine Mindset Assessment and returns to Shop", async () => {
    window.history.pushState({}, "", "/divine-mindset-assessment?from=%2Fshop");
    render(<StandaloneAssessment kind="mindset" />);
    const panel = screen.getByRole("region", { name: "Divine Mindset Assessment" });

    fireEvent.click(await screen.findByRole("button", { name: "Begin Assessment" }));
    await waitFor(() => expect(panel.textContent).toContain("Question 1 of 6"));
    await completeAssessment(panel, 6);

    expect(screen.getByRole("button", { name: "Download Branded PDF" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Retake Assessment" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Close Divine Mindset Assessment" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Close Divine Mindset Assessment" }));
    await waitFor(() => expect(window.location.pathname).toBe("/shop"));
  });
});
