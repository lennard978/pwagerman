export const Lesson1 = {
  id: "lesson-1",
  titleKey: "lessons.greetings.title",
  descriptionKey: "lessons.greetings.description",
  category: "greetings",
  items: [
    { source: "hello", target: "zdravo", partOfSpeech: "greeting" },
    { source: "good morning", target: "dobro jutro", partOfSpeech: "greeting" },
    { source: "good evening", target: "dobro veče", partOfSpeech: "greeting" },
    { source: "good night", target: "laku noć", partOfSpeech: "greeting" },
    { source: "goodbye", target: "doviđenja", partOfSpeech: "greeting" },
    { source: "please", target: "molim", partOfSpeech: "polite expression" },
    { source: "thank you", target: "hvala", partOfSpeech: "polite expression" },
    { source: "yes", target: "da", partOfSpeech: "response word" },
    { source: "no", target: "ne", partOfSpeech: "response word" },
    {
      source: "sorry",
      target: "izvini",
      partOfSpeech: "phrase",
      register: "informal singular",
      note: "Use izvinite for formal address or more than one person.",
      example: "Izvini, gde je stanica?",
      exampleTranslation: "Excuse me, where is the station?",
    },
    { source: "how are you?", target: "kako si?", partOfSpeech: "question" },
    { source: "I am fine", target: "dobro sam", partOfSpeech: "phrase" },
    { source: "what is your name?", target: "kako se zoveš?", partOfSpeech: "question" },
    { source: "my name is...", target: "zovem se...", partOfSpeech: "phrase" },
    { source: "nice to meet you", target: "drago mi je", partOfSpeech: "social phrase" },
    { source: "see you", target: "vidimo se", partOfSpeech: "farewell phrase" },
    {
      source: "welcome",
      target: "dobrodošli",
      partOfSpeech: "phrase",
      register: "formal singular or plural; also common as a general greeting",
      example: "Dobrodošli u Beograd!",
      exampleTranslation: "Welcome to Belgrade!",
    },
    { source: "enjoy your meal", target: "prijatno", partOfSpeech: "social phrase" },
    { source: "you are welcome", target: "nema na čemu", partOfSpeech: "polite expression" },
    { source: "have a good trip", target: "srećan put", partOfSpeech: "social phrase" },
    {
      source: "good afternoon / good day", target: "dobar dan", partOfSpeech: "greeting",
      example: "Dobar dan! Kako ste?",
      exampleTranslation: "Good afternoon! How are you?",
    },
  ],
};

export const Lesson2 = {
  id: "lesson-2",
  titleKey: "lessons.family.title",
  descriptionKey: "lessons.family.description",
  category: "family",
  items: [
    { source: "man", target: "čovek", partOfSpeech: "noun" },
    { source: "woman", target: "žena", partOfSpeech: "noun" },
    { source: "child", target: "dete", partOfSpeech: "noun" },
    { source: "boy", target: "dečak", partOfSpeech: "noun" },
    { source: "girl", target: "devojčica", partOfSpeech: "noun" },
    { source: "mother", target: "majka", partOfSpeech: "noun" },
    { source: "father", target: "otac", partOfSpeech: "noun" },
    { source: "mom", target: "mama", partOfSpeech: "noun" },
    { source: "dad", target: "tata", partOfSpeech: "noun" },
    { source: "brother", target: "brat", partOfSpeech: "noun" },
    { source: "sister", target: "sestra", partOfSpeech: "noun" },
    { source: "son", target: "sin", partOfSpeech: "noun" },
    { source: "daughter", target: "ćerka", partOfSpeech: "noun" },
    { source: "family", target: "porodica", partOfSpeech: "noun" },
    { source: "friend", target: "prijatelj", partOfSpeech: "noun" },
    { source: "female friend", target: "prijateljica", partOfSpeech: "noun" },
    { source: "parent", target: "roditelj", partOfSpeech: "noun" },
    { source: "parents", target: "roditelji", partOfSpeech: "noun, plural" },
    { source: "husband", target: "muž", partOfSpeech: "noun" },
    {
      source: "wife",
      target: "supruga",
      partOfSpeech: "noun",
      register: "neutral or formal",
      note: "Žena is also used informally for wife and also means woman.",
      example: "Ovo je moja supruga.",
      exampleTranslation: "This is my wife.",
    },
    {
      source: "grandmother", target: "baka", partOfSpeech: "noun",
      example: "Moja baka živi u Beogradu.",
      exampleTranslation: "My grandmother lives in Belgrade.",
    },
    {
      source: "grandfather", target: "deda", partOfSpeech: "noun",
      example: "Moj deda voli kafu.",
      exampleTranslation: "My grandfather likes coffee.",
    },
  ],
};

export const Lesson3 = {
  id: "lesson-3",
  titleKey: "lessons.home.title",
  descriptionKey: "lessons.home.description",
  category: "home",
  items: [
    { source: "house", target: "kuća", partOfSpeech: "noun" },
    { source: "apartment", target: "stan", partOfSpeech: "noun" },
    { source: "room", target: "soba", partOfSpeech: "noun" },
    { source: "kitchen", target: "kuhinja", partOfSpeech: "noun" },
    { source: "bathroom", target: "kupatilo", partOfSpeech: "noun" },
    { source: "bedroom", target: "spavaća soba", partOfSpeech: "noun phrase" },
    { source: "living room", target: "dnevna soba", partOfSpeech: "noun phrase" },
    {
      source: "door", target: "vrata", partOfSpeech: "noun, plural",
      note: "Vrata is grammatically plural and is normally used without a singular form.",
    },
    { source: "window", target: "prozor", partOfSpeech: "noun" },
    { source: "wall", target: "zid", partOfSpeech: "noun" },
    { source: "floor", target: "pod", partOfSpeech: "noun" },
    { source: "table", target: "sto", partOfSpeech: "noun" },
    { source: "chair", target: "stolica", partOfSpeech: "noun" },
    { source: "bed", target: "krevet", partOfSpeech: "noun" },
    { source: "lamp", target: "lampa", partOfSpeech: "noun" },
    { source: "key", target: "ključ", partOfSpeech: "noun" },
    { source: "phone", target: "telefon", partOfSpeech: "noun" },
    { source: "book", target: "knjiga", partOfSpeech: "noun" },
    { source: "bag", target: "torba", partOfSpeech: "noun" },
    { source: "mirror", target: "ogledalo", partOfSpeech: "noun" },
  ],
};

export const Lesson4 = {
  id: "lesson-4",
  titleKey: "lessons.food.title",
  descriptionKey: "lessons.food.description",
  category: "food",
  items: [
    { source: "water", target: "voda", partOfSpeech: "noun" },
    { source: "coffee", target: "kafa", partOfSpeech: "noun" },
    { source: "tea", target: "čaj", partOfSpeech: "noun" },
    { source: "bread", target: "hleb", partOfSpeech: "noun" },
    { source: "milk", target: "mleko", partOfSpeech: "noun" },
    { source: "juice", target: "sok", partOfSpeech: "noun" },
    { source: "apple", target: "jabuka", partOfSpeech: "noun" },
    { source: "banana", target: "banana", partOfSpeech: "noun" },
    { source: "orange", target: "pomorandža", partOfSpeech: "noun" },
    { source: "cheese", target: "sir", partOfSpeech: "noun" },
    { source: "soup", target: "supa", partOfSpeech: "noun" },
    { source: "meat", target: "meso", partOfSpeech: "noun" },
    { source: "rice", target: "pirinač", partOfSpeech: "noun" },
    { source: "breakfast", target: "doručak", partOfSpeech: "noun" },
    { source: "lunch", target: "ručak", partOfSpeech: "noun" },
    { source: "dinner", target: "večera", partOfSpeech: "noun" },
    { source: "menu", target: "meni", partOfSpeech: "noun" },
    { source: "bill", target: "račun", partOfSpeech: "noun" },
    {
      source: "waiter", target: "konobar", partOfSpeech: "noun",
      note: "Konobarica is the feminine form.",
    },
    {
      source: "delicious", target: "ukusno",
      partOfSpeech: "adjective, predicative form",
      note: "Use adjective agreement before a noun, for example ukusna hrana.",
      example: "Ovo je ukusno.",
      exampleTranslation: "This is delicious.",
    },
  ],
};

