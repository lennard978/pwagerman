import { Curriculum } from "./data";
import { GrammarLessons } from "./grammar";

export const EXAM_PREP_DISCLAIMER =
  "Original app-authored practice aligned to CEFR A1 skills; not official exam content.";

export const ExamPrepAreas = [
  {
    id: "reading",
    title: "Reading",
    description: "Read short everyday texts and answer clear comprehension questions.",
    status: "available",
  },
  {
    id: "listening",
    title: "Listening",
    description: "Listen to short Serbian recordings and check the key details.",
    status: "available",
  },
  {
    id: "vocabulary-grammar",
    title: "Vocabulary & Grammar",
    description: "Practise a bounded mix of course vocabulary and grammar.",
    status: "available",
  },
  {
    id: "mock-a1",
    title: "Mock A1",
    description: "Complete a 40-question practice exam across four A1 skills.",
    status: "available",
  },
];

export const ReadingTasks = [
  {
    id: "reading-introduction",
    title: "Ana introduces herself",
    text:
      "Zovem se Ana Petrović. Imam dvadeset četiri godine i živim u Novom Sadu. Radim u školi. Govorim srpski i engleski. Vikendom pijem kafu sa prijateljicom Milom.",
    questions: [
      {
        id: "reading-introduction-city",
        prompt: "Where does Ana live?",
        options: ["In Novi Sad", "In Niš", "In Belgrade"],
        answer: "In Novi Sad",
        explanation: "Ana says: „Živim u Novom Sadu.”",
      },
      {
        id: "reading-introduction-work",
        prompt: "Where does Ana work?",
        options: ["At a school", "At a bank", "At a café"],
        answer: "At a school",
        explanation: "„Radim u školi” means “I work at a school.”",
      },
      {
        id: "reading-introduction-languages",
        prompt: "Which languages does Ana speak?",
        options: ["Serbian and English", "Serbian and German", "English only"],
        answer: "Serbian and English",
        explanation: "Ana says that she speaks Serbian and English.",
      },
      {
        id: "reading-introduction-weekend",
        prompt: "What does Ana do at the weekend?",
        options: ["She drinks coffee with Mila", "She travels to Niš", "She works at a café"],
        answer: "She drinks coffee with Mila",
        explanation: "„Vikendom pijem kafu sa prijateljicom Milom.”",
      },
    ],
  },
  {
    id: "reading-cafe",
    title: "Café notice",
    text:
      "Kafe Most radi od 8 do 20 časova. Kafa košta 180 dinara, čaj 160, a sok 200. Doručak je od 8 do 11. Nedeljom kafe ne radi.",
    questions: [
      {
        id: "reading-cafe-hours",
        prompt: "When does the café close?",
        options: ["At 20:00", "At 18:00", "At 11:00"],
        answer: "At 20:00",
        explanation: "The notice says that the café works from 8:00 to 20:00.",
      },
      {
        id: "reading-cafe-cheapest",
        prompt: "Which drink is the least expensive?",
        options: ["Tea", "Coffee", "Juice"],
        answer: "Tea",
        explanation: "Tea is 160 dinars, less than coffee or juice.",
      },
      {
        id: "reading-cafe-breakfast",
        prompt: "Until what time is breakfast available?",
        options: ["Until 11:00", "Until 8:00", "Until 20:00"],
        answer: "Until 11:00",
        explanation: "„Doručak je od 8 do 11.”",
      },
      {
        id: "reading-cafe-closed",
        prompt: "On which day is the café closed?",
        options: ["Sunday", "Saturday", "Monday"],
        answer: "Sunday",
        explanation: "„Nedeljom kafe ne radi” means the café is closed on Sundays.",
      },
    ],
  },
  {
    id: "reading-bus-message",
    title: "Bus message",
    text:
      "Poruka za Marka: Autobus za Niš polazi u petak u 9.30 sa perona 4. Karta košta 1.200 dinara. Dođi na stanicu u 9.00. Ponesi pasoš.",
    questions: [
      {
        id: "reading-bus-destination",
        prompt: "Where is the bus going?",
        options: ["To Niš", "To Novi Sad", "To Belgrade"],
        answer: "To Niš",
        explanation: "The message says „Autobus za Niš”.",
      },
      {
        id: "reading-bus-day",
        prompt: "On which day does the bus leave?",
        options: ["Friday", "Thursday", "Saturday"],
        answer: "Friday",
        explanation: "„U petak” means “on Friday.”",
      },
      {
        id: "reading-bus-arrival",
        prompt: "When should Marko arrive at the station?",
        options: ["At 9:00", "At 9:30", "At 10:00"],
        answer: "At 9:00",
        explanation: "The message says „Dođi na stanicu u 9.00.”",
      },
      {
        id: "reading-bus-platform",
        prompt: "Which station platform does the bus use?",
        options: ["4", "9", "12"],
        answer: "4",
        explanation: "The bus leaves „sa perona 4”.",
      },
    ],
  },
  {
    id: "reading-apartment",
    title: "Apartment description",
    text:
      "Moj stan je u centru grada. Ima dnevnu sobu, malu kuhinju, spavaću sobu i kupatilo. U dnevnoj sobi su sto, četiri stolice i velika lampa. Stan nema balkon, ali je svetao i topao.",
    questions: [
      {
        id: "reading-apartment-place",
        prompt: "Where is the apartment?",
        options: ["In the city centre", "Near the airport", "Outside the city"],
        answer: "In the city centre",
        explanation: "„U centru grada” means “in the city centre.”",
      },
      {
        id: "reading-apartment-kitchen",
        prompt: "What is the kitchen like?",
        options: ["Small", "Large", "New"],
        answer: "Small",
        explanation: "The description says „malu kuhinju”.",
      },
      {
        id: "reading-apartment-chairs",
        prompt: "How many chairs are in the living room?",
        options: ["Four", "Two", "Five"],
        answer: "Four",
        explanation: "The living room has „četiri stolice”.",
      },
      {
        id: "reading-apartment-missing",
        prompt: "What does the apartment not have?",
        options: ["A balcony", "A bathroom", "A bedroom"],
        answer: "A balcony",
        explanation: "„Stan nema balkon” means that the apartment has no balcony.",
      },
    ],
  },
];

