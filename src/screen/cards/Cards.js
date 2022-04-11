import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Title } from "../../components/Title";
import styled from "styled-components";
import { Btn } from "../../components/style";

export const Cards = ({ data }) => {
  useEffect(() => {
    nextWord();
  }, []);
  const { userId } = useParams();
  const number = Number(userId);

  const [addOne, setAddOne] = useState(0);

  const german = data[userId].map((item) => {
    return <Text>{item.german}</Text>;
  });
  const english = data[userId].map((item) => {
    return <Text>{item.english}</Text>;
  });

  const [germanWord, setGermanWord] = useState(german[addOne]);
  const [englishWord, setEnglishWord] = useState(english[addOne]);

  const [englishRotate, setEnglishRotate] = useState("rotateY(0deg)");
  const [germanRotate, setGermanRotate] = useState("rotateY(180deg)");

  const [disabled, setDisabled] = useState(false);

  const nextWord = () => {
    setAddOne(addOne + 1);
    setGermanWord(german[addOne]);
    setEnglishWord(english[addOne]);
    setEnglishRotate("rotateY(0deg)");
    setGermanRotate("rotateY(180deg)");
    if (german.length - 1 === addOne) {
      setDisabled(true);
    }
  };
  const rotateWord = () => {
    if (germanRotate === "rotateY(180deg)") {
      setEnglishRotate("rotateY(-180deg)");
      setGermanRotate("rotateY(0deg)");
    } else {
      setEnglishRotate("rotateY(0deg)");
      setGermanRotate("rotateY(180deg)");
    }
  };
  return (
    <Wrapper>
      <Title title={`Cards ${number + 1}`} />
      <Container>
        <AnimateBox onClick={() => rotateWord()}>
          <GermanWord germanRotate={germanRotate}>{germanWord}</GermanWord>
          <EnglishWord englishRotate={englishRotate}>{englishWord}</EnglishWord>
        </AnimateBox>
        <Btn disabled={disabled} onClick={() => nextWord()}>
          Next Word
        </Btn>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding-top: 3rem;
  padding-bottom: 5rem;
  display: flex;
  inline-size: 100%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  inline-size: 100%;
`;

const GermanWord = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  block-size: 100%;
  inline-size: 100%;
  background: linear-gradient(to left, #243b50, #141e30);
  transition: all 0.5s ease;
  transform: ${(props) => props.germanRotate};
  backface-visibility: hidden;
  border-radius: 0.3rem;
`;

const EnglishWord = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  block-size: 100%;
  inline-size: 100%;
  background: linear-gradient(to right, #243b50, #141e30);
  transition: all 0.5s ease;
  backface-visibility: hidden;
  transform: ${(props) => props.englishRotate};
  border-radius: 0.3rem;
`;

const AnimateBox = styled.div`
  position: relative;
  height: 40%;
  width: 90%;
  box-shadow: 0.1rem 0.1rem 0.4rem lightgray;
  margin-bottom: 2rem;
  cursor: pointer;
  perspective: 1000px;
  border-radius: 0.3rem;
  background: linear-gradient(to top, #243b50, #141e30);
`;

const Text = styled.p`
  font-size: 1.4rem;
  color: white;
  text-transform: capitalize;
  color: rgba(57, 255, 20, 1);
  font-weight: bold;
`;
