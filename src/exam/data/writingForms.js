import {
  GOETHE_B1_WRITING_CONFIG,
  WRITING_SKILL_TAGS,
  WRITING_TASK_CONFIG,
} from "../config/goetheB1Writing";

const task = ({ id, part, scenario, prompt, bulletPoints, checklist, skillTags, guidance }) => ({
  id,
  part,
  taskType: WRITING_TASK_CONFIG[part - 1].taskType,
  title: WRITING_TASK_CONFIG[part - 1].title,
  scenario,
  prompt,
  bulletPoints,
  checklist,
  approximateWordTarget: WRITING_TASK_CONFIG[part - 1].approximateWordTarget,
  suggestedMinutes: WRITING_TASK_CONFIG[part - 1].suggestedMinutes,
  skillTags,
  guidance,
  sourceType: "original-exam-task",
});

const personalTasks = [
  task({ id: "writing-p1-apartment", part: 1, scenario: "You have recently moved into a new apartment in Leipzig. Your friend Mara wants to know how the move went.", prompt: "Write a personal email to Mara.", bulletPoints: ["Describe your new apartment and neighbourhood.", "Explain one problem during the move and how you solved it.", "Invite Mara and suggest a date for her visit."], checklist: ["I described the apartment and area.", "I explained the moving problem and solution.", "I invited Mara and suggested a date."], skillTags: ["personal-email", "informal-register", "task-fulfilment", "planning"], guidance: "Use a warm greeting, organise the news into short paragraphs, and finish with a clear invitation." }),
  task({ id: "writing-p1-evening-course", part: 1, scenario: "You started an evening photography course in Graz. Your friend Jonas is considering the same course.", prompt: "Write a personal email to Jonas.", bulletPoints: ["Describe what you did in the first lesson.", "Explain what you like or find difficult.", "Ask Jonas whether he wants to join you next month."], checklist: ["I described the first lesson.", "I explained a positive or difficult point.", "I asked Jonas a direct question."], skillTags: ["personal-email", "informal-register", "reasons", "request"], guidance: "React naturally, give a concrete example, and make the final question easy to answer." }),
  task({ id: "writing-p1-cancelled-trip", part: 1, scenario: "A weekend hiking trip with your friend Nila had to be cancelled because the train route was closed.", prompt: "Write a personal email to Nila.", bulletPoints: ["Explain what happened.", "Suggest a different activity for the same weekend.", "Ask which alternative she prefers."], checklist: ["I explained the cancellation.", "I suggested a realistic alternative.", "I asked for Nila's preference."], skillTags: ["personal-email", "informal-register", "coherence", "reasons"], guidance: "Begin with the important news, explain the reason briefly, then turn toward a positive new plan." }),
  task({ id: "writing-p1-city-visit", part: 1, scenario: "Your cousin Emil will visit you in Basel for the first time.", prompt: "Write a personal email to Emil.", bulletPoints: ["Recommend one place you can visit together.", "Explain why you chose it.", "Ask about his arrival time and food preferences."], checklist: ["I recommended a place.", "I gave a reason for my choice.", "I asked about arrival and food."], skillTags: ["personal-email", "informal-register", "reasons", "planning"], guidance: "Use friendly suggestions and separate practical questions from the description of your plan." }),
  task({ id: "writing-p1-booking-problem", part: 1, scenario: "You and your friend Sofia booked a holiday flat, but the owner has changed the arrival day.", prompt: "Write a personal email to Sofia.", bulletPoints: ["Describe the message from the owner.", "Explain how the change affects your plans.", "Suggest what you should do next."], checklist: ["I described the booking change.", "I explained its effect on our plans.", "I made a concrete suggestion."], skillTags: ["personal-email", "informal-register", "task-fulfilment", "coherence"], guidance: "Report the facts clearly, use connectors for consequences, and end with a practical proposal." }),
  task({ id: "writing-p1-community-event", part: 1, scenario: "You helped at a neighbourhood food festival in Hamburg. Your friend Leo could not attend.", prompt: "Write a personal email to Leo.", bulletPoints: ["Describe your role at the festival.", "Tell him about a memorable moment.", "Invite him to help at the next event."], checklist: ["I described my role.", "I included a memorable detail.", "I invited Leo to the next event."], skillTags: ["personal-email", "informal-register", "examples", "planning"], guidance: "Tell the experience in a logical order and include one vivid but concise example." }),
];