export const ListeningTasks = [
  {
    id: "listening-introduction",
    title: "Luka introduces himself",
    transcript:
      "Zdravo, ja sam Luka. Imam dvadeset osam godina i živim u Beogradu. Radim u banci. Posle posla često igram fudbal sa prijateljima.",
    translation:
      "Hello, I am Luka. I am twenty-eight and live in Belgrade. I work at a bank. After work I often play football with friends.",
    questions: [
      {
        id: "listening-introduction-age",
        prompt: "How old is Luka?",
        options: ["28", "24", "38"],
        answer: "28",
        explanation: "Luka says „Imam dvadeset osam godina.”",
      },
      {
        id: "listening-introduction-city",
        prompt: "Where does Luka live?",
        options: ["In Belgrade", "In Novi Sad", "In Niš"],
        answer: "In Belgrade",
        explanation: "He says „Živim u Beogradu.”",
      },
      {
        id: "listening-introduction-job",
        prompt: "Where does Luka work?",
        options: ["At a bank", "At a school", "At a hotel"],
        answer: "At a bank",
        explanation: "„Radim u banci” means “I work at a bank.”",
      },
      {
        id: "listening-introduction-free-time",
        prompt: "What does Luka often do after work?",
        options: ["He plays football", "He drinks coffee", "He studies English"],
        answer: "He plays football",
        explanation: "He often plays football with friends after work.",
      },
    ],
  },
  {
    id: "listening-cafe-order",
    title: "A café order",
    transcript:
      "Dobar dan. Želim jednu kafu sa mlekom i sendvič, molim. Kafa je sto osamdeset dinara, a sendvič trista. To je sve, hvala.",
    translation:
      "Good afternoon. I would like one coffee with milk and a sandwich, please. The coffee is 180 dinars and the sandwich is 300. That is all, thank you.",
    questions: [
      {
        id: "listening-cafe-drink",
        prompt: "Which drink does the customer order?",
        options: ["Coffee with milk", "Tea with milk", "Juice"],
        answer: "Coffee with milk",
        explanation: "The customer asks for „kafu sa mlekom”.",
      },
      {
        id: "listening-cafe-food",
        prompt: "What food does the customer order?",
        options: ["A sandwich", "Breakfast", "Bread"],
        answer: "A sandwich",
        explanation: "The order includes „sendvič”.",
      },
      {
        id: "listening-cafe-coffee-price",
        prompt: "How much is the coffee?",
        options: ["180 dinars", "300 dinars", "160 dinars"],
        answer: "180 dinars",
        explanation: "The audio says that the coffee is 180 dinars.",
      },
      {
        id: "listening-cafe-more",
        prompt: "Does the customer order anything else?",
        options: ["No", "Yes, tea", "Yes, cake"],
        answer: "No",
        explanation: "„To je sve” means “That is all.”",
      },
    ],
  },
  {
    id: "listening-directions",
    title: "Directions to the pharmacy",
    transcript:
      "Od autobuske stanice idi pravo do banke. Kod banke skreni levo. Apoteka je pored pošte, preko puta malog parka.",
    translation:
      "From the bus station go straight to the bank. Turn left at the bank. The pharmacy is next to the post office, opposite the small park.",
    questions: [
      {
        id: "listening-directions-start",
        prompt: "Where do the directions start?",
        options: ["At the bus station", "At the bank", "At the post office"],
        answer: "At the bus station",
        explanation: "The first words are „Od autobuske stanice”.",
      },
      {
        id: "listening-directions-turn",
        prompt: "Where should you turn left?",
        options: ["At the bank", "At the park", "At the pharmacy"],
        answer: "At the bank",
        explanation: "„Kod banke skreni levo.”",
      },
      {
        id: "listening-directions-next",
        prompt: "What is next to the pharmacy?",
        options: ["The post office", "The bus station", "The hotel"],
        answer: "The post office",
        explanation: "The pharmacy is „pored pošte”.",
      },
      {
        id: "listening-directions-opposite",
        prompt: "What is opposite the pharmacy?",
        options: ["A small park", "A café", "A school"],
        answer: "A small park",
        explanation: "The pharmacy is „preko puta malog parka”.",
      },
    ],
  },
  {
    id: "listening-appointment",
    title: "A simple appointment",
    transcript:
      "Danas je ponedeljak. U sredu u deset sati imam pregled kod lekara. Ne radim pre podne, pa dolazim autobusom u grad u pola deset.",
    translation:
      "Today is Monday. On Wednesday at ten I have a doctor's appointment. I do not work in the morning, so I come to the city by bus at half past nine.",
    questions: [
      {
        id: "listening-appointment-today",
        prompt: "What day is it today?",
        options: ["Monday", "Wednesday", "Friday"],
        answer: "Monday",
        explanation: "The audio begins „Danas je ponedeljak.”",
      },
      {
        id: "listening-appointment-day",
        prompt: "On which day is the appointment?",
        options: ["Wednesday", "Monday", "Thursday"],
        answer: "Wednesday",
        explanation: "The appointment is „u sredu”.",
      },
      {
        id: "listening-appointment-time",
        prompt: "What time is the appointment?",
        options: ["10:00", "9:30", "11:00"],
        answer: "10:00",
        explanation: "The speaker says „u deset sati”.",
      },
      {
        id: "listening-appointment-transport",
        prompt: "How does the speaker travel to the city?",
        options: ["By bus", "By train", "By car"],
        answer: "By bus",
        explanation: "„Dolazim autobusom” means “I am coming by bus.”",
      },
    ],
  },
];

