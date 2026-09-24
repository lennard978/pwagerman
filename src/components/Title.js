import styled from "styled-components";
import { theme } from "../styles/theme";

export const Title = ({ title }) => {
  return (
    <>
      <Spacer aria-hidden="true" />
      <Container>
        <H2>{title}</H2>
      </Container>
    </>
  );
};

const Spacer = styled.div`
  block-size: 0;
`;

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  inline-size: 100vw;
  z-index: 5;
  text-align: center;
  block-size: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-inline: 1rem;
  background: ${theme.colors.surface};
  border-bottom: 1px solid ${theme.colors.border};
  box-shadow: 0 2px 12px rgba(31, 41, 51, 0.04);
`;

const H2 = styled.h2`
  margin: 0;
  color: ${theme.colors.text};
  font-size: 1.25rem;
  font-weight: 700;
`;
