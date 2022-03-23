import React from "react";
import { useSpeechSynthesis } from "react-speech-kit";
import Nav from "./components/Nav";
import Home from "./components/screens/Home";
import Lesson from "./components/screens/Lesson";

function App() {
  useSpeechSynthesis();
  return <Nav />;
}

export default App;
