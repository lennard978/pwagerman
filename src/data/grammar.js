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
  {
    id: "plural-basics",
    title: "Plural basics",
    titleSr: "Osnove množine",
    status: "available",
    level: "A1",
    source: appAuthoredSource,
    contentOrigin: "app-authored",
    explanation:
      "Serbian uses several plural patterns. These common A1 patterns are useful starting points, but the plural should still be learned with each noun.",
    rule: {
      headers: ["Noun type", "Common plural pattern", "Examples"],
      rows: [
        ["Masculine", "many nouns add -i", "hotel → hoteli; student → studenti"],
        ["Short masculine nouns", "often add -ovi or -evi", "grad → gradovi; muž → muževi"],
        ["Feminine in -a", "change -a to -e", "žena → žene; kuća → kuće"],
        ["Neuter in -o or -e", "often change to -a", "selo → sela; jaje → jaja"],
        ["Common irregular forms", "learn separately", "dete → deca; oko → oči"],
      ],
    },
    examples: [
      { serbian: "Ovo su studenti.", english: "These are students." },
      { serbian: "To su hoteli.", english: "Those are hotels." },
      { serbian: "Ovo su kuće.", english: "These are houses." },
      { serbian: "Imam dve karte.", english: "I have two tickets." },
      { serbian: "Ovo su jaja.", english: "These are eggs." },
      { serbian: "Deca su u parku.", english: "The children are in the park." },
      { serbian: "Vrata su otvorena.", english: "The door is open." },
    ],
    commonMistake:
      "Do not use one plural ending for every noun. Some masculine nouns add -ovi or -evi, and common nouns such as dete and oko have irregular plurals. Vrata is grammatically plural even when it means one door.",
    practice: [
      {
        id: "plural-feminine-choice",
        type: "choose",
        prompt: "Choose the plural of kuća.",
        options: ["kuće", "kuća", "kući"],
        answer: "kuće",
      },
      {
        id: "plural-masculine-choice",
        type: "choose",
        prompt: "Choose the plural of hotel.",
        options: ["hoteli", "hotela", "hotele"],
        answer: "hoteli",
      },
      {
        id: "plural-fill-students",
        type: "fill",
        prompt: "Complete: Ovo su ___. (student)",
        answer: "studenti",
      },
      {
        id: "plural-fill-cards",
        type: "fill",
        prompt: "Complete: Imam dve ___. (karta)",
        answer: "karte",
      },
      {
        id: "plural-regular-match",
        type: "match",
        prompt: "Match each singular noun with its plural.",
        pairs: [
          { left: "žena", right: "žene" },
          { left: "hotel", right: "hoteli" },
          { left: "jaje", right: "jaja" },
        ],
      },
      {
        id: "plural-common-match",
        type: "match",
        prompt: "Match these common plural forms.",
        pairs: [
          { left: "grad", right: "gradovi" },
          { left: "muž", right: "muževi" },
          { left: "dete", right: "deca" },
        ],
      },
      {
        id: "plural-order-houses",
        type: "order",
        prompt: "Put the sentence in order.",
        tokens: ["kuće", "Ovo", ".", "su"],
        answer: ["Ovo", "su", "kuće", "."],
      },
      {
        id: "plural-order-children",
        type: "order",
        prompt: "Put the sentence in order.",
        tokens: ["parku", "Deca", "u", ".", "su"],
        answer: ["Deca", "su", "u", "parku", "."],
      },
    ],
  },
  {
    id: "personal-pronouns",
    title: "Personal pronouns",
    titleSr: "Lične zamenice",
    status: "available",
    level: "A1",
    source: appAuthoredSource,
    contentOrigin: "app-authored",
    explanation:
      "Personal pronouns show who is speaking or doing an action. Serbian often leaves the subject pronoun out because the verb ending already identifies the person.",
    rule: {
      headers: ["Person", "Singular", "Plural"],
      rows: [
        ["First person", "ja — I", "mi — we"],
        ["Second person", "ti — you, informal singular", "vi — you, plural or polite/formal"],
        ["Third person masculine", "on — he", "oni — they, masculine or mixed group"],
        ["Third person feminine", "ona — she", "one — they, feminine group"],
        ["Third person neuter", "ono — it", "ona — they, neuter group"],
      ],
    },
    examples: [
      { serbian: "Ja učim srpski.", english: "I am learning Serbian." },
      { serbian: "Ti govoriš brzo.", english: "You speak quickly." },
      { serbian: "On je lekar.", english: "He is a doctor." },
      { serbian: "Ona je umorna.", english: "She is tired." },
      { serbian: "Ono je malo.", english: "It is small." },
      { serbian: "Mi živimo u Beogradu.", english: "We live in Belgrade." },
      { serbian: "Vi govorite engleski?", english: "Do you speak English?" },
      { serbian: "Oni čekaju autobus.", english: "They are waiting for the bus." },
    ],
    commonMistake:
      "Ti is only informal singular. Use vi for more than one person and for polite or formal address. Do not learn case forms yet; this lesson uses subject forms only.",
    practice: [
      {
        id: "pronouns-ana-choice",
        type: "choose",
        prompt: "Which pronoun replaces Ana?",
        options: ["ona", "on", "ono"],
        answer: "ona",
      },
      {
        id: "pronouns-polite-choice",
        type: "choose",
        prompt: "Which pronoun is polite singular you and plural you?",
        options: ["vi", "ti", "mi"],
        answer: "vi",
      },
      {
        id: "pronouns-fill-we",
        type: "fill",
        prompt: "Complete: ___ učimo srpski.",
        answer: "mi",
      },
      {
        id: "pronouns-fill-mixed-group",
        type: "fill",
        prompt: "Complete for Marko and Ana: ___ čekaju autobus.",
        answer: "oni",
      },
      {
        id: "pronouns-singular-match",
        type: "match",
        prompt: "Match the singular pronouns.",
        pairs: [
          { left: "ja", right: "I" },
          { left: "ti", right: "you, informal singular" },
          { left: "ono", right: "it" },
        ],
      },
      {
        id: "pronouns-plural-match",
        type: "match",
        prompt: "Match the plural pronouns.",
        pairs: [
          { left: "mi", right: "we" },
          { left: "vi", right: "you, plural or polite" },
          { left: "oni", right: "they, masculine or mixed" },
        ],
      },
      {
        id: "pronouns-order-student",
        type: "order",
        prompt: "Put the sentence in order.",
        tokens: ["student", "Ja", ".", "sam"],
        answer: ["Ja", "sam", "student", "."],
      },
      {
        id: "pronouns-order-belgrade",
        type: "order",
        prompt: "Put the sentence in order.",
        tokens: ["Beogradu", "Oni", "u", ".", "žive"],
        answer: ["Oni", "žive", "u", "Beogradu", "."],
      },
    ],
  },
  {
    id: "present-tense",
    title: "Present tense",
    titleSr: "Prezent",
    status: "available",
    level: "A1",
    source: appAuthoredSource,
    contentOrigin: "app-authored",
    explanation:
      "The Serbian present tense describes actions happening now, repeated actions, and general facts. The verb ending changes with the person, and the subject pronoun is often omitted.",
    rule: {
      headers: ["Person", "raditi — to work", "čitati — to read", "pisati — to write"],
      rows: [
        ["ja", "radim", "čitam", "pišem"],
        ["ti", "radiš", "čitaš", "pišeš"],
        ["on / ona / ono", "radi", "čita", "piše"],
        ["mi", "radimo", "čitamo", "pišemo"],
        ["vi", "radite", "čitate", "pišete"],
        ["oni / one / ona", "rade", "čitaju", "pišu"],
      ],
    },
    examples: [
      { serbian: "Radim danas.", english: "I am working today." },
      { serbian: "Čitaš knjigu.", english: "You are reading a book." },
      { serbian: "Ona piše poruku.", english: "She is writing a message." },
      { serbian: "Učimo srpski.", english: "We are learning Serbian." },
      { serbian: "Čekate autobus.", english: "You are waiting for the bus." },
      { serbian: "Oni govore brzo.", english: "They speak quickly." },
      { serbian: "Idem na posao.", english: "I am going to work." },
      { serbian: "Dete spava.", english: "The child is sleeping." },
    ],
    commonMistake:
      "Do not attach one set of endings mechanically to every infinitive. Verbs such as pisati, govoriti, and ići change their stem or pattern, so learn a few present forms with each new verb.",
    practice: [
      {
        id: "present-raditi-choice",
        type: "choose",
        prompt: "Choose the ja form of raditi.",
        options: ["radim", "radiš", "rade"],
        answer: "radim",
      },
      {
        id: "present-citati-choice",
        type: "choose",
        prompt: "Choose the oni form of čitati.",
        options: ["čitaju", "čitate", "čita"],
        answer: "čitaju",
      },
      {
        id: "present-fill-learn",
        type: "fill",
        prompt: "Complete: Mi ___ srpski. (učiti)",
        answer: "učimo",
      },
      {
        id: "present-fill-write",
        type: "fill",
        prompt: "Complete: Ona ___ poruku. (pisati)",
        answer: "piše",
      },
      {
        id: "present-raditi-match",
        type: "match",
        prompt: "Match the pronoun with the form of raditi.",
        pairs: [
          { left: "ja", right: "radim" },
          { left: "ti", right: "radiš" },
          { left: "oni", right: "rade" },
        ],
      },
      {
        id: "present-pisati-match",
        type: "match",
        prompt: "Match the pronoun with the form of pisati.",
        pairs: [
          { left: "ona", right: "piše" },
          { left: "mi", right: "pišemo" },
          { left: "vi", right: "pišete" },
        ],
      },
      {
        id: "present-order-speaking",
        type: "order",
        prompt: "Put the sentence in order.",
        tokens: ["srpski", "Oni", ".", "govore"],
        answer: ["Oni", "govore", "srpski", "."],
      },
      {
        id: "present-order-waiting",
        type: "order",
        prompt: "Put the sentence in order.",
        tokens: ["autobus", "Čekam", ".", "sada"],
        answer: ["Čekam", "autobus", "sada", "."],
      },
    ],
  },
  {
    id: "biti",
    title: "The verb biti",
    titleSr: "Glagol biti",
    status: "available",
    level: "A1",
    source: appAuthoredSource,
    contentOrigin: "app-authored",
    explanation:
      "Biti means to be. Its present-tense forms are short and irregular. Serbian often omits the subject pronoun because sam, si, je, smo, ste, or su already shows the person.",
    rule: {
      headers: ["Pronoun", "Present form", "English"],
      rows: [
        ["ja", "sam", "I am"],
        ["ti", "si", "you are, informal singular"],
        ["on / ona / ono", "je", "he / she / it is"],
        ["mi", "smo", "we are"],
        ["vi", "ste", "you are, plural or polite"],
        ["oni / one / ona", "su", "they are"],
      ],
    },
    examples: [
      { serbian: "Ja sam student.", english: "I am a student." },
      { serbian: "Ti si umoran.", english: "You are tired." },
      { serbian: "On je lekar.", english: "He is a doctor." },
      { serbian: "Ona je umorna.", english: "She is tired." },
      { serbian: "Mi smo iz Srbije.", english: "We are from Serbia." },
      { serbian: "Vi ste spremni.", english: "You are ready." },
      { serbian: "Oni su u parku.", english: "They are in the park." },
      { serbian: "Dete je malo.", english: "The child is small." },
    ],
    commonMistake:
      "Do not use the infinitive biti directly where English uses am, is, or are. Use the correct short form. A subject pronoun is optional when the person is already clear.",
    practice: [
      {
        id: "biti-ja-choice",
        type: "choose",
        prompt: "Choose the correct form: Ja ___ student.",
        options: ["sam", "si", "su"],
        answer: "sam",
      },
      {
        id: "biti-they-choice",
        type: "choose",
        prompt: "Choose the correct form: Oni ___ u parku.",
        options: ["su", "smo", "je"],
        answer: "su",
      },
      {
        id: "biti-fill-she",
        type: "fill",
        prompt: "Complete: Ona ___ umorna.",
        answer: "je",
      },
      {
        id: "biti-fill-we",
        type: "fill",
        prompt: "Complete: Mi ___ iz Srbije.",
        answer: "smo",
      },
      {
        id: "biti-singular-match",
        type: "match",
        prompt: "Match the singular pronouns and forms.",
        pairs: [
          { left: "ja", right: "sam" },
          { left: "ti", right: "si" },
          { left: "ona", right: "je" },
        ],
      },
      {
        id: "biti-plural-match",
        type: "match",
        prompt: "Match the plural pronouns and forms.",
        pairs: [
          { left: "mi", right: "smo" },
          { left: "vi", right: "ste" },
          { left: "oni", right: "su" },
        ],
      },
      {
        id: "biti-order-student",
        type: "order",
        prompt: "Put the sentence in order.",
        tokens: ["student", "Ja", ".", "sam"],
        answer: ["Ja", "sam", "student", "."],
      },
      {
        id: "biti-order-serbia",
        type: "order",
        prompt: "Put the sentence in order.",
        tokens: ["Srbije", "Mi", "iz", ".", "smo"],
        answer: ["Mi", "smo", "iz", "Srbije", "."],
      },
    ],
  },
];

export const GrammarSyllabus = [
  ...GrammarLessons,
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
