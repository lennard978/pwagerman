import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { FaVolumeUp } from "react-icons/fa";
import { useLanguage } from "../../i18n/LanguageProvider";
import { theme } from "../../styles/theme";
import { EmptyExercise } from "../../components/EmptyExercise";
import { WordStatusActions } from "../../components/WordStatusActions";
import { useProgress } from "../../i18n/ProgressProvider";
import { CompactSoundButton } from "../../components/CompactSoundButton";
import { createBoundedRound, EXERCISE_ROUND_LIMITS } from "../../data/exerciseRounds";
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
import { TARGET_LANGUAGE, TARGET_LANGUAGE_NAME } from "../../config/course";
import { getContentPosition, resolveContentByRouteId } from "../../data/contentSelection";
import { useMyWords } from "../../i18n/MyWordsProvider";

const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);

export const createQuizRound = (items) => {
  const questions = createBoundedRound(items, EXERCISE_ROUND_LIMITS.quiz);
  return questions.map((question) => {
    const distractors = shuffle(items.filter((item) => item.id !== question.id))
      .filter((item) => item.target !== question.target && item.source !== question.source)
      .filter((item, index, candidates) => candidates.findIndex((candidate) =>
        candidate.target.toLocaleLowerCase("de-DE") === item.target.toLocaleLowerCase("de-DE")
      ) === index)
      .map((item) => ({
        item,
        relevance: Number(item.partOfSpeech === question.partOfSpeech) * 2 +
          Number(item.categoryId === question.categoryId),
      }))
      .sort((left, right) => right.relevance - left.relevance)
      .slice(0, 3);
    return {
      ...question,
      choices: shuffle([question, ...distractors.map(({ item }) => item)]).map((item) => ({
        id: item.id,
        target: item.target,
      })),
    };
  });
};

export const Quiz = ({ data }) => {
  const { lessonId, userId } = useParams();
  const routeId = lessonId || userId;
  const { t } = useLanguage();
  const progress = useProgress();
  const { recordVocabularyAnswer } = useMyWords();
  const lesson = resolveContentByRouteId(data, routeId);
  const number = getContentPosition(data, lesson);
  const items = lesson.items;
  const [round, setRound] = useState(() => createQuizRound(items));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [complete, setComplete] = useState(false);
  const question = round[questionIndex];

  const answer = (choice) => {
    if (selected) return;
    setSelected(choice);
    const correct = choice.id === question.id;
    if (correct) {
      setScore((currentScore) => currentScore + 1);
    }
    progress?.recordAnswer(question, correct);
    recordVocabularyAnswer(question, correct);
    setAnswers((currentAnswers) => [...currentAnswers, {
      prompt: question.source,
      answer: choice.target,
      correctAnswer: question.target,
      correct,
      word: question,
    }]);
  };

  const nextQuestion = () => {
    if (questionIndex === round.length - 1) {
      setComplete(true);
      progress?.recordCompletion({
        type: "quiz",
        categoryId: lesson.id,
        route: `/practice/quiz/${lesson.id}`,
        titleKey: lesson.titleKey,
      });
      return;
    }
    setQuestionIndex((currentIndex) => currentIndex + 1);
    setSelected(null);
  };

  const restart = () => {
    setRound(createQuizRound(items));
    setQuestionIndex(0);
    setSelected(null);
    setScore(0);
    setAnswers([]);
    setComplete(false);
  };

  return (
    <PracticeLayout title={`${t("navigation.quiz")} ${number}`}>
      {complete ? (
        <ResultCard data-testid="quiz-result-card">
          <ResultTitle>{t("exercise.quizComplete")}</ResultTitle>
          <Score>{score} / {round.length} {t("exercise.score")}</Score>
          <Review>
            <ReviewTitle>{t("exercise.answerReview")}</ReviewTitle>
            {answers.map((answer, index) => (
              <ReviewItem data-status={answer.correct ? "correct" : "incorrect"} $correct={answer.correct} key={`${answer.prompt}-${index}`}>
                <ReviewPrompt>{answer.prompt}</ReviewPrompt>
                <ReviewDetail $correct={answer.correct}>
                  {t("exercise.yourAnswer")}: {answer.answer}
                </ReviewDetail>
                <CorrectAnswer>{t("exercise.correctAnswer")}: {answer.correctAnswer}</CorrectAnswer>
                <WordStatusActions word={answer.word} />
              </ReviewItem>
            ))}
          </Review>
          <PrimaryButton type="button" onClick={restart}>
            {lesson.id === "learning" && items.length > round.length ? "Continue learning" : t("exercise.restartQuiz")}
          </PrimaryButton>
          <BackLink to={lesson.id === "learning" ? "/practice/learning" : "/practice/quiz"}>
            {lesson.id === "learning" ? "Learning practice" : t("actions.backToQuiz")}
          </BackLink>
        </ResultCard>
      ) : (
        round.length === 0 ? <EmptyExercise message={t("myWords.minimum")} /> : (
        <Content data-testid="quiz-exercise-content">
          <Progress>{t("exercise.question")} {questionIndex + 1} / {round.length}</Progress>
          <Prompt>{question.source}</Prompt>
          <Instruction>{t("exercise.chooseTranslation")}</Instruction>
          <Choices>
            {question.choices.map((choice) => {
              const isCorrect = selected && choice.id === question.id;
              const isWrong = selected?.id === choice.id && !isCorrect;
              return (
                <ChoiceRow key={choice.id || choice.target}>
                  <Choice
                    type="button"
                    disabled={Boolean(selected)}
                    data-status={isCorrect ? "correct" : isWrong ? "incorrect" : undefined}
                    $correct={isCorrect}
                    $wrong={isWrong}
                    onClick={() => answer(choice)}
                  >
                    {choice.target}
                  </Choice>
                  <CompactSoundButton
                    text={choice.target}
                    lang={TARGET_LANGUAGE}
                    ariaLabel={`Hear ${TARGET_LANGUAGE_NAME} pronunciation: ${choice.target}`}
                  >
                    <FaVolumeUp aria-hidden="true" />
                  </CompactSoundButton>
                </ChoiceRow>
              );
            })}
          </Choices>
          {selected && (
            <PrimaryButton type="button" onClick={nextQuestion}>
              {t("actions.next")}
            </PrimaryButton>
          )}
        </Content>
        )
      )}
    </PracticeLayout>
  );
};

const Content = styled(PracticeStage)``;
const Progress = styled(PracticeProgress)``;
const Prompt = styled(PracticePrompt)``;

const Instruction = styled.p`
  margin: 0;
  color: ${theme.colors.textMuted};
  text-align: center;
`;

const Choices = styled(PracticeChoices)``;
const ChoiceRow = styled(PracticeChoiceRow)``;
const Choice = styled(PracticeAnswerButton)``;
const ResultCard = styled(PracticeResultCard)``;

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

const Review = styled(PracticeReviewList)``;

const ReviewTitle = styled.h3`
  margin: 0 0 0.75rem;
  color: ${theme.colors.text};
`;

const ReviewItem = styled(PracticeReviewItem)``;

const ReviewPrompt = styled.p`
  margin: 0 0 0.4rem;
  color: ${theme.colors.text};
  font-weight: 700;
`;

const ReviewDetail = styled.p`
  margin: 0.2rem 0;
  color: ${(props) => props.$correct ? theme.colors.success : theme.colors.error};
`;

const CorrectAnswer = styled.p`
  margin: 0.2rem 0;
  color: ${theme.colors.success};
`;

const PrimaryButton = styled(PracticePrimaryButton)``;

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
