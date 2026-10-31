import styled from "styled-components";
import { theme } from "../../styles/theme";

export const MockB1History = ({ history }) => (
  <Section aria-labelledby="mock-history-title">
    <h2 id="mock-history-title">Practice mock history</h2>
    {!history.length && <p>No mock attempts recorded yet.</p>}
    <List>{[...history].reverse().map((attempt) => (
      <li key={attempt.sessionId}>
        <div><strong>{attempt.status === "completed" ? "Completed" : "Abandoned"}</strong><span>{new Date(attempt.completedAt || attempt.abandonedAt || attempt.startedAt).toLocaleDateString()}</span></div>
        <small>{Object.values(attempt.modules).filter(({ status }) => status === "completed").length} / 4 modules completed</small>
      </li>
    ))}</List>
  </Section>
);

const Section = styled.section`margin-top:1.25rem;h2{margin-bottom:.6rem;}p{color:${theme.colors.textMuted};}`;
const List = styled.ul`display:grid;gap:.5rem;margin:0;padding:0;list-style:none;li{display:flex;align-items:center;justify-content:space-between;gap:.8rem;padding:.8rem;border:1px solid ${theme.colors.border};border-radius:${theme.radius.small};background:${theme.colors.surface};}strong,span{display:block;}span,small{color:${theme.colors.textMuted};font-size:.76rem;}`;
