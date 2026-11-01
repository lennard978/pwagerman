import { Link, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { Btn } from "../../components/style";
import { useLanguage } from "../../i18n/LanguageProvider";
import { theme } from "../../styles/theme";
import { EmptyExercise } from "../../components/EmptyExercise";
import { useProgress } from "../../i18n/ProgressProvider";
import { createBoundedRound, EXERCISE_ROUND_LIMITS } from "../../data/exerciseRounds";
import {
  PracticeLayout,
  practiceTokens,
} from "../../components/practice/PracticeLayout";
import { getContentPosition, resolveContentByRouteId } from "../../data/contentSelection";
import { useMyWords } from "../../i18n/MyWordsProvider";
import { CompactSoundButton } from "../../components/CompactSoundButton";
import { FaVolumeUp } from "react-icons/fa";
import { TARGET_LANGUAGE } from "../../config/course";
import { formatLexemeTarget, getLexemeSpeechText } from "../../data/vocabulary/presentation";

export const isCorrectLexemePair = (sourceItem, targetItem) =>
  sourceItem.id === targetItem.id;

export const Pair = ({ data }) => {
  const { lessonId, userId } = useParams();
  const routeId = lessonId || userId;
  const { t } = useLanguage();
  const progress = useProgress();
  const { recordVocabularyAnswer } = useMyWords();
  const lesson = resolveContentByRouteId(data, routeId);
  const number = getContentPosition(data, lesson);
  const wordList = lesson.items;
  const roundItems = createBoundedRound(wordList, EXERCISE_ROUND_LIMITS.pair);
  const [source, setSource] = useState(
    JSON.parse(JSON.stringify(roundItems)).sort(() => Math.random() - 0.5)
  );
  const [target, setTarget] = useState(
    JSON.parse(JSON.stringify(roundItems)).sort(() => Math.random() - 0.5)
  );

  const [selectedSource, setSelectedSource] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [wrongPair, setWrongPair] = useState(false);
  const completionRecorded = useRef(false);
  useEffect(() => {
    if (roundItems.length >= 2 && source.length === 0 && !completionRecorded.current) {
      completionRecorded.current = true;
      progress?.recordCompletion({
        type: "pair",
        categoryId: lesson.id,
        route: `/practice/pair/${lesson.id}`,
        titleKey: lesson.titleKey,
      });
    }
  }, [lesson.id, lesson.titleKey, progress, roundItems.length, source.length]);

  const checkCorrect = (sourceItem, targetItem) => {
    if (isCorrectLexemePair(sourceItem, targetItem)) {
      setSource(source.filter((item) => item.id !== sourceItem.id));
      setTarget(target.filter((item) => item.id !== targetItem.id));
      recordVocabularyAnswer(sourceItem, true);
      setSelectedSource(null);
      setSelectedTarget(null);
      setWrongPair(false);
    } else {
      recordVocabularyAnswer(sourceItem, false);
      setWrongPair(true);
    }
  };

  const checkSource = (item) => {
    setWrongPair(false);
    setSelectedSource(item);
    if (selectedTarget) checkCorrect(item, selectedTarget);
  };

  const checkTarget = (item) => {
    setWrongPair(false);
    setSelectedTarget(item);
    if (selectedSource) checkCorrect(selectedSource, item);
  };

  const sourceList = source.map((item) => {
    return (
      <PairButton
        onClick={() => checkSource(item)}
        $selected={selectedSource === item}
        $wrong={wrongPair && selectedSource === item}
        key={item.id}
      >
        {item.source}
      </PairButton>
    );
  });
  const targetList = target.map((item) => {
    return (
      <TargetCard key={item.id} $selected={selectedTarget === item} $wrong={wrongPair && selectedTarget === item}>
        <TargetMatchButton
          type="button"
          onClick={() => checkTarget(item)}
          aria-pressed={selectedTarget === item}
        >
          {formatLexemeTarget(item)}
        </TargetMatchButton>
        <CompactSoundButton
          text={getLexemeSpeechText(item)}
          lang={TARGET_LANGUAGE}
          ariaLabel={`Pronounce ${getLexemeSpeechText(item)}`}
        >
          <FaVolumeUp aria-hidden="true" />
        </CompactSoundButton>
      </TargetCard>
    );
  });

  return (
    <PracticeLayout title={`${t("navigation.pair")} ${number}`}>
      {roundItems.length < 2 ? <EmptyExercise message={t("myWords.minimum")} /> : <>
        {source.length === 0 ? (
          <Completion>
            <CompletionTitle>{t("exercise.pairComplete")}</CompletionTitle>
            <BackLink to={lesson.id === "learning" ? "/practice/learning" : "/practice/pair"}>
              {lesson.id === "learning" ? "Continue learning" : t("actions.backToPair")}
            </BackLink>
          </Completion>
        ) : (
          <Board data-testid="pair-board" data-short-height-fallback="scroll">
            <Row>{sourceList}</Row>
            <Row>{targetList}</Row>
          </Board>
        )}
      </>}
    </PracticeLayout>
  );
};

const Board = styled.div`
  flex: 1;
  min-block-size: 0;
  display: flex;
  align-items: center;
  gap: ${practiceTokens.sectionGap};

  @media (max-height: 42rem) {
    align-items: flex-start;
  }
`;

const Row = styled.div`
  flex: 1;
  display: grid;
  align-content: center;
  gap: clamp(0.5rem, 1.25vh, 0.8rem);
  min-inline-size: 0;
`;

const PairButton = styled(Btn)`
  margin: 0;
  min-block-size: 3rem;
  border-radius: ${theme.radius.small};
  box-shadow: ${theme.shadow.soft};
  border-color: ${(props) => (props.$wrong ? theme.colors.error : props.$selected ? theme.colors.primary : theme.colors.border)};
  background: ${(props) => (props.$wrong ? theme.colors.errorSoft : props.$selected ? theme.colors.primarySoft : theme.colors.surface)};
  transform: ${(props) => props.$selected ? "scale(0.98)" : "scale(1)"};
`;

const TargetCard = styled.div`
  min-inline-size: 0;
  min-block-size: 3rem;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: stretch;
  gap: 0.35rem;
  padding: 0.25rem;
  border: 1px solid ${(props) => (props.$wrong ? theme.colors.error : props.$selected ? theme.colors.primary : theme.colors.border)};
  border-radius: ${theme.radius.small};
  background: ${(props) => (props.$wrong ? theme.colors.errorSoft : props.$selected ? theme.colors.primarySoft : theme.colors.surface)};
  box-shadow: ${theme.shadow.soft};
  transform: ${(props) => props.$selected ? "scale(0.98)" : "scale(1)"};
`;

const TargetMatchButton = styled.button`
  min-inline-size: 0;
  min-block-size: 2.75rem;
  padding: 0.55rem 0.45rem;
  color: ${theme.colors.text};
  background: transparent;
  border: 0;
  border-radius: ${theme.radius.small};
  font: inherit;
  font-weight: 700;
  overflow-wrap: anywhere;
  cursor: pointer;
  &:focus-visible { outline: 3px solid ${theme.colors.primarySoft}; outline-offset: 1px; }
`;

const revealCompletion = keyframes`
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Completion = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  text-align: center;
  animation: ${revealCompletion} 220ms ease-out both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const CompletionTitle = styled.h2`
  margin: 0;
  color: ${theme.colors.success};
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
