import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { FaVolumeUp } from "react-icons/fa";
import { Title } from "../../components/Title";
import SoundButton from "../../components/SoundButton";
import { useLanguage } from "../../i18n/LanguageProvider";
import { theme } from "../../styles/theme";
import { WordStatusActions } from "../../components/WordStatusActions";
import { useProgress } from "../../i18n/ProgressProvider";

export const Test = ({ data }) => {
  const { userId } = useParams();
  const { t } = useLanguage();
  const progress = useProgress();
  const testData = data[userId];
  const questions = testData.questions || testData;
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
      word: {
        id: question.wordId,
        source: question.source,
        target: question.target,
        status: question.status || "learning",
        favorite: question.favorite || false,
        kind: "built-in",
      },
    };
    const nextAnswers = [...answers, record];
    setAnswers(nextAnswers);
    progress?.recordAnswer(record.word, record.correct);

    if (currentQuestion === questions.length - 1) {
      setComplete(true);
      progress?.recordCompletion({
        type: "test",
        categoryId: testData.id || userId,
        route: `/choosetest/${userId}`,
        titleKey: testData.titleKey,
      });
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
          ) : null}
          <Review>
            <ReviewTitle>{t("exercise.answerReview")}</ReviewTitle>
            {answers.map((answer, index) => (
              <ReviewItem data-status={answer.correct ? "correct" : "incorrect"} $correct={answer.correct} key={`${answer.prompt}-${index}`}>
                <Prompt>{answer.prompt}</Prompt>
                <Detail $correct={answer.correct}>{t("exercise.yourAnswer")}: {answer.answer}</Detail>
                <Correct>{t("exercise.correctAnswer")}: {answer.correctAnswer}</Correct>
                <Status $correct={answer.correct}>
                  {answer.correct ? t("exercise.correct") : t("exercise.incorrect")}
                </Status>
                <WordStatusActions word={answer.word} />
              </ReviewItem>
            ))}
          </Review>
          <PrimaryButton type="button" onClick={retry}>{t("exercise.retryTest")}</PrimaryButton>
          <BackLink to="/choosetest">{t("exercise.backToTests")}</BackLink>
        </ResultCard>
      ) : (
        <Content data-testid="test-exercise-content">
          <Progress>{t("exercise.question")}: {currentQuestion + 1} / {questions.length}</Progress>
          <Question>{question.prompt}</Question>
          <Choices>
            {option.map((item) => (
              <ChoiceRow key={item}>
                <Answer
                  type="button"
                  $selected={currentAnswer === item}
                  onClick={() => chooseAnswer(item)}
                >
                  {item}
                </Answer>
                <Speaker
                  text={item}
                  lang="sr-RS"
                  ariaLabel={`Hear Serbian pronunciation: ${item}`}
                >
                  <FaVolumeUp aria-hidden="true" />
                </Speaker>
              </ChoiceRow>
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

const revealResult = keyframes`
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
`;

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

const ChoiceRow = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Answer = styled.button`
  flex: 1;
  min-block-size: 2.75rem;
  padding: 0.7rem 1rem;
  color: ${theme.colors.text};
  background: ${(props) => (props.$selected ? theme.colors.primarySoft : theme.colors.surface)};
  border: 1px solid ${(props) => (props.$selected ? theme.colors.primary : theme.colors.border)};
  border-radius: ${theme.radius.small};
  box-shadow: ${theme.shadow.soft};
  font-weight: 600;
  cursor: pointer;
  transition: color 180ms ease, background-color 180ms ease, border-color 180ms ease, transform 160ms ease;
  &:active { transform: scale(0.985); }
  &:focus-visible { outline: 3px solid ${theme.colors.primarySoft}; }
`;

const Speaker = styled(SoundButton)`
  flex: 0 0 2.75rem;
  display: inline-flex;
  inline-size: 2.75rem;
  min-block-size: 2.75rem;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.primary};
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.small};
  box-shadow: ${theme.shadow.soft};
  transition: transform 160ms ease, background-color 180ms ease;
  &:active { transform: scale(0.94); }
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
  transition: transform 160ms ease, background-color 180ms ease, opacity 180ms ease;
  &:disabled { opacity: 0.45; cursor: not-allowed; }
  &:active { background: ${theme.colors.primaryPressed}; transform: scale(0.98); }
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
  animation: ${revealResult} 220ms ease-out both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
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

const ReviewItem = styled.div`
  margin-top: 0.65rem;
  padding: 0.8rem;
  background: ${(props) => props.$correct ? theme.colors.successSoft : theme.colors.errorSoft};
  border: 1px solid ${(props) => props.$correct ? theme.colors.success : theme.colors.error};
  border-radius: ${theme.radius.small};
`;

const Prompt = styled.p`
  margin: 0 0 0.4rem;
  color: ${theme.colors.text};
  font-weight: 700;
`;

const Detail = styled.p`
  margin: 0.2rem 0;
  color: ${(props) => props.$correct ? theme.colors.success : theme.colors.error};
`;

const Correct = styled.p`
  margin: 0.2rem 0;
  color: ${theme.colors.success};
`;

const Status = styled.p`
  margin: 0.4rem 0 0;
  color: ${(props) => props.$correct ? theme.colors.success : theme.colors.error};
  font-weight: 700;
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
  transition: transform 160ms ease, background-color 180ms ease;
  &:active { transform: scale(0.98); }
`;
