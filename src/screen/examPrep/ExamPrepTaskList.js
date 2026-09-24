import { Link, Navigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { FaCheckCircle } from "react-icons/fa";
import { ListeningTasks, ReadingTasks } from "../../data/examPrep";
import { useProgress } from "../../i18n/ProgressProvider";
import { theme } from "../../styles/theme";

export const ExamPrepTaskList = () => {
  const { area } = useParams();
  const progress = useProgress()?.progress;
  if (!["reading", "listening"].includes(area)) {
    return <Navigate to="/exam-prep" replace />;
  }
  const tasks = area === "reading" ? ReadingTasks : ListeningTasks;
  const completed = area === "reading"
    ? progress?.completedExamReadingTasks || []
    : progress?.completedExamListeningTasks || [];
  const title = area === "reading" ? "Reading" : "Listening";

  return (
    <Wrapper>
      <Header>
        <p>Exam Prep</p>
        <h1>{title}</h1>
        <span>
          Complete each short task at your own pace. Every question has one clear answer.
        </span>
      </Header>
      <TaskList>
        {tasks.map((task, index) => (
          <TaskLink key={task.id} to={`/exam-prep/${area}/${task.id}`}>
            <Number>{index + 1}</Number>
            <Copy>
              <strong>{task.title}</strong>
              <span>{task.questions.length} questions</span>
            </Copy>
            {completed.includes(task.id) && (
              <FaCheckCircle aria-label="Completed" />
            )}
          </TaskLink>
        ))}
      </TaskList>
      <BackLink to="/exam-prep">Back to Exam Prep</BackLink>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  inline-size: min(100%, 44rem);
  min-block-size: 100vh;
  padding: 1rem 1rem 7rem;
`;

const Header = styled.header`
  margin-bottom: 1rem;

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
  }

  & span {
    display: block;
    margin-top: 0.4rem;
    color: ${theme.colors.textMuted};
    line-height: 1.5;
  }
`;

const TaskList = styled.div`
  display: grid;
  gap: 0.65rem;
`;

const TaskLink = styled(Link)`
  min-inline-size: 0;
  min-block-size: 4.75rem;
  display: grid;
  grid-template-columns: 2.5rem minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.75rem;
  padding: 0.8rem 1rem;
  color: ${theme.colors.text};
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.medium};
  box-shadow: ${theme.shadow.soft};
  text-decoration: none;

  & > svg {
    color: ${theme.colors.success};
  }
`;

const Number = styled.span`
  inline-size: 2.25rem;
  block-size: 2.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.primaryPressed};
  background: ${theme.colors.primarySoft};
  border-radius: ${theme.radius.small};
  font-weight: 800;
`;

const Copy = styled.span`
  min-inline-size: 0;
  display: grid;
  gap: 0.15rem;

  & strong {
    overflow-wrap: anywhere;
  }

  & span {
    color: ${theme.colors.textMuted};
    font-size: 0.78rem;
  }
`;

const BackLink = styled(Link)`
  min-block-size: 2.75rem;
  display: inline-flex;
  align-items: center;
  margin-top: 1rem;
  padding-inline: 1rem;
  color: ${theme.colors.text};
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.small};
  text-decoration: none;
  font-weight: 700;
`;
