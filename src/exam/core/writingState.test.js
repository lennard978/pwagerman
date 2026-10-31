import { writingForms } from "../data/writingForms";
import {
  abandonWritingSession,
  completeWritingAssessment,
  createWritingRevision,
  createWritingSession,
  getWritingAutomatedChecks,
  getWritingRemainingSeconds,
  navigateWritingTask,
  setWritingAssessment,
  submitWritingSession,
  toggleWritingChecklist,
  updateWritingDraft,
  updateWritingRevision,
} from "./writingState";

const form = writingForms[0];

describe("Writing session state", () => {
  test("starts a 60-minute simulation with absolute deadline and empty drafts", () => {
    const session = createWritingSession({ form, now: "2026-10-31T10:00:00Z" });
    expect(session).toEqual(expect.objectContaining({ module: "writing", mode: "simulation", status: "active", deadlineAt: "2026-10-31T11:00:00.000Z", currentTask: 1 }));
    expect(Object.keys(session.drafts)).toHaveLength(3);
    expect(getWritingRemainingSeconds(session, "2026-10-31T10:00:00Z")).toBe(3600);
    expect(getWritingRemainingSeconds(session, "2026-10-31T10:59:59Z")).toBe(1);
  });

  test("practice has no mandatory deadline", () => {
    const session = createWritingSession({ form, mode: "practice", taskNumber: 2 });
    expect(session.deadlineAt).toBeNull();
    expect(session.currentTask).toBe(2);
  });

  test("typing, paste, checklist, and task navigation update state without mutating the prior value", () => {
    const original = createWritingSession({ form });
    const taskId = form.tasks[0].id;
    const typed = updateWritingDraft(original, taskId, "Hallo Mara!\n\nDie neue Wohnung ist sehr schön.", "2026-10-31T10:01:00Z");
    const checked = toggleWritingChecklist(typed, taskId, 0, true, "2026-10-31T10:01:01Z");
    const moved = navigateWritingTask(checked, 2);
    expect(original.drafts[taskId].text).toBe("");
    expect(typed.drafts[taskId]).toEqual(expect.objectContaining({ wordCount: 8, paragraphCount: 2, lastSavedAt: "2026-10-31T10:01:00.000Z" }));
    expect(checked.drafts[taskId].checklistState[0]).toBe(true);
    expect(moved.currentTask).toBe(2);
  });

  test("expiry-style submission snapshots immutable text before later revisions", () => {
    const taskId = form.tasks[0].id;
    const active = updateWritingDraft(createWritingSession({ form }), taskId, "Mein ursprünglicher Text.");
    const submitted = submitWritingSession(active, "2026-10-31T11:00:00Z");
    const revised = updateWritingRevision(createWritingRevision(submitted, taskId, "2026-10-31T11:01:00Z"), `${submitted.sessionId}:${taskId}:revision-1`, "Ein neuer Übungstext.", "2026-10-31T11:02:00Z");
    expect(submitted.status).toBe("submitted");
    expect(revised.submittedDrafts[taskId].text).toBe("Mein ursprünglicher Text.");
    expect(revised.revisionCopies[0]).toEqual(expect.objectContaining({ text: "Ein neuer Übungstext.", wordCount: 3 }));
  });

  test("self-assessment accepts only the transparent 0-3 rubric and completes after all dimensions", () => {
    let session = submitWritingSession(createWritingSession({ form }));
    ["taskFulfilment", "coherence", "vocabulary", "grammar"].forEach((dimension, index) => { session = setWritingAssessment(session, dimension, 3 - index); });
    session = completeWritingAssessment(session, "2026-10-31T11:05:00Z");
    expect(session.selfAssessment).toEqual({ taskFulfilment: 3, coherence: 2, vocabulary: 1, grammar: 0 });
    expect(session.assessmentCompletedAt).toBe("2026-10-31T11:05:00.000Z");
    expect(setWritingAssessment(session, "grammar", 7)).toBe(session);
  });

  test("abandoning stops the active state but preserves drafts", () => {
    const taskId = form.tasks[0].id;
    const active = updateWritingDraft(createWritingSession({ form }), taskId, "Dieser Entwurf bleibt erhalten.");
    const abandoned = abandonWritingSession(active, "2026-10-31T10:30:00Z");
    expect(abandoned.status).toBe("abandoned");
    expect(abandoned.drafts[taskId].text).toBe("Dieser Entwurf bleibt erhalten.");
  });

  test("deterministic checks are explicitly limited and do not grade grammar", () => {
    const task = form.tasks[0];
    const session = toggleWritingChecklist(updateWritingDraft(createWritingSession({ form }), task.id, "Hallo Mara!\n\nVielen Dank für deine Nachricht. Die Wohnung ist schön und ich lade dich am Samstag ein.\n\nLiebe Grüße\nSam"), task.id, 0, true);
    const checks = getWritingAutomatedChecks(task, session.drafts[task.id]);
    expect(checks).toEqual(expect.objectContaining({ hasText: true, hasParagraphs: true, greetingPresent: true, closingPresent: true }));
    expect(checks).not.toHaveProperty("grammarScore");
  });
});
