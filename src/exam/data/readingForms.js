import { READING_PART_CONFIG } from "../config/goetheB1";
import { choiceOptions, makeForm, makeItem, makePart, matchingOptions, positionOptions, trueFalseOptions } from "./helpers";

const configFor = (number) => READING_PART_CONFIG[number - 1];
const itemId = (formId, number) => `${formId}-item-${String(number).padStart(2, "0")}`;

const buildPart1 = (formId, text, rows) => makePart({
  formId,
  ...configFor(1),
  instructions: "Lesen Sie den persönlichen Text. Entscheiden Sie bei jeder Aussage: Richtig oder Falsch?",
  texts: [text],
  items: rows.map(([prompt, answer, explanation, evidence, skillTags], index) => makeItem({
    id: itemId(formId, index + 1), number: index + 1, type: "true-false", prompt,
    options: trueFalseOptions(), correctAnswer: answer ? "true" : "false", explanation, evidence,
    textRef: text.id, skillTags, grammarRefs: ["de-b1-perfekt", "de-b1-temporal-clauses"],
  })),
});

const buildPart2 = (formId, texts) => makePart({
  formId,
  ...configFor(2),
  instructions: "Lesen Sie die beiden Texte. Wählen Sie zu jeder Aufgabe die passende Antwort a, b oder c.",
  texts: texts.map(({ id, title, body }) => ({ id, title, body })),
  items: texts.flatMap((text, textIndex) => text.questions.map((question, index) => makeItem({
    id: itemId(formId, 7 + textIndex * 3 + index), number: 7 + textIndex * 3 + index,
    type: "multiple-choice", prompt: question.prompt, options: choiceOptions(...question.options),
    correctAnswer: question.answer, explanation: question.explanation, evidence: question.evidence,
    textRef: text.id, skillTags: question.skillTags, grammarRefs: question.grammarRefs || [],
  }))),
});

const buildPart3 = (formId, situations, advertisements) => {
  const options = matchingOptions(advertisements);
  return makePart({
    formId,
    ...configFor(3),
    instructions: "Welche Anzeige passt zu welcher Situation? Jede Anzeige darf nur einmal verwendet werden. Wenn keine Anzeige passt, wählen Sie 0.",
    advertisements,
    items: situations.map(([prompt, answer, explanation, evidence, skillTags], index) => makeItem({
      id: itemId(formId, 13 + index), number: 13 + index, type: "matching", prompt,
      options, correctAnswer: answer, explanation, evidence, textRef: null, skillTags: [...new Set([...skillTags, "matching"])],
      grammarRefs: ["de-b1-relative-clauses"],
    })),
  });
};

const buildPart4 = (formId, theme, comments) => {
  const texts = comments.map(({ id, speaker, body }) => ({ id, title: speaker, body }));
  return makePart({
    formId,
    ...configFor(4),
    title: theme,
    instructions: `Lesen Sie die Meinungen zum Thema „${theme}“. Ist die Person dafür oder dagegen?`,
    texts,
    items: comments.map((comment, index) => makeItem({
      id: itemId(formId, 20 + index), number: 20 + index, type: "binary-position",
      prompt: `Welche Position vertritt ${comment.speaker}?`, options: positionOptions(),
      correctAnswer: comment.answer, explanation: comment.explanation, evidence: comment.evidence,
      textRef: comment.id, skillTags: ["attitude", "opinion"], grammarRefs: ["de-b1-cohesive-connectors", "de-b1-subordinate-clauses"],
    })),
  });
};

const buildPart5 = (formId, text, questions) => makePart({
  formId,
  ...configFor(5),
  instructions: "Lesen Sie die Regeln. Wählen Sie zu jeder Aufgabe die passende Antwort a, b oder c.",
  texts: [text],
  items: questions.map((question, index) => makeItem({
    id: itemId(formId, 27 + index), number: 27 + index, type: "multiple-choice",
    prompt: question.prompt, options: choiceOptions(...question.options), correctAnswer: question.answer,
    explanation: question.explanation, evidence: question.evidence, textRef: text.id,
    skillTags: ["rules", ...(question.skillTags || [])], grammarRefs: ["de-b1-modal-verbs", "de-b1-passive-voice"],
  })),
});

