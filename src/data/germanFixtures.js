const word = (id, source, target, extra = {}) => ({
  id,
  source,
  target,
  status: "learning",
  favorite: false,
  kind: "curriculum",
  level: "B1",
  sourceType: "temporary-original",
  ...extra,
});

export const GermanCurriculum = [
  {
    id: "travel",
    titleKey: "lessons.travel.title",
    descriptionKey: "lessons.travel.description",
    category: "travel",
    items: [
      word("de-travel-zug", "train", "der Zug", { article: "der", plural: "die Züge" }),
      word("de-travel-bahnhof", "station", "der Bahnhof", { article: "der", plural: "die Bahnhöfe" }),
      word("de-travel-fahrkarte", "ticket", "die Fahrkarte", { article: "die", plural: "die Fahrkarten" }),
      word("de-travel-abfahren", "to depart", "abfahren", { partOfSpeech: "verb" }),
    ],
  },
  {
    id: "daily-life",
    titleKey: "lessons.dailyLife.title",
    descriptionKey: "lessons.dailyLife.description",
    category: "daily-life",
    items: [
      word("de-daily-termin", "appointment", "der Termin", { article: "der", plural: "die Termine" }),
      word("de-daily-erledigen", "to take care of", "erledigen", { partOfSpeech: "verb" }),
      word("de-daily-zuverlaessig", "reliable", "zuverlässig", { partOfSpeech: "adjective" }),
      word("de-daily-gelegenheit", "opportunity", "die Gelegenheit", { article: "die", plural: "die Gelegenheiten" }),
    ],
  },
  {
    id: "communication",
    titleKey: "lessons.communication.title",
    descriptionKey: "lessons.communication.description",
    category: "communication",
    items: [
      word("de-communication-meinung", "opinion", "die Meinung", { article: "die", plural: "die Meinungen" }),
      word("de-communication-zustimmen", "to agree", "zustimmen", { partOfSpeech: "verb" }),
      word("de-communication-widersprechen", "to disagree", "widersprechen", { partOfSpeech: "verb" }),
      word("de-communication-begruenden", "to justify", "begründen", { partOfSpeech: "verb" }),
    ],
  },
];

export const GermanFixtureWordCount = GermanCurriculum.reduce(
  (total, lesson) => total + lesson.items.length,
  0
);
