const fs = require("fs");
const path = require("path");
const {
  nounRows,
  verbRows,
  verbExampleRows,
  adjectiveRows,
  adverbRows,
  connectorRows,
  prepositionRows,
  phraseRows,
} = require("./phase10-curation.cjs");

const ROOT = path.join(__dirname, "..", "..");
const INVENTORY_PATH = path.join(ROOT, "docs", "GERMAN-B1-WORTLISTE-INVENTORY.json");
const SUMMARY_PATH = path.join(ROOT, "src", "data", "vocabulary", "wortlisteCoverageSummary.json");
const OUTPUT_PATH = path.join(ROOT, "src", "data", "vocabulary", "phase10LexemeSpecs.json");
const AUDIT_PATH = path.join(ROOT, "docs", "GERMAN-B1-VOCABULARY-AUDIT-SAMPLE.json");
const PHASE9_PATH = path.join(ROOT, "src", "data", "vocabulary", "expandedLexemeSpecs.json");
const LEXEMES_SOURCE_PATH = path.join(ROOT, "src", "data", "vocabulary", "lexemes.js");

const TARGET_ADDITIONS = 1150;
const TARGET_PRODUCTION = 1950;
const REVIEW_DATE = "2026-11-01";

const normalize = (value) => String(value || "")
  .normalize("NFKC")
  .replace(/\u00ad/gu, "")
  .trim()
  .toLocaleLowerCase("de-DE")
  .replace(/^(?:der|die|das)\s+/u, "")
  .replace(/\s*\|\s*/gu, "")
  .replace(/\.{3}|…/gu, "")
  .replace(/[?!,;:]+$/gu, "")
  .replace(/\s+/gu, " ")
  .trim();

const slugify = (value) => normalize(value)
  .replace(/^sich\s+/u, "")
  .replace(/ä/gu, "ae")
  .replace(/ö/gu, "oe")
  .replace(/ü/gu, "ue")
  .replace(/ß/gu, "ss")
  .replace(/[^a-z0-9]+/gu, "-")
  .replace(/^-+|-+$/gu, "");

const splitRow = (line, expected, label) => {
  const values = line.split("|").map((value) => value.trim());
  if (values.length !== expected) {
    throw new Error(`${label} row has ${values.length} fields; expected ${expected}: ${line}`);
  }
  return values;
};

const rowValues = (line) => line.split("|").map((value) => value.trim());

const cleanOfficialVerbField = (value) => String(value || "")
  .replace(/([A-Za-zÄÖÜäöüß])-\s+([A-Za-zÄÖÜäöüß])/gu, "$1$2")
  .replace(/\s+/gu, " ")
  .replace(/\.$/u, "")
  .trim();

const parseOfficialVerbMetadata = (record, { reflexive, separablePrefix }) => {
  const parts = String(record.rawEntry || "").split(",").map(cleanOfficialVerbField);
  if (parts.length < 4) {
    throw new Error(`Official verb metadata for ${record.normalizedLemma} has fewer than four fields: ${record.rawEntry}`);
  }
  let preterite = parts[2];
  let perfect = parts.slice(3).join(", ")
    .replace(/\s*\([^)]*\)\s*$/u, "")
    .replace(/\s*→.*$/u, "")
    .trim();
  const perfectMatch = perfect.match(/^(hat|ist)\s+(.+)$/u);
  if (!perfectMatch) {
    throw new Error(`Cannot parse official perfect metadata for ${record.normalizedLemma}: ${perfect}`);
  }
  const auxiliary = perfectMatch[1] === "ist" ? "sein" : "haben";
  let pastParticiple = perfectMatch[2]
    .replace(/^sich\s+/u, "")
    .replace(/^etwas\s+/u, "")
    .trim();
  if (reflexive && !/\bsich\b/u.test(preterite)) {
    preterite = separablePrefix && preterite.endsWith(` ${separablePrefix}`)
      ? `${preterite.slice(0, -(separablePrefix.length + 1))} sich ${separablePrefix}`
      : `${preterite} sich`;
  }
  if (/\//u.test(pastParticiple)) pastParticiple = pastParticiple.split("/")[0].trim();
  return { auxiliary, pastParticiple, preterite };
};

const inventory = JSON.parse(fs.readFileSync(INVENTORY_PATH, "utf8"));
const phase9Specs = JSON.parse(fs.readFileSync(PHASE9_PATH, "utf8"));
const lexemesSource = fs.readFileSync(LEXEMES_SOURCE_PATH, "utf8");

// Make regeneration idempotent by removing mappings written by an earlier Phase 10 run.
// Records first covered by this batch return to `uncovered`; older Phase 9 mappings remain.
if (fs.existsSync(OUTPUT_PATH)) {
  const priorPhase10Ids = new Set(JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf8"))
    .map((spec) => `de-b1-${spec.categoryId}-${spec.slug}`));
  inventory.records.forEach((record) => {
    const hadPhase10Mapping = (record.lexemeIds || []).some((lexemeId) => priorPhase10Ids.has(lexemeId));
    record.lexemeIds = (record.lexemeIds || []).filter((lexemeId) => !priorPhase10Ids.has(lexemeId));
    if (hadPhase10Mapping && !record.lexemeIds.length && record.coverageStatus !== "excluded") {
      record.coverageStatus = "uncovered";
    }
  });
}

// Reassert Phase 9 mappings after removing a prior Phase 10 batch. This also
// makes recovery deterministic if a newer reflexive entry once shared a
// generated ID with an older non-reflexive entry before ID validation caught it.
phase9Specs.forEach((spec) => {
  const lexemeId = `de-b1-${spec.categoryId}-${spec.slug}`;
  if (inventory.records.some((record) => (record.lexemeIds || []).includes(lexemeId))) return;
  const referenceKey = normalize(spec.referenceKey);
  const candidates = inventory.records.filter((record) => [record.normalizedLemma, ...(record.variants || [])]
    .map(normalize)
    .includes(referenceKey));
  if (candidates.length !== 1) {
    throw new Error(`Cannot restore Phase 9 mapping ${lexemeId} (${spec.referenceKey}): ${candidates.length} candidates`);
  }
  const [record] = candidates;
  record.lexemeIds = [...new Set([...(record.lexemeIds || []), lexemeId])];
  if (record.coverageStatus === "uncovered") {
    const productionPos = spec.type === "term" ? spec.partOfSpeech : spec.type;
    record.coverageStatus = normalize(record.normalizedLemma) !== normalize(spec.referenceKey)
      ? "variant-covered"
      : record.partOfSpeech === productionPos
        ? "covered"
        : "partially-covered";
  }
});

