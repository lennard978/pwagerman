import styled from "styled-components";
import { theme } from "../../styles/theme";
import { getListeningAudioManifestEntry, resolveListeningAudioUrl } from "./audioManifest";

const answerLabel = (item, answer) => item.options.find(({ id }) => id === answer)?.label || "Unanswered";

export const ListeningReview = ({ form, session, onClose }) => {
  const graded = Object.fromEntries(session.score.graded.map((item) => [item.itemId, item]));
  const parts = session.mode === "practice" ? form.parts.filter(({ number }) => number === session.currentPart) : form.parts;
  return (
    <Page>
      <Header><div><span>Study mode · submitted attempt</span><h1>Answers and transcripts</h1></div><button type="button" onClick={onClose}>Back to results</button></Header>
      {parts.map((part) => <Part key={part.id}><h2>Part {part.number} · {part.title}</h2>{part.audio.map((audio) => {
        const entry = getListeningAudioManifestEntry(audio.id);
        const labels = Object.fromEntries(audio.speakers.map(({ id, label }) => [id, label]));
        return (
          <AudioReview key={audio.id}>
            <h3>{audio.title}</h3>
            <audio controls preload="none" src={entry ? resolveListeningAudioUrl(entry) : undefined} aria-label={`Study replay: ${audio.title}`} />
            <small>Study replay is unrestricted after scoring and does not change the recorded exam play count.</small>
            <Transcript><strong>Transcript</strong>{audio.segments.map((segment, index) => <p key={`${segment.speakerId}-${index}`}><b>{labels[segment.speakerId]}:</b> {segment.text}</p>)}</Transcript>
            {part.items.filter(({ audioRef }) => audioRef === audio.id).map((item) => {
              const result = graded[item.id];
              return <ReviewCard key={item.id} $correct={result.correct}><Status $correct={result.correct}>{result.correct ? "Correct" : "Review"} · Question {item.number}</Status><h4>{item.prompt}</h4><Answer><span>Your answer</span><b>{answerLabel(item, result.learnerAnswer)}</b></Answer><Answer><span>Correct answer</span><b>{answerLabel(item, result.correctAnswer)}</b></Answer><p>{item.explanation}</p><Evidence><strong>Evidence:</strong> {item.evidence}</Evidence></ReviewCard>;
            })}
          </AudioReview>
        );
      })}</Part>)}
    </Page>
  );
};

const Page = styled.section`inline-size: min(100%, 54rem); margin-inline: auto; padding: 1rem 0 2rem;`;
const Header = styled.header`display: flex; align-items: center; justify-content: space-between; gap: 1rem; span { color: ${theme.colors.primaryPressed}; font-size: .72rem; font-weight: 900; text-transform: uppercase; } h1 { margin: .2rem 0 0; } button { min-block-size: 2.7rem; padding: .6rem .8rem; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.small}; background: ${theme.colors.surface}; font: inherit; font-weight: 800; } @media (max-width: 32rem) { align-items: start; flex-direction: column; }`;
const Part = styled.section`margin-top: 1.5rem;`;
const AudioReview = styled.section`display: grid; gap: .6rem; margin-bottom: 1.2rem; padding: 1rem; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.medium}; background: ${theme.colors.surface}; h3 { margin: 0; } audio { inline-size: 100%; } & > small { color: ${theme.colors.textMuted}; }`;
const Transcript = styled.details.attrs({ open: true })`padding: .8rem; border-radius: ${theme.radius.small}; background: ${theme.colors.surfaceMuted}; & > strong { display: block; margin-bottom: .5rem; } p { margin: .4rem 0; line-height: 1.55; }`;
const ReviewCard = styled.article`padding: .9rem; border: 1px solid ${({ $correct }) => $correct ? theme.colors.success : theme.colors.error}; border-radius: ${theme.radius.small}; h4 { margin: .3rem 0 .6rem; } & > p { margin: .6rem 0 .2rem; }`;
const Status = styled.span`color: ${({ $correct }) => $correct ? theme.colors.success : theme.colors.error}; font-size: .7rem; font-weight: 900; text-transform: uppercase;`;
const Answer = styled.div`display: grid; grid-template-columns: 7rem 1fr; gap: .5rem; padding: .25rem 0; span { color: ${theme.colors.textMuted}; font-size: .78rem; } b { font-size: .84rem; }`;
const Evidence = styled.small`color: ${theme.colors.textMuted}; line-height: 1.45;`;