export const Lesson5 = {
  id: "lesson-5",
  titleKey: "lessons.time.title",
  descriptionKey: "lessons.time.description",
  category: "time",
  items: [
    { source: "one", target: "jedan", partOfSpeech: "numeral" },
    { source: "two", target: "dva", partOfSpeech: "numeral" },
    { source: "three", target: "tri", partOfSpeech: "numeral" },
    { source: "four", target: "četiri", partOfSpeech: "numeral" },
    { source: "five", target: "pet", partOfSpeech: "numeral" },
    { source: "six", target: "šest", partOfSpeech: "numeral" },
    { source: "seven", target: "sedam", partOfSpeech: "numeral" },
    { source: "eight", target: "osam", partOfSpeech: "numeral" },
    { source: "nine", target: "devet", partOfSpeech: "numeral" },
    { source: "ten", target: "deset", partOfSpeech: "numeral" },
    { source: "today", target: "danas", partOfSpeech: "time adverb" },
    { source: "tomorrow", target: "sutra", partOfSpeech: "time adverb" },
    { source: "yesterday", target: "juče", partOfSpeech: "time adverb" },
    { source: "morning", target: "jutro", partOfSpeech: "noun" },
    { source: "evening", target: "veče", partOfSpeech: "noun" },
    { source: "Monday", target: "ponedeljak", partOfSpeech: "noun" },
    { source: "Tuesday", target: "utorak", partOfSpeech: "noun" },
    { source: "Wednesday", target: "sreda", partOfSpeech: "noun" },
    { source: "Thursday", target: "četvrtak", partOfSpeech: "noun" },
    { source: "Friday", target: "petak", partOfSpeech: "noun" },
  ],
};

export const Lesson6 = {
  id: "lesson-6",
  titleKey: "lessons.travel.title",
  descriptionKey: "lessons.travel.description",
  category: "travel",
  items: [
    {
      source: "car", target: "auto",
      partOfSpeech: "noun",
      register: "common conversational form",
      note: "Automobil is the fuller standard form.",
      example: "Imam auto.",
      exampleTranslation: "I have a car.",
    },
    { source: "bus", target: "autobus", partOfSpeech: "noun" },
    { source: "train", target: "voz", partOfSpeech: "noun" },
    { source: "station", target: "stanica", partOfSpeech: "noun" },
    { source: "airport", target: "aerodrom", partOfSpeech: "noun" },
    { source: "hotel", target: "hotel", partOfSpeech: "noun" },
    { source: "shop", target: "prodavnica", partOfSpeech: "noun" },
    { source: "restaurant", target: "restoran", partOfSpeech: "noun" },
    { source: "street", target: "ulica", partOfSpeech: "noun" },
    { source: "city", target: "grad", partOfSpeech: "noun" },
    { source: "ticket", target: "karta", partOfSpeech: "noun" },
    {
      source: "map", target: "mapa",
      partOfSpeech: "noun",
      note: "Karta is also common for a map and can also mean ticket.",
      example: "Imam mapu grada.",
      exampleTranslation: "I have a city map.",
    },
    {
      source: "road", target: "put",
      partOfSpeech: "noun",
      note: "Put can also mean way, journey, or occurrence depending on context.",
      example: "Put je dug.",
      exampleTranslation: "The road is long.",
    },
    { source: "taxi", target: "taksi", partOfSpeech: "noun" },
    { source: "bicycle", target: "bicikl", partOfSpeech: "noun" },
    { source: "departure", target: "polazak", partOfSpeech: "noun" },
    { source: "arrival", target: "dolazak", partOfSpeech: "noun" },
    { source: "left", target: "levo", partOfSpeech: "directional adverb" },
    { source: "right", target: "desno", partOfSpeech: "directional adverb" },
    { source: "near", target: "blizu", partOfSpeech: "adverb or preposition" },
  ],
};

export const Lesson7 = {
  id: "lesson-7",
  titleKey: "lessons.personal.title",
  descriptionKey: "lessons.personal.description",
  category: "personal-information",
  items: [
    { source: "name", target: "ime", partOfSpeech: "noun" },
    { source: "surname", target: "prezime", partOfSpeech: "noun" },
    { source: "address", target: "adresa", partOfSpeech: "noun" },
    { source: "phone number", target: "broj telefona", partOfSpeech: "noun phrase" },
    {
      source: "country", target: "zemlja", partOfSpeech: "noun",
      note: "Zemlja can also mean earth or soil.",
    },
    {
      source: "language", target: "jezik", partOfSpeech: "noun",
      example: "Govorim srpski jezik.",
      exampleTranslation: "I speak Serbian.",
    },
    {
      source: "where are you from?", target: "odakle si?", partOfSpeech: "question",
      register: "informal singular",
      note: "Use Odakle ste? for formal address or more than one person.",
      example: "Odakle si? Iz Srbije sam.",
      exampleTranslation: "Where are you from? I am from Serbia.",
    },
  ],
};

export const Lesson8 = {
  id: "lesson-8",
  titleKey: "lessons.routine.title",
  descriptionKey: "lessons.routine.description",
  category: "daily-routine",
  items: [
    {
      source: "to wake up", target: "buditi se", partOfSpeech: "verb",
      aspect: "imperfective, habitual",
      note: "Probuditi se is the perfective form for a completed waking event.",
      example: "Budim se u sedam.",
      exampleTranslation: "I wake up at seven.",
    },
    {
      source: "to get up", target: "ustati", partOfSpeech: "verb",
      aspect: "perfective",
      example: "Ustajem u sedam.",
      exampleTranslation: "I get up at seven.",
    },
    {
      source: "to have breakfast", target: "doručkovati", partOfSpeech: "verb",
      example: "Doručkujem kod kuće.",
      exampleTranslation: "I have breakfast at home.",
    },
    {
      source: "to work", target: "raditi", partOfSpeech: "verb",
      example: "Radim danas.",
      exampleTranslation: "I am working today.",
    },
    {
      source: "to study / learn", target: "učiti", partOfSpeech: "verb",
      note: "Učiti can also mean to teach when it takes a person as an object.",
      example: "Učim srpski.",
      exampleTranslation: "I am learning Serbian.",
    },
    {
      source: "to go", target: "ići", partOfSpeech: "verb",
      example: "Idem na posao.",
      exampleTranslation: "I am going to work.",
    },
    {
      source: "to sleep", target: "spavati", partOfSpeech: "verb",
      example: "Spavam osam sati.",
      exampleTranslation: "I sleep for eight hours.",
    },
  ],
};

