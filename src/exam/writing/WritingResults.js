import { Link } from "react-router-dom";
import styled from "styled-components";
import { theme } from "../../styles/theme";
import { WRITING_RUBRIC, WRITING_RUBRIC_SCALE } from "../config/goetheB1Writing";

export const WritingResults = ({ form, session, onAssess, onCompleteAssessment, onReview, onRestart, onNewPrompt }) => {
  const tasks = session.mode === "practice" ? form.tasks.filter(({ part }) => part === session.currentTask) : form.tasks;
  const assessmentComplete = WRITING_RUBRIC.every(({ id }) => Number.isInteger(session.selfAssessment?.[id]));
  return (
    <Page>
      <Eyebrow>{session.mode === "simulation" ? "Writing Practice Simulation completed" : `Task ${session.currentTask} practice completed`}</Eyebrow>
      <h1>Writing practice completed</h1>
      <p>Your drafts are saved exactly as submitted. This page does not calculate an official score or pass/fail result.</p>
      <WordGrid>{tasks.map((task) => <div key={task.id}><span>Task {task.part}</span><strong>{session.submittedDrafts[task.id].wordCount} words</strong><small>target about {task.approximateWordTarget}</small></div>)}</WordGrid>
      <Rubric aria-labelledby="writing-rubric-title">
        <h2 id="writing-rubric-title">Self-assessed practice estimate</h2>
        <Intro>Choose the description that best matches your submitted work. This transparent app self-assessment is not official Goethe grading.</Intro>
        {WRITING_RUBRIC.map((dimension) => (
          <fieldset key={dimension.id}>
            <legend>{dimension.label}</legend>
            <p>{dimension.description}</p>
            <Scale>{WRITING_RUBRIC_SCALE.map((option) => <label key={option.value}><input type="radio" name={`rubric-${dimension.id}`} value={option.value} checked={session.selfAssessment[dimension.id] === option.value} onChange={() => onAssess(dimension.id, option.value)} /><span><b>{option.value}</b>{option.label}</span></label>)}</Scale>
          </fieldset>
        ))}
        <Complete type="button" disabled={!assessmentComplete} onClick={onCompleteAssessment}>{session.assessmentCompletedAt ? "Self-assessment saved" : "Save self-assessment"}</Complete>
      </Rubric>
      <Actions><Primary type="button" onClick={onReview}>Review submitted writing</Primary><Secondary type="button" onClick={onRestart}>{session.mode === "simulation" ? "Start another form" : "Retry this prompt"}</Secondary>{session.mode === "practice" && <Secondary type="button" onClick={onNewPrompt}>New prompt</Secondary>}<Secondary as={Link} to="/exam/writing">Writing home</Secondary></Actions>
      <FinePrint>Independent preparation tool. Not affiliated with or endorsed by the Goethe-Institut.</FinePrint>
    </Page>
  );
};

const Page = styled.section`inline-size:min(100%,56rem);margin-inline:auto;padding:1rem 0 2rem;h1{margin:.3rem 0 .6rem;font-size:clamp(2rem,7vw,3.4rem);}p{color:${theme.colors.textMuted};line-height:1.5;}`;
const Eyebrow = styled.span`color:${theme.colors.primaryPressed};font-size:.74rem;font-weight:900;letter-spacing:.08em;text-transform:uppercase;`;
const WordGrid = styled.div`display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,10rem),1fr));gap:.65rem;margin:1rem 0 1.5rem;div{padding:1rem;border:1px solid ${theme.colors.border};border-radius:${theme.radius.medium};background:${theme.colors.surface};}span,small{display:block;color:${theme.colors.textMuted};font-size:.75rem;}strong{display:block;margin:.2rem 0;font-size:1.25rem;}`;
const Rubric = styled.section`padding:clamp(1rem,3vw,1.5rem);border-radius:${theme.radius.large};background:${theme.colors.surfaceMuted};h2{margin:0;}fieldset{margin:1rem 0 0;padding:0;border:0;}legend{font-weight:900;}fieldset>p{margin:.25rem 0 .55rem;font-size:.78rem;}`;
const Intro = styled.p`margin:.35rem 0 1rem;`;
const Scale = styled.div`display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.4rem;label{min-inline-size:0;}input{position:absolute;opacity:0;}span{min-block-size:4rem;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:.4rem;border:1px solid ${theme.colors.border};border-radius:${theme.radius.small};background:${theme.colors.surface};font-size:.68rem;text-align:center;cursor:pointer;}input:checked+span{border-color:${theme.colors.primary};background:${theme.colors.primarySoft};}input:focus-visible+span{outline:3px solid ${theme.colors.primarySoft};outline-offset:2px;}b{font-size:1rem;}@media(max-width:34rem){grid-template-columns:repeat(2,1fr);}`;
const Complete = styled.button`min-block-size:3rem;margin-top:.5rem;padding:.7rem 1rem;border:0;border-radius:${theme.radius.small};background:${theme.colors.navy};color:white;font:inherit;font-weight:900;&:disabled{opacity:.45;}`;
const Actions = styled.div`display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1rem;`;
const Primary = styled.button`min-block-size:3rem;padding:.7rem 1rem;border:0;border-radius:${theme.radius.small};background:${theme.colors.primary};color:white;font:inherit;font-weight:900;`;
const Secondary = styled(Primary)`display:inline-flex;align-items:center;justify-content:center;border:1px solid ${theme.colors.border};background:${theme.colors.surface};color:${theme.colors.text};text-decoration:none;`;
const FinePrint = styled.p`font-size:.72rem;`;
