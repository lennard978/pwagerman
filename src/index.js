import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { LanguageProvider } from "./i18n/LanguageProvider";
import { MyWordsProvider } from "./i18n/MyWordsProvider";
import { setWaitingRegistration } from "./services/serviceWorkerUpdate";
import { ProgressProvider } from "./i18n/ProgressProvider";

ReactDOM.render(
  <LanguageProvider>
    <MyWordsProvider>
      <ProgressProvider>
        <BrowserRouter basename="/pwagerman">
          <App />
        </BrowserRouter>
      </ProgressProvider>
    </MyWordsProvider>
  </LanguageProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register({
  onUpdate: setWaitingRegistration,
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
