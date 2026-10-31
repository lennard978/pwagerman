export const EXAM_RESULT_DESCRIPTORS = Object.freeze([
  { minimum: 90, maximum: 100, id: "very-good", label: "Very good" },
  { minimum: 80, maximum: 89, id: "good", label: "Good" },
  { minimum: 70, maximum: 79, id: "satisfactory", label: "Satisfactory" },
  { minimum: 60, maximum: 69, id: "sufficient", label: "Sufficient" },
  { minimum: 0, maximum: 59, id: "not-passed", label: "Not passed" },
]);

export const getExamResultDescriptor = (score) =>
  EXAM_RESULT_DESCRIPTORS.find(({ minimum, maximum }) => score >= minimum && score <= maximum) || EXAM_RESULT_DESCRIPTORS.at(-1);
