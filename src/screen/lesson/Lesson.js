import React from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import SoundButton from "../../components/SoundButton";

export const Lesson = ({ data }) => {
  const { userId } = useParams();
  const number = Number(userId);
  return (
    <Container>
      <Title>Lesson {number + 1}</Title>
      {data[userId].map((item, index) => {
        return (
          <SoundButton key={index} german={item.german}>
            <ParagraphGerman>{item.german}</ParagraphGerman>
            <ParagraphEnglish>{item.english}</ParagraphEnglish>
          </SoundButton>
        );
      })}
      <Button to="/chooselesson">Back to Choose</Button>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100vw;
  margin-top: 0.4rem;
  margin-bottom: 0.4rem;
  padding-bottom: 3rem;
`;

const Title = styled.h2`
  margin: 0.5rem;
  color: rgba(57, 255, 20, 1);
  display: flex;
  justify-content: center;
`;

const ParagraphGerman = styled.p`
  text-transform: capitalize;
  font-size: 1rem;
  font-weight: 900;
  color: rgba(57, 255, 20, 1);
  margin: 5px;
`;

const ParagraphEnglish = styled.p`
  text-transform: capitalize;
  font-size: 1rem;
  font-weight: 400;
  font-style: italic;
  color: white;
  margin: 5px;
`;

const Button = styled(Link)`
  display: flex;
  justify-content: center;
  align-self: center;
  width: 33%;
  text-transform: uppercase;
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
