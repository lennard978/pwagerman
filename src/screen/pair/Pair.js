import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import styled from "styled-components";

export const Pair = ({ data }) => {
  const { userId } = useParams();
  const number = Number(userId);

  const [wordList, setWordList] = useState(data[userId]);
  const [german, setGerman] = useState(
    JSON.parse(JSON.stringify(wordList)).sort(() => Math.random() - 0.5)
  );
  const [english, setEnglish] = useState(
    JSON.parse(JSON.stringify(wordList)).sort(() => Math.random() - 0.5)
  );
  let [germanAnswer, setGermanAnswer] = useState("");
  let [englishAnswer, setEnglishAnswer] = useState("");

  const [germanResult, setGermanResult] = useState("");
  const [englishResult, setEnglishResult] = useState("");

  const checkGerman = (item) => {
    const germanItem = german.find((word) => word === item);
    setGermanAnswer(germanItem);
    setGermanResult(item);
  };

  const checkEnglish = (item) => {
    const englishItem = english.find((word) => word === item);
    setEnglishAnswer(englishItem);
    setEnglishResult(item);
  };

  const checkCorrect = () => {
    if (germanResult.german === englishResult.german) {
      setGerman(german.filter((item) => item !== germanResult));
      setEnglish(english.filter((item) => item !== englishResult));
    }
  };

  const germanList = german.map((item, index) => {
    return (
      <GermanButton onClick={() => checkGerman(item)} key={index}>
        {item.german}
      </GermanButton>
    );
  });
  const englishList = english.map((item, index) => {
    return (
      <EnglishButton onClick={() => checkEnglish(item)} key={index}>
        {item.english}
      </EnglishButton>
    );
  });

  return (
    <Container>
      <Title>Pair {number + 1}</Title>
      <Row>{germanList}</Row>
      <button onClick={() => checkCorrect()}>Check</button>
      <Row>{englishList}</Row>
      <Button to="/choosepair">Back to Choose</Button>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 3rem;
`;
const Title = styled.h2`
  margin: 0.5rem;
  color: rgba(57, 255, 20, 1);
  display: flex;
  justify-content: center;
`;

const Row = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;

const GermanButton = styled.button`
  text-transform: capitalize;
  font-size: 0.8rem;
  color: rgba(57, 255, 20, 1);
  margin: 0.2rem;
  border: 1px solid white;
  padding: 0.5rem;
  background: none;
  cursor: pointer;
`;

const EnglishButton = styled.button`
  text-transform: capitalize;
  font-size: 0.8rem;
  font-weight: 400;
  color: white;
  margin: 0.2rem;
  border: 1px solid white;
  padding: 0.5rem;
  background: none;
  cursor: pointer;
`;

const Button = styled(Link)`
  display: flex;
  justify-content: center;
  text-transform: uppercase;
  width: 33%;
  font-size: 0.8rem;
  font-weight: 400;
  color: rgba(57, 255, 20, 1);
  margin: 1rem;
  padding-block: 0.5rem;
  border-bottom: 1px solid #141e30;
  border-right: 1px solid #141e30;
  border-top: 1px solid #243b50;
  border-left: 1px solid #243b50;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.3);
  background-image: linear-gradient(to top, #243b50, #141e30);
  text-decoration: none;
  border-radius: 0.2rem;
`;
