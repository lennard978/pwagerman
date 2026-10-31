import { GERMAN_B1_LEXEMES } from "./lexemes";
import WORTLISTE_COVERAGE_SUMMARY from "./wortlisteCoverageSummary.json";

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
  rawReferenceRecords: WORTLISTE_COVERAGE_SUMMARY.rawReferenceRecordCount,
  normalizedReferenceItems: WORTLISTE_COVERAGE_SUMMARY.normalizedLexicalUnitCount,
  variantGroups: WORTLISTE_COVERAGE_SUMMARY.variantGroups,
  duplicateMergedGroups: WORTLISTE_COVERAGE_SUMMARY.duplicateMergedGroups,
  productionLexemes: GERMAN_B1_LEXEMES.length,
  coveredReferenceItems: WORTLISTE_COVERAGE_SUMMARY.coveredCount,
  partiallyCoveredReferenceItems: WORTLISTE_COVERAGE_SUMMARY.partiallyCoveredCount,
  uncoveredReferenceItems: WORTLISTE_COVERAGE_SUMMARY.uncoveredCount,
  coveredPercent: WORTLISTE_COVERAGE_SUMMARY.coveragePercentage,
  sourceSha256: WORTLISTE_COVERAGE_SUMMARY.sourceSha256,
  reviewDate: WORTLISTE_COVERAGE_SUMMARY.reviewDate,
  status: "expanded-reviewed-inventory",
});
