const fs = require("fs");
const path = require("path");
const test = require("node:test");
const assert = require("node:assert/strict");

const root = path.join(__dirname, "..", "..");
const inventory = JSON.parse(fs.readFileSync(path.join(root, "docs", "GERMAN-B1-WORTLISTE-INVENTORY.json"), "utf8"));
const phase9Specs = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "vocabulary", "expandedLexemeSpecs.json"), "utf8"));
const phase10Specs = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "vocabulary", "phase10LexemeSpecs.json"), "utf8"));
const gapAnalysis = JSON.parse(fs.readFileSync(path.join(root, "docs", "GERMAN-B1-WORTLISTE-GAP-ANALYSIS.json"), "utf8"));
const source = fs.readFileSync(path.join(root, "src", "data", "vocabulary", "lexemes.js"), "utf8");

const baseIds = [...source.matchAll(/\b(?:noun|verb|term)\("([^"]+)",\s*"([^"]+)"/gu)]
  .map((match) => `de-b1-${match[1]}-${match[2]}`);
const expandedIds = [...phase9Specs, ...phase10Specs].map((spec) => `de-b1-${spec.categoryId}-${spec.slug}`);
const productionIds = [...baseIds, ...expandedIds];
const mappedIds = new Set(inventory.records.flatMap((record) => record.lexemeIds));

test("inventory has exact raw, normalized, variant, duplicate, and coverage totals", () => {
  assert.equal(inventory.rawRecords.length, 3218);
  assert.equal(inventory.records.length, 3176);
  assert.equal(inventory.metadata.variantGroups, 170);
  assert.equal(inventory.metadata.duplicateMergedGroups, 42);
  assert.equal(inventory.metadata.exactCoveredCount, 2186);
  assert.equal(inventory.metadata.variantCoveredCount, 10);
  assert.equal(inventory.metadata.coveredCount, 2196);
  assert.equal(inventory.metadata.partiallyCoveredCount, 0);
  assert.equal(inventory.metadata.uncoveredCount, 0);
  assert.equal(inventory.metadata.excludedWithReasonCount, 980);
  assert.equal(inventory.metadata.coveragePercentage, 69.14);
});

test("reference identities and raw extraction identities are unique", () => {
  assert.equal(new Set(inventory.rawRecords.map(({ rawRecordId }) => rawRecordId)).size, inventory.rawRecords.length);
  assert.equal(new Set(inventory.records.map(({ referenceId }) => referenceId)).size, inventory.records.length);
  assert.ok(inventory.records.every(({ coverageStatus }) =>
    ["covered", "partially-covered", "uncovered", "variant-covered", "excluded-with-reason"].includes(coverageStatus)
  ));
});

test("normalization separates article, lemma, expanded plural, and source notation", () => {
  const termin = inventory.records.find(({ normalizedLemma }) => normalizedLemma === "Termin");
  assert.deepEqual(
    { article: termin.article, lemma: termin.normalizedLemma, plural: termin.plural, notation: termin.pluralNotation },
    { article: "der", lemma: "Termin", plural: "Termine", notation: "-e" }
  );
});

test("regional and arrow variants remain represented", () => {
  assert.ok(inventory.records.some(({ region }) => region.includes("Austria")));
  assert.ok(inventory.records.some(({ region }) => region.includes("Switzerland")));
  assert.ok(inventory.records.some(({ variants }) => variants.length > 0));
});

test("all 2367 production lexemes resolve to a reference mapping", () => {
  assert.equal(productionIds.length, 2367);
  assert.equal(new Set(productionIds).size, 2367);
  assert.deepEqual(productionIds.filter((id) => !mappedIds.has(id)), []);
});

test("all 2117 expansion specs contain original learner-facing content and valid mappings", () => {
  const specs = [...phase9Specs, ...phase10Specs];
  assert.equal(phase9Specs.length, 550);
  assert.equal(phase10Specs.length, 1567);
  assert.equal(phase10Specs.filter(({ phase }) => phase === "10.3").length, 417);
  specs.forEach((spec) => {
    assert.ok(spec.source && spec.example && spec.exampleTranslation && spec.referenceKey);
    assert.doesNotMatch(`${spec.source} ${spec.example} ${spec.exampleTranslation}`, /\uFFFD|Ã.|Â.|â[\u0080-\u00BF]/u);
    assert.ok(mappedIds.has(`de-b1-${spec.categoryId}-${spec.slug}`));
  });
});

test("Phase 10.3 classifies every starting gap and resolves every partial mapping", () => {
  assert.equal(gapAnalysis.records.length, 1764);
  assert.equal(gapAnalysis.startingSnapshot.unclassifiedRecordsReviewed, 409);
  assert.equal(gapAnalysis.startingSnapshot.partialMappingsReviewed, 409);
  assert.equal(gapAnalysis.outcome.reclassifiedRecordCount, 772);
  assert.equal(gapAnalysis.outcome.partialMappingsResolved, 409);
  assert.equal(gapAnalysis.records.filter(({ finalCoverageStatus }) => finalCoverageStatus === "partially-covered").length, 0);
  assert.equal(gapAnalysis.records.filter(({ decision }) => decision === "HIGH-VALUE MISSING" || decision === "REQUIRES_HUMAN_REVIEW").length, 0);
  assert.ok(gapAnalysis.records.every(({ classifiedAs }) => classifiedAs && classifiedAs !== "other"));
});

test("every intentional exclusion has an approved explicit reason", () => {
  const approvedReasons = new Set([
    "INFLECTION_ONLY",
    "VARIANT_OF_EXISTING",
    "REGIONAL_METADATA_ONLY",
    "PROPER_NAME",
    "ABBREVIATION",
    "DUPLICATE_REFERENCE",
    "LOW_VALUE_SPECIALIST",
    "EXTRACTION_ARTIFACT",
    "NOT_STANDALONE_LEXEME",
  ]);
  const excluded = inventory.records.filter(({ coverageStatus }) => coverageStatus === "excluded-with-reason");
  assert.equal(excluded.length, 980);
  assert.ok(excluded.every(({ exclusionReason }) => approvedReasons.has(exclusionReason)));
});

test("Phase 10.3 keeps regional evidence and all new examples original and complete", () => {
  const phase103 = phase10Specs.filter(({ phase }) => phase === "10.3");
  assert.deepEqual(
    phase103.reduce((counts, spec) => {
      const pos = spec.type === "term" ? spec.partOfSpeech : spec.type;
      counts[pos] = (counts[pos] || 0) + 1;
      return counts;
    }, {}),
    { noun: 247, verb: 100, adjective: 40, adverb: 15, connector: 1, preposition: 4, phrase: 10 }
  );
  assert.ok(phase103.every(({ example, exampleTranslation }) => example && exampleTranslation));
  assert.ok(gapAnalysis.records.some(({ regionalStatus, decision }) => regionalStatus === "regional-only" && decision === "VARIANT / METADATA"));
});
