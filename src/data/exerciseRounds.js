export const EXERCISE_ROUND_LIMITS = {
  pair: 10,
  write: 10,
  cards: 12,
  quiz: 10,
  test: 6,
};

export const createBoundedRound = (
  items,
  limit,
  random = Math.random
) => {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled.slice(0, Math.min(limit, shuffled.length));
};
