import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { FaVolumeUp } from "react-icons/fa";
import { CompactSoundButton } from "../../components/CompactSoundButton";
import { ListeningTasks, ReadingTasks } from "../../data/examPrep";
import { theme } from "../../styles/theme";
import { ExamPrepSession } from "./ExamPrepSession";

export const ExamPrepTask = () => {
  const { area, taskId } = useParams();
  const tasks = area === "reading"
    ? ReadingTasks
    : area === "listening"
      ? ListeningTasks
      : [];
  const task = tasks.find(({ id }) => id === taskId);

  if (!task) {
    return (
      <Wrapper>
        <h1>Task not found</h1>
        <BackLink to="/exam-prep">Back to Exam Prep</BackLink>
      </Wrapper>
    );
  }

  const introduction = area === "reading" ? (
    <ReadingText>
      <span>Read the text, then answer the questions.</span>
      <p>{task.text}</p>
    </ReadingText>
  ) : (
    <ListeningPanel>
      <CompactSoundButton
        text={task.transcript}
        lang="sr-RS"
        ariaLabel={`Play listening task: ${task.title}`}
      >
        <FaVolumeUp aria-hidden="true" />
      </CompactSoundButton>
      <div>
        <strong>Play audio</strong>
        <span>You can replay the recording. The transcript appears after completion.</span>
      </div>
    </ListeningPanel>
  );

  const resultContent = area === "listening" ? (
    <Transcript>
      <h3>Transcript</h3>
      <p lang="sr">{task.transcript}</p>
      <small>{task.translation}</small>
    </Transcript>
  ) : null;

  return (
    <Wrapper>
      <Header>
        <p>{area === "reading" ? "Reading" : "Listening"} practice</p>
        <h1>{task.title}</h1>
      </Header>
      <ExamPrepSession
        area={area}
        taskId={task.id}
        title={task.title}
        route={`/exam-prep/${area}/${task.id}`}
        questions={task.questions}
        introduction={introduction}
        resultContent={resultContent}
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
`;

const ReadingText = styled.section`
  padding: 1rem;
  background: ${theme.colors.primarySoft};
  border: 1px solid #fed7aa;
  border-radius: ${theme.radius.medium};

  & span {
    color: ${theme.colors.primaryPressed};
    font-size: 0.78rem;
    font-weight: 800;
  }

  & p {
    margin: 0.6rem 0 0;
    color: ${theme.colors.navy};
    line-height: 1.65;
  }
`;

const ListeningPanel = styled.section`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem;
  background: ${theme.colors.primarySoft};
  border: 1px solid #fed7aa;
  border-radius: ${theme.radius.medium};

  & div {
    min-inline-size: 0;
    display: grid;
    gap: 0.2rem;
  }

  & strong {
    color: ${theme.colors.navy};
  }

  & span {
    color: ${theme.colors.textMuted};
    font-size: 0.78rem;
    line-height: 1.4;
  }
`;

const Transcript = styled.section`
  inline-size: 100%;
  padding: 0.9rem;
  color: ${theme.colors.text};
  background: ${theme.colors.surfaceMuted};
  border-radius: ${theme.radius.small};

  & h3,
  & p {
    margin: 0 0 0.45rem;
  }

  & small {
    color: ${theme.colors.textMuted};
    line-height: 1.45;
  }
`;

const BackLink = styled(Link)`
  color: ${theme.colors.primaryPressed};
  font-weight: 700;
`;
