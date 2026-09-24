import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  FaBookReader,
  FaCheck,
  FaHeadphones,
  FaLayerGroup,
  FaClipboardCheck,
} from "react-icons/fa";
import { EXAM_PREP_DISCLAIMER, ExamPrepAreas } from "../../data/examPrep";
import { useProgress } from "../../i18n/ProgressProvider";
import { theme } from "../../styles/theme";

const icons = {
  reading: FaBookReader,
  listening: FaHeadphones,
  "vocabulary-grammar": FaLayerGroup,
  "mock-a1": FaClipboardCheck,
};

export const ExamPrep = () => {
  const progress = useProgress()?.progress;
  const progressLabel = (id) => {
    if (id === "reading") {
      return `${progress?.completedExamReadingTasks.length || 0} / 4 tasks complete`;
    }
    if (id === "listening") {
      return `${progress?.completedExamListeningTasks.length || 0} / 4 tasks complete`;
    }
    if (id === "vocabulary-grammar") {
      const sessions = progress?.completedExamPrepSessions.filter(
        ({ area }) => area === "vocabulary-grammar"
      ).length || 0;
      return `${sessions} sessions complete`;
    }
    if (id === "mock-a1") {
      return `${progress?.completedMockExams.length || 0} mocks complete`;
    }
    return "";
  };

  return (
    <Wrapper>
      <Header>
        <Eyebrow>CEFR A1 skills practice</Eyebrow>
        <h1>Exam Prep</h1>
        <p>Build confidence with short, original practice tasks based on this course.</p>
        <Disclaimer>{EXAM_PREP_DISCLAIMER}</Disclaimer>
      </Header>
      <Grid>
        {ExamPrepAreas.map((area) => {
          const Icon = icons[area.id];
          const content = (
            <>
              <Icon aria-hidden="true" />
              <strong>{area.title}</strong>
              <span>{area.description}</span>
              <Progress>
                {area.status === "available" && <FaCheck aria-hidden="true" />}
                {progressLabel(area.id)}
              </Progress>
            </>
          );
          return area.status === "available" ? (
            <SkillCard key={area.id} to={`/exam-prep/${area.id}`}>
              {content}
            </SkillCard>
          ) : (
            <LockedCard key={area.id} aria-disabled="true">
              {content}
            </LockedCard>
          );
        })}
      </Grid>
      <BackLink to="/practice">Back to Practice</BackLink>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  inline-size: min(100%, 48rem);
  min-block-size: 100vh;
  padding: 1rem 1rem 7rem;
`;

const Header = styled.header`
  margin-bottom: 1rem;

  & h1 {
    margin: 0;
    color: ${theme.colors.navy};
    font-size: clamp(1.8rem, 7vw, 2.4rem);
  }

  & > p {
    margin: 0.4rem 0 0;
    color: ${theme.colors.textMuted};
    line-height: 1.5;
  }
`;

const Eyebrow = styled.p`
  color: ${theme.colors.primaryPressed} !important;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Disclaimer = styled.p`
  padding: 0.65rem 0.75rem;
  background: ${theme.colors.primarySoft};
  border-radius: ${theme.radius.small};
  font-size: 0.78rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;

  @media (max-width: 22rem) {
    grid-template-columns: 1fr;
  }
`;

const BaseCard = styled.div`
  min-inline-size: 0;
  min-block-size: 10rem;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  padding: 1rem;
  border-radius: ${theme.radius.medium};

  & > svg {
    color: ${theme.colors.primary};
    font-size: 1.4rem;
  }

  & strong {
    color: ${theme.colors.navy};
  }

  & > span {
    color: ${theme.colors.textMuted};
    font-size: 0.8rem;
    line-height: 1.4;
  }
`;

const SkillCard = styled(BaseCard).attrs({ as: Link })`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  box-shadow: ${theme.shadow.soft};
  text-decoration: none;

  &:focus-visible {
    outline: 3px solid ${theme.colors.primarySoft};
    outline-offset: 2px;
  }
`;

const LockedCard = styled(BaseCard)`
  background: ${theme.colors.surfaceMuted};
  border: 1px solid ${theme.colors.border};

  & > svg {
    color: ${theme.colors.textMuted};
  }
`;

const Progress = styled.small`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  margin-top: auto;
  color: ${theme.colors.primaryPressed};
  font-weight: 700;
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
