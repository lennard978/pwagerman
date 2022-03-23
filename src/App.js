import React from "react";
import { useSpeechSynthesis } from "react-speech-kit";
import Home from "./components/screens/Home";
import Lesson from "./components/screens/Lesson";
import Nav from "./components/Nav";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
function App() {
  useSpeechSynthesis();
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/lesson">
          <Lesson />
        </Route>
      </Switch>
      <Nav />
    </Router>
  );
}

export default App;
