import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Title } from "../../components/Title";
import styled from "styled-components";
import { Btn } from "../../components/style";
import { useLanguage } from "../../i18n/LanguageProvider";
import { theme } from "../../styles/theme";
import { EmptyExercise } from "../../components/EmptyExercise";

export const Cards = ({ data }) => {
  const { userId } = useParams();
  const number = Number(userId);
  const { t } = useLanguage();
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
  return (
    <Wrapper>
      <Title title={`${t("navigation.cards")} ${number + 1}`} />
      {wordList.length === 0 ? <EmptyExercise message={t("myWords.minimum")} /> : (
      <Container>
        <AnimateBox
          type="button"
          aria-label={flipped ? "Show English word" : "Show Serbian translation"}
          onClick={() => setFlipped(!flipped)}
        >
          <SourceWord sourceRotate={flipped ? "rotateY(180deg)" : "rotateY(0deg)"}>
            <Text>{currentItem.source}</Text>
          </SourceWord>
          <TargetWord targetRotate={flipped ? "rotateY(0deg)" : "rotateY(180deg)"}>
            <Text>{currentItem.target}</Text>
          </TargetWord>
        </AnimateBox>
        <Btn disabled={cardIndex === wordList.length - 1} onClick={nextWord}>
          {t("actions.nextWord")}
        </Btn>
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
  transition: transform 180ms ease;
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
  transition: transform 180ms ease;
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
