import { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSpeechSynthesis } from "react-speech-kit";
import styled from "styled-components";
import { useLanguage } from "../../i18n/LanguageProvider";
import { theme } from "../../styles/theme";
import { EmptyExercise } from "../../components/EmptyExercise";
import { speak } from "../../services/tts/ttsProvider";
import { useProgress } from "../../i18n/ProgressProvider";
import { createBoundedRound, EXERCISE_ROUND_LIMITS } from "../../data/exerciseRounds";
import {
  PracticeActionArea,
  PracticeLayout,
  PracticePrimaryButton,
  PracticeStage,
} from "../../components/practice/PracticeLayout";

export const Write = ({ data }) => {
  const { userId } = useParams();
  const number = Number(userId);
  const { t } = useLanguage();
  const { speak: browserSpeak, voices } = useSpeechSynthesis();
  const progress = useProgress();
  const lesson = data[userId];

  //Collect Data
  const [wordList] = useState(() =>
    createBoundedRound(data[userId].items, EXERCISE_ROUND_LIMITS.write)
  );

  const [resultState, setResultState] = useState("idle");
  const hasSpokenAnswer = useRef(false);

  //Update wordList count
  let [count, setCount] = useState(0);

  const [sourceWord, setSourceWord] = useState(wordList[0]?.source || "");

  const createTokens = (value) => value.split("").map((char, index) => (
    char === " "
      ? { id: `space-${index}`, type: "space", char }
      : { id: `${char}-${index}-${Math.random()}`, type: "letter", char }
  ));
  const shuffle = (v) => [...v].sort(() => Math.random() - 0.5);
  const createShuffledTarget = (value) => {
    const tokens = createTokens(value);
    const letters = shuffle(tokens.filter((token) => token.type === "letter"));
    let letterIndex = 0;
    return tokens.map((token) => (
      token.type === "space" ? token : letters[letterIndex++]
    ));
  };
  const createAnswer = (value) => createTokens(value).map((token) => (
    token.type === "space" ? token : null
  ));
  const [shuffledTarget, setShuffledTarget] = useState([
    ...createShuffledTarget(wordList[0]?.target || ""),
  ]);

  const [targetAnswer, setTargetAnswer] = useState(
    createAnswer(wordList[0]?.target || "")
  );

  //Add one for removing array item
  const selectLetter = (tile) => {
    const slot = targetAnswer.findIndex((item) => item === null);
    if (slot === -1) return;
    const nextAnswer = [...targetAnswer];
    nextAnswer[slot] = tile;
    setTargetAnswer(nextAnswer);
    setShuffledTarget(shuffledTarget.filter((item) => item.id !== tile.id));
    const list = nextAnswer.map((item) => item?.char || "").join("");
    if (!nextAnswer.includes(null)) {
      if (wordList[count].target === list) {
        setResultState("correct");
        progress?.recordAnswer(wordList[count], true);
        if (!hasSpokenAnswer.current) {
          hasSpokenAnswer.current = true;
          speak({
            text: wordList[count].target,
            lang: "sr-RS",
            voices,
            browserSpeak,
          });
        }
      } else {
        setResultState("incorrect");
        progress?.recordAnswer(wordList[count], false);
      }
    }
  };
  const removeLetter = (slot) => {
    const tile = targetAnswer[slot];
    if (!tile) return;
    const nextAnswer = [...targetAnswer];
    nextAnswer[slot] = null;
    setTargetAnswer(nextAnswer);
    setShuffledTarget([...shuffledTarget, tile]);
    setResultState("idle");
  };
  const nextWord = () => {
    const nextCount = count + 1;
    setResultState("idle");
    hasSpokenAnswer.current = false;
    setCount(nextCount);
    setSourceWord(wordList[nextCount].source);
    setShuffledTarget(createShuffledTarget(wordList[nextCount].target));
    setTargetAnswer(createAnswer(wordList[nextCount].target));
  };

  return (
    <PracticeLayout title={`${t("navigation.write")} ${number + 1}`}>
      {wordList.length === 0 ? <EmptyExercise message={t("myWords.minimum")} /> : <>
      <WriteStage data-testid="write-exercise-content">
      <PromptRow>
        <H2>{sourceWord}</H2>
      </PromptRow>
      <TileRow>
        {targetAnswer.map((item, index) => {
          if (item?.type === "space") {
            return <Space key={item.id} data-testid="write-answer-space" aria-hidden="true" />;
          }
          return (
            <TargetLetter
              type="button"
              data-testid="write-letter-tile"
              $filled={Boolean(item)}
              $resultState={resultState}
              data-result-state={resultState}
              data-filled={Boolean(item)}
              data-tile-id={item?.id}
              onClick={() => removeLetter(index)}
              key={index}
            >
              {item?.char || "?"}
            </TargetLetter>
          );
        })}
      </TileRow>
      <TileRow>
        {shuffledTarget.map((item) => {
          if (item.type === "space") {
            return <Space key={item.id} data-testid="write-pool-space" aria-hidden="true" />;
          }
          return (
            <TargetLetter
              type="button"
              data-testid="write-letter-tile"
              data-filled={false}
              data-tile-id={item.id}
              onClick={() => selectLetter(item)}
              key={item.id}
            >
              {item.char}
            </TargetLetter>
          );
        })}
      </TileRow>
      {resultState !== "idle" && (
        <Feedback role="status" $correct={resultState === "correct"}>
          {resultState === "correct" ? t("exercise.correct") : t("exercise.incorrect")}
        </Feedback>
      )}
      {count === wordList.length - 1 ? (
        <PracticeActionArea>
          <BackLink
            to="/choosewrite"
            onClick={() => {
              if (resultState === "correct") {
                progress?.recordCompletion({
                  type: "write",
                  categoryId: lesson.id,
                  route: `/choosewrite/${userId}`,
                  titleKey: lesson.titleKey,
                });
              }
            }}
          >
            {t("actions.backToWrite")}
          </BackLink>
        </PracticeActionArea>
      ) : (
        <PracticeActionArea>
          <Button onClick={nextWord}>{t("actions.next")}</Button>
        </PracticeActionArea>
      )}
      </WriteStage>
      </>}
    </PracticeLayout>
  );
};

