import styled from "styled-components";
import { theme } from "../../styles/theme";

export const MockB1Instructions = ({ availability, onBegin, compact = false }) => (
  <Panel aria-labelledby="mock-instructions-title">
    <span>GOETHE-FORMAT · INDEPENDENT PRACTICE</span>
    <h1 id="mock-instructions-title">Full B1 Practice Mock</h1>
    <p>This practice mock combines the four B1 modules for preparation. It does not reproduce official administration conditions.</p>
    <Modules>
      <li><b>Reading</b><small>65 minutes · objective result, threshold 60/100</small></li>
      <li><b>Listening</b><small>approximately 40 minutes · objective result, threshold 60/100</small></li>
      <li><b>Writing</b><small>60 minutes · completion and learner self-assessment</small></li>
      <li><b>Speaking</b><small>15-minute preparation plus speaking time · learner self-assessment</small></li>
    </Modules>
    {!compact && <Notice><strong>No overall score or pass result</strong><span>Each module remains independent. Writing and Speaking are not automatically graded.</span></Notice>}
    {!availability.available && <Blocked role="status"><strong>Full mock is not available yet because Listening audio is still being prepared.</strong><span>Development-only silent fixtures are never used for a production mock.</span></Blocked>}
    {availability.developmentFixture && <Blocked role="status"><strong>Controlled development fixture enabled</strong><span>This mode is for orchestration tests only, not a scored production attempt.</span></Blocked>}
    {onBegin && <button type="button" disabled={!availability.available} onClick={onBegin}>Begin Full B1 Practice Mock</button>}
    <Fine>Independent preparation tool. Not affiliated with or endorsed by the Goethe-Institut.</Fine>
  </Panel>
);

const Panel = styled.section`inline-size:min(100%,58rem);padding:clamp(1rem,4vw,2rem);border:1px solid ${theme.colors.border};border-radius:${theme.radius.large};background:${theme.colors.surface};box-shadow:${theme.shadow.soft};>span{color:${theme.colors.primaryPressed};font-size:.7rem;font-weight:900;letter-spacing:.08em;}h1{margin:.3rem 0;}p{color:${theme.colors.textMuted};line-height:1.5;}button{min-block-size:3rem;margin-top:1rem;padding:.7rem 1rem;border:0;border-radius:${theme.radius.small};background:${theme.colors.primary};color:white;font:inherit;font-weight:900;}button:disabled{background:${theme.colors.border};color:${theme.colors.textMuted};cursor:not-allowed;}`;
const Modules = styled.ol`display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.55rem;padding:0;list-style:none;li{padding:.8rem;border:1px solid ${theme.colors.border};border-radius:${theme.radius.small};background:${theme.colors.surfaceMuted};}b,small{display:block;}small{margin-top:.2rem;color:${theme.colors.textMuted};line-height:1.4;}@media(max-width:38rem){grid-template-columns:1fr;}`;
const Notice = styled.div`margin-top:.8rem;padding:.8rem;border-radius:${theme.radius.small};background:${theme.colors.primarySoft};strong,span{display:block;}span{margin-top:.2rem;color:${theme.colors.textMuted};}`;
const Blocked = styled(Notice)`background:#fff0dd;color:#5e3900;`;
const Fine = styled.small`display:block;margin-top:1rem;color:${theme.colors.textMuted};line-height:1.4;`;
