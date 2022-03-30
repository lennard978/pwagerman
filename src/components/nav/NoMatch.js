import React from "react";
import styled from "styled-components";

export const NoMatch = () => {
  return (
    <Container>
      <H2>This Page doesn't exist 404</H2>
    </Container>
  );
};

const Container = styled.div`
  min-block-size: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: linear-gradient(to top, #243b50, #141e30);
`;

const H2 = styled.h2`
  color: rgba(57, 255, 20, 1);
  text-transform: capitalize;
`;
