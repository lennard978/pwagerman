import { useState } from "react";
import styled from "styled-components";
import { useLanguage } from "../../i18n/LanguageProvider";
import { useMyWords } from "../../i18n/MyWordsProvider";
import { theme } from "../../styles/theme";
import SoundButton from "../../components/SoundButton";
import { FaVolumeUp } from "react-icons/fa";

export const MyWords = () => {
  const { t } = useLanguage();
  const { words, addWord, updateWord, deleteWord } = useMyWords();
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

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
      <Description>{t("myWords.description")}</Description>
      <Form onSubmit={save}>
        <Label>
          {t("myWords.english")}
          <Input value={source} onChange={(event) => setSource(event.target.value)} />
        </Label>
        <Label>
          {t("myWords.serbian")}
          <Input value={target} onChange={(event) => setTarget(event.target.value)} />
        </Label>
        {error && <Error role="alert">{error}</Error>}
        <Actions>
          <PrimaryButton type="submit">{t("myWords.save")}</PrimaryButton>
          {editingId && <SecondaryButton type="button" onClick={reset}>{t("myWords.cancel")}</SecondaryButton>}
        </Actions>
      </Form>
      <List>
        {words.length === 0 ? (
          <Empty>
            <strong>{t("myWords.noWords")}</strong>
            <span>{t("myWords.emptyHint")}</span>
          </Empty>
        ) : words.map((word) => (
          <WordCard key={word.id}>
            <WordPair>
              <strong>{word.source}</strong>
              <span>{word.target}</span>
              <PronunciationButton
                text={word.target}
                lang="sr-RS"
                ariaLabel={`Hear Serbian pronunciation: ${word.target}`}
              >
                <FaVolumeUp aria-hidden="true" />
                <span>Hear</span>
              </PronunciationButton>
            </WordPair>
            <Actions>
              <SecondaryButton type="button" onClick={() => edit(word)}>{t("myWords.edit")}</SecondaryButton>
              <SecondaryButton type="button" onClick={() => window.confirm(t("myWords.deleteConfirm")) && deleteWord(word.id)}>{t("myWords.delete")}</SecondaryButton>
            </Actions>
          </WordCard>
        ))}
      </List>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  inline-size: min(100%, 42rem);
  min-block-size: 100vh;
  padding: 0.75rem 1rem 7rem;
`;
const Heading = styled.h1`margin: 0; color: ${theme.colors.text}; font-size: 1.8rem;`;
const Description = styled.p`margin: 0.4rem 0 1.25rem; color: ${theme.colors.textMuted};`;
const Form = styled.form`display: grid; gap: 0.9rem; padding: 1rem; background: ${theme.colors.surface}; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.medium}; box-shadow: ${theme.shadow.soft};`;
const Label = styled.label`display: grid; gap: 0.35rem; color: ${theme.colors.textMuted}; font-size: 0.85rem; font-weight: 600;`;
const Input = styled.input`min-block-size: 2.75rem; padding: 0.6rem 0.75rem; color: ${theme.colors.text}; background: ${theme.colors.surface}; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.small}; &:focus { outline: 3px solid ${theme.colors.primarySoft}; border-color: ${theme.colors.primary}; }`;
const Actions = styled.div`display: flex; flex-wrap: wrap; gap: 0.5rem;`;
const PrimaryButton = styled.button`min-block-size: 2.75rem; padding-inline: 1.25rem; color: white; background: ${theme.colors.primary}; border: 0; border-radius: ${theme.radius.small}; font-weight: 700;`;
const SecondaryButton = styled.button`min-block-size: 2.5rem; padding-inline: 0.9rem; color: ${theme.colors.text}; background: ${theme.colors.surfaceMuted}; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.small}; font-weight: 600;`;
const Error = styled.p`margin: 0; color: ${theme.colors.error}; font-weight: 600;`;
const List = styled.div`display: grid; gap: 0.75rem; margin-top: 1rem;`;
const WordCard = styled.article`display: flex; justify-content: space-between; gap: 0.75rem; align-items: center; padding: 1rem; background: ${theme.colors.surface}; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.medium}; box-shadow: ${theme.shadow.soft};`;
const WordPair = styled.div`display: grid; gap: 0.25rem; color: ${theme.colors.text}; & span { color: ${theme.colors.primary}; font-weight: 700; }`;
const PronunciationButton = styled(SoundButton)`
  display: inline-flex;
  inline-size: auto;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.15rem;
  padding: 0.25rem 0.45rem;
  color: ${theme.colors.primary};
  border-radius: ${theme.radius.small};
  &:hover { background: ${theme.colors.primarySoft}; }
`;
const Empty = styled.div`display: grid; gap: 0.35rem; padding: 1.5rem; color: ${theme.colors.textMuted}; background: ${theme.colors.surfaceMuted}; border-radius: ${theme.radius.medium}; text-align: center;`;