export const Lesson9 = {
  id: "lesson-9",
  titleKey: "lessons.shopping.title",
  descriptionKey: "lessons.shopping.description",
  category: "shopping-money",
  items: [
    { source: "money", target: "novac", partOfSpeech: "noun" },
    { source: "price", target: "cena", partOfSpeech: "noun" },
    { source: "dinar", target: "dinar", partOfSpeech: "noun" },
    { source: "euro", target: "evro", partOfSpeech: "noun" },
    {
      source: "to buy", target: "kupiti", partOfSpeech: "verb", aspect: "perfective",
      note: "Kupovati is the imperfective form for ongoing or repeated buying.",
      example: "Želim da kupim hleb.",
      exampleTranslation: "I want to buy bread.",
    },
    {
      source: "expensive", target: "skup", partOfSpeech: "adjective",
      note: "This is the masculine singular form: skupa, skupo.",
      example: "Hotel je skup.",
      exampleTranslation: "The hotel is expensive.",
    },
    {
      source: "cheap", target: "jeftin", partOfSpeech: "adjective",
      note: "This is the masculine singular form: jeftina, jeftino.",
      example: "Čaj je jeftin.",
      exampleTranslation: "The tea is cheap.",
    },
  ],
};

export const Lesson10 = {
  id: "lesson-10",
  titleKey: "lessons.jobs.title",
  descriptionKey: "lessons.jobs.description",
  category: "jobs-work",
  items: [
    { source: "job", target: "posao", partOfSpeech: "noun" },
    {
      source: "doctor", target: "lekar", partOfSpeech: "noun",
      note: "Lekarka is the feminine form.",
    },
    {
      source: "teacher", target: "nastavnik", partOfSpeech: "noun",
      note: "Nastavnica is the feminine form.",
    },
    {
      source: "university student", target: "student", partOfSpeech: "noun",
      note: "Studentkinja is the feminine form; učenik or učenica is a school pupil.",
    },
    {
      source: "engineer", target: "inženjer", partOfSpeech: "noun",
      note: "Inženjerka is the feminine form.",
    },
    { source: "office", target: "kancelarija", partOfSpeech: "noun" },
  ],
};

export const Lesson11 = {
  id: "lesson-11",
  titleKey: "lessons.weather.title",
  descriptionKey: "lessons.weather.description",
  category: "weather",
  items: [
    {
      source: "weather", target: "vreme", partOfSpeech: "noun",
      note: "Vreme also means time; context shows the meaning.",
      example: "Kakvo je vreme danas?",
      exampleTranslation: "What is the weather like today?",
    },
    { source: "sun", target: "sunce", partOfSpeech: "noun" },
    { source: "rain", target: "kiša", partOfSpeech: "noun" },
    { source: "snow", target: "sneg", partOfSpeech: "noun" },
    {
      source: "it is hot", target: "vruće je", partOfSpeech: "phrase",
      example: "Danas je vruće.",
      exampleTranslation: "It is hot today.",
    },
    {
      source: "it is cold", target: "hladno je", partOfSpeech: "phrase",
      example: "Danas je hladno.",
      exampleTranslation: "It is cold today.",
    },
    {
      source: "wind", target: "vetar", partOfSpeech: "noun",
      example: "Danas duva vetar.",
      exampleTranslation: "It is windy today.",
    },
    {
      source: "it is raining", target: "pada kiša", partOfSpeech: "weather phrase",
      note: "The Serbian phrase literally says that rain is falling.",
      example: "Napolju pada kiša.",
      exampleTranslation: "It is raining outside.",
    },
  ],
};

export const Lesson12 = {
  id: "lesson-12",
  titleKey: "lessons.health.title",
  descriptionKey: "lessons.health.description",
  category: "body-health",
  items: [
    { source: "head", target: "glava", partOfSpeech: "noun" },
    {
      source: "hand / arm", target: "ruka", partOfSpeech: "noun",
      note: "Ruka covers both hand and arm in everyday Serbian.",
    },
    {
      source: "leg / foot", target: "noga", partOfSpeech: "noun",
      note: "Noga commonly covers both leg and foot.",
    },
    {
      source: "eye", target: "oko", partOfSpeech: "noun",
      note: "The irregular plural is oči.",
    },
    { source: "stomach", target: "stomak", partOfSpeech: "noun" },
    { source: "pharmacy", target: "apoteka", partOfSpeech: "noun" },
    {
      source: "it hurts", target: "boli", partOfSpeech: "verb form",
      note: "Use boli with the person and body part, for example Boli me glava.",
      example: "Boli me glava.",
      exampleTranslation: "My head hurts.",
    },
    {
      source: "ear", target: "uvo", partOfSpeech: "noun",
      note: "Uho is an older or more literary variant.",
      example: "Boli me uvo.",
      exampleTranslation: "My ear hurts.",
    },
    {
      source: "nose", target: "nos", partOfSpeech: "noun",
      example: "On ima veliki nos.",
      exampleTranslation: "He has a big nose.",
    },
    {
      source: "tooth", target: "zub", partOfSpeech: "noun",
      example: "Boli me zub.",
      exampleTranslation: "My tooth hurts.",
    },
    {
      source: "ambulance / emergency medical service", target: "hitna pomoć", partOfSpeech: "noun phrase",
      note: "Hitna pomoć names both emergency medical help and the ambulance service.",
      example: "Pozovite hitnu pomoć!",
      exampleTranslation: "Call an ambulance!",
    },
  ],
};

export const Lesson13 = {
  id: "lesson-13",
  titleKey: "lessons.clothes.title",
  descriptionKey: "lessons.clothes.description",
  category: "clothes",
  items: [
    { source: "shirt", target: "košulja", partOfSpeech: "noun" },
    {
      source: "trousers", target: "pantalone", partOfSpeech: "noun, plural",
      note: "Pantalone is normally used only in the plural.",
    },
    { source: "dress", target: "haljina", partOfSpeech: "noun" },
    {
      source: "shoes", target: "cipele", partOfSpeech: "noun, plural",
      note: "One shoe is cipela.",
    },
    { source: "jacket", target: "jakna", partOfSpeech: "noun" },
    {
      source: "size", target: "veličina", partOfSpeech: "noun",
      note: "For shoe size, Serbian commonly uses broj.",
    },
  ],
};

export const Lesson14 = {
  id: "lesson-14",
  titleKey: "lessons.questions.title",
  descriptionKey: "lessons.questions.description",
  category: "question-words",
  items: [
    { source: "who", target: "ko", partOfSpeech: "interrogative", example: "Ko je to?", exampleTranslation: "Who is that?" },
    { source: "what", target: "šta", partOfSpeech: "interrogative", example: "Šta je to?", exampleTranslation: "What is that?" },
    { source: "where", target: "gde", partOfSpeech: "interrogative", example: "Gde je hotel?", exampleTranslation: "Where is the hotel?" },
    {
      source: "when", target: "kada", partOfSpeech: "interrogative",
      note: "Kad is a common shorter form in speech.",
      example: "Kada radiš?",
      exampleTranslation: "When do you work?",
    },
    { source: "why", target: "zašto", partOfSpeech: "interrogative", example: "Zašto učiš srpski?", exampleTranslation: "Why are you learning Serbian?" },
    { source: "how", target: "kako", partOfSpeech: "interrogative", example: "Kako si?", exampleTranslation: "How are you?" },
    { source: "how much / how many", target: "koliko", partOfSpeech: "interrogative", example: "Koliko košta?", exampleTranslation: "How much does it cost?" },
    {
      source: "which", target: "koji", partOfSpeech: "interrogative adjective",
      note: "Koji agrees with the noun: feminine koja, neuter koje.",
      example: "Koji auto je tvoj?",
      exampleTranslation: "Which car is yours?",
    },
  ],
};

