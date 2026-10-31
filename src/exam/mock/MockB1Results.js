import { Link } from "react-router-dom";
import styled from "styled-components";
import { theme } from "../../styles/theme";
import { buildMockSummary, getMockRecommendations } from "../core/mockState";
import { MOCK_MODULE_ROUTES } from "../core/mockModuleBridge";

const labels = { reading: "Reading", listening: "Listening", writing: "Writing", speaking: "Speaking" };

export const MockB1Results = ({ session, progress }) => {
  const summary = buildMockSummary(session);
  const recommendations = getMockRecommendations(session, progress);
  return <Results><span>PRACTICE MOCK COMPLETED</span><h1>German B1 Mock Practice</h1><Lead>Completion does not certify B1. Every module remains independent.</Lead><Modules>{Object.entries(session.modules).map(([id, entry]) => <article key={id}><h2>{labels[id]}</h2>{entry.result?.scoreStatus === "objective" ? <><strong>{entry.result.resultScore} / 100</strong><p>Raw: {entry.result.rawScore} · {entry.result.passed ? "Met module threshold" : "Below module threshold"}</p></> : <><strong>{entry.result?.scoreStatus === "self-assessed" ? "Self-assessed" : "Self-assessment not completed"}</strong><p>Submitted productive module · review available</p></>}<Link to={MOCK_MODULE_ROUTES[id]}>Review {labels[id]}</Link></article>)}</Modules><Threshold><strong>Modules meeting objective threshold: {summary.objectiveThresholds.met} / {summary.objectiveThresholds.total} objectively scored modules</strong><span>Productive self-assessments completed: {summary.productiveAssessmentsCompleted} / 2</span></Threshold><h2>Practice recommendations</h2><Recommendations>{recommendations.map(({ module, text, route }) => <li key={`${module}-${text}`}><div><strong>{module}</strong><span>{text}</span></div><Link to={route}>Open practice</Link></li>)}</Recommendations><Actions><Link to="/exam/readiness">Readiness dashboard</Link><Link to="/exam/full-mock-b1">Mock home</Link></Actions></Results>;
};

const Results = styled.section`inline-size:min(100%,68rem);margin:auto;>span{color:${theme.colors.primaryPressed};font-size:.7rem;font-weight:900;}h1{margin:.25rem 0;}`;
const Lead = styled.p`color:${theme.colors.textMuted};`;
const Modules = styled.div`display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.7rem;article{padding:1rem;border:1px solid ${theme.colors.border};border-radius:${theme.radius.medium};background:${theme.colors.surface};}h2{margin:0;font-size:1rem;}strong{display:block;margin-top:.5rem;font-size:1.3rem;}p{color:${theme.colors.textMuted};font-size:.8rem;}a{color:${theme.colors.primaryPressed};font-weight:900;}@media(max-width:36rem){grid-template-columns:1fr;}`;
const Threshold = styled.div`display:grid;gap:.25rem;margin-top:1rem;padding:1rem;border-radius:${theme.radius.medium};background:${theme.colors.primarySoft};span{color:${theme.colors.textMuted};}`;
const Recommendations = styled.ul`display:grid;gap:.5rem;padding:0;list-style:none;li{display:flex;align-items:center;justify-content:space-between;gap:.8rem;padding:.8rem;border:1px solid ${theme.colors.border};border-radius:${theme.radius.small};background:${theme.colors.surface};}strong,span{display:block;}span{color:${theme.colors.textMuted};font-size:.82rem;}a{color:${theme.colors.primaryPressed};font-weight:900;}@media(max-width:32rem){li{align-items:flex-start;flex-direction:column;}}`;
const Actions = styled.div`display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1rem;a{min-block-size:2.8rem;display:inline-flex;align-items:center;padding:.6rem .8rem;border-radius:${theme.radius.small};background:${theme.colors.primary};color:white;font-weight:900;text-decoration:none;}`;