// Phase 9 mapped these regional reference units through their standard-German
// variants. They intentionally carry no direct lexeme ID of their own.
const phase9VariantCoveredReferenceIds = new Set([
  "goethe-b1-unit-0047",
  "goethe-b1-unit-0392",
  "goethe-b1-unit-0498",
  "goethe-b1-unit-1871",
  "goethe-b1-unit-1895",
  "goethe-b1-unit-1934",
  "goethe-b1-unit-1997",
  "goethe-b1-unit-2284",
  "goethe-b1-unit-2484",
  "goethe-b1-unit-2641",
]);
inventory.records.forEach((record) => {
  if (phase9VariantCoveredReferenceIds.has(record.referenceId)) {
    record.coverageStatus = "variant-covered";
  }
});

const recordKeys = (record) => [record.normalizedLemma, ...(record.variants || [])]
  .map(normalize)
  .filter(Boolean);

const findReference = ({ referenceKey, expectedReferencePos = null, article = null, requireUncovered = true }) => {
  const key = normalize(referenceKey);
  const candidates = inventory.records
    .map((record) => ({
      record,
      exact: normalize(record.normalizedLemma) === key,
      variant: (record.variants || []).some((variant) => normalize(variant) === key),
    }))
    .filter(({ record, exact, variant }) => {
      if (!exact && !variant) return false;
      if (article && record.article !== article) return false;
      if (expectedReferencePos && record.partOfSpeech !== expectedReferencePos) return false;
      if (requireUncovered && record.coverageStatus !== "uncovered") return false;
      return true;
    })
    .sort((a, b) => Number(b.exact) - Number(a.exact));
  const exactCandidates = candidates.filter(({ exact }) => exact);
  if (exactCandidates.length === 1) return exactCandidates[0];
  if (candidates.length !== 1) {
    throw new Error(`Reference mapping for ${referenceKey} (${expectedReferencePos || "any"}) resolved to ${candidates.length} records: ${candidates.map(({ record }) => record.referenceId).join(", ")}`);
  }
  return candidates[0];
};

const findPreferredReference = (options) => {
  try {
    return findReference({ ...options, requireUncovered: true });
  } catch (error) {
    return findReference({ ...options, requireUncovered: false });
  }
};

const genderByArticle = { der: "masculine", die: "feminine", das: "neuter" };
const pluralOnlyLemmas = new Set(["Personalien", "Lebensmittel"]);
const nounPluralOverrides = {
  Aufzug: "die Aufzüge",
  Auftrag: "die Aufträge",
  Hauptbahnhof: "die Hauptbahnhöfe",
  Vorwurf: "die Vorwürfe",
  Arbeitserlaubnis: "die Arbeitserlaubnisse",
  Berufsschule: "die Berufsschulen",
  Fachhochschule: "die Fachhochschulen",
  Grundschule: "die Grundschulen",
  Gymnasium: "die Gymnasien",
  Diät: "die Diäten",
  Schmerzmittel: "die Schmerzmittel",
  Anrufbeantworter: "die Anrufbeantworter",
  Gebirge: "die Gebirge",
  Parlament: "die Parlamente",
};
const cleanPlural = (record) => {
  if (pluralOnlyLemmas.has(record.normalizedLemma) || /plural-only|plural|pl\./iu.test(record.plural || "")) {
    return "plural-only";
  }
  if (nounPluralOverrides[record.normalizedLemma]) return nounPluralOverrides[record.normalizedLemma];
  let plural = String(record.plural || "").trim();
  if (!plural) return "no-plural";
  plural = plural
    .replace(/\s+die\s+[A-ZÄÖÜ].*$/u, "")
    .replace(/\s*\d+\.$/u, "")
    .replace(/\s+/gu, " ")
    .trim();
  if (!plural || /^(?:A|CH|D):/u.test(plural)) return "no-plural";
  return plural.startsWith("die ") ? plural : `die ${plural}`;
};

const nounTemplates = {
  "personal-identity": ["wird im Formular angegeben", "is entered on the form"],
  "family-relationships": ["spielt im Familienleben eine wichtige Rolle", "plays an important role in family life"],
  "home-living": ["gehört zur Ausstattung der Wohnung", "is part of the apartment's equipment"],
  "daily-life": ["gehört für viele Menschen zum Alltag", "is part of everyday life for many people"],
  "food-eating-out": ["steht heute auf der Einkaufsliste", "is on today's shopping list"],
  "shopping-money": ["wird auf der Rechnung angegeben", "is shown on the invoice"],
  "work-profession": ["wird im Arbeitsalltag häufig erwähnt", "is frequently mentioned in working life"],
  "school-education": ["wird im Kurs ausführlich erklärt", "is explained in detail during the course"],
  "travel-transport": ["steht in den aktuellen Reiseinformationen", "appears in the current travel information"],
  "city-services": ["wird auf der Website der Stadt erklärt", "is explained on the city's website"],
  "health-body": ["wird beim Arzttermin besprochen", "is discussed at the doctor's appointment"],
  "appointments-services": ["wurde schriftlich bestätigt", "was confirmed in writing"],
  "media-communication": ["wird in der Nachricht erwähnt", "is mentioned in the message"],
  "technology-internet": ["gehört zur technischen Ausstattung", "is part of the technical equipment"],
  "leisure-sport": ["gehört zum Kulturprogramm am Wochenende", "is part of the weekend cultural programme"],
  "holidays-accommodation": ["ist für die Reise bereits gebucht", "has already been booked for the trip"],
  "environment-weather": ["ist für Natur und Umwelt wichtig", "is important for nature and the environment"],
  "society-community": ["wird derzeit öffentlich diskutiert", "is currently being discussed publicly"],
  "feelings-opinions": ["wird im Gespräch deutlich", "becomes clear in the conversation"],
  "problems-solutions": ["muss genau untersucht werden", "must be examined carefully"],
  "plans-goals-time": ["steht im aktuellen Plan", "is included in the current plan"],
  "adjectives-adverbs": ["wird in der Beschreibung genau angegeben", "is stated precisely in the description"],
};

const nounExampleOverrides = {
  Personalien: ["Die Personalien werden auf der ersten Seite eingetragen.", "The personal details are entered on the first page."],
  Lebensmittel: ["Die Lebensmittel werden kühl und trocken gelagert.", "The food products are stored in a cool, dry place."],
  Marille: ["In Österreich heißt eine Aprikose oft Marille.", "In Austria, an apricot is often called Marille."],
  Velo: ["In der Schweiz sagt man häufig Velo statt Fahrrad.", "In Switzerland, people often say Velo instead of Fahrrad."],
  Perron: ["In der Schweiz wartet man auf dem Perron auf den Zug.", "In Switzerland, you wait for the train on the Perron."],
};

