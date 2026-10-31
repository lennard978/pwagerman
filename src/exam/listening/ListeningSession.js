import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { useProgress } from "../../i18n/ProgressProvider";
import { theme } from "../../styles/theme";
import { ExamTimer } from "../core/ExamTimer";
import {
  advanceListeningPart,
  createListeningSession,
  getListeningUnansweredCount,
  isListeningPartPlaybackComplete,
  navigateListeningPart,
  selectListeningAnswer,
  submitListeningSession,
} from "../core/listeningSession";
import { clearListeningSession, loadListeningSession, saveListeningSession } from "../core/listeningPersistence";
import { getListeningForm, listeningForms } from "../data/listeningForms";
import { preflightListeningAudio } from "./audioPreflight";
import { ListeningPart } from "./ListeningPart";
import { ListeningResults } from "./ListeningResults";
import { ListeningReview } from "./ListeningReview";
import { MockModuleReturn } from "../mock/MockModuleReturn";

export const ListeningSession = ({ mode, preflightAudio = preflightListeningAudio }) => {
  const params = useParams();
  const requestedPart = Number(params.partNumber || 1);
  const location = useLocation();
  const navigate = useNavigate();
  const { progress, recordListeningAttempt } = useProgress();
  const [startFresh] = useState(() => new URLSearchParams(location.search).get("new") === "1");
  const [formId, setFormId] = useState(() => {
    const saved = !startFresh ? loadListeningSession(undefined, mode) : null;
    const savedMatches = saved && (mode === "simulation" || saved.currentPart === requestedPart);
    return savedMatches ? saved.formId : listeningForms[progress.listeningProgress.attemptHistory.length % listeningForms.length].id;
  });
  const form = useMemo(() => getListeningForm(formId), [formId]);
  const [session, setSession] = useState(null);
  const [preflight, setPreflight] = useState({ status: "preparing", errors: [] });
  const [preflightAttempt, setPreflightAttempt] = useState(0);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(() => new URLSearchParams(location.search).get("review") === "1");

  useEffect(() => {
    if (startFresh) navigate(location.pathname, { replace: true });
  }, [location.pathname, navigate, startFresh]);

  useEffect(() => {
    let cancelled = false;
    setPreflight({ status: "preparing", errors: [] });
    const savedBeforePreflight = !startFresh ? loadListeningSession(undefined, mode) : null;
    const savedBeforePreflightMatches = savedBeforePreflight?.formId === form.id && (mode === "simulation" || savedBeforePreflight.currentPart === requestedPart);
    if (savedBeforePreflightMatches && savedBeforePreflight.status === "submitted") {
      setSession(savedBeforePreflight);
      setPreflight({ status: "ready", errors: [] });
      return () => { cancelled = true; };
    }
    preflightAudio(form).then((result) => {
      if (cancelled) return;
      if (!result.ready) { setPreflight({ status: "error", errors: result.errors }); return; }
      const saved = !startFresh ? loadListeningSession(undefined, mode) : null;
      const savedMatches = saved?.formId === form.id && (mode === "simulation" || saved.currentPart === requestedPart);
      const next = savedMatches ? saved : createListeningSession({ form, mode, partNumber: requestedPart });
      saveListeningSession(next);
      setSession(next);
      setPreflight({ status: "ready", errors: [] });
    }).catch(() => !cancelled && setPreflight({ status: "error", errors: [{ reason: "preflight-error" }] }));
    return () => { cancelled = true; };
  }, [form, mode, preflightAttempt, preflightAudio, requestedPart, startFresh]);

  useEffect(() => {
    if (session?.status === "submitted" && !session.progressRecorded) {
      recordListeningAttempt({ session, score: session.score });
      const recorded = { ...session, progressRecorded: true };
      setSession(recorded);
      saveListeningSession(recorded);
    }
  }, [recordListeningAttempt, session]);

  const updateSession = useCallback((updater) => setSession((current) => {
    if (!current) return current;
    const next = typeof updater === "function" ? updater(current) : updater;
    saveListeningSession(next);
    return next;
  }), []);

  const finish = useCallback(() => updateSession((current) => current.status === "active" ? submitListeningSession(current, getListeningForm(current.formId)) : current), [updateSession]);

  if (mode === "practice" && (!Number.isInteger(requestedPart) || requestedPart < 1 || requestedPart > 4)) return <Navigate to="/exam/listening" replace />;

  if (preflight.status !== "ready" || !session) {
    return (
      <PreflightPage>
        <Back to="/exam/listening">← Listening home</Back>
        <PreflightCard role={preflight.status === "error" ? "alert" : "status"}>
          <span>Audio preflight</span>
          <h1>{preflight.status === "preparing" ? "Preparing Listening audio…" : "Listening audio could not be prepared. Please try again."}</h1>
          {preflight.status === "preparing"
            ? <p>The timer has not started. Required files, metadata, and browser decoding support are being checked.</p>
            : <><p>No timed session was started and no playback allowance was consumed. Stable versioned German audio assets must exist before this module can run.</p><ErrorList>{preflight.errors.slice(0, 4).map((error, index) => <li key={`${error.audioId || "audio"}-${index}`}>{error.audioId || "Audio"}: {error.reason}</li>)}</ErrorList><button type="button" onClick={() => setPreflightAttempt((value) => value + 1)}>Try preflight again</button></>}
        </PreflightCard>
      </PreflightPage>
    );
  }

  const currentPart = form.parts.find(({ number }) => number === session.currentPart) || form.parts[0];
  const playbackComplete = isListeningPartPlaybackComplete(session, form);
  const unanswered = getListeningUnansweredCount(session, form);
  const partAnswered = (part) => part.items.filter(({ id }) => session.answers[id]).length;

  const handleAnswer = (itemId, answer) => updateSession((current) => selectListeningAnswer(current, form, itemId, answer));
  const handleSubmit = () => unanswered > 0 ? setConfirmSubmit(true) : finish();
  const startForm = (nextForm) => {
    clearListeningSession(undefined, mode);
    setFormId(nextForm.id);
    setSession(null);
    setPreflight({ status: "preparing", errors: [] });
    setPreflightAttempt((value) => value + 1);
    setReviewOpen(false);
    window.scrollTo(0, 0);
  };
  const restart = () => {
    const index = listeningForms.findIndex(({ id }) => id === form.id);
    startForm(mode === "simulation" ? listeningForms[(index + 1) % listeningForms.length] : form);
  };
  const startNewSet = () => {
    const index = listeningForms.findIndex(({ id }) => id === form.id);
    startForm(listeningForms[(index + 1) % listeningForms.length]);
  };

  if (session.status === "submitted") {
    return <Page>{reviewOpen ? <ListeningReview form={form} session={session} onClose={() => setReviewOpen(false)} /> : <><ListeningResults session={session} onReview={() => setReviewOpen(true)} onRestart={restart} onNewSet={startNewSet} /><MockModuleReturn moduleId="listening" sessionId={session.sessionId} /></>}</Page>;
  }

  return (
    <Page>
      <StickyHeader>
        <HeaderRow><Exit type="button" onClick={() => setExitOpen(true)}>Exit</Exit><Title><span>{mode === "simulation" ? "Listening simulation" : "Listening practice"}</span><strong>{form.title}</strong></Title>{mode === "simulation" ? <Timer><small>Time left</small><ExamTimer session={session} onExpire={finish} label="Listening" /></Timer> : <PracticePill>Part {requestedPart}</PracticePill>}</HeaderRow>
        {mode === "simulation" && <PartNav aria-label="Listening parts">{form.parts.map((part) => <PartButton key={part.number} type="button" disabled={part.number > session.unlockedPart} $active={part.number === session.currentPart} onClick={() => updateSession((current) => navigateListeningPart(current, form, part.number))}><span>Part {part.number}</span><small>{partAnswered(part)}/{part.items.length}</small></PartButton>)}</PartNav>}
      </StickyHeader>
      <Content>
        <SequenceNote><strong>Ordered audio sequence:</strong> complete the official playback for this part before moving forward. Previously unlocked parts remain available for answer review, but completed audio cannot be replayed.</SequenceNote>
        <ListeningPart part={currentPart} session={session} updateSession={updateSession} onAnswer={handleAnswer} />
        <Footer>
          {mode === "simulation" && session.currentPart > 1 && <Secondary type="button" onClick={() => updateSession((current) => navigateListeningPart(current, form, session.currentPart - 1))}>← Previous part</Secondary>}
          {!playbackComplete && <PlaybackPending>Complete official playback to continue</PlaybackPending>}
          {playbackComplete && mode === "simulation" && session.currentPart < 4 && <Primary type="button" onClick={() => updateSession((current) => advanceListeningPart(current, form))}>Next part →</Primary>}
          {playbackComplete && (mode === "practice" || session.currentPart === 4) && <Primary type="button" onClick={handleSubmit}>Submit {mode === "simulation" ? "simulation" : "practice"}</Primary>}
        </Footer>
      </Content>
      {confirmSubmit && <Modal role="dialog" aria-modal="true" aria-labelledby="listening-submit-title"><ModalCard><h2 id="listening-submit-title">Submit with unanswered questions?</h2><p>You have {unanswered} unanswered {unanswered === 1 ? "question" : "questions"}. They receive no point.</p><ModalActions><Secondary type="button" onClick={() => setConfirmSubmit(false)}>Return to questions</Secondary><Primary type="button" onClick={finish}>Submit anyway</Primary></ModalActions></ModalCard></Modal>}
      {exitOpen && <Modal role="dialog" aria-modal="true" aria-labelledby="listening-exit-title"><ModalCard><h2 id="listening-exit-title">Exit Listening?</h2><p>{mode === "simulation" ? "The Listening timer will continue and official playback counts will remain saved." : "Your practice state is saved on this device."}</p><ModalActions><Secondary type="button" onClick={() => setExitOpen(false)}>Continue exam</Secondary><Secondary as={Link} to="/exam/listening">Exit and save</Secondary><Danger type="button" onClick={() => { if (window.confirm("Abandon this Listening session and delete its saved answers and playback state?")) { clearListeningSession(undefined, mode); navigate("/exam/listening"); } }}>Abandon session</Danger></ModalActions></ModalCard></Modal>}
    </Page>
  );
};