const form1Id = "de-b1-reading-form-001";
const form1Part1Text = {
  id: "f1-repair-cafe",
  title: "Ein Samstag im Reparaturcafé",
  body: `Letzten Samstag wollte ich eigentlich nur kurz zum Markt fahren. Vor dem Nachbarschaftshaus entdeckte ich aber ein neues Schild: „Reparaturcafé – heute geöffnet“. Mein alter Toaster stand seit Wochen kaputt im Keller, also holte ich ihn spontan. Im großen Raum warteten schon viele Leute mit Lampen, Radios und kleinen Küchengeräten. Eine pensionierte Elektrikerin namens Gisela zeigte mir, wie man das Gehäuse sicher öffnet. Der Fehler war überraschend klein: Ein Kabel hatte sich gelöst. Ich durfte es unter ihrer Anleitung selbst befestigen. Dafür verlangte das Team kein Geld; am Ausgang stand nur eine Dose für freiwillige Spenden.\n\nWährend wir arbeiteten, lernte ich auch Karim aus dem Nachbarhaus kennen. Er reparierte sein Fahrradlicht und erzählte von einer Tauschbörse, die nächsten Monat stattfinden soll. Weil plötzlich starker Regen begann, blieb ich länger als geplant. Wir tranken Kaffee und sammelten Ideen für die Tauschbörse. Am Ende funktionierte mein Toaster wieder. Noch wichtiger war aber, dass ich Menschen aus meiner Straße kennenlernte, denen ich vorher nur kurz im Treppenhaus begegnet war. Ich habe mich deshalb gleich als Helfer für den nächsten Termin eingetragen. Werkzeug muss ich nicht mitbringen; das ist im Haus vorhanden.`,
};
const form1 = makeForm(form1Id, "Reading Form 1", [
  buildPart1(form1Id, form1Part1Text, [
    ["Die Erzählerin hatte den Besuch im Reparaturcafé schon mehrere Tage geplant.", false, "Der Besuch entstand spontan nach dem Marktweg.", "Sie entdeckte das Schild und holte den Toaster erst danach.", ["detail", "sequence"]],
    ["Gisela half der Erzählerin, den Toaster selbst zu reparieren.", true, "Gisela leitete die Reparatur an.", "Die Erzählerin befestigte das Kabel unter Giselas Anleitung.", ["detail"]],
    ["Für die Reparatur musste ein fester Preis bezahlt werden.", false, "Es gab keinen festen Preis.", "Nur freiwillige Spenden wurden gesammelt.", ["detail", "negation"]],
    ["Karim war wegen eines Problems mit seinem Fahrradlicht dort.", true, "Karim reparierte sein Fahrradlicht.", "Sein Reparaturgegenstand wird ausdrücklich genannt.", ["detail"]],
    ["Wegen des Wetters ging die Erzählerin früher nach Hause.", false, "Der Regen führte dazu, dass sie länger blieb.", "Sie blieb wegen des starken Regens länger als geplant.", ["cause-effect"]],
    ["Beim nächsten Termin möchte die Erzählerin im Team mithelfen.", true, "Sie meldete sich als Helferin an.", "Am Ende trug sie sich für den nächsten Termin ein.", ["inference", "intention"]],
  ]),
  buildPart2(form1Id, [
    {
      id: "f1-library-things", title: "Bibliothek verleiht jetzt auch Gegenstände",
      body: `Die Stadtbibliothek Falkenried erweitert ihr Angebot. Seit Dienstag können Mitglieder nicht nur Bücher und Filme, sondern auch selten gebrauchte Alltagsgegenstände ausleihen. Zum Start stehen eine Bohrmaschine, ein Hochdruckreiniger, zwei Nähmaschinen und mehrere Backformen bereit. Die Idee kam aus einer Umfrage: Viele Bewohner wollten Dinge nutzen, ohne sie kaufen und zu Hause lagern zu müssen.\n\nDie Ausleihe ist für Erwachsene mit gültigem Bibliotheksausweis kostenlos. Geräte können online reserviert und für höchstens sieben Tage mitgenommen werden. Vor der ersten Ausleihe eines elektrischen Geräts ist eine kurze Sicherheitseinweisung vorgeschrieben. Diese findet mittwochs und samstags statt und dauert etwa zwanzig Minuten. Bei großem Interesse will die Bibliothek das Sortiment im Frühjahr erweitern. Spenden gebrauchter Geräte nimmt sie jedoch vorerst nicht an, weil jedes Produkt technisch geprüft werden muss.`,
      questions: [
        { prompt: "Warum wurde das neue Angebot eingeführt?", options: ["Die Bibliothek hatte zu viele leere Räume.", "Eine Befragung zeigte einen Bedarf in der Bevölkerung.", "Ein Geschäft spendete alle Geräte."], answer: "b", explanation: "Die Umfrage gab den Anstoß.", evidence: "Viele Bewohner wollten Gegenstände nutzen, ohne sie zu kaufen.", skillTags: ["main-idea", "cause-effect"] },
        { prompt: "Was gilt für elektrische Geräte?", options: ["Man muss vorher an einer kurzen Einführung teilnehmen.", "Sie dürfen nur mittwochs ausgeliehen werden.", "Für sie wird immer eine Gebühr berechnet."], answer: "a", explanation: "Eine Sicherheitseinweisung ist Pflicht.", evidence: "Sie findet mittwochs und samstags statt.", skillTags: ["rules", "detail"] },
        { prompt: "Warum nimmt die Bibliothek zunächst keine Geräte als Spende an?", options: ["Es gibt bereits genug Geräte.", "Die Mitglieder haben dagegen gestimmt.", "Die technische Kontrolle wäre nötig."], answer: "c", explanation: "Die erforderliche Prüfung verhindert vorerst Spenden.", evidence: "Jedes Produkt muss technisch geprüft werden.", skillTags: ["cause-effect", "detail"] },
      ],
    },
    {
      id: "f1-night-train", title: "Mehr Nachtzüge aus der Alpenregion",
      body: `Ab Dezember verbindet ein neuer Nachtzug Innsbruck dreimal pro Woche direkt mit Brüssel. Die Bahn reagiert damit nach eigenen Angaben auf die wachsende Nachfrage nach klimafreundlichen Reisen. Der Zug startet jeweils am Abend und erreicht Brüssel am nächsten Vormittag. Reisende können zwischen Sitzplätzen, Liegewagen und privaten Schlafkabinen wählen. Fahrräder werden nur nach vorheriger Reservierung mitgenommen.\n\nIn den ersten beiden Betriebsmonaten gelten günstigere Einführungspreise. Fahrkarten sind ab kommenden Montag erhältlich, zunächst ausschließlich über die Internetseite der Bahn. An den Automaten sollen sie erst im November angeboten werden. Familienabteile gibt es in diesem Zug nicht, doch Kinder unter sechs Jahren reisen im Abteil eines Erwachsenen kostenlos. Wenn die Verbindung gut angenommen wird, ist ab dem nächsten Sommer eine tägliche Fahrt geplant.`,
      questions: [
        { prompt: "Welches Ziel verfolgt die Bahn mit der neuen Verbindung?", options: ["Sie will auf eine größere Nachfrage reagieren.", "Sie möchte Flugreisen vollständig verbieten.", "Sie ersetzt alle Züge am Tag."], answer: "a", explanation: "Die Nachfrage ist der genannte Grund.", evidence: "Die Bahn reagiert auf die wachsende Nachfrage.", skillTags: ["main-idea", "purpose"] },
        { prompt: "Wie kann man anfangs eine Fahrkarte kaufen?", options: ["Nur am Bahnhofsschalter.", "Über die Internetseite der Bahn.", "Ausschließlich im Zug."], answer: "b", explanation: "Der Verkauf beginnt online.", evidence: "Zunächst sind Tickets ausschließlich über die Internetseite erhältlich.", skillTags: ["detail", "time"] },
        { prompt: "Was könnte im nächsten Sommer passieren?", options: ["Die Verbindung könnte jeden Tag fahren.", "Fahrräder könnten kostenlos mitfahren.", "Der Zug könnte nur noch Sitzplätze haben."], answer: "a", explanation: "Eine tägliche Fahrt hängt vom Erfolg ab.", evidence: "Bei guter Annahme ist eine tägliche Fahrt geplant.", skillTags: ["condition", "inference"] },
      ],
    },
  ]),
  buildPart3(form1Id, [
    ["Mara möchte am Wochenende lernen, wie man einfache Möbel aus Holz baut.", "A", "Anzeige A bietet genau einen Möbelbaukurs am Samstag.", "Holz, Möbel und Wochenendtermin stimmen überein.", ["advertisements", "detail"]],
    ["Jonas sucht einen Abendkurs, in dem er bessere Fotos mit dem Smartphone machen kann.", "D", "Anzeige D verbindet Smartphone-Fotografie mit einem Abendtermin.", "Der Kurs beginnt donnerstags um 18.30 Uhr.", ["advertisements", "synonyms"]],
    ["Elena braucht für zwei Monate einen ruhigen Schreibtischplatz mit schnellem Internet.", "F", "Anzeige F vermietet flexible Arbeitsplätze monatsweise.", "Ruhe, Internet und kurze Vertragsdauer passen.", ["advertisements", "detail"]],
    ["Paul will Italienisch online lernen, kann aber nur früh am Morgen.", "0", "Keine Anzeige bietet einen italienischen Onlinekurs am frühen Morgen.", "Die vorhandenen Sprach- und Onlineangebote erfüllen nicht alle Bedingungen.", ["advertisements", "negation"]],
    ["Nora möchte ihre Nähmaschine reparieren lassen, ohne sie zu verschicken.", "H", "Anzeige H bietet lokale Reparaturannahme für Nähmaschinen.", "Das Gerät kann direkt in der Werkstatt abgegeben werden.", ["advertisements", "detail"]],
    ["David sucht eine betreute sportliche Aktivität zusammen mit seinem achtjährigen Sohn.", "J", "Anzeige J richtet sich an Eltern und Kinder von sieben bis zehn Jahren.", "Alter und gemeinsamer Sport passen.", ["advertisements", "constraints"]],
    ["Samira möchte lernen, wie man im Alltag weniger Lebensmittel wegwirft.", "C", "Anzeige C behandelt Resteküche und Einkaufsplanung.", "Das Ziel ist die Vermeidung von Lebensmittelabfällen.", ["advertisements", "purpose"]],
  ], [
    { id: "A", title: "Werkstatt Holz", body: "Samstags bauen Anfänger unter Anleitung ein kleines Regal oder einen Hocker. Material und Werkzeug sind im Preis enthalten." },
    { id: "B", title: "Spanisch in der Mittagspause", body: "Kurze Präsenzlektionen montags und mittwochs um 12 Uhr. Geeignet für Beschäftigte mit Grundkenntnissen." },
    { id: "C", title: "Kreative Resteküche", body: "Wie werden Brot, Gemüse und Kräuter sinnvoll weiterverwendet? Kochabend mit Tipps zur Einkaufsplanung." },
    { id: "D", title: "Bessere Handyfotos", body: "Vier Donnerstage ab 18.30 Uhr: Licht, Bildaufbau und praktische Übungen mit dem eigenen Smartphone." },
    { id: "E", title: "Gartenhilfe gesucht", body: "Privathaushalt sucht zweimal monatlich Unterstützung bei Hecken und Rasen. Erfahrung und eigenes Auto erwünscht." },
    { id: "F", title: "Schreibtisch auf Zeit", body: "Ruhiger Arbeitsplatz, schnelles WLAN und Drucker. Monatsverträge ab vier Wochen, täglich von 7 bis 22 Uhr zugänglich." },
    { id: "G", title: "Englisch online am Abend", body: "Live-Unterricht für Fortgeschrittene, dienstags um 20 Uhr. Acht Termine in einer kleinen Gruppe." },
    { id: "H", title: "Nähtechnik Berger", body: "Wir warten und reparieren Haushaltsnähmaschinen. Persönliche Annahme in unserer Werkstatt, keine Postsendungen." },
    { id: "I", title: "Lauftreff am Fluss", body: "Kostenloses Training für Erwachsene, mittwochs 6.30 Uhr. Strecke etwa acht Kilometer." },
    { id: "J", title: "Familien-Klettern", body: "Betreuter Einstieg für ein Elternteil mit Kind von sieben bis zehn Jahren. Sonntags in der Sporthalle." },
  ]),
  buildPart4(form1Id, "Autofreie Innenstädte", [
    { id: "f1-c20", speaker: "Lena", body: "Seit die Hauptstraße gesperrt ist, sitze ich viel lieber vor dem Café. Die Luft ist besser und Kinder können sicherer laufen. Lieferzonen am Morgen reichen meiner Meinung nach aus.", answer: "yes", explanation: "Lena nennt mehrere Vorteile und unterstützt die Maßnahme.", evidence: "Sie empfindet die Luft und Sicherheit als besser." },
    { id: "f1-c21", speaker: "Robert", body: "Meine Werkstatt lebt von Kunden aus dem Umland. Viele kommen mit schweren Geräten und können nicht weit tragen. Ohne erreichbare Parkplätze verliere ich Aufträge.", answer: "no", explanation: "Robert sieht wirtschaftliche und praktische Nachteile.", evidence: "Er befürchtet, Kunden und Aufträge zu verlieren." },
    { id: "f1-c22", speaker: "Ayse", body: "Zuerst war ich skeptisch. Inzwischen fährt der Bus häufiger, und meine Einkäufe werden auf Wunsch geliefert. Deshalb sollte das Zentrum dauerhaft ohne privaten Autoverkehr bleiben.", answer: "yes", explanation: "Trotz früherer Skepsis befürwortet Ayse die dauerhafte Regelung.", evidence: "Sie fordert ausdrücklich ein dauerhaft autofreies Zentrum." },
    { id: "f1-c23", speaker: "Markus", body: "Ein Verbot klingt einfach, trifft aber Menschen mit eingeschränkter Mobilität besonders. Ausnahmen lösen das Problem nicht immer. Die Stadt sollte erst bessere Alternativen schaffen.", answer: "no", explanation: "Markus hält ein Verbot zum jetzigen Zeitpunkt für problematisch.", evidence: "Er verlangt zunächst bessere Alternativen." },
    { id: "f1-c24", speaker: "Sophie", body: "Auf dem früheren Parkplatz findet nun jeden Freitag ein kleiner Markt statt. Dort treffe ich Nachbarn und kaufe regionale Produkte. So gewinnt das Zentrum deutlich an Lebensqualität.", answer: "yes", explanation: "Sophie bewertet die neue Nutzung positiv.", evidence: "Sie spricht von mehr Lebensqualität." },
    { id: "f1-c25", speaker: "Daniel", body: "Die Idee ist gut gemeint, aber die Umgehungsstraßen sind jetzt ständig voll. Lärm und Abgase wurden nur in andere Wohnviertel verschoben. Das kann keine faire Lösung sein.", answer: "no", explanation: "Daniel lehnt die Umsetzung wegen der Verkehrsverlagerung ab.", evidence: "Er nennt sie ausdrücklich keine faire Lösung." },
    { id: "f1-c26", speaker: "Mina", body: "Ich erledige Wege im Zentrum inzwischen mit dem Rad. Sichere Stellplätze und breite Wege machen das angenehm. Auch Besucher ohne Auto finden mit Bahn und Bus leicht hierher.", answer: "yes", explanation: "Mina beschreibt die autofreie Innenstadt als gut erreichbar und angenehm.", evidence: "Sie lobt Radwege und öffentlichen Verkehr." },
  ]),
  buildPart5(form1Id, {
    id: "f1-community-rules", title: "Hausordnung des Kulturhauses West",
    body: `Das Kulturhaus West steht Vereinen und privaten Gruppen täglich von 8 bis 22 Uhr offen. Räume müssen spätestens drei Werktage vorher online reserviert werden. Eine Reservierung gilt erst nach der Bestätigung durch das Büro. Schlüssel werden am Empfang gegen ein Ausweisdokument ausgegeben und müssen direkt nach der Veranstaltung zurückgebracht werden.\n\nSpeisen dürfen nur in der Gemeinschaftsküche und im großen Saal angeboten werden. In den Seminarräumen sind ausschließlich Getränke in verschließbaren Flaschen erlaubt. Wer die Küche nutzt, reinigt Arbeitsflächen und Geschirr selbst. Abfälle werden getrennt in die gekennzeichneten Behälter geworfen. Kerzen, offenes Feuer und private Heizgeräte sind im gesamten Gebäude verboten.\n\nNach 20 Uhr sind Fenster und Außentüren geschlossen zu halten, damit Anwohner nicht gestört werden. Musikveranstaltungen benötigen eine zusätzliche Genehmigung. Dekoration darf mit den vorhandenen Klemmen befestigt werden; Klebeband, Nägel und Schrauben sind nicht erlaubt. Schäden sind sofort am Empfang zu melden. Gruppen, die einen Raum nicht benötigen, müssen spätestens 24 Stunden vorher absagen. Sonst kann eine Ausfallgebühr entstehen. Vor dem Verlassen werden Licht und technische Geräte ausgeschaltet.`,
  }, [
    { prompt: "Wann ist ein Raum sicher reserviert?", options: ["Sobald das Onlineformular abgeschickt wurde.", "Nachdem das Büro die Reservierung bestätigt hat.", "Erst wenn die Gruppe den Schlüssel abholt."], answer: "b", explanation: "Die Bestätigung macht die Reservierung gültig.", evidence: "Das steht ausdrücklich im ersten Absatz.", skillTags: ["sequence"] },
    { prompt: "Was ist in den Seminarräumen erlaubt?", options: ["Essen auf kleinen Tellern.", "Getränke in geschlossenen Flaschen.", "Kerzen für eine ruhige Atmosphäre."], answer: "b", explanation: "Nur verschließbare Getränke sind zugelassen.", evidence: "Speisen und offenes Feuer sind dort nicht erlaubt.", skillTags: ["permission", "negation"] },
    { prompt: "Wie darf Dekoration angebracht werden?", options: ["Mit den Klemmen des Hauses.", "Mit selbst mitgebrachtem Klebeband.", "Mit kleinen Nägeln."], answer: "a", explanation: "Nur die vorhandenen Klemmen sind zugelassen.", evidence: "Klebeband, Nägel und Schrauben werden ausgeschlossen.", skillTags: ["detail"] },
    { prompt: "Was kann bei einer zu späten Absage passieren?", options: ["Die Gruppe verliert dauerhaft den Zugang.", "Das Büro behält den Ausweis.", "Es kann eine Gebühr verlangt werden."], answer: "c", explanation: "Eine Ausfallgebühr ist möglich.", evidence: "Die Frist beträgt 24 Stunden.", skillTags: ["condition", "cause-effect"] },
  ]),
]);