const nounSpecs = nounRows.map((line) => {
  const [categoryId, referenceKey, source] = splitRow(line, 3, "noun");
  const { record } = findReference({ referenceKey, expectedReferencePos: "noun", requireUncovered: true });
  const plural = cleanPlural(record);
  const pluralOnly = plural === "plural-only";
  const display = `${record.article.charAt(0).toLocaleUpperCase("de-DE")}${record.article.slice(1)} ${record.normalizedLemma}`;
  const [germanPredicate, englishPredicate] = nounTemplates[categoryId];
  const [example, exampleTranslation] = nounExampleOverrides[record.normalizedLemma] || [
    `${display} ${pluralOnly ? germanPredicate.replace(/\b(wird|ist|steht|gehört|spielt|muss)\b/u, (verb) => ({ wird: "werden", ist: "sind", steht: "stehen", gehört: "gehören", spielt: "spielen", muss: "müssen" }[verb])) : germanPredicate}.`,
    `${pluralOnly ? source.charAt(0).toUpperCase() + source.slice(1) : `The ${source}`} ${pluralOnly ? englishPredicate.replace(/\b(is|was|has|plays|becomes|must)\b/u, (verb) => ({ is: "are", was: "were", has: "have", plays: "play", becomes: "become", must: "must" }[verb])) : englishPredicate}.`,
  ];
  const regionalRegions = (record.region || []).filter((region) => region !== "standard");
  const regional = regionalRegions.length
    ? `Regional Wortliste entry: ${regionalRegions.join(", ")}. Standard German remains the default elsewhere in the curriculum.`
    : null;
  return {
    type: "noun",
    categoryId,
    slug: slugify(record.normalizedLemma),
    source,
    lemma: record.normalizedLemma,
    article: record.article,
    gender: pluralOnly ? "plural" : genderByArticle[record.article],
    plural,
    example,
    exampleTranslation,
    grammarRefs: ["de-b1-case-articles"],
    referenceKey: record.normalizedLemma,
    referenceId: record.referenceId,
    note: regional,
  };
});

const structuredVerbs = {
  "abhängen": { caseGovernment: "von + dative", prepositions: ["von + dative"], example: "Ob wir draußen feiern, hängt vom Wetter ab.", exampleTranslation: "Whether we celebrate outside depends on the weather." },
  "denken": { caseGovernment: "an + accusative", prepositions: ["an + accusative"], example: "Bitte denken Sie an Ihren Ausweis.", exampleTranslation: "Please remember your identity card." },
  "sprechen": { caseGovernment: "über + accusative / mit + dative", prepositions: ["über + accusative", "mit + dative"], example: "Wir sprechen mit der Lehrerin über den Kurs.", exampleTranslation: "We are speaking with the teacher about the course." },
  "sich erinnern": { caseGovernment: "an + accusative", prepositions: ["an + accusative"], example: "Ich erinnere mich gern an meine Schulzeit.", exampleTranslation: "I like remembering my school days." },
  "sich beteiligen": { caseGovernment: "an + dative", prepositions: ["an + dative"], example: "Viele Nachbarn beteiligen sich an der Aktion.", exampleTranslation: "Many neighbours are taking part in the campaign." },
  "sich fürchten": { caseGovernment: "vor + dative", prepositions: ["vor + dative"], example: "Das Kind fürchtet sich vor der Untersuchung.", exampleTranslation: "The child is afraid of the examination." },
  "sich wundern": { caseGovernment: "über + accusative", prepositions: ["über + accusative"], example: "Wir wundern uns über die hohe Gebühr.", exampleTranslation: "We are surprised by the high fee." },
  "sich aufregen": { caseGovernment: "über + accusative", prepositions: ["über + accusative"], example: "Er regt sich über die lange Wartezeit auf.", exampleTranslation: "He is upset about the long waiting time." },
  "sich kümmern": { caseGovernment: "um + accusative", prepositions: ["um + accusative"], example: "Der Hausmeister kümmert sich um die Reparatur.", exampleTranslation: "The caretaker takes care of the repair." },
  "sich interessieren": { caseGovernment: "für + accusative", prepositions: ["für + accusative"], example: "Sie interessiert sich für die neue Fortbildung.", exampleTranslation: "She is interested in the new training course." },
  "kämpfen": { caseGovernment: "für / gegen + accusative", prepositions: ["für + accusative", "gegen + accusative"], example: "Die Initiative kämpft für sichere Radwege.", exampleTranslation: "The initiative campaigns for safe cycle paths." },
  "protestieren": { caseGovernment: "gegen + accusative", prepositions: ["gegen + accusative"], example: "Die Anwohner protestieren gegen den starken Verkehr.", exampleTranslation: "The residents are protesting against the heavy traffic." },
  "dienen": { caseGovernment: "dative", prepositions: [], example: "Diese Anleitung dient neuen Mitarbeitenden als Orientierung.", exampleTranslation: "These instructions serve as guidance for new employees." },
  "achten": { caseGovernment: "auf + accusative", prepositions: ["auf + accusative"], example: "Achten Sie bitte auf die Frist im Schreiben.", exampleTranslation: "Please pay attention to the deadline in the letter." },
  "begegnen": { caseGovernment: "dative", prepositions: [], example: "Auf dem Weg zur Arbeit begegnete ich meiner Nachbarin.", exampleTranslation: "On the way to work, I met my neighbour." },
  "danken": { caseGovernment: "dative / für + accusative", prepositions: ["für + accusative"], example: "Ich danke Ihnen für die schnelle Rückmeldung.", exampleTranslation: "Thank you for the prompt response." },
  "gefallen": { caseGovernment: "dative", prepositions: [], example: "Der neue Kursplan gefällt den Teilnehmenden.", exampleTranslation: "The participants like the new course schedule." },
  "gelingen": { caseGovernment: "dative", prepositions: [], example: "Mit guter Vorbereitung gelingt uns die Präsentation.", exampleTranslation: "With good preparation, we will succeed with the presentation." },
  "genügen": { caseGovernment: "dative", prepositions: [], example: "Eine Kopie des Ausweises genügt der Behörde nicht.", exampleTranslation: "A copy of the identity card is not sufficient for the authority." },
  "gratulieren": { caseGovernment: "dative / zu + dative", prepositions: ["zu + dative"], example: "Wir gratulieren dir zur bestandenen Prüfung.", exampleTranslation: "We congratulate you on passing the exam." },
  "hinweisen": { caseGovernment: "auf + accusative", prepositions: ["auf + accusative"], example: "Die Mitarbeiterin weist auf die neue Regel hin.", exampleTranslation: "The employee points out the new rule." },
  "klagen": { caseGovernment: "über + accusative", prepositions: ["über + accusative"], example: "Viele Fahrgäste klagen über die langen Wartezeiten.", exampleTranslation: "Many passengers complain about the long waiting times." },
  "leiden": { caseGovernment: "an + dative / unter + dative", prepositions: ["an + dative", "unter + dative"], example: "Er leidet seit Tagen unter starken Kopfschmerzen.", exampleTranslation: "He has been suffering from severe headaches for days." },
  "passen": { caseGovernment: "zu + dative", prepositions: ["zu + dative"], example: "Der neue Termin passt gut zu meinem Arbeitsplan.", exampleTranslation: "The new appointment fits well with my work schedule." },
  "raten": { caseGovernment: "dative / zu + dative", prepositions: ["zu + dative"], example: "Die Ärztin rät mir zu einer kurzen Pause.", exampleTranslation: "The doctor advises me to take a short break." },
  "reagieren": { caseGovernment: "auf + accusative", prepositions: ["auf + accusative"], example: "Der Kundendienst reagierte schnell auf meine Nachricht.", exampleTranslation: "Customer service responded quickly to my message." },
  "riechen": { caseGovernment: "nach + dative", prepositions: ["nach + dative"], example: "Die Küche riecht nach frischem Brot.", exampleTranslation: "The kitchen smells of fresh bread." },
  "sich bedanken": { caseGovernment: "bei + dative / für + accusative", prepositions: ["bei + dative", "für + accusative"], example: "Sie bedankt sich bei ihrem Kollegen für die Hilfe.", exampleTranslation: "She thanks her colleague for the help." },
  "sich bemühen": { caseGovernment: "um + accusative", prepositions: ["um + accusative"], example: "Wir bemühen uns um eine schnelle Lösung.", exampleTranslation: "We are striving for a quick solution." },
  "sich eignen": { caseGovernment: "für + accusative", prepositions: ["für + accusative"], example: "Der Raum eignet sich gut für kleine Gruppen.", exampleTranslation: "The room is well suited to small groups." },
  "sich konzentrieren": { caseGovernment: "auf + accusative", prepositions: ["auf + accusative"], example: "Konzentrieren Sie sich auf die wichtigsten Aussagen.", exampleTranslation: "Concentrate on the most important statements." },
  "sich nähern": { caseGovernment: "dative", prepositions: [], example: "Der Zug nähert sich langsam dem Hauptbahnhof.", exampleTranslation: "The train is slowly approaching the main station." },
  "sich streiten": { caseGovernment: "mit + dative / über + accusative", prepositions: ["mit + dative", "über + accusative"], example: "Die Nachbarn streiten sich über den Lärm.", exampleTranslation: "The neighbours are arguing about the noise." },
  "sich verabreden": { caseGovernment: "mit + dative / zu + dative", prepositions: ["mit + dative", "zu + dative"], example: "Ich habe mich mit einer Kollegin zum Mittagessen verabredet.", exampleTranslation: "I arranged to meet a colleague for lunch." },
  "sich verlieben": { caseGovernment: "in + accusative", prepositions: ["in + accusative"], example: "Sie hat sich während des Studiums in Berlin verliebt.", exampleTranslation: "She fell in love with Berlin while studying." },
  "sich vorbereiten": { caseGovernment: "auf + accusative", prepositions: ["auf + accusative"], example: "Die Gruppe bereitet sich auf die mündliche Prüfung vor.", exampleTranslation: "The group is preparing for the oral exam." },
};

