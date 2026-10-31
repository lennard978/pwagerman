import { Link } from "react-router-dom";
import styled from "styled-components";
import { theme } from "../../styles/theme";
import { getGermanGrammarLesson } from "../../data/grammar/lessons";

export const ReadingResults = ({ session, onReview, onRestart, onNewSet }) => {
  const { score } = session;
  const simulation = session.mode === "simulation";
  return (
    <ResultsPage>
      <Eyebrow>{simulation ? "Reading Practice Simulation result" : `Part ${session.currentPart} practice complete`}</Eyebrow>
      <h1>{simulation ? (score.passed ? "Module passed" : "Keep practising") : "Practice results"}</h1>
      <ScoreGrid>
        <ScoreCard><span>{simulation ? "Raw score" : "Correct answers"}</span><strong>{score.rawScore}/{score.total}</strong></ScoreCard>
        <ScoreCard><span>{simulation ? "Result score" : "Practice accuracy"}</span><strong>{score.resultScore}/100</strong></ScoreCard>
        {simulation && <ScoreCard $status={score.passed}><span>Status</span><strong>{score.passed ? "Passed" : "Not passed"}</strong></ScoreCard>}
      </ScoreGrid>
      {simulation && <Descriptor>{score.descriptor.label} · pass threshold 60/100</Descriptor>}

      <h2>Practice breakdown</h2>
      <Breakdown>
        {score.partBreakdown.map((part) => <li key={part.partNumber}><span>Part {part.partNumber}</span><b>{part.score}/{part.total}</b></li>)}
      </Breakdown>

      <InsightGrid>
        <Insight><span>Strongest skill</span><strong>{score.strongestSkill || "Not enough data"}</strong></Insight>
        <Insight><span>Needs review</span><strong>{score.needsReview || "Not enough data"}</strong></Insight>
      </InsightGrid>
      {score.recommendation && (
        <Recommendation>
          <div><span>Recommended next step</span><strong>{score.recommendation.title}</strong><p>Review the linked grammar topics, then retry a fresh form.</p></div>
          <RecommendationLinks>
            {score.recommendation.grammarRefs.map((lessonId) => {
              const lesson = getGermanGrammarLesson(lessonId);
              return lesson ? <Link key={lessonId} to={`/learn/grammar/${lessonId}`}>{lesson.title}</Link> : null;
            })}
            {score.recommendation.vocabularyCategoryIds?.map((categoryId) => (
              <Link key={categoryId} to={`/learn/vocabulary/${categoryId}`}>Related vocabulary</Link>
            ))}
            <Link to="/practice/grammar">Grammar practice →</Link>
          </RecommendationLinks>
        </Recommendation>
      )}
      <Actions>
        <Primary type="button" onClick={onReview}>Review every answer</Primary>
        <Secondary type="button" onClick={onRestart}>{simulation ? "Start another form" : "Retry this set"}</Secondary>
        {!simulation && <Secondary type="button" onClick={onNewSet}>New set</Secondary>}
        <Secondary as={Link} to="/exam/reading">Reading home</Secondary>
      </Actions>
      {simulation && <FinePrint>The raw score is converted with the fixed 0–30 Reading score table. The 60/100 threshold and descriptors are shown for practice guidance.</FinePrint>}
    </ResultsPage>
  );
};

const ResultsPage = styled.section`inline-size: min(100%, 52rem); margin-inline: auto; padding: 1rem 0 2rem; h1 { margin: .25rem 0 1rem; font-size: clamp(2rem, 7vw, 3.5rem); } h2 { margin: 1.5rem 0 .6rem; }`;
const Eyebrow = styled.span`color: ${theme.colors.primaryPressed}; font-size: .75rem; font-weight: 900; letter-spacing: .08em; text-transform: uppercase;`;
const ScoreGrid = styled.div`display: grid; grid-template-columns: repeat(3, 1fr); gap: .7rem; @media (max-width: 35rem) { grid-template-columns: 1fr; }`;
const ScoreCard = styled.div`padding: 1rem; border: 1px solid ${({ $status }) => $status === undefined ? theme.colors.border : $status ? theme.colors.success : theme.colors.error}; border-radius: ${theme.radius.medium}; background: ${theme.colors.surface}; span { display: block; color: ${theme.colors.textMuted}; font-size: .78rem; } strong { display: block; margin-top: .25rem; font-size: 1.35rem; }`;
const Descriptor = styled.p`margin: .8rem 0 0; color: ${theme.colors.textMuted}; font-weight: 700;`;
const Breakdown = styled.ul`display: grid; grid-template-columns: repeat(5, 1fr); gap: .5rem; margin: 0; padding: 0; list-style: none; li { display: flex; flex-direction: column; gap: .2rem; padding: .7rem; border-radius: ${theme.radius.small}; background: ${theme.colors.surfaceMuted}; font-size: .8rem; } b { font-size: 1rem; } @media (max-width: 36rem) { grid-template-columns: repeat(2, 1fr); }`;
const InsightGrid = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: .7rem; margin-top: 1rem; @media (max-width: 30rem) { grid-template-columns: 1fr; }`;
const Insight = styled.div`padding: .9rem; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.small}; span { display: block; color: ${theme.colors.textMuted}; font-size: .76rem; } strong { text-transform: capitalize; }`;
const Recommendation = styled.div`display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-top: 1rem; padding: 1rem; border-radius: ${theme.radius.medium}; background: ${theme.colors.primarySoft}; span { display: block; color: ${theme.colors.primaryPressed}; font-size: .75rem; font-weight: 900; text-transform: uppercase; } strong { display: block; margin-top: .2rem; } p { margin: .3rem 0 0; color: ${theme.colors.textMuted}; } a { color: ${theme.colors.primaryPressed}; font-weight: 900; } @media (max-width: 34rem) { align-items: start; flex-direction: column; }`;
const RecommendationLinks = styled.div`display: flex; flex-direction: column; align-items: flex-end; gap: .35rem; text-align: right; @media (max-width: 34rem) { align-items: flex-start; text-align: left; }`;
const Actions = styled.div`display: flex; flex-wrap: wrap; gap: .6rem; margin-top: 1.4rem;`;
const Primary = styled.button`min-block-size: 3rem; padding: .7rem 1rem; border: 0; border-radius: ${theme.radius.small}; background: ${theme.colors.primary}; color: white; font: inherit; font-weight: 900; cursor: pointer;`;
const Secondary = styled(Primary)`display: inline-flex; align-items: center; justify-content: center; border: 1px solid ${theme.colors.border}; background: ${theme.colors.surface}; color: ${theme.colors.text}; text-decoration: none;`;
const FinePrint = styled.p`color: ${theme.colors.textMuted}; font-size: .74rem; line-height: 1.45;`;