const form2Id = "de-b1-reading-form-002";
const form2Part1Text = {
  id: "f2-balcony-project",
  title: "Unser gemeinsamer Hofgarten",
  body: `Als ich vor einem Jahr in meine neue Wohnung zog, kannte ich in der Stadt fast niemanden. Mein Balkon war winzig und lag den ganzen Tag im Schatten. Trotzdem wollte ich gern Tomaten und Kräuter anbauen. Im Hausflur hing eines Tages ein Zettel von unserer Nachbarin Beate. Sie suchte Menschen, die den ungenutzten Hof gemeinsam begrünen wollten. Beim ersten Treffen kamen nur fünf Personen, und der Hof sah wenig einladend aus: überall alte Fahrräder, kaputte Kisten und harter Boden.\n\nWir begannen nicht sofort mit dem Pflanzen. Zuerst fragten wir die Hausverwaltung um Erlaubnis und zeichneten einen Plan. Die Verwaltung bezahlte später die Erde, aber Beete, Samen und Werkzeug mussten wir selbst organisieren. Ein lokaler Baumarkt schenkte uns Holzreste, aus denen wir an zwei Samstagen Hochbeete bauten. Ich hatte so etwas noch nie gemacht und war am Abend ziemlich müde, aber stolz.\n\nInzwischen arbeiten mehr als zwanzig Bewohner mit. Jeder übernimmt eine kleine Aufgabe; niemand hat ein eigenes Beet. Im Sommer ernteten wir mehr Salat und Zucchini, als wir essen konnten. Deshalb veranstalteten wir ein Hoffest und kochten gemeinsam. Sogar die ältere Frau aus dem Erdgeschoss, die selten ihre Wohnung verlässt, kam dazu. Der Garten liefert also nicht nur Gemüse. Er hat aus einem anonymen Haus eine kleine Gemeinschaft gemacht. Für den nächsten Frühling planen wir Blumen, die besonders bienenfreundlich sind.`,
};
const form2 = makeForm(form2Id, "Reading Form 2", [
  buildPart1(form2Id, form2Part1Text, [
    ["Die Erzählerin konnte auf ihrem Balkon problemlos Gemüse anbauen.", false, "Der Balkon war klein und schattig.", "Diese Bedingungen waren für den gewünschten Anbau ungünstig.", ["detail", "inference"]],
    ["Beate machte den Vorschlag für einen gemeinsamen Garten.", true, "Ihr Zettel löste das Projekt aus.", "Beate suchte dafür weitere Bewohner.", ["detail", "sequence"]],
    ["Vor dem Pflanzen holte die Gruppe die Zustimmung der Hausverwaltung ein.", true, "Die Erlaubnis war der erste organisatorische Schritt.", "Zunächst wurde gefragt und geplant.", ["sequence"]],
    ["Die Hausverwaltung bezahlte das gesamte Material für den Garten.", false, "Sie finanzierte nur die Erde.", "Beete, Samen und Werkzeug organisierte die Gruppe selbst.", ["detail", "negation"]],
    ["Die Bewohner teilen sich die Verantwortung für alle Beete.", true, "Niemand besitzt ein eigenes Beet.", "Jeder übernimmt eine kleine Aufgabe im Gemeinschaftsgarten.", ["inference", "detail"]],
    ["Im nächsten Jahr möchte die Gruppe vor allem mehr Zucchini pflanzen.", false, "Geplant sind bienenfreundliche Blumen.", "Zucchini wird nur als frühere Ernte erwähnt.", ["time", "detail"]],
  ]),
  buildPart2(form2Id, [
    {
      id: "f2-four-day-week", title: "Vier Tage Arbeit, fünf Tage Leistung?",
      body: `Eine kleine Softwarefirma in Köln hat sechs Monate lang die Vier-Tage-Woche getestet. Die 32 Beschäftigten erhielten weiterhin ihr volles Gehalt, arbeiteten aber freitags nicht. Dafür wurden Besprechungen auf höchstens 30 Minuten begrenzt und interne E-Mails reduziert. Kunden konnten die Firma dennoch an fünf Tagen erreichen, weil sich zwei Teams mit ihrem freien Tag abwechselten.\n\nNach dem Versuch blieb die Zahl der abgeschlossenen Projekte fast gleich. Gleichzeitig meldeten sich Beschäftigte seltener krank und bewerteten ihre Zufriedenheit deutlich besser. Einige hatten jedoch Schwierigkeiten, die Aufgaben in kürzerer Zeit zu erledigen. Die Firma führt das Modell deshalb nicht unverändert fort. Ab Januar können Teams selbst wählen, ob sie vier längere oder fünf normale Arbeitstage möchten. Die Geschäftsleitung will die Ergebnisse nach einem weiteren Jahr erneut prüfen.`,
      questions: [
        { prompt: "Wie blieb die Firma für Kunden an fünf Tagen erreichbar?", options: ["Alle arbeiteten freitags von zu Hause.", "Zwei Teams hatten an unterschiedlichen Tagen frei.", "Ein externer Dienst beantwortete alle Anfragen."], answer: "b", explanation: "Die freien Tage wurden zwischen Teams verteilt.", evidence: "Zwei Teams wechselten sich mit dem freien Tag ab.", skillTags: ["detail", "organization"] },
        { prompt: "Welches Ergebnis hatte der Versuch?", options: ["Es wurden wesentlich mehr Projekte beendet.", "Die Krankmeldungen nahmen zu.", "Die Zufriedenheit der Beschäftigten stieg."], answer: "c", explanation: "Die Zufriedenheit wurde deutlich besser bewertet.", evidence: "Auch die Krankmeldungen gingen zurück.", skillTags: ["result", "detail"] },
        { prompt: "Was ändert sich ab Januar?", options: ["Die Teams können zwischen zwei Arbeitszeitmodellen wählen.", "Alle müssen wieder fünf Tage arbeiten.", "Das volle Gehalt wird abgeschafft."], answer: "a", explanation: "Die Wahl liegt künftig bei den Teams.", evidence: "Vier längere oder fünf normale Arbeitstage sind möglich.", skillTags: ["time", "contrast"] },
      ],
    },
    {
      id: "f2-village-bus", title: "Dorfbus fährt nur auf Bestellung",
      body: `In der österreichischen Gemeinde Sonnberg fährt seit März ein elektrischer Kleinbus ohne festen Fahrplan. Wer mitfahren möchte, bestellt die Fahrt mindestens eine Stunde vorher per App oder Telefon. Eine Software verbindet ähnliche Wünsche und berechnet eine passende Route. So sollen auch abgelegene Ortsteile besser erreichbar sein. Vorher fuhr dort nur zweimal täglich ein Linienbus.\n\nEine Fahrt innerhalb der Gemeinde kostet zwei Euro; Monatskarten des regionalen Verkehrsverbunds werden ebenfalls akzeptiert. In den ersten Wochen nutzten vor allem ältere Menschen den Telefondienst. Inzwischen kommen mehr als die Hälfte der Bestellungen über die App. Am späten Abend ist der Bus noch nicht unterwegs, weil derzeit nur zwei Fahrer beschäftigt sind. Die Gemeinde sucht deshalb zusätzliches Personal. Bei ausreichender Nachfrage soll das Angebot im Winter bis 23 Uhr verlängert werden.`,
      questions: [
        { prompt: "Wie wird die Route des Busses festgelegt?", options: ["Sie bleibt jeden Tag gleich.", "Die Fahrgäste stimmen darüber ab.", "Ein Programm kombiniert die Fahrtwünsche."], answer: "c", explanation: "Eine Software plant aus Bestellungen die Route.", evidence: "Ähnliche Wünsche werden verbunden.", skillTags: ["process", "detail"] },
        { prompt: "Welche Fahrkarten gelten im Dorfbus?", options: ["Nur speziell gekaufte Einzelfahrscheine.", "Auch Monatskarten des regionalen Verbunds.", "Nur digitale Fahrkarten aus der App."], answer: "b", explanation: "Regionale Monatskarten werden akzeptiert.", evidence: "Dies steht zusammen mit dem Preis im zweiten Absatz.", skillTags: ["detail"] },
        { prompt: "Warum fährt der Bus noch nicht spät am Abend?", options: ["Es fehlen weitere Fahrer.", "Die App funktioniert nachts nicht.", "Die Batterien reichen nicht aus."], answer: "a", explanation: "Die Personalzahl begrenzt die Betriebszeit.", evidence: "Derzeit sind nur zwei Fahrer beschäftigt.", skillTags: ["cause-effect"] },
      ],
    },
  ]),
  buildPart3(form2Id, [
    ["Leonie sucht für die Sommerferien eine bezahlte Arbeit im Freien.", "B", "Anzeige B bietet einen bezahlten Ferienjob im Park.", "Ferienzeit, Bezahlung und Arbeit draußen passen.", ["advertisements", "constraints"]],
    ["Omar möchte für eine Woche günstig in Leipzig übernachten und selbst kochen.", "E", "Anzeige E bietet eine Gästewohnung mit Küche für kurze Aufenthalte.", "Ort, Zeitraum und Kochmöglichkeit stimmen.", ["advertisements", "detail"]],
    ["Klara braucht regelmäßig Hilfe beim Üben von deutschem Sprechen, möchte aber kein Geld bezahlen.", "I", "Anzeige I organisiert kostenlosen Sprachaustausch.", "Regelmäßiges Sprechen und kostenloser Austausch passen.", ["advertisements", "purpose"]],
    ["Felix sucht einen gebrauchten elektrischen Stadtwagen für den täglichen Arbeitsweg.", "0", "Keine Anzeige bietet ein elektrisches Auto zum Kauf.", "Das Fahrzeugangebot betrifft Fahrräder oder Carsharing, nicht den gesuchten Kauf.", ["advertisements", "negation"]],
    ["Yuki möchte auf einer Reise spontan ein Fahrrad an verschiedenen Bahnhöfen ausleihen.", "G", "Anzeige G ist ein Bahnhofs-Leihsystem ohne langfristigen Vertrag.", "Mehrere Stationen und spontane Nutzung passen.", ["advertisements", "synonyms"]],
    ["Ben braucht am Samstag Betreuung für seinen Hund, während er auf einer Feier ist.", "C", "Anzeige C bietet stundenweise Hundebetreuung am Wochenende.", "Samstag und zeitlich begrenzte Betreuung stimmen.", ["advertisements", "detail"]],
    ["Hanna möchte in einem Chor mitsingen, obwohl sie keine Noten lesen kann.", "A", "Anzeige A nimmt Anfänger ohne Notenkenntnisse auf.", "Die fehlende Vorerfahrung ist ausdrücklich kein Problem.", ["advertisements", "negation"]],
  ], [
    { id: "A", title: "Stadtteilchor sucht Stimmen", body: "Proben dienstags am Abend. Freude am Singen genügt; Notenkenntnisse und Vorsingen sind nicht erforderlich." },
    { id: "B", title: "Ferienjob im Stadtpark", body: "Im Juli und August unterstützen Sie unser Team bei Pflege und Veranstaltungen. 15 Stunden pro Woche, faire Bezahlung." },
    { id: "C", title: "Hundegäste willkommen", body: "Erfahrene Studentin betreut Ihren Hund samstags und sonntags stundenweise bei sich zu Hause." },
    { id: "D", title: "Kleinwagen gemeinsam nutzen", body: "Carsharing mit Monatsvertrag und Benzinfahrzeugen. Abholung rund um die Uhr am Rathaus." },
    { id: "E", title: "Gästewohnung Leipzig", body: "Einfaches Zimmer mit eigener kleiner Küche, wochenweise zu vermieten. Straßenbahn vor der Tür." },
    { id: "F", title: "Rennrad fast neu", body: "Leichtes Sportfahrrad zu verkaufen. Nur wenige Kilometer gefahren, Abholung in Dresden." },
    { id: "G", title: "Rad an jeder Station", body: "Leihräder an zwölf Bahnhöfen. Per App öffnen, spontan fahren und an einer beliebigen Station zurückgeben." },
    { id: "H", title: "Kochkurs für Paare", body: "Mediterranes Menü am Freitagabend. Anmeldung nur zu zweit, Lebensmittel im Preis enthalten." },
    { id: "I", title: "Deutsch im Tandem", body: "Kostenlose Treffen mit Muttersprachlern jeden Mittwoch. Im Mittelpunkt steht entspanntes Sprechen." },
    { id: "J", title: "Online-Bewerbungstraining", body: "Zwei individuelle Videotermine für Lebenslauf und Gespräch. Termine flexibel am Vormittag." },
  ]),
  buildPart4(form2Id, "Dauerhaft im Homeoffice arbeiten", [
    { id: "f2-c20", speaker: "Nico", body: "Zu Hause kann ich mich viel besser konzentrieren als im Großraumbüro. Ich spare täglich fast zwei Stunden Fahrt. Für Besprechungen reicht mir eine gute Videokonferenz.", answer: "yes", explanation: "Nico bevorzugt die dauerhafte Arbeit zu Hause.", evidence: "Er nennt Konzentration und Zeitersparnis als Vorteile." },
    { id: "f2-c21", speaker: "Fatima", body: "Mir fehlen spontane Gespräche und gemeinsame Pausen. Viele Ideen entstehen bei uns ohne geplanten Termin. Nur über den Bildschirm fühlt sich die Zusammenarbeit unpersönlich an.", answer: "no", explanation: "Fatima sieht wesentliche soziale Nachteile.", evidence: "Sie vermisst spontane und persönliche Zusammenarbeit." },
    { id: "f2-c22", speaker: "Gregor", body: "Mit zwei kleinen Kindern ist ein fester Arbeitsplatz zu Hause ideal. Meine Arbeitszeit lässt sich besser organisieren, und ich kann trotzdem ungestört arbeiten.", answer: "yes", explanation: "Gregor bewertet sein Homeoffice positiv.", evidence: "Er nennt Organisation und Ruhe als Vorteile." },
    { id: "f2-c23", speaker: "Elif", body: "Die Firma spart Bürokosten, aber die Beschäftigten zahlen mehr für Strom und Heizung. Außerdem hat nicht jeder Platz für einen guten Schreibtisch. Dauerhaft ist das unfair.", answer: "no", explanation: "Elif lehnt dauerhaftes Homeoffice als unfair ab.", evidence: "Sie verweist auf private Kosten und ungleiche Wohnbedingungen." },
    { id: "f2-c24", speaker: "Jon", body: "Mein Team arbeitet in vier Ländern. Ein gemeinsames Büro wäre ohnehin unmöglich. Klare Regeln und digitale Werkzeuge machen unsere Zusammenarbeit zuverlässig.", answer: "yes", explanation: "Jon hält die digitale Dauerlösung für passend.", evidence: "Sein internationales Team arbeitet mit klaren Regeln zuverlässig." },
    { id: "f2-c25", speaker: "Ruth", body: "Nach einigen Monaten zu Hause konnte ich Arbeit und Freizeit kaum noch trennen. Im Büro endet mein Arbeitstag an der Tür. Deshalb möchte ich dort regelmäßig sein.", answer: "no", explanation: "Ruth braucht die räumliche Trennung und lehnt dauerhaftes Homeoffice ab.", evidence: "Zu Hause verschwammen Arbeit und Freizeit." },
    { id: "f2-c26", speaker: "Waleed", body: "Wer zu Hause arbeiten will, sollte diese Möglichkeit ohne ständige Begründung bekommen. Ergebnisse sind wichtiger als der Ort. Für mich funktioniert das seit Jahren hervorragend.", answer: "yes", explanation: "Waleed unterstützt die freie dauerhafte Wahl.", evidence: "Er beschreibt seine eigene Erfahrung als hervorragend." },
  ]),
  buildPart5(form2Id, {
    id: "f2-fitness-rules", title: "Nutzungsregeln Aktivzentrum Nord",
    body: `Mitglieder dürfen das Aktivzentrum täglich von 6 bis 23 Uhr nutzen. Beim Eintritt ist die persönliche Mitgliedskarte am Drehkreuz zu scannen. Die Karte darf nicht an andere Personen weitergegeben werden. Gäste können nach vorheriger Anmeldung eine Tageskarte am Empfang kaufen. Jugendliche unter 16 Jahren trainieren nur in Begleitung eines Erwachsenen oder während eines betreuten Jugendkurses.\n\nIn allen Trainingsbereichen sind saubere Sportschuhe und ein Handtuch vorgeschrieben. Taschen bleiben in den Schließfächern; dafür wird ein eigenes kleines Schloss benötigt. Das Aktivzentrum übernimmt keine Verantwortung für Gegenstände, die außerhalb eines verschlossenen Fachs liegen. Glasflaschen sind verboten, Trinkflaschen aus Kunststoff oder Metall dagegen erlaubt. Geräte werden nach der Benutzung gereinigt und Gewichte an ihren Platz zurückgelegt.\n\nKurse können sieben Tage im Voraus über die App gebucht werden. Wer nicht teilnehmen kann, storniert spätestens zwei Stunden vor Beginn. Nach drei nicht stornierten Terminen wird die Kursbuchung für zwei Wochen gesperrt. Private Trainer dürfen nur mit schriftlicher Genehmigung der Leitung arbeiten. Unfälle oder defekte Geräte müssen sofort dem Personal gemeldet werden. Die Sauna schließt bereits um 22 Uhr und darf nicht mit Sportschuhen betreten werden.`,
  }, [
    { prompt: "Was gilt für die Mitgliedskarte?", options: ["Sie darf an Familienmitglieder verliehen werden.", "Sie ist nur bei Kursen notwendig.", "Sie ist persönlich und wird beim Eintritt benutzt."], answer: "c", explanation: "Die Karte ist persönlich und öffnet das Drehkreuz.", evidence: "Eine Weitergabe ist ausdrücklich verboten.", skillTags: ["rules", "detail"] },
    { prompt: "Was braucht man für ein Schließfach?", options: ["Ein eigenes kleines Schloss.", "Eine besondere Münze.", "Die Hilfe des Empfangs."], answer: "a", explanation: "Mitglieder bringen ihr Schloss selbst mit.", evidence: "Dies steht im Abschnitt zu Taschen und Haftung.", skillTags: ["detail"] },
    { prompt: "Wann muss ein Kurs spätestens storniert werden?", options: ["Sieben Tage vorher.", "Zwei Stunden vor Kursbeginn.", "Am Abend vor dem Termin."], answer: "b", explanation: "Die Stornofrist beträgt zwei Stunden.", evidence: "Sie wird direkt nach der Buchungsfrist genannt.", skillTags: ["time"] },
    { prompt: "Welche Regel gilt in der Sauna?", options: ["Sie bleibt bis 23 Uhr geöffnet.", "Metallflaschen sind dort verboten.", "Sportschuhe dürfen nicht getragen werden."], answer: "c", explanation: "Die Sauna darf nicht mit Sportschuhen betreten werden.", evidence: "Außerdem schließt sie um 22 Uhr.", skillTags: ["negation"] },
  ]),
]);