const verbContext = {
  "work-profession": ["Im Arbeitsalltag", "At work"],
  "school-education": ["Im Kurs", "During the course"],
  "travel-transport": ["Auf einer Reise", "While travelling"],
  "city-services": ["Bei einer Behörde", "At a public authority"],
  "health-body": ["Im Gesundheitsbereich", "In a health context"],
  "appointments-services": ["Beim Kundenservice", "When dealing with customer service"],
  "media-communication": ["In einem Gespräch", "In a conversation"],
  "technology-internet": ["Mit einer App", "Using an app"],
  "leisure-sport": ["In der Freizeit", "In your free time"],
  "environment-weather": ["Beim Umweltschutz", "When protecting the environment"],
  "society-community": ["In der Gemeinschaft", "In the community"],
  "feelings-opinions": ["In einer persönlichen Situation", "In a personal situation"],
  "problems-solutions": ["Bei einem Problem", "When dealing with a problem"],
};

const verbExampleOverrides = {
  anstellen: ["Das Unternehmen stellt im Herbst zwei Auszubildende an.", "The company is employing two trainees in the autumn."],
  auffordern: ["Die Chefin fordert das Team auf, den Bericht zu prüfen.", "The manager asks the team to check the report."],
  beraten: ["Eine Fachkraft berät uns bei der Berufswahl.", "A specialist advises us on choosing a career."],
  beschäftigen: ["Der Betrieb beschäftigt mehr als hundert Mitarbeitende.", "The company employs more than one hundred staff members."],
  betreuen: ["Eine Kollegin betreut die neuen Praktikanten.", "A colleague supports the new interns."],
  unterrichten: ["Sie unterrichtet Erwachsene in Deutsch.", "She teaches German to adults."],
  abheben: ["Das Flugzeug hebt pünktlich um acht Uhr ab.", "The plane takes off punctually at eight o'clock."],
  anschnallen: ["Bitte schnallen Sie sich vor der Fahrt an.", "Please fasten your seat belt before the journey."],
  ausfallen: ["Wegen des Sturms fällt unser Zug heute aus.", "Our train is cancelled today because of the storm."],
  tanken: ["Vor der langen Fahrt müssen wir noch tanken.", "We still need to refuel before the long journey."],
  verhaften: ["Die Polizei verhaftete den Verdächtigen am Bahnhof.", "The police arrested the suspect at the station."],
  verurteilen: ["Das Gericht verurteilte den Täter zu einer Geldstrafe.", "The court sentenced the offender to a fine."],
  ernähren: ["Sie ernährt ihre Familie mit frischen Lebensmitteln.", "She feeds her family with fresh food."],
  pflegen: ["Der Krankenpfleger pflegt die Patientin nach der Operation.", "The nurse cares for the patient after the operation."],
  sterben: ["Viele Pflanzen sterben ohne ausreichend Wasser.", "Many plants die without enough water."],
  wehtun: ["Mein Rücken tut nach dem Umzug noch weh.", "My back still hurts after the move."],
  mailen: ["Bitte mailen Sie mir die Bestätigung bis Freitag.", "Please email me the confirmation by Friday."],
  feiern: ["Am Samstag feiern wir den Abschluss des Kurses.", "On Saturday, we are celebrating the end of the course."],
  singen: ["Im Chor singen wir moderne und traditionelle Lieder.", "In the choir, we sing modern and traditional songs."],
  blitzen: ["In der Ferne blitzt es schon seit einer Stunde.", "There has been lightning in the distance for an hour."],
  blühen: ["Die Obstbäume blühen in diesem Jahr besonders früh.", "The fruit trees are blooming particularly early this year."],
  brennen: ["Im Ofen brennt nur trockenes Holz.", "Only dry wood is burning in the stove."],
  donnern: ["In der Nacht donnerte es sehr laut.", "There was very loud thunder during the night."],
  fließen: ["Der Fluss fließt durch mehrere Naturschutzgebiete.", "The river flows through several nature reserves."],
  gießen: ["Im Sommer gießen wir die Pflanzen jeden Abend.", "In summer, we water the plants every evening."],
  hageln: ["Gestern hat es zwanzig Minuten lang gehagelt.", "Yesterday, it hailed for twenty minutes."],
  schneien: ["In den Bergen kann es schon im Oktober schneien.", "In the mountains, it can snow as early as October."],
  verbrauchen: ["Moderne Geräte verbrauchen deutlich weniger Strom.", "Modern devices consume significantly less electricity."],
  zerstören: ["Das Hochwasser zerstörte mehrere Straßen.", "The flood destroyed several roads."],
  beleidigen: ["Mit dieser Bemerkung wollte sie niemanden beleidigen.", "She did not want to offend anyone with that remark."],
  beruhigen: ["Die Ärztin beruhigt den nervösen Patienten.", "The doctor reassures the nervous patient."],
  enttäuschen: ["Die kurzfristige Absage hat uns sehr enttäuscht.", "The last-minute cancellation disappointed us greatly."],
  auffallen: ["Der Fehler ist bei der letzten Kontrolle aufgefallen.", "The error was noticed during the final check."],
};

