import { useState } from "react";
import styled from "styled-components";
import { createExamPrepSession } from "../../data/examPrep";
import { useProgress } from "../../i18n/ProgressProvider";
import { theme } from "../../styles/theme";
import { ExamPrepSession } from "./ExamPrepSession";

export const ExamPrepReview = () => {
  const progress = useProgress()?.progress;
  const [session] = useState(() => {
    const seed = progress?.completedExamPrepSessions.filter(
      ({ area }) => area === "vocabulary-grammar"
    ).length || 0;
    return { seed, questions: createExamPrepSession({ seed }) };
  });

  return (
    <Wrapper>
      <Header>
        <p>Exam Prep</p>
        <h1>Vocabulary & Grammar</h1>
        <span>
          10 vocabulary questions and 10 grammar questions from the current course.
        </span>
      </Header>
      <ExamPrepSession
        area="vocabulary-grammar"
        taskId={`mixed-${session.seed + 1}`}
        title="Vocabulary & Grammar"
        route="/exam-prep/vocabulary-grammar"
        questions={session.questions}
        introduction={(
          <SessionNote>
            Session {session.seed + 1} · {session.questions.length} questions · one clear answer each
          </SessionNote>
        )}
      />
    </Wrapper>
  );
};

const Wrapper = styled.main`
  inline-size: min(100%, 44rem);
  min-block-size: 100vh;
  display: grid;
  align-content: start;
  gap: 0.85rem;
  padding: 1rem 1rem 7rem;
`;

const Header = styled.header`
  & p {
    margin: 0 0 0.25rem;
    color: ${theme.colors.primaryPressed};
    font-size: 0.75rem;
    font-weight: 800;
    text-transform: uppercase;
  }

  & h1 {
    margin: 0;
    color: ${theme.colors.navy};
    font-size: clamp(1.55rem, 7vw, 2.1rem);
  }

  & span {
    display: block;
    margin-top: 0.4rem;
    color: ${theme.colors.textMuted};
    line-height: 1.5;
  }
`;

const SessionNote = styled.p`
  margin: 0;
  padding: 0.7rem 0.8rem;
  color: ${theme.colors.primaryPressed};
  background: ${theme.colors.primarySoft};
  border-radius: ${theme.radius.small};
  font-size: 0.82rem;
  font-weight: 700;
`;
