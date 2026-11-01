import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaClone, FaKeyboard, FaLayerGroup, FaQuestionCircle } from "react-icons/fa";
import { useMyWords } from "../../i18n/MyWordsProvider";
import { LEARNING_SESSION_LIMIT } from "../../data/exerciseRounds";
import { theme } from "../../styles/theme";

export const getLearningWords = (words = []) =>
  words.filter((word) => word.status === "learning");

export const LearningPractice = () => {
  const { allWords } = useMyWords();
  const learningWords = getLearningWords(allWords);
  const options = [
    { label: "Cards", description: "Reveal and hear each German target.", to: "/practice/cards/learning", icon: FaLayerGroup },
    { label: "Quiz", description: "Choose the correct German translation.", to: "/practice/quiz/learning", icon: FaQuestionCircle },
    { label: "Spelling", description: "Build each German target letter by letter.", to: "/practice/spelling/learning", icon: FaKeyboard },
    ...(learningWords.length >= 2
      ? [{ label: "Pair", description: "Match English and German, with pronunciation.", to: "/practice/pair/learning", icon: FaClone }]
      : []),
  ];

  return (
    <Wrapper>
      <Header>
        <Eyebrow>Focused vocabulary practice</Eyebrow>
        <h1>Continue Learning</h1>
        <p>Practise only words you marked Learning. Sessions are limited to {LEARNING_SESSION_LIMIT} items.</p>
      </Header>
      {learningWords.length === 0 ? (
        <Empty>
          <strong>Mark words you want to practise.</strong>
          <span>Use “Learn this” in the Vocabulary Library to build your queue.</span>
          <BrowseLink to="/learn/vocabulary?browse=1">Browse vocabulary</BrowseLink>
        </Empty>
      ) : (
        <>
          <Count aria-live="polite"><strong>Learning: {learningWords.length}</strong><span>{learningWords.length === 1 ? "1 word" : `${learningWords.length} words`} ready</span></Count>
          <Grid>
            {options.map(({ label, description, to, icon: Icon }) => (
              <Option key={label} to={to}>
                <Icon aria-hidden="true" />
                <strong>{label}</strong>
                <span>{description}</span>
              </Option>
            ))}
          </Grid>
          <QueueLink to="/learn/vocabulary?filter=learning">View Learning words</QueueLink>
        </>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.main`inline-size: min(100%, 48rem); min-block-size: 100vh; padding: 1.25rem 1rem 7rem;`;
const Header = styled.header`h1 { margin: 0; color: ${theme.colors.text}; } p { margin: 0.45rem 0 1rem; color: ${theme.colors.textMuted}; line-height: 1.5; }`;
const Eyebrow = styled.span`display: block; margin-bottom: 0.3rem; color: ${theme.colors.primaryPressed}; font-size: 0.75rem; font-weight: 900; letter-spacing: 0.08em; text-transform: uppercase;`;
const Count = styled.div`display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; margin-bottom: 0.8rem; padding: 0.8rem 1rem; color: ${theme.colors.text}; background: ${theme.colors.primarySoft}; border: 1px solid ${theme.colors.primary}; border-radius: ${theme.radius.medium}; span { color: ${theme.colors.textMuted}; font-size: 0.82rem; }`;
const Grid = styled.div`display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.75rem; @media (max-width: 22rem) { grid-template-columns: 1fr; }`;
const Option = styled(Link)`min-inline-size: 0; min-block-size: 8.5rem; display: flex; flex-direction: column; justify-content: center; gap: 0.5rem; padding: 1rem; color: ${theme.colors.text}; background: ${theme.colors.surface}; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.medium}; box-shadow: ${theme.shadow.soft}; text-decoration: none; svg { color: ${theme.colors.primary}; font-size: 1.35rem; } span { color: ${theme.colors.textMuted}; font-size: 0.8rem; line-height: 1.4; } &:focus-visible { outline: 3px solid ${theme.colors.primarySoft}; outline-offset: 2px; }`;
const Empty = styled.section`display: grid; gap: 0.55rem; padding: 1.2rem; color: ${theme.colors.text}; background: ${theme.colors.surface}; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.medium}; box-shadow: ${theme.shadow.soft}; span { color: ${theme.colors.textMuted}; line-height: 1.45; }`;
const BrowseLink = styled(Link)`min-block-size: 2.75rem; display: inline-flex; align-items: center; justify-content: center; justify-self: start; margin-top: 0.3rem; padding-inline: 1rem; color: white; background: ${theme.colors.navy}; border-radius: ${theme.radius.small}; text-decoration: none; font-weight: 800;`;
const QueueLink = styled(Link)`min-block-size: 2.75rem; display: inline-flex; align-items: center; margin-top: 0.8rem; color: ${theme.colors.primaryPressed}; font-weight: 800;`;
