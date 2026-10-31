import styled from "styled-components";
import { theme } from "../../styles/theme";
import { getWordTargetGuidance } from "../core/wordCount";

export const WritingEditor = ({ task, draft, saveState, onChange }) => (
  <EditorCard>
    <EditorHeader>
      <label htmlFor={`writing-editor-${task.id}`}>Your response</label>
      <SaveStatus role="status" aria-live="polite">{saveState === "saving" ? "Saving…" : saveState === "error" ? "Saved in this tab only" : "Saved"}</SaveStatus>
    </EditorHeader>
    <textarea
      id={`writing-editor-${task.id}`}
      value={draft.text}
      onChange={(event) => onChange(event.target.value)}
      spellCheck="true"
      autoComplete="off"
      autoCorrect="on"
      autoCapitalize="sentences"
      aria-describedby={`writing-count-${task.id}`}
      placeholder="Write your response here…"
    />
    <Counter id={`writing-count-${task.id}`}><strong>Word count: {draft.wordCount}</strong><span>Target: about {task.approximateWordTarget}</span></Counter>
    <Guidance>{getWordTargetGuidance(draft.wordCount, task.approximateWordTarget)}</Guidance>
  </EditorCard>
);

const EditorCard = styled.section`min-inline-size:0;padding:1rem;border:1px solid ${theme.colors.border};border-radius:${theme.radius.medium};background:${theme.colors.surface};textarea{display:block;inline-size:100%;min-block-size:clamp(18rem,48vh,34rem);resize:vertical;padding:1rem;border:2px solid ${theme.colors.border};border-radius:${theme.radius.small};background:#fff;color:${theme.colors.text};font:inherit;font-size:1rem;line-height:1.65;overflow-wrap:anywhere;&:focus-visible{outline:3px solid ${theme.colors.primarySoft};border-color:${theme.colors.primary};} @media(max-height:36rem){min-block-size:14rem;}}`;
const EditorHeader = styled.div`display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-bottom:.55rem;label{font-weight:900;}`;
const SaveStatus = styled.span`color:${theme.colors.textMuted};font-size:.74rem;font-weight:800;`;
const Counter = styled.div`display:flex;flex-wrap:wrap;gap:.35rem 1rem;margin-top:.65rem;strong{color:${theme.colors.primaryPressed};}span{color:${theme.colors.textMuted};}`;
const Guidance = styled.p`margin:.35rem 0 0;color:${theme.colors.textMuted};font-size:.75rem;line-height:1.4;`;
