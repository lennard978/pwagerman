import { Link } from "react-router-dom";
import styled from "styled-components";
import { theme } from "../styles/theme";

export const BackBtn = ({ title, to }) => {
  return <Button to={to}>{title}</Button>;
};

const Button = styled(Link)`
  min-block-size: 2.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${theme.colors.text};
  padding-inline: 1.25rem;
  border: 1px solid ${theme.colors.border};
  box-shadow: ${theme.shadow.soft};
  background: ${theme.colors.surface};
  text-decoration: none;
  border-radius: ${theme.radius.small};
  margin-top: 0.5rem;
  transition: transform 160ms ease, border-color 180ms ease, background-color 180ms ease;
  &:hover,
  &:focus-visible {
    border-color: ${theme.colors.primary};
  }
  &:active {
    transform: scale(0.98);
  }
`;
