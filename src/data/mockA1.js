import {
  ExamVocabularyPool,
  ListeningTasks,
  ReadingTasks,
} from "./examPrep";

export const MOCK_A1_DISCLAIMER =
  "Original CEFR A1-aligned practice; not an official Serbian government or University of Belgrade exam.";

const sectionSize = 10;

const rotate = (items, start) =>
  items.map((_, index) => items[(index + start) % items.length]);

const placeAnswer = (answer, distractors, position) => {
  const options = [...new Set(distractors.filter((item) => item !== answer))].slice(0, 3);
  options.splice(position % (options.length + 1), 0, answer);
  return options;
};

const readingTrueFalse = {
  "reading-introduction": {
    prompt: "True or false: Ana lives in Niš.",
    options: ["True", "False"],
    answer: "False",
    explanation: "Ana says that she lives in Novi Sad.",
  },
  "reading-cafe": {
    prompt: "True or false: The café is open on Sunday.",
    options: ["True", "False"],
    answer: "False",
    explanation: "The notice says „Nedeljom kafe ne radi.”",
  },
  "reading-bus-message": {
    prompt: "True or false: Marko should be at the station before the bus leaves.",
    options: ["True", "False"],
    answer: "True",
    explanation: "He should arrive at 9:00 and the bus leaves at 9:30.",
  },
  "reading-apartment": {
    prompt: "True or false: The apartment has a balcony.",
    options: ["True", "False"],
    answer: "False",
    explanation: "The text says „Stan nema balkon.”",
  },
};

const createReadingQuestions = (seed) => {
  const counts = [3, 3, 2, 2];
  return rotate(ReadingTasks, seed % ReadingTasks.length).flatMap((task, taskIndex) => {
    const selected = rotate(task.questions, (seed + taskIndex) % task.questions.length)
      .slice(0, counts[taskIndex] - 1);
    return [
      {
        ...readingTrueFalse[task.id],
        id: `mock-${seed}-${task.id}-true-false`,
        type: "true-false",
      },
      ...selected.map((question) => ({
        ...question,
        id: `mock-${seed}-${question.id}`,
        type: "multiple-choice",
      })),
    ].map((question) => ({
      ...question,
      section: "reading",
      stimulusId: task.id,
      stimulusTitle: task.title,
      stimulusText: task.text,
    }));
  });
};

const createListeningQuestions = (seed) => {
  const counts = [3, 3, 2, 2];
  return rotate(ListeningTasks, seed % ListeningTasks.length).flatMap((task, taskIndex) =>
    rotate(task.questions, (seed + taskIndex) % task.questions.length)
      .slice(0, counts[taskIndex])
      .map((question) => ({
        ...question,
        id: `mock-${seed}-${question.id}`,
        section: "listening",
        audioTitle: task.title,
        transcript: task.transcript,
        translation: task.translation,
      }))
  );
};

const uniqueVocabulary = (field) =>
  ExamVocabularyPool.filter((word, index, words) =>
    words.findIndex((candidate) => candidate[field] === word[field]) === index
  );

const sourceVocabulary = uniqueVocabulary("source");
const targetVocabulary = uniqueVocabulary("target");

const vocabularyDistractors = (pool, field, word, seed, index) => {
  const values = [];
  let offset = 1;
  while (values.length < 3) {
    const candidate = pool[(seed + index * 29 + offset * 41) % pool.length][field];
    if (candidate !== word[field] && !values.includes(candidate)) values.push(candidate);
    offset += 1;
  }
  return values;
};

const phraseScenarios = [
  {
    source: "thank you",
    prompt: "Someone helps you. Which Serbian phrase do you use to thank them?",
  },
  {
    source: "where is the toilet?",
    prompt: "You need to find the toilet. Which Serbian question do you use?",
  },
];

const phraseScenarioSources = new Set(phraseScenarios.map(({ source }) => source));
const translationVocabulary = ExamVocabularyPool.filter(
  ({ source }) => !phraseScenarioSources.has(source)
);

const createVocabularyQuestions = (seed) => {
  const start = (seed * 17) % translationVocabulary.length;
  const selected = Array.from({ length: 8 }, (_, index) =>
    translationVocabulary[(start + index * 31) % translationVocabulary.length]
  );
  const translations = selected.map((word, index) => {
    const serbianDirection = index < 4;
    const field = serbianDirection ? "target" : "source";
    const pool = serbianDirection ? targetVocabulary : sourceVocabulary;
    const answer = word[field];
    return {
      id: `mock-${seed}-vocabulary-${word.id}-${field}`,
      section: "vocabulary",
      sourceId: word.id,
      prompt: serbianDirection
        ? `Choose the Serbian translation for “${word.source}”.`
        : `Choose the English meaning of “${word.target}”.`,
      options: placeAnswer(
        answer,
        vocabularyDistractors(pool, field, word, seed, index),
        seed + index
      ),
      answer,
      explanation: `${word.source} → ${word.target}`,
      vocabularyDirection: serbianDirection ? "english-serbian" : "serbian-english",
    };
  });
  const contexts = phraseScenarios.map((scenario, index) => {
    const word = ExamVocabularyPool.find(({ source }) => source === scenario.source);
    return {
      id: `mock-${seed}-vocabulary-context-${word.id}`,
      section: "vocabulary",
      sourceId: word.id,
      prompt: scenario.prompt,
      options: placeAnswer(
        word.target,
        vocabularyDistractors(targetVocabulary, "target", word, seed + 7, index),
        seed + index + 2
      ),
      answer: word.target,
      explanation: `${word.source} → ${word.target}`,
      vocabularyDirection: "context",
    };
  });
  return [...translations, ...contexts];
};

