import {
  GOETHE_B1_SPEAKING_CONFIG,
  SPEAKING_PARTS,
  SPEAKING_RUBRIC,
  SPEAKING_SCALE,
  SPEAKING_SKILL_TAGS,
} from "./goetheB1Speaking";
import { speakingForms, speakingPart1Bank, speakingTopicPairs, speakingTopics } from "../data/speakingForms";
import { validateSpeakingContent } from "../speaking/validation";

describe("Goethe B1 Speaking original content model", () => {
  test("models the verified preparation and pair/individual duration structure", () => {
    expect(GOETHE_B1_SPEAKING_CONFIG).toEqual(expect.objectContaining({
      preparationSeconds: 900,
      pairDurationSeconds: 900,
      individualDurationSeconds: 600,
      parts: 3,
    }));
    expect(SPEAKING_PARTS.map((part) => part.recommendedSeconds)).toEqual([180, 240, 120]);
  });

  test("contains three complete forms with one planning task and two linked topics", () => {
    expect(speakingForms).toHaveLength(3);
    expect(new Set(speakingForms.map(({ id }) => id)).size).toBe(3);
    speakingForms.forEach((form) => {
      expect(form.parts).toHaveLength(3);
      expect(form.parts[0].points.length).toBeGreaterThanOrEqual(4);
      expect(form.parts[1].topicChoices).toHaveLength(2);
      form.parts[1].topicChoices.forEach((topic) => {
        expect(form.parts[2].followUpByTopic[topic.id]).toEqual(topic.followUpQuestions);
      });
    });
  });

  test("meets the original bank minimums and validates unique IDs and tags", () => {
    const result = validateSpeakingContent(speakingForms, speakingPart1Bank, speakingTopics);
    expect(speakingPart1Bank).toHaveLength(6);
    expect(speakingTopicPairs).toHaveLength(6);
    expect(speakingTopics).toHaveLength(12);
    expect(result).toEqual(expect.objectContaining({ valid: true, followUpCount: 48 }));
    expect(result.errors).toEqual([]);
  });

  test("uses a transparent manual-only rubric with app-level analytics tags", () => {
    expect(SPEAKING_RUBRIC.map(({ id }) => id)).toEqual([
      "taskFulfilment", "interaction", "fluency", "vocabulary", "grammar", "pronunciation",
    ]);
    expect(SPEAKING_SCALE.map(({ value }) => value)).toEqual([3, 2, 1, 0]);
    expect(SPEAKING_SKILL_TAGS).toEqual(expect.arrayContaining(["negotiation", "follow-up", "pronunciation"]));
  });
});
