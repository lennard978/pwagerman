const universityScopeSource = {
  institution: "University of Belgrade Center for Serbian as a Foreign Language",
  url: "http://learnserbian.fil.bg.ac.rs/programs.php",
  evidence: "verified-scope",
};

const appAuthoredSource = {
  institution: "Serbian A1",
  evidence: "supplementary",
};

export const GrammarLessons = [
  {
    id: "latin-alphabet",
    title: "Serbian Latin alphabet",
    titleSr: "Srpska latinica",
    status: "available",
    level: "A1",
    source: universityScopeSource,
    contentOrigin: "app-authored",
    explanation:
      "Serbian Latin has 30 letters. Most letters have one consistent sound, and dž, lj, and nj each count as one letter.",
    rule: {
      headers: ["Letters", "Notes"],
      rows: [
        ["A B C Č Ć D Dž Đ E F G H I J K L Lj", "Dž and Lj are single alphabet letters"],
        ["M N Nj O P R S Š T U V Z Ž", "Nj is one letter; Q, W, X, and Y are not native letters"],
      ],
    },
    examples: [
      { serbian: "Čitam knjigu.", english: "I am reading a book." },
      { serbian: "Ljubica živi u Nišu.", english: "Ljubica lives in Niš." },
      { serbian: "Njegovo ime je Đorđe.", english: "His name is Đorđe." },
    ],
    commonMistake:
      "Do not replace č, ć, š, ž, or đ with unmarked letters when spelling Serbian. Dž, lj, and nj are single letters even though they use two characters.",
    practice: [
      {
        id: "latin-distinct-letter",
        type: "choose",
        prompt: "Which is a distinct Serbian Latin letter?",
        options: ["Č", "Q", "W"],
        answer: "Č",
      },
      {
        id: "latin-letter-word-match",
        type: "match",
        prompt: "Match each letter with a word that begins with it.",
        pairs: [
          { left: "Č", right: "čaj" },
          { left: "Š", right: "škola" },
          { left: "Ž", right: "žena" },
        ],
      },
      {
        id: "latin-order-introduction",
        type: "order",
        prompt: "Put the introduction in order.",
        tokens: ["Ana", "se", ".", "Zovem"],
        answer: ["Zovem", "se", "Ana", "."],
      },
    ],
  },
  {
    id: "cyrillic-alphabet",
    title: "Serbian Cyrillic alphabet",
    titleSr: "Srpska ćirilica",
    status: "available",
    level: "A1",
    source: universityScopeSource,
    contentOrigin: "app-authored",
    explanation:
      "Serbian Cyrillic also has 30 letters. Every Cyrillic letter has a direct Serbian Latin equivalent.",
    rule: {
      headers: ["Cyrillic", "Latin"],
      rows: [
        ["А Б В Г Д Ђ Е Ж З И Ј К Л Љ", "A B V G D Đ E Ž Z I J K L Lj"],
        ["М Н Њ О П Р С Т Ћ У Ф Х Ц Ч Џ Ш", "M N Nj O P R S T Ć U F H C Č Dž Š"],
      ],
    },
    examples: [
      { serbian: "Зовем се Ана.", english: "My name is Ana." },
      { serbian: "Живим у Београду.", english: "I live in Belgrade." },
      { serbian: "Хвала и довиђења.", english: "Thank you and goodbye." },
    ],
    commonMistake:
      "Serbian Cyrillic Ј sounds like Latin J in Serbian, not English J. Љ, Њ, and Џ are single letters.",
    practice: [
      {
        id: "cyrillic-letter-choice",
        type: "choose",
        prompt: "Which Cyrillic letter matches Latin Č?",
        options: ["Ч", "Ћ", "Ц"],
        answer: "Ч",
      },
      {
        id: "cyrillic-digraph-match",
        type: "match",
        prompt: "Match the Latin and Cyrillic letters.",
        pairs: [
          { left: "Lj", right: "Љ" },
          { left: "Nj", right: "Њ" },
          { left: "Dž", right: "Џ" },
        ],
      },
      {
        id: "cyrillic-fill-name",
        type: "fill",
        prompt: "Complete: Зовем __ Ана.",
        answer: "се",
      },
    ],
  },
  {
    id: "noun-gender",
    title: "Noun gender",
    titleSr: "Rod imenica",
    status: "available",
    level: "A1",
    source: appAuthoredSource,
    contentOrigin: "app-authored",
    explanation:
      "Serbian nouns are masculine, feminine, or neuter. The ending gives a useful clue, but common exceptions must be learned with the noun.",
    rule: {
      headers: ["Gender", "Common pattern", "Examples"],
      rows: [
        ["Masculine", "usually ends in a consonant", "grad, hotel, čovek"],
        ["Feminine", "usually ends in -a", "žena, kuća, kafa"],
        ["Neuter", "usually ends in -o or -e", "selo, pismo, more"],
      ],
    },
    examples: [
      { serbian: "Ovo je grad.", english: "This is a city." },
      { serbian: "Ovo je kuća.", english: "This is a house." },
      { serbian: "Ovo je selo.", english: "This is a village." },
      { serbian: "Moj tata je ovde.", english: "My dad is here." },
      { serbian: "Noć je hladna.", english: "The night is cold." },
    ],
    commonMistake:
      "Endings are clues, not absolute rules. Tata is masculine although it ends in -a, noć is feminine although it ends in a consonant, and dete is neuter.",
    practice: [
      {
        id: "gender-feminine-choice",
        type: "choose",
        prompt: "Which noun is feminine?",
        options: ["žena", "grad", "selo"],
        answer: "žena",
      },
      {
        id: "gender-pattern-match",
        type: "match",
        prompt: "Match each noun with its gender.",
        pairs: [
          { left: "grad", right: "masculine" },
          { left: "kuća", right: "feminine" },
          { left: "more", right: "neuter" },
        ],
      },
      {
        id: "gender-fill-neuter",
        type: "fill",
        prompt: "Complete the phrase: dobro ___ (good village)",
        answer: "selo",
      },
      {
        id: "gender-order-coffee",
        type: "order",
        prompt: "Put the sentence in order.",
        tokens: ["kafa", "Ovo", ".", "dobra", "je"],
        answer: ["Ovo", "je", "dobra", "kafa", "."],
      },
    ],
  },
];

