import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaHeadphones, FaVolumeUp } from "react-icons/fa";
import { CompactSoundButton } from "../../components/CompactSoundButton";
import {
  createMockA1,
  MOCK_A1_DISCLAIMER,
  scoreMockA1,
} from "../../data/mockA1";
import { useProgress } from "../../i18n/ProgressProvider";
import { theme } from "../../styles/theme";

const totalBeforeSection = (mock, sectionIndex) =>
  mock.sections
    .slice(0, sectionIndex)
    .reduce((total, section) => total + section.questions.length, 0);

export const MockA1 = () => {
  const progressContext = useProgress();
  const initialSeed = progressContext?.progress.completedMockExams.length || 0;
  const [mock, setMock] = useState(() => createMockA1(initialSeed));
  const [started, setStarted] = useState(false);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [result, setResult] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const section = mock.sections[sectionIndex];
  const question = section.questions[questionIndex];
  const overallNumber = totalBeforeSection(mock, sectionIndex) + questionIndex + 1;
  const totalQuestions = mock.sections.reduce(
    (total, item) => total + item.questions.length,
    0
  );

  const resetAttempt = (nextMock = mock) => {
    setMock(nextMock);
    setStarted(true);
    setSectionIndex(0);
    setQuestionIndex(0);
    setAnswers({});
    setShowConfirmation(false);
    setResult(null);
    setShowReview(false);
  };

  const previous = () => {
    setShowConfirmation(false);
    if (questionIndex > 0) {
      setQuestionIndex((index) => index - 1);
      return;
    }
    if (sectionIndex > 0) {
      const previousSectionIndex = sectionIndex - 1;
      setSectionIndex(previousSectionIndex);
      setQuestionIndex(mock.sections[previousSectionIndex].questions.length - 1);
    }
  };

  const next = () => {
    if (questionIndex < section.questions.length - 1) {
      setQuestionIndex((index) => index + 1);
      return;
    }
    if (sectionIndex < mock.sections.length - 1) {
      setSectionIndex((index) => index + 1);
      setQuestionIndex(0);
      return;
    }
    setShowConfirmation(true);
  };

  const submit = () => {
    const nextResult = scoreMockA1(mock, answers);
    setResult(nextResult);
    setShowConfirmation(false);
    progressContext?.recordMockCompletion({
      mockId: mock.id,
      seed: mock.seed,
      score: nextResult.score,
      total: nextResult.total,
      sectionScores: nextResult.sections,
      route: "/exam-prep/mock-a1",
    });
  };

  const startNew = () => resetAttempt(createMockA1(mock.seed + 1));

  if (!started) {
    return (
      <Wrapper>
        <IntroCard>
          <Eyebrow>Exam Prep · original practice</Eyebrow>
          <h1>Mock A1</h1>
          <p>
            Complete Reading, Listening, Vocabulary, and Grammar in one calm
            40-question practice exam.
          </p>
          <Disclaimer>{MOCK_A1_DISCLAIMER}</Disclaimer>
          <SectionPreview>
            {mock.sections.map((item) => (
              <li key={item.id}>
                <strong>{item.title}</strong>
                <span>{item.questions.length} questions</span>
              </li>
            ))}
          </SectionPreview>
          <Notes>
            <li>Answers are kept when you move backward or between sections.</li>
            <li>Listening audio can be replayed; transcripts appear after submission.</li>
            <li>No official pass or fail threshold is used.</li>
          </Notes>
          <PrimaryButton type="button" onClick={() => setStarted(true)}>
            Start Mock A1
          </PrimaryButton>
          <BackLink to="/exam-prep">Back to Exam Prep</BackLink>
        </IntroCard>
      </Wrapper>
    );
  }

  if (result) {
    return (
      <Wrapper>
        <ResultCard>
          <Eyebrow>Mock A1 complete</Eyebrow>
          <h1>Practice score</h1>
          <TotalScore>{result.score} / {result.total}</TotalScore>
          <SectionScores>
            {result.sections.map((item) => (
              <li key={item.id}>
                <span>{item.title}</span>
                <strong>{item.score} / {item.total}</strong>
              </li>
            ))}
          </SectionScores>
          <ResultActions>
            <SecondaryButton type="button" onClick={() => setShowReview((value) => !value)}>
              {showReview ? "Hide answer review" : "Review answers"}
            </SecondaryButton>
            <PrimaryButton type="button" onClick={() => resetAttempt()}>
              Retry same mock
            </PrimaryButton>
            <SecondaryButton type="button" onClick={startNew}>
              Start new mock
            </SecondaryButton>
            <BackLink to="/exam-prep">Back to Exam Prep</BackLink>
          </ResultActions>
          {showReview && (
            <AnswerReview aria-label="Mock answer review">
              {mock.sections.map((item) => (
                <ReviewSection key={item.id}>
                  <h2>{item.title}</h2>
                  {item.id === "listening" && (
                    <TranscriptList>
                      {[...new Map(item.questions.map((entry) => [
                        entry.transcript,
                        entry,
                      ])).values()].map((entry) => (
                        <article key={entry.transcript}>
                          <strong>{entry.audioTitle}</strong>
                          <p lang="sr">{entry.transcript}</p>
                          <small>{entry.translation}</small>
                        </article>
                      ))}
                    </TranscriptList>
                  )}
                  {item.questions.map((entry, index) => {
                    const correct = answers[entry.id] === entry.answer;
                    return (
                      <ReviewItem key={entry.id} $correct={correct}>
                        <strong>{index + 1}. {entry.prompt}</strong>
                        <p>Your answer: {answers[entry.id]}</p>
                        <p>Correct answer: {entry.answer}</p>
                        <small>{entry.explanation}</small>
                      </ReviewItem>
                    );
                  })}
                </ReviewSection>
              ))}
            </AnswerReview>
          )}
        </ResultCard>
      </Wrapper>
    );
  }

  if (showConfirmation) {
    return (
      <Wrapper>
        <ConfirmCard role="dialog" aria-labelledby="mock-submit-title">
          <Eyebrow>Final submission</Eyebrow>
          <h1 id="mock-submit-title">Submit Mock A1?</h1>
          <p>
            You answered all {totalQuestions} questions. Submit to see your
            practice score and answer review.
          </p>
          <ConfirmActions>
            <SecondaryButton type="button" onClick={() => setShowConfirmation(false)}>
              Keep reviewing
            </SecondaryButton>
            <PrimaryButton type="button" onClick={submit}>Submit mock</PrimaryButton>
          </ConfirmActions>
        </ConfirmCard>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <ExamHeader>
        <Eyebrow>Mock A1 · {section.title}</Eyebrow>
        <ProgressLine>
          <span>Section {sectionIndex + 1} of {mock.sections.length}</span>
          <span>Question {overallNumber} of {totalQuestions}</span>
        </ProgressLine>
        <ProgressTrack aria-hidden="true">
          <ProgressFill $value={(overallNumber / totalQuestions) * 100} />
        </ProgressTrack>
      </ExamHeader>

      {section.id === "reading" && (
        <StimulusCard>
          <strong>{question.stimulusTitle}</strong>
          <p lang="sr">{question.stimulusText}</p>
        </StimulusCard>
      )}

      {section.id === "listening" && (
        <ListeningCard>
          <CompactSoundButton
            text={question.transcript}
            lang="sr-RS"
            ariaLabel={`Play mock listening: ${question.audioTitle}`}
          >
            <FaVolumeUp aria-hidden="true" />
          </CompactSoundButton>
          <div>
            <strong><FaHeadphones aria-hidden="true" /> {question.audioTitle}</strong>
            <span>Replay allowed. Transcript available after submission.</span>
          </div>
        </ListeningCard>
      )}

      <QuestionCard>
        <QuestionNumber>{section.title} {questionIndex + 1} / {section.questions.length}</QuestionNumber>
        <h1>{question.prompt}</h1>
        <Options>
          {question.options.map((option) => (
            <Option
              key={option}
              type="button"
              $selected={answers[question.id] === option}
              aria-pressed={answers[question.id] === option}
              onClick={() => setAnswers((current) => ({
                ...current,
                [question.id]: option,
              }))}
            >
              {option}
            </Option>
          ))}
        </Options>
      </QuestionCard>

      <Navigation>
        <SecondaryButton
          type="button"
          disabled={sectionIndex === 0 && questionIndex === 0}
          onClick={previous}
        >
          Previous
        </SecondaryButton>
        <PrimaryButton
          type="button"
          disabled={!answers[question.id]}
          onClick={next}
        >
          {sectionIndex === mock.sections.length - 1 &&
          questionIndex === section.questions.length - 1
            ? "Review submission"
            : questionIndex === section.questions.length - 1
              ? `Continue to ${mock.sections[sectionIndex + 1].title}`
              : "Next"}
        </PrimaryButton>
      </Navigation>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  inline-size: min(100%, 46rem);
  min-block-size: 100vh;
  display: grid;
  align-content: start;
  gap: 0.85rem;
  padding: 1rem 1rem 7rem;
`;

const BasePanel = styled.section`
  min-inline-size: 0;
  padding: 1rem;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.large};
  box-shadow: ${theme.shadow.soft};
`;

const IntroCard = styled(BasePanel)`
  display: grid;
  gap: 0.9rem;

  & h1,
  & p {
    margin: 0;
  }

  & h1 {
    color: ${theme.colors.navy};
  }

  & p {
    color: ${theme.colors.textMuted};
    line-height: 1.5;
  }
`;

const Eyebrow = styled.p`
  margin: 0;
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

const SectionPreview = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.55rem;
  margin: 0;
  padding: 0;
  list-style: none;

  & li {
    min-inline-size: 0;
    display: grid;
    gap: 0.15rem;
    padding: 0.7rem;
    background: ${theme.colors.surfaceMuted};
    border-radius: ${theme.radius.small};
  }

  & strong {
    color: ${theme.colors.navy};
  }

  & span {
    color: ${theme.colors.textMuted};
    font-size: 0.78rem;
  }
`;

const Notes = styled.ul`
  margin: 0;
  padding-left: 1.2rem;
  color: ${theme.colors.textMuted};
  font-size: 0.84rem;
  line-height: 1.5;
`;

const ExamHeader = styled.header`
  display: grid;
  gap: 0.45rem;
`;

const ProgressLine = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  color: ${theme.colors.textMuted};
  font-size: 0.8rem;
  font-weight: 700;
`;

const ProgressTrack = styled.div`
  block-size: 0.4rem;
  overflow: hidden;
  background: ${theme.colors.surfaceMuted};
  border-radius: ${theme.radius.pill};
`;

const ProgressFill = styled.div`
  inline-size: ${(props) => props.$value}%;
  block-size: 100%;
  background: ${theme.colors.primary};
  border-radius: inherit;
  transition: inline-size 180ms ease;
`;

const StimulusCard = styled(BasePanel)`
  background: ${theme.colors.primarySoft};
  border-color: #fed7aa;

  & strong {
    color: ${theme.colors.primaryPressed};
  }

  & p {
    margin: 0.55rem 0 0;
    color: ${theme.colors.navy};
    line-height: 1.65;
  }
`;

const ListeningCard = styled(BasePanel)`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: ${theme.colors.primarySoft};
  border-color: #fed7aa;

  & div {
    min-inline-size: 0;
    display: grid;
    gap: 0.2rem;
  }

  & strong {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    color: ${theme.colors.navy};
  }

  & span {
    color: ${theme.colors.textMuted};
    font-size: 0.78rem;
  }
`;

const QuestionCard = styled(BasePanel)`
  display: grid;
  gap: 0.85rem;

  & h1 {
    margin: 0;
    color: ${theme.colors.navy};
    font-size: clamp(1.15rem, 5vw, 1.45rem);
    line-height: 1.35;
  }
`;

const QuestionNumber = styled.p`
  margin: 0;
  color: ${theme.colors.primaryPressed};
  font-size: 0.78rem;
  font-weight: 800;
`;

const Options = styled.div`
  display: grid;
  gap: 0.55rem;
`;

const Option = styled.button`
  min-inline-size: 0;
  min-block-size: 3rem;
  padding: 0.7rem 0.8rem;
  color: ${theme.colors.text};
  background: ${(props) =>
    props.$selected ? theme.colors.primarySoft : theme.colors.surface};
  border: 1px solid ${(props) =>
    props.$selected ? theme.colors.primary : theme.colors.border};
  border-radius: ${theme.radius.small};
  text-align: left;
  overflow-wrap: anywhere;
  font-weight: 700;
`;

const Navigation = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
`;

const BaseButton = styled.button`
  min-block-size: 2.85rem;
  padding: 0.65rem 1rem;
  border-radius: ${theme.radius.small};
  font-weight: 800;

  &:disabled {
    opacity: 0.45;
  }
`;

const PrimaryButton = styled(BaseButton)`
  color: white;
  background: ${theme.colors.primary};
  border: 1px solid ${theme.colors.primary};
`;

const SecondaryButton = styled(BaseButton)`
  color: ${theme.colors.text};
  background: ${theme.colors.surfaceMuted};
  border: 1px solid ${theme.colors.border};
`;

const BackLink = styled(Link)`
  min-block-size: 2.85rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding-inline: 1rem;
  color: ${theme.colors.text};
  background: ${theme.colors.surfaceMuted};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.small};
  text-decoration: none;
  font-weight: 700;
`;

const ConfirmCard = styled(BasePanel)`
  display: grid;
  gap: 0.9rem;
  margin-top: clamp(1rem, 10vh, 5rem);

  & h1,
  & p {
    margin: 0;
  }

  & h1 {
    color: ${theme.colors.navy};
  }

  & p {
    color: ${theme.colors.textMuted};
    line-height: 1.5;
  }
`;

const ConfirmActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
`;

const ResultCard = styled(BasePanel)`
  display: grid;
  gap: 0.9rem;

  & > h1 {
    margin: 0;
    color: ${theme.colors.navy};
  }
`;

const TotalScore = styled.p`
  margin: 0;
  color: ${theme.colors.primary};
  font-size: 1.8rem;
  font-weight: 800;
`;

const SectionScores = styled.ul`
  display: grid;
  gap: 0.45rem;
  margin: 0;
  padding: 0;
  list-style: none;

  & li {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.65rem 0.75rem;
    background: ${theme.colors.surfaceMuted};
    border-radius: ${theme.radius.small};
  }
`;

const ResultActions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.6rem;

  @media (max-width: 23rem) {
    grid-template-columns: 1fr;
  }
`;

const AnswerReview = styled.div`
  display: grid;
  gap: 1rem;
`;

const ReviewSection = styled.section`
  display: grid;
  gap: 0.6rem;

  & h2 {
    margin: 0.4rem 0 0;
    color: ${theme.colors.navy};
    font-size: 1.2rem;
  }
`;

const ReviewItem = styled.article`
  min-inline-size: 0;
  padding: 0.75rem;
  color: ${theme.colors.text};
  background: ${(props) =>
    props.$correct ? theme.colors.successSoft : theme.colors.errorSoft};
  border: 1px solid ${(props) =>
    props.$correct ? theme.colors.success : theme.colors.error};
  border-radius: ${theme.radius.small};
  overflow-wrap: anywhere;

  & p {
    margin: 0.3rem 0 0;
  }

  & small {
    display: block;
    margin-top: 0.4rem;
    color: ${theme.colors.textMuted};
    line-height: 1.45;
  }
`;

const TranscriptList = styled.div`
  display: grid;
  gap: 0.55rem;

  & article {
    padding: 0.75rem;
    background: ${theme.colors.primarySoft};
    border-radius: ${theme.radius.small};
  }

  & p {
    margin: 0.35rem 0;
    color: ${theme.colors.navy};
    line-height: 1.5;
  }

  & small {
    color: ${theme.colors.textMuted};
    line-height: 1.4;
  }
`;
