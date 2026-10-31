import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { useProgress } from "../../i18n/ProgressProvider";
import { theme } from "../../styles/theme";
import {
  createReadingSession,
  getReadingUnansweredCount,
  navigateReadingPart,
  selectReadingAnswer,
  submitReadingSession,
} from "../core/examState";
import { ExamTimer } from "../core/ExamTimer";
import { clearReadingSession, loadReadingSession, saveReadingSession } from "../core/persistence";
import { getReadingForm, readingForms } from "../data/readingForms";
import { ReadingPart } from "./ReadingPart";
import { ReadingResults } from "./ReadingResults";
import { ReadingReview } from "./ReadingReview";

const getInitialSession = ({ mode, partNumber, startFresh, attemptCount }) => {
  const saved = loadReadingSession(undefined, mode);
  const savedMatches = saved?.module === "reading" && saved.mode === mode &&
    (mode === "simulation" || saved.currentPart === partNumber);
  if (!startFresh && savedMatches) return saved;
  const form = readingForms[attemptCount % readingForms.length];
  const next = createReadingSession({ form, mode, partNumber });
  saveReadingSession(next);
  return next;
};

export const ReadingSession = ({ mode }) => {
  const params = useParams();
  const requestedPart = Number(params.partNumber || 1);
  const location = useLocation();
  const navigate = useNavigate();
  const { progress, recordReadingAttempt } = useProgress();
  const startFresh = new URLSearchParams(location.search).get("new") === "1";
  const [session, setSession] = useState(() => getInitialSession({
    mode,
    partNumber: requestedPart,
    startFresh,
    attemptCount: progress.readingProgress.attemptHistory.length,
  }));
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(mode === "practice" ? (requestedPart === 1 ? 1 : [7, 13, 20, 27][requestedPart - 2]) : 1);
  const form = useMemo(() => getReadingForm(session.formId), [session.formId]);

  useEffect(() => {
    if (startFresh) navigate(location.pathname, { replace: true });
  }, [location.pathname, navigate, startFresh]);

  useEffect(() => {
    if (session.status === "submitted" && !session.progressRecorded) {
      recordReadingAttempt({ session, score: session.score });
      const recorded = { ...session, progressRecorded: true };
      setSession(recorded);
      saveReadingSession(recorded);
    }
  }, [recordReadingAttempt, session]);

  const updateSession = (updater) => setSession((current) => {
    const next = typeof updater === "function" ? updater(current) : updater;
    saveReadingSession(next);
    return next;
  });

  const finish = useCallback(() => {
    updateSession((current) => current.status === "active" ? submitReadingSession(current, getReadingForm(current.formId)) : current);
    setConfirmSubmit(false);
  }, []);

  if (mode === "practice" && (!Number.isInteger(requestedPart) || requestedPart < 1 || requestedPart > 5)) {
    return <Navigate to="/exam/reading" replace />;
  }

  const handleSubmit = () => {
    const unanswered = getReadingUnansweredCount(session, form);
    if (unanswered > 0) setConfirmSubmit(true);
    else finish();
  };

  const handleAnswer = (itemId, answer) => {
    const item = form.parts.flatMap(({ items }) => items).find(({ id }) => id === itemId);
    if (item) setCurrentQuestion(item.number);
    updateSession((current) => selectReadingAnswer(current, form, itemId, answer));
  };
  const goToPart = (partNumber) => {
    const part = form.parts.find(({ number }) => number === partNumber);
    if (part) setCurrentQuestion(part.items[0].number);
    updateSession((current) => navigateReadingPart(current, partNumber));
  };
  const currentPart = form.parts.find(({ number }) => number === session.currentPart) || form.parts[0];
  const partAnswered = (part) => part.items.filter(({ id }) => session.answers[id]).length;

  const reviewFirstUnanswered = () => {
    const targetPart = (mode === "practice" ? [currentPart] : form.parts)
      .find((part) => part.items.some(({ id }) => !session.answers[id]));
    if (!targetPart) return;
    goToPart(targetPart.number);
    const target = targetPart.items.find(({ id }) => !session.answers[id]);
    window.setTimeout(() => document.getElementById(`question-${target.number}`)?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const startForm = (nextForm) => {
    const next = createReadingSession({ form: nextForm, mode, partNumber: requestedPart });
    saveReadingSession(next);
    setReviewOpen(false);
    setCurrentQuestion(nextForm.parts[requestedPart - 1].items[0].number);
    setSession(next);
    window.scrollTo(0, 0);
  };

  const restart = () => {
    const currentIndex = readingForms.findIndex(({ id }) => id === form.id);
    const nextForm = mode === "simulation" ? readingForms[(currentIndex + 1) % readingForms.length] : form;
    startForm(nextForm);
  };

  const startNewSet = () => {
    const currentIndex = readingForms.findIndex(({ id }) => id === form.id);
    startForm(readingForms[(currentIndex + 1) % readingForms.length]);
  };

  if (session.status === "submitted") {
    return (
      <Page>
        {reviewOpen
          ? <ReadingReview form={form} session={session} onClose={() => setReviewOpen(false)} />
          : <ReadingResults session={session} onReview={() => setReviewOpen(true)} onRestart={restart} onNewSet={startNewSet} />}
      </Page>
    );
  }

  const unanswered = getReadingUnansweredCount(session, form);
  return (
    <Page>
      <SessionHeader>
        <HeaderRow>
          <ExitButton type="button" onClick={() => setExitOpen(true)}>Exit</ExitButton>
          <HeaderTitle><span>{mode === "simulation" ? "Full Reading simulation" : "Reading practice"}</span><strong>{form.title}</strong></HeaderTitle>
          {mode === "simulation" ? <Timer><small>Time left</small><ExamTimer session={session} onExpire={finish} /></Timer> : <PracticePill>Part {requestedPart}</PracticePill>}
        </HeaderRow>
        {mode === "simulation" && (
          <PartNavigation aria-label="Reading parts">
            {form.parts.map((part) => (
              <PartButton key={part.number} type="button" $active={part.number === session.currentPart} onClick={() => goToPart(part.number)}>
                <span>Part {part.number}</span><small>{partAnswered(part)}/{part.items.length}</small>
              </PartButton>
            ))}
          </PartNavigation>
        )}
      </SessionHeader>

      <Content>
        <QuestionNavigation aria-label={`Questions in Part ${currentPart.number}`}>
          <QuestionLegend><span><i>✓</i> Answered</span><span><i>·</i> Unanswered</span></QuestionLegend>
          <QuestionButtons>
            {currentPart.items.map((item) => (
              <QuestionButton
                key={item.id}
                type="button"
                $answered={Boolean(session.answers[item.id])}
                $active={currentQuestion === item.number}
                aria-current={currentQuestion === item.number ? "true" : undefined}
                aria-label={`Question ${item.number}, ${session.answers[item.id] ? "answered" : "unanswered"}`}
                onClick={() => { setCurrentQuestion(item.number); document.getElementById(`question-${item.number}`)?.scrollIntoView({ behavior: "smooth" }); }}
              >{session.answers[item.id] ? "✓" : item.number}</QuestionButton>
            ))}
          </QuestionButtons>
        </QuestionNavigation>
        <ReadingPart part={currentPart} answers={session.answers} onAnswer={handleAnswer} />
        <FooterActions>
          {mode === "simulation" && session.currentPart > 1 && <Secondary type="button" onClick={() => goToPart(session.currentPart - 1)}>← Previous part</Secondary>}
          <Secondary type="button" onClick={reviewFirstUnanswered}>Review unanswered ({unanswered})</Secondary>
          {mode === "simulation" && session.currentPart < 5
            ? <Primary type="button" onClick={() => goToPart(session.currentPart + 1)}>Next part →</Primary>
            : <Primary type="button" onClick={handleSubmit}>Submit {mode === "simulation" ? "simulation" : "practice"}</Primary>}
        </FooterActions>
      </Content>

      {confirmSubmit && (
        <Modal role="dialog" aria-modal="true" aria-labelledby="submit-title">
          <ModalCard><h2 id="submit-title">Submit with unanswered questions?</h2><p>You still have {unanswered} unanswered {unanswered === 1 ? "question" : "questions"}. Unanswered items receive no point.</p><ModalActions><Secondary type="button" onClick={() => setConfirmSubmit(false)}>Continue working</Secondary><Primary type="button" onClick={finish}>Submit now</Primary></ModalActions></ModalCard>
        </Modal>
      )}
      {exitOpen && (
        <Modal role="dialog" aria-modal="true" aria-labelledby="exit-title">
          <ModalCard><h2 id="exit-title">Leave this session?</h2><p>{mode === "simulation" ? "You can return before the absolute deadline; the Reading timer will continue." : "Your current practice answers are saved on this device."}</p><ModalActions><Secondary type="button" onClick={() => setExitOpen(false)}>Continue exam</Secondary><Secondary as={Link} to="/exam/reading">Exit and save</Secondary><Danger type="button" onClick={() => { if (window.confirm("Abandon this Reading session and delete its saved answers?")) { clearReadingSession(undefined, mode); navigate("/exam/reading"); } }}>Abandon session</Danger></ModalActions></ModalCard>
        </Modal>
      )}
    </Page>
  );
};

const Page = styled.main`inline-size: 100%; min-block-size: 100vh; padding: 0 1rem 7rem; color: ${theme.colors.text};`;
const SessionHeader = styled.header`position: sticky; inset-block-start: 0; z-index: 8; max-inline-size: 70rem; margin-inline: auto; padding: .6rem 0; background: color-mix(in srgb, ${theme.colors.background} 92%, transparent); backdrop-filter: blur(10px);`;
const HeaderRow = styled.div`display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: .7rem; padding: .6rem; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.medium}; background: ${theme.colors.surface}; box-shadow: ${theme.shadow.soft};`;
const ExitButton = styled.button`min-block-size: 2.7rem; padding: .5rem .75rem; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.small}; background: ${theme.colors.surface}; color: ${theme.colors.text}; font: inherit; font-weight: 800; cursor: pointer;`;
const HeaderTitle = styled.div`min-inline-size: 0; span, strong { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } span { color: ${theme.colors.textMuted}; font-size: .7rem; } strong { font-size: .9rem; }`;
const Timer = styled.div`min-inline-size: 5.2rem; padding: .4rem .6rem; border-radius: ${theme.radius.small}; background: ${theme.colors.navy}; color: white; text-align: center; small { display: block; color: #ddd7c8; font-size: .62rem; text-transform: uppercase; } span { font-size: 1.08rem; font-weight: 900; font-variant-numeric: tabular-nums; }`;
const PracticePill = styled.span`padding: .55rem .7rem; border-radius: ${theme.radius.pill}; background: ${theme.colors.primarySoft}; color: ${theme.colors.primaryPressed}; font-size: .78rem; font-weight: 900;`;
const PartNavigation = styled.div`display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: .35rem; margin-top: .45rem;`;
const PartButton = styled.button`min-inline-size: 0; min-block-size: 2.8rem; display: flex; align-items: center; justify-content: center; gap: .35rem; padding: .35rem; border: 1px solid ${({ $active }) => $active ? theme.colors.primary : theme.colors.border}; border-radius: ${theme.radius.small}; background: ${({ $active }) => $active ? theme.colors.primarySoft : theme.colors.surface}; color: ${theme.colors.text}; font: inherit; font-size: .75rem; font-weight: 800; cursor: pointer; small { color: ${theme.colors.textMuted}; } @media (max-width: 24rem) { flex-direction: column; gap: 0; font-size: .7rem; }`;
const Content = styled.div`inline-size: min(100%, 52rem); margin: 1rem auto 0;`;
const QuestionNavigation = styled.nav`margin-bottom: 1rem; padding: .65rem; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.medium}; background: ${theme.colors.surface};`;
const QuestionLegend = styled.div`display: flex; gap: 1rem; margin-bottom: .45rem; color: ${theme.colors.textMuted}; font-size: .7rem; i { display: inline-grid; place-items: center; inline-size: 1rem; block-size: 1rem; border-radius: 50%; background: ${theme.colors.surfaceMuted}; color: ${theme.colors.primaryPressed}; font-style: normal; }`;
const QuestionButtons = styled.div`display: flex; flex-wrap: wrap; gap: .35rem;`;
const QuestionButton = styled.button`inline-size: 2.4rem; block-size: 2.4rem; border: 2px solid ${({ $active }) => $active ? theme.colors.navy : "transparent"}; border-radius: 50%; background: ${({ $answered }) => $answered ? theme.colors.successSoft : theme.colors.surfaceMuted}; color: ${({ $answered }) => $answered ? theme.colors.success : theme.colors.text}; font: inherit; font-size: .76rem; font-weight: 900; cursor: pointer; box-shadow: inset 0 0 0 1px ${theme.colors.border};`;
const FooterActions = styled.div`display: flex; flex-wrap: wrap; justify-content: flex-end; gap: .55rem; margin-top: 1rem;`;
const Primary = styled.button`min-block-size: 3rem; padding: .7rem 1rem; border: 0; border-radius: ${theme.radius.small}; background: ${theme.colors.primary}; color: white; font: inherit; font-weight: 900; cursor: pointer;`;
const Secondary = styled(Primary)`display: inline-flex; align-items: center; justify-content: center; border: 1px solid ${theme.colors.border}; background: ${theme.colors.surface}; color: ${theme.colors.text}; text-decoration: none;`;
const Danger = styled(Secondary)`border-color: ${theme.colors.error}; color: ${theme.colors.error};`;
const Modal = styled.div`position: fixed; inset: 0; z-index: 30; display: grid; place-items: center; padding: 1rem; background: rgba(24,23,20,.65);`;
const ModalCard = styled.div`inline-size: min(100%, 30rem); padding: 1.25rem; border-radius: ${theme.radius.large}; background: ${theme.colors.surface}; box-shadow: 0 24px 70px rgba(0,0,0,.28); h2 { margin: 0 0 .5rem; } p { color: ${theme.colors.textMuted}; line-height: 1.5; }`;
const ModalActions = styled.div`display: flex; flex-wrap: wrap; justify-content: flex-end; gap: .5rem; margin-top: 1rem;`;
