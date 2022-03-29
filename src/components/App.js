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
import { Lesson1 } from "../data/data";
import { ChoosePair } from "../screen/pair/ChoosePair";
import { Pair } from "../screen/pair/Pair";
function App() {
  useSpeechSynthesis();
  const data = [Lesson1];
  return (
    <>
      <Nav />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="chooselesson" element={<ChooseLesson data={data} />} />
          <Route path="chooselesson/:userId" element={<Lesson data={data} />} />
          <Route path="choosepair" element={<ChoosePair data={data} />} />
          <Route path="choosepair/:userId" element={<Pair data={data} />} />
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