const WriteStage = styled(PracticeStage)`
  align-items: center;
  gap: clamp(0.85rem, 2.4vh, 1.35rem);
`;

const PromptRow = styled.div`
  display: flex;
  justify-content: center;
`;

const TileRow = styled.div`
  --write-tile-size: clamp(3rem, 15vw, 3.625rem);
  inline-size: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: clamp(0.25rem, 1.2vw, 0.45rem);
  margin-inline: auto;
  padding-inline: 0.25rem;
`;

const H2 = styled.h3`
  margin: 0 0 0.5rem;
  padding: 1rem 1.25rem;
  color: ${(props) => props.$filled ? "#ffffff" : theme.colors.textMuted};
  background: ${(props) => {
    if (props.$resultState === "correct") return theme.colors.success;
    if (props.$resultState === "incorrect") return theme.colors.error;
    return props.$filled ? theme.colors.primary : theme.colors.surface;
  }};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.medium};
  box-shadow: ${theme.shadow.soft};
  font-size: 1.2rem;
  text-align: center;
`;

const TargetLetter = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  inline-size: var(--write-tile-size);
  block-size: var(--write-tile-size);
  min-inline-size: var(--write-tile-size);
  min-block-size: var(--write-tile-size);
  color: ${(props) => props.$resultState !== "idle" && props.$filled ? "#ffffff" : theme.colors.text};
  padding: 0;
  border: 1px solid ${(props) => {
    if (props.$resultState === "correct" && props.$filled) return theme.colors.success;
    if (props.$resultState === "incorrect" && props.$filled) return theme.colors.error;
    return theme.colors.border;
  }};
  box-shadow: ${theme.shadow.soft};
  background: ${(props) => {
    if (props.$resultState === "correct" && props.$filled) return theme.colors.success;
    if (props.$resultState === "incorrect" && props.$filled) return theme.colors.error;
    return theme.colors.surface;
  }};
  border-radius: ${theme.radius.small};
  text-transform: none;
  font-size: clamp(1.15rem, 5vw, 1.4rem);
  font-weight: 700;
  text-shadow: ${(props) => props.$filled ? "0 1px 1px rgba(0, 0, 0, 0.2)" : "none"};
  overflow-wrap: anywhere;
  transition: color 180ms ease, background-color 180ms ease, border-color 180ms ease, transform 160ms ease;
  cursor: pointer;
  &:active {
    border-color: ${theme.colors.primary};
    background: ${theme.colors.primarySoft};
    transform: scale(0.96);
  }
`;

const Space = styled.span`
  flex: 0 0 clamp(0.65rem, 3vw, 1rem);
  min-block-size: var(--write-tile-size);
`;

const Feedback = styled.p`
  align-self: center;
  margin: 0.5rem 0 0;
  padding: 0.5rem 0.9rem;
  color: ${(props) => props.$correct ? theme.colors.success : theme.colors.error};
  background: ${(props) => props.$correct ? theme.colors.successSoft : theme.colors.errorSoft};
  border: 1px solid ${(props) => props.$correct ? theme.colors.success : theme.colors.error};
  border-radius: ${theme.radius.pill};
  font-weight: 800;
`;

const Button = styled(PracticePrimaryButton)`
  text-transform: none;
  font-size: 0.95rem;
  box-shadow: ${theme.shadow.soft};
  min-inline-size: 5rem;
`;

const BackLink = styled(Link)`
  min-block-size: 2.75rem;
  display: inline-flex;
  align-items: center;
  padding-inline: 1.5rem;
  color: white;
  background: ${theme.colors.primary};
  border-radius: ${theme.radius.small};
  text-decoration: none;
  font-weight: 700;
`;
