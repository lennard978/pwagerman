import { Link } from "react-router-dom";
import styled from "styled-components";
import { theme } from "../../styles/theme";

export const ExamPrepResult = ({
  answers,
  onRetry,
  backTo = "/exam-prep",
  children,
}) => {
  const score = answers.filter(({ correct }) => correct).length;
  const percentage = answers.length
    ? Math.round((score / answers.length) * 100)
    : 0;

  return (
    <ResultCard>
      <h2>Practice complete</h2>
      <Score>{score} / {answers.length}</Score>
      <Percentage>{percentage}% practice score</Percentage>
      <Summary>
        <span>{score} correct</span>
        <span>{answers.length - score} incorrect</span>
      </Summary>
      <Review aria-label="Answer review">
        {answers.map((answer, index) => (
          <ReviewItem
            key={answer.id}
            $correct={answer.correct}
            data-status={answer.correct ? "correct" : "incorrect"}
          >
            <strong>{index + 1}. {answer.prompt}</strong>
            <p>Your answer: {answer.selected}</p>
            <p>Correct answer: {answer.answer}</p>
            <small>{answer.explanation}</small>
          </ReviewItem>
        ))}
      </Review>
      {children}
      <Actions>
        <PrimaryButton type="button" onClick={onRetry}>Retry</PrimaryButton>
        <BackLink to={backTo}>Back to Exam Prep</BackLink>
      </Actions>
    </ResultCard>
  );
};

const ResultCard = styled.section`
  display: grid;
  gap: 0.85rem;
  padding: 1.1rem;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.large};
  box-shadow: ${theme.shadow.soft};

  & h2 {
    margin: 0;
    color: ${theme.colors.navy};
  }
`;

const Score = styled.p`
  margin: 0;
  color: ${theme.colors.primary};
  font-size: 1.6rem;
  font-weight: 800;
`;

const Percentage = styled.p`
  margin: -0.6rem 0 0;
  color: ${theme.colors.textMuted};
`;

const Summary = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

  & span {
    padding: 0.35rem 0.65rem;
    color: ${theme.colors.text};
    background: ${theme.colors.surfaceMuted};
    border-radius: ${theme.radius.pill};
    font-size: 0.82rem;
    font-weight: 700;
  }
`;

const Review = styled.div`
  display: grid;
  gap: 0.65rem;
`;

const ReviewItem = styled.article`
  min-inline-size: 0;
  padding: 0.8rem;
  color: ${theme.colors.text};
  background: ${(props) =>
    props.$correct ? theme.colors.successSoft : theme.colors.errorSoft};
  border: 1px solid ${(props) =>
    props.$correct ? theme.colors.success : theme.colors.error};
  border-radius: ${theme.radius.small};
  overflow-wrap: anywhere;

  & p {
    margin: 0.35rem 0 0;
  }

  & small {
    display: block;
    margin-top: 0.45rem;
    color: ${theme.colors.textMuted};
    line-height: 1.45;
  }
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
`;

const PrimaryButton = styled.button`
  min-block-size: 2.75rem;
  padding-inline: 1rem;
  color: white;
  background: ${theme.colors.primary};
  border: 1px solid ${theme.colors.primary};
  border-radius: ${theme.radius.small};
  font-weight: 800;
`;

const BackLink = styled(Link)`
  min-block-size: 2.75rem;
  display: inline-flex;
  align-items: center;
  padding-inline: 1rem;
  color: ${theme.colors.text};
  background: ${theme.colors.surfaceMuted};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.small};
  text-decoration: none;
  font-weight: 700;
`;