const opinionTasks = [
  task({ id: "writing-p2-library-hours", part: 2, scenario: "A city forum asks whether public libraries should stay open later on weekdays.", prompt: "Write a forum contribution giving your opinion.", bulletPoints: ["State your position clearly.", "Give at least one reason and a concrete example.", "End with a practical conclusion or suggestion."], checklist: ["I stated my opinion.", "I supported it with a reason and example.", "I wrote a clear conclusion."], skillTags: ["opinion", "coherence", "connectors", "examples"], guidance: "Use a clear opening position, develop one or two connected reasons, and finish without simply repeating the first sentence." }),
  task({ id: "writing-p2-four-day-week", part: 2, scenario: "An online workplace discussion asks whether employees should be able to work four longer days instead of five normal days.", prompt: "Write a forum contribution giving your opinion.", bulletPoints: ["Explain your view.", "Discuss one advantage and one possible difficulty.", "Give an example and conclude."], checklist: ["I made my position clear.", "I considered an advantage and a difficulty.", "I used an example and conclusion."], skillTags: ["opinion", "reasons", "connectors", "coherence"], guidance: "Acknowledge a possible counterpoint, then explain why your own conclusion still follows." }),
  task({ id: "writing-p2-repair-cafes", part: 2, scenario: "Your local community website is discussing whether the city should support repair cafés for broken household items.", prompt: "Write a forum contribution giving your opinion.", bulletPoints: ["State whether you support the idea.", "Explain social or environmental benefits or concerns.", "Give a personal or imagined example and conclude."], checklist: ["I stated my view.", "I explained benefits or concerns.", "I included an example and conclusion."], skillTags: ["opinion", "examples", "reasons", "task-fulfilment"], guidance: "Connect the example directly to your reason instead of listing unrelated advantages." }),
  task({ id: "writing-p2-free-transport-sundays", part: 2, scenario: "A regional news site asks whether buses and trams should be free on Sundays.", prompt: "Write a forum contribution giving your opinion.", bulletPoints: ["State your opinion.", "Give reasons connected to travel, cost, or the environment.", "Mention one possible problem and propose a conclusion."], checklist: ["I clearly stated my opinion.", "I developed relevant reasons.", "I mentioned a problem and concluded."], skillTags: ["opinion", "connectors", "reasons", "planning"], guidance: "Use contrast connectors to weigh the possible problem against the expected benefit." }),
  task({ id: "writing-p2-phone-free-meetings", part: 2, scenario: "A professional forum is debating phone-free meetings at work.", prompt: "Write a forum contribution giving your opinion.", bulletPoints: ["State whether phones should be put away.", "Explain how this could affect communication.", "Give an example and end with a balanced recommendation."], checklist: ["I stated my position.", "I explained an effect on communication.", "I gave an example and recommendation."], skillTags: ["opinion", "register", "examples", "coherence"], guidance: "Keep a neutral public tone and use a specific meeting example to support your view." }),
  task({ id: "writing-p2-shared-gardens", part: 2, scenario: "Residents are discussing whether unused parking spaces should become shared gardens.", prompt: "Write a forum contribution giving your opinion.", bulletPoints: ["State your view.", "Give reasons about neighbourhood life or practical needs.", "Consider another view and conclude."], checklist: ["I gave my opinion.", "I explained relevant reasons.", "I considered another view and concluded."], skillTags: ["opinion", "coherence", "connectors", "reasons"], guidance: "Show that you understand a different need, then make your final position precise." }),
];

