import { listeningForms } from "../data/listeningForms";
import { getObjective30ResultScore, hasPassedObjective30Module } from "./objectiveScoreTable";
import { scoreListeningForm } from "./scoreListeningModule";

describe("Listening objective scoring", () => {
  test.each([[30, 100], [29, 97], [28, 93], [27, 90], [20, 67], [19, 63], [18, 60], [17, 57], [1, 3], [0, 0]])("maps %i raw points to %i result points", (raw, result) => {
    expect(getObjective30ResultScore(raw)).toBe(result);
  });

  test("uses the 18/30 pass boundary", () => {
    expect(hasPassedObjective30Module(18)).toBe(true);
    expect(hasPassedObjective30Module(17)).toBe(false);
  });

  test("scores correct, incorrect, and unanswered items without module-specific duplication", () => {
    const form = listeningForms[0];
    const items = form.parts.flatMap(({ items }) => items);
    const eighteenAnswers = Object.fromEntries(items.slice(0, 18).map((item) => [item.id, item.correctAnswer]));
    const passing = scoreListeningForm(form, eighteenAnswers);
    expect(passing).toMatchObject({ rawScore: 18, total: 30, resultScore: 60, passed: true });
    expect(scoreListeningForm(form, {}).resultScore).toBe(0);
    expect(scoreListeningForm(form, Object.fromEntries(items.map((item) => [item.id, item.correctAnswer])))).toMatchObject({ rawScore: 30, resultScore: 100, passed: true });
  });
});
