import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useProgress } from "../../i18n/ProgressProvider";
import { theme } from "../../styles/theme";
import { GOETHE_B1_LISTENING_CONFIG, LISTENING_PART_CONFIG } from "../config/goetheB1Listening";
import { loadListeningSession } from "../core/listeningPersistence";
import { listeningForms } from "../data/listeningForms";
import { listeningAudioManifest } from "./audioManifest";
import { getListeningProductionReadiness } from "./manifestValidation";
import { cacheListeningAudio } from "./audioCache";

export const ListeningHome = () => {
  const { progress } = useProgress();
  const listening = progress.listeningProgress;
  const saved = loadListeningSession();
  const resumable = saved?.status === "active";
  const audioReady = getListeningProductionReadiness(listeningAudioManifest).productionReady;
  const developmentFixture = listeningAudioManifest.some(({ developmentFixture: fixture }) => fixture);
  const offlineForm = listeningForms[listening.attemptHistory.length % listeningForms.length];
  const offlineEntries = listeningAudioManifest.filter(({ formId }) => formId === offlineForm.id);
  const [offlineState, setOfflineState] = useState("idle");
  const [offlineProgress, setOfflineProgress] = useState(0);
  const prepareOffline = async () => {
    setOfflineState("preparing");
    setOfflineProgress(0);
    const result = await cacheListeningAudio(offlineEntries, {
      onProgress: ({ completed }) => setOfflineProgress(completed),
    });
    setOfflineState(result.cached ? "ready" : "error");
  };
  return (
    <Page>
      <Back to="/exam">← Exam overview</Back>
      <Hero><span>Goethe B1 · Hören</span><h1>Goethe B1 Listening Practice</h1><p>Listening practice aligned with the Goethe-Zertifikat B1 exam format.</p><Facts><b>~40 minutes</b><b>4 parts</b><b>30 questions</b></Facts></Hero>
      {!audioReady && <AudioNotice role="status"><strong>Versioned German audio production is pending</strong><p>The original scripts and player are ready, but scored attempts remain preflight-blocked until stable multi-voice assets are generated and checksummed. Runtime TTS is not used as exam audio.</p></AudioNotice>}
      {developmentFixture && <FixtureNotice role="status"><strong>Controlled development fixture active</strong><p>Silent test media is enabled for local UI verification only. It is not German listening content and cannot be enabled in a production build.</p></FixtureNotice>}
      {audioReady && !developmentFixture && <OfflineCard><div><strong>Optional offline audio · {offlineForm.title}</strong><p>Download this form’s eight versioned tracks before going offline. Availability is confirmed again before the timer starts.</p></div><button type="button" disabled={offlineState === "preparing"} onClick={prepareOffline}>{offlineState === "preparing" ? `Preparing ${offlineProgress} / 8…` : offlineState === "ready" ? "8 / 8 tracks ready offline" : "Prepare 8 tracks offline"}</button>{offlineState === "error" && <small role="alert">This form’s eight audio tracks could not be cached. Stay online and try again.</small>}</OfflineCard>}
      {resumable && <Resume><div><strong>Listening simulation in progress</strong><p>The timer and allowed playback counts continue from the saved state.</p></div><Primary to="/exam/listening/simulation">Continue</Primary></Resume>}
      <Stats><div><span>Latest result</span><strong>{listening.latestResultScore === null ? "—" : `${listening.latestResultScore}/100`}</strong></div><div><span>Best result</span><strong>{listening.simulationsCompleted ? `${listening.bestResultScore}/100` : "—"}</strong></div><div><span>Simulations</span><strong>{listening.simulationsCompleted}</strong></div></Stats>
      <h2>Practice one part</h2>
      <Grid>{LISTENING_PART_CONFIG.map((part) => <Card key={part.number} to={`/exam/listening/practice/${part.number}`}><b>Part {part.number}</b><strong>{part.title}</strong><span>{part.itemCount} questions · heard {part.playbackLimit === 2 ? "twice" : "once"}</span><small>Start exam-mode practice →</small></Card>)}</Grid>
      <Simulation><div><span>Full simulation</span><h2>Complete the ordered Listening module</h2><p>Audio preflight runs before the absolute {GOETHE_B1_LISTENING_CONFIG.durationSeconds / 60}-minute timer begins.</p></div><Primary to="/exam/listening/simulation?new=1">Prepare new simulation</Primary></Simulation>
      <Disclaimer>{GOETHE_B1_LISTENING_CONFIG.disclaimer} No official audio, scripts, performances, or questions are included.</Disclaimer>
    </Page>
  );
};

