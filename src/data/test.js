import { Curriculum } from "./data";
import { createBoundedRound, EXERCISE_ROUND_LIMITS } from "./exerciseRounds";

const createQuestion = (lesson, item) => {
  const itemIndex = lesson.items.indexOf(item);
  const orderedCandidates = [
    ...lesson.items.slice(itemIndex + 1),
    ...lesson.items.slice(0, itemIndex),
  ];
  const distractors = orderedCandidates
    .filter((candidate) => candidate.target !== item.target)
    .slice(0, 3)
    .map((candidate) => candidate.target);

  return {
    wordId: item.id,
    source: item.source,
    target: item.target,
    prompt: `"${item.source}" in Serbian is:`,
    options: [item.target, ...distractors],
    answer: item.target,
  };
};

const createTest = (lesson) => ({
  id: `test-${lesson.id}`,
  titleKey: lesson.titleKey,
  descriptionKey: lesson.descriptionKey,
  category: lesson.category,
  questions: createBoundedRound(
    lesson.items,
    EXERCISE_ROUND_LIMITS.test
  ).map((item) =>
    createQuestion(lesson, item)
  ),
});

export const Test1 = createTest(Curriculum[0]);
export const Test2 = createTest(Curriculum[1]);
export const Test3 = createTest(Curriculum[2]);
export const Test4 = createTest(Curriculum[3]);
export const Test5 = createTest(Curriculum[4]);
export const Test6 = createTest(Curriculum[5]);

export const Tests = [
  Test1,
  Test2,
  Test3,
  Test4,
  Test5,
  Test6,
  ...Curriculum.slice(6).map(createTest),
];
