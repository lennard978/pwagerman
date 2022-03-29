import React from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import SoundButton from "../../components/SoundButton";

export const Lesson = ({ data }) => {
  const { userId } = useParams();
  return (
    <Container>
      {data[userId].map((item, index) => {
        return (
          <SoundButton key={index} german={item.german}>
            <Paragraph>{item.german}</Paragraph>
            <Paragraph>{item.english}</Paragraph>
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

const Paragraph = styled.p`
  text-transform: uppercase;
  font-size: 0.8rem;
  font-weight: 400;
  color: rgba(57, 255, 20, 1);
  margin: 5px;
`;

const Button = styled(Link)`
  display: flex;
  justify-content: center;
  text-transform: uppercase;
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
  background-image: linear-gradient(to top, #243b50, #141e30);
  text-decoration: none;
  border-radius: 0.2rem;
  margin-top: 2rem;
`;
