import React from "react";
import { useSpeechSynthesis } from "react-speech-kit";
export default function SoundButton({ children, german, className }) {
  const { speak, voices } = useSpeechSynthesis();
  const voice = voices.find(({ lang }) => lang.startsWith("de"));
  return (
    <div onClick={() => speak({ rate: 0.6, pitch: 0, voice, text: german })}>
      {children}
    </div>
  );
}
