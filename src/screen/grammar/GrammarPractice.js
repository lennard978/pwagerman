import { useState } from "react";
import styled from "styled-components";
import { useLanguage } from "../../i18n/LanguageProvider";
import { useProgress } from "../../i18n/ProgressProvider";
import { theme } from "../../styles/theme";

const normalize = (value) => value.trim().toLocaleLowerCase("sr");

const Result = ({ correct, t }) => (
  <Feedback role="status" $correct={correct}>
    {correct ? t("exercise.correct") : t("exercise.incorrect")}
  </Feedback>
);

const ChoosePractice = ({ exercise, onGrade, t }) => {
  const [result, setResult] = useState(null);
  const [selected, setSelected] = useState(null);
  const choose = (option) => {
    const correct = option === exercise.answer;
    setSelected(option);
    setResult(correct);
    onGrade(correct);
  };
  return (
    <>
      <Options>
        {exercise.options.map((option) => (
          <Option
            key={option}
            type="button"
            disabled={result !== null}
            $correct={result !== null && option === exercise.answer}
            $wrong={result === false && option === selected}
            onClick={() => choose(option)}
          >
            {option}
          </Option>
        ))}
      </Options>
      {result !== null && <Result correct={result} t={t} />}
    </>
  );
};

const FillPractice = ({ exercise, onGrade, t }) => {
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);
  const submit = (event) => {
    event.preventDefault();
    const correct = normalize(answer) === normalize(exercise.answer);
    setResult(correct);
    onGrade(correct);
  };
  return (
    <PracticeForm onSubmit={submit}>
      <PracticeInput
        aria-label={t("grammar.answer")}
        value={answer}
        onChange={(event) => {
          setAnswer(event.target.value);
          setResult(null);
        }}
      />
      <CheckButton type="submit" disabled={!answer.trim()}>{t("grammar.check")}</CheckButton>
      {result !== null && <Result correct={result} t={t} />}
    </PracticeForm>
  );
};

const MatchPractice = ({ exercise, onGrade, t }) => {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const choices = exercise.pairs.map((pair) => pair.right).sort();
  const submit = (event) => {
    event.preventDefault();
    const correct = exercise.pairs.every((pair) => answers[pair.left] === pair.right);
    setResult(correct);
    onGrade(correct);
  };
  return (
    <PracticeForm onSubmit={submit}>
      <MatchGrid>
        {exercise.pairs.map((pair) => (
          <MatchRow key={pair.left}>
            <strong>{pair.left}</strong>
            <Select
              aria-label={`${t("grammar.match")} ${pair.left}`}
              value={answers[pair.left] || ""}
              onChange={(event) => {
                setAnswers((current) => ({ ...current, [pair.left]: event.target.value }));
                setResult(null);
              }}
            >
              <option value="">{t("grammar.choose")}</option>
              {choices.map((choice) => <option key={choice} value={choice}>{choice}</option>)}
            </Select>
          </MatchRow>
        ))}
      </MatchGrid>
      <CheckButton
        type="submit"
        disabled={Object.keys(answers).length !== exercise.pairs.length}
      >
        {t("grammar.check")}
      </CheckButton>
      {result !== null && <Result correct={result} t={t} />}
    </PracticeForm>
  );
};

const OrderPractice = ({ exercise, onGrade, t }) => {
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState(null);
  const add = (index) => {
    setSelected((current) => [...current, index]);
    setResult(null);
  };
  const reset = () => {
    setSelected([]);
    setResult(null);
  };
  const check = () => {
    const value = selected.map((index) => exercise.tokens[index]);
    const correct = value.join("\u0000") === exercise.answer.join("\u0000");
    setResult(correct);
    onGrade(correct);
  };
  return (
    <>
      <OrderedAnswer aria-label={t("grammar.orderedAnswer")}>
        {selected.length === 0
          ? <Placeholder>{t("grammar.tapWords")}</Placeholder>
          : selected.map((index) => (
              <Token as="span" key={`${exercise.tokens[index]}-${index}`}>
                {exercise.tokens[index]}
              </Token>
            ))}
      </OrderedAnswer>
      <TokenPool>
        {exercise.tokens.map((token, index) => (
          <Token
            key={`${token}-${index}`}
            type="button"
            disabled={selected.includes(index)}
            onClick={() => add(index)}
          >
            {token}
          </Token>
        ))}
      </TokenPool>
      <OrderActions>
        <SecondaryButton type="button" onClick={reset}>{t("grammar.reset")}</SecondaryButton>
        <CheckButton
          type="button"
          disabled={selected.length !== exercise.tokens.length}
          onClick={check}
        >
          {t("grammar.check")}
        </CheckButton>
      </OrderActions>
      {result !== null && <Result correct={result} t={t} />}
    </>
  );
};