export const MockGrammarQuestions = [
  {
    id: "mock-grammar-alphabets",
    lessonIds: ["latin-alphabet", "cyrillic-alphabet"],
    prompt: "Which pair shows the same Serbian word in Latin and Cyrillic?",
    options: ["kuća — кућа", "kuća — куца", "kuca — кућа"],
    answer: "kuća — кућа",
    explanation: "The letters ć and ћ represent the same Serbian sound.",
  },
  {
    id: "mock-grammar-gender-adjective",
    lessonIds: ["noun-gender", "adjective-agreement"],
    prompt: "Choose the correctly matched adjective and noun.",
    options: ["dobra žena", "dobar žena", "dobro žena"],
    answer: "dobra žena",
    explanation: "The feminine noun žena takes the feminine adjective form dobra.",
  },
  {
    id: "mock-grammar-plural-number",
    lessonIds: ["plural-basics", "number-agreement"],
    prompt: "Choose the correct phrase: three days.",
    options: ["tri dana", "tri dani", "tri dan"],
    answer: "tri dana",
    explanation: "Numbers two to four use the counting form: tri dana.",
  },
  {
    id: "mock-grammar-pronouns-biti",
    lessonIds: ["personal-pronouns", "biti"],
    prompt: "Complete: Mi ___ iz Srbije.",
    options: ["smo", "sam", "su"],
    answer: "smo",
    explanation: "The present form of biti with mi is smo.",
  },
  {
    id: "mock-grammar-present-negation",
    lessonIds: ["present-tense", "negation"],
    prompt: "Choose the correct sentence: I am not working today.",
    options: ["Ne radim danas.", "Nisam radim danas.", "Radim ne danas."],
    answer: "Ne radim danas.",
    explanation: "Use ne directly before an ordinary present-tense verb.",
  },
  {
    id: "mock-grammar-imati-accusative",
    lessonIds: ["imati", "accusative"],
    prompt: "Choose the correct sentence: I have a brother.",
    options: ["Imam brata.", "Imam brat.", "Imaš bratu."],
    answer: "Imam brata.",
    explanation: "Imam is the ja form of imati; animate brat takes accusative brata.",
  },
  {
    id: "mock-grammar-question-genitive",
    lessonIds: ["question-formation", "genitive"],
    prompt: "Which answer correctly follows: Odakle dolaziš?",
    options: ["Dolazim iz Srbije.", "Dolazim u Srbiju.", "Dolazim sa Srbijom."],
    answer: "Dolazim iz Srbije.",
    explanation: "The origin phrase uses iz plus the genitive: iz Srbije.",
  },
  {
    id: "mock-grammar-dative-possessive",
    lessonIds: ["dative", "possessives"],
    prompt: "Which pair means: I need help. This is my sister.",
    options: [
      "Treba mi pomoć. Ovo je moja sestra.",
      "Treba me pomoć. Ovo je moj sestra.",
      "Treba ja pomoć. Ovo je moje sestra.",
    ],
    answer: "Treba mi pomoć. Ovo je moja sestra.",
    explanation: "Treba mi uses the dative; moja agrees with the feminine noun sestra.",
  },
  {
    id: "mock-grammar-locative-preposition",
    lessonIds: ["locative", "common-prepositions"],
    prompt: "Choose the sentence that describes a location at school.",
    options: ["Radim u školi.", "Idem u školu.", "Dolazim iz škole."],
    answer: "Radim u školi.",
    explanation: "A fixed location uses u plus the locative: u školi.",
  },
  {
    id: "mock-grammar-instrumental",
    lessonIds: ["instrumental"],
    prompt: "Choose the correct phrase: I am going by bus.",
    options: ["Idem autobusom.", "Idem sa autobusom.", "Idem autobusa."],
    answer: "Idem autobusom.",
    explanation: "A means of transport uses the instrumental without sa.",
  },
].map((question) => ({ ...question, section: "grammar" }));

export const createMockA1 = (seed = 0) => ({
  id: `mock-a1-${seed}`,
  seed,
  sections: [
    { id: "reading", title: "Reading", questions: createReadingQuestions(seed) },
    { id: "listening", title: "Listening", questions: createListeningQuestions(seed) },
    { id: "vocabulary", title: "Vocabulary", questions: createVocabularyQuestions(seed) },
    { id: "grammar", title: "Grammar", questions: MockGrammarQuestions },
  ],
});

export const scoreMockA1 = (mock, answers) => {
  const sections = mock.sections.map((section) => {
    const score = section.questions.filter(
      (question) => answers[question.id] === question.answer
    ).length;
    return { id: section.id, title: section.title, score, total: section.questions.length };
  });
  return {
    score: sections.reduce((total, section) => total + section.score, 0),
    total: sections.reduce((total, section) => total + section.total, 0),
    sections,
  };
};

export const MOCK_A1_SECTION_SIZE = sectionSize;
