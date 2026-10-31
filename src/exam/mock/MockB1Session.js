import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useProgress } from "../../i18n/ProgressProvider";
import { theme } from "../../styles/theme";
import { getFullMockAvailability, MOCK_MODULE_ORDER } from "../config/goetheB1Mock";
import { archiveMockSession, loadMockSession, saveMockSession } from "../core/mockPersistence";
import { createLinkedModuleSession, getActiveModuleConflict, loadLinkedModuleSessions, MOCK_MODULE_ROUTES } from "../core/mockModuleBridge";
import { abandonMock, beginMock, reconcileMockSession, startMockModule } from "../core/mockState";
import { getMockForm } from "../data/mockForms";
import { MockB1Instructions } from "./MockB1Instructions";
import { MockB1ModuleCard } from "./MockB1ModuleCard";
import { MockB1Results } from "./MockB1Results";

export const MockB1Session = () => {
  const navigate = useNavigate();
  const { progress, recordB1MockAttempt } = useProgress();
  const initial = useMemo(() => loadMockSession(), []);
  const [session, setSession] = useState(initial);
  const [error, setError] = useState(null);
  const availability = useMemo(() => getFullMockAvailability(), []);
  const mock = session ? getMockForm(session.mockId) : null;
  const update = useCallback((updater) => setSession((current) => {
    const next = typeof updater === "function" ? updater(current) : updater;
    if (next) saveMockSession(next);
    return next;
  }), []);

  useEffect(() => {
    if (!session || !["active", "completed"].includes(session.status)) return;
    const reconciled = reconcileMockSession(session, loadLinkedModuleSessions());
    if (reconciled !== session) update(reconciled);
  }, [session, update]);

  useEffect(() => {
    if (session?.status !== "completed" || session.historyRecorded) return;
    archiveMockSession(session);
    recordB1MockAttempt?.({ session, event: "completed" });
    update((current) => ({ ...current, historyRecorded: true }));
  }, [recordB1MockAttempt, session, update]);

  if (!session || !mock) return <Navigate to="/exam/full-mock-b1" replace />;
  if (session.status === "completed") return <Page><MockB1Results session={session} progress={progress}/></Page>;
  if (session.status === "abandoned") return <Navigate to="/exam/full-mock-b1" replace />;
  if (session.status === "instructions") return <Page><MockB1Instructions availability={availability} onBegin={() => update(beginMock)}/></Page>;

  const launch = (moduleId) => {
    setError(null);
    if (moduleId === "listening" && !availability.available) { setError("Listening production audio is not ready, so this Full Mock cannot continue."); return; }
    const entry = session.modules[moduleId];
    if (entry.status === "in-progress" && entry.sessionId) { navigate(MOCK_MODULE_ROUTES[moduleId]); return; }
    const conflict = getActiveModuleConflict(moduleId, entry.sessionId);
    if (conflict) { setError(`An independent ${moduleId} session is already active. Finish or abandon it before linking this mock module.`); return; }
    const linked = createLinkedModuleSession(mock, moduleId);
    if (!linked) { setError(`The ${moduleId} module could not be started.`); return; }
    update((current) => startMockModule(current, moduleId, linked.sessionId));
    navigate(MOCK_MODULE_ROUTES[moduleId]);
  };

  const abandon = () => {
    if (!window.confirm("Abandon this Full B1 Practice Mock? Completed module attempts will remain in history.")) return;
    const next = abandonMock(session);
    saveMockSession(next);
    archiveMockSession(next);
    recordB1MockAttempt?.({ session: next, event: "abandoned" });
    navigate("/exam/full-mock-b1");
  };

  return <Page><Header><div><span>FULL B1 PRACTICE MOCK</span><h1>Module sequence</h1><p>Take learner-controlled breaks. The next timer starts only when you explicitly start that module.</p></div><button type="button" onClick={abandon}>Abandon mock</button></Header>{error && <Error role="alert">{error}</Error>}<Sequence aria-label="Mock module sequence">{MOCK_MODULE_ORDER.map((moduleId) => <MockB1ModuleCard key={moduleId} moduleId={moduleId} entry={session.modules[moduleId]} active={session.currentModule === moduleId} onStart={launch}/>)}</Sequence><Footer><Link to="/exam/full-mock-b1">Exit and save</Link><Link to="/exam/readiness">Readiness dashboard</Link></Footer></Page>;
};

const Page = styled.main`inline-size:min(100%,68rem);min-block-size:100vh;padding:1.25rem 1rem 7rem;color:${theme.colors.text};`;
const Header = styled.header`display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;padding:clamp(1rem,4vw,2rem);border-radius:${theme.radius.large};background:${theme.colors.navy};color:white;span{color:#f4bf62;font-size:.7rem;font-weight:900;}h1{margin:.25rem 0;}p{max-inline-size:42rem;margin:.3rem 0;color:#eee5d5;line-height:1.45;}button{min-block-size:2.8rem;padding:.6rem .8rem;border:1px solid #ffffff66;border-radius:${theme.radius.small};background:transparent;color:white;font:inherit;font-weight:900;}@media(max-width:36rem){flex-direction:column;}`;
const Sequence = styled.section`display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.7rem;margin-top:1rem;@media(max-width:42rem){grid-template-columns:1fr;}`;
const Error = styled.p`padding:.8rem;border:1px solid ${theme.colors.error};border-radius:${theme.radius.small};background:#fff0ee;color:${theme.colors.error};font-weight:800;`;
const Footer = styled.div`display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1rem;a{min-block-size:2.8rem;display:inline-flex;align-items:center;padding:.6rem .8rem;border:1px solid ${theme.colors.border};border-radius:${theme.radius.small};background:${theme.colors.surface};color:${theme.colors.text};font-weight:900;text-decoration:none;}`;
