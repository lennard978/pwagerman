const fs = require("fs");
const path = require("path");
const test = require("node:test");
const assert = require("node:assert/strict");

const root = path.join(__dirname, "..", "..");
const inventory = JSON.parse(fs.readFileSync(path.join(root, "docs", "GERMAN-B1-WORTLISTE-INVENTORY.json"), "utf8"));
const specs = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "vocabulary", "expandedLexemeSpecs.json"), "utf8"));
const source = fs.readFileSync(path.join(root, "src", "data", "vocabulary", "lexemes.js"), "utf8");

const baseIds = [...source.matchAll(/\b(?:noun|verb|term)\("([^"]+)",\s*"([^"]+)"/gu)]
  .map((match) => `de-b1-${match[1]}-${match[2]}`);
const expandedIds = specs.map((spec) => `de-b1-${spec.categoryId}-${spec.slug}`);
const productionIds = [...baseIds, ...expandedIds];
const mappedIds = new Set(inventory.records.flatMap((record) => record.lexemeIds));

test("inventory has exact raw, normalized, variant, duplicate, and coverage totals", () => {
  assert.equal(inventory.rawRecords.length, 3218);
  assert.equal(inventory.records.length, 3176);
  assert.equal(inventory.metadata.variantGroups, 170);
  assert.equal(inventory.metadata.duplicateMergedGroups, 42);
  assert.equal(inventory.metadata.coveredCount, 626);
  assert.equal(inventory.metadata.partiallyCoveredCount, 128);
  assert.equal(inventory.metadata.uncoveredCount, 2422);
  assert.equal(inventory.metadata.coveragePercentage, 19.71);
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

test("all 800 production lexemes resolve to a reference mapping", () => {
  assert.equal(productionIds.length, 800);
  assert.equal(new Set(productionIds).size, 800);
  assert.deepEqual(productionIds.filter((id) => !mappedIds.has(id)), []);
});

test("all 550 expansion specs contain original learner-facing content and valid mappings", () => {
  assert.equal(specs.length, 550);
  specs.forEach((spec) => {
    assert.ok(spec.source && spec.example && spec.exampleTranslation && spec.referenceKey);
    assert.doesNotMatch(`${spec.source} ${spec.example} ${spec.exampleTranslation}`, /\uFFFD|Ã.|Â.|â[\u0080-\u00BF]/u);
    assert.ok(mappedIds.has(`de-b1-${spec.categoryId}-${spec.slug}`));
  });
});
