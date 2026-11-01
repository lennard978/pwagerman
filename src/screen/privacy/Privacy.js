import { Link } from "react-router-dom";
import styled from "styled-components";
import { theme } from "../../styles/theme";

export const Privacy = () => (
  <Page>
    <Back to="/home">← Home</Back>
    <header>
      <Eyebrow>PRODUCT PRIVACY</Eyebrow>
      <h1>Privacy and local data</h1>
      <Lead>
        German B1 is an independent preparation tool. It does not require an
        account, and practice recordings are not uploaded.
      </Lead>
    </header>

    <Section>
      <h2>Progress and drafts</h2>
      <p>
        Vocabulary state, progress, exam sessions, writing drafts, settings,
        and history are stored in this browser using localStorage and
        IndexedDB. This German course uses its own <code>asenda.german-b1</code>
        namespace and does not modify data preserved from earlier course versions.
      </p>
    </Section>

    <Section>
      <h2>Optional microphone recordings</h2>
      <p>
        Microphone permission is requested only after you select Start
        recording. Recordings stay in local browser storage, are limited in
        size, are not uploaded by the app, and can be deleted from the speaking
        screen. Clearing this site's browser data can also remove them.
      </p>
    </Section>

    <Section>
      <h2>Speech and network use</h2>
      <p>
        Pronunciation buttons may send the selected German text and the
        <code>de-DE</code> language code to the configured text-to-speech
        endpoint. If cloud speech is unavailable, the app can use a compatible
        browser voice. Listening tracks and initial app updates also require a
        network connection until the relevant files have been cached.
      </p>
    </Section>

    <Section>
      <h2>Offline use and control</h2>
      <p>
        The installed app shell can work offline after a successful online
        load. Only a Listening form explicitly prepared in advance is expected
        to play fully offline. You control local data through the app's delete
        actions and your browser's site-data settings.
      </p>
    </Section>

    <Notice>
      Independent preparation tool. Not affiliated with or endorsed by the
      Goethe-Institut.
    </Notice>
  </Page>
);

const Page = styled.div`
  inline-size: min(100%, 46rem);
  min-block-size: calc(100vh - ${theme.navHeight});
  padding: max(1rem, env(safe-area-inset-top)) 1rem 7rem;
  color: ${theme.colors.text};
  h1 { margin: .35rem 0 .7rem; color: ${theme.colors.navy}; }
`;
const Back = styled(Link)`
  min-block-size: 2.75rem;
  display: inline-flex;
  align-items: center;
  color: ${theme.colors.primaryPressed};
  font-weight: 800;
  text-decoration: none;
`;
const Eyebrow = styled.span`
  color: ${theme.colors.primaryPressed};
  font-size: .76rem;
  font-weight: 900;
  letter-spacing: .1em;
`;
const Lead = styled.p`margin: 0; color: ${theme.colors.textMuted}; line-height: 1.6;`;
const Section = styled.section`
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.medium};
  background: ${theme.colors.surface};
  h2 { margin: 0 0 .45rem; font-size: 1.08rem; }
  p { margin: 0; color: ${theme.colors.textMuted}; line-height: 1.6; }
  code { overflow-wrap: anywhere; }
`;
const Notice = styled.p`
  margin: 1rem 0 0;
  color: ${theme.colors.textMuted};
  font-size: .78rem;
  line-height: 1.5;
  text-align: center;
`;