export const Lesson15 = {
  id: "lesson-15",
  titleKey: "lessons.verbs.title",
  descriptionKey: "lessons.verbs.description",
  category: "common-verbs",
  items: [
    { source: "to be", target: "biti", partOfSpeech: "verb", example: "Želim da budem lekar.", exampleTranslation: "I want to be a doctor." },
    { source: "to have", target: "imati", partOfSpeech: "verb", example: "Imam kartu.", exampleTranslation: "I have a ticket." },
    { source: "to want", target: "želeti", partOfSpeech: "verb", example: "Želim kafu.", exampleTranslation: "I want coffee." },
    { source: "can / to be able", target: "moći", partOfSpeech: "verb", example: "Mogu da pomognem.", exampleTranslation: "I can help." },
    { source: "to know", target: "znati", partOfSpeech: "verb", example: "Znam odgovor.", exampleTranslation: "I know the answer." },
    { source: "to understand", target: "razumeti", partOfSpeech: "verb", example: "Razumem srpski.", exampleTranslation: "I understand Serbian." },
    {
      source: "to speak", target: "govoriti", partOfSpeech: "verb",
      note: "Pričati is also very common for speaking or talking.",
      example: "Govorim malo srpski.",
      exampleTranslation: "I speak a little Serbian.",
    },
  ],
};

export const Lesson16 = {
  id: "lesson-16",
  titleKey: "lessons.cityPlaces.title",
  descriptionKey: "lessons.cityPlaces.description",
  category: "city-places",
  items: [
    { source: "bank", target: "banka", partOfSpeech: "noun" },
    {
      source: "post office", target: "pošta", partOfSpeech: "noun",
      note: "Pošta can also mean mail or the postal service.",
    },
    { source: "hospital", target: "bolnica", partOfSpeech: "noun" },
    { source: "school", target: "škola", partOfSpeech: "noun" },
    { source: "park", target: "park", partOfSpeech: "noun" },
    {
      source: "open-air market", target: "pijaca", partOfSpeech: "noun",
      note: "Pijaca is a market with stalls, unlike a supermarket.",
    },
    { source: "museum", target: "muzej", partOfSpeech: "noun" },
    { source: "library", target: "biblioteka", partOfSpeech: "noun" },
    { source: "town square", target: "trg", partOfSpeech: "noun" },
    { source: "church", target: "crkva", partOfSpeech: "noun" },
    { source: "police station", target: "policijska stanica", partOfSpeech: "noun phrase" },
  ],
};

export const Lesson17 = {
  id: "lesson-17",
  titleKey: "lessons.transport.title",
  descriptionKey: "lessons.transport.description",
  category: "transport",
  items: [
    { source: "tram", target: "tramvaj", partOfSpeech: "noun" },
    { source: "airplane", target: "avion", partOfSpeech: "noun" },
    { source: "boat", target: "brod", partOfSpeech: "noun" },
    { source: "motorcycle", target: "motocikl", partOfSpeech: "noun" },
    {
      source: "bus stop", target: "autobusko stajalište", partOfSpeech: "noun phrase",
      note: "Stajalište is a stop; stanica is used for a larger station.",
    },
    { source: "platform", target: "peron", partOfSpeech: "noun" },
    {
      source: "driver", target: "vozač", partOfSpeech: "noun",
      note: "Vozačica is the feminine form.",
    },
  ],
};

export const Lesson18 = {
  id: "lesson-18",
  titleKey: "lessons.directions.title",
  descriptionKey: "lessons.directions.description",
  category: "directions",
  items: [
    {
      source: "straight ahead", target: "pravo", partOfSpeech: "adverb",
      note: "Pravo can have other meanings, including right or law, depending on context.",
      example: "Idite pravo.",
      exampleTranslation: "Go straight ahead.",
    },
    {
      source: "turn left", target: "skrenite levo", partOfSpeech: "direction phrase",
      register: "formal singular or plural",
      note: "Use skreni levo when speaking informally to one person.",
      example: "Skrenite levo kod banke.",
      exampleTranslation: "Turn left at the bank.",
    },
    {
      source: "turn right", target: "skrenite desno", partOfSpeech: "direction phrase",
      register: "formal singular or plural",
      note: "Use skreni desno when speaking informally to one person.",
      example: "Skrenite desno kod parka.",
      exampleTranslation: "Turn right at the park.",
    },
    {
      source: "at the corner", target: "na uglu", partOfSpeech: "prepositional phrase",
      example: "Banka je na uglu.",
      exampleTranslation: "The bank is at the corner.",
    },
    {
      source: "traffic light", target: "semafor", partOfSpeech: "noun",
      example: "Skrenite levo kod semafora.",
      exampleTranslation: "Turn left at the traffic light.",
    },
    {
      source: "crossroads", target: "raskrsnica", partOfSpeech: "noun",
      example: "Stanica je posle raskrsnice.",
      exampleTranslation: "The station is after the crossroads.",
    },
    {
      source: "far", target: "daleko", partOfSpeech: "adverb",
      example: "Aerodrom je daleko.",
      exampleTranslation: "The airport is far away.",
    },
  ],
};

export const Lesson19 = {
  id: "lesson-19",
  titleKey: "lessons.foodExpansion.title",
  descriptionKey: "lessons.foodExpansion.description",
  category: "food-expansion",
  items: [
    {
      source: "vegetables", target: "povrće", partOfSpeech: "collective noun",
      note: "Povrće is normally treated as a singular collective noun.",
    },
    {
      source: "fruit", target: "voće", partOfSpeech: "collective noun",
      note: "Voće is normally treated as a singular collective noun.",
    },
    { source: "salad", target: "salata", partOfSpeech: "noun" },
    { source: "chicken", target: "piletina", partOfSpeech: "noun" },
    {
      source: "fish", target: "riba", partOfSpeech: "noun",
      example: "Jedem ribu.",
      exampleTranslation: "I am eating fish.",
    },
    { source: "egg", target: "jaje", partOfSpeech: "noun" },
    { source: "sugar", target: "šećer", partOfSpeech: "noun" },
    {
      source: "a table for two", target: "sto za dvoje", partOfSpeech: "restaurant phrase",
      example: "Sto za dvoje, molim.",
      exampleTranslation: "A table for two, please.",
    },
    {
      source: "the bill, please", target: "račun, molim", partOfSpeech: "restaurant phrase",
      example: "Račun, molim.",
      exampleTranslation: "The bill, please.",
    },
  ],
};

export const Lesson20 = {
  id: "lesson-20",
  titleKey: "lessons.household.title",
  descriptionKey: "lessons.household.description",
  category: "home-household",
  items: [
    { source: "fridge", target: "frižider", partOfSpeech: "noun" },
    {
      source: "stove", target: "šporet", partOfSpeech: "noun",
      note: "Šporet is the common everyday word used in Serbia.",
    },
    { source: "washing machine", target: "veš-mašina", partOfSpeech: "noun" },
    { source: "cup", target: "šolja", partOfSpeech: "noun" },
    { source: "plate", target: "tanjir", partOfSpeech: "noun" },
    { source: "spoon", target: "kašika", partOfSpeech: "noun" },
    { source: "towel", target: "peškir", partOfSpeech: "noun" },
    {
      source: "fork", target: "viljuška", partOfSpeech: "noun",
      example: "Treba mi viljuška.",
      exampleTranslation: "I need a fork.",
    },
    {
      source: "knife", target: "nož", partOfSpeech: "noun",
      example: "Nož je oštar.",
      exampleTranslation: "The knife is sharp.",
    },
    {
      source: "drinking glass", target: "čaša", partOfSpeech: "noun",
      note: "Čaša is a drinking glass; šolja is a handled cup.",
      example: "Čaša vode, molim.",
      exampleTranslation: "A glass of water, please.",
    },
  ],
};