export const GrammarSyllabus = [
  ...GrammarLessons,
  { id: "plural-basics", title: "Plural basics", titleSr: "Osnove množine" },
  { id: "personal-pronouns", title: "Personal pronouns", titleSr: "Lične zamenice" },
  { id: "present-tense", title: "Present tense", titleSr: "Prezent" },
  { id: "biti", title: "The verb biti", titleSr: "Glagol biti" },
  { id: "imati", title: "The verb imati", titleSr: "Glagol imati" },
  { id: "adjective-agreement", title: "Adjective agreement", titleSr: "Slaganje prideva" },
  { id: "negation", title: "Negation", titleSr: "Negacija" },
  { id: "question-formation", title: "Question formation", titleSr: "Građenje pitanja" },
  { id: "accusative", title: "Accusative", titleSr: "Akuzativ" },
  { id: "genitive", title: "Genitive", titleSr: "Genitiv" },
  { id: "dative", title: "Dative", titleSr: "Dativ" },
  { id: "locative", title: "Locative", titleSr: "Lokativ" },
  { id: "instrumental", title: "Instrumental", titleSr: "Instrumental" },
  { id: "common-prepositions", title: "Common prepositions", titleSr: "Česti predlozi" },
  { id: "possessives", title: "Possessives", titleSr: "Prisvojne reči" },
  { id: "number-agreement", title: "Numbers and noun agreement", titleSr: "Brojevi i slaganje imenica" },
].map((topic) => ({
  status: "planned",
  level: "A1",
  source: appAuthoredSource,
  contentOrigin: "app-authored",
  ...topic,
}));

export const getGrammarLesson = (id) =>
  GrammarLessons.find((lesson) => lesson.id === id);
