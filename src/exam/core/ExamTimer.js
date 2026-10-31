import { useEffect, useRef, useState } from "react";
import { getReadingRemainingSeconds } from "./examState";

const systemNow = () => new Date();

export const formatExamTime = (seconds) => {
  const safe = Math.max(0, seconds || 0);
  return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
};

export const ExamTimer = ({ session, onExpire, now = systemNow }) => {
  const [remaining, setRemaining] = useState(() => getReadingRemainingSeconds(session, now()));
  const expiredRef = useRef(false);
  useEffect(() => {
    if (!session.deadlineAt || session.status !== "active") return undefined;
    const update = () => {
      const next = getReadingRemainingSeconds(session, now());
      setRemaining(next);
      if (next <= 0 && !expiredRef.current) { expiredRef.current = true; onExpire(); }
    };
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, [session, onExpire, now]);
  if (remaining === null) return null;
  return <span aria-label={`Reading time remaining ${formatExamTime(remaining)}`}>{formatExamTime(remaining)}</span>;
};