export const Lesson21 = {
  id: "lesson-21",
  titleKey: "lessons.adjectives.title",
  descriptionKey: "lessons.adjectives.description",
  category: "common-adjectives",
  items: [
    {
      source: "big", target: "velik", partOfSpeech: "adjective",
      note: "Masculine singular form; feminine velika, neuter veliko.",
      example: "Beograd je veliki grad.",
      exampleTranslation: "Belgrade is a big city.",
    },
    {
      source: "small", target: "mali", partOfSpeech: "adjective",
      note: "Masculine singular form; feminine mala, neuter malo.",
      example: "Ovo je mali stan.",
      exampleTranslation: "This is a small apartment.",
    },
    {
      source: "good", target: "dobar", partOfSpeech: "adjective",
      note: "Masculine singular form; feminine dobra, neuter dobro.",
      example: "Ovo je dobar restoran.",
      exampleTranslation: "This is a good restaurant.",
    },
    {
      source: "bad", target: "loš", partOfSpeech: "adjective",
      note: "Masculine singular form; feminine loša, neuter loše.",
      example: "Danas je loše vreme.",
      exampleTranslation: "The weather is bad today.",
    },
    {
      source: "new", target: "nov", partOfSpeech: "adjective",
      note: "Masculine singular form; feminine nova, neuter novo.",
      example: "Imam novi telefon.",
      exampleTranslation: "I have a new phone.",
    },
    {
      source: "old", target: "star", partOfSpeech: "adjective",
      note: "Star can describe the age of a person or a thing; feminine stara, neuter staro.",
      example: "Ovo je stara kuća.",
      exampleTranslation: "This is an old house.",
    },
    {
      source: "beautiful", target: "lep", partOfSpeech: "adjective",
      note: "Masculine singular form; feminine lepa, neuter lepo.",
      example: "Park je lep.",
      exampleTranslation: "The park is beautiful.",
    },
    {
      source: "long", target: "dug", partOfSpeech: "adjective",
      note: "Masculine singular form; feminine duga, neuter dugo.",
      example: "Put je dug.",
      exampleTranslation: "The road is long.",
    },
    {
      source: "short", target: "kratak", partOfSpeech: "adjective",
      note: "Masculine singular form; feminine kratka, neuter kratko.",
      example: "Ova ulica je kratka.",
      exampleTranslation: "This street is short.",
    },
  ],
};

export const Lesson22 = {
  id: "lesson-22",
  titleKey: "lessons.prepositions.title",
  descriptionKey: "lessons.prepositions.description",
  category: "common-prepositions",
  items: [
    {
      source: "in / into", target: "u", partOfSpeech: "preposition",
      note: "Use the locative for location and the accusative for movement into a place.",
      example: "Živim u Beogradu.",
      exampleTranslation: "I live in Belgrade.",
    },
    {
      source: "on / onto", target: "na", partOfSpeech: "preposition",
      note: "Use the locative for location and the accusative for movement onto or to a place.",
      example: "Knjiga je na stolu.",
      exampleTranslation: "The book is on the table.",
    },
    {
      source: "from / out of", target: "iz", partOfSpeech: "preposition",
      note: "Iz takes the genitive case.",
      example: "Ja sam iz Srbije.",
      exampleTranslation: "I am from Serbia.",
    },
    {
      source: "with", target: "sa", partOfSpeech: "preposition",
      note: "Sa takes the instrumental case; the shorter form s is also used.",
      example: "Idem sa prijateljem.",
      exampleTranslation: "I am going with a friend.",
    },
    {
      source: "without", target: "bez", partOfSpeech: "preposition",
      note: "Bez takes the genitive case.",
      example: "Pijem kafu bez šećera.",
      exampleTranslation: "I drink coffee without sugar.",
    },
    {
      source: "in front of", target: "ispred", partOfSpeech: "preposition",
      note: "Ispred takes the genitive case.",
      example: "Auto je ispred kuće.",
      exampleTranslation: "The car is in front of the house.",
    },
    {
      source: "behind", target: "iza", partOfSpeech: "preposition",
      note: "Iza takes the genitive case.",
      example: "Park je iza škole.",
      exampleTranslation: "The park is behind the school.",
    },
    {
      source: "under", target: "ispod", partOfSpeech: "preposition",
      note: "Ispod takes the genitive case.",
      example: "Torba je ispod stola.",
      exampleTranslation: "The bag is under the table.",
    },
    {
      source: "above / over", target: "iznad", partOfSpeech: "preposition",
      note: "Iznad takes the genitive case.",
      example: "Lampa je iznad stola.",
      exampleTranslation: "The lamp is above the table.",
    },
    {
      source: "between", target: "između", partOfSpeech: "preposition",
      note: "Između takes the genitive case.",
      example: "Banka je između škole i parka.",
      exampleTranslation: "The bank is between the school and the park.",
    },
    {
      source: "next to", target: "pored", partOfSpeech: "preposition",
      note: "Pored takes the genitive case.",
      example: "Sedim pored prozora.",
      exampleTranslation: "I am sitting next to the window.",
    },
  ],
};

export const Lesson23 = {
  id: "lesson-23",
  titleKey: "lessons.survival.title",
  descriptionKey: "lessons.survival.description",
  category: "survival-phrases",
  items: [
    {
      source: "I don't understand", target: "ne razumem", partOfSpeech: "phrase",
      example: "Ne razumem ovu reč.",
      exampleTranslation: "I don't understand this word.",
    },
    {
      source: "please speak more slowly", target: "govorite sporije, molim vas", partOfSpeech: "phrase",
      register: "formal singular or plural",
      note: "Use govori sporije when speaking informally to one person.",
      example: "Govorite sporije, molim vas. Ne razumem.",
      exampleTranslation: "Please speak more slowly. I don't understand.",
    },
    {
      source: "please repeat", target: "ponovite, molim vas", partOfSpeech: "phrase",
      register: "formal singular or plural",
      note: "Use ponovi when speaking informally to one person.",
      example: "Ponovite, molim vas.",
      exampleTranslation: "Please repeat.",
    },
    {
      source: "do you speak English?", target: "da li govorite engleski?", partOfSpeech: "question",
      register: "formal singular or plural",
      note: "Use Da li govoriš engleski? when speaking informally to one person.",
      example: "Izvinite, da li govorite engleski?",
      exampleTranslation: "Excuse me, do you speak English?",
    },
    {
      source: "I need help", target: "treba mi pomoć", partOfSpeech: "phrase",
      example: "Izvinite, treba mi pomoć.",
      exampleTranslation: "Excuse me, I need help.",
    },
    {
      source: "where is the toilet?", target: "gde je toalet?", partOfSpeech: "question",
      example: "Izvinite, gde je toalet?",
      exampleTranslation: "Excuse me, where is the toilet?",
    },
  ],
};

