import { VOCABULARY_CATEGORIES, VOCABULARY_CATEGORY_IDS } from "./categories";
import { GermanCurriculum, getVocabularyCategoryProgress } from "./curriculum";
import {
  APPROX_OFFICIAL_REFERENCE_SIZE,
  createCoverageRecords,
  normalizeReferenceKey,
  VOCABULARY_COVERAGE_SUMMARY,
} from "./coverage";
import { GERMAN_B1_LEXEMES } from "./lexemes";
import { formatLexemeTarget, getLexemeSpeechText, matchesVocabularySearch } from "./presentation";
import { validateLexeme, validateLexemeCollection } from "./schema";
import { TARGET_LANGUAGE } from "../../config/course";

describe("German B1 production vocabulary schema", () => {
  test("contains 2367 original production lexemes in 25 deliberately weighted categories", () => {
    expect(GERMAN_B1_LEXEMES).toHaveLength(2367);
    expect(VOCABULARY_CATEGORIES).toHaveLength(25);
    expect(new Set(VOCABULARY_CATEGORY_IDS).size).toBe(25);
    expect(GermanCurriculum).toHaveLength(25);
    expect(GermanCurriculum.map((category) => category.items.length)).toEqual([
      52, 53, 99, 68, 83, 91, 146, 127, 143, 87, 132, 64, 157,
      63, 90, 39, 86, 85, 136, 101, 112, 49, 87, 92, 125,
    ]);
  });

  test("every record passes schema and collection validation", () => {
    expect(validateLexemeCollection(GERMAN_B1_LEXEMES)).toEqual([]);
    expect(GERMAN_B1_LEXEMES.every((lexeme) => validateLexeme(lexeme).length === 0)).toBe(true);
    expect(new Set(GERMAN_B1_LEXEMES.map((lexeme) => lexeme.id)).size).toBe(2367);
  });

  test("static content contains no mutable user state", () => {
    GERMAN_B1_LEXEMES.forEach((lexeme) => {
      ["status", "favorite", "correctCount", "incorrectCount", "lastReviewedAt", "nextReviewAt"].forEach((field) => {
        expect(Object.prototype.hasOwnProperty.call(lexeme, field)).toBe(false);
      });
    });
  });

  test("noun, verb, example, category, and source metadata are complete", () => {
    const nouns = GERMAN_B1_LEXEMES.filter((lexeme) => lexeme.partOfSpeech === "noun");
    const verbs = GERMAN_B1_LEXEMES.filter((lexeme) => lexeme.partOfSpeech === "verb");
    expect(nouns).toHaveLength(1155);
    expect(verbs).toHaveLength(660);
    expect(nouns.every(({ article, gender, plural }) => article && gender && plural)).toBe(true);
    expect(verbs.every(({ auxiliary, reflexive, prepositions }) => auxiliary && typeof reflexive === "boolean" && Array.isArray(prepositions))).toBe(true);
    expect(GERMAN_B1_LEXEMES.every(({ example, exampleTranslation }) => example && exampleTranslation)).toBe(true);
    expect(GERMAN_B1_LEXEMES.every(({ level, sourceType }) => level === "B1" && sourceType === "original-curated")).toBe(true);
  });

  test("supports German spelling and useful learner pronunciation forms", () => {
    const targets = GERMAN_B1_LEXEMES.map((lexeme) => lexeme.target).join(" ");
    ["ä", "ö", "ü", "Ä", "Ö", "Ü", "ß"].forEach((character) => expect(targets).toContain(character));
    const termin = GERMAN_B1_LEXEMES.find((lexeme) => lexeme.lemma === "Termin");
    expect(formatLexemeTarget(termin)).toBe("der Termin");
    expect(getLexemeSpeechText(termin)).toBe("der Termin");
    expect(matchesVocabularySearch(termin, "appointment")).toBe(true);
    expect(matchesVocabularySearch(termin, "termin")).toBe(true);
  });

  test("uses the shared de-DE TTS locale for representative complex lexemes", () => {
    expect(TARGET_LANGUAGE).toBe("de-DE");
    const samples = ["Straße", "Bewerbungsgespräch", "abfahren", "sich bewerben"]
      .map((lemma) => GERMAN_B1_LEXEMES.find((lexeme) => lexeme.lemma === lemma));
    expect(samples.every(Boolean)).toBe(true);
    expect(samples.map(getLexemeSpeechText)).toEqual([
      "die Straße",
      "das Bewerbungsgespräch",
      "abfahren",
      "sich bewerben",
    ]);

    const phase10Samples = [
      "Hauptbahnhof",
      "Arbeitserlaubnis",
      "abbiegen",
      "sich kümmern",
      "Einbahnstraße",
      "Mit freundlichen Grüßen",
    ].map((lemma) => GERMAN_B1_LEXEMES.find((lexeme) => lexeme.lemma === lemma));
    expect(phase10Samples.every(Boolean)).toBe(true);
    expect(phase10Samples.map(getLexemeSpeechText)).toEqual([
      "der Hauptbahnhof",
      "die Arbeitserlaubnis",
      "abbiegen",
      "sich kümmern",
      "die Einbahnstraße",
      "Mit freundlichen Grüßen",
    ]);

    const phase103Samples = [
      "Abonnement",
      "stattfinden",
      "im Freien",
      "Marille",
      "Verkehrszeichen",
      "je",
    ].map((lemma) => GERMAN_B1_LEXEMES.find((lexeme) => lexeme.lemma === lemma));
    expect(phase103Samples.every(Boolean)).toBe(true);
    expect(phase103Samples.map(getLexemeSpeechText)).toEqual([
      "das Abonnement",
      "stattfinden",
      "im Freien",
      "die Marille",
      "das Verkehrszeichen",
      "je",
    ]);
  });

  test("keeps Phase 10 part-of-speech balance and structural verb metadata", () => {
    const counts = GERMAN_B1_LEXEMES.reduce((result, lexeme) => ({
      ...result,
      [lexeme.partOfSpeech]: (result[lexeme.partOfSpeech] || 0) + 1,
    }), {});
    expect(counts).toEqual({
      noun: 1155,
      verb: 660,
      adjective: 242,
      adverb: 99,
      connector: 56,
      preposition: 30,
      phrase: 125,
    });
    [
      ["abhängen", "von + dative"],
      ["sich kümmern", "um + accusative"],
      ["sich interessieren", "für + accusative"],
      ["denken", "an + accusative"],
      ["sprechen", "über + accusative / mit + dative"],
    ].forEach(([lemma, caseGovernment]) => {
      expect(GERMAN_B1_LEXEMES.find((lexeme) => lexeme.lemma === lemma)).toMatchObject({
        partOfSpeech: "verb",
        caseGovernment,
      });
    });
  });

  test("category progress is not faked and supports explicit completion", () => {
    const category = GermanCurriculum[0];
    expect(getVocabularyCategoryProgress(category, [], [])).toMatchObject({ started: false, complete: false, known: 0 });
    const states = category.items.map((lexeme) => ({ lexemeId: lexeme.id, status: "known", lastReviewedAt: "2026-01-01T00:00:00.000Z" }));
    expect(getVocabularyCategoryProgress(category, states, [])).toMatchObject({ started: true, complete: true, known: category.items.length });
    expect(getVocabularyCategoryProgress(category, [], [category.id]).complete).toBe(true);
    expect(getVocabularyCategoryProgress(category, [], [category.id]).started).toBe(true);
  });

  test("rejects malformed Unicode and unknown grammar references", () => {
    expect(validateLexeme({
      ...GERMAN_B1_LEXEMES[0],
      source: "broken Ã¤ text",
      grammarRefs: ["de-b1-not-a-real-lesson"],
    })).toEqual(expect.arrayContaining([
      "source contains malformed Unicode",
      "grammarRefs contains unknown lesson de-b1-not-a-real-lesson",
    ]));
  });

  test("allows distinct German lexemes to share an English gloss", () => {
    const base = GERMAN_B1_LEXEMES[0];
    const records = [
      { ...base, id: "de-b1-test-answer-one", source: "answer", lemma: "Antwort", target: "die Antwort" },
      { ...base, id: "de-b1-test-answer-two", source: "answer", lemma: "Erwiderung", target: "die Erwiderung" },
    ];
    expect(validateLexemeCollection(records)).toEqual([]);
  });

  test("rejects duplicate German lexical identities while preserving homographs", () => {
    const antwort = GERMAN_B1_LEXEMES.find((lexeme) => lexeme.lemma === "Antwort" && lexeme.partOfSpeech === "noun");
    const duplicate = { ...antwort, id: "de-b1-test-antwort-duplicate" };
    expect(validateLexemeCollection([antwort, duplicate])).toContain("de-b1-test-antwort-duplicate: duplicate lexical item");
    const nounSchreiben = GERMAN_B1_LEXEMES.find((lexeme) => lexeme.lemma === "Schreiben" && lexeme.partOfSpeech === "noun");
    const verbSchreiben = GERMAN_B1_LEXEMES.find((lexeme) => lexeme.lemma === "schreiben" && lexeme.partOfSpeech === "verb");
    expect(validateLexemeCollection([nounSchreiben, verbSchreiben])).toEqual([]);
  });
});

