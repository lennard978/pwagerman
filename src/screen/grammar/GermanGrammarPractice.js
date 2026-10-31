import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { FaCheck, FaRedo, FaTimes } from "react-icons/fa";
import {
  getGermanGrammarLesson,
  getGrammarCorrectAnswer,
  gradeGrammarExercise,
} from "../../data/grammar/index";
import { useProgress } from "../../i18n/ProgressProvider";
import { theme } from "../../styles/theme";

const isChoice = (type) => ["multiple-choice", "connector-choice", "case-article-choice"].includes(type);
const isText = (type) => ["fill-blank", "transformation", "error-correction"].includes(type);

const responseReady = (exercise, response) => {
  if (isChoice(exercise.type) || isText(exercise.type)) return String(response || "").trim().length > 0;
  if (exercise.type === "sentence-ordering") return Array.isArray(response) && response.length === exercise.tokens.length;
  if (exercise.type === "matching") return response && Object.keys(response).length === exercise.pairs.length;
  return false;
};

const ResponseControl = ({ exercise, response, setResponse, locked }) => {
  if (isChoice(exercise.type)) {
    return (
      <Options role="group" aria-label="Answer choices">
        {exercise.options.map((option) => (
          <Option key={option.id} type="button" disabled={locked} $selected={response === option.id} onClick={() => setResponse(option.id)}>{option.label}</Option>
        ))}
      </Options>
    );
  }
  if (isText(exercise.type)) {
    return <AnswerInput aria-label="Your answer" disabled={locked} value={response || ""} onChange={(event) => setResponse(event.target.value)} autoComplete="off" />;
  }
  if (exercise.type === "sentence-ordering") {
    const selected = Array.isArray(response) ? response : [];
    const tokenById = new Map(exercise.tokens.map((token) => [token.id, token]));
    return (
      <Ordering>
        <OrderedAnswer aria-label="Ordered answer">{selected.length ? selected.map((id) => <button key={id} type="button" disabled={locked} onClick={() => setResponse(selected.filter((item) => item !== id))}>{tokenById.get(id)?.label}</button>) : <span>Tap the words in the correct order.</span>}</OrderedAnswer>
        <Tokens>{exercise.tokens.filter(({ id }) => !selected.includes(id)).map((token) => <Option key={token.id} type="button" disabled={locked} onClick={() => setResponse([...selected, token.id])}>{token.label}</Option>)}</Tokens>
      </Ordering>
    );
  }
  if (exercise.type === "matching") {
    return (
      <MatchGrid>
        {exercise.pairs.map((pair) => (
          <label key={pair.id}><strong>{pair.label}</strong><select disabled={locked} value={response?.[pair.id] || ""} onChange={(event) => setResponse({ ...(response || {}), [pair.id]: event.target.value })}><option value="">Choose meaning</option>{exercise.choices.map((choice) => <option key={choice.id} value={choice.id}>{choice.label}</option>)}</select></label>
        ))}
      </MatchGrid>
    );
  }
  return null;
};

const PracticeQuestion = ({ exercise, number, total, onGrade, onNext }) => {
  const [response, setResponse] = useState(exercise.type === "sentence-ordering" ? [] : exercise.type === "matching" ? {} : "");
  const [result, setResult] = useState(null);
  const check = () => {
    const correct = gradeGrammarExercise(exercise, response);
    setResult(correct);
    onGrade(response, correct);
  };
  return (
    <QuestionCard>
      <ProgressText>Question {number} of {total} · {exercise.type.replaceAll("-", " ")}</ProgressText>
      <Question>{exercise.prompt}</Question>
      <ResponseControl exercise={exercise} response={response} setResponse={setResponse} locked={result !== null} />
      {result === null ? (
        <PrimaryButton type="button" disabled={!responseReady(exercise, response)} onClick={check}>Check answer</PrimaryButton>
      ) : (
        <>
          <Feedback role="status" $correct={result}>
            {result ? <FaCheck aria-hidden="true" /> : <FaTimes aria-hidden="true" />}
            <div><strong>{result ? "Correct" : "Review this answer"}</strong>{!result && <span>Correct answer: {getGrammarCorrectAnswer(exercise)}</span>}<p>{exercise.explanation}</p></div>
          </Feedback>
          <PrimaryButton type="button" onClick={onNext}>{number === total ? "See results" : "Next question"}</PrimaryButton>
        </>
      )}
    </QuestionCard>
  );
};

