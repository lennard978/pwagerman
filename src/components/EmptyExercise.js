import styled from "styled-components";
import { theme } from "../styles/theme";

export const EmptyExercise = ({ message }) => <Message>{message}</Message>;

const Message = styled.p`
  margin: 2rem 0;
  padding: 1rem;
  color: ${theme.colors.textMuted};
  background: ${theme.colors.surfaceMuted};
  border-radius: ${theme.radius.medium};
  text-align: center;
`;
