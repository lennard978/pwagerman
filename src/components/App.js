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
import {
  Lesson1,
  Lesson2,
  Lesson3,
  Lesson4,
  Lesson5,
  Lesson6,
} from "../data/data";
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
import { Test1, Test2, Test3 } from "../data/test";
import { useMyWords } from "../i18n/MyWordsProvider";
import { MyWords } from "../screen/myWords/MyWords";

function App() {
  useSpeechSynthesis();
  const { words } = useMyWords();
  const customLesson = {
    id: "my-words",
    titleKey: "myWords.title",
    descriptionKey: "myWords.description",
    category: "custom",
    items: words,
  };
  const data = [Lesson1, Lesson2, Lesson3, Lesson4, Lesson5, Lesson6, customLesson];
  const test = [Test1, Test2, Test3];
  return (
    <>
      <Nav />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="my-words" element={<MyWords />} />
          <Route path="chooselesson" element={<ChooseLesson data={data} />} />
          <Route path="chooselesson/:userId" element={<Lesson data={data} />} />
          <Route path="choosepair" element={<ChoosePair data={data} />} />
          <Route path="choosepair/:userId" element={<Pair data={data} />} />
          <Route path="choosewrite" element={<ChooseWrite data={data} />} />
          <Route path="choosewrite/:userId" element={<Write data={data} />} />
          <Route path="choosecards" element={<ChooseCards data={data} />} />
          <Route path="choosecards/:userId" element={<Cards data={data} />} />
          <Route path="choosetest" element={<ChooseTest data={test} />} />
          <Route path="choosetest/:userId" element={<Test data={test} />} />
          <Route path="choosequiz" element={<ChooseQuiz data={data} />} />
          <Route path="choosequiz/:userId" element={<Quiz data={data} />} />
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