const Page = styled.main`inline-size: min(100%, 68rem); padding: 1.25rem 1rem 7rem; color: ${theme.colors.text}; h2 { margin-top: 1.5rem; }`;
const Back = styled(Link)`display: inline-block; margin-bottom: 1rem; color: ${theme.colors.primaryPressed}; font-weight: 800; text-decoration: none;`;
const Hero = styled.section`padding: clamp(1.25rem,4vw,2.5rem); border-radius: ${theme.radius.large}; background: linear-gradient(135deg,#20201d,#5d4a28); color: white; box-shadow: ${theme.shadow.soft}; & > span { color: #f1c875; font-size: .75rem; font-weight: 900; text-transform: uppercase; } h1 { margin: .25rem 0 .6rem; font-size: clamp(1.8rem,6vw,3.2rem); } p { margin: 0; color: #f4ead8; }`;
const Facts = styled.div`display: flex; flex-wrap: wrap; gap: .5rem; margin-top: 1.2rem; b { padding: .4rem .65rem; border: 1px solid rgba(255,255,255,.3); border-radius: ${theme.radius.pill}; font-size: .8rem; }`;
const AudioNotice = styled.section`margin-top: 1rem; padding: 1rem; border: 2px solid ${theme.colors.error}; border-radius: ${theme.radius.medium}; background: ${theme.colors.errorSoft}; color: ${theme.colors.error}; p { margin: .3rem 0 0; line-height: 1.5; }`;
const FixtureNotice = styled(AudioNotice)`border-color:${theme.colors.primary};background:${theme.colors.primarySoft};color:${theme.colors.primaryPressed};`;
const OfflineCard = styled.section`display:grid;grid-template-columns:1fr auto;align-items:center;gap:1rem;margin-top:1rem;padding:1rem;border:1px solid ${theme.colors.border};border-radius:${theme.radius.medium};background:${theme.colors.surface};p{margin:.25rem 0 0;color:${theme.colors.textMuted};font-size:.8rem;}button{min-block-size:2.8rem;padding:.6rem .8rem;border:0;border-radius:${theme.radius.small};background:${theme.colors.primary};color:white;font:inherit;font-weight:900;}small{grid-column:1/-1;color:${theme.colors.error};}@media(max-width:32rem){grid-template-columns:1fr;button{inline-size:100%;}}`;
const Resume = styled.section`display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-top: 1rem; padding: 1rem; border-radius: ${theme.radius.medium}; background: ${theme.colors.primarySoft}; p { margin: .25rem 0 0; } @media(max-width:32rem){align-items:stretch;flex-direction:column;}`;
const Stats = styled.section`display: grid; grid-template-columns: repeat(3,1fr); gap: .7rem; margin: 1rem 0; div { padding: 1rem; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.medium}; background: ${theme.colors.surface}; } span,strong { display:block; } span { color:${theme.colors.textMuted};font-size:.75rem;} strong {margin-top:.2rem;font-size:1.25rem;} @media(max-width:34rem){grid-template-columns:1fr;}`;
const Grid = styled.section`display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,13rem),1fr));gap:.7rem;`;
const Card = styled(Link)`min-block-size:10rem;display:flex;flex-direction:column;gap:.45rem;padding:1rem;border:1px solid ${theme.colors.border};border-radius:${theme.radius.medium};background:${theme.colors.surface};color:${theme.colors.text};text-decoration:none;box-shadow:${theme.shadow.soft}; & > b {color:${theme.colors.primaryPressed};font-size:.75rem;text-transform:uppercase;} span{color:${theme.colors.textMuted};font-size:.8rem;} small{margin-top:auto;color:${theme.colors.primaryPressed};font-weight:900;}`;
const Simulation = styled.section`display:flex;align-items:center;justify-content:space-between;gap:1.2rem;margin-top:2rem;padding:1.2rem;border-radius:${theme.radius.large};background:${theme.colors.surfaceMuted}; & span{color:${theme.colors.primaryPressed};font-size:.72rem;font-weight:900;text-transform:uppercase;} h2{margin:.25rem 0;} p{margin:0;color:${theme.colors.textMuted};} @media(max-width:40rem){align-items:stretch;flex-direction:column;}`;
const Primary = styled(Link)`display:inline-flex;min-block-size:3rem;align-items:center;justify-content:center;padding:.7rem 1rem;border-radius:${theme.radius.small};background:${theme.colors.primary};color:white;font-weight:900;text-align:center;text-decoration:none;`;
const Disclaimer = styled.p`color:${theme.colors.textMuted};font-size:.74rem;line-height:1.45;`;
