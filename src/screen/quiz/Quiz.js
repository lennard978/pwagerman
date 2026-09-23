import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { Title } from "../../components/Title";
import { useLanguage } from "../../i18n/LanguageProvider";
import { theme } from "../../styles/theme";
import { EmptyExercise } from "../../components/EmptyExercise";

const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);

const createRound = (items) => {
  const questions = shuffle(items).slice(0, Math.min(10, items.length));
  return questions.map((question) => {
    const distractors = shuffle(
      items.filter((item) => item.source !== question.source)
    )
      .slice(0, 3)
      .map((item) => item.target);
    return {
      ...question,
      choices: shuffle([question.target, ...distractors]),
    };
  });
};

export const Quiz = ({ data }) => {
  const { userId } = useParams();
  const { t } = useLanguage();
  const items = data[userId].items;
  const [round, setRound] = useState(() => createRound(items));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [complete, setComplete] = useState(false);
  const question = round[questionIndex];

  const answer = (choice) => {
    if (selected) return;
    setSelected(choice);
    if (choice === question.target) {
      setScore((currentScore) => currentScore + 1);
    }
  };

  const nextQuestion = () => {
    if (questionIndex === round.length - 1) {
      setComplete(true);
      return;
    }
    setQuestionIndex((currentIndex) => currentIndex + 1);
    setSelected(null);
  };

  const restart = () => {
    setRound(createRound(items));
    setQuestionIndex(0);
    setSelected(null);
    setScore(0);
    setComplete(false);
  };

  return (
    <Wrapper>
      <Title title={`${t("navigation.quiz")} ${Number(userId) + 1}`} />
      {complete ? (
        <ResultCard>
          <ResultTitle>{t("exercise.quizComplete")}</ResultTitle>
          <Score>{score} / {round.length} {t("exercise.score")}</Score>
          <PrimaryButton type="button" onClick={restart}>
            {t("exercise.restartQuiz")}
          </PrimaryButton>
          <BackLink to="/choosequiz">{t("actions.backToQuiz")}</BackLink>
        </ResultCard>
      ) : (
        round.length === 0 ? <EmptyExercise message={t("myWords.minimum")} /> : (
        <Content>
          <Progress>{t("exercise.question")} {questionIndex + 1} / {round.length}</Progress>
          <Prompt>{question.source}</Prompt>
          <Instruction>{t("exercise.chooseTranslation")}</Instruction>
          <Choices>
            {question.choices.map((choice) => {
              const isCorrect = selected && choice === question.target;
              const isWrong = selected === choice && !isCorrect;
              return (
                <Choice
                  key={choice}
                  type="button"
                  disabled={Boolean(selected)}
                  $correct={isCorrect}
                  $wrong={isWrong}
                  onClick={() => answer(choice)}
                >
                  {choice}
                </Choice>
              );
            })}
          </Choices>
          {selected && (
            <Feedback $correct={selected === question.target}>
              {selected === question.target ? t("exercise.correct") : t("exercise.incorrect")}
            </Feedback>
          )}
          {selected && (
            <PrimaryButton type="button" onClick={nextQuestion}>
              {t("actions.next")}
            </PrimaryButton>
          )}
        </Content>
        )
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  inline-size: min(100%, 42rem);
  min-block-size: 100vh;
  padding: 0.75rem 1rem 7rem;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.75rem;
`;

const Progress = styled.p`
  margin: 0;
  color: ${theme.colors.textMuted};
  font-size: 0.9rem;
`;

const Prompt = styled.h2`
  margin: 1rem 0 0;
  color: ${theme.colors.text};
  font-size: clamp(1.6rem, 7vw, 2.2rem);
  text-align: center;
`;

const Instruction = styled.p`
  margin: 0;
  color: ${theme.colors.textMuted};
  text-align: center;
`;

const Choices = styled.div`
  display: grid;
  gap: 0.6rem;
`;

const Choice = styled.button`
  min-block-size: 2.75rem;
  padding: 0.7rem 1rem;
  color: ${(props) => (props.$correct ? theme.colors.success : props.$wrong ? theme.colors.error : theme.colors.text)};
  background: ${(props) => (props.$correct ? theme.colors.successSoft : props.$wrong ? theme.colors.errorSoft : theme.colors.surface)};
  border: 1px solid ${(props) => (props.$correct ? theme.colors.success : props.$wrong ? theme.colors.error : theme.colors.border)};
  border-radius: ${theme.radius.small};
  box-shadow: ${theme.shadow.soft};
  font-weight: 600;
  cursor: pointer;
  &:focus-visible {
    outline: 3px solid ${theme.colors.primarySoft};
    outline-offset: 2px;
  }
`;

const Feedback = styled.p`
  margin: 0;
  color: ${(props) => (props.$correct ? theme.colors.success : theme.colors.error)};
  font-weight: 700;
  text-align: center;
`;

const ResultCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 2rem 1.25rem;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.large};
  box-shadow: ${theme.shadow.soft};
  text-align: center;
`;

const ResultTitle = styled.h2`
  margin: 0;
  color: ${theme.colors.text};
`;

const Score = styled.p`
  margin: 0;
  color: ${theme.colors.primary};
  font-size: 1.3rem;
  font-weight: 700;
`;

const PrimaryButton = styled.button`
  min-block-size: 2.75rem;
  padding-inline: 1.5rem;
  color: white;
  background: ${theme.colors.primary};
  border: 1px solid ${theme.colors.primary};
  border-radius: ${theme.radius.small};
  font-weight: 700;
  cursor: pointer;
  &:active { background: ${theme.colors.primaryPressed}; }
`;

const BackLink = styled(Link)`
  min-block-size: 2.75rem;
  display: inline-flex;
  align-items: center;
  padding-inline: 1rem;
  color: ${theme.colors.text};
  background: ${theme.colors.surfaceMuted};
  border-radius: ${theme.radius.small};
  text-decoration: none;
  font-weight: 600;
`;
