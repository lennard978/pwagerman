import { readingForms } from "./readingForms";
import { validateReadingForms } from "../reading/validation";

describe("German B1 Reading forms", () => {
  test("contain three valid complete and unique forms", () => {
    const validation = validateReadingForms(readingForms);
    expect(validation.errors).toEqual([]);
    expect(validation.valid).toBe(true);
    expect(validation.itemCount).toBe(90);
  });

  test.each(readingForms)("$id contains all required task structures", (form) => {
    expect(form.sourceType).toBe("original-curated");
    expect(form.parts.flatMap(({ items }) => items)).toHaveLength(30);
    expect(form.parts[1].texts).toHaveLength(2);
    expect(form.parts[2].advertisements).toHaveLength(10);
    expect(form.parts[2].items.some(({ correctAnswer }) => correctAnswer === "0")).toBe(true);
  });
});
