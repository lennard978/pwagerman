import { useState } from "react";
import styled from "styled-components";
import { FaVolumeUp } from "react-icons/fa";
import { useLanguage } from "../../i18n/LanguageProvider";
import { useMyWords } from "../../i18n/MyWordsProvider";
import { theme } from "../../styles/theme";
import SoundButton from "../../components/SoundButton";
import { WordStatusActions } from "../../components/WordStatusActions";

const validFilters = ["all", "favorites", "learning", "known"];

export const MyWords = () => {
  const { t } = useLanguage();
  const { words, allWords, addWord, updateWord, deleteWord } = useMyWords();
  const requestedFilter = new URLSearchParams(window.location.search).get("filter");
  const [filter, setFilter] = useState(
    validFilters.includes(requestedFilter) ? requestedFilter : "all"
  );
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [visibleLimit, setVisibleLimit] = useState(20);

  const visibleWords = allWords.filter((word) => {
    if (filter === "favorites") return word.favorite;
    if (filter === "known") return word.status === "known";
    if (filter === "learning") return word.status !== "known";
    return true;
  });

  const reset = () => {
    setSource("");
    setTarget("");
    setEditingId(null);
    setError("");
  };

  const save = (event) => {
    event.preventDefault();
    const result = editingId
      ? updateWord(editingId, source, target)
      : addWord(source, target);
    if (result.error) {
      setError(t(`myWords.${result.error}`));
      return;
    }
    reset();
  };

  const edit = (word) => {
    setEditingId(word.id);
    setSource(word.source);
    setTarget(word.target);
    setError("");
  };

  return (
    <Wrapper>
      <Heading>{t("myWords.title")}</Heading>
      <Description>{t("myWords.libraryDescription")}</Description>
      <Form onSubmit={save}>
        <FormTitle>{editingId ? t("myWords.edit") : t("myWords.add")}</FormTitle>
        <Fields>
          <Label>
            {t("myWords.english")}
            <Input value={source} onChange={(event) => setSource(event.target.value)} />
          </Label>
          <Label>
            {t("myWords.serbian")}
            <Input value={target} onChange={(event) => setTarget(event.target.value)} />
          </Label>
        </Fields>
        {error && <Error role="alert">{error}</Error>}
        <Actions>
          <PrimaryButton type="submit">{t("myWords.save")}</PrimaryButton>
          {editingId && <SecondaryButton type="button" onClick={reset}>{t("myWords.cancel")}</SecondaryButton>}
        </Actions>
      </Form>

      <Filters aria-label={t("myWords.filters")}>
        {validFilters.map((name) => (
          <Filter
            key={name}
            type="button"
            $active={filter === name}
            aria-pressed={filter === name}
            onClick={() => setFilter(name)}
          >
            {t(`vocabulary.${name}`)}
          </Filter>
        ))}
      </Filters>

      <Count>{visibleWords.length} {t("myWords.wordCount")}</Count>
      <List>
        {visibleWords.length === 0 ? (
          <Empty>
            <strong>{filter === "all" && words.length === 0 ? t("myWords.noWords") : t("myWords.noMatches")}</strong>
            <span>{filter === "all" && words.length === 0 ? t("myWords.emptyHint") : t("myWords.filterHint")}</span>
          </Empty>
        ) : visibleWords.slice(0, visibleLimit).map((word) => (
          <WordCard key={word.id}>
            <WordPair>
              <strong>{word.source}</strong>
              <span>{word.target}</span>
              <Meta>{word.kind === "custom" ? t("myWords.custom") : t("myWords.curriculum")}</Meta>
            </WordPair>
            <CardControls>
              <WordStatusActions word={word} compact />
              <PronunciationButton
                text={word.target}
                lang="sr-RS"
                ariaLabel={`Hear Serbian pronunciation: ${word.target}`}
              >
                <FaVolumeUp aria-hidden="true" />
              </PronunciationButton>
              {word.kind === "custom" && (
                <Actions>
                  <SecondaryButton type="button" onClick={() => edit(word)}>{t("myWords.edit")}</SecondaryButton>
                  <SecondaryButton type="button" onClick={() => window.confirm(t("myWords.deleteConfirm")) && deleteWord(word.id)}>{t("myWords.delete")}</SecondaryButton>
                </Actions>
              )}
            </CardControls>
          </WordCard>
        ))}
      </List>
      {visibleWords.length > visibleLimit && (
        <LoadMore type="button" onClick={() => setVisibleLimit((limit) => limit + 20)}>
          {t("myWords.showMore")}
        </LoadMore>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.main`inline-size: min(100%, 48rem); min-block-size: 100vh; padding: 0.75rem 1rem 7rem;`;
const Heading = styled.h1`margin: 0; color: ${theme.colors.text}; font-size: 1.8rem;`;
const Description = styled.p`margin: 0.4rem 0 1.25rem; color: ${theme.colors.textMuted};`;
const Form = styled.form`display: grid; gap: 0.9rem; padding: 1rem; background: ${theme.colors.surface}; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.medium}; box-shadow: ${theme.shadow.soft};`;
const FormTitle = styled.h2`margin: 0; color: ${theme.colors.text}; font-size: 1rem;`;
const Fields = styled.div`display: grid; gap: 0.75rem; @media (min-width: 36rem) { grid-template-columns: 1fr 1fr; }`;
const Label = styled.label`display: grid; gap: 0.35rem; color: ${theme.colors.textMuted}; font-size: 0.85rem; font-weight: 600;`;
const Input = styled.input`min-inline-size: 0; min-block-size: 2.75rem; padding: 0.6rem 0.75rem; color: ${theme.colors.text}; background: ${theme.colors.surface}; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.small}; &:focus { outline: 3px solid ${theme.colors.primarySoft}; border-color: ${theme.colors.primary}; }`;
const Actions = styled.div`display: flex; flex-wrap: wrap; gap: 0.5rem;`;
const PrimaryButton = styled.button`min-block-size: 2.75rem; padding-inline: 1.25rem; color: white; background: ${theme.colors.primary}; border: 0; border-radius: ${theme.radius.small}; font-weight: 700;`;
const SecondaryButton = styled.button`min-block-size: 2.5rem; padding-inline: 0.75rem; color: ${theme.colors.text}; background: ${theme.colors.surfaceMuted}; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.small}; font-weight: 600;`;
const Error = styled.p`margin: 0; color: ${theme.colors.error}; font-weight: 600;`;
const Filters = styled.div`display: flex; gap: 0.4rem; margin-top: 1rem; overflow-x: auto; padding-bottom: 0.2rem;`;
const Filter = styled.button`flex: 0 0 auto; min-block-size: 2.75rem; padding: 0.5rem 0.9rem; color: ${(props) => props.$active ? "white" : theme.colors.textMuted}; background: ${(props) => props.$active ? theme.colors.navy : theme.colors.surface}; border: 1px solid ${(props) => props.$active ? theme.colors.navy : theme.colors.border}; border-radius: ${theme.radius.pill}; font-weight: 700;`;
const Count = styled.p`margin: 0.6rem 0 0; color: ${theme.colors.textMuted}; font-size: 0.8rem;`;
const List = styled.div`display: grid; gap: 0.75rem; margin-top: 0.6rem;`;
const WordCard = styled.article`display: flex; justify-content: space-between; gap: 0.75rem; align-items: center; padding: 1rem; background: ${theme.colors.surface}; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.medium}; box-shadow: ${theme.shadow.soft}; @media (max-width: 24rem) { align-items: stretch; flex-direction: column; }`;
const WordPair = styled.div`min-inline-size: 0; display: grid; gap: 0.2rem; color: ${theme.colors.text}; overflow-wrap: anywhere; & > span { color: ${theme.colors.primary}; font-weight: 700; }`;
const Meta = styled.small`color: ${theme.colors.textMuted}; font-size: 0.7rem;`;
const CardControls = styled.div`display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 0.4rem;`;
const PronunciationButton = styled(SoundButton)`display: inline-flex; min-inline-size: 2.75rem; min-block-size: 2.75rem; align-items: center; justify-content: center; color: ${theme.colors.primary}; background: ${theme.colors.surfaceMuted}; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.pill};`;
const Empty = styled.div`display: grid; gap: 0.35rem; padding: 1.5rem; color: ${theme.colors.textMuted}; background: ${theme.colors.surfaceMuted}; border-radius: ${theme.radius.medium}; text-align: center;`;
const LoadMore = styled.button`inline-size: 100%; min-block-size: 2.75rem; margin-top: 0.75rem; color: ${theme.colors.navy}; background: ${theme.colors.surface}; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.small}; font-weight: 700;`;
