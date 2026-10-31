import styled from "styled-components";
import { theme } from "../../styles/theme";

export const WritingChecklist = ({ task, draft, disabled = false, onToggle }) => (
  <Box>
    <h2>Task checklist</h2>
    <p>Mark these yourself as you write. The app does not guess from keywords.</p>
    {task.checklist.map((label, index) => (
      <label key={label}>
        <input type="checkbox" checked={Boolean(draft.checklistState[index])} disabled={disabled} onChange={(event) => onToggle(index, event.target.checked)} />
        <span>{label}</span>
      </label>
    ))}
  </Box>
);

const Box = styled.section`padding:1rem;border:1px solid ${theme.colors.border};border-radius:${theme.radius.medium};background:${theme.colors.surface};h2{margin:0;font-size:1rem;}p{margin:.3rem 0 .8rem;color:${theme.colors.textMuted};font-size:.76rem;line-height:1.4;}label{display:flex;align-items:flex-start;gap:.6rem;margin:.65rem 0;line-height:1.4;}input{inline-size:1.2rem;block-size:1.2rem;flex:0 0 auto;accent-color:${theme.colors.primary};}`;
