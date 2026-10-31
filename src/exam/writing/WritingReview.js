import { Link } from "react-router-dom";
import styled from "styled-components";
import { getGermanGrammarLesson } from "../../data/grammar/lessons";
import { theme } from "../../styles/theme";
import { WRITING_RUBRIC } from "../config/goetheB1Writing";
import { getWritingAutomatedChecks } from "../core/writingState";
import { writingPhraseBank } from "./phraseBank";

const checkLabel = (key) => ({ hasText: "Response is not empty", nearTarget: "Length is near the approximate target", hasParagraphs: "Response uses appropriate paragraphing", greetingPresent: "Email greeting detected", closingPresent: "Email closing detected", checklistComplete: "Manual task checklist completed" }[key]);

export const WritingReview = ({ form, session, onClose, onCreateRevision, onUpdateRevision }) => {
  const tasks = session.mode === "practice" ? form.tasks.filter(({ part }) => part === session.currentTask) : form.tasks;
  return (
    <Page>
      <Top><div><span>Submitted attempt</span><h1>Writing review</h1></div><button type="button" onClick={onClose}>Back to summary</button></Top>
      <Notice>The submitted responses below are immutable. Editing creates a separate practice copy.</Notice>
      {tasks.map((task) => {
        const draft = session.submittedDrafts[task.id];
        const checks = getWritingAutomatedChecks(task, draft);
        const guidance = writingPhraseBank[task.part - 1];
        const revision = [...session.revisionCopies].reverse().find(({ sourceTaskId }) => sourceTaskId === task.id);
        return <Task key={task.id}>
          <h2>Task {task.part} · {task.title}</h2><p><b>Prompt:</b> {task.scenario} {task.prompt}</p>
          <ul>{task.bulletPoints.map((point) => <li key={point}>{point}</li>)}</ul>
          <Response aria-label={`Submitted response for Task ${task.part}`}>{draft.text || "No response submitted."}</Response>
          <Meta>{draft.wordCount} words · {draft.paragraphCount} {draft.paragraphCount === 1 ? "paragraph" : "paragraphs"}</Meta>
          <Columns>
            <section><h3>Your checklist</h3>{task.checklist.map((label, index) => <p key={label}>{draft.checklistState[index] ? "✓" : "○"} {label}</p>)}</section>
            <section><h3>Automated writing check</h3>{Object.entries(checks).filter(([, value]) => value !== null).map(([key, value]) => <p key={key}>{value ? "✓" : "○"} {checkLabel(key)}</p>)}</section>
          </Columns>
          <Guidance><h3>Improvement guidance</h3><p>{task.guidance}</p><p>Review task fulfilment, register, logical sequence, connectors, repetition, verb position, cases, adjective endings, tense consistency, modal forms, and useful Konjunktiv II.</p><h4>Useful phrase categories</h4><ul>{guidance.groups.map(([category, phrase]) => <li key={category}><b>{category}:</b> {phrase}</li>)}</ul><Links>{guidance.grammarRefs.map((id) => { const lesson = getGermanGrammarLesson(id); return lesson ? <Link key={id} to={`/learn/grammar/${id}`}>{lesson.title}</Link> : null; })}<Link to="/learn/vocabulary/functional-exam-phrases">Formal and exam phrases</Link><Link to="/learn/vocabulary/connectors-prepositions">Connectors and prepositions</Link><Link to="/practice/review">Review practice</Link></Links></Guidance>
          <Assessment><h3>Self-assessment summary</h3>{WRITING_RUBRIC.map(({ id, label }) => <span key={id}>{label}: <b>{session.selfAssessment[id] ?? "Not set"}/3</b></span>)}</Assessment>
          {!revision ? <CopyButton type="button" onClick={() => onCreateRevision(task.id)}>Edit a copy for practice</CopyButton> : <Revision><label htmlFor={`revision-${revision.id}`}>Practice revision copy</label><textarea id={`revision-${revision.id}`} value={revision.text} onChange={(event) => onUpdateRevision(revision.id, event.target.value)} /><small>{revision.wordCount} words · submitted original remains unchanged</small></Revision>}
        </Task>;
      })}
    </Page>
  );
};

const Page = styled.section`inline-size:min(100%,62rem);margin-inline:auto;padding:1rem 0 2rem;`;
const Top = styled.div`display:flex;align-items:center;justify-content:space-between;gap:1rem;span{color:${theme.colors.primaryPressed};font-size:.72rem;font-weight:900;text-transform:uppercase;}h1{margin:.2rem 0;}button{min-block-size:2.8rem;padding:.6rem .8rem;border:1px solid ${theme.colors.border};border-radius:${theme.radius.small};background:${theme.colors.surface};font:inherit;font-weight:800;}`;
const Notice = styled.p`padding:.8rem;border-radius:${theme.radius.small};background:${theme.colors.primarySoft};font-size:.8rem;`;
const Task = styled.article`margin:1rem 0;padding:clamp(1rem,3vw,1.5rem);border:1px solid ${theme.colors.border};border-radius:${theme.radius.large};background:${theme.colors.surface};box-shadow:${theme.shadow.soft};h2{margin-top:0;}li,p{line-height:1.5;}`;
const Response = styled.pre`min-block-size:8rem;margin:1rem 0 0;padding:1rem;white-space:pre-wrap;overflow-wrap:anywhere;border:1px solid ${theme.colors.border};border-radius:${theme.radius.small};background:${theme.colors.surfaceMuted};font:inherit;line-height:1.6;`;
const Meta = styled.p`margin:.4rem 0;color:${theme.colors.textMuted};font-size:.78rem;`;
const Columns = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:.7rem;margin-top:1rem;section{padding:.8rem;border:1px solid ${theme.colors.border};border-radius:${theme.radius.small};}h3{margin:0 0 .4rem;font-size:1rem;}p{margin:.35rem 0;font-size:.8rem;}@media(max-width:38rem){grid-template-columns:1fr;}`;
const Guidance = styled.section`margin-top:1rem;padding:1rem;border-radius:${theme.radius.medium};background:${theme.colors.surfaceMuted};h3,h4{margin:.2rem 0 .5rem;}p{color:${theme.colors.textMuted};}ul{padding-left:1.2rem;}`;
const Links = styled.div`display:flex;flex-wrap:wrap;gap:.4rem;a{padding:.4rem .6rem;border-radius:${theme.radius.pill};background:${theme.colors.surface};color:${theme.colors.primaryPressed};font-size:.75rem;font-weight:800;text-decoration:none;}`;
const Assessment = styled.div`display:flex;flex-wrap:wrap;gap:.4rem;margin-top:1rem;h3{inline-size:100%;margin:0;}span{padding:.45rem .6rem;border-radius:${theme.radius.pill};background:${theme.colors.primarySoft};font-size:.75rem;}`;
const CopyButton = styled.button`min-block-size:3rem;margin-top:1rem;padding:.7rem 1rem;border:0;border-radius:${theme.radius.small};background:${theme.colors.primary};color:white;font:inherit;font-weight:900;`;
const Revision = styled.section`margin-top:1rem;label{display:block;margin-bottom:.4rem;font-weight:900;}textarea{inline-size:100%;min-block-size:14rem;padding:.8rem;border:2px solid ${theme.colors.border};border-radius:${theme.radius.small};font:inherit;line-height:1.6;}small{display:block;color:${theme.colors.textMuted};}`;
