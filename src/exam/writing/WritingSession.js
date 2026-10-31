import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { useProgress } from "../../i18n/ProgressProvider";
import { theme } from "../../styles/theme";
import { ExamTimer } from "../core/ExamTimer";
import { loadWritingSession, saveWritingSession } from "../core/writingPersistence";
import {
  abandonWritingSession,
  completeWritingAssessment,
  createWritingRevision,
  createWritingSession,
  navigateWritingTask,
  setWritingAssessment,
  submitWritingSession,
  toggleWritingChecklist,
  updateWritingDraft,
  updateWritingRevision,
} from "../core/writingState";
import { getWritingForm, getWritingPracticeTask, getWritingTaskById, writingForms } from "../data/writingForms";
import { WritingChecklist } from "./WritingChecklist";
import { WritingEditor } from "./WritingEditor";
import { WritingInstructions } from "./WritingInstructions";
import { WritingResults } from "./WritingResults";
import { WritingReview } from "./WritingReview";

const practiceForm = (task) => {
  const base = writingForms[0];
  return { ...base, id: `writing-practice-${task.id}`, title: `${task.title} practice`, tasks: base.tasks.map((current) => current.part === task.part ? task : current) };
};

export const WritingSession = ({ mode }) => {
  const params = useParams();
  const requestedTask = Number(params.taskNumber || 1);
  const location = useLocation();
  const navigate = useNavigate();
  const { progress, recordWritingAttempt } = useProgress();
  const startFresh = new URLSearchParams(location.search).get("new") === "1";
  const initialSaved = useMemo(() => !startFresh ? loadWritingSession(undefined, mode) : null, [mode, startFresh]);
  const initialForm = useMemo(() => {
    if (mode === "simulation") return getWritingForm(initialSaved?.formId || writingForms[progress.writingProgress.simulationsCompleted % writingForms.length].id);
    const savedTask = getWritingTaskById(initialSaved?.practiceTaskId);
    const completedForPart = progress.writingProgress.attemptHistory.filter((attempt) => attempt.mode === "practice" && attempt.taskNumber === requestedTask).length;
    return practiceForm(savedTask || getWritingPracticeTask(requestedTask, completedForPart));
  }, [initialSaved, mode, progress.writingProgress.attemptHistory, progress.writingProgress.simulationsCompleted, requestedTask]);
  const [form, setForm] = useState(initialForm);
  const [session, setSession] = useState(() => {
    const savedMatches = initialSaved && (mode === "simulation" || initialSaved.currentTask === requestedTask);
    const next = savedMatches ? initialSaved : createWritingSession({ form: initialForm, mode, taskNumber: requestedTask, practiceTaskId: mode === "practice" ? initialForm.tasks.find(({ part }) => part === requestedTask).id : null });
    saveWritingSession(next);
    return next;
  });
  const [saveState, setSaveState] = useState("saved");
  const [submitOpen, setSubmitOpen] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const sessionRef = useRef(session);
  const saveTimer = useRef(null);
  sessionRef.current = session;

  useEffect(() => {
    if (startFresh) navigate(location.pathname, { replace: true });
  }, [location.pathname, navigate, startFresh]);

  const persistNow = useCallback((value = sessionRef.current) => {
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    const saved = saveWritingSession(value);
    setSaveState(saved ? "saved" : "error");
    return saved;
  }, []);

  const updateSession = useCallback((updater) => {
    setSession((current) => typeof updater === "function" ? updater(current) : updater);
    setSaveState("saving");
  }, []);

  useEffect(() => {
    if (saveState !== "saving") return undefined;
    saveTimer.current = window.setTimeout(() => persistNow(), 550);
    return () => window.clearTimeout(saveTimer.current);
  }, [persistNow, saveState, session]);

  useEffect(() => {
    const flush = () => persistNow();
    const visibility = () => { if (document.visibilityState === "hidden") flush(); };
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", visibility);
    return () => { window.removeEventListener("pagehide", flush); document.removeEventListener("visibilitychange", visibility); };
  }, [persistNow]);

  useEffect(() => {
    if (session.status !== "submitted") return;
    const needsInitial = !session.progressRecorded;
    const needsAssessment = session.assessmentCompletedAt && !session.assessmentProgressRecorded;
    if (!needsInitial && !needsAssessment) return;
    recordWritingAttempt({ session });
    const recorded = { ...session, progressRecorded: true, assessmentProgressRecorded: Boolean(session.assessmentCompletedAt) };
    setSession(recorded);
    saveWritingSession(recorded);
  }, [recordWritingAttempt, session]);

  const finish = useCallback(() => {
    const next = submitWritingSession(sessionRef.current);
    setSession(next);
    saveWritingSession(next);
    setSubmitOpen(false);
    window.scrollTo(0, 0);
  }, []);

  if (mode === "practice" && (!Number.isInteger(requestedTask) || requestedTask < 1 || requestedTask > 3)) return <Navigate to="/exam/writing" replace />;

  const currentTask = form.tasks.find(({ part }) => part === session.currentTask) || form.tasks[0];
  const currentDraft = session.drafts[currentTask.id];
  const relevantTasks = mode === "practice" ? [currentTask] : form.tasks;
  const emptyCount = relevantTasks.filter((task) => !session.drafts[task.id]?.wordCount).length;

  const startForm = (nextForm, taskNumber = requestedTask) => {
    const next = createWritingSession({ form: nextForm, mode, taskNumber, practiceTaskId: mode === "practice" ? nextForm.tasks.find(({ part }) => part === taskNumber).id : null });
    setForm(nextForm); setSession(next); saveWritingSession(next); setReviewOpen(false); setSaveState("saved"); window.scrollTo(0, 0);
  };
  const restart = () => {
    if (mode === "simulation") { const index = writingForms.findIndex(({ id }) => id === form.id); startForm(writingForms[(index + 1) % writingForms.length], 1); }
    else startForm(form, session.currentTask);
  };
  const startNext = () => {
    if (mode === "simulation") { const index = writingForms.findIndex(({ id }) => id === form.id); startForm(writingForms[(index + 1) % writingForms.length], 1); }
    else { const completed = progress.writingProgress.attemptHistory.filter((item) => item.mode === "practice" && item.taskNumber === session.currentTask).length; const next = getWritingPracticeTask(session.currentTask, completed); startForm(practiceForm(next), session.currentTask); }
  };

  if (session.status === "submitted") return <Page>{reviewOpen
    ? <WritingReview form={form} session={session} onClose={() => setReviewOpen(false)} onCreateRevision={(taskId) => updateSession((value) => createWritingRevision(value, taskId))} onUpdateRevision={(id, text) => updateSession((value) => updateWritingRevision(value, id, text))} />
    : <WritingResults form={form} session={session} onAssess={(id, value) => updateSession((current) => setWritingAssessment(current, id, value))} onCompleteAssessment={() => updateSession((current) => completeWritingAssessment(current))} onReview={() => setReviewOpen(true)} onRestart={restart} onNewPrompt={startNext} />}</Page>;

  if (session.status === "abandoned") return <Page><Abandoned><h1>Writing draft archived</h1><p>Your text was preserved on this device. Start a new session when you are ready.</p><Link to="/exam/writing">Return to Writing home</Link></Abandoned></Page>;

  return (
    <Page>
      <StickyHeader><HeaderRow><Exit type="button" onClick={() => setExitOpen(true)}>Exit</Exit><Title><span>{mode === "simulation" ? "Writing simulation" : "Writing practice"}</span><strong>{form.title}</strong></Title>{mode === "simulation" ? <Timer><small>Time left</small><ExamTimer session={session} onExpire={finish} label="Writing" /></Timer> : <PracticePill>Task {requestedTask}</PracticePill>}</HeaderRow>
      {mode === "simulation" && <TaskNav aria-label="Writing tasks">{form.tasks.map((task) => <button key={task.id} type="button" aria-current={task.part === session.currentTask ? "step" : undefined} onClick={() => { persistNow(); updateSession((current) => navigateWritingTask(current, task.part)); }}><span>Task {task.part}</span><small>{session.drafts[task.id].wordCount} words</small></button>)}</TaskNav>}</StickyHeader>
      <Content><WritingInstructions task={currentTask} simulation={mode === "simulation"} /><WorkArea><WritingEditor task={currentTask} draft={currentDraft} saveState={saveState} onChange={(text) => updateSession((current) => updateWritingDraft(current, currentTask.id, text))} /><WritingChecklist task={currentTask} draft={currentDraft} onToggle={(index, checked) => updateSession((current) => toggleWritingChecklist(current, currentTask.id, index, checked))} /></WorkArea>
      <Footer>{mode === "simulation" && session.currentTask > 1 && <Secondary type="button" onClick={() => { persistNow(); updateSession((current) => navigateWritingTask(current, current.currentTask - 1)); }}>← Previous task</Secondary>}{mode === "simulation" && session.currentTask < 3 && <Primary type="button" onClick={() => { persistNow(); updateSession((current) => navigateWritingTask(current, current.currentTask + 1)); }}>Next task →</Primary>}{(mode === "practice" || session.currentTask === 3) && <Primary type="button" onClick={() => setSubmitOpen(true)}>Submit {mode === "simulation" ? "simulation" : "practice"}</Primary>}</Footer></Content>
      {submitOpen && <Modal role="dialog" aria-modal="true" aria-labelledby="writing-submit-title"><ModalCard><h2 id="writing-submit-title">Submit Writing practice?</h2><p>{emptyCount ? `${emptyCount} ${emptyCount === 1 ? "task is" : "tasks are"} still empty. ` : ""}Your saved drafts will become an immutable submitted attempt.</p><ModalActions><Secondary type="button" onClick={() => setSubmitOpen(false)}>Return to writing</Secondary><Primary type="button" onClick={finish}>Submit now</Primary></ModalActions></ModalCard></Modal>}
      {exitOpen && <Modal role="dialog" aria-modal="true" aria-labelledby="writing-exit-title"><ModalCard><h2 id="writing-exit-title">Exit Writing?</h2><p>{mode === "simulation" ? "Your Writing timer will continue. Your drafts are saved." : "Your practice draft is saved on this device."}</p><ModalActions><Secondary type="button" onClick={() => setExitOpen(false)}>Continue writing</Secondary><Secondary as={Link} to="/exam/writing" onClick={() => persistNow()}>Exit and save</Secondary><Danger type="button" onClick={() => { if (window.confirm("Abandon this Writing session? Your draft will be preserved but the timer will stop.")) { const next = abandonWritingSession(sessionRef.current); setSession(next); saveWritingSession(next); setExitOpen(false); } }}>Abandon {mode === "simulation" ? "simulation" : "practice"}</Danger></ModalActions></ModalCard></Modal>}
    </Page>
  );
};