const Page = styled.main`inline-size:100%;min-block-size:100vh;padding:0 1rem 7rem;color:${theme.colors.text};`;
const PreflightPage = styled.main`inline-size:min(100%,44rem);min-block-size:100vh;padding:1.25rem 1rem 7rem;`;
const Back = styled(Link)`display:inline-block;margin-bottom:1rem;color:${theme.colors.primaryPressed};font-weight:800;text-decoration:none;`;
const PreflightCard = styled.section`padding:clamp(1.2rem,4vw,2rem);border:2px solid ${theme.colors.primary};border-radius:${theme.radius.large};background:${theme.colors.surface};box-shadow:${theme.shadow.soft}; & > span{color:${theme.colors.primaryPressed};font-size:.72rem;font-weight:900;text-transform:uppercase;} h1{margin:.3rem 0;} p{color:${theme.colors.textMuted};line-height:1.5;} button{min-block-size:3rem;padding:.7rem 1rem;border:0;border-radius:${theme.radius.small};background:${theme.colors.primary};color:white;font:inherit;font-weight:900;}`;
const ErrorList = styled.ul`padding-left:1.2rem;color:${theme.colors.error};font-size:.8rem;`;
const StickyHeader = styled.header`position:sticky;inset-block-start:0;z-index:8;max-inline-size:70rem;margin-inline:auto;padding:.6rem 0;background:color-mix(in srgb,${theme.colors.background} 92%,transparent);backdrop-filter:blur(10px);`;
const HeaderRow = styled.div`display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:.7rem;padding:.6rem;border:1px solid ${theme.colors.border};border-radius:${theme.radius.medium};background:${theme.colors.surface};box-shadow:${theme.shadow.soft};`;
const Exit = styled.button`min-block-size:2.7rem;padding:.5rem .75rem;border:1px solid ${theme.colors.border};border-radius:${theme.radius.small};background:${theme.colors.surface};font:inherit;font-weight:800;`;
const Title = styled.div`min-inline-size:0;span,strong{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}span{color:${theme.colors.textMuted};font-size:.7rem;}strong{font-size:.9rem;}`;
const Timer = styled.div`min-inline-size:5.2rem;padding:.4rem .6rem;border-radius:${theme.radius.small};background:${theme.colors.navy};color:white;text-align:center;small{display:block;font-size:.62rem;text-transform:uppercase;}span{font-weight:900;font-variant-numeric:tabular-nums;}`;
const PracticePill = styled.span`padding:.55rem .7rem;border-radius:${theme.radius.pill};background:${theme.colors.primarySoft};color:${theme.colors.primaryPressed};font-size:.78rem;font-weight:900;`;
const PartNav = styled.nav`display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.35rem;margin-top:.45rem;`;
const PartButton = styled.button`min-inline-size:0;min-block-size:2.8rem;display:flex;align-items:center;justify-content:center;gap:.3rem;padding:.35rem;border:1px solid ${({$active})=>$active?theme.colors.primary:theme.colors.border};border-radius:${theme.radius.small};background:${({$active})=>$active?theme.colors.primarySoft:theme.colors.surface};font:inherit;font-size:.75rem;font-weight:800; &:disabled{opacity:.45;} @media(max-width:24rem){flex-direction:column;gap:0;}`;
const Content = styled.div`inline-size:min(100%,54rem);margin:1rem auto 0;`;
const SequenceNote = styled.p`padding:.75rem;border-radius:${theme.radius.small};background:${theme.colors.surfaceMuted};color:${theme.colors.textMuted};font-size:.78rem;line-height:1.45;`;
const Footer = styled.div`display:flex;flex-wrap:wrap;align-items:center;justify-content:flex-end;gap:.55rem;margin-top:1rem;`;
const Primary = styled.button`min-block-size:3rem;padding:.7rem 1rem;border:0;border-radius:${theme.radius.small};background:${theme.colors.primary};color:white;font:inherit;font-weight:900;`;
const Secondary = styled(Primary)`display:inline-flex;align-items:center;justify-content:center;border:1px solid ${theme.colors.border};background:${theme.colors.surface};color:${theme.colors.text};text-decoration:none;`;
const Danger = styled(Secondary)`border-color:${theme.colors.error};color:${theme.colors.error};`;
const PlaybackPending = styled.span`color:${theme.colors.textMuted};font-size:.78rem;font-weight:800;`;
const Modal = styled.div`position:fixed;inset:0;z-index:30;display:grid;place-items:center;padding:1rem;background:rgba(24,23,20,.65);`;
const ModalCard = styled.div`inline-size:min(100%,30rem);padding:1.25rem;border-radius:${theme.radius.large};background:${theme.colors.surface};box-shadow:0 24px 70px rgba(0,0,0,.28);h2{margin:0 0 .5rem;}p{color:${theme.colors.textMuted};line-height:1.5;}`;
const ModalActions = styled.div`display:flex;flex-wrap:wrap;justify-content:flex-end;gap:.5rem;margin-top:1rem;`;
