import { Curriculum } from "./data";
import { EXERCISE_ROUND_LIMITS } from "./exerciseRounds";

const createQuestion = (lesson, itemIndex) => {
  const item = lesson.items[itemIndex];
  const distractors = [1, 2, 3].map(
    (offset) => lesson.items[(itemIndex + offset) % lesson.items.length].target
  );

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
  questions: Array.from(
    { length: Math.min(EXERCISE_ROUND_LIMITS.test, lesson.items.length) },
    (_, itemIndex) => itemIndex
  ).map((itemIndex) =>
    createQuestion(lesson, itemIndex)
  ),
});

export const Test1 = createTest(Curriculum[0]);
export const Test2 = createTest(Curriculum[1]);
export const Test3 = createTest(Curriculum[2]);
export const Test4 = createTest(Curriculum[3]);
export const Test5 = createTest(Curriculum[4]);
export const Test6 = createTest(Curriculum[5]);

export const Tests = Curriculum.map(createTest);
