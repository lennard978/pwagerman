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
import { Lesson1, Lesson2, Lesson3 } from "../data/data";
function App() {
  useSpeechSynthesis();
  const data = [Lesson1, Lesson2, Lesson3];
  return (
    <>
      <Nav />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="chooselesson" element={<ChooseLesson data={data} />} />
          <Route path="chooselesson/:userId" element={<Lesson data={data} />} />
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
