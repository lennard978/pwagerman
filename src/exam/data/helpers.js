const labelOption = (id, label) => ({ id: String(id), label });

export const choiceOptions = (...labels) =>
  labels.map((label, index) => labelOption(String.fromCharCode(97 + index), label));

export const trueFalseOptions = () => [labelOption("true", "Richtig"), labelOption("false", "Falsch")];

export const positionOptions = () => [
  labelOption("yes", "Ja – dafür / positiv"),
  labelOption("no", "Nein – dagegen / kritisch"),
];

export const matchingOptions = (advertisements) => [
  labelOption("0", "0 – keine Anzeige passt"),
  ...advertisements.map(({ id, title }) => labelOption(id, `${id} – ${title}`)),
];

export const makeItem = ({
  id,
  number,
  type,
  prompt,
  options,
  correctAnswer,
  explanation,
  evidence,
  textRef,
  skillTags,
  grammarRefs = [],
}) => ({
  id,
  number,
  type,
  prompt,
  options,
  correctAnswer: String(correctAnswer),
  explanation,
  evidence,
  textRef,
  skillTags,
  grammarRefs,
});

export const makePart = ({ formId, number, title, type, recommendedSeconds, instructions, texts = [], advertisements, items }) => ({
  id: `${formId}-part-${number}`,
  number,
  title,
  type,
  recommendedSeconds,
  instructions,
  texts,
  ...(advertisements ? { advertisements } : {}),
  items,
});

export const makeForm = (id, title, parts) => ({
  id,
  title,
  module: "reading",
  level: "B1",
  formatReference: "goethe-b1",
  durationSeconds: 3900,
  sourceType: "original-curated",
  parts,
});
