import { readingForms } from "../data/readingForms";
import { scoreReadingForm } from "./scoreObjectiveModule";
import { READING_SCORE_TABLE, getReadingResultScore, hasPassedReading } from "./readingScoreTable";

describe("Reading score conversion", () => {
  test("defines every raw score explicitly", () => {
    expect(Object.keys(READING_SCORE_TABLE)).toHaveLength(31);
    expect(getReadingResultScore(30)).toBe(100);
    expect(getReadingResultScore(29)).toBe(97);
    expect(getReadingResultScore(28)).toBe(93);
    expect(getReadingResultScore(18)).toBe(60);
    expect(getReadingResultScore(17)).toBe(57);
    expect(getReadingResultScore(1)).toBe(3);
    expect(getReadingResultScore(0)).toBe(0);
    expect(hasPassedReading(18)).toBe(true);
    expect(hasPassedReading(17)).toBe(false);
  });

  test("scores a complete answer set and produces analytics", () => {
    const form = readingForms[0];
    const answers = Object.fromEntries(form.parts.flatMap(({ items }) => items).map((item) => [item.id, item.correctAnswer]));
    const score = scoreReadingForm(form, answers);
    expect(score).toMatchObject({ rawScore: 30, total: 30, resultScore: 100, passed: true });
    expect(score.partBreakdown).toHaveLength(5);
    expect(Object.keys(score.skillPerformance).length).toBeGreaterThan(5);
    expect(score.graded.every(({ correct }) => correct)).toBe(true);
  });

  test("uses accuracy rather than the 30-item table for part practice", () => {
    const form = { ...readingForms[0], parts: [readingForms[0].parts[0]] };
    const answers = Object.fromEntries(form.parts[0].items.slice(0, 3).map((item) => [item.id, item.correctAnswer]));
    expect(scoreReadingForm(form, answers).resultScore).toBe(50);
  });
});
