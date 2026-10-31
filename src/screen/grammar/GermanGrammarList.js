import { Link, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { FaBookOpen, FaCheck, FaClipboardCheck, FaRedo } from "react-icons/fa";
import {
  GERMAN_B1_GRAMMAR_LESSONS,
  GRAMMAR_STAGES,
  getGrammarState,
} from "../../data/grammar/index";
import { useProgress } from "../../i18n/ProgressProvider";
import { theme } from "../../styles/theme";

const focusCategories = {
  cases: ["cases-articles"],
  verbs: ["verb-forms", "tenses", "passive-mood"],
  "word-order": ["sentence-structure", "relative-clauses"],
  connectors: ["connectors", "writing-cohesion"],
  adjectives: ["adjective-forms"],
};

export const GermanGrammarList = () => {
  const { progress } = useProgress();
  const [searchParams] = useSearchParams();
  const focus = searchParams.get("focus");
  const allowedCategories = focusCategories[focus] || null;
  const lessons = allowedCategories
    ? GERMAN_B1_GRAMMAR_LESSONS.filter(({ categoryId }) => allowedCategories.includes(categoryId))
    : GERMAN_B1_GRAMMAR_LESSONS;

  return (
    <Wrapper>
      <Header>
        <Eyebrow>German B1 grammar</Eyebrow>
        <Heading>Grammar curriculum</Heading>
        <Description>
          A CEFR B1-oriented curriculum for Goethe-Zertifikat B1 preparation. It is an independent learning sequence, not an official Goethe grammar syllabus.
        </Description>
        <Actions>
          <Action to="/learn/grammar/diagnostic"><FaClipboardCheck aria-hidden="true" /> Foundation diagnostic</Action>
          <Action to="/learn/grammar/review"><FaRedo aria-hidden="true" /> Grammar Review</Action>
        </Actions>
        {focus && <FilterNote>Filtered practice pool: <strong>{focus.replace("-", " ")}</strong> · <Link to="/learn/grammar">Show all lessons</Link></FilterNote>}
      </Header>

      {GRAMMAR_STAGES.map((stage) => {
        const stageLessons = lessons.filter((item) => item.stage === stage.id);
        if (!stageLessons.length) return null;
        return (
          <Section key={stage.id} aria-labelledby={`${stage.id}-heading`}>
            <SectionHeader>
              <div><h2 id={`${stage.id}-heading`}>{stage.title}</h2><p>{stage.description}</p></div>
              <Count>{stageLessons.filter(({ id }) => getGrammarState(progress.grammarLessonStates, id).status === "completed").length} / {stageLessons.length}</Count>
            </SectionHeader>
            <List>
              {stageLessons.map((lesson) => {
                const state = getGrammarState(progress.grammarLessonStates, lesson.id);
                return (
                  <LessonLink key={lesson.id} to={`/learn/grammar/${lesson.id}`}>
                    <Number>{GERMAN_B1_GRAMMAR_LESSONS.indexOf(lesson) + 1}</Number>
                    <Copy>
                      <strong>{lesson.title}</strong>
                      <span>{lesson.shortDescription}</span>
                      <Meta>{state.masteryScore}% mastery · {lesson.examSkills.join(" · ")}</Meta>
                    </Copy>
                    <Status $status={state.status} aria-label={`Status: ${state.status}`}>
                      {state.status === "completed" ? <FaCheck aria-hidden="true" /> : <FaBookOpen aria-hidden="true" />}
                      {state.status.replace("-", " ")}
                    </Status>
                  </LessonLink>
                );
              })}
            </List>
          </Section>
        );
      })}
      <BackLink to="/learn">Back to Learn</BackLink>
    </Wrapper>
  );
};

const Wrapper = styled.main`inline-size: min(100%, 58rem); min-block-size: 100vh; padding: 1rem 1rem 7rem;`;
const Header = styled.header`margin-bottom: 1.2rem;`;
const Eyebrow = styled.p`margin: 0 0 0.25rem; color: ${theme.colors.primaryPressed}; font-size: 0.75rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.08em;`;
const Heading = styled.h1`margin: 0; color: ${theme.colors.navy}; font-size: clamp(1.8rem, 7vw, 2.5rem);`;
const Description = styled.p`max-inline-size: 48rem; margin: 0.5rem 0 0; color: ${theme.colors.textMuted}; line-height: 1.55;`;
const Actions = styled.div`display: flex; flex-wrap: wrap; gap: 0.6rem; margin-top: 0.9rem;`;
const Action = styled(Link)`min-block-size: 2.75rem; display: inline-flex; align-items: center; gap: 0.45rem; padding: 0.55rem 0.8rem; color: ${theme.colors.primaryPressed}; background: ${theme.colors.primarySoft}; border: 1px solid ${theme.colors.primary}; border-radius: ${theme.radius.small}; text-decoration: none; font-weight: 800; &:focus-visible { outline: 3px solid ${theme.colors.primarySoft}; outline-offset: 2px; }`;
const FilterNote = styled.p`margin: 0.75rem 0 0; padding: 0.65rem 0.8rem; color: ${theme.colors.text}; background: ${theme.colors.surface}; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.small}; font-size: 0.85rem; & a { color: ${theme.colors.primaryPressed}; font-weight: 800; }`;
const Section = styled.section`margin-top: 1.3rem;`;
const SectionHeader = styled.header`display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: 0.65rem; & h2 { margin: 0; color: ${theme.colors.text}; font-size: 1.25rem; } & p { margin: 0.2rem 0 0; color: ${theme.colors.textMuted}; font-size: 0.85rem; line-height: 1.4; }`;
const Count = styled.span`flex: 0 0 auto; padding: 0.3rem 0.55rem; color: ${theme.colors.primaryPressed}; background: ${theme.colors.primarySoft}; border-radius: ${theme.radius.pill}; font-size: 0.78rem; font-weight: 900;`;
const List = styled.div`display: grid; gap: 0.65rem;`;
const LessonLink = styled(Link)`min-inline-size: 0; min-block-size: 5.5rem; display: grid; grid-template-columns: 2.5rem minmax(0, 1fr); gap: 0.75rem; padding: 0.85rem; color: ${theme.colors.text}; background: ${theme.colors.surface}; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.medium}; box-shadow: ${theme.shadow.soft}; text-decoration: none; @media (min-width: 36rem) { grid-template-columns: 2.5rem minmax(0, 1fr) auto; align-items: center; } &:hover { border-color: ${theme.colors.primary}; } &:focus-visible { outline: 3px solid ${theme.colors.primarySoft}; outline-offset: 2px; }`;
const Number = styled.span`inline-size: 2.3rem; block-size: 2.3rem; display: grid; place-items: center; color: ${theme.colors.primaryPressed}; background: ${theme.colors.primarySoft}; border-radius: ${theme.radius.small}; font-weight: 900;`;
const Copy = styled.span`min-inline-size: 0; display: grid; gap: 0.2rem; & strong { overflow-wrap: anywhere; } & > span { color: ${theme.colors.textMuted}; font-size: 0.82rem; line-height: 1.4; }`;
const Meta = styled.small`color: ${theme.colors.primaryPressed}; font-size: 0.7rem; font-weight: 800; text-transform: capitalize;`;
const Status = styled.span`grid-column: 2; display: inline-flex; align-items: center; gap: 0.35rem; inline-size: fit-content; padding: 0.3rem 0.5rem; color: ${(props) => props.$status === "completed" ? theme.colors.success : theme.colors.textMuted}; background: ${(props) => props.$status === "completed" ? theme.colors.successSoft : theme.colors.surfaceMuted}; border-radius: ${theme.radius.pill}; font-size: 0.7rem; font-weight: 900; text-transform: capitalize; @media (min-width: 36rem) { grid-column: auto; }`;
const BackLink = styled(Link)`min-block-size: 2.75rem; display: inline-flex; align-items: center; margin-top: 1.2rem; padding-inline: 1rem; color: ${theme.colors.text}; background: ${theme.colors.surface}; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.small}; text-decoration: none; font-weight: 800;`;