const formalTasks = [
  task({ id: "writing-p3-course-certificate", part: 3, scenario: "You completed a weekend first-aid course, but your certificate has not arrived.", prompt: "Write a formal email to the course organiser.", bulletPoints: ["Explain which course you attended.", "Politely ask when and how you will receive the certificate."], checklist: ["I used a formal greeting.", "I identified the course clearly.", "I made a polite request and used a formal closing."], skillTags: ["formal-email", "formal-register", "request", "task-fulfilment"], guidance: "Use a precise subject purpose, a polite request form, and an appropriate closing." }),
  task({ id: "writing-p3-landlord-repair", part: 3, scenario: "The light in the shared entrance of your apartment building has not worked for several days.", prompt: "Write a formal email to your landlord.", bulletPoints: ["Describe the problem and why it is unsafe.", "Politely request a repair and ask when it can happen."], checklist: ["I used a formal greeting.", "I described the problem and reason.", "I requested action and used a formal closing."], skillTags: ["formal-email", "formal-register", "request", "reasons"], guidance: "Remain polite and factual; clearly state both the problem and the requested next step." }),
  task({ id: "writing-p3-workshop-absence", part: 3, scenario: "You registered for a professional workshop but cannot attend because of an urgent family appointment.", prompt: "Write a formal email to the workshop coordinator.", bulletPoints: ["Apologise and explain your absence briefly.", "Ask whether you can attend a later date or receive the materials."], checklist: ["I used a formal greeting.", "I apologised and explained briefly.", "I asked for an alternative and closed formally."], skillTags: ["formal-email", "formal-register", "apology", "request"], guidance: "Keep the explanation concise and offer a clear, polite alternative request." }),
  task({ id: "writing-p3-hotel-arrival", part: 3, scenario: "Your train will arrive after the hotel's normal check-in time.", prompt: "Write a formal email to the hotel reception.", bulletPoints: ["Give your reservation name and expected arrival time.", "Ask how late check-in will work."], checklist: ["I used a formal greeting.", "I included reservation and arrival details.", "I asked a clear question and closed formally."], skillTags: ["formal-email", "formal-register", "planning", "request"], guidance: "Include only the necessary booking details and formulate one direct, polite question." }),
  task({ id: "writing-p3-office-appointment", part: 3, scenario: "You have an appointment at the citizens' office but must work unexpectedly at that time.", prompt: "Write a formal email to the office.", bulletPoints: ["State which appointment you cannot attend.", "Apologise and request a new appointment next week."], checklist: ["I used a formal greeting.", "I identified and cancelled the appointment politely.", "I requested a new date and closed formally."], skillTags: ["formal-email", "formal-register", "apology", "planning"], guidance: "Identify the original appointment precisely and make the rescheduling request easy to understand." }),
  task({ id: "writing-p3-event-accessibility", part: 3, scenario: "You want to attend a public lecture and need step-free access.", prompt: "Write a formal email to the event organiser.", bulletPoints: ["Name the lecture you want to attend.", "Ask politely about step-free entrance and seating."], checklist: ["I used a formal greeting.", "I identified the event.", "I asked politely for the needed information and closed formally."], skillTags: ["formal-email", "formal-register", "request", "task-fulfilment"], guidance: "State the practical information you need without unnecessary personal detail." }),
];

export const writingTaskBank = Object.freeze({
  1: Object.freeze(personalTasks),
  2: Object.freeze(opinionTasks),
  3: Object.freeze(formalTasks),
});

const makeForm = (number) => Object.freeze({
  id: `de-b1-writing-form-${String(number).padStart(3, "0")}`,
  title: `Writing Form ${number}`,
  module: "writing",
  level: "B1",
  durationSeconds: GOETHE_B1_WRITING_CONFIG.durationSeconds,
  contentVersion: GOETHE_B1_WRITING_CONFIG.contentVersion,
  rubricVersion: GOETHE_B1_WRITING_CONFIG.rubricVersion,
  tasks: Object.freeze([personalTasks[number - 1], opinionTasks[number - 1], formalTasks[number - 1]]),
});

export const writingForms = Object.freeze([makeForm(1), makeForm(2), makeForm(3)]);

export const getWritingForm = (formId) => writingForms.find(({ id }) => id === formId) || writingForms[0];
export const getWritingPracticeTask = (part, offset = 0) => {
  const tasks = writingTaskBank[part] || writingTaskBank[1];
  return tasks[((offset % tasks.length) + tasks.length) % tasks.length];
};
export const getWritingTaskById = (taskId) => Object.values(writingTaskBank).flat().find(({ id }) => id === taskId) || null;
export const isWritingSkillTag = (tag) => WRITING_SKILL_TAGS.includes(tag);