describe("Goethe Wortliste coverage infrastructure", () => {
  test("normalizes articles, separable markers, reflexive forms, and punctuation", () => {
    expect(normalizeReferenceKey("der Termin")).toBe("termin");
    expect(normalizeReferenceKey("ab|fahren")).toBe("abfahren");
    expect(normalizeReferenceKey("kümmern um", { reflexive: true })).toBe("sich kümmern um");
    expect(normalizeReferenceKey("Vielen Dank im Voraus.")).toBe("vielen dank im voraus");
  });

  test("groups duplicate identities while keeping unrelated homographs distinct", () => {
    const records = createCoverageRecords([
      { ...GERMAN_B1_LEXEMES[0], id: "de-b1-test-bank-noun", lemma: "Bank", partOfSpeech: "noun", goetheCoverage: { covered: true, referenceKey: "die Bank" } },
      { ...GERMAN_B1_LEXEMES[0], id: "de-b1-test-bank-verb", lemma: "bank", partOfSpeech: "verb", goetheCoverage: { covered: true, referenceKey: "bank" } },
      { ...GERMAN_B1_LEXEMES[0], id: "de-b1-test-bank-noun-two", lemma: "Bank", partOfSpeech: "noun", goetheCoverage: { covered: true, referenceKey: "Bank" } },
    ]);
    expect(records).toHaveLength(2);
    expect(records.find((record) => record.partOfSpeech === "noun").lexemeIds).toHaveLength(2);
  });

  test("reports exact normalized inventory coverage", () => {
    expect(APPROX_OFFICIAL_REFERENCE_SIZE).toBe(2400);
    expect(VOCABULARY_COVERAGE_SUMMARY).toMatchObject({
      rawReferenceRecords: 3218,
      normalizedReferenceItems: 3176,
      variantGroups: 170,
      duplicateMergedGroups: 42,
      productionLexemes: 2367,
      exactCoveredReferenceItems: 2186,
      variantCoveredReferenceItems: 10,
      coveredReferenceItems: 2196,
      partiallyCoveredReferenceItems: 0,
      uncoveredReferenceItems: 0,
      coveredPercent: 69.14,
      status: "phase103-curated-inventory",
    });
  });
});
