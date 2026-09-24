import styled from "styled-components";
import SoundButton from "./SoundButton";
import { theme } from "../styles/theme";

export const CompactSoundButton = styled(SoundButton)`
  flex: 0 0 2.875rem;
  inline-size: 2.875rem;
  min-inline-size: 2.875rem;
  block-size: 2.875rem;
  min-block-size: 2.875rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  color: ${theme.colors.primary};
  background: ${theme.colors.primarySoft};
  border: 1px solid #fed7aa;
  border-radius: ${theme.radius.small};
  box-shadow: none;
  transition: transform 160ms ease, background-color 180ms ease, border-color 180ms ease;

  &:hover {
    background: #ffe7d5;
    border-color: ${theme.colors.primary};
  }

  &:active {
    transform: scale(0.94);
  }
`;
