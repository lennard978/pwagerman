import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { Title } from "../../components/Title";
import { useLanguage } from "../../i18n/LanguageProvider";
import { theme } from "../../styles/theme";

export const Test = ({ data }) => {
  const { userId } = useParams();
  const { t } = useLanguage();
  const questions = data[userId];
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [complete, setComplete] = useState(false);
  const [option, setOption] = useState(() => shuffleOptions(questions[0].options));
  const question = questions[currentQuestion];

  const chooseAnswer = (answer) => {
    setCurrentAnswer(answer);
  };

  const nextQuestion = () => {
    const record = {
      prompt: question.prompt,
      answer: currentAnswer,
      correctAnswer: question.answer,
      correct: currentAnswer === question.answer,
    };
    const nextAnswers = [...answers, record];
    setAnswers(nextAnswers);

    if (currentQuestion === questions.length - 1) {
      setComplete(true);
      return;
    }

    const nextIndex = currentQuestion + 1;
    setCurrentQuestion(nextIndex);
    setCurrentAnswer("");
    setOption(shuffleOptions(questions[nextIndex].options));
  };

  const retry = () => {
    setCurrentQuestion(0);
    setCurrentAnswer("");
    setAnswers([]);
    setComplete(false);
    setOption(shuffleOptions(questions[0].options));
  };

  const score = answers.filter((answer) => answer.correct).length;
  const mistakes = answers.filter((answer) => !answer.correct);

  return (
    <Wrapper>
      <Title title={`${t("navigation.test")} ${Number(userId) + 1}`} />
      {complete ? (
        <ResultCard>
          <ResultTitle>{t("exercise.testComplete")}</ResultTitle>
          <Score>{score} / {questions.length} {t("exercise.score")}</Score>
          {mistakes.length === 0 ? (
            <Perfect>{t("exercise.perfect")}</Perfect>
          ) : (
            <Review>
              <ReviewTitle>{t("exercise.reviewMistakes")}</ReviewTitle>
              {mistakes.map((mistake, index) => (
                <Mistake key={`${mistake.prompt}-${index}`}>
                  <Prompt>{mistake.prompt}</Prompt>
                  <Detail>{t("exercise.yourAnswer")}: {mistake.answer}</Detail>
                  <Correct>{t("exercise.correctAnswer")}: {mistake.correctAnswer}</Correct>
                </Mistake>
              ))}
            </Review>
          )}
          <PrimaryButton type="button" onClick={retry}>{t("exercise.retryTest")}</PrimaryButton>
          <BackLink to="/choosetest">{t("exercise.backToTests")}</BackLink>
        </ResultCard>
      ) : (
        <Content data-testid="test-exercise-content">
          <Progress>{t("exercise.question")}: {currentQuestion + 1} / {questions.length}</Progress>
          <Question>{question.prompt}</Question>
          <Choices>
            {option.map((item) => (
              <Answer
                key={item}
                type="button"
                $selected={currentAnswer === item}
                onClick={() => chooseAnswer(item)}
              >
                {item}
              </Answer>
            ))}
          </Choices>
          <PrimaryButton type="button" disabled={!currentAnswer} onClick={nextQuestion}>
            {t("actions.next")}
          </PrimaryButton>
        </Content>
      )}
    </Wrapper>
  );
};

const shuffleOptions = (options) => [...options].sort(() => 0.5 - Math.random());

const Wrapper = styled.div`
  inline-size: min(100%, 42rem);
  min-block-size: 100vh;
  padding: 0.75rem 1rem 7rem;
`;

const Content = styled.div`
  min-block-size: calc(100vh - 8.75rem);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  gap: 0.9rem;

  @media (max-height: 600px) {
    justify-content: flex-start;
    padding-top: 1rem;
  }
`;

const Progress = styled.p`
  margin: 0;
  color: ${theme.colors.textMuted};
`;

const Question = styled.h2`
  margin: 0.75rem 0;
  color: ${theme.colors.text};
  font-size: clamp(1.35rem, 6vw, 1.9rem);
  text-align: center;
`;

const Choices = styled.div`
  display: grid;
  gap: 0.6rem;
`;

const Answer = styled.button`
  min-block-size: 2.75rem;
  padding: 0.7rem 1rem;
  color: ${theme.colors.text};
  background: ${(props) => (props.$selected ? theme.colors.primarySoft : theme.colors.surface)};
  border: 1px solid ${(props) => (props.$selected ? theme.colors.primary : theme.colors.border)};
  border-radius: ${theme.radius.small};
  box-shadow: ${theme.shadow.soft};
  font-weight: 600;
  cursor: pointer;
  &:focus-visible { outline: 3px solid ${theme.colors.primarySoft}; }
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
  &:disabled { opacity: 0.45; cursor: not-allowed; }
  &:active { background: ${theme.colors.primaryPressed}; }
`;

const ResultCard = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
  padding: 1.5rem 1rem;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.large};
  box-shadow: ${theme.shadow.soft};
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

const Perfect = styled.p`
  margin: 0;
  color: ${theme.colors.success};
  font-weight: 700;
`;

const Review = styled.div`
  inline-size: 100%;
`;

const ReviewTitle = styled.h3`
  margin: 0 0 0.75rem;
  color: ${theme.colors.text};
`;

const Mistake = styled.div`
  margin-top: 0.65rem;
  padding: 0.8rem;
  background: ${theme.colors.errorSoft};
  border: 1px solid #fecdca;
  border-radius: ${theme.radius.small};
`;

const Prompt = styled.p`
  margin: 0 0 0.4rem;
  color: ${theme.colors.text};
  font-weight: 700;
`;

const Detail = styled.p`
  margin: 0.2rem 0;
  color: ${theme.colors.error};
`;

const Correct = styled.p`
  margin: 0.2rem 0;
  color: ${theme.colors.success};
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
