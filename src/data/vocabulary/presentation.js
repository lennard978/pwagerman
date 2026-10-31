export const formatLexemeTarget = (lexeme) => {
  const target = lexeme?.target || "";
  if (!lexeme?.article || new RegExp(`^${lexeme.article}\\s`, "i").test(target)) return target;
  return `${lexeme.article} ${target}`;
};

export const getLexemeSpeechText = (lexeme) => formatLexemeTarget(lexeme);

export const getLexemeMetadata = (lexeme) => {
  if (!lexeme) return [];
  if (lexeme.partOfSpeech === "noun" || lexeme.article) {
    return [
      lexeme.plural === "plural-only"
        ? "Plural only"
        : lexeme.plural && lexeme.plural !== "no-plural"
          ? `Plural: ${lexeme.plural}`
          : "Usually no plural",
    ];
  }
  if (lexeme.partOfSpeech === "verb") {
    return [
      lexeme.separablePrefix ? `Separable: ${lexeme.separablePrefix}-` : null,
      lexeme.pastParticiple ? `Perfect: ${lexeme.auxiliary || "haben"} ${lexeme.pastParticiple}` : null,
      lexeme.caseGovernment ? `Government: ${lexeme.caseGovernment}` : null,
      lexeme.prepositions?.length ? `With: ${lexeme.prepositions.join(", ")}` : null,
    ].filter(Boolean);
  }
  return [];
};

const fold = (value) => String(value || "")
  .toLocaleLowerCase("de-DE")
  .normalize("NFKD")
  .replace(/\p{Diacritic}/gu, "");

export const matchesVocabularySearch = (lexeme, query) => {
  const needle = fold(query).trim();
  if (!needle) return true;
  return [lexeme.source, lexeme.target, lexeme.lemma, lexeme.article, formatLexemeTarget(lexeme)]
    .some((value) => fold(value).includes(needle));
};
