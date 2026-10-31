import { Link } from "react-router-dom";
import styled from "styled-components";
import { useProgress } from "../../i18n/ProgressProvider";
import { theme } from "../../styles/theme";
import { GOETHE_B1_READING_CONFIG, READING_PART_CONFIG } from "../config/goetheB1";
import { loadReadingSession } from "../core/persistence";

export const ReadingHome = () => {
  const { progress } = useProgress();
  const reading = progress.readingProgress;
  const saved = loadReadingSession();
  const resumable = saved?.mode === "simulation" && saved?.status === "active";

  return (
    <Page>
      <Back to="/exam">← Exam overview</Back>
      <Hero>
        <Eyebrow>Goethe B1 · Lesen</Eyebrow>
        <h1>Goethe B1 Reading Practice</h1>
        <p>Five-part practice with original texts, precise explanations, and a complete timed simulation.</p>
        <Facts aria-label="Reading module facts">
          <span>65 minutes</span><span>5 parts</span><span>30 questions</span>
        </Facts>
      </Hero>

      {resumable && (
        <ResumeCard>
          <div><strong>Simulation in progress</strong><p>Your absolute deadline continues while you are away.</p></div>
          <PrimaryButton to="/exam/reading/simulation">Continue</PrimaryButton>
        </ResumeCard>
      )}

      <Stats>
        <Stat><span>Latest result</span><strong>{reading.latestResultScore === null ? "—" : `${reading.latestResultScore}/100`}</strong></Stat>
        <Stat><span>Best result</span><strong>{reading.simulationsCompleted ? `${reading.bestResultScore}/100` : "—"}</strong></Stat>
        <Stat><span>Simulations</span><strong>{reading.simulationsCompleted}</strong></Stat>
      </Stats>

      <SectionHeader><div><Eyebrow>Targeted training</Eyebrow><h2>Practice one part</h2></div><p>No countdown. Feedback appears after submission.</p></SectionHeader>
      <PartGrid>
        {READING_PART_CONFIG.map((part) => (
          <PartCard key={part.number} to={`/exam/reading/practice/${part.number}`}>
            <PartNumber>Part {part.number}</PartNumber>
            <strong>{part.title}</strong>
            <span>{part.itemCount} questions · about {part.recommendedSeconds / 60} min</span>
            <small>Start practice →</small>
          </PartCard>
        ))}
      </PartGrid>

      <Simulation>
        <div>
          <Eyebrow>Full simulation</Eyebrow>
          <h2>Take all 30 questions</h2>
          <p>One continuous {GOETHE_B1_READING_CONFIG.durationSeconds / 60}-minute timer, free navigation, automatic submission, and official-style result conversion.</p>
        </div>
        <PrimaryButton to="/exam/reading/simulation?new=1">Start new simulation</PrimaryButton>
      </Simulation>
      <Disclaimer>{GOETHE_B1_READING_CONFIG.disclaimer} All practice material is original and is not copied from official model tests.</Disclaimer>
    </Page>
  );
};

const Page = styled.main`inline-size: min(100%, 68rem); padding: 1.25rem 1rem 7rem; color: ${theme.colors.text};`;
const Back = styled(Link)`display: inline-block; margin-bottom: 1rem; color: ${theme.colors.primaryPressed}; font-weight: 800; text-decoration: none;`;
const Hero = styled.section`padding: clamp(1.25rem, 4vw, 2.5rem); border-radius: ${theme.radius.large}; color: white; background: linear-gradient(135deg, #27261f, #74521d); box-shadow: ${theme.shadow.soft}; h1 { margin: 0.25rem 0 0.6rem; font-size: clamp(1.8rem, 6vw, 3.2rem); line-height: 1.05; } p { max-inline-size: 42rem; margin: 0; color: #f4ead8; line-height: 1.6; }`;
const Eyebrow = styled.span`display: block; color: ${theme.colors.primary}; font-size: 0.76rem; font-weight: 900; letter-spacing: 0.11em; text-transform: uppercase;`;
const Facts = styled.div`display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1.35rem; span { padding: 0.45rem 0.75rem; border: 1px solid rgba(255,255,255,.3); border-radius: ${theme.radius.pill}; font-size: 0.82rem; font-weight: 800; }`;
const ResumeCard = styled.section`display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-top: 1rem; padding: 1rem; border: 2px solid ${theme.colors.primary}; border-radius: ${theme.radius.medium}; background: ${theme.colors.primarySoft}; p { margin: 0.25rem 0 0; color: ${theme.colors.textMuted}; } @media (max-width: 32rem) { align-items: stretch; flex-direction: column; }`;
const Stats = styled.section`display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin: 1rem 0 2rem; @media (max-width: 34rem) { grid-template-columns: 1fr; }`;
const Stat = styled.div`padding: 1rem; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.medium}; background: ${theme.colors.surface}; span { display: block; color: ${theme.colors.textMuted}; font-size: 0.78rem; } strong { display: block; margin-top: 0.25rem; font-size: 1.3rem; }`;
const SectionHeader = styled.div`display: flex; align-items: end; justify-content: space-between; gap: 1rem; margin-bottom: 0.75rem; h2 { margin: 0.2rem 0 0; } p { margin: 0; color: ${theme.colors.textMuted}; font-size: 0.84rem; } @media (max-width: 34rem) { align-items: start; flex-direction: column; }`;
const PartGrid = styled.section`display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 12.5rem), 1fr)); gap: 0.75rem;`;
const PartCard = styled(Link)`min-block-size: 10rem; display: flex; flex-direction: column; gap: 0.5rem; padding: 1rem; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.medium}; background: ${theme.colors.surface}; color: ${theme.colors.text}; text-decoration: none; box-shadow: ${theme.shadow.soft}; span { color: ${theme.colors.textMuted}; font-size: 0.8rem; line-height: 1.4; } small { margin-top: auto; color: ${theme.colors.primaryPressed}; font-weight: 900; } &:hover { border-color: ${theme.colors.primary}; transform: translateY(-2px); }`;
const PartNumber = styled.b`color: ${theme.colors.primaryPressed}; font-size: 0.75rem; text-transform: uppercase;`;
const Simulation = styled.section`display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; margin-top: 2rem; padding: clamp(1.2rem, 4vw, 2rem); border-radius: ${theme.radius.large}; background: ${theme.colors.surfaceMuted}; h2 { margin: 0.25rem 0; } p { max-inline-size: 40rem; margin: 0; color: ${theme.colors.textMuted}; line-height: 1.5; } @media (max-width: 42rem) { align-items: stretch; flex-direction: column; }`;
const PrimaryButton = styled(Link)`display: inline-flex; min-block-size: 3rem; align-items: center; justify-content: center; padding: 0.7rem 1rem; border-radius: ${theme.radius.small}; background: ${theme.colors.primary}; color: white; font-weight: 900; text-align: center; text-decoration: none; &:hover { background: ${theme.colors.primaryPressed}; }`;
const Disclaimer = styled.p`margin: 1.25rem 0 0; color: ${theme.colors.textMuted}; font-size: 0.74rem; line-height: 1.5;`;