const phase102VerbExamples = Object.fromEntries(verbExampleRows.map((line) => {
  const [lemma, example, exampleTranslation] = splitRow(line, 3, "Phase 10.2 verb example");
  return [lemma, [example, exampleTranslation]];
}));

const verbSpecs = verbRows.map((line) => {
  const values = rowValues(line);
  if (![5, 8].includes(values.length)) {
    throw new Error(`verb row has ${values.length} fields; expected 5 or 8: ${line}`);
  }
  let categoryId;
  let lemma;
  let english;
  let pastParticiple;
  let preterite;
  let auxiliary;
  let separablePrefix;
  let use;
  if (values.length === 8) {
    [categoryId, lemma, english, pastParticiple, preterite, auxiliary, separablePrefix, use] = values;
  } else {
    [categoryId, lemma, english, use, separablePrefix] = values;
  }
  const reflexive = lemma.startsWith("sich ");
  let referenceKey = reflexive ? lemma.slice(5) : lemma;
  let match;
  try {
    match = findReference({ referenceKey, expectedReferencePos: "verb", requireUncovered: true });
  } catch (error) {
    if (!reflexive) throw error;
    referenceKey = lemma;
    match = findReference({ referenceKey, expectedReferencePos: "verb", requireUncovered: true });
  }
  const { record } = match;
  if (values.length === 5) {
    ({ pastParticiple, preterite, auxiliary } = parseOfficialVerbMetadata(record, { reflexive, separablePrefix }));
  }
  const structured = structuredVerbs[lemma] || {};
  const curatedExample = phase102VerbExamples[lemma] || verbExampleOverrides[lemma] || [];
  const [germanContext, englishContext] = verbContext[categoryId] || ["In dieser Situation", "In this situation"];
  const root = reflexive ? lemma.slice(5) : lemma;
  const example = structured.example || curatedExample[0] || (reflexive
    ? `${germanContext} kann man sich ${root}.`
    : use === "t"
      ? `${germanContext} kann man etwas ${lemma}.`
      : `${germanContext} kann man ${lemma}.`);
  const exampleTranslation = structured.exampleTranslation || curatedExample[1] || (use === "t" && !reflexive
    ? `${englishContext}, you can ${english} something.`
    : `${englishContext}, you can ${english}.`);
  const grammarRefs = ["de-b1-perfekt"];
  if (reflexive || separablePrefix) grammarRefs.push("de-b1-separable-reflexive-verbs");
  if (structured.caseGovernment) grammarRefs.push("de-b1-prepositional-verbs");
  return {
    type: "verb",
    categoryId,
    slug: slugify(lemma),
    source: `to ${english}`,
    lemma,
    auxiliary,
    pastParticiple,
    preterite,
    separablePrefix: separablePrefix || null,
    reflexive,
    reflexiveCase: reflexive ? "accusative" : null,
    caseGovernment: structured.caseGovernment || (use === "t" ? "accusative" : null),
    prepositions: structured.prepositions || [],
    example,
    exampleTranslation,
    grammarRefs,
    referenceKey: record.normalizedLemma,
    referenceId: record.referenceId,
    note: null,
  };
});

