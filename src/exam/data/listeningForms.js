import { LISTENING_PART_CONFIG } from "../config/goetheB1Listening";
import {
  choiceOptions,
  makeListeningAudio,
  makeListeningForm,
  makeListeningItem,
  makeListeningPart,
  trueFalseOptions,
} from "./listeningHelpers";

const configFor = (number) => LISTENING_PART_CONFIG[number - 1];
const itemId = (formId, number) => `${formId}-item-${String(number).padStart(2, "0")}`;
const speaker = (id, label, voiceProfile) => ({ id, label, voiceProfile });

const buildPart1 = (formId, recordings) => makeListeningPart({
  formId,
  ...configFor(1),
  instructions: "Sie hören fünf kurze Texte. Jeden Text hören Sie zweimal. Lösen Sie zu jedem Text zwei Aufgaben.",
  audio: recordings.map((recording, index) => makeListeningAudio({
    id: `${formId}-p1-audio-${index + 1}`, formId, partNumber: 1, playbackLimit: 2, ...recording,
  })),
  items: recordings.flatMap((recording, index) => {
    const audioRef = `${formId}-p1-audio-${index + 1}`;
    const number = index * 2 + 1;
    return [
      makeListeningItem({ id: itemId(formId, number), number, type: "true-false", options: trueFalseOptions, audioRef, ...recording.trueFalse }),
      makeListeningItem({ id: itemId(formId, number + 1), number: number + 1, type: "multiple-choice", audioRef, ...recording.multipleChoice, options: choiceOptions(...recording.multipleChoice.options) }),
    ];
  }),
});

const buildPart2 = (formId, recording, questions) => {
  const audio = makeListeningAudio({ id: `${formId}-p2-audio-1`, formId, partNumber: 2, playbackLimit: 1, ...recording });
  return makeListeningPart({
    formId, ...configFor(2),
    instructions: "Sie hören einen längeren Informationstext einmal. Lesen Sie zuerst die Aufgaben und wählen Sie a, b oder c.",
    audio: [audio],
    items: questions.map((question, index) => makeListeningItem({
      id: itemId(formId, 11 + index), number: 11 + index, type: "multiple-choice",
      audioRef: audio.id, ...question, options: choiceOptions(...question.options),
    })),
  });
};

const buildPart3 = (formId, recording, questions) => {
  const audio = makeListeningAudio({ id: `${formId}-p3-audio-1`, formId, partNumber: 3, playbackLimit: 1, ...recording });
  return makeListeningPart({
    formId, ...configFor(3),
    instructions: "Sie hören ein Gespräch einmal. Entscheiden Sie bei jeder Aussage: Richtig oder Falsch?",
    audio: [audio],
    items: questions.map((question, index) => makeListeningItem({
      id: itemId(formId, 16 + index), number: 16 + index, type: "true-false",
      options: trueFalseOptions, audioRef: audio.id, ...question,
    })),
  });
};

const buildPart4 = (formId, recording, questions) => {
  const audio = makeListeningAudio({ id: `${formId}-p4-audio-1`, formId, partNumber: 4, playbackLimit: 2, ...recording });
  const options = recording.speakers.map(({ id, label }) => ({ id, label }));
  return makeListeningPart({
    formId, ...configFor(4),
    instructions: "Sie hören eine Diskussion zweimal. Ordnen Sie jede Aussage der richtigen Person zu.",
    audio: [audio],
    items: questions.map((question, index) => makeListeningItem({
      id: itemId(formId, 23 + index), number: 23 + index, type: "speaker-attribution",
      options, audioRef: audio.id, ...question,
    })),
  });
};

