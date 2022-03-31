import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { Title } from "../../components/Title";
import styled from "styled-components";

export const Pair = ({ data }) => {
  const { userId } = useParams();
  const number = Number(userId);

  const wordList = data[userId];
  const [german, setGerman] = useState(
    JSON.parse(JSON.stringify(wordList)).sort(() => Math.random() - 0.5)
  );
  const [english, setEnglish] = useState(
    JSON.parse(JSON.stringify(wordList)).sort(() => Math.random() - 0.5)
  );

  const [germanResult, setGermanResult] = useState("");
  const [englishResult, setEnglishResult] = useState("");

  const checkGerman = (item) => {
    setGermanResult(item);
  };
  const checkEnglish = (item) => {
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
      <Btn onClick={() => checkGerman(item)} key={index}>
        {item.german}
      </Btn>
    );
  });
  const englishList = english.map((item, index) => {
    return (
      <Btn onClick={() => checkEnglish(item)} key={index}>
        {item.english}
      </Btn>
    );
  });

  return (
    <Container>
      <Title title={`Pair ${number + 1}`} />
      <Row>{germanList}</Row>
      <Check onClick={() => checkCorrect()}>Check</Check>
      <Row>{englishList}</Row>
      {/* <Check to="/choosepair">Go Back</Check> */}
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
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

const Btn = styled.button`
  text-transform: capitalize;
  font-size: 0.6rem;
  font-weight: 400;
  color: rgba(57, 255, 20, 1);
  margin: 5px;
  padding-block: 0.5rem;
  padding-inline: 2rem;
  border-bottom: 1px solid #141e30;
  border-right: 1px solid #141e30;
  border-top: 1px solid #243b50;
  border-left: 1px solid #243b50;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.3);
  background: transparent;
  text-decoration: none;
  border-radius: 0.2rem;
  &:hover {
    border-bottom: 1px solid rgba(57, 255, 20, 1);
    border-left: 1px solid rgba(57, 255, 20, 1);
    transition: all 0.5s ease;
  }
`;

const Check = styled.button`
  text-transform: capitalize;
  font-size: 0.6rem;
  font-weight: 400;
  color: rgba(57, 255, 20, 1);
  margin: 5px;
  padding-block: 0.5rem;
  padding-inline: 2rem;
  border-bottom: 1px solid #141e30;
  border-right: 1px solid #141e30;
  border-top: 1px solid #243b50;
  border-left: 1px solid #243b50;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.3);
  background: transparent;
  text-decoration: none;
  border-radius: 0.2rem;
  &:hover {
    border-bottom: 1px solid rgba(57, 255, 20, 1);
    border-left: 1px solid rgba(57, 255, 20, 1);
    transition: all 0.5s ease;
  }
`;
