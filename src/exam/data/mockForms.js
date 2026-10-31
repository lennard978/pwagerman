import { GOETHE_B1_MOCK_CONFIG } from "../config/goetheB1Mock";
import { readingForms } from "./readingForms";
import { listeningForms } from "./listeningForms";
import { writingForms } from "./writingForms";
import { speakingForms } from "./speakingForms";

const makeMock = (index) => Object.freeze({
  id: `de-b1-mock-${String(index + 1).padStart(3, "0")}`,
  examId: GOETHE_B1_MOCK_CONFIG.examId,
  level: GOETHE_B1_MOCK_CONFIG.level,
  contentVersion: GOETHE_B1_MOCK_CONFIG.contentVersion,
  scoringVersion: GOETHE_B1_MOCK_CONFIG.scoringVersion,
  modules: Object.freeze({
    reading: Object.freeze({ formId: readingForms[index].id, durationSeconds: 3900 }),
    listening: Object.freeze({ formId: listeningForms[index].id, durationSeconds: 2400 }),
    writing: Object.freeze({ formId: writingForms[index].id, durationSeconds: 3600 }),
    speaking: Object.freeze({
      formId: speakingForms[index].id,
      preparationSeconds: 900,
      pairDurationSeconds: 900,
      individualDurationSeconds: 600,
    }),
  }),
});

export const mockForms = Object.freeze([0, 1, 2].map(makeMock));
export const getMockForm = (id) => mockForms.find((form) => form.id === id) || mockForms[0];

export const validateMockForms = (forms = mockForms) => {
  const formIds = {
    reading: new Set(readingForms.map(({ id }) => id)),
    listening: new Set(listeningForms.map(({ id }) => id)),
    writing: new Set(writingForms.map(({ id }) => id)),
    speaking: new Set(speakingForms.map(({ id }) => id)),
  };
  const ids = new Set();
  const errors = [];
  forms.forEach((form) => {
    if (ids.has(form.id)) errors.push(`Duplicate mock ID: ${form.id}`);
    ids.add(form.id);
    Object.entries(form.modules).forEach(([moduleId, definition]) => {
      if (!formIds[moduleId]?.has(definition.formId)) errors.push(`${form.id} has invalid ${moduleId} form reference.`);
    });
  });
  return { valid: errors.length === 0, errors };
};
