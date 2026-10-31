import { GermanCurriculum } from "./vocabulary/curriculum";
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
    prompt: `Choose the German translation for “${item.source}”.`,
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

export const Tests = GermanCurriculum.map(createTest);
export const Test1 = Tests[0];
export const Test2 = Tests[1];
export const Test3 = Tests[2];
