export const fetchCloudAudio = ({ text, lang }) => {
  const endpoint = process.env.REACT_APP_TTS_ENDPOINT;
  if (!endpoint) return false;

  return fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, lang }),
    })
    .then(async (response) => {
      if (!response.ok) return false;
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("audio/")) return false;
      const objectUrl = URL.createObjectURL(await response.blob());
      const audio = new Audio(objectUrl);
      audio.addEventListener("ended", () => URL.revokeObjectURL(objectUrl), { once: true });
      return audio;
    })
    .catch(() => false);
};

export const speakWithCloud = ({ text, lang }) =>
  fetchCloudAudio({ text, lang }).then(async (audio) => {
    if (!audio) return false;
    await audio.play();
    return true;
  });
