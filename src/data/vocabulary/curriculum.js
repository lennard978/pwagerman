import { VOCABULARY_CATEGORIES } from "./categories";
import { GERMAN_B1_LEXEMES } from "./lexemes";

export const GermanCurriculum = Object.freeze(
  VOCABULARY_CATEGORIES.map((category) => Object.freeze({
    id: category.id,
    title: category.title,
    description: category.description,
    category: category.id,
    items: Object.freeze(
      GERMAN_B1_LEXEMES.filter((lexeme) => lexeme.categoryId === category.id)
    ),
  }))
);

export const getVocabularyCategoryProgress = (category, lexemeStates = [], completedLessons = []) => {
  const stateById = new Map(lexemeStates.map((state) => [state.lexemeId, state]));
  const known = category.items.filter((lexeme) => stateById.get(lexeme.id)?.status === "known").length;
  const learning = category.items.filter((lexeme) => stateById.get(lexeme.id)?.status === "learning").length;
  const reviewed = category.items.filter((lexeme) => Boolean(stateById.get(lexeme.id)?.lastReviewedAt)).length;
  const explicitlyComplete = completedLessons.includes(category.id);
  return {
    total: category.items.length,
    known,
    learning,
    reviewed,
    started: explicitlyComplete || reviewed > 0 || known > 0 || learning > 0,
    complete: category.items.length > 0 && (
      known === category.items.length || explicitlyComplete
    ),
  };
};