const adjectiveExamples = {
  abhängig: ["Die Entscheidung ist vom Preis abhängig.", "The decision depends on the price."],
  abwesend: ["Die Kollegin ist heute wegen einer Fortbildung abwesend.", "The colleague is absent today because of a training course."],
  anwesend: ["Bei der Besprechung sind alle Teammitglieder anwesend.", "All team members are present at the meeting."],
  arbeitslos: ["Nach der Schließung des Betriebs war er einige Monate arbeitslos.", "After the company closed, he was unemployed for several months."],
  ausgebildet: ["Für diese Aufgabe brauchen wir gut ausgebildete Fachkräfte.", "We need well-trained specialists for this task."],
  berufstätig: ["Viele Eltern sind berufstätig und teilen sich die Betreuung.", "Many parents work and share the childcare."],
  bereit: ["Ich bin bereit, mehr Verantwortung zu übernehmen.", "I am ready to take on more responsibility."],
  erfolgreich: ["Das Projekt war trotz des knappen Budgets erfolgreich.", "The project was successful despite the tight budget."],
  flexibel: ["Die Arbeitszeiten sind flexibel und lassen sich gut planen.", "The working hours are flexible and easy to plan."],
  finanziell: ["Die Weiterbildung wird finanziell unterstützt.", "The further training is supported financially."],
  zuverlässig: ["Unsere neue Kollegin arbeitet sehr zuverlässig.", "Our new colleague works very reliably."],
  verantwortlich: ["Wer ist für die Organisation der Veranstaltung verantwortlich?", "Who is responsible for organising the event?"],
  verpflichtet: ["Der Arbeitgeber ist zu sicheren Arbeitsbedingungen verpflichtet.", "The employer is obliged to provide safe working conditions."],
  geeignet: ["Der Kurs ist auch für Berufstätige geeignet.", "The course is also suitable for working people."],
  erforderlich: ["Für die Bewerbung sind gute Deutschkenntnisse erforderlich.", "Good German skills are required for the application."],
  aufmerksam: ["Die Teilnehmenden hören der Erklärung aufmerksam zu.", "The participants listen attentively to the explanation."],
  eindeutig: ["Die Aufgabenstellung ist klar und eindeutig.", "The task instructions are clear and unambiguous."],
  fleißig: ["Sie lernt fleißig für die Abschlussprüfung.", "She is studying hard for the final examination."],
  gründlich: ["Bitte lesen Sie den Text gründlich durch.", "Please read the text thoroughly."],
  intelligent: ["Der Schüler findet eine intelligente Lösung für das Problem.", "The pupil finds an intelligent solution to the problem."],
  kreativ: ["Im Projekt entwickeln die Lernenden kreative Ideen.", "The learners develop creative ideas in the project."],
  mündlich: ["Der letzte Teil der Prüfung ist mündlich.", "The final part of the examination is oral."],
  schriftlich: ["Die Anmeldung muss schriftlich erfolgen.", "The registration must be submitted in writing."],
  theoretisch: ["Der Kurs verbindet theoretisches Wissen mit praktischen Übungen.", "The course combines theoretical knowledge with practical exercises."],
  verständlich: ["Die Lehrerin erklärt die Grammatik verständlich.", "The teacher explains the grammar clearly."],
  direkt: ["Von Köln nach Frankfurt gibt es eine direkte Verbindung.", "There is a direct connection from Cologne to Frankfurt."],
  gültig: ["Die Fahrkarte ist bis Mitternacht gültig.", "The ticket is valid until midnight."],
  international: ["Der Flughafen bietet viele internationale Verbindungen an.", "The airport offers many international connections."],
  mobil: ["Mit der App bleiben Reisende auch unterwegs mobil.", "The app helps travellers stay mobile while on the move."],
  regional: ["Im Regionalzug gilt ein anderer Tarif.", "A different fare applies on the regional train."],
  zentral: ["Das Hotel liegt zentral und ist leicht zu erreichen.", "The hotel is centrally located and easy to reach."],
  zugänglich: ["Der Bahnsteig ist mit dem Aufzug barrierefrei zugänglich.", "The platform is accessible without barriers by lift."],
  nördlich: ["Der Flughafen liegt nördlich der Stadt.", "The airport lies north of the city."],
  südlich: ["Südlich des Bahnhofs beginnt die Fußgängerzone.", "The pedestrian zone begins south of the station."],
  östlich: ["Das Industriegebiet liegt östlich vom Zentrum.", "The industrial area lies east of the centre."],
  fit: ["Nach der Therapie fühlt sie sich wieder fit.", "After the therapy, she feels fit again."],
  körperlich: ["Die Arbeit ist körperlich anstrengend.", "The work is physically demanding."],
  erschöpft: ["Nach der langen Wanderung waren alle völlig erschöpft.", "After the long hike, everyone was completely exhausted."],
  blind: ["Der Eingang ist auch für blinde Menschen gut zugänglich.", "The entrance is also easily accessible for blind people."],
  taub: ["Für taube Patientinnen und Patienten gibt es Gebärdensprachdolmetscher.", "Sign-language interpreters are available for deaf patients."],
  wach: ["Nach dem Kaffee bin ich wieder richtig wach.", "After the coffee, I am properly awake again."],
  müde: ["Wegen des starken Hustens war sie morgens sehr müde.", "Because of the severe cough, she was very tired in the morning."],
  schädlich: ["Rauchen ist schädlich für die Gesundheit.", "Smoking is harmful to health."],
  mager: ["Für die Suppe verwendet er mageres Fleisch.", "He uses lean meat for the soup."],
  schlank: ["Regelmäßige Bewegung hilft ihr, gesund und schlank zu bleiben.", "Regular exercise helps her stay healthy and slim."],
  begeistert: ["Die Besucher waren von der Ausstellung begeistert.", "The visitors were enthusiastic about the exhibition."],
  dankbar: ["Ich bin dir für deine Unterstützung sehr dankbar.", "I am very grateful to you for your support."],
  entschlossen: ["Sie ist entschlossen, ihr Ziel zu erreichen.", "She is determined to achieve her goal."],
  gespannt: ["Wir sind gespannt auf das Ergebnis.", "We are eager to see the result."],
  froh: ["Ich bin froh, dass alles gut geklappt hat.", "I am glad that everything worked out well."],
  neugierig: ["Die Kinder sind neugierig auf das Experiment.", "The children are curious about the experiment."],
  optimistisch: ["Trotz der Schwierigkeiten bleibt das Team optimistisch.", "Despite the difficulties, the team remains optimistic."],
  peinlich: ["Der Fehler war ihm sehr peinlich.", "He found the mistake very embarrassing."],
  realistisch: ["Unser Zeitplan ist knapp, aber realistisch.", "Our timetable is tight but realistic."],
  ängstlich: ["Vor der Untersuchung wirkte das Kind ängstlich.", "The child seemed anxious before the examination."],
  ärgerlich: ["Die kurzfristige Absage ist wirklich ärgerlich.", "The last-minute cancellation is really annoying."],
  wütend: ["Die Kundin war wegen der falschen Rechnung wütend.", "The customer was angry about the incorrect invoice."],
  vergnügt: ["Nach dem Fest gingen die Gäste vergnügt nach Hause.", "After the celebration, the guests went home cheerfully."],
  mutig: ["Es war mutig von ihr, offen über das Problem zu sprechen.", "It was brave of her to speak openly about the problem."],
  einsam: ["Nach dem Umzug fühlte er sich zunächst einsam.", "After moving, he initially felt lonely."],
  begrenzt: ["Die Zahl der verfügbaren Plätze ist begrenzt.", "The number of available places is limited."],
  befriedigend: ["Das Ergebnis ist noch nicht ganz befriedigend.", "The result is not yet entirely satisfactory."],
  kompliziert: ["Das Antragsverfahren ist unnötig kompliziert.", "The application process is unnecessarily complicated."],
  korrekt: ["Bitte prüfen Sie, ob alle Angaben korrekt sind.", "Please check whether all details are correct."],
  kostenlos: ["Die Beratung ist für Mitglieder kostenlos.", "The consultation is free of charge for members."],
  mangelhaft: ["Die gelieferte Ware war mangelhaft.", "The delivered goods were defective."],
  rechtlich: ["Die Situation muss rechtlich geprüft werden.", "The situation must be examined from a legal perspective."],
  verboten: ["Das Parken vor der Einfahrt ist verboten.", "Parking in front of the entrance is forbidden."],
  verdächtig: ["Der ungewöhnliche Anruf kam ihr verdächtig vor.", "The unusual call seemed suspicious to her."],
  vergeblich: ["Wir haben vergeblich nach einer freien Wohnung gesucht.", "We searched in vain for an available apartment."],
  vernünftig: ["Eine schriftliche Vereinbarung wäre vernünftig.", "A written agreement would be reasonable."],
  untersagt: ["Die Nutzung des Geräts ist hier untersagt.", "The use of the device is prohibited here."],
  nötig: ["Für die Reparatur ist ein Ersatzteil nötig.", "A spare part is necessary for the repair."],
  fällig: ["Die nächste Zahlung ist am Monatsende fällig.", "The next payment is due at the end of the month."],
  unentschieden: ["Nach neunzig Minuten stand das Spiel unentschieden.", "After ninety minutes, the match was tied."],
  alltäglich: ["Digitale Kommunikation ist heute alltäglich.", "Digital communication is commonplace today."],
  allgemein: ["Diese allgemeine Regel gilt für alle Kurse.", "This general rule applies to all courses."],
  alternativ: ["Wir suchen nach einer alternativen Lösung.", "We are looking for an alternative solution."],
  automatisch: ["Die Tür schließt automatisch.", "The door closes automatically."],
  durchschnittlich: ["Die durchschnittliche Wartezeit beträgt zwanzig Minuten.", "The average waiting time is twenty minutes."],
  elektronisch: ["Die Rechnung wird elektronisch verschickt.", "The invoice is sent electronically."],
  individuell: ["Jede Bewerbung wird individuell geprüft.", "Every application is assessed individually."],
  kulturell: ["Die Stadt bietet ein vielfältiges kulturelles Programm.", "The city offers a varied cultural programme."],
  politisch: ["Das Thema wird politisch kontrovers diskutiert.", "The topic is discussed controversially in politics."],
  sozial: ["Der Verein unterstützt soziale Projekte.", "The association supports social projects."],
  staatlich: ["Die Ausbildung wird staatlich gefördert.", "The training is supported by the state."],
  technisch: ["Das Gerät ist technisch auf dem neuesten Stand.", "The device is technically up to date."],
  traditionell: ["Das Gericht wird traditionell an Feiertagen serviert.", "The dish is traditionally served on public holidays."],
  virtuell: ["Die Besprechung findet in einem virtuellen Raum statt.", "The meeting takes place in a virtual room."],
  weltweit: ["Das Unternehmen ist weltweit tätig.", "The company operates worldwide."],
};

