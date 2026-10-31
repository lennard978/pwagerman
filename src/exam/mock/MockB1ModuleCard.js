import styled from "styled-components";
import { theme } from "../../styles/theme";

const labels = { reading: "Reading", listening: "Listening", writing: "Writing", speaking: "Speaking" };

export const MockB1ModuleCard = ({ moduleId, entry, active, onStart }) => {
  const complete = entry.status === "completed";
  const status = complete ? "Completed and locked" : entry.status === "in-progress" ? "In progress" : entry.status === "abandoned" ? "Abandoned · restart available" : active ? "Ready to start" : "Not started";
  return (
    <Card $active={active} aria-label={`${labels[moduleId]}: ${status}`}>
      <Header><span>{labels[moduleId]}</span><b>{status}</b></Header>
      {entry.result?.scoreStatus === "objective" && <Result><strong>{entry.result.resultScore} / 100</strong><span>{entry.result.passed ? "Met 60-point threshold" : "Below 60-point threshold"}</span></Result>}
      {entry.result?.scoreStatus === "self-assessed" && <Result><strong>Self-assessed</strong><span>Review available</span></Result>}
      {entry.result?.scoreStatus === "self-assessment-incomplete" && <Result><strong>Completed</strong><span>Self-assessment not completed</span></Result>}
      {!complete && active && <button type="button" onClick={() => onStart(moduleId)}>{entry.status === "in-progress" ? "Continue module" : "Start module"}</button>}
    </Card>
  );
};

const Card = styled.article`min-inline-size:0;display:grid;gap:.7rem;padding:1rem;border:2px solid ${({ $active }) => $active ? theme.colors.primary : theme.colors.border};border-radius:${theme.radius.medium};background:${theme.colors.surface};box-shadow:${theme.shadow.soft};`;
const Header = styled.div`display:flex;align-items:flex-start;justify-content:space-between;gap:.6rem;span{font-size:1.05rem;font-weight:900;}b{color:${theme.colors.textMuted};font-size:.72rem;text-align:end;}`;
const Result = styled.div`strong,span{display:block;}span{color:${theme.colors.textMuted};font-size:.78rem;}`;