const form1Id = "de-b1-listening-form-001";
const form1 = makeListeningForm(form1Id, "Listening Form 1", [
  buildPart1(form1Id, [
    {
      title: "Voicemail from the bicycle workshop", durationSeconds: 38,
      speakers: [speaker("a", "Werkstattmitarbeiterin", "voice-female-1")],
      segments: [{ speakerId: "a", text: "Guten Tag, hier ist die Fahrradwerkstatt Krüger. Ihr Rad ist fast fertig. Das neue Licht funktioniert, aber der bestellte Korb kommt leider erst am Donnerstag. Sie können das Fahrrad trotzdem heute bis achtzehn Uhr abholen und den Korb nächste Woche kostenlos montieren lassen. Bitte bringen Sie den Abholschein mit. Vielen Dank." }],
      trueFalse: { prompt: "Das Fahrrad kann bereits heute abgeholt werden.", correctAnswer: "true", explanation: "Die Abholung ist heute möglich, obwohl der Korb fehlt.", evidence: "Die Werkstatt nennt heute bis 18 Uhr als Abholzeit.", skillTags: ["detail", "announcement"] },
      multipleChoice: { prompt: "Was fehlt noch am Fahrrad?", options: ["der Fahrradkorb", "das Licht", "der Abholschein"], correctAnswer: "a", explanation: "Der bestellte Korb ist noch nicht geliefert.", evidence: "Das Licht funktioniert bereits; der Schein soll nur mitgebracht werden.", skillTags: ["detail", "announcement"] },
    },
    {
      title: "Platform announcement", durationSeconds: 34,
      speakers: [speaker("a", "Bahnhofssprecher", "voice-male-1")],
      segments: [{ speakerId: "a", text: "Achtung am Gleis vier. Der Regionalexpress nach Basel fährt heute nicht um sechzehn Uhr zwölf, sondern zwanzig Minuten später. Wegen einer technischen Prüfung beginnt die Fahrt außerdem auf Gleis sieben. Reisende nach Freiburg können auch den Zug um sechzehn Uhr fünfundzwanzig auf Gleis zwei nehmen." }],
      trueFalse: { prompt: "Der Regionalexpress fährt von einem anderen Gleis ab.", correctAnswer: "true", explanation: "Die Abfahrt wurde auf Gleis sieben verlegt.", evidence: "Ursprünglich wird Gleis vier angesprochen, die Fahrt beginnt aber auf Gleis sieben.", skillTags: ["announcement", "detail"] },
      multipleChoice: { prompt: "Wie viel später fährt der Regionalexpress?", options: ["zwölf Minuten", "zwanzig Minuten", "fünfundzwanzig Minuten"], correctAnswer: "b", explanation: "Die Verspätung beträgt zwanzig Minuten.", evidence: "Die anderen Zahlen gehören zu Uhrzeit und Alternativzug.", skillTags: ["number-time", "detail"] },
    },
    {
      title: "Message from a colleague", durationSeconds: 42,
      speakers: [speaker("a", "Kollegin", "voice-female-2")],
      segments: [{ speakerId: "a", text: "Hallo Deniz, ich bin schon im Kundenzentrum. Unsere Besprechung wurde in Raum zweihundertvier verlegt, weil der Beamer im kleinen Konferenzraum kaputt ist. Ich drucke die Verkaufszahlen aus. Könntest du bitte noch die Namensschilder vom Empfang holen? Wir beginnen wie geplant um halb zehn." }],
      trueFalse: { prompt: "Die Besprechung beginnt später als geplant.", correctAnswer: "false", explanation: "Nur der Raum wurde geändert, nicht die Uhrzeit.", evidence: "Die Kollegin sagt ausdrücklich, dass sie wie geplant um halb zehn beginnen.", skillTags: ["number-time", "detail"] },
      multipleChoice: { prompt: "Was soll Deniz mitbringen?", options: ["einen Beamer", "die Verkaufszahlen", "die Namensschilder"], correctAnswer: "c", explanation: "Deniz soll die Namensschilder holen.", evidence: "Die Kollegin übernimmt selbst den Ausdruck der Verkaufszahlen.", skillTags: ["speaker-intent", "detail"] },
    },
    {
      title: "Weather service update", durationSeconds: 39,
      speakers: [speaker("a", "Radiomoderator", "voice-male-2")],
      segments: [{ speakerId: "a", text: "Und nun das Wetter für das Wochenende: Am Samstag bleibt es am Vormittag trocken und mild. Ab vierzehn Uhr ziehen von Westen kräftige Schauer auf. Wer eine längere Wanderung plant, sollte also früh starten. Am Sonntag wird es kühler, dafür scheint am Nachmittag wieder häufiger die Sonne." }],
      trueFalse: { prompt: "Am Samstagvormittag wird Regen erwartet.", correctAnswer: "false", explanation: "Der Regen beginnt erst am Nachmittag.", evidence: "Bis zum Vormittag bleibt es trocken; Schauer kommen ab 14 Uhr.", skillTags: ["announcement", "number-time"] },
      multipleChoice: { prompt: "Was empfiehlt der Sprecher Wanderern?", options: ["am Samstag früh loszugehen", "bis Sonntagabend zu warten", "nur im Westen zu wandern"], correctAnswer: "a", explanation: "Wegen der späteren Schauer empfiehlt er einen frühen Start.", evidence: "Die Empfehlung folgt direkt auf die Wetterentwicklung.", skillTags: ["recommendation", "reason"] },
    },
    {
      title: "Community event message", durationSeconds: 41,
      speakers: [speaker("a", "Organisatorin", "voice-female-1")],
      segments: [{ speakerId: "a", text: "Hallo zusammen, noch eine Änderung für unser Nachbarschaftsfrühstück am Sonntag. Wegen der vielen Anmeldungen treffen wir uns nicht im kleinen Vereinsraum, sondern im Saal der Musikschule. Teller und Tassen sind dort vorhanden. Bitte bringt aber weiterhin etwas zu essen mit. Der Beginn bleibt um elf Uhr." }],
      trueFalse: { prompt: "Das Frühstück findet in einem größeren Raum statt.", correctAnswer: "true", explanation: "Wegen vieler Anmeldungen zieht die Gruppe in den Saal um.", evidence: "Der kleine Vereinsraum wird durch den Saal der Musikschule ersetzt.", skillTags: ["reason", "detail"] },
      multipleChoice: { prompt: "Was sollen die Gäste mitbringen?", options: ["Geschirr", "Essen", "Musikinstrumente"], correctAnswer: "b", explanation: "Essen soll weiterhin mitgebracht werden.", evidence: "Teller und Tassen sind bereits vorhanden.", skillTags: ["detail", "speaker-intent"] },
    },
  ]),
  buildPart2(form1Id, {
    title: "Introduction to a city repair programme", durationSeconds: 205,
    speakers: [speaker("a", "Programmleiterin", "voice-female-2")],
    segments: [{ speakerId: "a", text: "Guten Abend und herzlich willkommen im Umweltzentrum. Ich stelle Ihnen heute unser neues Programm Reparieren statt Wegwerfen vor. Ab nächstem Monat öffnen wir an jedem ersten und dritten Samstag eine Werkstatt für kleine Haushaltsgeräte. Sie können zum Beispiel einen Toaster, eine Lampe oder einen Staubsauger mitbringen. Große Geräte wie Waschmaschinen können wir hier leider nicht annehmen. Unsere ehrenamtlichen Fachleute untersuchen zuerst gemeinsam mit Ihnen den Fehler. Wenn eine Reparatur möglich ist, arbeiten Sie selbst mit und lernen dabei, wie das Gerät aufgebaut ist. Die Beratung ist kostenlos. Ersatzteile müssen Sie allerdings bezahlen. Weil wir nur zwölf Arbeitsplätze haben, ist eine Anmeldung über unsere Internetseite nötig. Dort wählen Sie ein Zeitfenster von neun bis zwölf oder von dreizehn bis sechzehn Uhr. Bitte beschreiben Sie bei der Anmeldung möglichst genau, was nicht funktioniert. So kann das Team passendes Werkzeug vorbereiten. Wer noch kein eigenes Gerät reparieren möchte, kann am Mittwochabend einen Einführungskurs besuchen. Dabei geht es um Sicherheit, einfache Messungen und den richtigen Umgang mit Werkzeug. Für Jugendliche zwischen vierzehn und siebzehn Jahren gibt es außerdem einmal im Monat einen eigenen Termin. Zum Abschluss noch eine Bitte: Bringen Sie keine bereits geöffneten Geräte mit, wenn Sie nicht genau wissen, was verändert wurde. In diesem Fall können unsere Fachleute die Sicherheit nicht zuverlässig prüfen. Weitere Informationen und alle Termine finden Sie ab morgen auf der Seite des Umweltzentrums." }],
  }, [
    { prompt: "Wann öffnet die Reparaturwerkstatt?", options: ["jeden Mittwochabend", "zweimal pro Monat am Samstag", "an jedem Werktag"], correctAnswer: "b", explanation: "Die Werkstatt öffnet am ersten und dritten Samstag.", evidence: "Der Mittwochabend ist nur für den Einführungskurs vorgesehen.", skillTags: ["number-time", "detail"] },
    { prompt: "Welche Geräte nimmt die Werkstatt nicht an?", options: ["Lampen", "Staubsauger", "Waschmaschinen"], correctAnswer: "c", explanation: "Große Geräte können nicht angenommen werden.", evidence: "Die Waschmaschine wird als Beispiel für ein ausgeschlossenes Gerät genannt.", skillTags: ["detail"] },
    { prompt: "Warum ist eine Anmeldung erforderlich?", options: ["Die Zahl der Arbeitsplätze ist begrenzt.", "Ersatzteile müssen vorher bestellt werden.", "Die Beratung kostet unterschiedlich viel."], correctAnswer: "a", explanation: "Es stehen nur zwölf Arbeitsplätze zur Verfügung.", evidence: "Die Anmeldung wird direkt mit dieser Begrenzung begründet.", skillTags: ["reason", "detail"] },
    { prompt: "Was lernen Teilnehmende im Einführungskurs?", options: ["wie man große Geräte transportiert", "wie man sicher mit Werkzeug umgeht", "wie man Ersatzteile verkauft"], correctAnswer: "b", explanation: "Sicherheit, Messungen und Werkzeuggebrauch sind Kursinhalte.", evidence: "Der Kurs ist unabhängig von einer konkreten Reparatur.", skillTags: ["main-idea", "detail"] },
    { prompt: "Wovon rät die Sprecherin ab?", options: ["ein Zeitfenster am Nachmittag zu wählen", "Jugendliche zur Werkstatt mitzubringen", "unklar veränderte Geräte mitzubringen"], correctAnswer: "c", explanation: "Unbekannte frühere Eingriffe erschweren die Sicherheitsprüfung.", evidence: "Diese Bitte steht am Ende der Information.", skillTags: ["recommendation", "reason"] },
  ]),
  buildPart3(form1Id, {
    title: "Colleagues planning an open day", durationSeconds: 225,
    speakers: [speaker("a", "Mira", "voice-female-1"), speaker("b", "Thomas", "voice-male-1")],
    segments: [
      { speakerId: "a", text: "Thomas, hast du kurz Zeit? Der Tag der offenen Tür ist schon in zwei Wochen, und wir müssen den Ablauf festlegen." },
      { speakerId: "b", text: "Klar. Ich habe gestern mit der Leitung gesprochen. Wir dürfen die Werkhalle nutzen, aber die Besucher müssen dort feste Schuhe tragen." },
      { speakerId: "a", text: "Gut, das schreiben wir gleich in die Einladung. Ich dachte an Führungen um zehn, zwölf und vierzehn Uhr." },
      { speakerId: "b", text: "Um zwölf ist unsere Mittagspause. Können wir die zweite Führung auf dreizehn Uhr legen? Dann können mehr Mitarbeitende mitmachen." },
      { speakerId: "a", text: "Einverstanden. Für Kinder wollte ich im Hof eine kleine Experimentierstation aufbauen." },
      { speakerId: "b", text: "Das geht leider nicht. Der Hof wird an dem Wochenende repariert. Im Schulungsraum wäre genug Platz, wenn wir die Tische an die Seite stellen." },
      { speakerId: "a", text: "Dann machen wir das dort. Um Getränke kümmert sich doch die Kantine, oder?" },
      { speakerId: "b", text: "Nur um Kaffee und Wasser. Kuchen müssen wir selbst organisieren. Meine Kollegin backt gern, aber für hundert Gäste reicht das nicht." },
      { speakerId: "a", text: "Ich frage im Team nach. Letztes Jahr hatten wir zu viel Kuchen und zu wenig herzhafte Snacks. Diesmal sollten wir beides anbieten." },
      { speakerId: "b", text: "Stimmt. Und wir brauchen mehr Namensschilder. Ich bestelle sie heute noch. Übernimmst du die Anmeldung der Gäste?" },
      { speakerId: "a", text: "Ja. Ich erstelle ein Onlineformular, damit wir ungefähr wissen, wie viele kommen. Die Teilnahme bleibt natürlich kostenlos." },
    ],
  }, [
    { prompt: "Die Veranstaltung findet bereits in der kommenden Woche statt.", correctAnswer: "false", explanation: "Der Termin ist erst in zwei Wochen.", evidence: "Mira nennt den zeitlichen Abstand zu Beginn.", skillTags: ["number-time", "conversation"] },
    { prompt: "In der Werkhalle gelten besondere Regeln für die Schuhe.", correctAnswer: "true", explanation: "Besucher müssen feste Schuhe tragen.", evidence: "Thomas berichtet von dieser Vorgabe der Leitung.", skillTags: ["detail", "conversation"] },
    { prompt: "Die zweite Führung soll um dreizehn Uhr beginnen.", correctAnswer: "true", explanation: "Der ursprünglich geplante Zwölf-Uhr-Termin wird verschoben.", evidence: "Mira stimmt Thomas' Vorschlag für 13 Uhr zu.", skillTags: ["sequence", "number-time"] },
    { prompt: "Die Experimentierstation wird im Hof aufgebaut.", correctAnswer: "false", explanation: "Wegen Reparaturen wechselt sie in den Schulungsraum.", evidence: "Der Hof steht am Veranstaltungswochenende nicht zur Verfügung.", skillTags: ["reason", "detail"] },
    { prompt: "Die Kantine liefert auch Kuchen.", correctAnswer: "false", explanation: "Die Kantine stellt nur Kaffee und Wasser bereit.", evidence: "Kuchen muss das Team selbst organisieren.", skillTags: ["detail"] },
    { prompt: "Mira möchte diesmal nur herzhafte Snacks anbieten.", correctAnswer: "false", explanation: "Sie möchte sowohl Kuchen als auch herzhafte Snacks.", evidence: "Sie zieht eine Lehre aus der Erfahrung des Vorjahres.", skillTags: ["opinion", "conversation"] },
    { prompt: "Gäste sollen sich über ein Onlineformular anmelden.", correctAnswer: "true", explanation: "Mira übernimmt die digitale Anmeldung.", evidence: "Das Formular soll eine Schätzung der Besucherzahl ermöglichen.", skillTags: ["plan", "speaker-intent"] },
  ]),
  buildPart4(form1Id, {
    title: "Discussion: volunteering in the neighbourhood", durationSeconds: 285,
    speakers: [speaker("a", "Moderatorin", "voice-female-2"), speaker("b", "Jana", "voice-female-1"), speaker("c", "Lukas", "voice-male-1")],
    segments: [
      { speakerId: "a", text: "Willkommen zu Stadtgespräch. Heute fragen wir: Wie gewinnen wir mehr Menschen für freiwillige Arbeit? Jana organisiert eine Nachbarschaftshilfe, Lukas berät Vereine." },
      { speakerId: "b", text: "Viele möchten helfen, glauben aber, sie müssten sich jede Woche fest verpflichten. Bei uns kann man auch nur einmal im Monat einen Einkauf übernehmen. Solche kleinen Aufgaben sind ein guter Einstieg." },
      { speakerId: "c", text: "Flexible Angebote sind wichtig. Trotzdem brauchen Vereine auch Personen, die langfristig Verantwortung tragen. Dafür müssen Aufgaben klar beschrieben und gut verteilt sein." },
      { speakerId: "a", text: "Spielt Anerkennung eine Rolle? Manche Städte vergeben Karten mit Rabatten für Ehrenamtliche." },
      { speakerId: "b", text: "Ein Rabatt ist nett, aber nicht der Hauptgrund. Wichtiger ist, dass jemand ehrlich Danke sagt und zeigt, was durch die Hilfe erreicht wurde." },
      { speakerId: "c", text: "Da stimme ich zu. Außerdem brauchen Freiwillige Fortbildungen. Wer zum Beispiel eine Jugendgruppe leitet, möchte wissen, wie man Konflikte löst." },
      { speakerId: "a", text: "Oft hört man, junge Leute hätten kein Interesse mehr." },
      { speakerId: "c", text: "Das stimmt so nicht. Sie engagieren sich anders, häufig projektbezogen und digital. Vereine müssen ihre Kommunikation anpassen." },
      { speakerId: "b", text: "Genau. Unsere erfolgreichste Aktion wurde von zwei Schülerinnen über soziale Medien organisiert. Aber persönliche Treffen bleiben wichtig, damit Vertrauen entsteht." },
      { speakerId: "a", text: "Was sollte eine Person tun, die heute anfangen möchte?" },
      { speakerId: "b", text: "Nicht zehn Angebote gleichzeitig suchen. Lieber ein Thema wählen, das wirklich interessiert, und einen Termin ausprobieren." },
      { speakerId: "c", text: "Und vorher fragen, wie viel Zeit erwartet wird. Klare Absprachen verhindern Enttäuschungen auf beiden Seiten." },
    ],
  }, [
    { prompt: "Auch seltene Hilfe kann ein sinnvoller Anfang sein.", correctAnswer: "b", explanation: "Jana beschreibt monatliche Einzelaufgaben als Einstieg.", evidence: "Sie betont, dass nicht jede Hilfe wöchentlich sein muss.", skillTags: ["speaker-attribution", "discussion"] },
    { prompt: "Vereine brauchen ebenfalls Menschen mit dauerhafter Verantwortung.", correctAnswer: "c", explanation: "Lukas ergänzt die Bedeutung langfristiger Rollen.", evidence: "Er stellt flexible Hilfe und dauerhafte Verantwortung gegenüber.", skillTags: ["speaker-attribution", "opinion"] },
    { prompt: "Materielle Vorteile sind nicht die wichtigste Anerkennung.", correctAnswer: "b", explanation: "Jana hält Dank und sichtbare Wirkung für wichtiger als Rabatte.", evidence: "Sie nennt einen Rabatt nur nett, nicht entscheidend.", skillTags: ["speaker-attribution", "attitude"] },
    { prompt: "Freiwillige sollten passende Weiterbildung erhalten.", correctAnswer: "c", explanation: "Lukas fordert Fortbildungen für verantwortliche Aufgaben.", evidence: "Als Beispiel nennt er Konfliktlösung in Jugendgruppen.", skillTags: ["speaker-attribution", "recommendation"] },
    { prompt: "Die Diskussion stellt ein verbreitetes negatives Urteil über junge Menschen zur Frage.", correctAnswer: "a", explanation: "Die Moderatorin bringt dieses Urteil als Diskussionsfrage ein.", evidence: "Sie sagt, man höre oft, junge Menschen hätten kein Interesse.", skillTags: ["speaker-attribution", "speaker-intent"] },
    { prompt: "Digitale Organisation kann junge Menschen erfolgreich erreichen.", correctAnswer: "b", explanation: "Jana berichtet von einer erfolgreichen Social-Media-Aktion zweier Schülerinnen.", evidence: "Ihr konkretes Beispiel belegt die Aussage.", skillTags: ["speaker-attribution", "detail"] },
    { prompt: "Anfänger sollten sich zunächst auf ein interessantes Thema konzentrieren.", correctAnswer: "b", explanation: "Jana empfiehlt einen begrenzten, interessengeleiteten Start.", evidence: "Sie rät davon ab, zehn Angebote gleichzeitig zu suchen.", skillTags: ["speaker-attribution", "recommendation"] },
    { prompt: "Zeitliche Erwartungen sollten vor Beginn geklärt werden.", correctAnswer: "c", explanation: "Lukas empfiehlt klare Absprachen über den Zeitaufwand.", evidence: "Damit sollen Enttäuschungen verhindert werden.", skillTags: ["speaker-attribution", "recommendation"] },
  ]),
]);

