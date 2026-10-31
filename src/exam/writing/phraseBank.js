export const writingPhraseBank = Object.freeze([
  Object.freeze({
    id: "personal-email",
    title: "Personal email",
    groups: Object.freeze([
      ["Greeting", "Hallo … / Liebe … / Lieber …"],
      ["Reacting", "Ich habe mich sehr über deine Nachricht gefreut."],
      ["Explaining", "Der Grund dafür ist, dass …"],
      ["Suggesting", "Wie wäre es, wenn wir …?"],
      ["Question", "Was hältst du davon?"],
      ["Closing", "Liebe Grüße / Bis bald"],
    ]),
    grammarRefs: ["de-b1-main-clause-connectors", "de-b1-subordinate-clauses"],
  }),
  Object.freeze({
    id: "opinion",
    title: "Opinion contribution",
    groups: Object.freeze([
      ["Position", "Meiner Meinung nach …"],
      ["Reason", "Ein wichtiger Grund dafür ist …"],
      ["Example", "Ein gutes Beispiel dafür ist …"],
      ["Contrast", "Einerseits …, andererseits …"],
      ["Conclusion", "Insgesamt bin ich deshalb der Ansicht, dass …"],
    ]),
    grammarRefs: ["de-b1-cohesive-connectors", "de-b1-subordinate-clauses"],
  }),
  Object.freeze({
    id: "formal-email",
    title: "Formal email",
    groups: Object.freeze([
      ["Greeting", "Sehr geehrte Frau … / Sehr geehrter Herr …"],
      ["Request", "Könnten Sie mir bitte mitteilen, …?"],
      ["Apology", "Ich bitte Sie um Entschuldigung, dass …"],
      ["Explanation", "Leider kann ich …, weil …"],
      ["Rescheduling", "Wäre ein Termin am … möglich?"],
      ["Closing", "Mit freundlichen Grüßen"],
    ]),
    grammarRefs: ["de-b1-konjunktiv-ii", "de-b1-indirect-questions"],
  }),
]);
