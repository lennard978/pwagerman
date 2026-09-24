import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { FaVolumeUp } from "react-icons/fa";
import { useLanguage } from "../../i18n/LanguageProvider";
import { theme } from "../../styles/theme";
import { WordStatusActions } from "../../components/WordStatusActions";
import { useProgress } from "../../i18n/ProgressProvider";
import { CompactSoundButton } from "../../components/CompactSoundButton";
import {
  PracticeAnswerButton,
  PracticeChoiceRow,
  PracticeChoices,
  PracticeLayout,
  PracticePrimaryButton,
  PracticeProgress,
  PracticePrompt,
  PracticeResultCard,
  PracticeReviewItem,
  PracticeReviewList,
  PracticeStage,
} from "../../components/practice/PracticeLayout";

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
    <PracticeLayout title={`${t("navigation.test")} ${Number(userId) + 1}`}>
      {complete ? (
        <ResultCard data-testid="test-result-card">
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
                <CompactSoundButton
                  text={item}
                  lang="sr-RS"
                  ariaLabel={`Hear Serbian pronunciation: ${item}`}
                >
                  <FaVolumeUp aria-hidden="true" />
                </CompactSoundButton>
              </ChoiceRow>
            ))}
          </Choices>
          <PrimaryButton type="button" disabled={!currentAnswer} onClick={nextQuestion}>
            {t("actions.next")}
          </PrimaryButton>
        </Content>
      )}
    </PracticeLayout>
  );
};

const shuffleOptions = (options) => [...options].sort(() => 0.5 - Math.random());

const revealResult = keyframes`
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Content = styled(PracticeStage)``;
const Progress = styled(PracticeProgress)``;
const Question = styled(PracticePrompt)``;
const Choices = styled(PracticeChoices)``;
const ChoiceRow = styled(PracticeChoiceRow)``;
const Answer = styled(PracticeAnswerButton)``;
const PrimaryButton = styled(PracticePrimaryButton)``;

const ResultCard = styled(PracticeResultCard)`
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

const Review = styled(PracticeReviewList)``;

const ReviewTitle = styled.h3`
  margin: 0 0 0.75rem;
  color: ${theme.colors.text};
`;

const ReviewItem = styled(PracticeReviewItem)``;

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
