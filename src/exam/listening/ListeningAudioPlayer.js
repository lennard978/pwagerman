import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { theme } from "../../styles/theme";
import {
  beginListeningPreparation,
  failListeningPlaybackStart,
  finishListeningPlayback,
  interruptListeningPlayback,
  markListeningAudioReady,
  markListeningPlaybackStarted,
  updateListeningPlaybackTime,
} from "../core/listeningSession";
import { formatExamTime } from "../core/ExamTimer";
import { getListeningAudioManifestEntry, resolveListeningAudioUrl } from "./audioManifest";

const secondsUntil = (iso) => iso ? Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 1000)) : 0;

export const ListeningAudioPlayer = ({ audio, preparationSeconds, session, updateSession }) => {
  const audioElement = useRef(null);
  const lastSavedSecond = useRef(0);
  const state = session.playbackState[audio.id];
  const [preparationRemaining, setPreparationRemaining] = useState(() => secondsUntil(state.preparationEndsAt));
  const entry = getListeningAudioManifestEntry(audio.id);
  const remainingPlays = Math.max(0, audio.playbackLimit - state.playCount);

  useEffect(() => {
    if (state.status !== "pre-reading" || !state.preparationEndsAt) return undefined;
    const update = () => {
      const remaining = secondsUntil(state.preparationEndsAt);
      setPreparationRemaining(remaining);
      if (remaining <= 0) updateSession((current) => markListeningAudioReady(current, audio.id));
    };
    update();
    const timer = window.setInterval(update, 250);
    return () => window.clearInterval(timer);
  }, [audio.id, state.preparationEndsAt, state.status, updateSession]);

  const prepare = () => {
    if (state.status === "pause-between" || state.inProgress) updateSession((current) => markListeningAudioReady(current, audio.id));
    else updateSession((current) => beginListeningPreparation(current, { ...audio, preparationSeconds }));
  };

  const play = async () => {
    const element = audioElement.current;
    if (!element || !entry) return;
    if (!element.src) element.src = resolveListeningAudioUrl(entry);
    if (state.inProgress && state.currentTime > 0) element.currentTime = state.currentTime;
    try { await element.play(); } catch (error) { updateSession((current) => failListeningPlaybackStart(current, audio.id, "autoplay-or-load-error")); }
  };

  return (
    <Player aria-label={`${audio.title} exam audio`}>
      <TopLine><div><small>Exam audio</small><strong>{audio.title}</strong></div><PlayCount>{state.playCount}/{audio.playbackLimit} official plays used</PlayCount></TopLine>
      <Rule>You will hear this recording {audio.playbackLimit === 2 ? "twice" : "once"}. Read the questions before playing.</Rule>
      {state.status === "pre-reading" ? (
        <Preparation role="status"><span>Question preparation</span><strong>{formatExamTime(preparationRemaining)}</strong></Preparation>
      ) : (
        <Controls>
          {(state.status === "idle" || state.status === "pause-between") && remainingPlays > 0 && <Primary type="button" onClick={prepare}>{state.status === "pause-between" ? "Prepare second play" : `Start ${preparationSeconds}-second preparation`}</Primary>}
          {state.status === "ready" && <Primary type="button" onClick={play}>{state.inProgress ? "Resume interrupted play" : `Play recording · ${remainingPlays} remaining`}</Primary>}
          {state.status === "playing" && <Now role="status">Playing now · answer while you listen</Now>}
          {state.status === "finished" && <Complete>Official playback complete</Complete>}
        </Controls>
      )}
      <Progress aria-label={`Playback position ${Math.round(state.currentTime)} of ${audio.durationSeconds} seconds`}><i style={{ inlineSize: `${Math.min(100, (state.currentTime / audio.durationSeconds) * 100)}%` }} /></Progress>
      {state.lastError && <ErrorText role="alert">Playback was interrupted. Retry or resume without receiving an extra official play.</ErrorText>}
      <audio
        ref={audioElement}
        preload="metadata"
        onPlaying={() => updateSession((current) => markListeningPlaybackStarted(current, audio))}
        onTimeUpdate={(event) => {
          const second = Math.floor(event.currentTarget.currentTime);
          if (second - lastSavedSecond.current >= 5) {
            lastSavedSecond.current = second;
            updateSession((current) => updateListeningPlaybackTime(current, audio.id, event.currentTarget.currentTime));
          }
        }}
        onPause={(event) => {
          if (!event.currentTarget.ended && state.status === "playing") updateSession((current) => interruptListeningPlayback(current, audio.id, event.currentTarget.currentTime));
        }}
        onEnded={() => updateSession((current) => finishListeningPlayback(current, audio))}
        onError={() => updateSession((current) => failListeningPlaybackStart(current, audio.id, "decode-error"))}
      />
    </Player>
  );
};

const Player = styled.section`padding: 1rem; border: 2px solid ${theme.colors.navy}; border-radius: ${theme.radius.medium}; background: ${theme.colors.surface}; box-shadow: ${theme.shadow.soft};`;
const TopLine = styled.div`display: flex; align-items: start; justify-content: space-between; gap: .8rem; small, strong { display: block; } small { color: ${theme.colors.primaryPressed}; font-size: .7rem; font-weight: 900; text-transform: uppercase; } @media (max-width: 30rem) { flex-direction: column; }`;
const PlayCount = styled.span`padding: .35rem .55rem; border-radius: ${theme.radius.pill}; background: ${theme.colors.surfaceMuted}; font-size: .72rem; font-weight: 800;`;
const Rule = styled.p`margin: .55rem 0; color: ${theme.colors.textMuted}; font-size: .82rem; line-height: 1.45;`;
const Controls = styled.div`display: flex; align-items: center; min-block-size: 3rem;`;
const Primary = styled.button`min-block-size: 3rem; padding: .65rem 1rem; border: 0; border-radius: ${theme.radius.small}; background: ${theme.colors.primary}; color: white; font: inherit; font-weight: 900; cursor: pointer;`;
const Preparation = styled.div`display: flex; align-items: center; justify-content: space-between; min-block-size: 3rem; padding: .55rem .7rem; border-radius: ${theme.radius.small}; background: ${theme.colors.primarySoft}; span { font-weight: 800; } strong { font-size: 1.2rem; font-variant-numeric: tabular-nums; }`;
const Now = styled.strong`color: ${theme.colors.primaryPressed};`;
const Complete = styled.strong`color: ${theme.colors.success};`;
const Progress = styled.div`block-size: .45rem; margin-top: .65rem; overflow: hidden; border-radius: ${theme.radius.pill}; background: ${theme.colors.surfaceMuted}; i { display: block; block-size: 100%; background: ${theme.colors.primary}; transition: inline-size .2s linear; }`;
const ErrorText = styled.p`margin: .55rem 0 0; color: ${theme.colors.error}; font-size: .8rem;`;
