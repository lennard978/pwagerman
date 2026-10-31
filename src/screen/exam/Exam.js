import { Link } from "react-router-dom";
import styled from "styled-components";
import { B1_EXAM_CONFIG, EXAM_MODULE_IDS } from "../../config/exam";
import { useLanguage } from "../../i18n/LanguageProvider";
import { theme } from "../../styles/theme";
import { useProgress } from "../../i18n/ProgressProvider";
import { loadMockSession } from "../../exam/core/mockPersistence";
import { getFullMockAvailability } from "../../exam/config/goetheB1Mock";

const moduleSummary = (id) => {
  const config = B1_EXAM_CONFIG[id];
  if (id === "speaking") return `${config.pairDurationMinutes} min pair module · ${config.preparationMinutes} min preparation · ${config.parts} parts`;
  return `${config.durationMinutes} min · ${config.parts} parts`;
};

export const Exam = () => {
  const { t } = useLanguage();
  const { progress } = useProgress();
  const activeMock = loadMockSession();
  const availability = getFullMockAvailability();
  const resumable = activeMock && ["instructions", "active"].includes(activeMock.status);
  const completedModules = resumable ? Object.values(activeMock.modules).filter(({ status }) => status === "completed").length : 0;
  const latest = progress.mockProgress.latestMock;
  return (
    <Wrapper>
      <h1>{t("navigation.exam")}</h1>
      <Intro>{t("exam.description")}</Intro>
      <Grid>
        {EXAM_MODULE_IDS.map((id) => (
          <Card key={id} to={`/exam/${id}`}>
            <strong>{t(`exam.${id}`)}</strong>
            <span>{id === "reading" || id === "listening" ? `${moduleSummary(id)} · 30 questions` : moduleSummary(id)}</span>
            <small>{id === "reading" || id === "listening" || id === "writing" || id === "speaking" ? "Practice available" : t("foundation.upcoming")}</small>
          </Card>
        ))}
        <MockCard to="/exam/full-mock-b1">
          <strong>{t("exam.fullMock")}</strong>
          <span>Four independent modules · no overall average or pass result</span>
          <small>{resumable ? `Continue active mock · ${completedModules}/4 modules` : availability.available ? "Start Full B1 Practice Mock" : "Listening production audio pending"}</small>
          {latest && <em>Latest: {latest.status} · {new Date(latest.at).toLocaleDateString()}</em>}
        </MockCard>
        <Card to="/exam/readiness"><strong>Readiness dashboard</strong><span>Vocabulary, Grammar, Reading, Listening, Writing, and Speaking practice indicators</span><small>View transparent categories</small></Card>
      </Grid>
      <Reference>{t("exam.aligned")}</Reference>
      <Disclaimer>{t("app.disclaimer")}</Disclaimer>
    </Wrapper>
  );
};

const Wrapper = styled.main`inline-size: min(100%, 48rem); min-block-size: 100vh; padding: 1.25rem 1rem 7rem; & h1 { margin: 0; }`;
const Intro = styled.p`margin: 0.4rem 0 1.25rem; color: ${theme.colors.textMuted};`;
const Grid = styled.div`display: grid; gap: 0.75rem; grid-template-columns: repeat(auto-fit, minmax(min(100%, 13rem), 1fr));`;
const Card = styled(Link)`min-block-size: 8.5rem; display: flex; flex-direction: column; gap: 0.5rem; padding: 1rem; color: ${theme.colors.text}; background: ${theme.colors.surface}; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.medium}; box-shadow: ${theme.shadow.soft}; text-decoration: none; & span { color: ${theme.colors.textMuted}; font-size: 0.82rem; line-height: 1.4; } & small { margin-top: auto; color: ${theme.colors.primaryPressed}; font-weight: 800; } &:hover { border-color: ${theme.colors.primary}; }`;
const MockCard = styled(Card)`grid-column:1/-1;min-block-size:9rem;border:2px solid ${theme.colors.primary};background:${theme.colors.primarySoft};& em{color:${theme.colors.textMuted};font-size:.72rem;font-style:normal;}`;
const Reference = styled.p`margin: 1.25rem 0 0.35rem; color: ${theme.colors.text}; font-weight: 700;`;
const Disclaimer = styled.p`margin: 0; color: ${theme.colors.textMuted}; font-size: 0.78rem; line-height: 1.45;`;