export const GrammarPractice = ({ lessonId, exercises }) => {
  const { t } = useLanguage();
  const progress = useProgress();
  const grade = (exerciseId, correct) =>
    progress?.recordGrammarAnswer({ lessonId, exerciseId, correct });

  return (
    <PracticeList>
      {exercises.map((exercise, index) => (
        <PracticeCard key={exercise.id}>
          <ExerciseNumber>{t("grammar.practice")} {index + 1}</ExerciseNumber>
          <Prompt>{exercise.prompt}</Prompt>
          {exercise.type === "choose" && (
            <ChoosePractice exercise={exercise} onGrade={(correct) => grade(exercise.id, correct)} t={t} />
          )}
          {exercise.type === "fill" && (
            <FillPractice exercise={exercise} onGrade={(correct) => grade(exercise.id, correct)} t={t} />
          )}
          {exercise.type === "match" && (
            <MatchPractice exercise={exercise} onGrade={(correct) => grade(exercise.id, correct)} t={t} />
          )}
          {exercise.type === "order" && (
            <OrderPractice exercise={exercise} onGrade={(correct) => grade(exercise.id, correct)} t={t} />
          )}
        </PracticeCard>
      ))}
    </PracticeList>
  );
};

const PracticeList = styled.div`display: grid; gap: 0.8rem;`;
const PracticeCard = styled.section`display: grid; gap: 0.75rem; padding: 1rem; background: ${theme.colors.surface}; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.medium}; box-shadow: ${theme.shadow.soft};`;
const ExerciseNumber = styled.p`margin: 0; color: ${theme.colors.primaryPressed}; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em;`;
const Prompt = styled.h3`margin: 0; color: ${theme.colors.text}; font-size: 1rem;`;
const Options = styled.div`display: grid; gap: 0.5rem; @media (min-width: 30rem) { grid-template-columns: repeat(3, minmax(0, 1fr)); }`;
const Option = styled.button`min-block-size: 2.75rem; padding: 0.6rem; color: ${(props) => props.$correct ? theme.colors.success : props.$wrong ? theme.colors.error : theme.colors.text}; background: ${(props) => props.$correct ? theme.colors.successSoft : props.$wrong ? theme.colors.errorSoft : theme.colors.surfaceMuted}; border: 1px solid ${(props) => props.$correct ? theme.colors.success : props.$wrong ? theme.colors.error : theme.colors.border}; border-radius: ${theme.radius.small}; font-weight: 700;`;
const PracticeForm = styled.form`display: grid; gap: 0.65rem;`;
const PracticeInput = styled.input`min-block-size: 2.75rem; min-inline-size: 0; padding: 0.6rem 0.75rem; color: ${theme.colors.text}; background: ${theme.colors.surface}; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.small}; &:focus { outline: 3px solid ${theme.colors.primarySoft}; border-color: ${theme.colors.primary}; }`;
const CheckButton = styled.button`min-block-size: 2.75rem; justify-self: start; padding-inline: 1rem; color: white; background: ${theme.colors.primary}; border: 1px solid ${theme.colors.primary}; border-radius: ${theme.radius.small}; font-weight: 800; &:disabled { opacity: 0.45; }`;
const SecondaryButton = styled.button`min-block-size: 2.75rem; padding-inline: 1rem; color: ${theme.colors.text}; background: ${theme.colors.surfaceMuted}; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.small}; font-weight: 700;`;
const Feedback = styled.p`justify-self: start; margin: 0; padding: 0.4rem 0.65rem; color: ${(props) => props.$correct ? theme.colors.success : theme.colors.error}; background: ${(props) => props.$correct ? theme.colors.successSoft : theme.colors.errorSoft}; border-radius: ${theme.radius.pill}; font-weight: 800;`;
const MatchGrid = styled.div`display: grid; gap: 0.5rem;`;
const MatchRow = styled.label`display: grid; grid-template-columns: minmax(4rem, 0.5fr) minmax(0, 1fr); align-items: center; gap: 0.75rem;`;
const Select = styled.select`min-inline-size: 0; min-block-size: 2.75rem; padding: 0.5rem; color: ${theme.colors.text}; background: ${theme.colors.surface}; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.small};`;
const OrderedAnswer = styled.div`min-block-size: 3.4rem; display: flex; flex-wrap: wrap; align-items: center; gap: 0.35rem; padding: 0.5rem; background: ${theme.colors.primarySoft}; border: 1px dashed ${theme.colors.primary}; border-radius: ${theme.radius.small};`;
const Placeholder = styled.span`color: ${theme.colors.textMuted}; font-size: 0.85rem;`;
const TokenPool = styled.div`display: flex; flex-wrap: wrap; gap: 0.4rem;`;
const Token = styled.button`min-block-size: 2.75rem; display: inline-flex; align-items: center; padding-inline: 0.7rem; color: ${theme.colors.text}; background: ${theme.colors.surface}; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.small}; font-weight: 700; &:disabled { opacity: 0.35; }`;
const OrderActions = styled.div`display: flex; gap: 0.5rem;`;
