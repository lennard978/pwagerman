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

export const Review = () => {
  const { t } = useLanguage();
  const { allWords } = useMyWords();
  const { progress, recordAnswer, recordCompletion } = useProgress();
  const [source, setSource] = useState("mistakes");
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const items = useMemo(() => {
    if (source === "mistakes") return progress.recentMistakes.map((item) => item.word);
    if (source === "favorites") return allWords.filter((word) => word.favorite);
    if (source === "known") return allWords.filter((word) => word.status === "known");
    return allWords.filter((word) => word.status !== "known");
  }, [allWords, progress.recentMistakes, source]);
  const word = items[index % Math.max(items.length, 1)];

  const grade = (correct) => {
    recordAnswer(word, correct);
    if (index === items.length - 1) {
      recordCompletion({ type: "review", categoryId: source, route: "/review" });
    }
    setIndex((value) => (value + 1) % items.length);
    setRevealed(false);
  };

  const changeSource = (next) => {
    setSource(next);
    setIndex(0);
    setRevealed(false);
  };

  return (
    <Wrapper>
      <Heading>{t("navigation.review")}</Heading>
      <Description>{t("review.description")}</Description>
      <Sources>
        {["mistakes", "favorites", "learning", "known"].map((name) => (
          <SourceButton key={name} type="button" $active={source === name} onClick={() => changeSource(name)}>
            {t(`review.${name}`)}
          </SourceButton>
        ))}
      </Sources>
      {items.length === 0 ? (
        <EmptyExercise message={t(`review.empty.${source}`)} />
      ) : (
        <Card>
          <Progress>{index + 1} / {items.length}</Progress>
          <Prompt>{word.source}</Prompt>
          {!revealed ? (
            <Primary type="button" onClick={() => setRevealed(true)}>{t("review.reveal")}</Primary>
          ) : (
            <>
              <Answer>{word.target}</Answer>
              <CompactSoundButton text={word.target} lang="sr-RS" ariaLabel={`Hear Serbian pronunciation: ${word.target}`}>
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
    </Wrapper>
  );
};

const Wrapper = styled.main`inline-size: min(100%, 42rem); min-block-size: 100vh; padding: 1rem 1rem 7rem;`;
const Heading = styled.h1`margin: 0; color: ${theme.colors.text}; font-size: 1.8rem;`;
const Description = styled.p`margin: 0.4rem 0 1rem; color: ${theme.colors.textMuted};`;
const Sources = styled.div`display: flex; gap: 0.4rem; overflow-x: auto; padding-bottom: 0.3rem;`;
const SourceButton = styled.button`flex: 0 0 auto; min-block-size: 2.75rem; padding-inline: 0.9rem; color: ${(p) => p.$active ? "white" : theme.colors.textMuted}; background: ${(p) => p.$active ? theme.colors.navy : theme.colors.surface}; border: 1px solid ${(p) => p.$active ? theme.colors.navy : theme.colors.border}; border-radius: ${theme.radius.pill}; font-weight: 700;`;
const Card = styled.section`display: grid; justify-items: center; gap: 1rem; margin-top: 1rem; padding: 1.5rem 1rem; background: ${theme.colors.surface}; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.large}; box-shadow: ${theme.shadow.soft}; text-align: center;`;
const Progress = styled.p`justify-self: start; margin: 0; color: ${theme.colors.textMuted}; font-size: 0.8rem;`;
const Prompt = styled.h2`margin: 1rem 0; color: ${theme.colors.navy}; font-size: clamp(1.5rem, 7vw, 2.2rem);`;
const Answer = styled.p`margin: 0; color: ${theme.colors.primary}; font-size: 1.5rem; font-weight: 800;`;
const Primary = styled.button`min-block-size: 2.75rem; padding-inline: 1.5rem; color: white; background: ${theme.colors.primary}; border: 0; border-radius: ${theme.radius.small}; font-weight: 700;`;
const Grade = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; inline-size: 100%;`;
const Wrong = styled.button`min-block-size: 2.75rem; color: ${theme.colors.error}; background: ${theme.colors.errorSoft}; border: 1px solid ${theme.colors.error}; border-radius: ${theme.radius.small}; font-weight: 700;`;
const Correct = styled.button`min-block-size: 2.75rem; color: ${theme.colors.success}; background: ${theme.colors.successSoft}; border: 1px solid ${theme.colors.success}; border-radius: ${theme.radius.small}; font-weight: 700;`;
