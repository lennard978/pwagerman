import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useProgress } from "../../i18n/ProgressProvider";
import { theme } from "../../styles/theme";
import { getFullMockAvailability } from "../config/goetheB1Mock";
import { archiveMockSession, loadMockHistory, loadMockSession, saveMockSession } from "../core/mockPersistence";
import { createMockSession } from "../core/mockState";
import { mockForms } from "../data/mockForms";
import { MockB1History } from "./MockB1History";
import { MockB1Instructions } from "./MockB1Instructions";

export const MockB1Home = () => {
  const navigate = useNavigate();
  const { recordB1MockAttempt } = useProgress();
  const active = useMemo(() => loadMockSession(), []);
  const history = useMemo(() => loadMockHistory(), []);
  const availability = useMemo(() => getFullMockAvailability(), []);
  const resumable = active && ["instructions", "active"].includes(active.status);
  const latest = history.at(-1);
  const start = () => {
    if (!availability.available) return;
    if (active && ["completed", "abandoned"].includes(active.status)) archiveMockSession(active);
    const session = createMockSession({ mock: mockForms[history.length % mockForms.length] });
    saveMockSession(session);
    recordB1MockAttempt?.({ session, event: "started" });
    navigate("/exam/full-mock-b1/session");
  };
  return <Page><Back to="/exam">← Exam overview</Back>{resumable && <Resume role="status"><div><strong>Full B1 Practice Mock in progress</strong><span>{Object.values(active.modules).filter(({ status }) => status === "completed").length} / 4 modules completed · {active.currentModule || "instructions"}</span></div><Link to="/exam/full-mock-b1/session">Continue Full B1 Mock →</Link></Resume>}<MockB1Instructions availability={availability} onBegin={start}/><Links><Link to="/exam/readiness"><strong>Readiness dashboard</strong><span>Category-based, transparent practice indicators</span></Link>{latest && <div><strong>Latest mock</strong><span>{latest.status} · {Object.values(latest.modules).filter(({ status }) => status === "completed").length}/4 modules</span></div>}</Links><MockB1History history={history}/></Page>;
};

const Page = styled.main`inline-size:min(100%,68rem);min-block-size:100vh;padding:1.25rem 1rem 7rem;color:${theme.colors.text};`;
const Back = styled(Link)`display:inline-block;margin-bottom:1rem;color:${theme.colors.primaryPressed};font-weight:900;text-decoration:none;`;
const Resume = styled.section`display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-bottom:1rem;padding:1rem;border:2px solid ${theme.colors.primary};border-radius:${theme.radius.medium};background:${theme.colors.primarySoft};strong,span{display:block;}span{color:${theme.colors.textMuted};font-size:.82rem;}a{min-block-size:2.8rem;display:inline-flex;align-items:center;padding:.6rem .8rem;border-radius:${theme.radius.small};background:${theme.colors.primary};color:white;font-weight:900;text-decoration:none;}@media(max-width:36rem){align-items:stretch;flex-direction:column;}`;
const Links = styled.section`display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.7rem;margin-top:1rem;>a,>div{min-inline-size:0;display:grid;gap:.25rem;padding:1rem;border:1px solid ${theme.colors.border};border-radius:${theme.radius.medium};background:${theme.colors.surface};color:${theme.colors.text};text-decoration:none;}span{color:${theme.colors.textMuted};font-size:.82rem;}@media(max-width:34rem){grid-template-columns:1fr;}`;
