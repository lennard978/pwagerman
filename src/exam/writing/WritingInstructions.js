import styled from "styled-components";
import { theme } from "../../styles/theme";

export const WritingInstructions = ({ task, simulation }) => (
  <Card>
    <Header><span>Task {task.part}</span><b>{task.title}</b><small>about {task.approximateWordTarget} words · suggested {task.suggestedMinutes} min</small></Header>
    <p>{task.scenario}</p>
    <Prompt>{task.prompt}</Prompt>
    <ul>{task.bulletPoints.map((point) => <li key={point}>{point}</li>)}</ul>
    <Note>{simulation ? "Write independently. Hints, phrase banks, and model guidance remain hidden until submission." : "Use the checklist to plan. Guidance appears after you submit this practice task."}</Note>
  </Card>
);

const Card = styled.section`padding:clamp(1rem,3vw,1.4rem);border:1px solid ${theme.colors.border};border-radius:${theme.radius.large};background:${theme.colors.surface};box-shadow:${theme.shadow.soft};p{line-height:1.55;}ul{padding-inline-start:1.3rem;li{margin:.45rem 0;line-height:1.45;}}`;
const Header = styled.div`display:flex;flex-wrap:wrap;align-items:baseline;gap:.4rem .7rem;padding-bottom:.7rem;border-bottom:1px solid ${theme.colors.border};span{color:${theme.colors.primaryPressed};font-size:.72rem;font-weight:900;text-transform:uppercase;}b{font-size:1.08rem;}small{margin-inline-start:auto;color:${theme.colors.textMuted};}`;
const Prompt = styled.p`font-weight:900;`;
const Note = styled.p`margin-bottom:0;padding:.7rem;border-radius:${theme.radius.small};background:${theme.colors.surfaceMuted};color:${theme.colors.textMuted};font-size:.78rem;`;
