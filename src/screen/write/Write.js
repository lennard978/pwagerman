import { useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useLanguage } from "../../i18n/LanguageProvider";
import { theme } from "../../styles/theme";
import { EmptyExercise } from "../../components/EmptyExercise";

export const Write = ({ data }) => {
  const { userId } = useParams();
  const number = Number(userId);
  const { t } = useLanguage();

  //Collect Data
  const wordList = data[userId].items.map((item) => {
    return item;
  });

  const [disable, setDisable] = useState(false);
  const [resultState, setResultState] = useState("idle");

  //Update wordList count
  let [count, setCount] = useState(0);

  const [sourceWord, setSourceWord] = useState(wordList[0]?.source || "");

  const createTiles = (value) => value.split("").map((char, index) => ({
    id: `${char}-${index}-${Math.random()}`,
    char,
  }));
  const shuffle = (v) => [...v].sort(() => Math.random() - 0.5);
  const [shuffledTarget, setShuffledTarget] = useState([
    ...shuffle(createTiles(wordList[0]?.target || "")),
  ]);

  const [targetAnswer, setTargetAnswer] = useState(
    new Array(wordList[0]?.target?.length || 0).fill(null)
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
      } else {
        setResultState("incorrect");
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
    setResultState("idle");
    setCount(++count);
    setSourceWord(wordList[count].source);
    setShuffledTarget(shuffle(createTiles(wordList[count].target)));
    setTargetAnswer(new Array(wordList[count].target.length).fill(null));
    if (wordList.length - 1 < count + 1) {
      setDisable(true);
    }
  };

  return (
    <Container>
      <WriteTitle>{`${t("navigation.write")} ${number + 1}`}</WriteTitle>
      {wordList.length === 0 ? <EmptyExercise message={t("myWords.minimum")} /> : <>
      <Row>
        <H2>{sourceWord}</H2>
      </Row>
      <Row>
        {targetAnswer.map((item, index) => {
          return (
            <TargetLetter
              $filled={Boolean(item)}
              $resultState={resultState}
              $space={item?.char === " "}
              data-filled={Boolean(item)}
              data-tile-id={item?.id}
              onClick={() => removeLetter(index)}
              key={index}
            >
              {item?.char || "?"}
            </TargetLetter>
          );
        })}
      </Row>
      <Row>
        {shuffledTarget.map((item, index) => {
          return (
            <TargetLetter
              $space={item.char === " "}
              data-filled={false}
              onClick={() => selectLetter(item)}
              key={item.id}
            >
              {item.char}
            </TargetLetter>
          );
        })}
      </Row>
      <Button disabled={disable} onClick={() => nextWord()}>
        {t("actions.next")}
      </Button>
      </>}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding-top: 0.75rem;
  padding-bottom: 7rem;
  inline-size: min(100%, 42rem);
  padding-inline: 1rem;
`;

const WriteTitle = styled.h2`
  margin: 0 0 1rem;
  color: ${theme.colors.text};
  font-size: 1.25rem;
  font-weight: 700;
  text-align: center;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  margin-inline: 1rem;
  max-inline-size: 100%;
  gap: 0.2rem;
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

const TargetLetter = styled.h2`
  display: flex;
  justify-content: center;
  align-items: center;
  min-inline-size: 2.5rem;
  min-block-size: 2.75rem;
  color: ${theme.colors.text};
  padding: 0.5rem;
  border: 1px solid ${theme.colors.border};
  box-shadow: ${theme.shadow.soft};
  background: ${theme.colors.surface};
  border-radius: ${theme.radius.small};
  margin: 0.2rem;
  text-transform: none;
  font-size: 1rem;
  font-weight: 700;
  text-shadow: ${(props) => props.$filled ? "0 1px 1px rgba(0, 0, 0, 0.2)" : "none"};
  overflow-wrap: anywhere;
  ${(props) => props.$space && `
    min-inline-size: 0.7rem;
    padding-inline: 0.15rem;
    border-color: transparent;
    background: transparent;
    box-shadow: none;
  `}
  cursor: pointer;
  &:active {
    border-color: ${theme.colors.primary};
    background: ${theme.colors.primarySoft};
  }
`;

const Button = styled.button`
  min-block-size: 2.75rem;
  text-transform: none;
  font-size: 0.95rem;
  font-weight: 700;
  color: white;
  margin: 1rem 5px 0;
  padding-inline: 1.5rem;
  border: 1px solid ${theme.colors.primary};
  box-shadow: ${theme.shadow.soft};
  background: ${theme.colors.primary};
  border-radius: ${theme.radius.small};
  cursor: pointer;
  min-inline-size: 5rem;
  align-self: center;
  transition: 180ms ease;
  &:active {
    background: ${theme.colors.primaryPressed};
  }
  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;