const adjectiveSpecs = adjectiveRows.map((line) => {
  const values = rowValues(line);
  if (![3, 5].includes(values.length)) {
    throw new Error(`adjective row has ${values.length} fields; expected 3 or 5: ${line}`);
  }
  const [categoryId, target, source, rowExample, rowExampleTranslation] = values;
  const { record } = findPreferredReference({ referenceKey: target, expectedReferencePos: "other" });
  const [example, exampleTranslation] = rowExample
    ? [rowExample, rowExampleTranslation]
    : adjectiveExamples[target] || [];
  if (!example || !exampleTranslation) throw new Error(`Missing curated adjective example for ${target}`);
  return {
    type: "term",
    categoryId,
    slug: slugify(target),
    source,
    target,
    lemma: target,
    partOfSpeech: "adjective",
    example,
    exampleTranslation,
    grammarRefs: ["de-b1-adjective-endings"],
    referenceKey: record.normalizedLemma,
    referenceId: record.referenceId,
    note: null,
  };
});

const adverbSpecs = adverbRows.map((line) => {
  const [categoryId, target, source, example, exampleTranslation] = splitRow(line, 5, "adverb");
  const { record } = findPreferredReference({ referenceKey: target, expectedReferencePos: "other" });
  return {
    type: "term",
    categoryId,
    slug: slugify(target),
    source,
    target,
    lemma: target,
    partOfSpeech: "adverb",
    example,
    exampleTranslation,
    grammarRefs: ["de-b1-word-order-foundation"],
    referenceKey: record.normalizedLemma,
    referenceId: record.referenceId,
    note: null,
  };
});

const connectorSpecs = connectorRows.map((line) => {
  const values = rowValues(line);
  if (![5, 6].includes(values.length)) {
    throw new Error(`connector row has ${values.length} fields; expected 5 or 6: ${line}`);
  }
  const [target, source, example, exampleTranslation, grammarRef, explicitReferenceKey] = values;
  const referenceKey = explicitReferenceKey || target;
  const { record } = findPreferredReference({
    referenceKey,
    expectedReferencePos: explicitReferenceKey ? null : target === "je ... desto ..." ? "phrase" : "other",
  });
  return {
    type: "term",
    categoryId: "connectors-prepositions",
    slug: `connector-${slugify(target)}`,
    source,
    target,
    lemma: target,
    partOfSpeech: "connector",
    example,
    exampleTranslation,
    grammarRefs: [grammarRef],
    referenceKey: record.normalizedLemma,
    referenceId: record.referenceId,
    note: null,
  };
});

const prepositionSpecs = prepositionRows.map((line) => {
  const [target, source, example, exampleTranslation, grammarRef] = splitRow(line, 5, "preposition");
  const { record } = findPreferredReference({ referenceKey: target, expectedReferencePos: "other" });
  return {
    type: "term",
    categoryId: "connectors-prepositions",
    slug: `preposition-${slugify(target)}`,
    source,
    target,
    lemma: target,
    partOfSpeech: "preposition",
    example,
    exampleTranslation,
    grammarRefs: [grammarRef],
    referenceKey: record.normalizedLemma,
    referenceId: record.referenceId,
    note: null,
  };
});

const phraseSpecs = phraseRows.map((line) => {
  const [slug, source, target, example, exampleTranslation, referenceKey, grammarRef] = splitRow(line, 7, "phrase");
  let match;
  try {
    match = findReference({ referenceKey, expectedReferencePos: null, requireUncovered: false });
  } catch (error) {
    const candidates = inventory.records
      .map((record) => ({ record, keys: recordKeys(record) }))
      .filter(({ keys }) => keys.includes(normalize(referenceKey)))
      .sort((a, b) => Number(a.record.coverageStatus === "uncovered") - Number(b.record.coverageStatus === "uncovered"));
    if (!candidates.length) throw error;
    match = { record: candidates[0].record, exact: true, variant: false };
  }
  return {
    type: "term",
    categoryId: "functional-exam-phrases",
    slug,
    source,
    target,
    lemma: target,
    partOfSpeech: "phrase",
    example,
    exampleTranslation,
    grammarRefs: [grammarRef],
    referenceKey: match.record.normalizedLemma,
    referenceId: match.record.referenceId,
    note: null,
  };
});

const specs = [
  ...nounSpecs,
  ...verbSpecs,
  ...adjectiveSpecs,
  ...adverbSpecs,
  ...connectorSpecs,
  ...prepositionSpecs,
  ...phraseSpecs,
];

if (specs.length !== TARGET_ADDITIONS) {
  throw new Error(`Expected ${TARGET_ADDITIONS} Phase 10 specs, received ${specs.length}`);
}

const existingKeys = new Set();
const addExistingKey = ({ partOfSpeech, lemma, reflexive = false, id }) => {
  const key = `${partOfSpeech}:${normalize(lemma)}:${Boolean(reflexive)}`;
  if (existingKeys.has(key)) throw new Error(`Existing vocabulary already contains duplicate key ${key} (${id})`);
  existingKeys.add(key);
};

phase9Specs.forEach((spec) => addExistingKey({
  partOfSpeech: spec.type === "term" ? spec.partOfSpeech : spec.type,
  lemma: spec.lemma || spec.target,
  reflexive: spec.reflexive,
  id: `${spec.categoryId}|${spec.slug}`,
}));