export const Lesson24 = {
  id: "lesson-24",
  titleKey: "lessons.social.title",
  descriptionKey: "lessons.social.description",
  category: "social-phrases",
  items: [
    {
      source: "excuse me", target: "izvinite", partOfSpeech: "phrase",
      register: "formal singular or plural",
      note: "Izvini is the informal singular form.",
      example: "Izvinite, gde je banka?",
      exampleTranslation: "Excuse me, where is the bank?",
    },
    {
      source: "thank you very much", target: "hvala puno", partOfSpeech: "phrase",
      note: "Mnogo vam hvala is another common, slightly fuller form.",
      example: "Hvala puno na pomoći.",
      exampleTranslation: "Thank you very much for the help.",
    },
    {
      source: "of course", target: "naravno", partOfSpeech: "adverb",
      example: "Naravno, mogu da pomognem.",
      exampleTranslation: "Of course, I can help.",
    },
    {
      source: "good luck", target: "srećno", partOfSpeech: "phrase",
      example: "Srećno na testu!",
      exampleTranslation: "Good luck on the test!",
    },
    {
      source: "happy birthday", target: "srećan rođendan", partOfSpeech: "phrase",
      example: "Srećan rođendan, Ana!",
      exampleTranslation: "Happy birthday, Ana!",
    },
  ],
};

export const Lesson25 = {
  id: "lesson-25",
  titleKey: "lessons.verbsExpansion.title",
  descriptionKey: "lessons.verbsExpansion.description",
  category: "high-frequency-verbs",
  items: [
    {
      source: "to read", target: "čitati", partOfSpeech: "verb",
      aspect: "imperfective",
      example: "Čitam knjigu.",
      exampleTranslation: "I am reading a book.",
    },
    {
      source: "to write", target: "pisati", partOfSpeech: "verb",
      aspect: "imperfective",
      example: "Pišem poruku.",
      exampleTranslation: "I am writing a message.",
    },
    {
      source: "to wait", target: "čekati", partOfSpeech: "verb",
      aspect: "imperfective",
      example: "Čekam autobus.",
      exampleTranslation: "I am waiting for the bus.",
    },
    {
      source: "to help", target: "pomagati", partOfSpeech: "verb",
      aspect: "imperfective",
      note: "Pomoći is the perfective form for a completed act of helping.",
      example: "Pomažem prijatelju.",
      exampleTranslation: "I am helping a friend.",
    },
    {
      source: "to open", target: "otvarati", partOfSpeech: "verb",
      aspect: "imperfective",
      note: "Otvoriti is the perfective form for opening something completely.",
      example: "Otvaram prozor.",
      exampleTranslation: "I am opening the window.",
    },
    {
      source: "to close", target: "zatvarati", partOfSpeech: "verb",
      aspect: "imperfective",
      note: "Zatvoriti is the perfective form for closing something completely.",
      example: "Zatvaram vrata.",
      exampleTranslation: "I am closing the door.",
    },
    {
      source: "to start / begin", target: "počinjati", partOfSpeech: "verb",
      aspect: "imperfective",
      note: "Početi is the perfective form.",
      example: "Čas počinje u devet.",
      exampleTranslation: "The class starts at nine.",
    },
    {
      source: "to finish", target: "završavati", partOfSpeech: "verb",
      aspect: "imperfective",
      note: "Završiti is the perfective form.",
      example: "Završavam posao u pet.",
      exampleTranslation: "I finish work at five.",
    },
  ],
};

export const Lesson26 = {
  id: "lesson-26",
  titleKey: "lessons.dailyActions.title",
  descriptionKey: "lessons.dailyActions.description",
  category: "daily-actions",
  items: [
    {
      source: "to shower", target: "tuširati se", partOfSpeech: "reflexive verb",
      example: "Tuširam se ujutru.",
      exampleTranslation: "I shower in the morning.",
    },
    {
      source: "to get dressed", target: "oblačiti se", partOfSpeech: "reflexive verb",
      aspect: "imperfective",
      note: "The reflexive se is part of the verb; obući se is the perfective form.",
      example: "Oblačim se brzo.",
      exampleTranslation: "I get dressed quickly.",
    },
    {
      source: "to cook", target: "kuvati", partOfSpeech: "verb",
      aspect: "imperfective",
      example: "Kuvam ručak.",
      exampleTranslation: "I am cooking lunch.",
    },
    {
      source: "to clean", target: "čistiti", partOfSpeech: "verb",
      aspect: "imperfective",
      example: "Čistim stan.",
      exampleTranslation: "I am cleaning the apartment.",
    },
    {
      source: "to take a walk", target: "šetati", partOfSpeech: "verb",
      aspect: "imperfective",
      note: "Šetati means to walk for pleasure; ići peške means to go somewhere on foot.",
      example: "Šetam u parku.",
      exampleTranslation: "I am taking a walk in the park.",
    },
    {
      source: "to return", target: "vraćati se", partOfSpeech: "reflexive verb",
      aspect: "imperfective",
      note: "Vratiti se is the perfective form.",
      example: "Vraćam se kući.",
      exampleTranslation: "I am returning home.",
    },
    {
      source: "to rest", target: "odmarati se", partOfSpeech: "reflexive verb",
      aspect: "imperfective",
      example: "Odmaram se posle posla.",
      exampleTranslation: "I rest after work.",
    },
  ],
};

export const Lesson27 = {
  id: "lesson-27",
  titleKey: "lessons.frequency.title",
  descriptionKey: "lessons.frequency.description",
  category: "time-frequency",
  items: [
    {
      source: "now", target: "sada", partOfSpeech: "time adverb",
      note: "Sad is the common shorter form in speech.",
      example: "Radim sada.",
      exampleTranslation: "I am working now.",
    },
    {
      source: "later", target: "kasnije", partOfSpeech: "time adverb",
      example: "Vidimo se kasnije.",
      exampleTranslation: "See you later.",
    },
    {
      source: "early", target: "rano", partOfSpeech: "time adverb",
      example: "Ustajem rano.",
      exampleTranslation: "I get up early.",
    },
    {
      source: "late", target: "kasno", partOfSpeech: "time adverb",
      example: "Dolazim kasno.",
      exampleTranslation: "I arrive late.",
    },
    {
      source: "always", target: "uvek", partOfSpeech: "frequency adverb",
      example: "Uvek doručkujem.",
      exampleTranslation: "I always have breakfast.",
    },
    {
      source: "often", target: "često", partOfSpeech: "frequency adverb",
      example: "Često idem autobusom.",
      exampleTranslation: "I often go by bus.",
    },
    {
      source: "sometimes", target: "ponekad", partOfSpeech: "frequency adverb",
      example: "Ponekad kuvam večeru.",
      exampleTranslation: "I sometimes cook dinner.",
    },
    {
      source: "never", target: "nikada", partOfSpeech: "frequency adverb",
      note: "Nikad is the common shorter form; Serbian also uses ne with this word.",
      example: "Nikada ne pijem kafu.",
      exampleTranslation: "I never drink coffee.",
    },
  ],
};