const form3Id = "de-b1-reading-form-003";
const form3Part1Text = {
  id: "f3-festival",
  title: "Das Fest, das fast ausfiel",
  body: `Am vergangenen Wochenende sollte in unserem Ort das jährliche Flussfest stattfinden. Meine Freundin Nele und ich hatten eine lange Radtour geplant und wollten nur am Abend kurz vorbeischauen. Am Freitag meldete der Wetterdienst jedoch schwere Gewitter. Die Organisatoren sagten das Fest nicht ab, sondern verlegten fast alle Programmpunkte in die alte Bahnhofshalle. Für die geplante Radtour war uns das Wetter zu unsicher, also boten wir spontan unsere Hilfe an.\n\nAm Samstagmorgen herrschte in der Halle großes Durcheinander. Stände mussten neu verteilt, Schilder aufgehängt und Kabel sicher abgedeckt werden. Zuerst sortierte ich Informationsmaterial, später half ich einem kleinen Theater bei der Beleuchtung. Nele betreute den Eingang. Obwohl sie noch nie Eintrittskarten kontrolliert hatte, löste sie die Aufgabe ruhig. Kurz nach der Eröffnung fiel für zehn Minuten der Strom aus. Die Musiker spielten einfach ohne Verstärker weiter, und das Publikum sang mit.\n\nAm Nachmittag wurde das Wetter besser. Einige Stände konnten doch nach draußen ziehen, aber die meisten Besucher blieben in der Halle. Mehr als zweitausend Menschen kamen, fast so viele wie im Vorjahr. Die Organisatoren bedankten sich bei allen freiwilligen Helfern mit Essensgutscheinen. Nele und ich waren abends erschöpft und blieben nicht bis zum letzten Konzert. Trotzdem waren wir froh, dass unsere abgesagte Radtour zu einem besonderen Tag geführt hatte. Im nächsten Jahr wollen wir uns schon vorher als Helferinnen anmelden.`,
};
const form3 = makeForm(form3Id, "Reading Form 3", [
  buildPart1(form3Id, form3Part1Text, [
    ["Nele und die Erzählerin wollten ursprünglich den ganzen Tag beim Fest verbringen.", false, "Geplant war eine Radtour und nur ein kurzer Festbesuch am Abend.", "Der Einsatz als Helferinnen entstand erst wegen des Wetters.", ["sequence", "detail"]],
    ["Wegen der Gewitterwarnung fand ein großer Teil des Programms in einer Halle statt.", true, "Die Veranstaltungen wurden überwiegend verlegt.", "Die alte Bahnhofshalle ersetzte die Außenflächen.", ["cause-effect"]],
    ["Nele hatte bereits Erfahrung mit der Kontrolle von Eintrittskarten.", false, "Diese Aufgabe war für sie neu.", "Im Text steht ausdrücklich, dass sie das noch nie gemacht hatte.", ["detail", "negation"]],
    ["Während des Stromausfalls wurde das Musikprogramm vollständig unterbrochen.", false, "Die Musiker spielten akustisch weiter.", "Das Publikum sang sogar mit.", ["detail", "contrast"]],
    ["Es kamen deutlich weniger als halb so viele Besucher wie im Jahr zuvor.", false, "Die Besucherzahl war fast gleich hoch.", "Mehr als zweitausend Menschen kamen.", ["comparison", "detail"]],
    ["Die beiden möchten künftig wieder freiwillig beim Fest arbeiten.", true, "Sie wollen sich im nächsten Jahr vorher anmelden.", "Der letzte Satz beschreibt diese Absicht.", ["intention", "inference"]],
  ]),
  buildPart2(form3Id, [
    {
      id: "f3-repair-bonus", title: "Zuschuss verlängert die Lebensdauer von Geräten",
      body: `Seit einem Jahr erhalten Einwohner der Region Lindenau einen Zuschuss, wenn sie defekte Elektrogeräte reparieren lassen. Die Verwaltung übernimmt die Hälfte der Rechnung, höchstens jedoch 100 Euro pro Gerät. Beantragt wird das Geld nach der Reparatur mit Rechnung und Zahlungsbeleg. Smartphones, Kaffeemaschinen und Staubsauger werden besonders häufig eingereicht.\n\nNach Angaben der Abfallberatung landeten im ersten Jahr rund zwölf Prozent weniger kleine Elektrogeräte auf dem Wertstoffhof. Gleichzeitig beteiligten sich inzwischen 26 Werkstätten am Programm, zu Beginn waren es nur elf. Nicht jede Reparatur ist zuschussfähig: Der Betrieb muss in der Region registriert sein, und der Kauf gebrauchter Ersatzgeräte wird nicht unterstützt. Wegen der guten Nachfrage verlängert der Landkreis das Projekt um zwei Jahre. Künftig können Anträge zusätzlich direkt in teilnehmenden Werkstätten gestellt werden.`,
      questions: [
        { prompt: "Wie hoch ist der Zuschuss?", options: ["Immer genau 100 Euro.", "Die Hälfte der Kosten, aber maximal 100 Euro.", "Zwölf Prozent des ursprünglichen Kaufpreises."], answer: "b", explanation: "Der Zuschuss kombiniert einen Anteil mit einer Obergrenze.", evidence: "Die Region zahlt 50 Prozent bis höchstens 100 Euro.", skillTags: ["numbers", "detail"] },
        { prompt: "Welche Entwicklung wird nach einem Jahr genannt?", options: ["Mehr Werkstätten nehmen am Programm teil.", "Elektrogeräte werden häufiger weggeworfen.", "Nur noch Smartphones werden repariert."], answer: "a", explanation: "Die Zahl der beteiligten Werkstätten stieg von elf auf 26.", evidence: "Zugleich sank die Menge kleiner Geräte am Wertstoffhof.", skillTags: ["comparison", "result"] },
        { prompt: "Was ist künftig zusätzlich möglich?", options: ["Ein Zuschuss für neue Geräte.", "Ein Antrag vor dem Kauf eines Geräts.", "Die Antragstellung in einer teilnehmenden Werkstatt."], answer: "c", explanation: "Werkstätten werden ein weiterer Antragsort.", evidence: "Diese Neuerung wird im letzten Satz angekündigt.", skillTags: ["time", "detail"] },
      ],
    },
    {
      id: "f3-station-culture", title: "Alter Bahnhof wird zum Kulturort",
      body: `Der Bahnhof von Eichenfeld steht seit 18 Jahren leer. Nun haben Bürgerinnen und Bürger eine Genossenschaft gegründet, um das denkmalgeschützte Gebäude zu retten. Mehr als 600 Menschen kauften Anteile. Mit diesem Geld und einem städtischen Zuschuss begann im Frühjahr die Renovierung. Das Dach ist bereits dicht, doch im Innenraum gibt es noch viel zu tun.\n\nIm ehemaligen Wartesaal sollen im kommenden Herbst Konzerte, Lesungen und kleine Ausstellungen stattfinden. Ein Café ist ebenfalls vorgesehen, wird aber von einem unabhängigen Betrieb geführt. Zwei Räume im Obergeschoss können später von Vereinen gemietet werden. Die Genossenschaft rechnet nicht damit, allein durch Veranstaltungen alle Kosten zu decken. Deshalb vermietet sie außerdem Arbeitsplätze im früheren Fahrkartenschalter. Freiwillige helfen derzeit jeden zweiten Samstag beim Streichen und Aufräumen; Facharbeiten an Elektrik und Heizung übernehmen Firmen.`,
      questions: [
        { prompt: "Wer finanzierte den Beginn der Renovierung?", options: ["Nur die Stadtverwaltung.", "Eine Bahngesellschaft aus dem Ausland.", "Mitglieder der Genossenschaft und die Stadt."], answer: "c", explanation: "Anteile und ein städtischer Zuschuss bilden die Finanzierung.", evidence: "Mehr als 600 Menschen kauften Anteile.", skillTags: ["detail", "cause-effect"] },
        { prompt: "Was soll im früheren Wartesaal entstehen?", options: ["Ein Raum für Kulturveranstaltungen.", "Eine große technische Werkstatt.", "Ein dauerhaftes Vereinsbüro."], answer: "a", explanation: "Der Wartesaal ist für Konzerte, Lesungen und Ausstellungen vorgesehen.", evidence: "Vereinsräume liegen dagegen im Obergeschoss.", skillTags: ["detail", "location"] },
        { prompt: "Warum werden zusätzlich Arbeitsplätze vermietet?", options: ["Das Café braucht mehr Personal.", "Veranstaltungen reichen zur Finanzierung nicht aus.", "Freiwillige dürfen nicht mehr helfen."], answer: "b", explanation: "Die Arbeitsplätze schaffen zusätzliche Einnahmen.", evidence: "Veranstaltungen decken voraussichtlich nicht alle Kosten.", skillTags: ["cause-effect", "purpose"] },
      ],
    },
  ]),
  buildPart3(form3Id, [
    ["Amir sucht ein möbliertes Zimmer für ein dreimonatiges Praktikum in Hamburg.", "D", "Anzeige D vermietet möbliert und ausdrücklich für ein bis sechs Monate.", "Ort und Zeitraum stimmen.", ["advertisements", "constraints"]],
    ["Svenja möchte am Freitagabend eine Ausstellung besuchen, ohne Eintritt zu bezahlen.", "H", "Anzeige H ist freitags geöffnet und kostenlos.", "Kulturangebot, Termin und Preis passen.", ["advertisements", "detail"]],
    ["Luis braucht kurzfristig jemanden, der einen tropfenden Wasserhahn repariert.", "B", "Anzeige B bietet kurzfristige Sanitär-Kleinreparaturen.", "Das konkrete Problem wird im Angebot genannt.", ["advertisements", "synonyms"]],
    ["Mei sucht eine englischsprachige Führung durch ein historisches Schloss am Montag.", "0", "Keine Schlossführung erfüllt Sprache und Montagstermin.", "Die Touren betreffen die Altstadt oder finden an anderen Tagen statt.", ["advertisements", "negation"]],
    ["Carla möchte lernen, wie sie ihre Ausgaben mit einem einfachen Plan kontrolliert.", "F", "Anzeige F vermittelt private Budgetplanung.", "Das Seminar behandelt Ausgaben, Sparziele und Monatspläne.", ["advertisements", "purpose"]],
    ["Tobias will am Wochenende mit öffentlichen Verkehrsmitteln zu einer leichten Wanderung fahren.", "J", "Anzeige J kombiniert eine leichte Tour mit gemeinsamer Bahnfahrt.", "Schwierigkeit, Wochenende und Anreise passen.", ["advertisements", "constraints"]],
    ["Rania sucht für ihre zwölfjährige Tochter einen Ferienkurs im Programmieren.", "A", "Anzeige A richtet sich an 11- bis 14-Jährige in den Ferien.", "Alter, Thema und Zeitraum passen.", ["advertisements", "detail"]],
  ], [
    { id: "A", title: "Code-Camp für Jugendliche", body: "Ferienwoche für 11- bis 14-Jährige: kleine Spiele programmieren, ohne Vorkenntnisse. Laptops werden gestellt." },
    { id: "B", title: "Mobile Haushaltsreparatur", body: "Wir kommen kurzfristig bei tropfenden Hähnen, lockeren Griffen und kleinen Sanitärproblemen." },
    { id: "C", title: "Altstadt auf Englisch", body: "Englische Stadtführung jeden Montag um 16 Uhr. Treffpunkt am Markt, Dauer 90 Minuten." },
    { id: "D", title: "Wohnen auf Zeit in Hamburg", body: "Möbliertes Zimmer nahe U-Bahn, für ein bis sechs Monate. Internet und Nebenkosten inklusive." },
    { id: "E", title: "Zimmer dauerhaft frei", body: "Unmöbliertes WG-Zimmer in Bremen. Gesucht wird eine Person für mindestens zwei Jahre." },
    { id: "F", title: "Geld im Blick", body: "Abendseminar zu Haushaltsbuch, Monatsbudget und realistischen Sparzielen. Praktische Übungen mit eigenem Beispiel." },
    { id: "G", title: "Schlossführung am Wochenende", body: "Deutschsprachige Führung samstags und sonntags. Eintrittskarte für Museum und Park enthalten." },
    { id: "H", title: "Freitag in der Galerie", body: "Zeitgenössische Fotografien bis 21 Uhr ansehen. Der Eintritt ist jeden Freitag frei." },
    { id: "I", title: "Bergtour für Erfahrene", body: "Anspruchsvolle Zweitagestour mit eigener Anreise. Trittsicherheit und komplette Ausrüstung erforderlich." },
    { id: "J", title: "Sonntags gemeinsam wandern", body: "Leichte Rundwanderung, etwa neun Kilometer. Wir fahren gemeinsam mit dem Regionalzug zum Startpunkt." },
  ]),
  buildPart4(form3Id, "Smartphones im Unterricht", [
    { id: "f3-c20", speaker: "Helena", body: "Mit Lernapps kann meine Klasse Wörter üben und schnell Informationen prüfen. Klare Aufgaben verhindern Ablenkung. Ein vollständiges Verbot würde eine nützliche Technik ausschließen.", answer: "yes", explanation: "Helena unterstützt den geregelten Einsatz.", evidence: "Sie sieht Lernvorteile und lehnt ein vollständiges Verbot ab." },
    { id: "f3-c21", speaker: "Martin", body: "Selbst bei ausgeschaltetem Ton schauen viele ständig auf Nachrichten. Das stört die Konzentration der ganzen Gruppe. Während der Stunde gehören die Geräte in einen Schrank.", answer: "no", explanation: "Martin möchte Smartphones aus dem Unterricht entfernen.", evidence: "Er beschreibt sie als dauerhafte Ablenkung." },
    { id: "f3-c22", speaker: "Amina", body: "Nicht jede Schule kann Tablets für alle kaufen. Fast alle Jugendlichen besitzen aber ein Telefon. Wenn die Schule Leihgeräte bereithält, kann man damit sinnvoll arbeiten.", answer: "yes", explanation: "Amina befürwortet Smartphones mit einem Ausgleich für fehlende Geräte.", evidence: "Sie hält die Nutzung für sinnvoll, sofern Leihgeräte verfügbar sind." },
    { id: "f3-c23", speaker: "Uwe", body: "Auf privaten Telefonen sind Fotos und Nachrichten, die niemand sehen soll. Lehrkräfte können außerdem nicht kontrollieren, welche Apps sicher sind. Schulen sollten eigene Technik verwenden.", answer: "no", explanation: "Uwe lehnt private Smartphones aus Datenschutz- und Sicherheitsgründen ab.", evidence: "Er bevorzugt schuleigene Technik." },
    { id: "f3-c24", speaker: "Daria", body: "Wir müssen Jugendlichen zeigen, wie man Quellen bewertet und Bildschirmzeit begrenzt. Das lernt man nicht, wenn Telefone grundsätzlich verboten sind. Begleitete Nutzung ist der bessere Weg.", answer: "yes", explanation: "Daria sieht den Unterricht als Ort für Medienkompetenz.", evidence: "Sie fordert eine begleitete Nutzung statt eines Verbots." },
    { id: "f3-c25", speaker: "Kai", body: "In den Pausen können Schülerinnen und Schüler ihre Geräte gern benutzen. Im Unterricht kosten technische Probleme jedoch zu viel Zeit. Papier und Schulcomputer reichen völlig aus.", answer: "no", explanation: "Kai ist gegen die Nutzung im Unterricht.", evidence: "Er hält vorhandene Alternativen für ausreichend." },
    { id: "f3-c26", speaker: "Olga", body: "Bei Experimenten fotografieren meine Lernenden Ergebnisse und dokumentieren jeden Schritt. Danach legen sie die Telefone wieder weg. Mit festen Regeln funktioniert das ausgezeichnet.", answer: "yes", explanation: "Olga berichtet von einem erfolgreichen geregelten Einsatz.", evidence: "Smartphones dienen gezielt der Dokumentation." },
  ]),
  buildPart5(form3Id, {
    id: "f3-library-rules", title: "Benutzungsordnung Stadtbibliothek am Park",
    body: `Für die Ausleihe ist ein persönlicher Bibliotheksausweis nötig. Erwachsene zahlen eine Jahresgebühr, für Personen unter 18 Jahren ist der Ausweis kostenlos. Adressänderungen und der Verlust des Ausweises müssen sofort gemeldet werden. Medien können an den Automaten oder am Schalter ausgeliehen werden. Bücher und Hörbücher dürfen vier Wochen, Filme und Zeitschriften zwei Wochen behalten werden. Eine Verlängerung ist zweimal möglich, sofern niemand das Medium reserviert hat.\n\nRückgaben sind auch außerhalb der Öffnungszeiten über den Automaten am Haupteingang möglich. Bei verspäteter Rückgabe entsteht pro Medium und Woche eine Gebühr. Wer ein beschädigtes Medium bemerkt, informiert das Personal vor der Ausleihe. Für selbst verursachte Schäden oder verlorene Medien muss Ersatz geleistet werden.\n\nIn den Lesebereichen sind Wasser in verschließbaren Flaschen und lautlose elektronische Geräte erlaubt. Telefonate, warme Speisen und Getränke ohne Deckel sind dort nicht gestattet. Gruppenräume können für höchstens zwei Stunden pro Tag reserviert werden. Die Reservierung verfällt nach 15 Minuten, wenn die Gruppe nicht erscheint. Kinder unter zehn Jahren bleiben in Begleitung einer verantwortlichen Person. Tiere dürfen nicht ins Gebäude; ausgenommen sind anerkannte Assistenzhunde.`,
  }, [
    { prompt: "Wie lange darf ein Film ausgeliehen werden?", options: ["Zwei Wochen.", "Vier Wochen.", "Bis zu zwei Monate."], answer: "a", explanation: "Für Filme gilt die kürzere Frist von zwei Wochen.", evidence: "Bücher und Hörbücher dürfen dagegen vier Wochen bleiben.", skillTags: ["time", "contrast"] },
    { prompt: "Wann ist eine Verlängerung nicht möglich?", options: ["Wenn jemand das Medium reserviert hat.", "Wenn das Medium am Automaten ausgeliehen wurde.", "Wenn die Bibliothek am Sonntag geschlossen ist."], answer: "a", explanation: "Eine bestehende Reservierung verhindert die Verlängerung.", evidence: "Ohne Reservierung sind bis zu zwei Verlängerungen möglich.", skillTags: ["condition", "negation"] },
    { prompt: "Was ist in den Lesebereichen erlaubt?", options: ["Ein Telefonat mit leiser Stimme.", "Wasser in einer geschlossenen Flasche.", "Ein warmes Mittagessen."], answer: "b", explanation: "Wasser mit verschließbarem Deckel ist zugelassen.", evidence: "Telefonate und warme Speisen sind verboten.", skillTags: ["permission"] },
    { prompt: "Was geschieht, wenn eine Gruppe zu spät zu ihrem reservierten Raum kommt?", options: ["Nach 15 Minuten kann die Reservierung verfallen.", "Die tägliche Nutzungszeit wird automatisch verlängert.", "Die Gruppe muss eine neue Jahresgebühr zahlen."], answer: "a", explanation: "Die Reservierung bleibt nur 15 Minuten bestehen.", evidence: "Danach verfällt sie bei Nichterscheinen.", skillTags: ["condition", "time"] },
  ]),
]);

export const readingForms = Object.freeze([form1, form2, form3]);

export const getReadingForm = (formId) => readingForms.find(({ id }) => id === formId) || readingForms[0];
