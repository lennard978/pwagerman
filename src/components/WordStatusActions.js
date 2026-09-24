import styled from "styled-components";
import { FaCheck, FaRegStar, FaStar } from "react-icons/fa";
import { useLanguage } from "../i18n/LanguageProvider";
import { useMyWords } from "../i18n/MyWordsProvider";
import { theme } from "../styles/theme";

export const WordStatusActions = ({ word, compact = false, variant = "default" }) => {
  const { t } = useLanguage();
  const vocabulary = useMyWords();
  if (!vocabulary) return null;
  const { allWords, toggleFavorite, toggleKnown } = vocabulary;
  const currentWord = allWords.find((item) => item.id === word.id) || word;

  const iconOnly = compact || variant === "card";

  return (
    <Actions $variant={variant}>
      <Action
        type="button"
        $compact={iconOnly}
        $active={currentWord.favorite}
        aria-pressed={currentWord.favorite}
        aria-label={currentWord.favorite ? t("vocabulary.unfavorite") : t("vocabulary.favorite")}
        title={currentWord.favorite ? t("vocabulary.unfavorite") : t("vocabulary.favorite")}
        onClick={() => toggleFavorite(currentWord)}
      >
        {currentWord.favorite ? <FaStar aria-hidden="true" /> : <FaRegStar aria-hidden="true" />}
      </Action>
      <Action
        type="button"
        $compact={iconOnly}
        $active={currentWord.status === "known"}
        aria-pressed={currentWord.status === "known"}
        aria-label={currentWord.status === "known" ? t("vocabulary.markLearning") : t("vocabulary.markKnown")}
        title={currentWord.status === "known" ? t("vocabulary.markLearning") : t("vocabulary.markKnown")}
        onClick={() => toggleKnown(currentWord)}
      >
        <FaCheck aria-hidden="true" />
        {!iconOnly && <span>{currentWord.status === "known" ? t("vocabulary.known") : t("vocabulary.markKnown")}</span>}
      </Action>
    </Actions>
  );
};

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(props) => props.$variant === "card" ? "0.75rem" : "0.5rem"};
  justify-content: ${(props) => props.$variant === "card" ? "center" : "flex-start"};
`;

const Action = styled.button`
  inline-size: ${(props) => (props.$compact ? "2.75rem" : "auto")};
  min-inline-size: 2.75rem;
  min-block-size: 2.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: ${(props) => (props.$compact ? "0" : "0.45rem 0.7rem")};
  color: ${(props) => (props.$active ? theme.colors.primaryPressed : theme.colors.textMuted)};
  background: ${(props) => (props.$active ? theme.colors.primarySoft : theme.colors.surfaceMuted)};
  border: 1px solid ${(props) => (props.$active ? theme.colors.primary : theme.colors.border)};
  border-radius: ${(props) => (props.$compact ? theme.radius.small : theme.radius.pill)};
  font-weight: 700;
  cursor: pointer;
  transition: color 180ms ease, background-color 180ms ease, border-color 180ms ease, transform 160ms ease;

  &:active { transform: scale(0.96); }
  &:focus-visible { outline: 3px solid ${theme.colors.primarySoft}; outline-offset: 2px; }
`;