export const GermanGrammarPractice = () => {
  const { grammarLessonId } = useParams();
  const progressContext = useProgress();
  const lesson = getGermanGrammarLesson(grammarLessonId);
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [finished, setFinished] = useState(false);
  const [completed, setCompleted] = useState(false);

  if (!lesson) return <Wrapper><h1>Grammar lesson not found</h1><Link to="/learn/grammar">Back to Grammar</Link></Wrapper>;
  const score = history.filter(({ correct }) => correct).length;
  const grade = (response, correct) => {
    const exercise = lesson.practice[index];
    setHistory((current) => [...current, { exercise, response, correct }]);
    progressContext.recordGrammarAnswer({ lessonId: lesson.id, exercise, learnerAnswer: response, correct });
  };
  const next = () => index === lesson.practice.length - 1 ? setFinished(true) : setIndex((current) => current + 1);
  const retry = () => { setIndex(0); setHistory([]); setFinished(false); setCompleted(false); };
  const complete = () => {
    progressContext.recordGrammarCompletion({
      lessonId: lesson.id,
      route: `/learn/grammar/${lesson.id}`,
      title: lesson.title,
      score,
      total: lesson.practice.length,
    });
    setCompleted(true);
  };

  if (finished) {
    return (
      <Wrapper>
        <Header><Eyebrow>Lesson practice results</Eyebrow><h1>{lesson.title}</h1><Score>{score} / {lesson.practice.length}</Score><p>This is lesson-practice feedback, not Goethe exam scoring.</p></Header>
        <ReviewList aria-label="Answer review">
          {history.map(({ exercise, response, correct }, answerIndex) => (
            <ReviewItem key={exercise.id} $correct={correct}>
              <span>{correct ? <FaCheck aria-label="Correct" /> : <FaTimes aria-label="Incorrect" />}</span>
              <div><strong>{answerIndex + 1}. {exercise.prompt}</strong>{!correct && <p>Correct answer: {getGrammarCorrectAnswer(exercise)}</p>}<small>{exercise.explanation}</small></div>
            </ReviewItem>
          ))}
        </ReviewList>
        <ResultActions>
          <SecondaryButton type="button" onClick={retry}><FaRedo aria-hidden="true" /> Retry lesson</SecondaryButton>
          <PrimaryButton type="button" disabled={completed} onClick={complete}><FaCheck aria-hidden="true" /> {completed ? "Lesson completed" : "Complete lesson"}</PrimaryButton>
        </ResultActions>
        <BackLink to={`/learn/grammar/${lesson.id}`}>Review rules and examples</BackLink>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Header><Eyebrow>{lesson.stage === "foundation-review" ? "Foundation Review" : "B1 Core"}</Eyebrow><h1>{lesson.title}</h1><p>Work through all {lesson.practice.length} questions. Explanations appear after each answer.</p></Header>
      <PracticeQuestion key={lesson.practice[index].id} exercise={lesson.practice[index]} number={index + 1} total={lesson.practice.length} onGrade={grade} onNext={next} />
      <BackLink to={`/learn/grammar/${lesson.id}`}>Back to lesson</BackLink>
    </Wrapper>
  );
};

const Wrapper = styled.main`inline-size: min(100%, 48rem); min-block-size: 100vh; padding: 1rem 1rem 7rem;`;
const Header = styled.header`margin-bottom: 1rem; & h1 { margin: 0; color: ${theme.colors.navy}; font-size: clamp(1.65rem, 7vw, 2.35rem); overflow-wrap: anywhere; } & p { margin: 0.45rem 0 0; color: ${theme.colors.textMuted}; line-height: 1.5; }`;
const Eyebrow = styled.p`margin: 0 0 0.25rem !important; color: ${theme.colors.primaryPressed} !important; font-size: 0.75rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.08em;`;
const Score = styled.strong`display: block; margin-top: 0.7rem; color: ${theme.colors.primaryPressed}; font-size: 2rem;`;
const QuestionCard = styled.section`min-inline-size: 0; padding: 1rem; background: ${theme.colors.surface}; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.large}; box-shadow: ${theme.shadow.soft};`;
const ProgressText = styled.p`margin: 0; color: ${theme.colors.primaryPressed}; font-size: 0.75rem; font-weight: 900; text-transform: capitalize;`;
const Question = styled.h2`margin: 0.55rem 0 1rem; color: ${theme.colors.text}; font-size: 1.1rem; line-height: 1.45; overflow-wrap: anywhere;`;
const Options = styled.div`display: grid; gap: 0.55rem; margin-bottom: 0.8rem;`;
const Option = styled.button`min-block-size: 2.75rem; padding: 0.65rem 0.8rem; color: ${theme.colors.text}; background: ${(props) => props.$selected ? theme.colors.primarySoft : theme.colors.surface}; border: 2px solid ${(props) => props.$selected ? theme.colors.primary : theme.colors.border}; border-radius: ${theme.radius.small}; text-align: left; font-weight: 700; overflow-wrap: anywhere; &:focus-visible { outline: 3px solid ${theme.colors.primarySoft}; outline-offset: 2px; }`;
const AnswerInput = styled.input`inline-size: 100%; min-block-size: 2.75rem; margin-bottom: 0.8rem; padding: 0.65rem 0.75rem; color: ${theme.colors.text}; background: white; border: 2px solid ${theme.colors.border}; border-radius: ${theme.radius.small}; font: inherit; &:focus { border-color: ${theme.colors.primary}; outline: 3px solid ${theme.colors.primarySoft}; }`;
const Ordering = styled.div`display: grid; gap: 0.65rem; margin-bottom: 0.8rem;`;
const OrderedAnswer = styled.div`min-block-size: 3.25rem; display: flex; flex-wrap: wrap; align-items: center; gap: 0.35rem; padding: 0.5rem; background: ${theme.colors.surfaceMuted}; border: 1px dashed ${theme.colors.primary}; border-radius: ${theme.radius.small}; & span { color: ${theme.colors.textMuted}; font-size: 0.82rem; } & button { min-block-size: 2.25rem; padding: 0.35rem 0.55rem; color: ${theme.colors.primaryPressed}; background: white; border: 1px solid ${theme.colors.primary}; border-radius: 8px; }`;
const Tokens = styled.div`display: flex; flex-wrap: wrap; gap: 0.4rem;`;
const MatchGrid = styled.div`display: grid; gap: 0.65rem; margin-bottom: 0.8rem; & label { min-inline-size: 0; display: grid; gap: 0.35rem; } & strong { overflow-wrap: anywhere; } & select { inline-size: 100%; min-block-size: 2.75rem; padding: 0.5rem; color: ${theme.colors.text}; background: white; border: 2px solid ${theme.colors.border}; border-radius: ${theme.radius.small}; font: inherit; }`;
const PrimaryButton = styled.button`min-block-size: 2.75rem; display: inline-flex; align-items: center; justify-content: center; gap: 0.45rem; padding: 0.6rem 0.85rem; color: white; background: ${theme.colors.primaryPressed}; border: 1px solid ${theme.colors.primaryPressed}; border-radius: ${theme.radius.small}; font-weight: 900; &:disabled { opacity: 0.55; } &:focus-visible { outline: 3px solid ${theme.colors.primarySoft}; outline-offset: 2px; }`;
const SecondaryButton = styled(PrimaryButton)`color: ${theme.colors.primaryPressed}; background: ${theme.colors.primarySoft}; border-color: ${theme.colors.primary};`;
const Feedback = styled.div`display: flex; align-items: flex-start; gap: 0.65rem; margin: 0.85rem 0; padding: 0.8rem; color: ${(props) => props.$correct ? theme.colors.success : theme.colors.error}; background: ${(props) => props.$correct ? theme.colors.successSoft : theme.colors.errorSoft}; border: 1px solid currentColor; border-radius: ${theme.radius.small}; & > svg { flex: 0 0 auto; margin-top: 0.15rem; } & div { min-inline-size: 0; display: grid; gap: 0.2rem; } & span { color: ${theme.colors.text}; overflow-wrap: anywhere; } & p { margin: 0.2rem 0 0; color: ${theme.colors.textMuted}; line-height: 1.4; }`;
const ReviewList = styled.div`display: grid; gap: 0.6rem;`;
const ReviewItem = styled.article`display: grid; grid-template-columns: 1.5rem minmax(0, 1fr); gap: 0.55rem; padding: 0.8rem; background: ${(props) => props.$correct ? theme.colors.successSoft : theme.colors.errorSoft}; border: 1px solid ${(props) => props.$correct ? theme.colors.success : theme.colors.error}; border-radius: ${theme.radius.medium}; & > span { color: ${(props) => props.$correct ? theme.colors.success : theme.colors.error}; } & div { min-inline-size: 0; } & strong, & p, & small { overflow-wrap: anywhere; } & p { margin: 0.3rem 0; color: ${theme.colors.error}; } & small { display: block; color: ${theme.colors.textMuted}; line-height: 1.4; }`;
const ResultActions = styled.div`display: flex; flex-wrap: wrap; gap: 0.6rem; margin-top: 1rem;`;
const BackLink = styled(Link)`min-block-size: 2.75rem; display: inline-flex; align-items: center; margin-top: 1rem; padding-inline: 1rem; color: ${theme.colors.text}; background: ${theme.colors.surface}; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.small}; text-decoration: none; font-weight: 800;`;
