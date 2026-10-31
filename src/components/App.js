import React from "react";
import "../App.css";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import Nav from "./nav/Nav";
import { useSpeechSynthesis } from "react-speech-kit";
import { Home } from "../screen/home/Home";
import { Layout } from "./nav/Layout";
import { NoMatch } from "./nav/NoMatch";
import { Lesson } from "../screen/lesson/Lesson";
import { GermanCurriculum } from "../data/vocabulary/curriculum";
import { ChoosePair } from "../screen/pair/ChoosePair";
import { Pair } from "../screen/pair/Pair";
import { ChooseWrite } from "../screen/write/ChooseWrite";
import { Write } from "../screen/write/Write";
import { ChooseCards } from "../screen/cards/ChooseCards";
import { Cards } from "../screen/cards/Cards";
import { ChooseTest } from "../screen/test/ChooseTest";
import { Test } from "../screen/test/Test";
import { ChooseQuiz } from "../screen/quiz/ChooseQuiz";
import { Quiz } from "../screen/quiz/Quiz";
import { Tests } from "../data/test";
import { useMyWords } from "../i18n/MyWordsProvider";
import { MyWords } from "../screen/myWords/MyWords";
import { UpdateNotification } from "./UpdateNotification";
import { Practice } from "../screen/practice/Practice";
import { Review } from "../screen/review/Review";
import { useProgress } from "../i18n/ProgressProvider";
import { Onboarding } from "./Onboarding";
import { Learn } from "../screen/learn/Learn";
import { Exam } from "../screen/exam/Exam";
import { ExamModule } from "../screen/exam/ExamModule";
import { VocabularyLibrary } from "../screen/learn/VocabularyLibrary";
import { GermanGrammarList } from "../screen/grammar/GermanGrammarList";
import { GermanGrammarLesson } from "../screen/grammar/GermanGrammarLesson";
import { GermanGrammarPractice } from "../screen/grammar/GermanGrammarPractice";
import { GrammarReview } from "../screen/grammar/GrammarReview";
import { GrammarDiagnostic } from "../screen/grammar/GrammarDiagnostic";
import { GrammarPracticeHub } from "../screen/grammar/GrammarPracticeHub";
import { ReadingHome } from "../exam/reading/ReadingHome";
import { ReadingSession } from "../exam/reading/ReadingSession";
import { ListeningHome } from "../exam/listening/ListeningHome";
import { ListeningSession } from "../exam/listening/ListeningSession";
import { WritingHome } from "../exam/writing/WritingHome";
import { WritingSession } from "../exam/writing/WritingSession";
import { WritingPhraseBank } from "../exam/writing/WritingPhraseBank";
import { SpeakingHome } from "../exam/speaking/SpeakingHome";
import { SpeakingSession } from "../exam/speaking/SpeakingSession";
import { MockB1Home } from "../exam/mock/MockB1Home";
import { MockB1Session } from "../exam/mock/MockB1Session";
import { ReadinessDashboard } from "../exam/mock/ReadinessDashboard";
import { Privacy } from "../screen/privacy/Privacy";

