import { Link } from "react-router-dom";
import styled from "styled-components";
import { useProgress } from "../../i18n/ProgressProvider";
import { theme } from "../../styles/theme";
import { getReadinessIndicators } from "../core/readiness";

const labels = { vocabulary: "Vocabulary coverage", grammar: "Grammar completion", reading: "Reading practice", listening: "Listening practice", writing: "Writing consistency", speaking: "Speaking consistency" };

export const ReadinessDashboard = () => {
  const { progress } = useProgress();
  const indicators = getReadinessIndicators(progress);
  return <Page><Link to="/exam">← Exam overview</Link><header><span>TRANSPARENT PRACTICE INDICATORS</span><h1>German B1 readiness dashboard</h1><p>Categories describe recorded practice only. They are not certification, an official readiness score, or a pass prediction.</p></header><Grid>{Object.entries(indicators).map(([id, value]) => <Card key={id}><small>{labels[id]}</small><strong>{value.category}</strong><p>{value.detail}</p></Card>)}</Grid><Method><h2>How categories work</h2><p>Reading and Listening reach Strong practice only after at least three simulations when two of the latest three meet 60. Writing and Speaking require at least three simulations plus two recent complete self-assessments averaging 2 or more. Vocabulary and Grammar use documented curriculum-completion bands.</p></Method></Page>;
};

const Page = styled.main`inline-size:min(100%,68rem);min-block-size:100vh;padding:1.25rem 1rem 7rem;color:${theme.colors.text};>a{color:${theme.colors.primaryPressed};font-weight:900;text-decoration:none;}header{margin-top:1rem;padding:clamp(1rem,4vw,2rem);border-radius:${theme.radius.large};background:${theme.colors.navy};color:white;}header>span{color:#f4bf62;font-size:.7rem;font-weight:900;}h1{margin:.25rem 0;}header p{color:#f1eadc;line-height:1.5;}`;
const Grid = styled.section`display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.7rem;margin-top:1rem;@media(max-width:46rem){grid-template-columns:repeat(2,minmax(0,1fr));}@media(max-width:28rem){grid-template-columns:1fr;}`;
const Card = styled.article`min-inline-size:0;padding:1rem;border:1px solid ${theme.colors.border};border-radius:${theme.radius.medium};background:${theme.colors.surface};small,strong{display:block;}small{color:${theme.colors.textMuted};}strong{margin-top:.3rem;font-size:1.15rem;}p{color:${theme.colors.textMuted};font-size:.82rem;line-height:1.45;}`;
const Method = styled.section`margin-top:1rem;padding:1rem;border-radius:${theme.radius.medium};background:${theme.colors.surfaceMuted};h2{margin:0;}p{color:${theme.colors.textMuted};line-height:1.5;}`;
