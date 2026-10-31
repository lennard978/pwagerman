import styled from "styled-components";
import { theme } from "../../styles/theme";
import { ReadingQuestion } from "./ReadingQuestion";

export const ReadingPart = ({ part, answers, onAnswer }) => {
  const textById = Object.fromEntries(part.texts.map((text) => [text.id, text]));
  return (
    <PartSection>
      <PartHeading>
        <span>Part {part.number} · Suggested {part.recommendedSeconds / 60} minutes</span>
        <h2>{part.title}</h2>
        <p>{part.instructions}</p>
      </PartHeading>

      {part.number === 3 && (
        <Advertisements aria-label="Advertisements">
          {part.advertisements.map((advertisement) => (
            <TextCard key={advertisement.id}><h3>{advertisement.id} · {advertisement.title}</h3><p>{advertisement.body}</p></TextCard>
          ))}
        </Advertisements>
      )}

      {part.number !== 4 && part.texts.map((text) => (
        <Passage key={text.id}><h3>{text.title}</h3>{text.body.split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</Passage>
      ))}

      <QuestionList>
        {part.items.map((item) => (
          <QuestionGroup key={item.id}>
            {part.number === 4 && <Comment><h3>{textById[item.textRef].title}</h3><p>{textById[item.textRef].body}</p></Comment>}
            <ReadingQuestion item={item} value={answers[item.id]} onChange={(answer) => onAnswer(item.id, answer)} matchingAnswers={answers} />
          </QuestionGroup>
        ))}
      </QuestionList>
    </PartSection>
  );
};

const PartSection = styled.section`inline-size: 100%;`;
const PartHeading = styled.header`margin-bottom: 1rem; span { color: ${theme.colors.primaryPressed}; font-size: .76rem; font-weight: 900; text-transform: uppercase; } h2 { margin: .25rem 0; font-size: clamp(1.45rem, 4vw, 2rem); } p { margin: 0; color: ${theme.colors.textMuted}; line-height: 1.5; }`;
const Passage = styled.article`margin-bottom: 1rem; padding: clamp(1rem, 3vw, 1.5rem); border-left: 5px solid ${theme.colors.primary}; border-radius: ${theme.radius.medium}; background: ${theme.colors.surface}; box-shadow: ${theme.shadow.soft}; h3 { margin: 0 0 .75rem; } p { margin: 0 0 .8rem; line-height: 1.72; &:last-child { margin-bottom: 0; } }`;
const Advertisements = styled.div`display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .6rem; margin-bottom: 1rem; @media (max-width: 40rem) { grid-template-columns: 1fr; }`;
const TextCard = styled.article`padding: .85rem; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.small}; background: ${theme.colors.surface}; h3 { margin: 0 0 .35rem; font-size: .93rem; } p { margin: 0; color: ${theme.colors.textMuted}; font-size: .86rem; line-height: 1.5; }`;
const QuestionList = styled.div`display: grid; gap: .8rem;`;
const QuestionGroup = styled.div`display: grid; gap: .4rem;`;
const Comment = styled.blockquote`margin: 0; padding: .9rem 1rem; border-left: 4px solid ${theme.colors.primary}; background: ${theme.colors.surfaceMuted}; border-radius: ${theme.radius.small}; h3 { margin: 0 0 .3rem; } p { margin: 0; line-height: 1.55; }`;
