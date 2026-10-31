import styled from "styled-components";
import { theme } from "../../styles/theme";
import { ListeningAudioPlayer } from "./ListeningAudioPlayer";
import { ListeningQuestion } from "./ListeningQuestion";

export const ListeningPart = ({ part, session, updateSession, onAnswer }) => {
  const activeAudio = part.audio.find((audio) => {
    const state = session.playbackState[audio.id];
    return state.playCount < audio.playbackLimit || state.inProgress;
  }) || part.audio[part.audio.length - 1];

  return (
    <Section>
      <Header><span>Part {part.number} · Exam mode</span><h2>{part.title}</h2><p>{part.instructions}</p></Header>
      {part.audio.map((audio, index) => {
        const questions = part.items.filter(({ audioRef }) => audio.id === audioRef);
        const isCurrent = audio.id === activeAudio.id;
        const playback = session.playbackState[audio.id];
        const isComplete = playback.playCount >= audio.playbackLimit && !playback.inProgress;
        return (
          <AudioGroup key={audio.id} $muted={!isCurrent}>
            {part.number === 1 && <h3>Recording {index + 1} of 5</h3>}
            {isCurrent
              ? <ListeningAudioPlayer audio={audio} preparationSeconds={part.preparationSeconds} session={session} updateSession={updateSession} />
              : isComplete
                ? <CompletedAudio><strong>{audio.title}</strong><span>Playback completed · answers remain editable</span></CompletedAudio>
                : <LockedAudio><strong>{audio.title}</strong><span>Available after the previous recording is completed</span></LockedAudio>}
            <Questions>
              {questions.map((item) => <ListeningQuestion key={item.id} item={item} value={session.answers[item.id]} onChange={(answer) => onAnswer(item.id, answer)} />)}
            </Questions>
          </AudioGroup>
        );
      })}
      <NoTranscript>Transcript, subtitles, translation, hints, seeking, and playback-speed controls remain unavailable during the scored attempt.</NoTranscript>
    </Section>
  );
};

const Section = styled.section`inline-size: 100%;`;
const Header = styled.header`margin-bottom: 1rem; span { color: ${theme.colors.primaryPressed}; font-size: .75rem; font-weight: 900; text-transform: uppercase; } h2 { margin: .25rem 0; } p { margin: 0; color: ${theme.colors.textMuted}; line-height: 1.5; }`;
const AudioGroup = styled.section`display: grid; gap: .7rem; margin-bottom: 1.2rem; opacity: ${({ $muted }) => $muted ? .82 : 1}; & > h3 { margin: .5rem 0 0; }`;
const CompletedAudio = styled.div`display: flex; align-items: center; justify-content: space-between; gap: .7rem; padding: .8rem; border-radius: ${theme.radius.small}; background: ${theme.colors.successSoft}; color: ${theme.colors.success}; span { font-size: .75rem; } @media (max-width: 32rem) { align-items: start; flex-direction: column; }`;
const LockedAudio = styled(CompletedAudio)`background: ${theme.colors.surfaceMuted}; color: ${theme.colors.textMuted};`;
const Questions = styled.div`display: grid; gap: .65rem;`;
const NoTranscript = styled.p`padding: .7rem; border-radius: ${theme.radius.small}; background: ${theme.colors.surfaceMuted}; color: ${theme.colors.textMuted}; font-size: .75rem; line-height: 1.45;`;