export const Lesson28 = {
  id: "lesson-28",
  titleKey: "lessons.adjectivesExpansion.title",
  descriptionKey: "lessons.adjectivesExpansion.description",
  category: "common-adjectives-2",
  items: [
    {
      source: "easy", target: "lak", partOfSpeech: "adjective",
      note: "Lak can also mean light in weight; feminine laka, neuter lako.",
      example: "Ovaj test je lak.",
      exampleTranslation: "This test is easy.",
    },
    {
      source: "difficult", target: "težak", partOfSpeech: "adjective",
      note: "Težak can also mean heavy; feminine teška, neuter teško.",
      example: "Ovaj zadatak je težak.",
      exampleTranslation: "This task is difficult.",
    },
    {
      source: "important", target: "važan", partOfSpeech: "adjective",
      note: "Masculine singular form; feminine važna, neuter važno.",
      example: "Ovo je važno.",
      exampleTranslation: "This is important.",
    },
    {
      source: "possible", target: "moguć", partOfSpeech: "adjective",
      note: "Masculine singular form; feminine moguća, neuter moguće.",
      example: "To je moguće.",
      exampleTranslation: "That is possible.",
    },
    {
      source: "ready", target: "spreman", partOfSpeech: "adjective",
      note: "A woman says spremna; the neuter form is spremno.",
      example: "Spreman sam.",
      exampleTranslation: "I am ready.",
    },
    {
      source: "busy", target: "zauzet", partOfSpeech: "adjective",
      note: "A woman says zauzeta; the neuter form is zauzeto.",
      example: "Danas sam zauzet.",
      exampleTranslation: "I am busy today.",
    },
    {
      source: "free / available", target: "slobodan", partOfSpeech: "adjective",
      note: "This means available or not occupied, not free of charge; feminine slobodna.",
      example: "Sutra sam slobodan.",
      exampleTranslation: "I am free tomorrow.",
    },
  ],
};

export const Lesson29 = {
  id: "lesson-29",
  titleKey: "lessons.needs.title",
  descriptionKey: "lessons.needs.description",
  category: "needs-preferences",
  items: [
    {
      source: "to need", target: "trebati", partOfSpeech: "verb",
      note: "For personal needs, Serbian commonly uses treba mi plus a noun.",
      example: "Treba mi voda.",
      exampleTranslation: "I need water.",
    },
    {
      source: "to like / love", target: "voleti", partOfSpeech: "verb",
      aspect: "imperfective",
      note: "Voleti is used for liking things and for loving people.",
      example: "Volim srpsku hranu.",
      exampleTranslation: "I like Serbian food.",
    },
    {
      source: "I would like...", target: "želeo bih...", partOfSpeech: "polite phrase",
      note: "Želeo bih is used by a man; a woman says želela bih.",
      example: "Želeo bih kafu, molim.",
      exampleTranslation: "I would like coffee, please.",
    },
    {
      source: "I prefer...", target: "više volim...", partOfSpeech: "preference phrase",
      example: "Više volim čaj.",
      exampleTranslation: "I prefer tea.",
    },
    {
      source: "I don't want...", target: "ne želim...", partOfSpeech: "phrase",
      example: "Ne želim šećer.",
      exampleTranslation: "I don't want sugar.",
    },
    {
      source: "that's enough", target: "dosta je", partOfSpeech: "phrase",
      example: "Hvala, dosta je.",
      exampleTranslation: "Thank you, that's enough.",
    },
  ],
};

export const Lesson30 = {
  id: "lesson-30",
  titleKey: "lessons.feelings.title",
  descriptionKey: "lessons.feelings.description",
  category: "feelings-states",
  items: [
    {
      source: "hungry", target: "gladan", partOfSpeech: "adjective",
      note: "A woman says gladna.",
      example: "Gladan sam.",
      exampleTranslation: "I am hungry.",
    },
    {
      source: "thirsty", target: "žedan", partOfSpeech: "adjective",
      note: "A woman says žedna.",
      example: "Žedna sam.",
      exampleTranslation: "I am thirsty.",
    },
    {
      source: "tired", target: "umoran", partOfSpeech: "adjective",
      note: "A woman says umorna.",
      example: "Umoran sam danas.",
      exampleTranslation: "I am tired today.",
    },
    {
      source: "happy", target: "srećan", partOfSpeech: "adjective",
      note: "Srećan can also mean lucky; a woman says srećna.",
      example: "Danas sam srećna.",
      exampleTranslation: "I am happy today.",
    },
    {
      source: "sad", target: "tužan", partOfSpeech: "adjective",
      note: "A woman says tužna.",
      example: "On je tužan.",
      exampleTranslation: "He is sad.",
    },
    {
      source: "sick / ill", target: "bolestan", partOfSpeech: "adjective",
      note: "A woman says bolesna.",
      example: "Ona je bolesna.",
      exampleTranslation: "She is sick.",
    },
    {
      source: "angry", target: "ljut", partOfSpeech: "adjective",
      note: "A woman says ljuta; ljut can also mean spicy when describing food.",
      example: "On je ljut.",
      exampleTranslation: "He is angry.",
    },
  ],
};

export const Lesson31 = {
  id: "lesson-31",
  titleKey: "lessons.communication.title",
  descriptionKey: "lessons.communication.description",
  category: "communication-phrases",
  items: [
    {
      source: "I don't know", target: "ne znam", partOfSpeech: "phrase",
      example: "Ne znam odgovor.",
      exampleTranslation: "I don't know the answer.",
    },
    {
      source: "I understand", target: "razumem", partOfSpeech: "phrase",
      example: "Da, razumem.",
      exampleTranslation: "Yes, I understand.",
    },
    {
      source: "what does this mean?", target: "šta ovo znači?", partOfSpeech: "question",
      example: "Šta ovo znači na engleskom?",
      exampleTranslation: "What does this mean in English?",
    },
    {
      source: "how do you say this in Serbian?", target: "kako se ovo kaže na srpskom?", partOfSpeech: "question",
      note: "Kaže se is a reflexive impersonal construction used for how something is said.",
      example: "Kako se kaže \"water\" na srpskom?",
      exampleTranslation: "How do you say \"water\" in Serbian?",
    },
    {
      source: "please write it down", target: "zapišite, molim vas", partOfSpeech: "phrase",
      register: "formal singular or plural",
      note: "Use zapiši when speaking informally to one person.",
      example: "Zapišite adresu, molim vas.",
      exampleTranslation: "Please write down the address.",
    },
    {
      source: "one moment, please", target: "samo trenutak, molim vas", partOfSpeech: "phrase",
      example: "Samo trenutak, molim vas.",
      exampleTranslation: "One moment, please.",
    },
  ],
};

export const Lesson32 = {
  id: "lesson-32",
  titleKey: "lessons.adverbs.title",
  descriptionKey: "lessons.adverbs.description",
  category: "common-adverbs",
  items: [
    {
      source: "very", target: "veoma", partOfSpeech: "adverb",
      note: "Vrlo is another common word for very.",
      example: "Ovo je veoma važno.",
      exampleTranslation: "This is very important.",
    },
    {
      source: "a little", target: "malo", partOfSpeech: "adverb",
      note: "Malo can express a small amount; it is also the neuter form of mali.",
      example: "Govorim malo srpski.",
      exampleTranslation: "I speak a little Serbian.",
    },
    {
      source: "together", target: "zajedno", partOfSpeech: "adverb",
      example: "Učimo zajedno.",
      exampleTranslation: "We are learning together.",
    },
    {
      source: "again", target: "ponovo", partOfSpeech: "adverb",
      example: "Ponovo čitam knjigu.",
      exampleTranslation: "I am reading the book again.",
    },
    {
      source: "quickly", target: "brzo", partOfSpeech: "adverb",
      note: "Brzo is an adverb; brz is the related masculine adjective.",
      example: "On govori brzo.",
      exampleTranslation: "He speaks quickly.",
    },
    {
      source: "slowly", target: "polako", partOfSpeech: "adverb",
      note: "Polako can also mean carefully or take it easy.",
      example: "Govorite polako, molim vas.",
      exampleTranslation: "Please speak slowly.",
    },
  ],
};

