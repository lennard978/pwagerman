import styled from "styled-components";
import { Title } from "../Title";
import { theme } from "../../styles/theme";

export const practiceTokens = {
  contentMaxWidth: "42rem",
  topClearance: "1rem",
  sectionGap: "0.9rem",
  actionGap: "1.25rem",
  bottomClearance: "1.75rem",
  controlSize: "3rem",
};

export const PracticeLayout = ({ title, children, ...props }) => (
  <PracticePage data-testid="practice-layout" {...props}>
    <Title title={title} reserveSpace />
    <PracticeBody data-testid="practice-content">{children}</PracticeBody>
  </PracticePage>
);

const PracticePage = styled.main`
  inline-size: min(100%, ${practiceTokens.contentMaxWidth});
  min-block-size: calc(100dvh - ${theme.navHeight});
  display: flex;
  flex-direction: column;
  padding-inline: 1rem;
`;

export const PracticeBody = styled.div`
  flex: 1;
  min-block-size: 0;
  display: flex;
  flex-direction: column;
  padding-block: ${practiceTokens.topClearance} ${practiceTokens.bottomClearance};
`;

export const PracticeStage = styled.section`
  flex: 1;
  min-block-size: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${practiceTokens.sectionGap};

  @media (max-height: 42rem) {
    justify-content: flex-start;
  }
`;

export const PracticeSurface = styled.section`
  min-inline-size: 0;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.large};
  box-shadow: ${theme.shadow.soft};
`;

export const PracticeProgress = styled.p`
  margin: 0;
  color: ${theme.colors.textMuted};
  font-size: 0.85rem;
  font-weight: 600;
`;

export const PracticePrompt = styled.h2`
  margin: 0.5rem 0;
  color: ${theme.colors.text};
  font-size: clamp(1.35rem, 6vw, 1.9rem);
  line-height: 1.3;
  text-align: center;
`;

export const PracticeChoices = styled.div`
  display: grid;
  gap: 0.6rem;
`;

export const PracticeChoiceRow = styled.div`
  min-inline-size: 0;
  display: flex;
  align-items: stretch;
  gap: 0.5rem;
`;

export const PracticeAnswerButton = styled.button`
  flex: 1;
  min-inline-size: 0;
  min-block-size: ${practiceTokens.controlSize};
  padding: 0.7rem 1rem;
  color: ${(props) =>
    props.$correct
      ? theme.colors.success
      : props.$wrong
        ? theme.colors.error
        : theme.colors.text};
  background: ${(props) =>
    props.$correct
      ? theme.colors.successSoft
      : props.$wrong
        ? theme.colors.errorSoft
        : props.$selected
          ? theme.colors.primarySoft
          : theme.colors.surface};
  border: 1px solid ${(props) =>
    props.$correct
      ? theme.colors.success
      : props.$wrong
        ? theme.colors.error
        : props.$selected
          ? theme.colors.primary
          : theme.colors.border};
  border-radius: ${theme.radius.small};
  box-shadow: ${theme.shadow.soft};
  overflow-wrap: anywhere;
  font-weight: 600;
  cursor: pointer;
  transition:
    color 180ms ease,
    background-color 180ms ease,
    border-color 180ms ease,
    transform 160ms ease;

  &:active {
    transform: scale(0.985);
  }

  &:focus-visible {
    outline: 3px solid ${theme.colors.primarySoft};
    outline-offset: 2px;
  }
`;

export const PracticeActionArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${practiceTokens.actionGap};
`;

export const PracticePrimaryButton = styled.button`
  min-block-size: 2.75rem;
  padding-inline: 1.5rem;
  color: white;
  background: ${theme.colors.primary};
  border: 1px solid ${theme.colors.primary};
  border-radius: ${theme.radius.small};
  font-weight: 700;
  cursor: pointer;
  transition: transform 160ms ease, background-color 180ms ease, opacity 180ms ease;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  &:active {
    background: ${theme.colors.primaryPressed};
    transform: scale(0.98);
  }
`;

export const PracticeResultCard = styled(PracticeSurface)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1rem;
  text-align: center;
`;

export const PracticeReviewList = styled.div`
  inline-size: 100%;
  text-align: left;
`;

export const PracticeReviewItem = styled.article`
  margin-top: 0.65rem;
  padding: 0.8rem;
  background: ${(props) =>
    props.$correct ? theme.colors.successSoft : theme.colors.errorSoft};
  border: 1px solid ${(props) =>
    props.$correct ? theme.colors.success : theme.colors.error};
  border-radius: ${theme.radius.small};
`;