const baseCallPattern = /\b(noun|verb|term)\(\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*"([^"]+)"(?:\s*,\s*"([^"]+)")?/gu;
for (const match of lexemesSource.matchAll(baseCallPattern)) {
  const [, type, categoryId, slug, , lemma, termPos] = match;
  addExistingKey({ partOfSpeech: type === "term" ? termPos : type, lemma, reflexive: type === "verb" && lemma.startsWith("sich "), id: `${categoryId}|${slug}` });
}

const newIds = new Set();
specs.forEach((spec) => {
  const partOfSpeech = spec.type === "term" ? spec.partOfSpeech : spec.type;
  const key = `${partOfSpeech}:${normalize(spec.lemma || spec.target)}:${Boolean(spec.reflexive)}`;
  if (existingKeys.has(key)) throw new Error(`Phase 10 duplicates existing lexical item: ${key}`);
  if (newIds.has(`${spec.categoryId}|${spec.slug}`)) throw new Error(`Duplicate Phase 10 ID: ${spec.categoryId}|${spec.slug}`);
  existingKeys.add(key);
  newIds.add(`${spec.categoryId}|${spec.slug}`);
});

const recordById = new Map(inventory.records.map((record) => [record.referenceId, record]));
specs.forEach((spec) => {
  const record = recordById.get(spec.referenceId);
  const lexemeId = `de-b1-${spec.categoryId}-${spec.slug}`;
  if (!record) throw new Error(`Missing inventory record ${spec.referenceId} for ${lexemeId}`);
  record.lexemeIds = [...new Set([...(record.lexemeIds || []), lexemeId])];
  if (record.coverageStatus === "uncovered") {
    const productionPos = spec.type === "term" ? spec.partOfSpeech : spec.type;
    const variant = normalize(record.normalizedLemma) !== normalize(spec.referenceKey);
    record.coverageStatus = variant
      ? "variant-covered"
      : record.partOfSpeech === productionPos
        ? "covered"
        : "partially-covered";
  }
});

const statusCounts = inventory.records.reduce((counts, record) => {
  counts[record.coverageStatus] = (counts[record.coverageStatus] || 0) + 1;
  return counts;
}, {});
const exactCoveredCount = statusCounts.covered || 0;
const variantCoveredCount = statusCounts["variant-covered"] || 0;
const coveredCount = exactCoveredCount + variantCoveredCount;
const partiallyCoveredCount = statusCounts["partially-covered"] || 0;
const uncoveredCount = statusCounts.uncovered || 0;
const coveragePercentage = Number(((coveredCount / inventory.records.length) * 100).toFixed(2));

inventory.metadata = {
  ...inventory.metadata,
  reviewDate: REVIEW_DATE,
  productionLexemeCount: TARGET_PRODUCTION,
  exactCoveredCount,
  variantCoveredCount,
  coveredCount,
  partiallyCoveredCount,
  uncoveredCount,
  coveragePercentage,
};

const summary = {
  ...inventory.metadata,
  exactCoveredCount,
  variantCoveredCount,
};

const partOfSpeechCounts = specs.reduce((counts, spec) => {
  const partOfSpeech = spec.type === "term" ? spec.partOfSpeech : spec.type;
  counts[partOfSpeech] = (counts[partOfSpeech] || 0) + 1;
  return counts;
}, {});
const categoryCounts = specs.reduce((counts, spec) => {
  counts[spec.categoryId] = (counts[spec.categoryId] || 0) + 1;
  return counts;
}, {});
const referencePartOfSpeechBreakdown = inventory.records.reduce((breakdown, record) => {
  const partOfSpeech = record.partOfSpeech || "other";
  const status = record.coverageStatus;
  if (!breakdown[partOfSpeech]) {
    breakdown[partOfSpeech] = { covered: 0, variantCovered: 0, partiallyCovered: 0, uncovered: 0, total: 0 };
  }
  breakdown[partOfSpeech].total += 1;
  if (status === "covered") breakdown[partOfSpeech].covered += 1;
  if (status === "variant-covered") breakdown[partOfSpeech].variantCovered += 1;
  if (status === "partially-covered") breakdown[partOfSpeech].partiallyCovered += 1;
  if (status === "uncovered") breakdown[partOfSpeech].uncovered += 1;
  return breakdown;
}, {});
summary.phase10AdditionCount = TARGET_ADDITIONS;
summary.phase10PartOfSpeechCounts = partOfSpeechCounts;
summary.phase10CategoryCounts = categoryCounts;
summary.referencePartOfSpeechBreakdown = referencePartOfSpeechBreakdown;

const sampleEntries = [];
const sampleIds = new Set();
const addSample = (spec, reason) => {
  const lexemeId = `de-b1-${spec.categoryId}-${spec.slug}`;
  if (sampleIds.has(lexemeId)) return;
  sampleIds.add(lexemeId);
  sampleEntries.push({
    lexemeId,
    categoryId: spec.categoryId,
    english: spec.source,
    german: spec.type === "noun" ? `${spec.article} ${spec.lemma}` : spec.lemma || spec.target,
    partOfSpeech: spec.type === "term" ? spec.partOfSpeech : spec.type,
    metadata: spec.type === "noun"
      ? { article: spec.article, gender: spec.gender, plural: spec.plural, note: spec.note }
      : spec.type === "verb"
        ? {
          auxiliary: spec.auxiliary,
          pastParticiple: spec.pastParticiple,
          preterite: spec.preterite,
          separablePrefix: spec.separablePrefix,
          reflexive: spec.reflexive,
          caseGovernment: spec.caseGovernment,
          prepositions: spec.prepositions,
        }
        : { grammarRefs: spec.grammarRefs },
    example: spec.example,
    exampleTranslation: spec.exampleTranslation,
    referenceMapping: { referenceId: spec.referenceId, referenceKey: spec.referenceKey },
    selectionReason: reason,
  });
};

const auditQuotas = {
  noun: 30,
  verb: 40,
  adjective: 15,
  adverb: 10,
  connector: 10,
  preposition: 5,
  phrase: 10,
};
Object.entries(auditQuotas).forEach(([partOfSpeech, quota]) => {
  specs
    .filter((spec) => (spec.type === "term" ? spec.partOfSpeech : spec.type) === partOfSpeech)
    .slice(-quota)
    .forEach((spec) => addSample(spec, `phase-10.2-representative-${partOfSpeech}`));
});
specs.filter((spec) => spec.note || spec.reflexive || spec.separablePrefix || (spec.prepositions || []).length)
  .slice(-50)
  .forEach((spec) => addSample(spec, spec.note ? "regional-variant" : "structurally-unusual"));

fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(specs, null, 2)}\n`, "utf8");
fs.writeFileSync(INVENTORY_PATH, `${JSON.stringify(inventory, null, 2)}\n`, "utf8");
fs.writeFileSync(SUMMARY_PATH, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
fs.writeFileSync(AUDIT_PATH, `${JSON.stringify({
  generatedAt: REVIEW_DATE,
  methodology: "Deterministic 100+ entry Phase 10.2 audit sample with explicit quotas across every production part of speech, plus regional variants and structurally unusual verbs.",
  limitation: "This is a developer curation and automated validation sample. It does not claim complete expert linguistic human review.",
  productionLexemeCount: TARGET_PRODUCTION,
  phase10AdditionCount: TARGET_ADDITIONS,
  entryCount: sampleEntries.length,
  entries: sampleEntries,
}, null, 2)}\n`, "utf8");

console.log(JSON.stringify({
  outputPath: OUTPUT_PATH,
  count: specs.length,
  partOfSpeechCounts,
  categoryCounts,
  coverage: {
    exactCoveredCount,
    variantCoveredCount,
    partiallyCoveredCount,
    uncoveredCount,
    coveragePercentage,
  },
  auditCount: sampleEntries.length,
}, null, 2));
