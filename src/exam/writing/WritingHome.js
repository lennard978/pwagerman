import { Link } from "react-router-dom";
import styled from "styled-components";
import { useProgress } from "../../i18n/ProgressProvider";
import { theme } from "../../styles/theme";
import { GOETHE_B1_WRITING_CONFIG, WRITING_TASK_CONFIG } from "../config/goetheB1Writing";
import { loadWritingSession } from "../core/writingPersistence";
import { writingPhraseBank } from "./phraseBank";

export const WritingHome = () => {
  const { progress } = useProgress();
  const writing = progress.writingProgress;
  const saved = loadWritingSession();
  const resumable = saved?.status === "active";
  const latest = writing.attemptHistory[writing.attemptHistory.length - 1];
  const latestAssessment = latest?.selfAssessment
    ? Object.values(latest.selfAssessment).filter(Number.isInteger)
    : [];
  const assessmentLabel = latestAssessment.length === 4 ? `${latestAssessment.reduce((sum, value) => sum + value, 0)}/12 self-assessed` : "—";
  return (
    <Page>
      <Back to="/exam">← Exam overview</Back>
      <Hero><span>Goethe B1 · Schreiben</span><h1>Goethe B1 Writing Practice</h1><p>{GOETHE_B1_WRITING_CONFIG.alignment}</p><Facts><b>60 minutes</b><b>3 tasks</b><b>about 200 words</b></Facts></Hero>
      {resumable && <Resume><div><strong>Writing simulation in progress</strong><p>Your timer continues while you are away. Every saved draft will be restored.</p></div><Primary to="/exam/writing/simulation">Continue Writing simulation</Primary></Resume>}
      <Stats><div><span>Full simulations</span><strong>{writing.simulationsCompleted}</strong></div><div><span>Latest self-assessment</span><strong>{assessmentLabel}</strong></div><div><span>Recent attempts</span><strong>{writing.attemptHistory.length}</strong></div></Stats>
      <SectionTitle><span>Targeted training</span><h2>Practice one task</h2><p>No mandatory 60-minute timer. Guidance unlocks after submission.</p></SectionTitle>
      <TaskGrid>{WRITING_TASK_CONFIG.map((task) => <TaskCard key={task.number} to={`/exam/writing/practice/${task.number}`}><b>Task {task.number}</b><strong>{task.title}</strong><span>about {task.approximateWordTarget} words · {task.suggestedMinutes}-minute exam reference</span><small>Start practice →</small></TaskCard>)}</TaskGrid>
      <Simulation><div><span>Full simulation</span><h2>Write all three tasks</h2><p>One continuous 60-minute timer, debounced autosave, task navigation, and automatic final-draft submission at expiry.</p></div><Primary to="/exam/writing/simulation?new=1">Start new simulation</Primary></Simulation>
      <PhraseSection><SectionTitle><span>Study resource</span><h2>Original useful phrase bank</h2><p>Available for preparation and review, but hidden throughout a full simulation.</p></SectionTitle><PhraseGrid>{writingPhraseBank.map((category) => <details key={category.id}><summary>{category.title}</summary><ul>{category.groups.map(([label, phrase]) => <li key={label}><b>{label}:</b> {phrase}</li>)}</ul></details>)}</PhraseGrid><PhraseLink to="/practice/writing-phrases">Open the full Writing phrase bank</PhraseLink></PhraseSection>
      <Disclaimer>{GOETHE_B1_WRITING_CONFIG.disclaimer} All prompts and guidance are original. Self-assessment is not official grading.</Disclaimer>
    </Page>
  );
};

