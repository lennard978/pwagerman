export const speakWithBrowser = ({ text, lang, voices = [], speak }) => {
  const voice = voices
    .filter((candidate) => candidate.lang && candidate.lang.toLowerCase().startsWith(lang.toLowerCase()))
    .sort((first, second) => Number(second.lang.toLowerCase() === "sr-rs") - Number(first.lang.toLowerCase() === "sr-rs"))[0];
  speak({ rate: 0.92, pitch: 1, volume: 1, voice, text });
};
