import { GERMAN_B1_LEXEMES } from "./lexemes";

export const APPROX_OFFICIAL_REFERENCE_SIZE = 2400;

const ARTICLES = /^(der|die|das)\s+/i;

export const normalizeReferenceKey = (value, { reflexive = false } = {}) => {
  const normalized = String(value || "")
    .normalize("NFKC")
    .trim()
    .toLocaleLowerCase("de-DE")
    .replace(ARTICLES, "")
    .replace(/\s*\|\s*/g, "")
    .replace(/\.{3}|…/g, "")
    .replace(/[?!.,;:]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!reflexive || normalized.startsWith("sich ")) return normalized;
  return `sich ${normalized}`;
};

export const createCoverageRecords = (lexemes = GERMAN_B1_LEXEMES) => {
  const records = new Map();
  lexemes.forEach((lexeme) => {
    const normalized = normalizeReferenceKey(
      lexeme.goetheCoverage.referenceKey,
      { reflexive: lexeme.reflexive }
    );
    const identity = `${normalized}::${lexeme.partOfSpeech}`;
    const current = records.get(identity) || {
      referenceKey: lexeme.goetheCoverage.referenceKey,
      normalized,
      partOfSpeech: lexeme.partOfSpeech,
      covered: true,
      lexemeIds: [],
      reviewed: true,
      notes: "Reviewed against the official Wortliste as a reference key; app content is original-curated.",
    };
    current.lexemeIds.push(lexeme.id);
    records.set(identity, current);
  });
  return [...records.values()];
};

export const VOCABULARY_COVERAGE = Object.freeze(createCoverageRecords());

export const VOCABULARY_COVERAGE_SUMMARY = Object.freeze({
  officialReferenceSizeApprox: APPROX_OFFICIAL_REFERENCE_SIZE,
  reviewedReferenceItems: VOCABULARY_COVERAGE.length,
  normalizedReferenceKeys: new Set(VOCABULARY_COVERAGE.map((record) => record.normalized)).size,
  duplicateOrVariantGroups: VOCABULARY_COVERAGE.filter((record) => record.lexemeIds.length > 1).length,
  productionLexemes: GERMAN_B1_LEXEMES.length,
  coveredReferenceItems: VOCABULARY_COVERAGE.length,
  uncoveredEstimate: Math.max(0, APPROX_OFFICIAL_REFERENCE_SIZE - VOCABULARY_COVERAGE.length),
  coveredPercentEstimate: Number(((VOCABULARY_COVERAGE.length / APPROX_OFFICIAL_REFERENCE_SIZE) * 100).toFixed(2)),
  status: "partial-reviewed-subset",
});
