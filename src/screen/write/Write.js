import { useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { Title } from "../../components/Title";

export const Write = ({ data }) => {
  const { userId } = useParams();
  const number = Number(userId);

  const wordList = data[userId].map((item) => {
    return item;
  });

  let [count, setCount] = useState(0);
  const [englishWord, setEnglishWord] = useState(wordList[count].english);
  const [germanWord, setGermanWord] = useState(wordList[count].german);
  const shuffle = (v) => [...v].sort((_) => Math.random() - 0.5).join("");
  const shuffleWord = shuffle(germanWord.split(""));
  const [german, setGerman] = useState([...shuffleWord]);
  const [germanAnswer, setGermanAnswer] = useState(
    new Array(wordList[count].german.length).fill("?")
  );
  const [addOne, setAddOne] = useState(0);
  const removeLetter = (item) => {
    const index = german.indexOf(item);
    german.splice(index, 1);
    if (item.indexOf() === -1) {
      setAddOne(addOne + 1);
      germanAnswer.splice(addOne, 0, item);
      germanAnswer.pop();
      setGermanAnswer(germanAnswer);
    }
    let list = germanAnswer.join("");
    if (germanWord === list) {
      alert("Victory");
    }
  };
  const nextWord = () => {
    setCount(count + 1);
    setEnglishWord(wordList[count].english);
    setGerman([...shuffleWord]);
    setGermanWord(wordList[count].german);
    setGermanAnswer(new Array(wordList[count].german.length).fill("?"));
  };
  return (
    <Container>
      <Title title={`Write ${number + 1}`} />
      <Row>
        <H2>{englishWord}</H2>
      </Row>
      <Row>
        {germanAnswer.map((item, index) => {
          return <GermanLetter key={index}>{item}</GermanLetter>;
        })}
      </Row>
      <Row>
        {german.map((item, index) => {
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
      <Button onClick={() => nextWord()}>Next</Button>
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

const H2 = styled.h2`
  color: white;
`;

const GermanLetter = styled.h2`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1rem;
  color: white;
  padding-block: 0.5rem;
  padding-inline: 1rem;
  border-bottom: 1px solid #141e30;
  border-right: 1px solid #141e30;
  border-top: 1px solid #243b50;
  border-left: 1px solid #243b50;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.3);
  background: linear-gradient(to top, #243b50, #141e30);
  text-decoration: none;
  border-radius: 0.2rem;
  margin: 0.2rem;
  text-transform: uppercase;
  min-height: 1.6rem;
  cursor: pointer;
  &:hover {
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
  background: linear-gradient(to top, #243b50, #141e30);
  text-decoration: none;
  border-radius: 0.2rem;
  cursor: pointer;
  width: 3rem;
  display: flex;
  justify-content: center;
  align-self: center;
  &:hover {
    border-bottom: 1px inset rgba(57, 255, 20, 1);
    transition: all 0.5s ease;
    color: rgba(57, 255, 20, 1);
  }
`;
