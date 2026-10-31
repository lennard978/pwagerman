export const VOCABULARY_CATEGORIES = Object.freeze([
  { id: "personal-identity", title: "Personal information & identity", description: "Names, documents, background, and introductions." },
  { id: "family-relationships", title: "Family & relationships", description: "Family life, partners, and social relationships." },
  { id: "home-living", title: "Home & living", description: "Housing, neighbours, rent, and moving home." },
  { id: "daily-life", title: "Daily life & routines", description: "Everyday responsibilities, routines, and time pressure." },
  { id: "food-eating-out", title: "Food & eating out", description: "Meals, restaurants, ordering, and dietary needs." },
  { id: "shopping-money", title: "Shopping & money", description: "Prices, payment, returns, and personal spending." },
  { id: "work-profession", title: "Work & profession", description: "Jobs, applications, colleagues, and employment." },
  { id: "school-education", title: "School & education", description: "Courses, qualifications, tasks, and examinations." },
  { id: "travel-transport", title: "Travel & transport", description: "Journeys, public transport, and travel problems." },
  { id: "city-services", title: "City & public services", description: "Authorities, emergency services, and civic tasks." },
  { id: "health-body", title: "Health & body", description: "Symptoms, treatment, medicine, and wellbeing." },
  { id: "appointments-services", title: "Appointments & services", description: "Bookings, repairs, advice, and service changes." },
  { id: "media-communication", title: "Media & communication", description: "News, conversations, reports, and discussion." },
  { id: "technology-internet", title: "Technology & internet", description: "Devices, files, websites, and online actions." },
  { id: "leisure-sport", title: "Leisure, hobbies & sport", description: "Clubs, exercise, free time, and competitions." },
  { id: "holidays-accommodation", title: "Holidays & accommodation", description: "Hotels, reservations, visits, and overnight stays." },
  { id: "environment-weather", title: "Environment & weather", description: "Nature, sustainability, climate, and forecasts." },
  { id: "society-community", title: "Society & community", description: "Neighbourhoods, volunteering, and public life." },
  { id: "feelings-opinions", title: "Feelings & opinions", description: "Emotions, impressions, beliefs, and reactions." },
  { id: "problems-solutions", title: "Problems & solutions", description: "Causes, decisions, complaints, and improvement." },
  { id: "plans-goals-time", title: "Plans, goals & time", description: "Future plans, aims, duration, and deadlines." },
  { id: "high-frequency-verbs", title: "High-frequency verbs", description: "Core verbs used across everyday B1 communication." },
  { id: "adjectives-adverbs", title: "Adjectives & adverbs", description: "Useful description, degree, probability, and comparison." },
  { id: "connectors-prepositions", title: "Connectors & prepositions", description: "Linking ideas and expressing relationships clearly." },
  { id: "functional-exam-phrases", title: "Functional exam phrases", description: "Original speaking and writing phrases for structured communication." },
]);

export const VOCABULARY_CATEGORY_IDS = Object.freeze(
  VOCABULARY_CATEGORIES.map((category) => category.id)
);

export const getVocabularyCategory = (categoryId) =>
  VOCABULARY_CATEGORIES.find((category) => category.id === categoryId);
