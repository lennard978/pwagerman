import { GOETHE_B1_LISTENING_CONFIG, LISTENING_PART_CONFIG } from "./goetheB1Listening";

describe("Goethe B1 Listening configuration", () => {
  test("models the four-part, 30-item, approximately 40-minute module", () => {
    expect(GOETHE_B1_LISTENING_CONFIG).toMatchObject({
      module: "listening",
      durationSeconds: 2400,
      totalItems: 30,
      totalParts: 4,
      passResultScore: 60,
    });
    expect(LISTENING_PART_CONFIG.map(({ recordingCount, itemCount, playbackLimit, preparationSeconds }) => ({ recordingCount, itemCount, playbackLimit, preparationSeconds }))).toEqual([
      { recordingCount: 5, itemCount: 10, playbackLimit: 2, preparationSeconds: 10 },
      { recordingCount: 1, itemCount: 5, playbackLimit: 1, preparationSeconds: 60 },
      { recordingCount: 1, itemCount: 7, playbackLimit: 1, preparationSeconds: 60 },
      { recordingCount: 1, itemCount: 8, playbackLimit: 2, preparationSeconds: 60 },
    ]);
  });
});
