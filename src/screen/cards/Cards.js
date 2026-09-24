import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSpeechSynthesis } from "react-speech-kit";
import { Title } from "../../components/Title";
import styled from "styled-components";
import { Btn } from "../../components/style";
import { useLanguage } from "../../i18n/LanguageProvider";
import { theme } from "../../styles/theme";
import { EmptyExercise } from "../../components/EmptyExercise";
import { speak } from "../../services/tts/ttsProvider";
import { WordStatusActions } from "../../components/WordStatusActions";
import { useProgress } from "../../i18n/ProgressProvider";

export const Cards = ({ data }) => {
  const { userId } = useParams();
  const number = Number(userId);
  const { t } = useLanguage();
  const progress = useProgress();
  const lesson = data[userId];
  const { speak: browserSpeak, voices } = useSpeechSynthesis();
  const wordList = data[userId].items;

  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setCardIndex(0);
    setFlipped(false);
  }, [userId]);

  const currentItem = wordList[cardIndex];

  const nextWord = () => {
    if (cardIndex < wordList.length - 1) {
      setCardIndex(cardIndex + 1);
      setFlipped(false);
    }
  };

  const flipCard = () => {
    const showSerbian = !flipped;
    setFlipped(showSerbian);
    if (showSerbian) {
      speak({
        text: currentItem.target,
        lang: "sr-RS",
        voices,
        browserSpeak,
      });
    }
  };
  return (
    <Wrapper>
      <Title title={`${t("navigation.cards")} ${number + 1}`} />
      {wordList.length === 0 ? <EmptyExercise message={t("myWords.minimum")} /> : (
      <Container>
        <AnimateBox
          type="button"
          aria-label={flipped ? "Show English word" : "Show Serbian translation"}
          onClick={flipCard}
        >
          <SourceWord sourceRotate={flipped ? "rotateY(180deg)" : "rotateY(0deg)"}>
            <Text>{currentItem.source}</Text>
          </SourceWord>
          <TargetWord targetRotate={flipped ? "rotateY(0deg)" : "rotateY(180deg)"}>
            <Text>{currentItem.target}</Text>
          </TargetWord>
        </AnimateBox>
        <WordStatusActions word={currentItem} />
        {cardIndex === wordList.length - 1 ? (
          <BackLink
            to="/choosecards"
            onClick={() => progress?.recordCompletion({
              type: "cards",
              categoryId: lesson.id,
              route: `/choosecards/${userId}`,
              titleKey: lesson.titleKey,
            })}
          >
            {t("actions.backToCards")}
          </BackLink>
        ) : (
          <Btn onClick={nextWord}>{t("actions.nextWord")}</Btn>
        )}
      </Container>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding-top: 0.75rem;
  padding-bottom: 7rem;
  display: flex;
  inline-size: 100%;
  justify-content: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  inline-size: 100%;
  max-inline-size: 42rem;
  padding-inline: 1rem;
`;

const SourceWord = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  block-size: 100%;
  inline-size: 100%;
  padding: 1.25rem;
  background: ${theme.colors.surface};
  transition: transform 220ms cubic-bezier(0.2, 0.7, 0.2, 1);
  transform: ${(props) => props.sourceRotate};
  backface-visibility: hidden;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.large};
  box-shadow: ${theme.shadow.soft};
`;

const TargetWord = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  block-size: 100%;
  inline-size: 100%;
  padding: 1.25rem;
  background: ${theme.colors.primarySoft};
  transition: transform 220ms cubic-bezier(0.2, 0.7, 0.2, 1);
  backface-visibility: hidden;
  transform: ${(props) => props.targetRotate};
  border: 1px solid ${theme.colors.primary};
  border-radius: ${theme.radius.large};
  box-shadow: ${theme.shadow.soft};
`;

const AnimateBox = styled.button`
  position: relative;
  display: block;
  inline-size: 100%;
  block-size: clamp(260px, 38vh, 340px);
  max-inline-size: 34rem;
  margin-bottom: 0.75rem;
  cursor: pointer;
  perspective: 1000px;
  border-radius: ${theme.radius.large};
  background: ${theme.colors.surface};
  padding: 0;
  border: 0;
  color: inherit;
  text-align: inherit;
  transition: transform 160ms ease;
  &:active {
    transform: scale(0.992);
  }
  &:focus-visible {
    outline: 3px solid ${theme.colors.primarySoft};
    outline-offset: 3px;
  }
`;

const Text = styled.p`
  margin: 0;
  max-inline-size: 100%;
  color: ${theme.colors.text};
  font-size: clamp(1.25rem, 5vw, 1.8rem);
  line-height: 1.3;
  overflow-wrap: anywhere;
  font-weight: bold;
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
