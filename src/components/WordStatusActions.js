import styled from "styled-components";
import { FaCheck, FaRegStar, FaStar } from "react-icons/fa";
import { useLanguage } from "../i18n/LanguageProvider";
import { useMyWords } from "../i18n/MyWordsProvider";
import { theme } from "../styles/theme";

export const WordStatusActions = ({ word, compact = false }) => {
  const { t } = useLanguage();
  const vocabulary = useMyWords();
  if (!vocabulary) return null;
  const { allWords, toggleFavorite, toggleKnown } = vocabulary;
  const currentWord = allWords.find((item) => item.id === word.id) || word;

  return (
    <Actions $compact={compact}>
      <Action
        type="button"
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
        $active={currentWord.status === "known"}
        aria-pressed={currentWord.status === "known"}
        aria-label={currentWord.status === "known" ? t("vocabulary.markLearning") : t("vocabulary.markKnown")}
        title={currentWord.status === "known" ? t("vocabulary.markLearning") : t("vocabulary.markKnown")}
        onClick={() => toggleKnown(currentWord)}
      >
        <FaCheck aria-hidden="true" />
        {!compact && <span>{currentWord.status === "known" ? t("vocabulary.known") : t("vocabulary.markKnown")}</span>}
      </Action>
    </Actions>
  );
};

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  justify-content: ${(props) => (props.$compact ? "center" : "flex-start")};
`;

const Action = styled.button`
  min-inline-size: 2.75rem;
  min-block-size: 2.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.45rem 0.7rem;
  color: ${(props) => (props.$active ? theme.colors.primaryPressed : theme.colors.textMuted)};
  background: ${(props) => (props.$active ? theme.colors.primarySoft : theme.colors.surfaceMuted)};
  border: 1px solid ${(props) => (props.$active ? theme.colors.primary : theme.colors.border)};
  border-radius: ${theme.radius.pill};
  font-weight: 700;
  cursor: pointer;
  transition: color 180ms ease, background-color 180ms ease, border-color 180ms ease, transform 160ms ease;

  &:active { transform: scale(0.96); }
  &:focus-visible { outline: 3px solid ${theme.colors.primarySoft}; outline-offset: 2px; }
`;
