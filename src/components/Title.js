import styled from "styled-components";

export const Title = ({ title }) => {
  return (
    <Container>
      <H2>{title}</H2>
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  inline-size: 100vw;
  text-align: center;
  justify-content: center;
  padding: 0.5rem;
  background-image: linear-gradient(to bottom, #243b50, #141e30);
`;

const H2 = styled.h2`
  color: rgba(57, 255, 20, 1);
`;
