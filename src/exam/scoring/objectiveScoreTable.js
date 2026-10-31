export const OBJECTIVE_30_SCORE_TABLE = Object.freeze({
  0: 0, 1: 3, 2: 7, 3: 10, 4: 13, 5: 17, 6: 20, 7: 23,
  8: 27, 9: 30, 10: 33, 11: 37, 12: 40, 13: 43, 14: 47,
  15: 50, 16: 53, 17: 57, 18: 60, 19: 63, 20: 67, 21: 70,
  22: 73, 23: 77, 24: 80, 25: 83, 26: 87, 27: 90, 28: 93,
  29: 97, 30: 100,
});

export const getObjective30ResultScore = (rawScore) =>
  OBJECTIVE_30_SCORE_TABLE[Math.max(0, Math.min(30, rawScore))];

export const hasPassedObjective30Module = (rawScore) => getObjective30ResultScore(rawScore) >= 60;