const form2Id = "de-b1-listening-form-002";
const form2 = makeListeningForm(form2Id, "Listening Form 2", [
  buildPart1(form2Id, [
    {
      title: "Library reservation notice", durationSeconds: 37,
      speakers: [speaker("a", "Bibliotheksmitarbeiter", "voice-male-2")],
      segments: [{ speakerId: "a", text: "Guten Tag, Stadtbibliothek Süd hier. Das von Ihnen reservierte Buch über Stadtgärten ist angekommen und liegt bis Freitagabend am Informationsschalter bereit. Unsere Automaten sind diese Woche außer Betrieb, deshalb können Sie es nur während der Öffnungszeiten abholen. Am Donnerstag schließen wir ausnahmsweise schon um sechzehn Uhr." }],
      trueFalse: { prompt: "Das reservierte Buch ist jetzt verfügbar.", correctAnswer: "true", explanation: "Das Buch ist angekommen und liegt bereit.", evidence: "Es kann bis Freitag am Informationsschalter abgeholt werden.", skillTags: ["announcement", "detail"] },
      multipleChoice: { prompt: "Warum ist die Abholung nur während der Öffnungszeiten möglich?", options: ["Der Informationsschalter wird umgebaut.", "Die Automaten funktionieren nicht.", "Das Buch darf das Gebäude nicht verlassen."], correctAnswer: "b", explanation: "Die Rückgabe- und Ausleihautomaten sind außer Betrieb.", evidence: "Deshalb muss der Schalter genutzt werden.", skillTags: ["reason", "detail"] },
    },
    {
      title: "Tram service announcement", durationSeconds: 40,
      speakers: [speaker("a", "Verkehrssprecherin", "voice-female-2")],
      segments: [{ speakerId: "a", text: "Wegen Bauarbeiten fährt die Straßenbahnlinie sechs am Samstag nur zwischen Hauptbahnhof und Theaterplatz. Für den Abschnitt bis zum Stadion stehen Ersatzbusse bereit. Diese halten jedoch nicht an der Universität. Fahrgäste dorthin nehmen bitte ab Theaterplatz die Buslinie vierundzwanzig. Ab Sonntag gilt wieder der normale Fahrplan." }],
      trueFalse: { prompt: "Die Einschränkung gilt das ganze Wochenende.", correctAnswer: "false", explanation: "Nur am Samstag ist der Verkehr eingeschränkt.", evidence: "Am Sonntag gilt wieder der normale Plan.", skillTags: ["announcement", "number-time"] },
      multipleChoice: { prompt: "Wie erreicht man am Samstag die Universität?", options: ["mit dem Ersatzbus", "mit der Buslinie 24", "mit der Straßenbahnlinie 6"], correctAnswer: "b", explanation: "Der Ersatzbus hält dort nicht; Linie 24 ist die Alternative.", evidence: "Der Umstieg erfolgt am Theaterplatz.", skillTags: ["sequence", "detail"] },
    },
    {
      title: "Fitness course update", durationSeconds: 39,
      speakers: [speaker("a", "Kursleiter", "voice-male-1")],
      segments: [{ speakerId: "a", text: "Hallo, hier ist Ben vom Aktivzentrum. Unser Rückenkurs morgen findet statt, aber nicht wie üblich um achtzehn Uhr. Die Trainerin kommt von einer Fortbildung zurück und kann erst um neunzehn Uhr beginnen. Wir treffen uns außerdem im Gymnastikraum im Erdgeschoss. Wenn der neue Termin für Sie nicht passt, melden Sie sich bitte bis morgen Mittag." }],
      trueFalse: { prompt: "Der Rückenkurs wird abgesagt.", correctAnswer: "false", explanation: "Der Kurs findet statt, beginnt aber später.", evidence: "Die neue Startzeit ist 19 Uhr.", skillTags: ["announcement", "detail"] },
      multipleChoice: { prompt: "Bis wann soll man sich bei einem Problem melden?", options: ["heute Abend", "morgen Mittag", "nach dem Kurs"], correctAnswer: "b", explanation: "Die Rückmeldung soll bis morgen Mittag erfolgen.", evidence: "Dieser Zeitpunkt wird am Ende der Nachricht genannt.", skillTags: ["number-time", "speaker-intent"] },
    },
    {
      title: "Personal voice message", durationSeconds: 43,
      speakers: [speaker("a", "Freundin", "voice-female-1")],
      segments: [{ speakerId: "a", text: "Hi Leo, ich habe die Karten für das Konzert abgeholt. Einlass ist schon um halb sieben, nicht erst um sieben. Lass uns deshalb um sechs vor dem Café neben der Halle treffen. Ich komme direkt von der Arbeit und habe keine Zeit mehr zu essen. Vielleicht können wir dort noch schnell eine Suppe nehmen. Ruf mich nur an, wenn du später kommst." }],
      trueFalse: { prompt: "Die Freundin möchte sich um sieben Uhr treffen.", correctAnswer: "false", explanation: "Das Treffen ist bereits um 18 Uhr.", evidence: "Der Einlass beginnt um halb sieben.", skillTags: ["number-time", "conversation"] },
      multipleChoice: { prompt: "Was möchte sie vor dem Konzert tun?", options: ["die Karten kaufen", "etwas essen", "nach Hause fahren"], correctAnswer: "b", explanation: "Sie schlägt eine schnelle Suppe im Café vor.", evidence: "Die Karten hat sie schon abgeholt.", skillTags: ["plan", "detail"] },
    },
    {
      title: "Water service notification", durationSeconds: 36,
      speakers: [speaker("a", "Servicemitarbeiter", "voice-male-2")],
      segments: [{ speakerId: "a", text: "Information der Stadtwerke: In der Gartenstraße wird am Dienstag eine beschädigte Leitung ausgetauscht. Zwischen acht und ungefähr dreizehn Uhr steht deshalb kein Wasser zur Verfügung. Bitte schließen Sie vorher alle Wasserhähne und lassen Sie Wasch- und Spülmaschinen ausgeschaltet. Danach kann das Wasser kurz trüb sein, ist aber gesundheitlich unbedenklich." }],
      trueFalse: { prompt: "Am Dienstagvormittag wird das Wasser abgestellt.", correctAnswer: "true", explanation: "Die Unterbrechung dauert von 8 bis ungefähr 13 Uhr.", evidence: "Grund ist der Austausch einer beschädigten Leitung.", skillTags: ["announcement", "number-time"] },
      multipleChoice: { prompt: "Was sollen Bewohner vor der Unterbrechung tun?", options: ["Maschinen ausschalten", "Wasserleitungen öffnen", "die Stadtwerke anrufen"], correctAnswer: "a", explanation: "Wasch- und Spülmaschinen sollen ausgeschaltet bleiben.", evidence: "Außerdem sollen alle Wasserhähne geschlossen werden.", skillTags: ["speaker-intent", "detail"] },
    },
  ]),
  buildPart2(form2Id, {
    title: "Orientation for a museum night", durationSeconds: 215,
    speakers: [speaker("a", "Veranstaltungskoordinator", "voice-male-1")],
    segments: [{ speakerId: "a", text: "Guten Abend an alle freiwilligen Helferinnen und Helfer der Museumsnacht. Bevor die ersten Gäste kommen, erkläre ich kurz den Ablauf. Die Türen öffnen um achtzehn Uhr, aber Besucher mit Familienticket dürfen schon eine halbe Stunde früher hinein. Bitte tragen Sie während des gesamten Abends das gelbe Namensschild, damit man Sie leicht erkennt. Im Erdgeschoss beginnt jede volle Stunde eine Führung durch die neue Fotoausstellung. Die Gruppen dürfen höchstens zwanzig Personen haben. Sobald eine Gruppe voll ist, geben Sie den Wartenden bitte eine Karte für die nächste Führung. Im zweiten Stock findet um zwanzig und um zweiundzwanzig Uhr ein Gespräch mit der Fotografin statt. Dafür ist keine Anmeldung nötig, doch im Saal stehen nur achtzig Plätze zur Verfügung. Das Café bleibt bis Mitternacht geöffnet. Helfer erhalten dort ein kostenloses Getränk und ab einundzwanzig Uhr auch eine warme Suppe. Wer eine Pause braucht, benutzt bitte den Personalraum hinter der Garderobe; die Stühle im Eingangsbereich müssen für ältere Gäste frei bleiben. Falls jemand einen Gegenstand verliert, schicken Sie die Person nicht direkt ins Büro. Sammeln Sie zunächst Name und Telefonnummer auf dem Formular am Empfang. Gefundene Sachen werden dort in einer verschlossenen Box aufbewahrt. Bei medizinischen Problemen rufen Sie über das interne Telefon die Nummer neun an. Versuchen Sie nicht, allein Erste Hilfe zu leisten, wenn Sie dafür nicht ausgebildet sind. Um halb eins schließen wir die Ausstellungen. Danach helfen alle Teams noch etwa zwanzig Minuten beim Aufräumen. Die letzte Straßenbahn Richtung Zentrum fährt um ein Uhr fünf vor dem Museum ab." }],
  }, [
    { prompt: "Wer darf vor achtzehn Uhr ins Museum?", options: ["alle freiwilligen Helfer", "Gäste mit Familienticket", "nur angemeldete Gruppen"], correctAnswer: "b", explanation: "Familientickets erlauben den Eintritt eine halbe Stunde früher.", evidence: "Die allgemeine Öffnung beginnt um 18 Uhr.", skillTags: ["number-time", "detail"] },
    { prompt: "Was geschieht, wenn eine Führung voll ist?", options: ["Die Führung startet sofort.", "Die Gruppe wird vergrößert.", "Wartende erhalten einen späteren Termin."], correctAnswer: "c", explanation: "Eine Karte verweist auf die nächste Führung.", evidence: "Pro Führung sind höchstens zwanzig Personen vorgesehen.", skillTags: ["sequence", "detail"] },
    { prompt: "Wo können Helfer Pause machen?", options: ["im Personalraum", "im Saal im zweiten Stock", "auf den Stühlen am Eingang"], correctAnswer: "a", explanation: "Der Personalraum liegt hinter der Garderobe.", evidence: "Die Eingangsstühle bleiben für ältere Gäste frei.", skillTags: ["detail"] },
    { prompt: "Was ist bei verlorenen Gegenständen zuerst zu tun?", options: ["das Büro öffnen", "Kontaktdaten aufnehmen", "die Polizei verständigen"], correctAnswer: "b", explanation: "Zuerst werden Name und Telefonnummer notiert.", evidence: "Gefundene Sachen kommen anschließend in eine Box.", skillTags: ["sequence", "speaker-intent"] },
    { prompt: "Was machen die Teams nach Schließung der Ausstellungen?", options: ["Sie räumen gemeinsam auf.", "Sie besuchen die Fotoausstellung.", "Sie fahren sofort mit der Straßenbahn."], correctAnswer: "a", explanation: "Nach halb eins sind etwa zwanzig Minuten Aufräumen geplant.", evidence: "Die letzte Bahn fährt erst um 1:05 Uhr.", skillTags: ["sequence", "number-time"] },
  ]),
  buildPart3(form2Id, {
    title: "Friends organising a weekend trip", durationSeconds: 230,
    speakers: [speaker("a", "Sofia", "voice-female-2"), speaker("b", "Nils", "voice-male-2")],
    segments: [
      { speakerId: "a", text: "Nils, ich habe eine Unterkunft für unser Wochenende in Weimar gefunden. Eine kleine Ferienwohnung nahe dem Park." },
      { speakerId: "b", text: "Klingt gut. Ist sie noch frei? Das Hotel, das ich gestern gesehen habe, war schon ausgebucht." },
      { speakerId: "a", text: "Ja, aber wir müssen zwei Nächte buchen. Für eine Nacht vermietet die Besitzerin nicht. Insgesamt kostet es weniger als zwei Hotelzimmer." },
      { speakerId: "b", text: "Dann bleiben wir von Freitag bis Sonntag. Fahren wir mit meinem Auto?" },
      { speakerId: "a", text: "Lieber mit dem Zug. Mit dem Deutschlandticket kommen wir bis Erfurt, nur das letzte Stück müssen wir extra bezahlen. Parkplätze sind dort außerdem teuer." },
      { speakerId: "b", text: "Einverstanden. Am Samstag würde ich gern das Bauhaus-Museum besuchen. Man sollte die Karten vorher online kaufen." },
      { speakerId: "a", text: "Das mache ich. Ich möchte auch eine Stadtführung, aber nicht gleich am Morgen. Die Führung um elf Uhr wäre besser als die um neun." },
      { speakerId: "b", text: "Okay. Und am Sonntag könnten wir Fahrräder leihen und an der Ilm entlangfahren." },
      { speakerId: "a", text: "Nur wenn das Wetter trocken bleibt. Bei Regen würde ich lieber das Literaturmuseum besuchen." },
      { speakerId: "b", text: "Für den Abend reserviere ich einen Tisch. Ich kenne ein kleines Restaurant, aber es bietet fast nur Fleischgerichte." },
      { speakerId: "a", text: "Dann suchen wir etwas anderes. Seit einem Jahr esse ich kein Fleisch mehr. Die Wohnung hat auch eine Küche; notfalls kochen wir selbst." },
      { speakerId: "b", text: "Stimmt. Ich frage noch Lea, ob sie mitkommt. Dann müssten wir aber bald wissen, ob es ein drittes Bett gibt." },
    ],
  }, [
    { prompt: "Das zuerst gefundene Hotel hat noch Zimmer frei.", correctAnswer: "false", explanation: "Das Hotel war bereits ausgebucht.", evidence: "Sofia schlägt stattdessen eine Ferienwohnung vor.", skillTags: ["detail", "conversation"] },
    { prompt: "Die Ferienwohnung muss für mindestens zwei Nächte gebucht werden.", correctAnswer: "true", explanation: "Eine einzelne Nacht ist nicht möglich.", evidence: "Die Besitzerin verlangt eine Buchung für zwei Nächte.", skillTags: ["detail"] },
    { prompt: "Sofia möchte mit dem Auto fahren.", correctAnswer: "false", explanation: "Sie bevorzugt den Zug.", evidence: "Sie verweist auf das Deutschlandticket und teure Parkplätze.", skillTags: ["opinion", "reason"] },
    { prompt: "Nils möchte Eintrittskarten für das Bauhaus-Museum online kaufen.", correctAnswer: "true", explanation: "Er empfiehlt den Onlinekauf; Sofia übernimmt ihn.", evidence: "Die Karten sollen vor dem Besuch gekauft werden.", skillTags: ["plan", "detail"] },
    { prompt: "Die beiden wählen die Stadtführung um neun Uhr.", correctAnswer: "false", explanation: "Sofia bevorzugt die Führung um elf Uhr.", evidence: "Sie möchte nicht gleich am Morgen starten.", skillTags: ["number-time", "opinion"] },
    { prompt: "Die Fahrradtour hängt vom Wetter ab.", correctAnswer: "true", explanation: "Bei Regen ist ein Museumsbesuch vorgesehen.", evidence: "Nur bei trockenem Wetter wollen sie Rad fahren.", skillTags: ["reason", "plan"] },
    { prompt: "Sofia isst seit einem Jahr kein Fleisch.", correctAnswer: "true", explanation: "Sie erklärt ausdrücklich ihre Ernährungsweise.", evidence: "Darum passt Nils' erstes Restaurant nicht.", skillTags: ["experience", "detail"] },
  ]),
  buildPart4(form2Id, {
    title: "Discussion: permanent home office", durationSeconds: 295,
    speakers: [speaker("a", "Moderator", "voice-male-1"), speaker("b", "Eva", "voice-female-1"), speaker("c", "Mehmet", "voice-male-2")],
    segments: [
      { speakerId: "a", text: "Heute sprechen wir über dauerhaftes Homeoffice. Eva leitet ein digitales Team, Mehmet vertritt Beschäftigte in einem Industriebetrieb." },
      { speakerId: "b", text: "In meinem Team funktioniert die Arbeit zu Hause sehr gut. Wir sparen lange Wege und können konzentrierte Aufgaben flexibel planen." },
      { speakerId: "c", text: "Das gilt nicht für alle Berufe. In der Produktion muss man vor Ort sein. Wenn nur Büroangestellte zu Hause bleiben dürfen, entsteht schnell ein Gefühl von Ungleichheit." },
      { speakerId: "a", text: "Wie bleibt ein Team miteinander in Kontakt?" },
      { speakerId: "b", text: "Wir treffen uns jeden Morgen fünfzehn Minuten online. Zusätzlich gibt es einmal pro Monat einen gemeinsamen Tag im Büro. Komplett ohne persönliche Treffen würde ich es nicht machen." },
      { speakerId: "c", text: "Solche festen Treffen finde ich sinnvoll. Problematisch wird es, wenn Beschäftigte zu Hause keinen ruhigen Raum haben oder ihre privaten Kosten selbst tragen." },
      { speakerId: "a", text: "Sollte der Arbeitgeber also Ausstattung bezahlen?" },
      { speakerId: "c", text: "Ja, mindestens Bildschirm, Stuhl und einen Zuschuss zu Internet und Strom. Sonst spart die Firma auf Kosten der Mitarbeitenden." },
      { speakerId: "b", text: "Bei uns gibt es ein Budget für Möbel. Viel wichtiger ist aber Vertrauen. Wer ständig kontrolliert wird, arbeitet weder im Büro noch zu Hause besonders gut." },
      { speakerId: "a", text: "Manche Führungskräfte fürchten, neue Mitarbeitende könnten schwerer lernen." },
      { speakerId: "b", text: "Dafür braucht man ein geplantes digitales Einarbeitungsprogramm und eine feste Kontaktperson. Nur Dokumente zu schicken reicht tatsächlich nicht." },
      { speakerId: "c", text: "Und die Wahl muss freiwillig bleiben. Niemand sollte dauerhaft allein zu Hause arbeiten müssen. Ein gemischtes Modell ist für viele gerechter." },
    ],
  }, [
    { prompt: "Das Thema der Diskussion wird eingeführt und die Gäste werden vorgestellt.", correctAnswer: "a", explanation: "Der Moderator eröffnet das Gespräch und nennt die Rollen.", evidence: "Diese Funktion übernimmt er im ersten Beitrag.", skillTags: ["speaker-attribution", "speaker-intent"] },
    { prompt: "Lange Arbeitswege können durch Homeoffice vermieden werden.", correctAnswer: "b", explanation: "Eva nennt eingesparte Wege als Vorteil.", evidence: "Sie verbindet dies mit flexibler Planung.", skillTags: ["speaker-attribution", "opinion"] },
    { prompt: "Unterschiedliche Berufe können bei der Homeoffice-Regelung ungleich behandelt werden.", correctAnswer: "c", explanation: "Mehmet vergleicht Produktion und Büroarbeit.", evidence: "Er warnt vor einem Gefühl der Ungleichheit.", skillTags: ["speaker-attribution", "attitude"] },
    { prompt: "Persönliche Treffen sollten trotz digitaler Arbeit stattfinden.", correctAnswer: "b", explanation: "Eva plant monatliche gemeinsame Bürotage.", evidence: "Ganz ohne persönliche Treffen möchte sie nicht arbeiten.", skillTags: ["speaker-attribution", "recommendation"] },
    { prompt: "Private Arbeitsbedingungen und zusätzliche Kosten können problematisch sein.", correctAnswer: "c", explanation: "Mehmet nennt fehlenden Raum und private Kosten.", evidence: "Er fordert später Ausstattung und Zuschüsse.", skillTags: ["speaker-attribution", "reason"] },
    { prompt: "Vertrauen ist wichtiger als ständige Kontrolle.", correctAnswer: "b", explanation: "Eva spricht sich ausdrücklich gegen ständige Kontrolle aus.", evidence: "Sie hält Vertrauen für zentral.", skillTags: ["speaker-attribution", "attitude"] },
    { prompt: "Neue Beschäftigte brauchen mehr als zugesandte Dokumente.", correctAnswer: "b", explanation: "Eva fordert ein Programm und eine feste Kontaktperson.", evidence: "Dokumente allein hält sie für unzureichend.", skillTags: ["speaker-attribution", "recommendation"] },
    { prompt: "Die Entscheidung für Homeoffice sollte freiwillig bleiben.", correctAnswer: "c", explanation: "Mehmet lehnt erzwungene dauerhafte Heimarbeit ab.", evidence: "Er bevorzugt für viele ein gemischtes Modell.", skillTags: ["speaker-attribution", "opinion"] },
  ]),
]);