export const Lesson33 = {
  id: "lesson-33",
  titleKey: "lessons.connectors.title",
  descriptionKey: "lessons.connectors.description",
  category: "everyday-connectors",
  items: [
    {
      source: "and", target: "i", partOfSpeech: "conjunction",
      note: "I can also mean also depending on its position.",
      example: "Imam kafu i čaj.",
      exampleTranslation: "I have coffee and tea.",
    },
    {
      source: "but", target: "ali", partOfSpeech: "conjunction",
      example: "Stan je mali, ali lep.",
      exampleTranslation: "The apartment is small but beautiful.",
    },
    {
      source: "or", target: "ili", partOfSpeech: "conjunction",
      example: "Kafa ili čaj?",
      exampleTranslation: "Coffee or tea?",
    },
    {
      source: "because", target: "jer", partOfSpeech: "conjunction",
      example: "Učim srpski jer živim u Beogradu.",
      exampleTranslation: "I am learning Serbian because I live in Belgrade.",
    },
    {
      source: "then", target: "onda", partOfSpeech: "connector adverb",
      example: "Prvo doručkujem, onda idem na posao.",
      exampleTranslation: "First I have breakfast, then I go to work.",
    },
    {
      source: "if", target: "ako", partOfSpeech: "conjunction",
      example: "Idem ako imam vremena.",
      exampleTranslation: "I am going if I have time.",
    },
  ],
};

export const Lesson34 = {
  id: "lesson-34",
  titleKey: "lessons.calendarSeasons.title",
  descriptionKey: "lessons.calendarSeasons.description",
  category: "calendar-seasons",
  items: [
    {
      source: "Saturday", target: "subota", partOfSpeech: "noun",
      example: "Subotom ne radim.",
      exampleTranslation: "I don't work on Saturdays.",
    },
    {
      source: "Sunday", target: "nedelja", partOfSpeech: "noun",
      note: "Nedelja can also mean week; context shows the meaning.",
      example: "Nedelja je sutra.",
      exampleTranslation: "Sunday is tomorrow.",
    },
    {
      source: "week", target: "sedmica", partOfSpeech: "noun",
      note: "Nedelja is also commonly used for week and also means Sunday.",
      example: "Jedna sedmica ima sedam dana.",
      exampleTranslation: "One week has seven days.",
    },
    {
      source: "month", target: "mesec", partOfSpeech: "noun",
      note: "Mesec also means moon.",
      example: "Ovaj mesec ima trideset dana.",
      exampleTranslation: "This month has thirty days.",
    },
    {
      source: "year", target: "godina", partOfSpeech: "noun",
      example: "Godina ima dvanaest meseci.",
      exampleTranslation: "A year has twelve months.",
    },
    {
      source: "weekend", target: "vikend", partOfSpeech: "noun",
      example: "Vidimo se za vikend.",
      exampleTranslation: "See you at the weekend.",
    },
    {
      source: "what time is it?", target: "koliko je sati?", partOfSpeech: "question",
      example: "Koliko je sati? Pet je.",
      exampleTranslation: "What time is it? It is five.",
    },
    {
      source: "January", target: "januar", partOfSpeech: "noun",
      note: "Serbian month names are lowercase except at the start of a sentence.",
    },
    { source: "February", target: "februar", partOfSpeech: "noun" },
    { source: "March", target: "mart", partOfSpeech: "noun" },
    { source: "April", target: "april", partOfSpeech: "noun" },
    {
      source: "May", target: "maj", partOfSpeech: "noun",
      example: "Rođendan mi je u maju.",
      exampleTranslation: "My birthday is in May.",
    },
    { source: "June", target: "jun", partOfSpeech: "noun" },
    { source: "July", target: "jul", partOfSpeech: "noun" },
    { source: "August", target: "avgust", partOfSpeech: "noun" },
    { source: "September", target: "septembar", partOfSpeech: "noun" },
    { source: "October", target: "oktobar", partOfSpeech: "noun" },
    { source: "November", target: "novembar", partOfSpeech: "noun" },
    { source: "December", target: "decembar", partOfSpeech: "noun" },
    {
      source: "spring", target: "proleće", partOfSpeech: "noun",
      example: "U proleće je toplo.",
      exampleTranslation: "It is warm in spring.",
    },
    {
      source: "summer", target: "leto", partOfSpeech: "noun",
      example: "Leti je vruće.",
      exampleTranslation: "It is hot in summer.",
    },
    {
      source: "autumn / fall", target: "jesen", partOfSpeech: "noun",
      example: "Jesen je lepa.",
      exampleTranslation: "Autumn is beautiful.",
    },
    {
      source: "winter", target: "zima", partOfSpeech: "noun",
      example: "Zimi pada sneg.",
      exampleTranslation: "It snows in winter.",
    },
  ],
};

export const Lesson35 = {
  id: "lesson-35",
  titleKey: "lessons.colours.title",
  descriptionKey: "lessons.colours.description",
  category: "colours",
  items: [
    {
      source: "colour", target: "boja", partOfSpeech: "noun",
      example: "Koja je tvoja omiljena boja?",
      exampleTranslation: "What is your favourite colour?",
    },
    {
      source: "red", target: "crven", partOfSpeech: "adjective",
      note: "Masculine singular form; feminine crvena, neuter crveno.",
      example: "Auto je crven.",
      exampleTranslation: "The car is red.",
    },
    {
      source: "blue", target: "plav", partOfSpeech: "adjective",
      note: "Masculine singular form; feminine plava, neuter plavo. Plav can also describe blond hair.",
      example: "Nebo je plavo.",
      exampleTranslation: "The sky is blue.",
    },
    {
      source: "green", target: "zelen", partOfSpeech: "adjective",
      note: "Masculine singular form; feminine zelena, neuter zeleno.",
      example: "Trava je zelena.",
      exampleTranslation: "The grass is green.",
    },
    {
      source: "yellow", target: "žut", partOfSpeech: "adjective",
      note: "Masculine singular form; feminine žuta, neuter žuto.",
      example: "Banana je žuta.",
      exampleTranslation: "The banana is yellow.",
    },
    {
      source: "black", target: "crn", partOfSpeech: "adjective",
      note: "Masculine singular form; feminine crna, neuter crno.",
      example: "Imam crnu jaknu.",
      exampleTranslation: "I have a black jacket.",
    },
    {
      source: "white", target: "beo", partOfSpeech: "adjective",
      note: "Masculine singular form; feminine bela, neuter belo.",
      example: "Košulja je bela.",
      exampleTranslation: "The shirt is white.",
    },
  ],
};

const lessons = [
  Lesson1, Lesson2, Lesson3, Lesson4, Lesson5, Lesson6,
  Lesson7, Lesson8, Lesson9, Lesson10, Lesson11, Lesson12,
  Lesson13, Lesson14, Lesson15, Lesson16, Lesson17, Lesson18,
  Lesson19, Lesson20, Lesson21, Lesson22, Lesson23, Lesson24,
  Lesson25, Lesson26, Lesson27, Lesson28, Lesson29, Lesson30,
  Lesson31, Lesson32, Lesson33, Lesson34, Lesson35,
];

export const Curriculum = lessons.map((lesson) => ({
  ...lesson,
  items: lesson.items.map((item, index) => ({
    ...item,
    id: `${lesson.id}-word-${index + 1}`,
    categoryId: lesson.id,
    category: lesson.category,
    level: "A1",
    sourceType: "supplementary",
    status: "learning",
    favorite: false,
    kind: "built-in",
  })),
}));
