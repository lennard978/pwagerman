export const getObjectiveRemainingSeconds = (session, now = new Date()) => {
  if (!session?.deadlineAt) return null;
  return Math.max(0, Math.ceil((new Date(session.deadlineAt).getTime() - now.getTime()) / 1000));
};
