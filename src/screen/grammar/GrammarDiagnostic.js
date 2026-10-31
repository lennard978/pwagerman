import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaCheck } from "react-icons/fa";
import {
  FOUNDATION_DIAGNOSTIC_QUESTIONS,
  getGermanGrammarLesson,
  scoreFoundationDiagnostic,
} from "../../data/grammar/index";
import { useProgress } from "../../i18n/ProgressProvider";
import { theme } from "../../styles/theme";

export const GrammarDiagnostic = () => {
  const { recordGrammarCompletion } = useProgress();
  const [index, setIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [finished, setFinished] = useState(false);
  const [reviewed, setReviewed] = useState([]);
  const question = FOUNDATION_DIAGNOSTIC_QUESTIONS[index];
  const answer = responses[question?.id];
  const choose = (optionId) => setResponses((current) => ({ ...current, [question.id]: optionId }));
  const next = () => index === FOUNDATION_DIAGNOSTIC_QUESTIONS.length - 1 ? setFinished(true) : setIndex((current) => current + 1);

  if (finished) {
    const result = scoreFoundationDiagnostic(responses);
    const markReviewed = (grammarLessonId) => {
      const lesson = getGermanGrammarLesson(grammarLessonId);
      recordGrammarCompletion({ lessonId: lesson.id, route: `/learn/grammar/${lesson.id}`, title: lesson.title, reviewed: true });
      setReviewed((current) => [...new Set([...current, grammarLessonId])]);
    };
    return (
      <Wrapper>
        <Header><Eyebrow>Foundation diagnostic results</Eyebrow><h1>{result.correct} / {result.total}</h1><p>This is an independent review guide, not an official placement test or CEFR certification.</p></Header>
        <Breakdown>{result.breakdown.map((item) => (
          <ResultCard key={item.grammarLessonId} $strong={item.recommendation === "strong"}>
            <div><strong>{item.title}</strong><span>{item.correct} / {item.total} · {item.recommendation === "strong" ? "Strong" : "Review recommended"}</span></div>
            <ResultActions><Link to={`/learn/grammar/${item.grammarLessonId}`}>Open lesson</Link><button type="button" disabled={reviewed.includes(item.grammarLessonId)} onClick={() => markReviewed(item.grammarLessonId)}><FaCheck aria-hidden="true" /> {reviewed.includes(item.grammarLessonId) ? "Reviewed" : "Mark reviewed"}</button></ResultActions>
          </ResultCard>
        ))}</Breakdown>
        <BackLink to="/learn/grammar">Back to Grammar</BackLink>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Header><Eyebrow>Foundation Review</Eyebrow><h1>Grammar diagnostic</h1><p>20 questions · two from each Foundation Review lesson. You decide whether to mark any lesson reviewed.</p></Header>
      <QuestionCard>
        <ProgressText>Question {index + 1} of {FOUNDATION_DIAGNOSTIC_QUESTIONS.length}</ProgressText>
        <h2>{question.prompt}</h2>
        <Options>{question.options.map((option) => <Option key={option.id} type="button" $selected={answer === option.id} onClick={() => choose(option.id)}>{option.label}</Option>)}</Options>
        <PrimaryButton type="button" disabled={!answer} onClick={next}>{index === FOUNDATION_DIAGNOSTIC_QUESTIONS.length - 1 ? "See results" : "Next question"}</PrimaryButton>
      </QuestionCard>
      <BackLink to="/learn/grammar">Leave diagnostic</BackLink>
    </Wrapper>
  );
};

const Wrapper = styled.main`inline-size: min(100%, 48rem); min-block-size: 100vh; padding: 1rem 1rem 7rem;`;
const Header = styled.header`margin-bottom: 1rem; & h1 { margin: 0; color: ${theme.colors.navy}; font-size: clamp(1.75rem, 7vw, 2.4rem); } & p { margin: 0.45rem 0 0; color: ${theme.colors.textMuted}; line-height: 1.5; }`;
const Eyebrow = styled.p`margin: 0 0 0.25rem !important; color: ${theme.colors.primaryPressed} !important; font-size: 0.75rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.08em;`;
const QuestionCard = styled.section`padding: 1rem; background: ${theme.colors.surface}; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.large}; box-shadow: ${theme.shadow.soft}; & h2 { margin: 0.5rem 0 1rem; font-size: 1.1rem; line-height: 1.45; }`;
const ProgressText = styled.p`margin: 0; color: ${theme.colors.primaryPressed}; font-size: 0.75rem; font-weight: 900;`;
const Options = styled.div`display: grid; gap: 0.55rem; margin-bottom: 0.8rem;`;
const Option = styled.button`min-block-size: 2.75rem; padding: 0.65rem 0.8rem; color: ${theme.colors.text}; background: ${(props) => props.$selected ? theme.colors.primarySoft : "white"}; border: 2px solid ${(props) => props.$selected ? theme.colors.primary : theme.colors.border}; border-radius: ${theme.radius.small}; text-align: left; font-weight: 700;`;
const PrimaryButton = styled.button`min-block-size: 2.75rem; display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.6rem 0.8rem; color: white; background: ${theme.colors.primaryPressed}; border: 0; border-radius: ${theme.radius.small}; font-weight: 900; &:disabled { opacity: 0.55; }`;
const Breakdown = styled.div`display: grid; gap: 0.65rem;`;
const ResultCard = styled.article`display: grid; gap: 0.7rem; padding: 0.8rem; background: ${(props) => props.$strong ? theme.colors.successSoft : "#fff8e6"}; border: 1px solid ${(props) => props.$strong ? theme.colors.success : "#d9a31b"}; border-radius: ${theme.radius.medium}; & > div:first-child { display: grid; gap: 0.2rem; } & span { color: ${theme.colors.textMuted}; font-size: 0.8rem; }`;
const ResultActions = styled.div`display: flex !important; flex-wrap: wrap; gap: 0.45rem !important; & a, & button { min-block-size: 2.75rem; display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.5rem 0.65rem; color: ${theme.colors.primaryPressed}; background: white; border: 1px solid ${theme.colors.primary}; border-radius: ${theme.radius.small}; text-decoration: none; font-weight: 800; } & button:disabled { color: ${theme.colors.success}; border-color: ${theme.colors.success}; }`;
const BackLink = styled(Link)`min-block-size: 2.75rem; display: inline-flex; align-items: center; margin-top: 1rem; padding-inline: 1rem; color: ${theme.colors.text}; background: white; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.small}; text-decoration: none; font-weight: 800;`;
