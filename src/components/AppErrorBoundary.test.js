import React from "react";
import { render, screen } from "@testing-library/react";
import { AppErrorBoundary } from "./AppErrorBoundary";

const Broken = () => { throw new Error("release-audit-test"); };

test("route rendering failures show a recovery screen without clearing local data", () => {
  localStorage.setItem("asenda.german-b1.test", "preserved");
  const originalError = console.error;
  console.error = jest.fn();
  try {
    render(<AppErrorBoundary><Broken /></AppErrorBoundary>);
  } finally {
    console.error = originalError;
  }
  expect(screen.getByRole("alert").textContent).toContain("The page could not be displayed");
  expect(screen.getByRole("link", { name: "Return to German B1 Home" }).getAttribute("href")).toBe("/pwagerman/home");
  expect(localStorage.getItem("asenda.german-b1.test")).toBe("preserved");
});
