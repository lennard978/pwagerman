import { Navigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { B1_EXAM_CONFIG, EXAM_MODULE_IDS } from "../../config/exam";
import { useLanguage } from "../../i18n/LanguageProvider";
import { theme } from "../../styles/theme";

export const ExamModule = () => {
  const { moduleId } = useParams();
  const { t } = useLanguage();
  if (moduleId === "full-mock-b1") {
    return <Module title={t("exam.fullMock")} detail={t("exam.fullMockDescription")} />;
  }
  if (!EXAM_MODULE_IDS.includes(moduleId)) return <Navigate to="/exam" replace />;
  const config = B1_EXAM_CONFIG[moduleId];
  const duration = moduleId === "speaking"
    ? `${config.pairDurationMinutes} min pair module; ${config.preparationMinutes} min preparation`
    : `${config.durationMinutes} min`;
  const scoring = config.scoring.maximumPoints
    ? `${config.scoring.maximumPoints} points maximum; ${config.scoring.passThreshold} points to pass this module`
    : t("exam.moduleSpecificScoring");
  return <Module title={t(`exam.${moduleId}`)} detail={`${duration} · ${config.parts} parts · ${scoring}`} />;
};

const Module = ({ title, detail }) => {
  const { t } = useLanguage();
  return (
    <Wrapper>
      <h1>{title}</h1>
      <Card><strong>{t("foundation.upcoming")}</strong><p>{detail}</p><p>{t("foundation.exam")}</p></Card>
    </Wrapper>
  );
};

const Wrapper = styled.main`inline-size: min(100%, 42rem); min-block-size: 100vh; padding: 1.25rem 1rem 7rem; & h1 { margin-top: 0; }`;
const Card = styled.section`padding: 1.25rem; background: ${theme.colors.surface}; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.large}; box-shadow: ${theme.shadow.soft}; & strong { color: ${theme.colors.primaryPressed}; } & p { color: ${theme.colors.textMuted}; line-height: 1.55; }`;
