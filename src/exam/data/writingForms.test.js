import { writingForms, writingTaskBank } from "./writingForms";
import { validateWritingForms } from "../writing/validation";

describe("German B1 Writing content", () => {
  test("contains three valid complete forms and an 18-prompt original bank", () => {
    const result = validateWritingForms(writingForms, writingTaskBank);
    expect(result).toEqual(expect.objectContaining({ valid: true, formCount: 3, completeTaskCount: 9, promptBankSize: 18 }));
    expect(result.errors).toEqual([]);
  });

  test.each([1, 2, 3])("provides six distinct prompts for Task %s", (part) => {
    expect(writingTaskBank[part]).toHaveLength(6);
    expect(new Set(writingTaskBank[part].map(({ id }) => id))).toHaveProperty("size", 6);
    expect(new Set(writingTaskBank[part].map(({ scenario, prompt }) => `${scenario}|${prompt}`))).toHaveProperty("size", 6);
  });

  test("keeps complete-form prompts unique", () => {
    const tasks = writingForms.flatMap(({ tasks }) => tasks);
    expect(new Set(tasks.map(({ id }) => id))).toHaveProperty("size", 9);
    expect(tasks.every(({ sourceType, bulletPoints, checklist }) => sourceType === "original-exam-task" && bulletPoints.length > 0 && checklist.length > 0)).toBe(true);
  });
});