export const ExamVocabularyPool = Curriculum.flatMap((lesson) => lesson.items);

export const ExamGrammarPool = GrammarLessons.flatMap((lesson) =>
  lesson.practice
    .filter((exercise) => exercise.type === "choose")
    .map((exercise) => ({
      ...exercise,
      lessonId: lesson.id,
      lessonTitle: lesson.title,
    }))
);

const takeRotated = (items, count, seed) => {
  if (items.length === 0) return [];
  const resultCount = Math.min(count, items.length);
  const start = Math.abs(Number(seed) || 0) % items.length;
  return Array.from({ length: resultCount }, (_, index) =>
    items[(start + Math.floor(index * items.length / resultCount)) % items.length]
  );
};

const uniqueTargets = ExamVocabularyPool.filter((word, index, words) =>
  words.findIndex((candidate) => candidate.target === word.target) === index
);

const vocabOptions = (word, index, seed) => {
  const distractors = [];
  let offset = 1;
  while (distractors.length < 3) {
    const candidate = uniqueTargets[(index + seed + offset * 37) % uniqueTargets.length].target;
    if (candidate !== word.target && !distractors.includes(candidate)) distractors.push(candidate);
    offset += 1;
  }
  const options = [...distractors];
  options.splice((index + seed) % 4, 0, word.target);
  return options;
};

const requiredGrammarIds = [
  "present-raditi-choice",
  "negation-work-choice",
  "question-place-choice",
  "prepositions-school-choice",
  "accusative-animate-choice",
];

const createGrammarQuestions = (count, seed) => {
  const required = requiredGrammarIds
    .map((id) => ExamGrammarPool.find((exercise) => exercise.id === id))
    .filter(Boolean)
    .slice(0, count);
  const remainingPool = ExamGrammarPool.filter(
    (exercise) => !requiredGrammarIds.includes(exercise.id)
  );
  const remaining = takeRotated(remainingPool, count - required.length, seed);
  return [...required, ...remaining].map((exercise) => ({
    id: `exam-grammar-${exercise.id}`,
    kind: "grammar",
    sourceId: exercise.lessonId,
    prompt: exercise.prompt,
    options: [...exercise.options],
    answer: exercise.answer,
    explanation: `${exercise.lessonTitle}: the correct answer is “${exercise.answer}”.`,
  }));
};

export const createExamPrepSession = ({
  seed = 0,
  vocabularyCount = 10,
  grammarCount = 10,
} = {}) => {
  const words = takeRotated(ExamVocabularyPool, vocabularyCount, seed);
  const vocabulary = words.map((word, index) => ({
    id: `exam-vocabulary-${seed}-${word.id}`,
    kind: "vocabulary",
    sourceId: word.id,
    prompt: `Choose the Serbian translation for “${word.source}”.`,
    options: vocabOptions(word, index, Number(seed) || 0),
    answer: word.target,
    explanation: `${word.source} → ${word.target}`,
  }));
  return [...vocabulary, ...createGrammarQuestions(grammarCount, seed)];
};
