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
import { GermanCurriculum, getVocabularyCategoryProgress } from "../../data/vocabulary/curriculum";
import { isReviewDue } from "../../data/lexemeState";
import { COURSE_CONFIG, getPublicAsset } from "../../config/course";
import { GERMAN_B1_GRAMMAR_LESSONS, getGrammarProgressSummary } from "../../data/grammar/index";
import { loadMockSession } from "../../exam/core/mockPersistence";

export const Home = () => {
  const { t } = useLanguage();
  const vocabulary = useMyWords();
  const allWords = vocabulary ? vocabulary.allWords : [];
  const words = vocabulary ? vocabulary.words : [];
  const known = allWords.filter((word) => word.status === "known").length;
  const favorites = allWords.filter((word) => word.favorite).length;
  const learning = allWords.filter((word) => word.status === "learning").length;
  const learned = known + learning;
  const availableVocabulary = GermanCurriculum.reduce((total, category) => total + category.items.length, 0);
  const reviewDue = allWords.filter((word) => isReviewDue(word)).length;
  const progressContext = useProgress();
  const progress = progressContext?.progress;
  const streak = progress ? getCurrentStreak(progress.activityDates) : 0;
  const destination = progress?.lastActivity?.route || "/learn";
  const categoryProgress = GermanCurriculum.map((category) =>
    getVocabularyCategoryProgress(category, vocabulary?.wordStatuses || [], progress?.completedLessons || [])
  );
  const completedCategories = categoryProgress.filter((category) => category.complete).length;
  const startedCategories = categoryProgress.filter((category) => category.started).length;
  const grammarProgress = getGrammarProgressSummary(
    GERMAN_B1_GRAMMAR_LESSONS,
    progress?.grammarLessonStates || [],
    progress?.grammarMistakes || []
  );
  const activeMock = loadMockSession();
  const mockResumable = activeMock && ["instructions", "active"].includes(activeMock.status);

  return (
    <Container>
      <Hero>
        <Logo src={getPublicAsset("compactWordmark")} alt={t("app.name")} />
        <Heading>{t("app.name")}</Heading>
        <Descriptor>{COURSE_CONFIG.descriptor}</Descriptor>
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
          <Stat to="/learn/vocabulary"><FaBookOpen aria-hidden="true" /><strong>{availableVocabulary}</strong><span>Vocabulary available</span></Stat>
          <Stat to="/learn/my-words?filter=known"><FaCheck aria-hidden="true" /><strong>{known}</strong><span>{t("vocabulary.knownWords")}</span></Stat>
          <Stat to="/learn/my-words?filter=favorites"><FaStar aria-hidden="true" /><strong>{favorites}</strong><span>{t("vocabulary.favorites")}</span></Stat>
          <Stat to="/learn/my-words"><FaBookOpen aria-hidden="true" /><strong>{words.length}</strong><span>{t("myWords.title")}</span></Stat>
          <Stat to="/learn/vocabulary"><FaBookOpen aria-hidden="true" /><strong>{startedCategories} / {GermanCurriculum.length}</strong><span>{t("vocabulary.categoriesStarted")}</span></Stat>
          <Stat to="/learn/vocabulary?filter=learning"><FaBookOpen aria-hidden="true" /><strong>{learning}</strong><span>{t("vocabulary.learning")}</span></Stat>
          <Stat to="/learn/vocabulary"><FaCheck aria-hidden="true" /><strong>{learned}</strong><span>{t("vocabulary.learnedWords")}</span></Stat>
          <Stat to="/practice/review"><FaCheck aria-hidden="true" /><strong>{reviewDue}</strong><span>{t("vocabulary.reviewDue")}</span></Stat>
          <Stat to="/learn/vocabulary"><FaCheck aria-hidden="true" /><strong>{completedCategories} / {GermanCurriculum.length}</strong><span>{t("vocabulary.categoriesComplete")}</span></Stat>
          <Stat to="/practice"><FaCheck aria-hidden="true" /><strong>{progress?.completedExercises.length || 0}</strong><span>{t("home.practiceSessions")}</span></Stat>
          {streak > 0 && <Stat as="div"><FaCheck aria-hidden="true" /><strong>{streak}</strong><span>{t("home.dayStreak")}</span></Stat>}
        </Stats>
      </Section>

      <Section>
        <Eyebrow>Grammar progress</Eyebrow>
        <Stats>
          <Stat to="/learn/grammar"><FaBookOpen aria-hidden="true" /><strong>{grammarProgress.started} / 24</strong><span>Lessons started</span></Stat>
          <Stat to="/learn/grammar"><FaCheck aria-hidden="true" /><strong>{grammarProgress.completed} / 24</strong><span>Lessons completed</span></Stat>
          <Stat to="/learn/grammar"><FaCheck aria-hidden="true" /><strong>{grammarProgress.foundationCompleted} / 10</strong><span>Foundation reviewed</span></Stat>
          <Stat to="/learn/grammar"><FaCheck aria-hidden="true" /><strong>{grammarProgress.coreCompleted} / 14</strong><span>B1 Core completed</span></Stat>
          <Stat to="/learn/grammar/review"><FaBookOpen aria-hidden="true" /><strong>{grammarProgress.unresolvedMistakes}</strong><span>Grammar mistakes</span></Stat>
          <Stat to="/learn/grammar/review"><FaCheck aria-hidden="true" /><strong>{grammarProgress.averageMastery}%</strong><span>Average mastery</span></Stat>
        </Stats>
      </Section>

      <MyWordsLink to="/exam">
        <strong>{t("home.examReadiness")}</strong>
        <span>{t("home.examReadinessDescription")}</span>
      </MyWordsLink>
      <ExamPreparation>
        <div><strong>Exam Preparation</strong><span>{mockResumable ? `Active mock · ${Object.values(activeMock.modules).filter(({ status }) => status === "completed").length}/4 modules` : "Independent module practice and Full B1 Mock"}</span></div>
        <Snapshot aria-label="Latest exam practice snapshot">
          <span>Reading <b>{progress?.readingProgress.latestResultScore ?? "—"}</b></span>
          <span>Listening <b>{progress?.listeningProgress.latestResultScore ?? "—"}</b></span>
          <span>Writing <b>{progress?.writingProgress.simulationsCompleted || 0}</b></span>
          <span>Speaking <b>{(progress?.speakingProgress.soloSimulationsCompleted || 0) + (progress?.speakingProgress.pairSimulationsCompleted || 0)}</b></span>
        </Snapshot>
        <ExamLinks><Link to={mockResumable ? "/exam/full-mock-b1/session" : "/exam/full-mock-b1"}>{mockResumable ? "Continue active mock" : "Full B1 Practice Mock"}</Link><Link to="/exam/readiness">Readiness dashboard</Link></ExamLinks>
      </ExamPreparation>
      <Disclaimer>{t("app.disclaimer")}</Disclaimer>
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
const Descriptor = styled.p`margin: 0; color: ${theme.colors.primaryPressed}; font-size: 0.78rem; font-weight: 900; letter-spacing: 0.12em; text-transform: uppercase;`;
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
  background: ${theme.colors.navy};
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
  border: 1px solid ${theme.colors.border};
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
const ExamPreparation = styled.section`display:grid;gap:.7rem;margin-top:1rem;padding:1rem;border:1px solid ${theme.colors.border};border-radius:${theme.radius.medium};background:${theme.colors.surface};box-shadow:${theme.shadow.soft};>div>strong,>div>span{display:block;}>div>span{margin-top:.2rem;color:${theme.colors.textMuted};font-size:.82rem;}`;
const Snapshot = styled.div`display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr));gap:.35rem;span{min-inline-size:0;padding:.45rem;border-radius:${theme.radius.small};background:${theme.colors.surfaceMuted};color:${theme.colors.textMuted};font-size:.7rem;text-align:center;}b{display:block;color:${theme.colors.text};font-size:.9rem;}@media(max-width:24rem){grid-template-columns:repeat(2,minmax(0,1fr));}`;
const ExamLinks = styled.div`display:flex!important;flex-wrap:wrap;gap:.45rem;a{min-block-size:2.5rem;display:inline-flex;align-items:center;padding:.55rem .7rem;border-radius:${theme.radius.small};background:${theme.colors.primarySoft};color:${theme.colors.primaryPressed};font-size:.8rem;font-weight:900;text-decoration:none;}`;
const Disclaimer = styled.p`margin: 0.9rem 0 0; color: ${theme.colors.textMuted}; font-size: 0.72rem; line-height: 1.45; text-align: center;`;
