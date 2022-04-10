import { useParams } from "react-router-dom";
import { useState } from "react";
import { Title } from "../../components/Title";
import styled from "styled-components";
import { Btn } from "../../components/style";

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