const Page = styled.main`inline-size:min(100%,68rem);padding:1.25rem 1rem 7rem;color:${theme.colors.text};`;
const Back = styled(Link)`display:inline-block;margin-bottom:1rem;color:${theme.colors.primaryPressed};font-weight:800;text-decoration:none;`;
const Hero = styled.section`padding:clamp(1.25rem,4vw,2.5rem);border-radius:${theme.radius.large};color:white;background:linear-gradient(135deg,#20201d,#7c4a17);box-shadow:${theme.shadow.soft};>span{color:#f4bf62;font-size:.75rem;font-weight:900;letter-spacing:.1em;text-transform:uppercase;}h1{margin:.25rem 0 .6rem;font-size:clamp(1.8rem,6vw,3.2rem);line-height:1.05;}p{max-inline-size:42rem;margin:0;color:#f7eddb;line-height:1.6;}`;
const Facts = styled.div`display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1.25rem;b{padding:.45rem .7rem;border:1px solid rgba(255,255,255,.3);border-radius:${theme.radius.pill};font-size:.8rem;}`;
const Resume = styled.section`display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-top:1rem;padding:1rem;border:2px solid ${theme.colors.primary};border-radius:${theme.radius.medium};background:${theme.colors.primarySoft};p{margin:.25rem 0 0;color:${theme.colors.textMuted};}@media(max-width:34rem){align-items:stretch;flex-direction:column;}`;
const Stats = styled.section`display:grid;grid-template-columns:repeat(3,1fr);gap:.7rem;margin:1rem 0 2rem;div{padding:1rem;border:1px solid ${theme.colors.border};border-radius:${theme.radius.medium};background:${theme.colors.surface};}span{display:block;color:${theme.colors.textMuted};font-size:.75rem;}strong{display:block;margin-top:.25rem;font-size:1.2rem;}@media(max-width:36rem){grid-template-columns:1fr;}`;
const SectionTitle = styled.div`margin-bottom:.75rem;>span{color:${theme.colors.primaryPressed};font-size:.72rem;font-weight:900;text-transform:uppercase;}h2{margin:.2rem 0;}p{margin:0;color:${theme.colors.textMuted};font-size:.82rem;}`;
const TaskGrid = styled.section`display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.7rem;@media(max-width:44rem){grid-template-columns:1fr;}`;
const TaskCard = styled(Link)`min-block-size:10rem;display:flex;flex-direction:column;gap:.5rem;padding:1rem;border:1px solid ${theme.colors.border};border-radius:${theme.radius.medium};background:${theme.colors.surface};color:${theme.colors.text};text-decoration:none;box-shadow:${theme.shadow.soft};>b{color:${theme.colors.primaryPressed};font-size:.72rem;text-transform:uppercase;}span{color:${theme.colors.textMuted};font-size:.78rem;line-height:1.4;}small{margin-top:auto;color:${theme.colors.primaryPressed};font-weight:900;}`;
const Simulation = styled.section`display:flex;align-items:center;justify-content:space-between;gap:1.5rem;margin-top:2rem;padding:clamp(1.2rem,4vw,2rem);border-radius:${theme.radius.large};background:${theme.colors.surfaceMuted};span{color:${theme.colors.primaryPressed};font-size:.72rem;font-weight:900;text-transform:uppercase;}h2{margin:.25rem 0;}p{max-inline-size:40rem;margin:0;color:${theme.colors.textMuted};line-height:1.5;}@media(max-width:42rem){align-items:stretch;flex-direction:column;}`;
const Primary = styled(Link)`display:inline-flex;min-block-size:3rem;align-items:center;justify-content:center;padding:.7rem 1rem;border-radius:${theme.radius.small};background:${theme.colors.primary};color:white;font-weight:900;text-align:center;text-decoration:none;`;
const PhraseSection = styled.section`margin-top:2rem;`;
const PhraseGrid = styled.div`display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.7rem;details{min-inline-size:0;padding:.8rem;border:1px solid ${theme.colors.border};border-radius:${theme.radius.medium};background:${theme.colors.surface};}summary{cursor:pointer;font-weight:900;}ul{padding-left:1.1rem;}li{margin:.5rem 0;font-size:.78rem;line-height:1.45;}@media(max-width:44rem){grid-template-columns:1fr;}`;
const PhraseLink = styled(Link)`display:inline-flex;margin-top:.75rem;color:${theme.colors.primaryPressed};font-weight:900;`;
const Disclaimer = styled.p`margin:1.25rem 0 0;color:${theme.colors.textMuted};font-size:.72rem;line-height:1.5;`;