const Page = styled.main`inline-size:100%;min-block-size:100vh;padding:0 1rem 8rem;color:${theme.colors.text};`;
const StickyHeader = styled.header`position:sticky;inset-block-start:0;z-index:8;max-inline-size:72rem;margin-inline:auto;padding:.6rem 0;background:rgba(247,243,233,.94);backdrop-filter:blur(10px);`;
const HeaderRow = styled.div`display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:.6rem;padding:.6rem;border:1px solid ${theme.colors.border};border-radius:${theme.radius.medium};background:${theme.colors.surface};box-shadow:${theme.shadow.soft};`;
const Exit = styled.button`min-block-size:2.7rem;padding:.5rem .7rem;border:1px solid ${theme.colors.border};border-radius:${theme.radius.small};background:${theme.colors.surface};font:inherit;font-weight:800;`;
const Title = styled.div`min-inline-size:0;span,strong{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}span{color:${theme.colors.textMuted};font-size:.68rem;}strong{font-size:.88rem;}`;
const Timer = styled.div`min-inline-size:5.2rem;padding:.4rem .55rem;border-radius:${theme.radius.small};background:${theme.colors.navy};color:white;text-align:center;small{display:block;font-size:.6rem;text-transform:uppercase;}span{font-weight:900;font-variant-numeric:tabular-nums;}`;
const PracticePill = styled.span`padding:.5rem .65rem;border-radius:${theme.radius.pill};background:${theme.colors.primarySoft};color:${theme.colors.primaryPressed};font-size:.75rem;font-weight:900;`;
const TaskNav = styled.nav`display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.35rem;margin-top:.4rem;button{min-inline-size:0;min-block-size:2.8rem;display:flex;align-items:center;justify-content:center;gap:.35rem;padding:.35rem;border:1px solid ${theme.colors.border};border-radius:${theme.radius.small};background:${theme.colors.surface};font:inherit;font-size:.75rem;font-weight:800;}button[aria-current="step"]{border-color:${theme.colors.primary};background:${theme.colors.primarySoft};}@media(max-width:26rem){button{flex-direction:column;gap:0;}}`;
const Content = styled.div`inline-size:min(100%,68rem);margin:1rem auto 0;`;
const WorkArea = styled.div`display:grid;grid-template-columns:minmax(0,2fr) minmax(14rem,1fr);align-items:start;gap:.8rem;margin-top:.8rem;@media(max-width:50rem){grid-template-columns:1fr;}`;
const Footer = styled.div`display:flex;flex-wrap:wrap;justify-content:flex-end;gap:.5rem;margin-top:1rem;`;
const Primary = styled.button`min-block-size:3rem;padding:.7rem 1rem;border:0;border-radius:${theme.radius.small};background:${theme.colors.primary};color:white;font:inherit;font-weight:900;`;
const Secondary = styled(Primary)`display:inline-flex;align-items:center;justify-content:center;border:1px solid ${theme.colors.border};background:${theme.colors.surface};color:${theme.colors.text};text-decoration:none;`;
const Danger = styled(Secondary)`border-color:${theme.colors.error};color:${theme.colors.error};`;
const Modal = styled.div`position:fixed;inset:0;z-index:30;display:grid;place-items:center;padding:1rem;background:rgba(24,23,20,.68);`;
const ModalCard = styled.div`inline-size:min(100%,31rem);padding:1.25rem;border-radius:${theme.radius.large};background:${theme.colors.surface};box-shadow:0 24px 70px rgba(0,0,0,.28);h2{margin:0 0 .5rem;}p{color:${theme.colors.textMuted};line-height:1.5;}`;
const ModalActions = styled.div`display:flex;flex-wrap:wrap;justify-content:flex-end;gap:.5rem;margin-top:1rem;`;
const Abandoned = styled.section`inline-size:min(100%,34rem);margin:3rem auto;padding:1.5rem;border-radius:${theme.radius.large};background:${theme.colors.surface};text-align:center;a{display:inline-flex;margin-top:.5rem;padding:.7rem 1rem;border-radius:${theme.radius.small};background:${theme.colors.primary};color:white;font-weight:900;text-decoration:none;}`;
