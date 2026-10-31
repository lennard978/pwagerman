import specs from "./expandedLexemeSpecs.json";
import { noun, term, verb } from "./schema";

const createLexeme = (spec) => {
  const extra = {
    grammarRefs: spec.grammarRefs,
    referenceKey: spec.referenceKey,
  };

  if (spec.type === "noun") {
    return noun(
      spec.categoryId,
      spec.slug,
      spec.source,
      spec.lemma,
      spec.article,
      spec.gender,
      spec.plural,
      spec.example,
      spec.exampleTranslation,
      extra
    );
  }

  if (spec.type === "verb") {
    return verb(
      spec.categoryId,
      spec.slug,
      spec.source,
      spec.lemma,
      spec.example,
      spec.exampleTranslation,
      {
        ...extra,
        auxiliary: spec.auxiliary,
        pastParticiple: spec.pastParticiple,
        preterite: spec.preterite,
        separablePrefix: spec.separablePrefix,
        reflexive: spec.reflexive,
        reflexiveCase: spec.reflexiveCase,
        caseGovernment: spec.caseGovernment,
        prepositions: spec.prepositions,
      }
    );
  }

  return term(
    spec.categoryId,
    spec.slug,
    spec.source,
    spec.target,
    spec.partOfSpeech,
    spec.example,
    spec.exampleTranslation,
    extra
  );
};

export const EXPANDED_GERMAN_B1_LEXEMES = Object.freeze(specs.map(createLexeme));
