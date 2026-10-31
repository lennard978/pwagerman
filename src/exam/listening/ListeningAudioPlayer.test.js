import React from "react";
import { act, fireEvent, render } from "@testing-library/react";
import { createListeningSession } from "../core/listeningSession";
import { listeningForms } from "../data/listeningForms";
import { ListeningAudioPlayer } from "./ListeningAudioPlayer";

const playingSession = () => {
  const form = listeningForms[0];
  const audio = form.parts[0].audio[0];
  const session = createListeningSession({ form, mode: "practice", partNumber: 1 });
  session.playbackState[audio.id] = {
    ...session.playbackState[audio.id],
    status: "playing",
    playCount: 1,
    inProgress: true,
  };
  return { audio, session };
};

test("captures media time before React releases the pause event", () => {
  const { audio, session } = playingSession();
  const updateSession = jest.fn();
  const view = render(
    <ListeningAudioPlayer
      audio={audio}
      preparationSeconds={10}
      session={session}
      updateSession={updateSession}
    />
  );
  updateSession.mockClear();
  const element = view.container.querySelector("audio");
  Object.defineProperty(element, "currentTime", { configurable: true, value: 12.5 });
  Object.defineProperty(element, "ended", { configurable: true, value: false });

  fireEvent.pause(element);

  const deferredUpdater = updateSession.mock.calls[0][0];
  const updated = deferredUpdater(session);
  expect(updated.playbackState[audio.id]).toMatchObject({
    status: "ready",
    inProgress: true,
    currentTime: 12.5,
  });
});

test("captures media time before React releases the timeupdate event", () => {
  const { audio, session } = playingSession();
  const updateSession = jest.fn();
  const view = render(
    <ListeningAudioPlayer
      audio={audio}
      preparationSeconds={10}
      session={session}
      updateSession={updateSession}
    />
  );
  updateSession.mockClear();
  const element = view.container.querySelector("audio");
  Object.defineProperty(element, "currentTime", { configurable: true, value: 7.25 });

  fireEvent.timeUpdate(element);

  const deferredUpdater = updateSession.mock.calls[0][0];
  const updated = deferredUpdater(session);
  expect(updated.playbackState[audio.id].currentTime).toBe(7.25);
});

test("turns a persisted playing state into a resumable interruption on mount", () => {
  const { audio, session } = playingSession();
  session.playbackState[audio.id].currentTime = 9.5;
  const updateSession = jest.fn();

  render(
    <ListeningAudioPlayer
      audio={audio}
      preparationSeconds={10}
      session={session}
      updateSession={updateSession}
    />
  );

  expect(updateSession).toHaveBeenCalledTimes(1);
  let updated;
  act(() => { updated = updateSession.mock.calls[0][0](session); });
  expect(updated.playbackState[audio.id]).toMatchObject({
    status: "ready",
    inProgress: true,
    currentTime: 9.5,
  });
});
