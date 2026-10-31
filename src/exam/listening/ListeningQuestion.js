import styled from "styled-components";
import { theme } from "../../styles/theme";

export const ListeningQuestion = ({ item, value, onChange }) => (
  <Card id={`listening-question-${item.number}`}>
    <span>Question {item.number}</span>
    <fieldset>
      <legend>{item.prompt}</legend>
      <Options>
        {item.options.map((option) => {
          const id = `${item.id}-${option.id}`;
          return (
            <Option key={option.id} htmlFor={id} $checked={value === option.id}>
              <input id={id} type="radio" name={item.id} value={option.id} checked={value === option.id} onChange={() => onChange(option.id)} />
              <b>{item.type === "true-false" ? option.label : String(option.id).toUpperCase()}</b>
              {item.type !== "true-false" && <span>{option.label}</span>}
            </Option>
          );
        })}
      </Options>
    </fieldset>
  </Card>
);

const Card = styled.article`scroll-margin-top: 9rem; padding: 1rem; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.medium}; background: ${theme.colors.surface}; box-shadow: ${theme.shadow.soft}; & > span { color: ${theme.colors.primaryPressed}; font-size: .72rem; font-weight: 900; text-transform: uppercase; } fieldset { min-inline-size: 0; margin: 0; padding: 0; border: 0; } legend { margin: .35rem 0 .75rem; padding: 0; font-weight: 750; line-height: 1.5; }`;
const Options = styled.div`display: grid; gap: .45rem;`;
const Option = styled.label`display: grid; grid-template-columns: auto 1.8rem 1fr; align-items: start; gap: .5rem; padding: .7rem; border: 1px solid ${({ $checked }) => $checked ? theme.colors.primary : theme.colors.border}; border-radius: ${theme.radius.small}; background: ${({ $checked }) => $checked ? theme.colors.primarySoft : theme.colors.surface}; cursor: pointer; line-height: 1.4; input { margin-top: .2rem; accent-color: ${theme.colors.primary}; } b { color: ${theme.colors.primaryPressed}; }`;
