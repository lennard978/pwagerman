import { useState } from "react";
import styled from "styled-components";
import { useProgress } from "../../i18n/ProgressProvider";
import { theme } from "../../styles/theme";
import { ExamPrepResult } from "./ExamPrepResult";

export const ExamPrepSession = ({
  area,
  taskId,
  title,
  route,
  questions,
  introduction,
  resultContent,
}) => {
  const progress = useProgress();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [answers, setAnswers] = useState([]);
  const [complete, setComplete] = useState(false);
  const question = questions[currentIndex];

  const next = () => {
    const answer = {
      ...question,
      selected,
      correct: selected === question.answer,
    };
    const nextAnswers = [...answers, answer];
    setAnswers(nextAnswers);
    if (currentIndex === questions.length - 1) {
      setComplete(true);
      progress?.recordExamPrepCompletion({
        area,
        taskId,
        score: nextAnswers.filter(({ correct }) => correct).length,
        total: questions.length,
        route,
        title,
      });
      return;
    }
    setCurrentIndex((index) => index + 1);
    setSelected("");
  };

  const retry = () => {
    setCurrentIndex(0);
    setSelected("");
    setAnswers([]);
    setComplete(false);
  };

  if (complete) {
    return (
      <ExamPrepResult answers={answers} onRetry={retry}>
        {resultContent}
      </ExamPrepResult>
    );
  }

  return (
    <>
      {introduction}
      <QuestionCard>
        <ProgressText>Question {currentIndex + 1} of {questions.length}</ProgressText>
        <h2>{question.prompt}</h2>
        <Options>
          {question.options.map((option) => (
            <Option
              key={option}
              type="button"
              $selected={selected === option}
              aria-pressed={selected === option}
              onClick={() => setSelected(option)}
            >
              {option}
            </Option>
          ))}
        </Options>
        <NextButton type="button" disabled={!selected} onClick={next}>
          {currentIndex === questions.length - 1 ? "Show results" : "Next"}
        </NextButton>
      </QuestionCard>
    </>
  );
};

const QuestionCard = styled.section`
  display: grid;
  gap: 0.9rem;
  padding: 1rem;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.medium};
  box-shadow: ${theme.shadow.soft};

  & h2 {
    margin: 0;
    color: ${theme.colors.navy};
    font-size: clamp(1.15rem, 5vw, 1.45rem);
    line-height: 1.35;
  }
`;

const ProgressText = styled.p`
  margin: 0;
  color: ${theme.colors.primaryPressed};
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const Options = styled.div`
  display: grid;
  gap: 0.55rem;
`;

const Option = styled.button`
  min-block-size: 3rem;
  min-inline-size: 0;
  padding: 0.7rem 0.8rem;
  color: ${theme.colors.text};
  background: ${(props) =>
    props.$selected ? theme.colors.primarySoft : theme.colors.surface};
  border: 1px solid ${(props) =>
    props.$selected ? theme.colors.primary : theme.colors.border};
  border-radius: ${theme.radius.small};
  text-align: left;
  overflow-wrap: anywhere;
  font-weight: 700;
`;

const NextButton = styled.button`
  min-block-size: 2.85rem;
  justify-self: start;
  padding-inline: 1.2rem;
  color: white;
  background: ${theme.colors.primary};
  border: 1px solid ${theme.colors.primary};
  border-radius: ${theme.radius.small};
  font-weight: 800;

  &:disabled {
    opacity: 0.45;
  }
`;
