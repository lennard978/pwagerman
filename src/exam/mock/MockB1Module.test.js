import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MockB1Instructions } from "./MockB1Instructions";
import { MockB1Results } from "./MockB1Results";

test("instructions expose the production Listening blocker", () => {
  render(<MemoryRouter><MockB1Instructions availability={{ available: false, developmentFixture: false }} onBegin={() => {}} /></MemoryRouter>);
  expect(screen.getByText(/Listening audio is still being prepared/i)).toBeTruthy();
  expect(screen.getByRole("button", { name: /Begin Full B1 Practice Mock/i }).disabled).toBe(true);
});

test("summary distinguishes objective and self-assessed results without an overall pass", () => {
  const session = { status: "completed", modules: {
    reading: { result: { scoreStatus: "objective", rawScore: 24, resultScore: 80, passed: true } },
    listening: { result: { scoreStatus: "objective", rawScore: 19, resultScore: 63, passed: true } },
    writing: { result: { scoreStatus: "self-assessed", rubric: { grammar: 2 } } },
    speaking: { result: { scoreStatus: "self-assessment-incomplete", rubric: {} } },
  } };
  render(<MemoryRouter><MockB1Results session={session} progress={{}} /></MemoryRouter>);
  expect(screen.getByText("80 / 100")).toBeTruthy();
  expect(screen.getByText("63 / 100")).toBeTruthy();
  expect(screen.getByText(/Productive self-assessments completed: 1 \/ 2/i)).toBeTruthy();
  expect(screen.queryByText(/You passed B1/i)).toBeNull();
  expect(screen.queryByText(/Overall pass/i)).toBeNull();
});