function App() {
  useSpeechSynthesis();
  const { customWords, curriculumWords } = useMyWords();
  const progressContext = useProgress();
  const customLesson = {
    id: "my-words",
    titleKey: "myWords.title",
    descriptionKey: "myWords.description",
    category: "custom",
    items: customWords,
  };
  const data = GermanCurriculum.map((lesson) => ({
    ...lesson,
    items: lesson.items.map((item) =>
      curriculumWords.find((word) => word.id === item.id) || item
    ),
  }));
  const exerciseData = [...data, customLesson];
  if (progressContext && !progressContext.progress.onboardingComplete) {
    return <Onboarding />;
  }
  return (
    <>
      <Nav />
      <UpdateNotification />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="learn" element={<Learn />} />
          <Route path="learn/vocabulary" element={<VocabularyLibrary data={data} />} />
          <Route path="learn/vocabulary/:lessonId" element={<Lesson data={data} />} />
          <Route path="learn/grammar" element={<GermanGrammarList />} />
          <Route path="learn/grammar/diagnostic" element={<GrammarDiagnostic />} />
          <Route path="learn/grammar/review" element={<GrammarReview />} />
          <Route path="learn/grammar/:grammarLessonId/practice" element={<GermanGrammarPractice />} />
          <Route path="learn/grammar/:grammarLessonId" element={<GermanGrammarLesson />} />
          <Route path="learn/my-words" element={<MyWords />} />
          <Route path="practice" element={<Practice />} />
          <Route path="practice/pair" element={<ChoosePair data={exerciseData} />} />
          <Route path="practice/pair/:lessonId" element={<Pair data={exerciseData} />} />
          <Route path="practice/spelling" element={<ChooseWrite data={exerciseData} />} />
          <Route path="practice/spelling/:lessonId" element={<Write data={exerciseData} />} />
          <Route path="practice/cards" element={<ChooseCards data={exerciseData} />} />
          <Route path="practice/cards/:lessonId" element={<Cards data={exerciseData} />} />
          <Route path="practice/test" element={<ChooseTest data={Tests} />} />
          <Route path="practice/test/:lessonId" element={<Test data={Tests} />} />
          <Route path="practice/quiz" element={<ChooseQuiz data={exerciseData} />} />
          <Route path="practice/quiz/:lessonId" element={<Quiz data={exerciseData} />} />
          <Route path="practice/review" element={<Review />} />
          <Route path="practice/grammar" element={<GrammarPracticeHub />} />
          <Route path="practice/grammar/review" element={<GrammarReview />} />
          <Route path="practice/writing-phrases" element={<WritingPhraseBank />} />
          <Route path="exam" element={<Exam />} />
          <Route path="exam/reading" element={<ReadingHome />} />
          <Route path="exam/reading/practice/:partNumber" element={<ReadingSession mode="practice" />} />
          <Route path="exam/reading/simulation" element={<ReadingSession mode="simulation" />} />
          <Route path="exam/listening" element={<ListeningHome />} />
          <Route path="exam/listening/practice/:partNumber" element={<ListeningSession mode="practice" />} />
          <Route path="exam/listening/simulation" element={<ListeningSession mode="simulation" />} />
          <Route path="exam/writing" element={<WritingHome />} />
          <Route path="exam/writing/practice/:taskNumber" element={<WritingSession mode="practice" />} />
          <Route path="exam/writing/simulation" element={<WritingSession mode="simulation" />} />
          <Route path="exam/speaking" element={<SpeakingHome />} />
          <Route path="exam/speaking/practice/:partNumber" element={<SpeakingSession mode="practice" />} />
          <Route path="exam/speaking/solo-simulation" element={<SpeakingSession mode="solo-simulation" />} />
          <Route path="exam/speaking/pair-simulation" element={<SpeakingSession mode="pair-simulation" />} />
          <Route path="exam/full-mock-b1" element={<MockB1Home />} />
          <Route path="exam/full-mock-b1/session" element={<MockB1Session />} />
          <Route path="exam/readiness" element={<ReadinessDashboard />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="exam/:moduleId" element={<ExamModule />} />
          <Route path="my-words" element={<Navigate to="/learn/my-words" replace />} />
          <Route path="review" element={<Navigate to="/practice/review" replace />} />
          <Route path="grammar/*" element={<Navigate to="/learn/grammar" replace />} />
          <Route path="exam-prep/*" element={<Navigate to="/exam" replace />} />
          <Route path="chooselesson" element={<Navigate to="/learn/vocabulary" replace />} />
          <Route path="chooselesson/:lessonId" element={<LegacyRedirect prefix="/learn/vocabulary" />} />
          <Route path="choosepair" element={<Navigate to="/practice/pair" replace />} />
          <Route path="choosepair/:lessonId" element={<LegacyRedirect prefix="/practice/pair" />} />
          <Route path="choosewrite" element={<Navigate to="/practice/spelling" replace />} />
          <Route path="choosewrite/:lessonId" element={<LegacyRedirect prefix="/practice/spelling" />} />
          <Route path="choosecards" element={<Navigate to="/practice/cards" replace />} />
          <Route path="choosecards/:lessonId" element={<LegacyRedirect prefix="/practice/cards" />} />
          <Route path="choosetest" element={<Navigate to="/practice/test" replace />} />
          <Route path="choosetest/:lessonId" element={<LegacyRedirect prefix="/practice/test" />} />
          <Route path="choosequiz" element={<Navigate to="/practice/quiz" replace />} />
          <Route path="choosequiz/:lessonId" element={<LegacyRedirect prefix="/practice/quiz" />} />
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </>
  );
}

const LegacyRedirect = ({ prefix }) => {
  const { lessonId } = useParams();
  return <Navigate to={`${prefix}/${lessonId}`} replace />;
};

export default App;
