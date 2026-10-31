import { Link } from "react-router-dom";
import styled from "styled-components";
import { getGermanGrammarLesson } from "../../data/grammar/lessons";
import { theme } from "../../styles/theme";

export const ListeningResults = ({ session, onReview, onRestart, onNewSet }) => {
  const { score } = session;
  const simulation = session.mode === "simulation";
  return (
    <Page>
      <Eyebrow>{simulation ? "Listening Practice Simulation result" : `Part ${session.currentPart} practice complete`}</Eyebrow>
      <h1>{simulation ? (score.passed ? "Module passed" : "Keep practising") : "Practice results"}</h1>
      <Scores>
        <Score><span>{simulation ? "Raw score" : "Correct answers"}</span><strong>{score.rawScore}/{score.total}</strong></Score>
        <Score><span>{simulation ? "Result score" : "Practice accuracy"}</span><strong>{score.resultScore}/100</strong></Score>
        {simulation && <Score $status={score.passed}><span>Status</span><strong>{score.passed ? "Passed" : "Not passed"}</strong></Score>}
      </Scores>
      {simulation && <Descriptor>{score.descriptor.label} · threshold 60/100</Descriptor>}
      <h2>Practice breakdown</h2>
      <Breakdown>{score.partBreakdown.map((part) => <li key={part.partNumber}><span>Part {part.partNumber}</span><b>{part.score}/{part.total}</b></li>)}</Breakdown>
      <Insights><div><span>Strongest skill</span><strong>{score.strongestSkill || "Not enough data"}</strong></div><div><span>Needs review</span><strong>{score.needsReview || "Not enough data"}</strong></div></Insights>
      {score.recommendation && (
        <Recommendation>
          <div><span>Recommended next step</span><strong>{score.recommendation.title}</strong><p>Use these internal lessons as focused follow-up, not as a diagnosis.</p></div>
          <Links>{score.recommendation.grammarRefs.map((lessonId) => { const lesson = getGermanGrammarLesson(lessonId); return lesson ? <Link key={lessonId} to={`/learn/grammar/${lessonId}`}>{lesson.title}</Link> : null; })}</Links>
        </Recommendation>
      )}
      <Actions><Primary type="button" onClick={onReview}>Review answers and transcripts</Primary><Secondary type="button" onClick={onRestart}>{simulation ? "Start another form" : "Retry this set"}</Secondary>{!simulation && <Secondary type="button" onClick={onNewSet}>New set</Secondary>}<Secondary as={Link} to="/exam/listening">Listening home</Secondary></Actions>
      {simulation && <FinePrint>This is a practice simulation result, not an official certificate result. Part figures are app analytics only.</FinePrint>}
    </Page>
  );
};

const Page = styled.section`inline-size: min(100%, 52rem); margin-inline: auto; padding: 1rem 0 2rem; h1 { margin: .25rem 0 1rem; font-size: clamp(2rem, 7vw, 3.4rem); } h2 { margin: 1.5rem 0 .6rem; }`;
const Eyebrow = styled.span`color: ${theme.colors.primaryPressed}; font-size: .75rem; font-weight: 900; letter-spacing: .08em; text-transform: uppercase;`;
const Scores = styled.div`display: grid; grid-template-columns: repeat(3, 1fr); gap: .7rem; @media (max-width: 35rem) { grid-template-columns: 1fr; }`;
const Score = styled.div`padding: 1rem; border: 1px solid ${({ $status }) => $status === undefined ? theme.colors.border : $status ? theme.colors.success : theme.colors.error}; border-radius: ${theme.radius.medium}; background: ${theme.colors.surface}; span { display: block; color: ${theme.colors.textMuted}; font-size: .78rem; } strong { display: block; margin-top: .25rem; font-size: 1.35rem; }`;
const Descriptor = styled.p`color: ${theme.colors.textMuted}; font-weight: 800;`;
const Breakdown = styled.ul`display: grid; grid-template-columns: repeat(4, 1fr); gap: .5rem; margin: 0; padding: 0; list-style: none; li { display: flex; flex-direction: column; padding: .7rem; border-radius: ${theme.radius.small}; background: ${theme.colors.surfaceMuted}; } @media (max-width: 32rem) { grid-template-columns: repeat(2, 1fr); }`;
const Insights = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: .7rem; margin-top: 1rem; div { padding: .8rem; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.small}; } span { display: block; color: ${theme.colors.textMuted}; font-size: .75rem; } strong { text-transform: capitalize; } @media (max-width: 30rem) { grid-template-columns: 1fr; }`;
const Recommendation = styled.div`display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-top: 1rem; padding: 1rem; border-radius: ${theme.radius.medium}; background: ${theme.colors.primarySoft}; span { color: ${theme.colors.primaryPressed}; font-size: .72rem; font-weight: 900; text-transform: uppercase; } strong { display: block; } p { margin: .3rem 0 0; color: ${theme.colors.textMuted}; } @media (max-width: 34rem) { align-items: start; flex-direction: column; }`;
const Links = styled.div`display: flex; flex-direction: column; align-items: flex-end; gap: .3rem; a { color: ${theme.colors.primaryPressed}; font-weight: 800; } @media (max-width: 34rem) { align-items: flex-start; }`;
const Actions = styled.div`display: flex; flex-wrap: wrap; gap: .55rem; margin-top: 1.3rem;`;
const Primary = styled.button`min-block-size: 3rem; padding: .7rem 1rem; border: 0; border-radius: ${theme.radius.small}; background: ${theme.colors.primary}; color: white; font: inherit; font-weight: 900; cursor: pointer;`;
const Secondary = styled(Primary)`display: inline-flex; align-items: center; justify-content: center; border: 1px solid ${theme.colors.border}; background: ${theme.colors.surface}; color: ${theme.colors.text}; text-decoration: none;`;
const FinePrint = styled.p`color: ${theme.colors.textMuted}; font-size: .74rem; line-height: 1.45;`;
