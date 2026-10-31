import { useMemo, useState } from "react";
import styled from "styled-components";
import { FaVolumeUp } from "react-icons/fa";
import { useLanguage } from "../../i18n/LanguageProvider";
import { useMyWords } from "../../i18n/MyWordsProvider";
import { useProgress } from "../../i18n/ProgressProvider";
import { EmptyExercise } from "../../components/EmptyExercise";
import { WordStatusActions } from "../../components/WordStatusActions";
import { theme } from "../../styles/theme";
import { CompactSoundButton } from "../../components/CompactSoundButton";
import {
  PracticeLayout,
  PracticePrimaryButton,
  PracticeSurface,
} from "../../components/practice/PracticeLayout";
import { TARGET_LANGUAGE, TARGET_LANGUAGE_NAME } from "../../config/course";
import { formatLexemeTarget, getLexemeMetadata, getLexemeSpeechText } from "../../data/vocabulary/presentation";

export const REVIEW_SESSION_LIMIT = 20;
export const createReviewSession = (candidates, offset = 0) => {
  if (candidates.length <= REVIEW_SESSION_LIMIT) return candidates;
  return Array.from({ length: REVIEW_SESSION_LIMIT }, (_, itemIndex) =>
    candidates[(offset + itemIndex) % candidates.length]
  );
};

export const Review = () => {
  const { t } = useLanguage();
  const { allWords, recordVocabularyAnswer } = useMyWords();
  const { progress, recordAnswer, recordCompletion } = useProgress();
  const [source, setSource] = useState("mistakes");
  const [index, setIndex] = useState(0);
  const [offset, setOffset] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);

  const candidates = useMemo(() => {
    if (source === "mistakes") return progress.recentMistakes.map((item) => item.word);
    if (source === "favorites") return allWords.filter((word) => word.favorite);
    if (source === "known") return allWords.filter((word) => word.status === "known");
    return allWords.filter((word) => word.status === "learning");
  }, [allWords, progress.recentMistakes, source]);
  const items = useMemo(() => createReviewSession(candidates, offset), [candidates, offset]);
  const word = items[index % Math.max(items.length, 1)];

  const grade = (correct) => {
    recordAnswer(word, correct);
    recordVocabularyAnswer(word, correct);
    if (index === items.length - 1) {
      recordCompletion({ type: "review", categoryId: source, route: "/practice/review" });
      setSessionComplete(true);
    } else {
      setIndex((value) => value + 1);
    }
    setRevealed(false);
  };

  const changeSource = (next) => {
    setSource(next);
    setIndex(0);
    setOffset(0);
    setRevealed(false);
    setSessionComplete(false);
  };

  const continueReview = () => {
    setOffset((value) => candidates.length ? (value + REVIEW_SESSION_LIMIT) % candidates.length : 0);
    setIndex(0);
    setRevealed(false);
    setSessionComplete(false);
  };

  return (
    <PracticeLayout title={t("navigation.review")}>
      <Description data-testid="review-exercise-content">
        {t("review.description")}
      </Description>
      <Sources>
        {["mistakes", "favorites", "learning", "known"].map((name) => (
          <SourceButton key={name} type="button" $active={source === name} onClick={() => changeSource(name)}>
            {t(`review.${name}`)}
          </SourceButton>
        ))}
      </Sources>
      {items.length === 0 ? (
        <EmptyExercise message={t(`review.empty.${source}`)} />
      ) : sessionComplete ? (
        <Card>
          <Answer>Review session complete</Answer>
          <Metadata>{items.length} words reviewed in this bounded session.</Metadata>
          <Primary type="button" onClick={continueReview}>Continue review</Primary>
        </Card>
      ) : (
        <Card>
          <Progress>{index + 1} / {items.length}</Progress>
          <Prompt>{word.source}</Prompt>
          {!revealed ? (
            <Primary type="button" onClick={() => setRevealed(true)}>{t("review.reveal")}</Primary>
          ) : (
            <>
              <Answer>{formatLexemeTarget(word)}</Answer>
              {getLexemeMetadata(word).slice(0, 2).map((line) => <Metadata key={line}>{line}</Metadata>)}
              <CompactSoundButton text={getLexemeSpeechText(word)} lang={TARGET_LANGUAGE} ariaLabel={`Hear ${TARGET_LANGUAGE_NAME} pronunciation: ${formatLexemeTarget(word)}`}>
                <FaVolumeUp aria-hidden="true" />
              </CompactSoundButton>
              <WordStatusActions word={word} />
              <Grade>
                <Wrong type="button" onClick={() => grade(false)}>{t("review.again")}</Wrong>
                <Correct type="button" onClick={() => grade(true)}>{t("review.gotIt")}</Correct>
              </Grade>
            </>
          )}
        </Card>
      )}
    </PracticeLayout>
  );
};

const Description = styled.p`margin: 0 0 1rem; color: ${theme.colors.textMuted};`;
const Sources = styled.div`display: flex; gap: 0.4rem; overflow-x: auto; padding-bottom: 0.3rem;`;
const SourceButton = styled.button`flex: 0 0 auto; min-block-size: 2.75rem; padding-inline: 0.9rem; color: ${(p) => p.$active ? "white" : theme.colors.textMuted}; background: ${(p) => p.$active ? theme.colors.navy : theme.colors.surface}; border: 1px solid ${(p) => p.$active ? theme.colors.navy : theme.colors.border}; border-radius: ${theme.radius.pill}; font-weight: 700;`;
const Card = styled(PracticeSurface)`display: grid; justify-items: center; gap: 1rem; margin-top: 1rem; padding: 1.5rem 1rem; text-align: center;`;
const Progress = styled.p`justify-self: start; margin: 0; color: ${theme.colors.textMuted}; font-size: 0.8rem;`;
const Prompt = styled.h2`margin: 1rem 0; color: ${theme.colors.navy}; font-size: clamp(1.5rem, 7vw, 2.2rem);`;
const Answer = styled.p`margin: 0; color: ${theme.colors.primary}; font-size: 1.5rem; font-weight: 800;`;
const Metadata = styled.p`margin: -0.35rem 0 0; color: ${theme.colors.textMuted}; font-size: 0.78rem;`;
const Primary = styled(PracticePrimaryButton)``;
const Grade = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; inline-size: 100%;`;
const Wrong = styled.button`min-block-size: 2.75rem; color: ${theme.colors.error}; background: ${theme.colors.errorSoft}; border: 1px solid ${theme.colors.error}; border-radius: ${theme.radius.small}; font-weight: 700;`;
const Correct = styled.button`min-block-size: 2.75rem; color: ${theme.colors.success}; background: ${theme.colors.successSoft}; border: 1px solid ${theme.colors.success}; border-radius: ${theme.radius.small}; font-weight: 700;`;
