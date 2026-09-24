import React from "react";
import "../App.css";
import { Route, Routes } from "react-router-dom";
import Nav from "./nav/Nav";
import { useSpeechSynthesis } from "react-speech-kit";
import { Home } from "../screen/home/Home";
import { Layout } from "./nav/Layout";
import { NoMatch } from "./nav/NoMatch";
import { ChooseLesson } from "../screen/lesson/ChooseLesson";
import { Lesson } from "../screen/lesson/Lesson";
import { Curriculum } from "../data/data";
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

function App() {
  useSpeechSynthesis();
  const { words, curriculumWords } = useMyWords();
  const customLesson = {
    id: "my-words",
    titleKey: "myWords.title",
    descriptionKey: "myWords.description",
    category: "custom",
    items: words,
  };
  const data = Curriculum.map((lesson) => ({
    ...lesson,
    items: lesson.items.map((item) =>
      curriculumWords.find((word) => word.id === item.id) || item
    ),
  }));
  const exerciseData = [...data, customLesson];
  return (
    <>
      <Nav />
      <UpdateNotification />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="learn" element={<ChooseLesson data={data} />} />
          <Route path="practice" element={<Practice />} />
          <Route path="my-words" element={<MyWords />} />
          <Route path="chooselesson" element={<ChooseLesson data={data} />} />
          <Route path="chooselesson/:userId" element={<Lesson data={data} />} />
          <Route path="choosepair" element={<ChoosePair data={exerciseData} />} />
          <Route path="choosepair/:userId" element={<Pair data={exerciseData} />} />
          <Route path="choosewrite" element={<ChooseWrite data={exerciseData} />} />
          <Route path="choosewrite/:userId" element={<Write data={exerciseData} />} />
          <Route path="choosecards" element={<ChooseCards data={exerciseData} />} />
          <Route path="choosecards/:userId" element={<Cards data={exerciseData} />} />
          <Route path="choosetest" element={<ChooseTest data={Tests} />} />
          <Route path="choosetest/:userId" element={<Test data={Tests} />} />
          <Route path="choosequiz" element={<ChooseQuiz data={exerciseData} />} />
          <Route path="choosequiz/:userId" element={<Quiz data={exerciseData} />} />
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
