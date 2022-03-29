import React from "react";
import styled from "styled-components";

export const Home = () => {
  return (
    <Container>
      <Paragraph>Learn German A1</Paragraph>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-inline-size: 100vw;
`;
const Paragraph = styled.h1`
  color: rgba(57, 255, 20, 1);
`;
