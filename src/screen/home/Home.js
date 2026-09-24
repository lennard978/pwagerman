import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaArrowRight, FaBookOpen, FaCheck, FaStar } from "react-icons/fa";
import { useLanguage } from "../../i18n/LanguageProvider";
import { useMyWords } from "../../i18n/MyWordsProvider";
import { theme } from "../../styles/theme";
import { InstallHelp } from "../../components/InstallHelp";
import { useProgress } from "../../i18n/ProgressProvider";
import { getCurrentStreak } from "../../data/learningProgress";
import { Curriculum } from "../../data/data";

export const Home = () => {
  const { t } = useLanguage();
  const vocabulary = useMyWords();
  const allWords = vocabulary ? vocabulary.allWords : [];
  const words = vocabulary ? vocabulary.words : [];
  const known = allWords.filter((word) => word.status === "known").length;
  const favorites = allWords.filter((word) => word.favorite).length;
  const progressContext = useProgress();
  const progress = progressContext?.progress;
  const streak = progress ? getCurrentStreak(progress.activityDates) : 0;
  const destination = progress?.lastActivity?.route || "/learn";

  return (
    <Container>
      <Hero>
        <Logo src={`${process.env.PUBLIC_URL}/serbian-a1-wordmark-compact.png`} alt={t("app.name")} />
        <Heading>{t("app.name")}</Heading>
        <Tagline>{t("app.tagline")}</Tagline>
        <Attribution
          href="https://asenda-studio.vercel.app"
          target="_blank"
          rel="noreferrer"
        >
          <AsendaMark aria-hidden="true">A</AsendaMark>
          <span>Created by <strong>Asenda Studio</strong></span>
        </Attribution>
      </Hero>

      <Section>
        <StartCard to={destination}>
          <div>
            <strong>{progress?.lastActivity ? t("home.continueLearning") : t("home.startLearning")}</strong>
            <span>{progress?.lastActivity ? t(`activity.${progress.lastActivity.type}`) : t("home.chooseCategory")}</span>
          </div>
          <FaArrowRight aria-hidden="true" />
        </StartCard>
      </Section>

      <PracticeLink to="/practice">
        <span><FaBookOpen aria-hidden="true" /> {t("navigation.practice")}</span>
        <FaArrowRight aria-hidden="true" />
      </PracticeLink>

      <Section>
        <Eyebrow>{t("home.progress")}</Eyebrow>
        <Stats>
          <Stat to="/my-words?filter=known"><FaCheck aria-hidden="true" /><strong>{known}</strong><span>{t("vocabulary.knownWords")}</span></Stat>
          <Stat to="/my-words?filter=favorites"><FaStar aria-hidden="true" /><strong>{favorites}</strong><span>{t("vocabulary.favorites")}</span></Stat>
          <Stat to="/my-words"><FaBookOpen aria-hidden="true" /><strong>{words.length}</strong><span>{t("myWords.title")}</span></Stat>
          <Stat to="/learn"><FaBookOpen aria-hidden="true" /><strong>{progress?.completedLessons.length || 0} / {Curriculum.length}</strong><span>{t("home.completedTopics")}</span></Stat>
          <Stat to="/practice"><FaCheck aria-hidden="true" /><strong>{progress?.completedExercises.length || 0}</strong><span>{t("home.practiceSessions")}</span></Stat>
          {streak > 0 && <Stat as="div"><FaCheck aria-hidden="true" /><strong>{streak}</strong><span>{t("home.dayStreak")}</span></Stat>}
        </Stats>
      </Section>

      <MyWordsLink to="/my-words">
        <strong>{t("myWords.title")}</strong>
        <span>{t("myWords.libraryDescription")}</span>
      </MyWordsLink>
      <InstallHelp />
    </Container>
  );
};

const Container = styled.main`
  inline-size: min(100%, 42rem);
  min-block-size: calc(100vh - ${theme.navHeight});
  padding: max(0.75rem, env(safe-area-inset-top)) 1rem 7rem;
`;
const Hero = styled.header`
  display: grid;
  justify-items: center;
  gap: 0.45rem;
  padding: 0.25rem 0 1.25rem;
`;
const Logo = styled.img`display: block; inline-size: min(100%, 14rem); block-size: auto;`;
const Heading = styled.h1`margin: 0; color: ${theme.colors.navy}; font-size: clamp(1.7rem, 7vw, 2.3rem);`;
const Tagline = styled.p`
  margin: 0;
  color: ${theme.colors.textMuted};
  line-height: 1.5;
  text-align: center;
`;
const Attribution = styled.a`
  min-block-size: 2.25rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.2rem;
  padding: 0.3rem 0.7rem;
  color: ${theme.colors.textMuted};
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.pill};
  text-decoration: none;
  font-size: 0.74rem;
  line-height: 1;
  & strong { color: ${theme.colors.navy}; }
  &:focus-visible {
    outline: 3px solid ${theme.colors.primarySoft};
    outline-offset: 2px;
  }
`;
const AsendaMark = styled.span`
  inline-size: 1.4rem;
  block-size: 1.4rem;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  color: white;
  background: #ff5a1f;
  border-radius: 50%;
  font-size: 0.72rem;
  font-weight: 900;
  transform: rotate(-8deg);
`;
const Section = styled.section`margin-top: 1rem;`;
const Eyebrow = styled.h2`
  margin: 0 0 0.55rem;
  color: ${theme.colors.text};
  font-size: 1rem;
`;
const StartCard = styled(Link)`
  min-block-size: 5.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.1rem;
  color: white;
  background: ${theme.colors.navy};
  border-radius: ${theme.radius.large};
  box-shadow: ${theme.shadow.soft};
  text-decoration: none;
  & div { display: grid; gap: 0.25rem; }
  & span { color: rgba(255, 255, 255, 0.72); font-size: 0.85rem; }
`;
const PracticeLink = styled(Link)`
  min-block-size: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.8rem;
  padding: 0.8rem 1rem;
  color: ${theme.colors.primaryPressed};
  background: ${theme.colors.primarySoft};
  border: 1px solid #fed7aa;
  border-radius: ${theme.radius.medium};
  text-decoration: none;
  font-weight: 700;
  & span { display: inline-flex; align-items: center; gap: 0.5rem; }
`;
const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  @media (min-width: 30rem) { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  gap: 0.55rem;
`;
const Stat = styled(Link)`
  min-inline-size: 0;
  display: grid;
  justify-items: center;
  gap: 0.25rem;
  padding: 0.8rem 0.35rem;
  color: ${theme.colors.text};
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.medium};
  box-shadow: ${theme.shadow.soft};
  text-align: center;
  text-decoration: none;
  & svg { color: ${theme.colors.primary}; }
  & strong { font-size: 1.3rem; }
  & span { color: ${theme.colors.textMuted}; font-size: 0.72rem; overflow-wrap: anywhere; }
`;
const MyWordsLink = styled(Link)`
  display: grid;
  gap: 0.25rem;
  margin-top: 1rem;
  padding: 1rem;
  color: ${theme.colors.text};
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.medium};
  box-shadow: ${theme.shadow.soft};
  text-decoration: none;
  & span { color: ${theme.colors.textMuted}; font-size: 0.85rem; }
`;
