export const speakWithBrowser = ({ text, lang, voices = [], speak }) => {
  const normalizedLanguage = lang.toLowerCase();
  const voice = voices
    .filter((candidate) => candidate.lang && candidate.lang.toLowerCase().startsWith(normalizedLanguage.split("-")[0]))
    .sort((first, second) => Number(second.lang.toLowerCase() === normalizedLanguage) - Number(first.lang.toLowerCase() === normalizedLanguage))[0];
  speak({ rate: 0.92, pitch: 1, volume: 1, voice, text });
};
