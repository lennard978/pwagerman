export const Lesson1 = {
  id: "lesson-1",
  titleKey: "lessons.greetings.title",
  descriptionKey: "lessons.greetings.description",
  category: "greetings",
  items: [
    { source: "hello", target: "zdravo" },
    { source: "good morning", target: "dobro jutro" },
    { source: "good evening", target: "dobro veče" },
    { source: "good night", target: "laku noć" },
    { source: "goodbye", target: "doviđenja" },
    { source: "please", target: "molim" },
    { source: "thank you", target: "hvala" },
    { source: "yes", target: "da" },
    { source: "no", target: "ne" },
    {
      source: "sorry",
      target: "izvini",
      partOfSpeech: "phrase",
      register: "informal singular",
      note: "Use izvinite for formal address or more than one person.",
      example: "Izvini, gde je stanica?",
      exampleTranslation: "Excuse me, where is the station?",
    },
    { source: "how are you?", target: "kako si?" },
    { source: "I am fine", target: "dobro sam" },
    { source: "what is your name?", target: "kako se zoveš?" },
    { source: "my name is...", target: "zovem se..." },
    { source: "nice to meet you", target: "drago mi je" },
    { source: "see you", target: "vidimo se" },
    {
      source: "welcome",
      target: "dobrodošli",
      partOfSpeech: "phrase",
      register: "formal singular or plural; also common as a general greeting",
      example: "Dobrodošli u Beograd!",
      exampleTranslation: "Welcome to Belgrade!",
    },
    { source: "enjoy your meal", target: "prijatno" },
    { source: "you are welcome", target: "nema na čemu" },
    { source: "have a good trip", target: "srećan put" },
  ],
};

export const Lesson2 = {
  id: "lesson-2",
  titleKey: "lessons.family.title",
  descriptionKey: "lessons.family.description",
  category: "family",
  items: [
    { source: "man", target: "čovek" },
    { source: "woman", target: "žena" },
    { source: "child", target: "dete" },
    { source: "boy", target: "dečak" },
    { source: "girl", target: "devojčica" },
    { source: "mother", target: "majka" },
    { source: "father", target: "otac" },
    { source: "mom", target: "mama" },
    { source: "dad", target: "tata" },
    { source: "brother", target: "brat" },
    { source: "sister", target: "sestra" },
    { source: "son", target: "sin" },
    { source: "daughter", target: "ćerka" },
    { source: "family", target: "porodica" },
    { source: "friend", target: "prijatelj" },
    { source: "female friend", target: "prijateljica" },
    { source: "parent", target: "roditelj" },
    { source: "parents", target: "roditelji" },
    { source: "husband", target: "muž" },
    {
      source: "wife",
      target: "supruga",
      partOfSpeech: "noun",
      register: "neutral or formal",
      note: "Žena is also used informally for wife and also means woman.",
      example: "Ovo je moja supruga.",
      exampleTranslation: "This is my wife.",
    },
  ],
};

export const Lesson3 = {
  id: "lesson-3",
  titleKey: "lessons.home.title",
  descriptionKey: "lessons.home.description",
  category: "home",
  items: [
    { source: "house", target: "kuća" },
    { source: "apartment", target: "stan" },
    { source: "room", target: "soba" },
    { source: "kitchen", target: "kuhinja" },
    { source: "bathroom", target: "kupatilo" },
    { source: "bedroom", target: "spavaća soba" },
    { source: "living room", target: "dnevna soba" },
    { source: "door", target: "vrata" },
    { source: "window", target: "prozor" },
    { source: "wall", target: "zid" },
    { source: "floor", target: "pod" },
    { source: "table", target: "sto" },
    { source: "chair", target: "stolica" },
    { source: "bed", target: "krevet" },
    { source: "lamp", target: "lampa" },
    { source: "key", target: "ključ" },
    { source: "phone", target: "telefon" },
    { source: "book", target: "knjiga" },
    { source: "bag", target: "torba" },
    { source: "mirror", target: "ogledalo" },
  ],
};

export const Lesson4 = {
  id: "lesson-4",
  titleKey: "lessons.food.title",
  descriptionKey: "lessons.food.description",
  category: "food",
  items: [
    { source: "water", target: "voda" },
    { source: "coffee", target: "kafa" },
    { source: "tea", target: "čaj" },
    { source: "bread", target: "hleb" },
    { source: "milk", target: "mleko" },
    { source: "juice", target: "sok" },
    { source: "apple", target: "jabuka" },
    { source: "banana", target: "banana" },
    { source: "orange", target: "pomorandža" },
    { source: "cheese", target: "sir" },
    { source: "soup", target: "supa" },
    { source: "meat", target: "meso" },
    { source: "rice", target: "pirinač" },
    { source: "breakfast", target: "doručak" },
    { source: "lunch", target: "ručak" },
    { source: "dinner", target: "večera" },
    { source: "menu", target: "meni" },
    { source: "bill", target: "račun" },
    { source: "waiter", target: "konobar" },
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
    { source: "one", target: "jedan" },
    { source: "two", target: "dva" },
    { source: "three", target: "tri" },
    { source: "four", target: "četiri" },
    { source: "five", target: "pet" },
    { source: "six", target: "šest" },
    { source: "seven", target: "sedam" },
    { source: "eight", target: "osam" },
    { source: "nine", target: "devet" },
    { source: "ten", target: "deset" },
    { source: "today", target: "danas" },
    { source: "tomorrow", target: "sutra" },
    { source: "yesterday", target: "juče" },
    { source: "morning", target: "jutro" },
    { source: "evening", target: "veče" },
    { source: "Monday", target: "ponedeljak" },
    { source: "Tuesday", target: "utorak" },
    { source: "Wednesday", target: "sreda" },
    { source: "Thursday", target: "četvrtak" },
    { source: "Friday", target: "petak" },
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
    { source: "bus", target: "autobus" },
    { source: "train", target: "voz" },
    { source: "station", target: "stanica" },
    { source: "airport", target: "aerodrom" },
    { source: "hotel", target: "hotel" },
    { source: "shop", target: "prodavnica" },
    { source: "restaurant", target: "restoran" },
    { source: "street", target: "ulica" },
    { source: "city", target: "grad" },
    { source: "ticket", target: "karta" },
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
    { source: "taxi", target: "taksi" },
    { source: "bicycle", target: "bicikl" },
    { source: "departure", target: "polazak" },
    { source: "arrival", target: "dolazak" },
    { source: "left", target: "levo" },
    { source: "right", target: "desno" },
    { source: "near", target: "blizu" },
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
      note: "Pijaca is a market with stalls; supermarket is supermarket.",
    },
    { source: "museum", target: "muzej", partOfSpeech: "noun" },
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

const lessons = [
  Lesson1, Lesson2, Lesson3, Lesson4, Lesson5, Lesson6,
  Lesson7, Lesson8, Lesson9, Lesson10, Lesson11, Lesson12,
  Lesson13, Lesson14, Lesson15, Lesson16, Lesson17, Lesson18,
  Lesson19, Lesson20, Lesson21, Lesson22, Lesson23, Lesson24,
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
