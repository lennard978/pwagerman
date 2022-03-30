import React from "react";
import { Link, useParams } from "react-router-dom";
import SoundButton from "../../components/SoundButton";
import { Title } from "../../components/Title";
import styled from "styled-components";

export const Lesson = ({ data }) => {
  const { userId } = useParams();
  const number = Number(userId);
  return (
    <Wrapper>
      <Title title={`Lesson ${number + 1}`} />
      {data[userId].map((item, index) => {
        return (
          <Container>
            <SoundButton key={index} german={item.german}>
              <Row>
                <GermanParagraph>{item.german}</GermanParagraph>
                <EnglishParagraph>{item.english}</EnglishParagraph>
              </Row>
            </SoundButton>
          </Container>
        );
      })}
      <Button to="/chooselesson">Go Back</Button>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding-top: 3rem;
  padding-bottom: 5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  inline-size: 80vw;
  background-image: linear-gradient(to left, #243b50, #141e30);
  margin: 0.4rem;
  padding: 0.4rem;
  border-radius: 0.2rem;
  cursor: pointer;
  border-left: 0.1rem solid rgba(57, 255, 20, 1);
  border-right: 0.1rem solid white;
`;

const GermanParagraph = styled.p`
  color: rgba(57, 255, 20, 1);
`;

const EnglishParagraph = styled.p`
  color: white;
  font-style: italic;
`;

const Button = styled(Link)`
  font-size: 0.8rem;
  font-weight: 400;
  color: rgba(57, 255, 20, 1);
  padding-block: 0.3rem;
  padding-inline: 2rem;
  border-bottom: 1px solid #141e30;
  border-right: 1px solid #141e30;
  border-top: 1px solid #243b50;
  border-left: 1px solid #243b50;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.3);
  background-image: linear-gradient(to left, #243b50, #141e30);
  text-decoration: none;
  border-radius: 0.2rem;
  margin-top: 0.5rem;
`;
