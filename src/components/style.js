import styled from "styled-components";
import { theme } from "../styles/theme";

export const Btn = styled.button`
  min-block-size: 2.75rem;
  text-transform: none;
  font-size: 0.95rem;
  font-weight: 600;
  font-weight: 400;
  color: ${theme.colors.text};
  margin: 0.3rem;
  padding-block: 0.65rem;
  padding-inline: 1rem;
  border: 1px solid ${theme.colors.border};
  box-shadow: ${theme.shadow.soft};
  background: ${theme.colors.surface};
  border-radius: ${theme.radius.small};
  cursor: pointer;
  transition: 180ms ease;
  &:active {
    color: ${theme.colors.primaryPressed};
    border-color: ${theme.colors.primary};
    transform: translateY(1px);
  }
  &:hover {
    border-color: ${theme.colors.primary};
  }
  &:focus-visible {
    outline: 3px solid ${theme.colors.primarySoft};
    outline-offset: 2px;
  }
  @media (max-width: 360px) {
    padding-inline: 0.65rem;
    font-size: 0.85rem;
  }
`;
