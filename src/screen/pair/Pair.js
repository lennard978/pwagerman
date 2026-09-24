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

export const Pair = ({ data }) => {
  const { userId } = useParams();
  const number = Number(userId);
  const { t } = useLanguage();
  const progress = useProgress();
  const lesson = data[userId];

  const wordList = data[userId].items;
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
        route: `/choosepair/${userId}`,
        titleKey: lesson.titleKey,
      });
    }
  }, [lesson.id, lesson.titleKey, progress, roundItems.length, source.length, userId]);

  const checkCorrect = (sourceItem, targetItem) => {
    if (sourceItem.source === targetItem.source) {
      setSource(source.filter((item) => item !== sourceItem));
      setTarget(target.filter((item) => item !== targetItem));
      setSelectedSource(null);
      setSelectedTarget(null);
      setWrongPair(false);
    } else {
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

  const sourceList = source.map((item, index) => {
    return (
      <PairButton
        onClick={() => checkSource(item)}
        $selected={selectedSource === item}
        $wrong={wrongPair && selectedSource === item}
        key={index}
      >
        {item.source}
      </PairButton>
    );
  });
  const targetList = target.map((item, index) => {
    return (
      <PairButton
        onClick={() => checkTarget(item)}
        $selected={selectedTarget === item}
        $wrong={wrongPair && selectedTarget === item}
        key={index}
      >
        {item.target}
      </PairButton>
    );
  });

  return (
    <PracticeLayout title={`${t("navigation.pair")} ${number + 1}`}>
      {roundItems.length < 2 ? <EmptyExercise message={t("myWords.minimum")} /> : <>
        {source.length === 0 ? (
          <Completion>
            <CompletionTitle>{t("exercise.pairComplete")}</CompletionTitle>
            <BackLink to="/choosepair">{t("actions.backToPair")}</BackLink>
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
