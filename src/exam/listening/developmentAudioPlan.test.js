import { listeningForms } from "../data/listeningForms";
import { createDevelopmentAudioPlan } from "./developmentAudioPlan";

describe("provider-neutral Listening audio production plan", () => {
  const discussion = listeningForms[0].parts[3].audio[0];

  test("blocks generation when configured German voices are absent", () => {
    const plan = createDevelopmentAudioPlan(discussion, {});
    expect(plan.ready).toBe(false);
    expect(plan.mode).toBe("stable-asset-build");
    expect(plan.blockers.filter(({ reason }) => reason === "voice-not-configured")).toHaveLength(3);
    expect(plan.segments.every(({ configuredVoice }) => configuredVoice === null)).toBe(true);
  });

  test("requires distinct configured voices for a multi-speaker discussion", () => {
    const environment = {
      LISTENING_VOICE_FEMALE_1: "de-DE-Voice-One",
      LISTENING_VOICE_FEMALE_2: "de-DE-Voice-One",
      LISTENING_VOICE_MALE_1: "de-DE-Voice-One",
    };
    expect(createDevelopmentAudioPlan(discussion, environment).blockers).toContainEqual({ reason: "distinct-voices-required" });
  });

  test("produces a segment-level plan when every profile has a distinct voice", () => {
    const environment = {
      LISTENING_VOICE_FEMALE_1: "de-DE-Voice-One",
      LISTENING_VOICE_FEMALE_2: "de-DE-Voice-Two",
      LISTENING_VOICE_MALE_1: "de-DE-Voice-Three",
    };
    const plan = createDevelopmentAudioPlan(discussion, environment);
    expect(plan.ready).toBe(true);
    expect(plan.blockers).toEqual([]);
    expect(plan.segments.every(({ configuredVoice, locale }) => configuredVoice && locale === "de-DE")).toBe(true);
    expect(plan.outputPath).toMatch(/audio-v1\/.*\.mp3$/);
  });
});
