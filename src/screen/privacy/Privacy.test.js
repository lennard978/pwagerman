import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { Privacy } from "./Privacy";

test("privacy disclosure covers local storage, recordings, TTS, and offline limits", () => {
  render(<MemoryRouter><Privacy /></MemoryRouter>);
  const content = screen.getByRole("heading", { name: "Privacy and local data" }).parentElement.parentElement.textContent;
  expect(content).toContain("localStorage and IndexedDB");
  expect(content).toContain("Recordings stay in local browser storage");
  expect(content).toContain("not uploaded");
  expect(content).toContain("text-to-speech endpoint");
  expect(content).toContain("Only a Listening form explicitly prepared in advance");
});
