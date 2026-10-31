import { GOETHE_B1_READING_CONFIG, READING_PART_CONFIG } from "./goetheB1";
import { EXAM_RESULT_DESCRIPTORS, getExamResultDescriptor } from "./results";

describe("Goethe B1 Reading configuration", () => {
  test("defines the exact five-part, 30-item, 65-minute architecture", () => {
    expect(GOETHE_B1_READING_CONFIG.durationSeconds).toBe(65 * 60);
    expect(READING_PART_CONFIG.map(({ itemCount }) => itemCount)).toEqual([6, 6, 7, 7, 4]);
    expect(READING_PART_CONFIG.map(({ recommendedSeconds }) => recommendedSeconds / 60)).toEqual([10, 20, 10, 15, 10]);
    expect(READING_PART_CONFIG.reduce((sum, part) => sum + part.itemCount, 0)).toBe(30);
  });

  test("keeps the pass descriptors in one shared result model", () => {
    expect(EXAM_RESULT_DESCRIPTORS).toHaveLength(5);
    expect(getExamResultDescriptor(90).label).toBe("Very good");
    expect(getExamResultDescriptor(80).label).toBe("Good");
    expect(getExamResultDescriptor(70).label).toBe("Satisfactory");
    expect(getExamResultDescriptor(60).label).toBe("Sufficient");
    expect(getExamResultDescriptor(59).label).toBe("Not passed");
  });
});
