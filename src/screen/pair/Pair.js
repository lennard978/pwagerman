import { useParams } from "react-router-dom";
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

  let germanResultNew = "";
  let englishResultNew = "";

  const checkGerman = (item) => {
    germanResultNew = item;
  };
  const checkEnglish = (item) => {
    englishResultNew = item;
    checkCorrect();
  };

  const checkCorrect = () => {
    if (germanResultNew.german === englishResultNew.german) {
      setGerman(german.filter((item) => item !== germanResultNew));
      setEnglish(english.filter((item) => item !== englishResultNew));
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
      <Row>{englishList}</Row>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding-top: 2.7rem;
  padding-bottom: 4rem;
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Btn = styled.button`
  text-transform: capitalize;
  font-size: 0.8rem;
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
  background: linear-gradient(to top, #243b50, #141e30);
  text-decoration: none;
  border-radius: 0.2rem;
  cursor: pointer;
  &:active {
    border: 1px inset rgba(57, 255, 20, 1);
    transition: all 0.5s ease;
  }
`;
