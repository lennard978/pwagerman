// Words are whitespace-independent Unicode letter/number runs. Internal hyphens
// and apostrophes stay in the same token, so compounds such as "E-Mail" and
// elisions such as "geht's" count as one word. Punctuation and line breaks do not.
const WORD_PATTERN = /[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu;

export const getWritingWords = (value = "") => String(value).match(WORD_PATTERN) || [];
export const countWritingWords = (value = "") => getWritingWords(value).length;
export const countWritingParagraphs = (value = "") => String(value).trim()
  ? String(value).trim().split(/\n\s*\n+/).filter((paragraph) => paragraph.trim()).length
  : 0;

export const getWordTargetGuidance = (count, target) => {
  if (!count) return `Aim for about ${target} words; the target is guidance, not a hard cutoff.`;
  const ratio = count / target;
  if (ratio < 0.7) return "You may need more detail to cover every requested point.";
  if (ratio > 1.35) return "Consider whether every sentence helps answer the task.";
  return "Your length is close to the suggested target. Focus on clarity and task fulfilment.";
};
