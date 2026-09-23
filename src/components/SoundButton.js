import React from "react";
import { useSpeechSynthesis } from "react-speech-kit";
import styled from "styled-components";
import { speak as speakWithProvider } from "../services/tts/ttsProvider";

export const selectBestVoice = (voices = [], language) => {
  const normalizedLanguage = language && language.toLowerCase();
  if (!normalizedLanguage) return undefined;

  const matchingVoices = voices.filter((voice) => {
    const voiceLanguage = voice.lang && voice.lang.toLowerCase();
    return voiceLanguage && voiceLanguage.startsWith(normalizedLanguage);
  });

  return [...matchingVoices].sort((first, second) => {
    const score = (voice) => {
      const voiceLanguage = voice.lang.toLowerCase();
      const exactLocale = voiceLanguage === "sr-rs" ? 100 : 0;
      const localVoice = voice.localService ? 20 : 0;
      const qualityName = /natural|enhanced|premium|google|microsoft|apple/i.test(
        voice.name || ""
      )
        ? 10
        : 0;
      return exactLocale + localVoice + qualityName;
    };

    return score(second) - score(first) ||
      (first.name || "").localeCompare(second.name || "");
  })[0];
};

export default function SoundButton({ children, text, lang, className, ariaLabel }) {
  const { speak, voices } = useSpeechSynthesis();
  return (
    <Button
      type="button"
      className={className}
      aria-label={ariaLabel || text}
      onClick={(event) => {
        event.stopPropagation();
        speakWithProvider({
          text,
          lang,
          voices,
          browserSpeak: speak,
        });
      }}
    >
      {children}
    </Button>
  );
}

const Button = styled.button`
  display: block;
  inline-size: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  text-align: inherit;
  cursor: pointer;
  &:focus-visible {
    outline: 3px solid #fff1e8;
    outline-offset: 3px;
    border-radius: 16px;
  }
`;
