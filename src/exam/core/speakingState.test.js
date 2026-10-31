import { speakingForms } from "../data/speakingForms";
import {
  addSpeakingRecording,
  advanceSpeaking,
  beginSpeaking,
  chooseSpeakingTopic,
  completeSpeakingAssessment,
  createSpeakingSession,
  getPreparationRemaining,
  nextPartnerTurn,
  setSpeakingAssessment,
  submitSpeaking,
  updateSpeakingNote,
} from "./speakingState";

const form = speakingForms[0];

describe("Speaking session state", () => {
  test("starts a simulation with an absolute 15-minute preparation deadline", () => {
    const session = createSpeakingSession({ form, now: "2026-10-31T10:00:00Z" });
    expect(session).toEqual(expect.objectContaining({
      module: "speaking",
      mode: "solo-simulation",
      status: "preparation",
      preparationDeadlineAt: "2026-10-31T10:15:00.000Z",
    }));
    expect(getPreparationRemaining(session, "2026-10-31T10:14:59Z")).toBe(1);
    expect(getPreparationRemaining(session, "2026-10-31T10:20:00Z")).toBe(0);
  });

  test("persists independent planning, presentation, participant B, and question notes", () => {
    let session = createSpeakingSession({ form, mode: "pair-simulation" });
    session = updateSpeakingNote(session, "part1", "Sonntag und Bus");
    session = updateSpeakingNote(session, "part2", "Eigene Erfahrung", 2);
    session = updateSpeakingNote(session, "part2B", "Anderes Beispiel", 4);
    session = updateSpeakingNote(session, "part3", "Warum ist das wichtig?");
    expect(session.notes).toEqual(expect.objectContaining({
      part1: "Sonntag und Bus",
      part2: expect.objectContaining({ 2: "Eigene Erfahrung" }),
      part2B: expect.objectContaining({ 4: "Anderes Beispiel" }),
      part3: "Warum ist das wichtig?",
    }));
  });

  test("runs the complete solo flow without hard timing stops", () => {
    let session = createSpeakingSession({ form, now: "2026-10-31T10:00:00Z" });
    session = chooseSpeakingTopic(session, form.parts[1].topicChoices[0].id);
    session = beginSpeaking(session, "2026-10-31T10:15:00Z");
    session = advanceSpeaking(session, "2026-10-31T10:18:00Z");
    expect(session.currentPart).toBe(2);
    session = advanceSpeaking(session, "2026-10-31T10:22:30Z");
    expect(session.currentPart).toBe(3);
    session = advanceSpeaking(session, "2026-10-31T10:25:00Z");
    expect(session.status).toBe("submitted");
  });

  test("runs the pair order A presentation, B feedback, B presentation, A feedback", () => {
    let session = beginSpeaking(createSpeakingSession({ form, mode: "pair-simulation" }));
    const order = [];
    for (let index = 0; index < 4; index += 1) {
      session = advanceSpeaking(session);
      order.push([session.currentPart, session.participantTurn]);
    }
    expect(order).toEqual([[2, "A"], [3, "B"], [2, "B"], [3, "A"]]);
    expect(advanceSpeaking(session).status).toBe("submitted");
  });

  test("bounds deterministic partner turns and stores local recording metadata only", () => {
    let session = beginSpeaking(createSpeakingSession({ form }));
    for (let index = 0; index < 10; index += 1) session = nextPartnerTurn(session, 4);
    session = addSpeakingRecording(session, { recordingId: "local-1", part: 1, sizeBytes: 100 });
    expect(session.partnerTurn).toBe(3);
    expect(session.recordingIds).toEqual(["local-1"]);
    expect(session).not.toHaveProperty("uploadUrl");
  });

  test("accepts only the six manual 0-3 assessments and never creates pass/fail", () => {
    let session = submitSpeaking(beginSpeaking(createSpeakingSession({ form })));
    ["taskFulfilment", "interaction", "fluency", "vocabulary", "grammar", "pronunciation"].forEach((key, index) => {
      session = setSpeakingAssessment(session, key, index % 4);
    });
    session = completeSpeakingAssessment(session, "2026-10-31T10:30:00Z");
    expect(session.assessmentCompletedAt).toBe("2026-10-31T10:30:00.000Z");
    expect(session).not.toHaveProperty("passed");
    expect(setSpeakingAssessment(session, "grammar", 5)).toBe(session);
  });
});
