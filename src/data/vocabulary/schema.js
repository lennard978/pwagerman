import { VOCABULARY_CATEGORY_IDS } from "./categories";

export const LEXEME_PARTS_OF_SPEECH = Object.freeze([
  "noun",
  "verb",
  "adjective",
  "adverb",
  "connector",
  "preposition",
  "phrase",
]);

export const LEXEME_SOURCE_TYPES = Object.freeze(["original-curated"]);
export const NOUN_ARTICLES = Object.freeze(["der", "die", "das"]);
export const NOUN_GENDERS = Object.freeze([
  "masculine",
  "feminine",
  "neuter",
  "plural",
]);
export const EXPLICIT_PLURAL_VALUES = Object.freeze(["no-plural", "plural-only"]);

const isText = (value) => typeof value === "string" && value.trim().length > 0;
const isNullableText = (value) => value === null || typeof value === "string";
const idPattern = /^de-b1-[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const validateLexeme = (lexeme, categoryIds = VOCABULARY_CATEGORY_IDS) => {
  const errors = [];
  const requiredText = ["id", "source", "target", "lemma", "partOfSpeech", "categoryId", "level", "sourceType", "example", "exampleTranslation"];
  requiredText.forEach((field) => {
    if (!isText(lexeme?.[field])) errors.push(`${field} is required`);
  });

  if (isText(lexeme?.id) && !idPattern.test(lexeme.id)) errors.push("id must be a stable slug-like German B1 ID");
  if (!LEXEME_PARTS_OF_SPEECH.includes(lexeme?.partOfSpeech)) errors.push("partOfSpeech is invalid");
  if (!categoryIds.includes(lexeme?.categoryId)) errors.push("categoryId is invalid");
  if (lexeme?.level !== "B1") errors.push("level must be B1");
  if (!LEXEME_SOURCE_TYPES.includes(lexeme?.sourceType)) errors.push("sourceType is invalid");
  if (typeof lexeme?.examRelevant !== "boolean") errors.push("examRelevant must be boolean");
  if (!lexeme?.goetheCoverage || typeof lexeme.goetheCoverage.covered !== "boolean" || !isText(lexeme.goetheCoverage.referenceKey)) {
    errors.push("goetheCoverage must include covered and referenceKey");
  }
  if (!Array.isArray(lexeme?.grammarRefs) || !lexeme.grammarRefs.every((id) => idPattern.test(id))) {
    errors.push("grammarRefs must contain stable German B1 grammar IDs");
  }

  if (lexeme?.partOfSpeech === "noun") {
    if (!NOUN_ARTICLES.includes(lexeme.article)) errors.push("noun article is invalid");
    if (!NOUN_GENDERS.includes(lexeme.gender)) errors.push("noun gender is invalid");
    if (!isText(lexeme.plural)) errors.push("noun plural metadata is required");
    if (lexeme.gender === "plural" && lexeme.plural !== "plural-only") errors.push("plural nouns must use plural-only metadata");
  }

  if (lexeme?.partOfSpeech === "verb") {
    ["separablePrefix", "auxiliary", "pastParticiple", "preterite", "reflexiveCase", "caseGovernment"].forEach((field) => {
      if (!isNullableText(lexeme[field])) errors.push(`${field} must be text or null`);
    });
    if (typeof lexeme.reflexive !== "boolean") errors.push("verb reflexive must be boolean");
    if (!Array.isArray(lexeme.prepositions)) errors.push("verb prepositions must be an array");
  }

  return errors;
};

export const validateLexemeCollection = (lexemes) => {
  const errors = [];
  const ids = new Set();
  const lexicalKeys = new Set();
  lexemes.forEach((lexeme, index) => {
    validateLexeme(lexeme).forEach((error) => errors.push(`${lexeme?.id || index}: ${error}`));
    if (ids.has(lexeme.id)) errors.push(`${lexeme.id}: duplicate id`);
    ids.add(lexeme.id);
    const lexicalKey = `${lexeme.partOfSpeech}:${lexeme.lemma.toLocaleLowerCase("de-DE")}:${lexeme.reflexive === true}`;
    if (lexicalKeys.has(lexicalKey)) errors.push(`${lexeme.id}: duplicate lexical item`);
    lexicalKeys.add(lexicalKey);
  });
  return errors;
};

const baseLexeme = ({ id, source, target, lemma, partOfSpeech, categoryId, example, exampleTranslation, note = null, examRelevant = true, referenceKey = lemma, grammarRefs = [] }) => ({
  id,
  source,
  target,
  lemma,
  article: null,
  gender: null,
  plural: null,
  partOfSpeech,
  separablePrefix: null,
  auxiliary: null,
  pastParticiple: null,
  preterite: null,
  reflexive: false,
  reflexiveCase: null,
  caseGovernment: null,
  prepositions: [],
  grammarRefs,
  categoryId,
  subcategoryId: null,
  level: "B1",
  example,
  exampleTranslation,
  note,
  examRelevant,
  sourceType: "original-curated",
  goetheCoverage: { covered: true, referenceKey },
});

export const noun = (categoryId, slug, source, lemma, article, gender, plural, example, exampleTranslation, extra = {}) => ({
  ...baseLexeme({ id: `de-b1-${categoryId}-${slug}`, source, target: `${article} ${lemma}`, lemma, partOfSpeech: "noun", categoryId, example, exampleTranslation, ...extra }),
  article,
  gender,
  plural,
});

export const verb = (categoryId, slug, source, lemma, example, exampleTranslation, extra = {}) => ({
  ...baseLexeme({ id: `de-b1-${categoryId}-${slug}`, source, target: lemma, lemma, partOfSpeech: "verb", categoryId, example, exampleTranslation, ...extra }),
  auxiliary: extra.auxiliary || "haben",
  pastParticiple: extra.pastParticiple || null,
  preterite: extra.preterite || null,
  separablePrefix: extra.separablePrefix || null,
  reflexive: extra.reflexive === true,
  reflexiveCase: extra.reflexiveCase || null,
  caseGovernment: extra.caseGovernment || null,
  prepositions: extra.prepositions || [],
});

export const term = (categoryId, slug, source, target, partOfSpeech, example, exampleTranslation, extra = {}) =>
  baseLexeme({ id: `de-b1-${categoryId}-${slug}`, source, target, lemma: extra.lemma || target, partOfSpeech, categoryId, example, exampleTranslation, ...extra });