const form3Id = "de-b1-listening-form-003";
const form3 = makeListeningForm(form3Id, "Listening Form 3", [
  buildPart1(form3Id, [
    {
      title: "Parcel pickup message", durationSeconds: 36,
      speakers: [speaker("a", "Paketshopmitarbeiterin", "voice-female-2")],
      segments: [{ speakerId: "a", text: "Guten Tag, hier ist der Paketshop am Markt. Ihr großes Paket liegt seit Montag bei uns. Da unser Lager sehr voll ist, können wir es nur noch bis morgen aufbewahren. Bitte holen Sie es bis neunzehn Uhr ab und bringen Sie einen Ausweis mit. Eine andere Person darf das Paket nur mit Ihrer schriftlichen Vollmacht abholen." }],
      trueFalse: { prompt: "Das Paket kann noch bis nächste Woche gelagert werden.", correctAnswer: "false", explanation: "Die Abholung muss spätestens morgen erfolgen.", evidence: "Das volle Lager verhindert eine längere Aufbewahrung.", skillTags: ["announcement", "number-time"] },
      multipleChoice: { prompt: "Was braucht eine andere Person für die Abholung?", options: ["eine schriftliche Vollmacht", "die Bestellbestätigung", "eine zusätzliche Gebühr"], correctAnswer: "a", explanation: "Eine Vertretung benötigt eine schriftliche Vollmacht.", evidence: "Der Ausweis wird für die reguläre Abholung genannt.", skillTags: ["detail", "speaker-intent"] },
    },
    {
      title: "Evening course message", durationSeconds: 40,
      speakers: [speaker("a", "Kursleiterin", "voice-female-1")],
      segments: [{ speakerId: "a", text: "Hallo zusammen, eine kurze Nachricht zum Computerkurs am Mittwoch. Wir beginnen diesmal eine halbe Stunde früher, also um siebzehn Uhr dreißig. Im ersten Teil üben wir Tabellen, danach können Sie eigene Fragen mitbringen. Die Laptops im Kursraum reichen für alle. Sie brauchen nur einen USB-Stick, wenn Sie Ihre Ergebnisse mitnehmen möchten." }],
      trueFalse: { prompt: "Der Computerkurs beginnt später als sonst.", correctAnswer: "false", explanation: "Der Kurs beginnt eine halbe Stunde früher.", evidence: "Die neue Uhrzeit ist 17:30 Uhr.", skillTags: ["number-time", "announcement"] },
      multipleChoice: { prompt: "Was sollen Teilnehmende bei Bedarf mitbringen?", options: ["einen Laptop", "einen USB-Stick", "eine Tabelle"], correctAnswer: "b", explanation: "Ein USB-Stick ist für das Mitnehmen der Ergebnisse sinnvoll.", evidence: "Laptops sind im Raum für alle vorhanden.", skillTags: ["detail", "speaker-intent"] },
    },
    {
      title: "Parking information", durationSeconds: 35,
      speakers: [speaker("a", "Veranstaltungssprecher", "voice-male-1")],
      segments: [{ speakerId: "a", text: "Hinweis für Besucher des Herbstmarkts: Der Parkplatz direkt am Rathaus ist heute für Händler reserviert. Kostenlose Parkplätze finden Sie an der Sporthalle. Von dort fährt alle fünfzehn Minuten ein Kleinbus zum Markt. Fahrräder können wie gewohnt am Haupteingang abgestellt werden." }],
      trueFalse: { prompt: "Besucher dürfen am Rathaus kostenlos parken.", correctAnswer: "false", explanation: "Der Rathausparkplatz ist den Händlern vorbehalten.", evidence: "Kostenlose Besucherparkplätze liegen an der Sporthalle.", skillTags: ["announcement", "detail"] },
      multipleChoice: { prompt: "Wie kommen Besucher von der Sporthalle zum Markt?", options: ["mit einem Kleinbus", "mit der Straßenbahn", "mit einem Leihfahrrad"], correctAnswer: "a", explanation: "Ein Kleinbus fährt regelmäßig zum Markt.", evidence: "Er verkehrt alle fünfzehn Minuten.", skillTags: ["sequence", "number-time"] },
    },
    {
      title: "Local radio cultural tip", durationSeconds: 42,
      speakers: [speaker("a", "Radiomoderatorin", "voice-female-2")],
      segments: [{ speakerId: "a", text: "Unser Kulturtipp für heute: Im alten Kino zeigt der Filmverein um zwanzig Uhr einen österreichischen Dokumentarfilm über Berghütten. Regisseurin Paula Kern beantwortet danach Fragen aus dem Publikum. Karten kosten neun Euro. Schülerinnen, Studenten und Rentner zahlen mit Nachweis sechs Euro. Die Bar öffnet bereits eine Stunde vor dem Film." }],
      trueFalse: { prompt: "Nach dem Film gibt es ein Gespräch mit der Regisseurin.", correctAnswer: "true", explanation: "Paula Kern beantwortet anschließend Fragen.", evidence: "Das Gespräch findet nach dem Dokumentarfilm statt.", skillTags: ["announcement", "sequence"] },
      multipleChoice: { prompt: "Wann öffnet die Bar?", options: ["um neunzehn Uhr", "um zwanzig Uhr", "nach dem Film"], correctAnswer: "a", explanation: "Die Bar öffnet eine Stunde vor dem Filmstart um 20 Uhr.", evidence: "Daraus ergibt sich 19 Uhr.", skillTags: ["number-time", "inference"] },
    },
    {
      title: "Building maintenance voicemail", durationSeconds: 39,
      speakers: [speaker("a", "Hausverwalter", "voice-male-2")],
      segments: [{ speakerId: "a", text: "Guten Tag, Hausverwaltung Winter. Die Kontrolle der Rauchmelder in Ihrem Haus findet nicht am Montag, sondern am Dienstag zwischen neun und zwölf Uhr statt. Sie müssen nicht die ganze Zeit zu Hause bleiben. Hinterlassen Sie den Schlüssel bei einer Nachbarin oder vereinbaren Sie bis Freitag telefonisch einen festen Termin mit uns." }],
      trueFalse: { prompt: "Die Rauchmelder werden am Dienstag kontrolliert.", correctAnswer: "true", explanation: "Der Termin wurde von Montag auf Dienstag verschoben.", evidence: "Das Zeitfenster liegt zwischen 9 und 12 Uhr.", skillTags: ["announcement", "number-time"] },
      multipleChoice: { prompt: "Was kann man tun, wenn man nicht zu Hause ist?", options: ["die Kontrolle ablehnen", "den Schlüssel bei einer Nachbarin lassen", "den Rauchmelder selbst prüfen"], correctAnswer: "b", explanation: "Eine Nachbarin kann den Schlüssel aufbewahren.", evidence: "Alternativ kann telefonisch ein fester Termin vereinbart werden.", skillTags: ["recommendation", "detail"] },
    },
  ]),
  buildPart2(form3Id, {
    title: "Welcome to a community garden", durationSeconds: 210,
    speakers: [speaker("a", "Gartenkoordinatorin", "voice-female-1")],
    segments: [{ speakerId: "a", text: "Herzlich willkommen im Gemeinschaftsgarten Sonnenfeld. Schön, dass Sie beim Einführungstreffen dabei sind. Unser Garten gehört nicht einzelnen Personen; alle Mitglieder pflegen die Flächen gemeinsam und teilen später die Ernte. Geöffnet ist täglich von sieben Uhr bis Sonnenuntergang. Der Zahlencode für das Tor ändert sich jeden Monat und steht im internen Newsletter. Bitte geben Sie ihn nicht an Besucher weiter. Neue Mitglieder beginnen in den ersten vier Wochen im sogenannten Gartenteam. Dort lernen Sie, welche Pflanzen gerade gepflegt werden müssen und wo Werkzeug liegt. Eigene Geräte müssen Sie nicht mitbringen. Nach der Arbeit werden Spaten, Scheren und Gießkannen gereinigt und in den markierten Schuppen zurückgestellt. Wasser ist kostbar. Verwenden Sie deshalb morgens möglichst das gesammelte Regenwasser aus den großen Behältern. Nur wenn diese leer sind, öffnen Sie den normalen Wasseranschluss. Jeden zweiten Samstag treffen wir uns von zehn bis ungefähr dreizehn Uhr zu einer gemeinsamen Aktion. Dann bauen wir Wege, reparieren Beete oder schneiden Sträucher. Wer nicht kommen kann, trägt sich vorher aus der Liste aus. Mindestens einmal pro Monat sollte jedes Mitglied teilnehmen. Kinder sind willkommen, dürfen aber nicht allein im Werkzeugbereich spielen. Hunde bleiben außerhalb des Gartens, weil wir Lebensmittel anbauen. Im kleinen Holzhaus finden Sie eine Küche und ein Regal zum Tauschen von Samen. Lebensmittel aus der Ernte werden nicht verkauft. Ein Teil geht an alle Mitglieder, der Rest wird am Monatsende an die lokale Tafel gespendet. Fragen können Sie jederzeit in unserer Gruppen-App stellen. Dringende Schäden melden Sie bitte zusätzlich telefonisch." }],
  }, [
    { prompt: "Wie werden die Gartenflächen genutzt?", options: ["Jedes Mitglied besitzt ein eigenes Beet.", "Alle pflegen sie gemeinsam.", "Nur das Gartenteam darf sie betreten."], correctAnswer: "b", explanation: "Flächen und Ernte werden gemeinschaftlich organisiert.", evidence: "Einzelne Personen besitzen keine eigenen Bereiche.", skillTags: ["main-idea", "detail"] },
    { prompt: "Wo erfahren Mitglieder den aktuellen Torcode?", options: ["im monatlichen Newsletter", "am Gartentor", "in der öffentlichen Zeitung"], correctAnswer: "a", explanation: "Der Code wird intern im Newsletter veröffentlicht.", evidence: "Er ändert sich monatlich und darf nicht weitergegeben werden.", skillTags: ["detail", "number-time"] },
    { prompt: "Welches Wasser soll zuerst benutzt werden?", options: ["Trinkwasser aus der Küche", "Wasser aus dem normalen Anschluss", "gesammeltes Regenwasser"], correctAnswer: "c", explanation: "Regenwasser hat Vorrang.", evidence: "Der Anschluss wird erst bei leeren Behältern genutzt.", skillTags: ["sequence", "recommendation"] },
    { prompt: "Wie oft soll man mindestens an einer gemeinsamen Aktion teilnehmen?", options: ["einmal pro Woche", "einmal pro Monat", "jeden zweiten Monat"], correctAnswer: "b", explanation: "Mindestens eine monatliche Teilnahme wird erwartet.", evidence: "Die Aktionen selbst finden jeden zweiten Samstag statt.", skillTags: ["number-time", "detail"] },
    { prompt: "Was geschieht mit einem Teil der Ernte?", options: ["Er wird auf dem Markt verkauft.", "Er wird an eine soziale Einrichtung gespendet.", "Er bleibt im Holzhaus."], correctAnswer: "b", explanation: "Der Rest der Ernte geht an die lokale Tafel.", evidence: "Verkauft werden die Lebensmittel ausdrücklich nicht.", skillTags: ["purpose", "detail"] },
  ]),
  buildPart3(form3Id, {
    title: "Neighbours discussing a weekly market", durationSeconds: 220,
    speakers: [speaker("a", "Elena", "voice-female-2"), speaker("b", "Ralf", "voice-male-1")],
    segments: [
      { speakerId: "a", text: "Ralf, hast du den Brief von der Stadt gelesen? Der Wochenmarkt soll ab Mai auf den Platz vor unserem Haus ziehen." },
      { speakerId: "b", text: "Ja. Ich finde die Idee eigentlich gut. Im alten Gewerbegebiet war der Markt ohne Auto kaum erreichbar." },
      { speakerId: "a", text: "Das stimmt, aber hier beginnt der Aufbau schon um sechs Uhr morgens. Ich arbeite oft spät und habe Sorge wegen des Lärms." },
      { speakerId: "b", text: "Im Brief steht, dass die Händler erst ab sieben ihre Fahrzeuge entladen dürfen. Vorher werden nur die leeren Stände aufgebaut." },
      { speakerId: "a", text: "Das ist etwas besser. Wo sollen die Anwohner am Markttag parken? Der ganze Platz wird gesperrt." },
      { speakerId: "b", text: "Wir bekommen kostenlose Plätze im Parkhaus an der Bahnhofstraße. Es ist fünf Minuten zu Fuß, aber schwere Einkäufe werden dann umständlich." },
      { speakerId: "a", text: "Ich habe sowieso kein Auto. Für mich ist es praktisch, frisches Gemüse direkt vor der Tür zu kaufen." },
      { speakerId: "b", text: "Und die Bäckerei an der Ecke hofft auf mehr Kunden. Der Besitzer möchte draußen zusätzliche Tische aufstellen." },
      { speakerId: "a", text: "Hoffentlich bleibt der Platz sauber. Nach dem Straßenfest lag überall Müll." },
      { speakerId: "b", text: "Diesmal muss jeder Händler seinen Bereich reinigen. Die Stadt kontrolliert das nach Marktschluss." },
      { speakerId: "a", text: "Dann sollten wir es ausprobieren. Der Markt ist zunächst nur für sechs Monate geplant. Danach können die Anwohner Rückmeldung geben." },
      { speakerId: "b", text: "Genau. Ich gehe nächste Woche zur Informationsveranstaltung und frage noch nach den Fahrradständern." },
    ],
  }, [
    { prompt: "Der Wochenmarkt soll im Mai an einen neuen Ort ziehen.", correctAnswer: "true", explanation: "Der neue Platz liegt vor dem Wohnhaus.", evidence: "Elena nennt den Start im Mai.", skillTags: ["detail", "number-time"] },
    { prompt: "Ralf fand den alten Markt gut mit öffentlichen Verkehrsmitteln erreichbar.", correctAnswer: "false", explanation: "Er sagt, ohne Auto sei er kaum erreichbar gewesen.", evidence: "Das ist ein Grund für seine positive Haltung zum Umzug.", skillTags: ["opinion", "reason"] },
    { prompt: "Händler dürfen ihre Fahrzeuge ab sechs Uhr entladen.", correctAnswer: "false", explanation: "Das Entladen ist erst ab sieben Uhr erlaubt.", evidence: "Um sechs werden nur leere Stände aufgebaut.", skillTags: ["number-time", "detail"] },
    { prompt: "Anwohner können an Markttagen kostenlos in einem Parkhaus parken.", correctAnswer: "true", explanation: "Kostenlose Ersatzplätze stehen an der Bahnhofstraße bereit.", evidence: "Der Weg dauert etwa fünf Minuten.", skillTags: ["detail"] },
    { prompt: "Elena fährt für ihre Einkäufe normalerweise mit dem Auto.", correctAnswer: "false", explanation: "Elena besitzt kein Auto.", evidence: "Sie freut sich über Gemüse direkt vor der Tür.", skillTags: ["experience", "detail"] },
    { prompt: "Die Händler sind für die Sauberkeit ihres Bereichs verantwortlich.", correctAnswer: "true", explanation: "Jeder Händler muss nach dem Markt reinigen.", evidence: "Die Stadt kontrolliert nach Marktschluss.", skillTags: ["detail", "rules"] },
    { prompt: "Der neue Standort wird zunächst sechs Monate getestet.", correctAnswer: "true", explanation: "Die Regelung ist zunächst befristet.", evidence: "Anschließend dürfen Anwohner Rückmeldung geben.", skillTags: ["number-time", "plan"] },
  ]),
  buildPart4(form3Id, {
    title: "Discussion: improving local public transport", durationSeconds: 290,
    speakers: [speaker("a", "Moderatorin", "voice-female-1"), speaker("b", "Clara", "voice-female-2"), speaker("c", "Jonas", "voice-male-2")],
    segments: [
      { speakerId: "a", text: "Unser Thema heute: Wie wird der öffentliche Verkehr außerhalb großer Städte attraktiver? Clara arbeitet bei einem Verkehrsverbund, Jonas engagiert sich in einer Bürgerinitiative." },
      { speakerId: "b", text: "Viele wünschen sich häufigere Busse. Ein leerer großer Bus jede halbe Stunde ist aber teuer. Deshalb testen wir kleinere Fahrzeuge, die nur nach Bestellung fahren." },
      { speakerId: "c", text: "Solche Rufbusse helfen, wenn die Buchung einfach ist. In unserem Nachbarort geht das nur per App. Ältere Menschen ohne Smartphone werden dadurch ausgeschlossen." },
      { speakerId: "a", text: "Wäre eine telefonische Bestellung die Lösung?" },
      { speakerId: "c", text: "Ja, Telefon und App sollten parallel möglich sein. Außerdem darf man nicht zwei Stunden vorher buchen müssen. Spontane Wege gehören zum Alltag." },
      { speakerId: "b", text: "Wir planen eine Frist von dreißig Minuten. Ganz ohne Vorlauf kann die Software keine sinnvollen Routen bilden. Telefonische Buchung wird es ebenfalls geben." },
      { speakerId: "a", text: "Ein weiteres Problem sind Anschlüsse an die Bahn." },
      { speakerId: "b", text: "Genau. Fahrpläne müssen aufeinander abgestimmt werden. Wir wollen Verspätungsdaten direkt an die Busfahrer senden, damit sie in bestimmten Fällen kurz warten können." },
      { speakerId: "c", text: "Das begrüße ich. Trotzdem brauchen wir auch sichere Haltestellen mit Licht und Wetterschutz. Auf dem Land wartet man manchmal lange im Dunkeln." },
      { speakerId: "a", text: "Und wie sieht es mit den Preisen aus?" },
      { speakerId: "c", text: "Ein einfaches Ticket für die ganze Region wäre hilfreich. Heute braucht man für eine kurze Fahrt über die Kreisgrenze manchmal zwei Fahrkarten." },
      { speakerId: "b", text: "Der neue Tarif kommt nächstes Jahr. Er wird nicht jede Fahrt billiger machen, aber das System verständlicher. Gute Information ist genauso wichtig wie der Preis." },
    ],
  }, [
    { prompt: "Die Gäste werden nach Lösungen für Verkehr außerhalb von Großstädten gefragt.", correctAnswer: "a", explanation: "Die Moderatorin formuliert das Thema zu Beginn.", evidence: "Sie stellt außerdem beide Gäste vor.", skillTags: ["speaker-attribution", "main-idea"] },
    { prompt: "Kleine Fahrzeuge auf Bestellung können wirtschaftlicher als leere große Busse sein.", correctAnswer: "b", explanation: "Clara erklärt den Grund für den Test kleiner Rufbusse.", evidence: "Sie nennt die Kosten häufig fahrender leerer Busse.", skillTags: ["speaker-attribution", "reason"] },
    { prompt: "Eine reine App-Lösung benachteiligt manche ältere Menschen.", correctAnswer: "c", explanation: "Jonas kritisiert die ausschließlich digitale Buchung.", evidence: "Er nennt Menschen ohne Smartphone.", skillTags: ["speaker-attribution", "attitude"] },
    { prompt: "Rufbusse sollten auch telefonisch bestellt werden können.", correctAnswer: "c", explanation: "Jonas fordert Telefon und App parallel.", evidence: "Clara bestätigt später, dass dies geplant ist.", skillTags: ["speaker-attribution", "recommendation"] },
    { prompt: "Eine kurze Vorbestellfrist ist für die Routenplanung notwendig.", correctAnswer: "b", explanation: "Clara begründet eine Frist von dreißig Minuten.", evidence: "Ohne Vorlauf kann die Software keine Route bilden.", skillTags: ["speaker-attribution", "reason"] },
    { prompt: "Busfahrer sollen bei bestimmten Bahnverspätungen informiert werden.", correctAnswer: "b", explanation: "Clara beschreibt den geplanten Datenaustausch.", evidence: "Busse könnten dadurch kurz auf Anschlussfahrgäste warten.", skillTags: ["speaker-attribution", "plan"] },
    { prompt: "Haltestellen brauchen Licht und Schutz vor schlechtem Wetter.", correctAnswer: "c", explanation: "Jonas ergänzt Anforderungen an sichere Haltestellen.", evidence: "Er verweist auf langes Warten im Dunkeln.", skillTags: ["speaker-attribution", "recommendation"] },
    { prompt: "Ein regionales Ticket sollte das Tarifsystem vereinfachen.", correctAnswer: "c", explanation: "Jonas kritisiert zwei Fahrkarten für kurze grenzüberschreitende Fahrten.", evidence: "Er wünscht ein Ticket für die ganze Region.", skillTags: ["speaker-attribution", "opinion"] },
  ]),
]);

export const listeningForms = Object.freeze([form1, form2, form3]);

export const getListeningForm = (formId) => listeningForms.find(({ id }) => id === formId) || listeningForms[0];
