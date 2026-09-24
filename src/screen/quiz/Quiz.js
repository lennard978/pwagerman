import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { FaVolumeUp } from "react-icons/fa";
import { Title } from "../../components/Title";
import { useLanguage } from "../../i18n/LanguageProvider";
import { theme } from "../../styles/theme";
import { EmptyExercise } from "../../components/EmptyExercise";
import { WordStatusActions } from "../../components/WordStatusActions";
import { useProgress } from "../../i18n/ProgressProvider";
import { CompactSoundButton } from "../../components/CompactSoundButton";
import { createBoundedRound, EXERCISE_ROUND_LIMITS } from "../../data/exerciseRounds";

const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);

const createRound = (items) => {
  const questions = createBoundedRound(items, EXERCISE_ROUND_LIMITS.quiz);
  return questions.map((question) => {
    const distractors = shuffle(
      items.filter((item) => item.target !== question.target)
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
  const progress = useProgress();
  const lesson = data[userId];
  const items = data[userId].items;
  const [round, setRound] = useState(() => createRound(items));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [complete, setComplete] = useState(false);
  const question = round[questionIndex];

  const answer = (choice) => {
    if (selected) return;
    setSelected(choice);
    if (choice === question.target) {
      setScore((currentScore) => currentScore + 1);
    }
    progress?.recordAnswer(question, choice === question.target);
    setAnswers((currentAnswers) => [...currentAnswers, {
      prompt: question.source,
      answer: choice,
      correctAnswer: question.target,
      correct: choice === question.target,
      word: question,
    }]);
  };

  const nextQuestion = () => {
    if (questionIndex === round.length - 1) {
      setComplete(true);
      progress?.recordCompletion({
        type: "quiz",
        categoryId: lesson.id,
        route: `/choosequiz/${userId}`,
        titleKey: lesson.titleKey,
      });
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
    setAnswers([]);
    setComplete(false);
  };

  return (
    <Wrapper>
      <Title title={`${t("navigation.quiz")} ${Number(userId) + 1}`} />
      {complete ? (
        <ResultCard>
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
                <ChoiceRow key={choice}>
                  <Choice
                    type="button"
                    disabled={Boolean(selected)}
                    data-status={isCorrect ? "correct" : isWrong ? "incorrect" : undefined}
                    $correct={isCorrect}
                    $wrong={isWrong}
                    onClick={() => answer(choice)}
                  >
                    {choice}
                  </Choice>
                  <CompactSoundButton
                    text={choice}
                    lang="sr-RS"
                    ariaLabel={`Hear Serbian pronunciation: ${choice}`}
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
    </Wrapper>
  );
};

const Wrapper = styled.div`
  inline-size: min(100%, 42rem);
  min-block-size: 100vh;
  padding: 0.75rem 1rem 7rem;
`;

const Content = styled.div`
  min-block-size: calc(100vh - 8.75rem);
  position: relative;
  inset-block-start: -0.7rem;
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

const Prompt = styled.h2`
  margin: 0.75rem 0;
  color: ${theme.colors.text};
  font-size: clamp(1.35rem, 6vw, 1.9rem);
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

const ChoiceRow = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Choice = styled.button`
  flex: 1;
  min-block-size: 2.75rem;
  padding: 0.7rem 1rem;
  color: ${(props) => (props.$correct ? theme.colors.success : props.$wrong ? theme.colors.error : theme.colors.text)};
  background: ${(props) => (props.$correct ? theme.colors.successSoft : props.$wrong ? theme.colors.errorSoft : theme.colors.surface)};
  border: 1px solid ${(props) => (props.$correct ? theme.colors.success : props.$wrong ? theme.colors.error : theme.colors.border)};
  border-radius: ${theme.radius.small};
  box-shadow: ${theme.shadow.soft};
  font-weight: 600;
  cursor: pointer;
  transition: color 180ms ease, background-color 180ms ease, border-color 180ms ease, transform 160ms ease;
  &:active { transform: scale(0.985); }
  &:focus-visible {
    outline: 3px solid ${theme.colors.primarySoft};
    outline-offset: 2px;
  }
`;

const ResultCard = styled.div`
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

const Review = styled.div`
  inline-size: 100%;
  text-align: left;
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

const PrimaryButton = styled.button`
  min-block-size: 2.75rem;
  padding-inline: 1.5rem;
  color: white;
  background: ${theme.colors.primary};
  border: 1px solid ${theme.colors.primary};
  border-radius: ${theme.radius.small};
  font-weight: 700;
  cursor: pointer;
  transition: transform 160ms ease, background-color 180ms ease;
  &:active { background: ${theme.colors.primaryPressed}; transform: scale(0.98); }
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
