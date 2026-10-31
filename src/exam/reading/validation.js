import { READING_PART_CONFIG } from "../config/goetheB1";

const PLACEHOLDER_PATTERN = /\b(todo|tbd|lorem|placeholder)\b/i;
const SERBIAN_PATTERN = /[čćšđž]|\b(tačno|netačno|pitanje|odgovor)\b/i;

const textValues = (value) => {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(textValues);
  if (value && typeof value === "object") return Object.values(value).flatMap(textValues);
  return [];
};

export const validateReadingForms = (forms) => {
  const errors = [];
  const formIds = new Set();
  const itemIds = new Set();
  const prompts = new Set();

  if (forms.length !== 3) errors.push(`Expected 3 forms, received ${forms.length}.`);

  forms.forEach((form) => {
    if (formIds.has(form.id)) errors.push(`Duplicate form id: ${form.id}.`);
    formIds.add(form.id);
    if (form.module !== "reading" || form.level !== "B1" || form.durationSeconds !== 3900) {
      errors.push(`${form.id} has invalid module metadata.`);
    }
    if (form.parts.length !== 5) errors.push(`${form.id} must contain five parts.`);

    READING_PART_CONFIG.forEach((expected, index) => {
      const part = form.parts[index];
      if (!part) return;
      if (
        part.number !== expected.number ||
        part.type !== expected.type ||
        part.recommendedSeconds !== expected.recommendedSeconds ||
        part.items.length !== expected.itemCount
      ) {
        errors.push(`${form.id} part ${expected.number} does not match the configured architecture.`);
      }
      const textIds = new Set(part.texts.map(({ id }) => id));
      part.items.forEach((item) => {
        if (itemIds.has(item.id)) errors.push(`Duplicate item id: ${item.id}.`);
        itemIds.add(item.id);
        if (prompts.has(item.prompt)) errors.push(`Duplicate prompt: ${item.prompt}.`);
        prompts.add(item.prompt);
        const optionIds = item.options.map(({ id }) => String(id));
        if (new Set(optionIds).size !== optionIds.length) errors.push(`${item.id} has duplicate option ids.`);
        if (!optionIds.includes(String(item.correctAnswer))) errors.push(`${item.id} has an invalid correct answer.`);
        if (!item.explanation || !item.evidence || !item.skillTags?.length) errors.push(`${item.id} lacks feedback metadata.`);
        if (item.textRef && !textIds.has(item.textRef) && part.number !== 3) errors.push(`${item.id} has an invalid text reference.`);
      });
      if (part.number === 2 && part.texts.length !== 2) errors.push(`${form.id} part 2 needs two texts.`);
      if (part.number === 3) {
        const adIds = new Set((part.advertisements || []).map(({ id }) => id));
        const answers = part.items.map(({ correctAnswer }) => String(correctAnswer));
        const nonZero = answers.filter((answer) => answer !== "0");
        if (adIds.size !== 10) errors.push(`${form.id} part 3 needs ten advertisements.`);
        if (!answers.includes("0")) errors.push(`${form.id} part 3 needs a no-match answer.`);
        if (new Set(nonZero).size !== nonZero.length) errors.push(`${form.id} part 3 reuses a correct advertisement.`);
        if (nonZero.some((answer) => !adIds.has(answer))) errors.push(`${form.id} part 3 references an unknown advertisement.`);
      }
    });

    const allStrings = textValues(form);
    if (allStrings.some((value) => PLACEHOLDER_PATTERN.test(value))) errors.push(`${form.id} contains placeholder content.`);
    if (allStrings.some((value) => SERBIAN_PATTERN.test(value))) errors.push(`${form.id} contains Serbian content.`);
    if (form.parts.flatMap(({ items }) => items).length !== 30) errors.push(`${form.id} must contain exactly 30 items.`);
  });

  return { valid: errors.length === 0, errors, itemCount: itemIds.size };
};
