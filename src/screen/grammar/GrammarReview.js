import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaCheck, FaExclamationTriangle, FaRedo } from "react-icons/fa";
import { GERMAN_B1_GRAMMAR_LESSONS, getGermanGrammarLesson, getGrammarState } from "../../data/grammar/index";
import { useProgress } from "../../i18n/ProgressProvider";
import { theme } from "../../styles/theme";

const LessonCards = ({ lessons, empty }) => lessons.length ? (
  <CardGrid>{lessons.map(({ lesson, state }) => <LessonCard key={lesson.id} to={`/learn/grammar/${lesson.id}/practice`}><strong>{lesson.title}</strong><span>{state.status.replace("-", " ")} · {state.masteryScore}% mastery</span></LessonCard>)}</CardGrid>
) : <Empty>{empty}</Empty>;

export const GrammarReview = () => {
  const { progress, resolveGrammarMistake } = useProgress();
  const states = GERMAN_B1_GRAMMAR_LESSONS.map((lesson) => ({ lesson, state: getGrammarState(progress.grammarLessonStates, lesson.id) }));
  const mistakes = progress.grammarMistakes.filter(({ resolvedAt }) => !resolvedAt);
  const incomplete = states.filter(({ state }) => state.status === "learning");
  const lowMastery = states.filter(({ state }) => state.correctCount + state.incorrectCount > 0 && state.masteryScore < 70);
  const completed = states.filter(({ state }) => state.status === "completed");

  return (
    <Wrapper>
      <Header><Eyebrow>Focused grammar practice</Eyebrow><h1>Grammar Review</h1><p>Grammar mistakes stay separate from vocabulary review and remain available until resolved.</p></Header>
      <Section><h2>Recent grammar mistakes <Count>{mistakes.length}</Count></h2>
        {mistakes.length ? <MistakeList>{mistakes.map((item) => {
          const lesson = getGermanGrammarLesson(item.grammarLessonId || item.lessonId);
          return <MistakeCard key={item.id}><FaExclamationTriangle aria-hidden="true" /><div><strong>{item.prompt}</strong><span>Your answer: {item.learnerAnswer || "No answer recorded"}</span><span>Correct answer: {item.correctAnswer || "Review the lesson"}</span><p>{item.explanation}</p><Actions><Link to={`/learn/grammar/${lesson?.id || item.lessonId}/practice`}><FaRedo aria-hidden="true" /> Retry lesson</Link><button type="button" onClick={() => resolveGrammarMistake(item.id)}><FaCheck aria-hidden="true" /> Mark resolved</button></Actions></div></MistakeCard>;
        })}</MistakeList> : <Empty>No unresolved grammar mistakes. Keep practising.</Empty>}
      </Section>
      <Section><h2>Incomplete lessons <Count>{incomplete.length}</Count></h2><LessonCards lessons={incomplete} empty="Open a grammar lesson to begin." /></Section>
      <Section><h2>Low mastery <Count>{lowMastery.length}</Count></h2><LessonCards lessons={lowMastery} empty="No lesson is currently below 70% mastery." /></Section>
      <Section><h2>Completed lessons <Count>{completed.length}</Count></h2><LessonCards lessons={completed} empty="Completed lessons will appear here." /></Section>
      <BackLink to="/learn/grammar">Back to Grammar</BackLink>
    </Wrapper>
  );
};

const Wrapper = styled.main`inline-size: min(100%, 52rem); min-block-size: 100vh; padding: 1rem 1rem 7rem;`;
const Header = styled.header`& h1 { margin: 0; color: ${theme.colors.navy}; font-size: clamp(1.8rem, 7vw, 2.4rem); } & p { margin: 0.45rem 0 0; color: ${theme.colors.textMuted}; line-height: 1.5; }`;
const Eyebrow = styled.p`margin: 0 0 0.25rem !important; color: ${theme.colors.primaryPressed} !important; font-size: 0.75rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.08em;`;
const Section = styled.section`margin-top: 1.25rem; & h2 { display: flex; align-items: center; gap: 0.5rem; margin: 0 0 0.6rem; color: ${theme.colors.text}; font-size: 1.15rem; }`;
const Count = styled.span`padding: 0.2rem 0.45rem; color: ${theme.colors.primaryPressed}; background: ${theme.colors.primarySoft}; border-radius: ${theme.radius.pill}; font-size: 0.7rem;`;
const MistakeList = styled.div`display: grid; gap: 0.65rem;`;
const MistakeCard = styled.article`min-inline-size: 0; display: grid; grid-template-columns: 1.25rem minmax(0, 1fr); gap: 0.6rem; padding: 0.85rem; background: #fff8e6; border: 1px solid #f3cc72; border-radius: ${theme.radius.medium}; & > svg { color: #8a5700; } & div { min-inline-size: 0; display: grid; gap: 0.2rem; } & strong, & span { overflow-wrap: anywhere; } & span { color: ${theme.colors.textMuted}; font-size: 0.82rem; } & p { margin: 0.2rem 0 0; color: ${theme.colors.textMuted}; font-size: 0.82rem; line-height: 1.4; }`;
const Actions = styled.div`display: flex !important; flex-wrap: wrap; gap: 0.45rem !important; margin-top: 0.5rem; & a, & button { min-block-size: 2.75rem; display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.5rem 0.65rem; color: ${theme.colors.primaryPressed}; background: white; border: 1px solid ${theme.colors.primary}; border-radius: ${theme.radius.small}; text-decoration: none; font-weight: 800; }`;
const CardGrid = styled.div`display: grid; gap: 0.55rem; grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));`;
const LessonCard = styled(Link)`min-block-size: 4.5rem; display: grid; align-content: center; gap: 0.2rem; padding: 0.75rem; color: ${theme.colors.text}; background: ${theme.colors.surface}; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.medium}; text-decoration: none; & span { color: ${theme.colors.textMuted}; font-size: 0.75rem; text-transform: capitalize; }`;
const Empty = styled.p`margin: 0; padding: 0.8rem; color: ${theme.colors.textMuted}; background: ${theme.colors.surfaceMuted}; border-radius: ${theme.radius.small};`;
const BackLink = styled(Link)`min-block-size: 2.75rem; display: inline-flex; align-items: center; margin-top: 1.2rem; padding-inline: 1rem; color: ${theme.colors.text}; background: white; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.small}; text-decoration: none; font-weight: 800;`;
