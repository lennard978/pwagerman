export const LEXEME_STATUSES = Object.freeze(["new", "learning", "known"]);

export const createLexemeState = (lexemeId, overrides = {}) => ({
  id: lexemeId,
  lexemeId,
  status: LEXEME_STATUSES.includes(overrides.status) ? overrides.status : "new",
  favorite: overrides.favorite === true,
  lastReviewedAt: overrides.lastReviewedAt || null,
  nextReviewAt: overrides.nextReviewAt || null,
  correctCount: Number.isFinite(overrides.correctCount) ? overrides.correctCount : 0,
  incorrectCount: Number.isFinite(overrides.incorrectCount) ? overrides.incorrectCount : 0,
});

export const normalizeLexemeState = (value) => {
  const lexemeId = value?.lexemeId || value?.id;
  if (typeof lexemeId !== "string" || !lexemeId) return null;
  return createLexemeState(lexemeId, value);
};

export const mergeLexemeState = (lexeme, states) => ({
  ...lexeme,
  ...createLexemeState(
    lexeme.id,
    (states instanceof Map
      ? states.get(lexeme.id)
      : states.find((state) => state.lexemeId === lexeme.id)) || {}
  ),
});

export const recordLexemeAnswer = (state, correct, now = new Date()) => {
  const current = createLexemeState(state.lexemeId, state);
  const nextReview = new Date(now);
  nextReview.setDate(nextReview.getDate() + (correct ? 3 : 0));
  return {
    ...current,
    status: current.status === "known" && !correct ? "learning" : current.status === "new" ? "learning" : current.status,
    lastReviewedAt: now.toISOString(),
    nextReviewAt: nextReview.toISOString(),
    correctCount: current.correctCount + (correct ? 1 : 0),
    incorrectCount: current.incorrectCount + (correct ? 0 : 1),
  };
};

export const isReviewDue = (state, now = new Date()) =>
  Boolean(state?.nextReviewAt) && new Date(state.nextReviewAt).getTime() <= now.getTime();
