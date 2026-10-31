import styled from "styled-components";
import { theme } from "../../styles/theme";

const answerLabel = (part, item, answer) => {
  const label = item.options.find(({ id }) => id === answer)?.label || "Unanswered";
  if (part.number !== 3 || !answer || answer === "0") return label;
  const advertisement = part.advertisements.find(({ id }) => id === answer);
  return advertisement ? `${label}: ${advertisement.body}` : label;
};

export const ReadingReview = ({ form, session, onClose }) => {
  const graded = Object.fromEntries(session.score.graded.map((item) => [item.itemId, item]));
  const parts = session.mode === "practice" ? form.parts.filter(({ number }) => number === session.currentPart) : form.parts;
  return (
    <ReviewPage>
      <ReviewHeader><div><span>Detailed review</span><h1>Answers and evidence</h1></div><button type="button" onClick={onClose}>Back to results</button></ReviewHeader>
      {parts.map((part) => (
        <Part key={part.id}>
          <h2>Part {part.number} · {part.title}</h2>
          {part.items.map((item) => {
            const result = graded[item.id];
            const contextText = part.texts.find(({ id }) => id === item.textRef);
            const context = part.number === 3 ? item.prompt : contextText?.title;
            return (
              <ReviewCard key={item.id} $correct={result.correct}>
                <Status $correct={result.correct}>{result.correct ? "Correct" : "Review"} · Question {item.number}</Status>
                <h3>{item.prompt}</h3>
                {context && context !== item.prompt && <Context>Text: {context}</Context>}
                {contextText && <ContextDetails><summary>Show source context</summary><p>{contextText.body}</p></ContextDetails>}
                <Answer><span>Your answer</span><b>{answerLabel(part, item, result.learnerAnswer)}</b></Answer>
                <Answer><span>Correct answer</span><b>{answerLabel(part, item, result.correctAnswer)}</b></Answer>
                <p>{item.explanation}</p>
                <Evidence><strong>Evidence:</strong> {item.evidence}</Evidence>
              </ReviewCard>
            );
          })}
        </Part>
      ))}
    </ReviewPage>
  );
};

const ReviewPage = styled.section`inline-size: min(100%, 52rem); margin-inline: auto; padding: 1rem 0 2rem;`;
const ReviewHeader = styled.header`display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1rem; span { color: ${theme.colors.primaryPressed}; font-size: .75rem; font-weight: 900; text-transform: uppercase; } h1 { margin: .2rem 0 0; } button { min-block-size: 2.7rem; padding: .6rem .8rem; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.small}; background: ${theme.colors.surface}; font: inherit; font-weight: 800; cursor: pointer; } @media (max-width: 32rem) { align-items: start; flex-direction: column; }`;
const Part = styled.section`margin-top: 1.5rem; h2 { margin-bottom: .65rem; }`;
const ReviewCard = styled.article`margin-bottom: .65rem; padding: 1rem; border: 1px solid ${({ $correct }) => $correct ? theme.colors.success : theme.colors.error}; border-radius: ${theme.radius.medium}; background: ${theme.colors.surface}; h3 { margin: .3rem 0 .6rem; font-size: 1rem; line-height: 1.45; } & > p { margin: .7rem 0 .25rem; line-height: 1.5; }`;
const Status = styled.span`color: ${({ $correct }) => $correct ? theme.colors.success : theme.colors.error}; font-size: .72rem; font-weight: 900; text-transform: uppercase;`;
const Context = styled.p`color: ${theme.colors.textMuted}; font-size: .8rem;`;
const ContextDetails = styled.details`margin: .45rem 0; padding: .5rem .65rem; border-radius: ${theme.radius.small}; background: ${theme.colors.surfaceMuted}; summary { cursor: pointer; color: ${theme.colors.primaryPressed}; font-size: .8rem; font-weight: 800; } p { margin: .5rem 0 0; white-space: pre-line; font-size: .82rem; line-height: 1.55; }`;
const Answer = styled.div`display: grid; grid-template-columns: 7rem 1fr; gap: .5rem; padding: .35rem 0; span { color: ${theme.colors.textMuted}; font-size: .8rem; } b { font-size: .86rem; }`;
const Evidence = styled.small`display: block; color: ${theme.colors.textMuted}; line-height: 1.5;`;
