import { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { FaCheck, FaExclamationTriangle, FaPlay, FaVolumeUp } from "react-icons/fa";
import { CompactSoundButton } from "../../components/CompactSoundButton";
import { TARGET_LANGUAGE } from "../../config/course";
import { getGermanGrammarLesson, getGrammarState } from "../../data/grammar/index";
import { useProgress } from "../../i18n/ProgressProvider";
import { theme } from "../../styles/theme";

export const GermanGrammarLesson = () => {
  const { grammarLessonId } = useParams();
  const progressContext = useProgress();
  const openedRef = useRef(null);
  const lesson = getGermanGrammarLesson(grammarLessonId);

  useEffect(() => {
    if (lesson && openedRef.current !== lesson.id) {
      openedRef.current = lesson.id;
      progressContext.recordGrammarOpened(lesson.id);
    }
  }, [lesson, progressContext]);

  if (!lesson) return <Wrapper><h1>Grammar lesson not found</h1><BackLink to="/learn/grammar">Back to Grammar</BackLink></Wrapper>;
  const state = getGrammarState(progressContext.progress.grammarLessonStates, lesson.id);
  const markReviewed = () => progressContext.recordGrammarCompletion({
    lessonId: lesson.id,
    route: `/learn/grammar/${lesson.id}`,
    title: lesson.title,
    reviewed: true,
  });

  return (
    <Wrapper>
      <Header>
        <Eyebrow>{lesson.stage === "foundation-review" ? "Foundation Review" : "B1 Core"}</Eyebrow>
        <Heading>{lesson.title}</Heading>
        <Summary>{lesson.shortDescription}</Summary>
        <Explanation>{lesson.explanation}</Explanation>
        <SkillList aria-label="Exam skills">{lesson.examSkills.map((skill) => <Skill key={skill}>{skill}</Skill>)}</SkillList>
      </Header>

      <Section aria-labelledby="rules-heading">
        <SectionTitle id="rules-heading">Rules</SectionTitle>
        <RuleList>
          {lesson.rules.map((item) => (
            <RuleCard key={item.id}>
              <h3>{item.title}</h3><p>{item.explanation}</p><Pattern>{item.pattern}</Pattern>
              {item.table && (
                <TableScroller tabIndex="0" aria-label={`${item.table.caption} table, scroll horizontally if needed`}>
                  <RuleTable>
                    <caption>{item.table.caption}</caption>
                    <thead><tr>{item.table.headers.map((header) => <th scope="col" key={header}>{header}</th>)}</tr></thead>
                    <tbody>{item.table.rows.map((row, index) => <tr key={`${item.id}-row-${index}`}>{row.map((cell, cellIndex) => <td key={`${cell}-${cellIndex}`}>{cell}</td>)}</tr>)}</tbody>
                  </RuleTable>
                </TableScroller>
              )}
            </RuleCard>
          ))}
        </RuleList>
      </Section>

      <Section aria-labelledby="examples-heading">
        <SectionTitle id="examples-heading">Examples</SectionTitle>
        <Examples>
          {lesson.examples.map((item) => (
            <Example key={item.id}>
              <div><strong lang="de">{item.german}</strong><span>{item.english}</span></div>
              <CompactSoundButton text={item.german} lang={TARGET_LANGUAGE} ariaLabel={`Hear German example: ${item.german}`}><FaVolumeUp aria-hidden="true" /></CompactSoundButton>
            </Example>
          ))}
        </Examples>
      </Section>

      <Section aria-labelledby="mistakes-heading">
        <SectionTitle id="mistakes-heading">Common mistakes</SectionTitle>
        <Mistakes>
          {lesson.commonMistakes.map((item) => (
            <Mistake key={item.id}>
              <FaExclamationTriangle aria-hidden="true" />
              <div><del lang="de">{item.wrong}</del><strong lang="de">{item.correct}</strong><p>{item.explanation}</p></div>
            </Mistake>
          ))}
        </Mistakes>
      </Section>

      <PracticeCard>
        <div><h2>Lesson practice</h2><p>{lesson.practice.length} questions · lesson practice only, not Goethe exam scoring.</p></div>
        <PrimaryLink to={`/learn/grammar/${lesson.id}/practice`}><FaPlay aria-hidden="true" /> Start Practice</PrimaryLink>
      </PracticeCard>
      {lesson.stage === "foundation-review" && (
        <ReviewButton type="button" $completed={state.status === "completed"} onClick={markReviewed}>
          <FaCheck aria-hidden="true" /> {state.status === "completed" ? "Foundation lesson reviewed" : "Mark foundation lesson as reviewed"}
        </ReviewButton>
      )}
      <BackLink to="/learn/grammar">Back to Grammar</BackLink>
    </Wrapper>
  );
};

const Wrapper = styled.main`inline-size: min(100%, 52rem); min-block-size: 100vh; padding: 1rem 1rem 7rem;`;
const Header = styled.header`margin-bottom: 1rem;`;
const Eyebrow = styled.p`margin: 0 0 0.25rem; color: ${theme.colors.primaryPressed}; font-size: 0.75rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.08em;`;
const Heading = styled.h1`margin: 0; color: ${theme.colors.navy}; font-size: clamp(1.75rem, 7vw, 2.45rem); overflow-wrap: anywhere;`;
const Summary = styled.p`margin: 0.45rem 0 0; color: ${theme.colors.primaryPressed}; font-weight: 800; line-height: 1.45;`;
const Explanation = styled.p`margin: 0.45rem 0 0; color: ${theme.colors.textMuted}; line-height: 1.6;`;
const SkillList = styled.div`display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: 0.7rem;`;
const Skill = styled.span`padding: 0.25rem 0.5rem; color: ${theme.colors.text}; background: ${theme.colors.surfaceMuted}; border-radius: ${theme.radius.pill}; font-size: 0.72rem; font-weight: 800; text-transform: capitalize;`;
const Section = styled.section`margin-top: 1.2rem;`;
const SectionTitle = styled.h2`margin: 0 0 0.65rem; color: ${theme.colors.text}; font-size: 1.2rem;`;
const RuleList = styled.div`display: grid; gap: 0.7rem;`;
const RuleCard = styled.article`min-inline-size: 0; padding: 0.9rem; background: ${theme.colors.surface}; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.medium}; box-shadow: ${theme.shadow.soft}; & h3 { margin: 0; color: ${theme.colors.navy}; font-size: 1rem; } & p { margin: 0.35rem 0; color: ${theme.colors.textMuted}; line-height: 1.5; }`;
const Pattern = styled.code`display: block; overflow-wrap: anywhere; padding: 0.6rem; color: ${theme.colors.primaryPressed}; background: ${theme.colors.primarySoft}; border-radius: ${theme.radius.small}; font-family: inherit; font-weight: 800;`;
const TableScroller = styled.div`max-inline-size: 100%; overflow-x: auto; margin-top: 0.75rem; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.small}; &:focus-visible { outline: 3px solid ${theme.colors.primarySoft}; outline-offset: 2px; }`;
const RuleTable = styled.table`inline-size: 100%; min-inline-size: 29rem; border-collapse: collapse; background: ${theme.colors.surface}; & caption { padding: 0.5rem; text-align: left; font-weight: 900; } & th, & td { padding: 0.6rem; border-top: 1px solid ${theme.colors.border}; text-align: left; } & th { background: ${theme.colors.surfaceMuted}; font-size: 0.78rem; } & td { font-size: 0.82rem; }`;
const Examples = styled.div`display: grid; gap: 0.55rem;`;
const Example = styled.article`min-inline-size: 0; display: flex; align-items: center; justify-content: space-between; gap: 0.65rem; padding: 0.8rem; background: ${theme.colors.surface}; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.medium}; & > div { min-inline-size: 0; display: grid; gap: 0.2rem; } & strong { color: ${theme.colors.primaryPressed}; overflow-wrap: anywhere; } & span { color: ${theme.colors.textMuted}; font-size: 0.83rem; line-height: 1.4; }`;
const Mistakes = styled.div`display: grid; gap: 0.6rem;`;
const Mistake = styled.aside`display: flex; align-items: flex-start; gap: 0.65rem; padding: 0.85rem; background: #fff8e6; border: 1px solid #f3cc72; border-radius: ${theme.radius.medium}; & > svg { flex: 0 0 auto; margin-top: 0.15rem; color: #8a5700; } & div { min-inline-size: 0; display: grid; gap: 0.2rem; } & del { color: ${theme.colors.error}; overflow-wrap: anywhere; } & strong { color: ${theme.colors.success}; overflow-wrap: anywhere; } & p { margin: 0.15rem 0 0; color: ${theme.colors.textMuted}; line-height: 1.45; }`;
const PracticeCard = styled.section`display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.8rem; margin-top: 1.2rem; padding: 1rem; color: white; background: ${theme.colors.navy}; border-radius: ${theme.radius.large}; & h2 { margin: 0; font-size: 1.15rem; } & p { margin: 0.3rem 0 0; color: rgba(255,255,255,0.75); font-size: 0.82rem; }`;
const PrimaryLink = styled(Link)`min-block-size: 2.75rem; display: inline-flex; align-items: center; gap: 0.45rem; padding: 0.6rem 0.8rem; color: ${theme.colors.navy}; background: white; border-radius: ${theme.radius.small}; text-decoration: none; font-weight: 900; &:focus-visible { outline: 3px solid ${theme.colors.primary}; outline-offset: 2px; }`;
const ReviewButton = styled.button`min-block-size: 2.75rem; display: inline-flex; align-items: center; gap: 0.45rem; margin-top: 0.9rem; padding: 0.55rem 0.8rem; color: ${(props) => props.$completed ? theme.colors.success : theme.colors.primaryPressed}; background: ${(props) => props.$completed ? theme.colors.successSoft : theme.colors.primarySoft}; border: 1px solid ${(props) => props.$completed ? theme.colors.success : theme.colors.primary}; border-radius: ${theme.radius.small}; font-weight: 900;`;
const BackLink = styled(Link)`min-block-size: 2.75rem; display: inline-flex; align-items: center; margin: 0.9rem 0 0 0.5rem; padding-inline: 1rem; color: ${theme.colors.text}; background: ${theme.colors.surface}; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.small}; text-decoration: none; font-weight: 800;`;
