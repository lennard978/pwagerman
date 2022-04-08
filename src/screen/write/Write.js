import { useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { Title } from "../../components/Title";

export const Write = ({ data }) => {
  const { userId } = useParams();
  const number = Number(userId);

  //Collect Data
  const wordList = data[userId].map((item) => {
    return item;
  });

  const [disable, setDisable] = useState(false);
  const [topColor, setTopColor] = useState("#243b50");
  const [bottomColor, setBottomColor] = useState("#141e30");
  const myStyle = {
    background: `linear-gradient(to left, ${topColor}, ${bottomColor})`,
  };

  //Update wordList count
  let [count, setCount] = useState(0);

  //English Word
  const [englishWord, setEnglishWord] = useState(wordList[count].english);

  //German Word
  const shuffle = (v) => [...v].sort((_) => Math.random() - 0.5).join("");
  const [shuffleWord, setShuffleWord] = useState([
    ...shuffle(wordList[count].german.split("")),
  ]);

  //German Answer
  const [germanAnswer, setGermanAnswer] = useState(
    new Array(wordList[count].german.length).fill("?")
  );

  //Add one for removing array item
  let [addOne, setAddOne] = useState(0);

  const removeLetter = (item) => {
    const index = shuffleWord.indexOf(item);
    shuffleWord.splice(index, 1);
    if (item.indexOf() === -1) {
      setAddOne(addOne + 1);
      germanAnswer.splice(addOne, 0, item);
      germanAnswer.pop();
      setGermanAnswer(germanAnswer);
    }
    let list = germanAnswer.join("");
    if (list.length - 1 === addOne) {
      if (wordList[count].german === list) {
        setTopColor("rgba(57, 255, 20, .2)");
        setBottomColor("green");
      } else {
        setTopColor("rgba(900,0,0, .4)");
        setBottomColor("rgba(100,0,0)");
      }
    }
  };
  const nextWord = () => {
    setTopColor("#243b50");
    setBottomColor("#141e30");
    setAddOne(0);
    setCount(++count);
    setEnglishWord(wordList[count].english);
    setShuffleWord([...shuffle(wordList[count].german.split(""))]);
    setGermanAnswer(new Array(wordList[count].german.length).fill("?"));
    if (wordList.length - 1 < count + 1) {
      setDisable(true);
    }
  };

  return (
    <Container>
      <Title title={`Write ${number + 1}`} />
      <Row>
        <H2>{englishWord}</H2>
      </Row>
      <Row>
        {germanAnswer.map((item, index) => {
          return (
            <GermanLetter style={myStyle} key={index}>
              {item}
            </GermanLetter>
          );
        })}
      </Row>
      <Row>
        {shuffleWord.map((item, index) => {
          return (
            <GermanLetter
              onClick={() => {
                removeLetter(item);
              }}
              key={index}
            >
              {item}
            </GermanLetter>
          );
        })}
      </Row>
      <Button disabled={disable} onClick={() => nextWord()}>
        Next
      </Button>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding-top: 2.7rem;
  padding-bottom: 4rem;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  margin-inline: 1rem;
`;

const H2 = styled.h3`
  color: white;
`;

const GermanLetter = styled.h2`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 0.5rem;
  color: white;
  padding-block: 0.5rem;
  padding-inline: 1rem;
  border-bottom: 1px solid #141e30;
  border-right: 1px solid #141e30;
  border-top: 1px solid #243b50;
  border-left: 1px solid #243b50;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.3);
  background: linear-gradient(to left, #243b50, #141e30);
  text-decoration: none;
  border-radius: 0.2rem;
  margin: 0.2rem;
  text-transform: uppercase;
  min-height: 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  &:active {
    border: 1px inset rgba(57, 255, 20, 1);
    transition: all 0.5s ease;
  }
`;

const Button = styled.button`
  text-transform: capitalize;
  font-size: 0.8rem;
  font-weight: 400;
  color: white;
  margin: 5px;
  padding-block: 0.5rem;
  padding-inline: 2rem;
  border-bottom: 1px solid #141e30;
  border-right: 1px solid #141e30;
  border-top: 1px solid #243b50;
  border-left: 1px solid #243b50;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.3);
  background: linear-gradient(to left, #243b50, #141e30);
  text-decoration: none;
  border-radius: 0.2rem;
  cursor: pointer;
  width: 3rem;
  display: flex;
  justify-content: center;
  align-self: center;
  &:active {
    border-bottom: 1px inset rgba(57, 255, 20, 1);
    transition: all 0.5s ease;
    color: rgba(57, 255, 20, 1);
  }
`;
