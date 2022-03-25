import React from "react";
import { useSpeechSynthesis } from "react-speech-kit";
import Home from "./screens/Home";
import Lesson from "./screens/Lesson";
import Write from "./screens/Write";
import Cards from "./screens/Cards";
import Test from "./screens/Test";
import Quiz from "./screens/Quiz";
import Nav from "./Nav";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Pair from "./screens/Pair";

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
        <Route path="/pair">
          <Pair />
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
