import styled from "styled-components";
import { theme } from "../../styles/theme";

export const ReadingQuestion = ({ item, value, onChange, matchingAnswers = {} }) => {
  if (item.type === "matching") {
    return (
      <QuestionCard id={`question-${item.number}`}>
        <QuestionNumber>Question {item.number}</QuestionNumber>
        <p>{item.prompt}</p>
        <Select
          aria-label={`Answer for question ${item.number}`}
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">Select an answer</option>
          {item.options.map((option) => {
            const inUse = option.id !== "0" && Object.entries(matchingAnswers).some(([otherId, answer]) => otherId !== item.id && answer === option.id);
            return <option key={option.id} value={option.id}>{option.label}{inUse ? " (move assignment here)" : ""}</option>;
          })}
        </Select>
        <Hint>Choosing an advertisement already assigned elsewhere releases the earlier answer.</Hint>
      </QuestionCard>
    );
  }

  return (
    <QuestionCard id={`question-${item.number}`}>
      <QuestionNumber>Question {item.number}</QuestionNumber>
      <fieldset>
        <legend>{item.prompt}</legend>
        <Options>
          {item.options.map((option) => {
            const id = `${item.id}-${option.id}`;
            return (
              <Option key={option.id} $checked={value === option.id} htmlFor={id}>
                <input id={id} type="radio" name={item.id} value={option.id} checked={value === option.id} onChange={() => onChange(option.id)} />
                <b>{option.id.length === 1 ? option.id.toUpperCase() : ""}</b><span>{option.label}</span>
              </Option>
            );
          })}
        </Options>
      </fieldset>
    </QuestionCard>
  );
};

const QuestionCard = styled.article`scroll-margin-top: 8rem; padding: 1rem; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.medium}; background: ${theme.colors.surface}; box-shadow: ${theme.shadow.soft}; & > p { margin: 0.35rem 0 0.8rem; line-height: 1.55; } fieldset { min-inline-size: 0; margin: 0; padding: 0; border: 0; } legend { margin: 0.35rem 0 0.8rem; padding: 0; font-weight: 750; line-height: 1.5; }`;
const QuestionNumber = styled.span`color: ${theme.colors.primaryPressed}; font-size: 0.72rem; font-weight: 900; letter-spacing: .06em; text-transform: uppercase;`;
const Options = styled.div`display: grid; gap: 0.45rem;`;
const Option = styled.label`display: grid; grid-template-columns: auto 1.8rem 1fr; align-items: start; gap: 0.5rem; padding: 0.7rem; border: 1px solid ${({ $checked }) => $checked ? theme.colors.primary : theme.colors.border}; border-radius: ${theme.radius.small}; background: ${({ $checked }) => $checked ? theme.colors.primarySoft : theme.colors.surface}; cursor: pointer; line-height: 1.4; input { margin-top: .2rem; accent-color: ${theme.colors.primary}; } b { color: ${theme.colors.primaryPressed}; text-transform: uppercase; }`;
const Select = styled.select`inline-size: 100%; min-block-size: 3rem; padding: 0.65rem; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.small}; background: ${theme.colors.surface}; color: ${theme.colors.text}; font: inherit; &:focus { outline: 3px solid ${theme.colors.primarySoft}; border-color: ${theme.colors.primary}; }`;
const Hint = styled.small`display: block; margin-top: 0.45rem; color: ${theme.colors.textMuted}; line-height: 1.4;`;
