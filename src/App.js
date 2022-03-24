import React from "react";
import { useSpeechSynthesis } from "react-speech-kit";
import Home from "./components/screens/Home";
import Lesson from "./components/screens/Lesson";
import Write from "./components/screens/Write";
import Cards from "./components/screens/Cards";
import Test from "./components/screens/Test";
import Quiz from "./components/screens/Quiz";
import Nav from "./components/Nav";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  useSpeechSynthesis();
  return (
    <Router basename="pwagerman">
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/lesson">
          <Lesson />
        </Route>
        <Route path="/write">
          <Write />
        </Route>
        <Route path="/cards">
          <Cards />
        </Route>
        <Route path="/test">
          <Test />
        </Route>
        <Route path="/quiz">
          <Quiz />
        </Route>
      </Switch>
      <Nav />
    </Router>
  );
}

export default App;
