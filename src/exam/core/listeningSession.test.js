import { listeningForms } from "../data/listeningForms";
import {
  advanceListeningPart,
  beginListeningPreparation,
  canStartListeningAudio,
  createListeningSession,
  failListeningPlaybackStart,
  finishListeningPlayback,
  interruptListeningPlayback,
  isListeningPartPlaybackComplete,
  markListeningAudioReady,
  markListeningPlaybackStarted,
  selectListeningAnswer,
  shouldExpireListeningSession,
  submitListeningSession,
  updateListeningPlaybackTime,
} from "./listeningSession";

const form = listeningForms[0];
const consumePlay = (session, audio, now = new Date("2026-10-31T10:00:00.000Z")) =>
  finishListeningPlayback(markListeningPlaybackStarted(session, audio, now), audio, now);

describe("Listening playback state machine", () => {
  test.each([[1, 2], [2, 1], [3, 1], [4, 2]])("Part %i enforces exactly %i official play(s)", (partNumber, limit) => {
    const audio = form.parts[partNumber - 1].audio[0];
    let session = createListeningSession({ form, partNumber });
    for (let count = 0; count < limit; count += 1) {
      expect(canStartListeningAudio(session, audio)).toBe(true);
      session = consumePlay(session, audio);
    }
    expect(session.playbackState[audio.id].playCount).toBe(limit);
    expect(canStartListeningAudio(session, audio)).toBe(false);
    expect(markListeningPlaybackStarted(session, audio)).toBe(session);
  });

  test("failed starts do not consume a play", () => {
    const audio = form.parts[0].audio[0];
    let session = createListeningSession({ form });
    session = beginListeningPreparation(session, { ...audio, preparationSeconds: 10 });
    session = markListeningAudioReady(session, audio.id);
    session = failListeningPlaybackStart(session, audio.id, "autoplay-or-load-error");
    expect(session.playbackState[audio.id]).toMatchObject({ playCount: 0, inProgress: false, lastError: "autoplay-or-load-error" });
  });

  test("an interruption persists position and resume does not consume another play", () => {
    const audio = form.parts[0].audio[0];
    let session = markListeningPlaybackStarted(createListeningSession({ form }), audio);
    session = updateListeningPlaybackTime(session, audio.id, 12.5);
    session = interruptListeningPlayback(session, audio.id, 13);
    expect(session.playbackState[audio.id]).toMatchObject({ playCount: 1, inProgress: true, currentTime: 13, status: "ready" });
    session = markListeningPlaybackStarted(JSON.parse(JSON.stringify(session)), audio);
    expect(session.playbackState[audio.id].playCount).toBe(1);
    session = finishListeningPlayback(session, audio);
    expect(session.playbackState[audio.id]).toMatchObject({ playCount: 1, inProgress: false, status: "pause-between" });
  });

  test("a new attempt starts with fresh playback allowance", () => {
    const audio = form.parts[0].audio[0];
    const exhausted = consumePlay(consumePlay(createListeningSession({ form }), audio), audio);
    const fresh = createListeningSession({ form, now: new Date("2026-10-31T11:00:00.000Z") });
    expect(exhausted.playbackState[audio.id].playCount).toBe(2);
    expect(fresh.playbackState[audio.id].playCount).toBe(0);
  });
});

describe("Listening session progression", () => {
  test("answers remain editable during playback", () => {
    const audio = form.parts[0].audio[0];
    const item = form.parts[0].items[0];
    const playing = markListeningPlaybackStarted(createListeningSession({ form }), audio);
    const answered = selectListeningAnswer(playing, form, item.id, item.correctAnswer);
    expect(answered.answers[item.id]).toBe(item.correctAnswer);
    expect(answered.playbackState[audio.id].status).toBe("playing");
  });

  test("prevents advancing until every recording in the current part is complete", () => {
    let session = createListeningSession({ form });
    expect(advanceListeningPart(session, form)).toBe(session);
    form.parts[0].audio.forEach((audio) => { session = consumePlay(consumePlay(session, audio), audio); });
    expect(isListeningPartPlaybackComplete(session, form, 1)).toBe(true);
    const advanced = advanceListeningPart(session, form);
    expect(advanced).toMatchObject({ currentPart: 2, unlockedPart: 2 });
  });

  test("uses an absolute deadline and automatically scores submission", () => {
    const now = new Date("2026-10-31T10:00:00.000Z");
    const session = createListeningSession({ form, now, durationSeconds: 1 });
    expect(shouldExpireListeningSession(session, new Date("2026-10-31T10:00:00.999Z"))).toBe(false);
    expect(shouldExpireListeningSession(session, new Date("2026-10-31T10:00:01.000Z"))).toBe(true);
    expect(submitListeningSession(session, form, new Date("2026-10-31T10:00:01.000Z"))).toMatchObject({ status: "submitted", score: { rawScore: 0, total: 30, resultScore: 0 } });
  });
});
