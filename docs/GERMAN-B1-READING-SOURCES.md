# German B1 Reading — format sources and content policy

Retrieved: 2026-10-31

This module is an independent preparation tool. It is not affiliated with, approved by, or endorsed by the Goethe-Institut. All passages, advertisements, comments, rules, questions, distractors, explanations, and evidence notes in the application were written specifically for this repository. No official model-test text or question was copied.

## Primary format references

- [Goethe-Zertifikat B1 exam page](https://www.goethe.de/ins/de/de/prf/gzb1.cfm) — confirms the modular exam structure.
- [Goethe-Zertifikat B1 practice materials](https://www.goethe.de/ins/de/de/m/prf/gzb1/ueb.html) — official route to accessible model materials.
- [Accessible B1 Reading model](https://bfu.goethe.de/b1_mod/lesen.php) — used to verify the 65-minute, five-part architecture; part-level task types; item ranges; suggested times; and the one-use advertisement convention with a no-match option.
- [Goethe B1 results information](https://www.goethe.de/de/spr/prf/pes/pab1.html) — used to verify the 60/100 pass threshold and performance descriptors.
- [Current Goethe-Zertifikat B1 implementation regulations (PDF)](https://www.goethe.de/pro/relaunch/prf/de/Durchfuehrungsbestimmungen_B1.pdf) — consulted for the regulatory context.

## Implemented architecture

| Part | Original practice task | Items | Suggested time |
| --- | --- | ---: | ---: |
| 1 | Personal text; true/false statements | 6 | 10 min |
| 2 | Two press/information texts; multiple choice | 6 | 20 min |
| 3 | Seven situations and ten advertisements; matching | 7 | 10 min |
| 4 | Seven comments; binary position | 7 | 15 min |
| 5 | Rules/instructions; multiple choice | 4 | 10 min |
| **Total** |  | **30** | **65 min** |

The repository contains three complete forms, for 90 scored reading items in total. Practice mode can isolate one part without a countdown. Simulation mode applies one absolute deadline to the full module and uses the fixed raw-score conversion table in `src/exam/scoring/readingScoreTable.js`.

## Content boundaries

- German only, CEFR B1-oriented, with contemporary everyday and public-life contexts.
- No listening audio, text-to-speech control, writing evaluation, speaking evaluation, full four-module mock, or generated AI feedback is part of this phase.
- Format facts are separated from original learning content so later source updates can be audited without rewriting the forms.
