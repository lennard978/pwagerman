import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { VocabularyLibrary } from "./VocabularyLibrary";
import { GermanCurriculum } from "../../data/vocabulary/curriculum";
import { createLexemeState, mergeLexemeState } from "../../data/lexemeState";

jest.mock("../../components/WordStatusActions", () => ({ WordStatusActions: () => null }));
jest.mock("../../components/CompactSoundButton", () => ({ CompactSoundButton: ({ children }) => <button type="button">{children}</button> }));

const data = GermanCurriculum.map((category, categoryIndex) => ({
  ...category,
  items: category.items.map((lexeme, index) => mergeLexemeState(lexeme, [
    createLexemeState(lexeme.id, {
      status: categoryIndex === 0 && index === 0
        ? "known"
        : categoryIndex === 0 && index === 1
          ? "learning"
          : "new",
      favorite: categoryIndex === 0 && index === 0,
    }),
  ])),
}));

test("shows balanced category counts and progress", () => {
  render(<MemoryRouter><VocabularyLibrary data={data} /></MemoryRouter>);
  expect(screen.getByRole("heading", { name: "Vocabulary" })).toBeTruthy();
  expect(screen.getByRole("link", { name: /Personal information & identity/ }).textContent).toContain("10 words");
  expect(screen.getByRole("link", { name: /Personal information & identity/ }).textContent).toContain("1 known");
});

test("searches English and German and filters by state", () => {
  render(<MemoryRouter><VocabularyLibrary data={data} /></MemoryRouter>);
  fireEvent.change(screen.getByRole("searchbox"), { target: { value: "Staatsangehörigkeit" } });
  expect(screen.getByText("nationality / citizenship")).toBeTruthy();
  expect(screen.getByText("1 matching words")).toBeTruthy();
  fireEvent.change(screen.getByRole("searchbox"), { target: { value: "" } });
  fireEvent.click(screen.getByRole("button", { name: "Known" }));
  expect(screen.getByText("1 matching words")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Learning" }));
  expect(screen.getByText("1 matching words")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Favorites" }));
  expect(screen.getByText("1 matching words")).toBeTruthy();
});
