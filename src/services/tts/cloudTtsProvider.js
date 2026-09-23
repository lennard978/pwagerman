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
      return response.blob();
    })
    .catch(() => false);
};
