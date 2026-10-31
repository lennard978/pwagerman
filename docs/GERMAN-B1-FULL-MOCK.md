# German B1 Full Practice Mock

Reviewed: 2026-10-31

## Positioning and official structure

The Goethe-Zertifikat B1 consists of four modules—Reading, Listening, Writing, and Speaking—which can be taken individually or in combination. Structural references:

- Goethe-Institut, Goethe-Zertifikat B1 exam information: https://www.goethe.de/ins/de/de/prf/gzb1.cfm
- Goethe-Institut, examination regulations / Durchführungsbestimmungen, version dated 1 September 2025: https://www.goethe.de/resources/files/pdf315/durchfuehrungsbestimmungen-goethe-zertifikat-b1-erwachsene-und-jugendliche.pdf

This application uses the neutral wording **Full B1 Practice Mock**. It is an independent preparation experience, not an official Goethe examination, certification, or administration simulation. No Goethe logo or official visual identity is used. Existing app-authored module content remains original.

## Independent results

- Reading and Listening use their existing objective 0–100 practice results and a 60-point module threshold.
- Writing and Speaking remain learner self-assessed, or explicitly show that self-assessment is incomplete.
- Results are not averaged across modules.
- The mock never stores or displays an overall numeric score or overall pass boolean.
- Completion means that all four practice modules were submitted; it does not mean that B1 was passed.

## Orchestration and history

The default app sequence is Reading → Listening → Writing → Speaking. Each mock stores only module form IDs, linked module session IDs, typed results, content/scoring versions, and orchestration status. Module engines retain their own state. Submitted module attempts are immutable within the mock. Abandoning a mock does not delete completed module attempts. Mock history is limited to the latest 20 entries.

## Listening limitation

Production Listening audio is still being prepared. Production Full Mock start is blocked until every required versioned asset is marked ready and has a checksum. Explicit non-production fixture mode may be used by automated tests, but development-only silent media cannot enable a production mock.

## Readiness methodology

Readiness indicators are categories, not a combined score:

- **Reading / Listening — Strong practice:** at least three simulations, with at least two of the latest three results meeting 60.
- **Writing / Speaking — Strong practice:** at least three simulations plus two recent complete self-assessments averaging 2 or more on the 0–3 app rubric.
- **Vocabulary — Strong practice:** at least 20 completed curriculum categories; Developing begins at 10.
- **Grammar — Strong practice:** at least 18 completed lessons; Developing begins at 8.
- Lower activity is labelled Building or Not started.

These indicators describe practice history only. They do not claim certified B1 ability, guarantee a pass, or replace qualified assessment.

Independent preparation tool. Not affiliated with or endorsed by the Goethe-Institut.
