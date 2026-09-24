# Serbian A1 curriculum audit

## Status and claim boundary

The app began with 120 app-authored English–Serbian pairs across six lessons. Phases 2A, 2B, and 2C brought the reviewed inventory to 300. The final controlled Phase 2D pass adds 56 justified entries, bringing the current total to **356**. This remains **not** an official or complete Serbian A1 exam word list. No authoritative, complete public A1 word list from the University of Belgrade Center for Serbian as a Foreign Language was confirmed during this audit.

**Curated CEFR A1 Serbian vocabulary for exam preparation and everyday beginner communication.**

The University of Belgrade describes its first-semester beginners' programme as CEFR A1 and states that it covers basic grammar and vocabulary for everyday communication, reading, and understanding. The Council of Europe A1 descriptor supports familiar everyday expressions, basic personal information, and simple interaction. Those sources define scope; they do not validate each pair in this app.

## Current inventory

| Lesson | Current domain | Pairs | Audit decision |
| --- | --- | ---: | --- |
| lesson-1 | Greetings and introductions | 21 | Expanded in final audit |
| lesson-2 | Family and people | 22 | Expanded in final audit |
| lesson-3 | Home and everyday objects | 20 | Keep all |
| lesson-4 | Food and drink | 20 | Keep all; clarify adjective/predicate context |
| lesson-5 | Numbers, time, and days | 20 | Keep all; add dates, weekend, and clock time |
| lesson-6 | Travel and places | 20 | Keep all; add directions and transport phrases |
| lesson-7 | Personal information | 7 | Added in reviewed batch 1 |
| lesson-8 | Daily routine | 7 | Added in reviewed batch 1 |
| lesson-9 | Shopping and money | 7 | Added in reviewed batch 1 |
| lesson-10 | Jobs and work | 6 | Added in reviewed batch 1 |
| lesson-11 | Weather | 8 | Expanded in final audit |
| lesson-12 | Body and basic health | 11 | Expanded in final audit |
| lesson-13 | Clothes | 6 | Added in reviewed batch 1 |
| lesson-14 | Question words | 8 | Expanded in final audit |
| lesson-15 | Common verbs | 7 | Added in reviewed batch 1 |
| lesson-16 | City and public places | 11 | Expanded in final audit |
| lesson-17 | Transport | 7 | Added in reviewed batch 2 |
| lesson-18 | Directions | 7 | Added in reviewed batch 2 |
| lesson-19 | Food and drink essentials | 9 | Expanded in final audit |
| lesson-20 | Home and household | 10 | Expanded in final audit |
| lesson-21 | Common adjectives | 9 | Expanded in final audit |
| lesson-22 | Common prepositions | 11 | Expanded in final audit |
| lesson-23 | Survival phrases | 6 | Added in reviewed batch 2 |
| lesson-24 | Basic social phrases | 5 | Added in reviewed batch 2 |
| lesson-25 | More common verbs | 8 | Added in reviewed batch 3 |
| lesson-26 | Everyday actions | 7 | Added in reviewed batch 3 |
| lesson-27 | Time and frequency | 8 | Added in reviewed batch 3 |
| lesson-28 | More common adjectives | 7 | Added in reviewed batch 3 |
| lesson-29 | Needs and preferences | 6 | Added in reviewed batch 3 |
| lesson-30 | Feelings and states | 7 | Added in reviewed batch 3 |
| lesson-31 | Communication phrases | 6 | Added in reviewed batch 3 |
| lesson-32 | Common adverbs | 6 | Added in reviewed batch 3 |
| lesson-33 | Everyday connectors | 6 | Expanded in final audit |
| lesson-34 | Calendar and seasons | 23 | Added in final audit |
| lesson-35 | Colours | 7 | Added in final audit |
| **Total** |  | **356** | **300 retained, 56 added, 0 silently replaced** |

No exact duplicate English–Serbian pairs are present. Existing IDs (`lesson-N-word-N`) remain stable.

## Phase 2D final review summary

- Starting count: **300**
- Final count: **356**
- Additions: **56**
- Source classification: **356 supplementary, 0 verified**
- Entries with paired examples and translations: **171 total; 41 added in Phase 2D**
- Entries missing part-of-speech metadata: **0**
- Exact duplicate English–Serbian pairs: **0**

Additions by domain:

| Domain | Added |
| --- | ---: |
| Calendar, months, and seasons | 23 |
| Colours | 7 |
| City and public services | 4 |
| Spatial prepositions | 4 |
| Body and basic health | 4 |
| Kitchen and household | 3 |
| Weather | 2 |
| Restaurant phrases | 2 |
| Common adjectives | 2 |
| Family relations | 2 |
| Essential daytime greeting | 1 |
| Question words | 1 |
| Everyday connectors | 1 |
| **Total** | **56** |

Clarifications preserve the original source/target pairs and stable IDs:

- `lesson-3-word-8`: identifies plural-only `vrata`
- `lesson-4-word-19`: adds feminine `konobarica`
- `lesson-9-word-5`: documents imperfective `kupovati` beside perfective `kupiti`
- `lesson-16-word-6`: tightens the `pijaca` versus supermarket explanation
- `lesson-26-word-2`: documents perfective reflexive `obući se` beside `oblačiti se`
- `lesson-30-word-7`: documents the spicy-food sense of `ljut`
- original lessons 1–6 now carry explicit part-of-speech metadata without changing their IDs or translations

The final additions close the complete absence of colours and months, complete the seven-day week, add all four seasons, restore the essential `dobar dan` daytime greeting and missing grandparents, and strengthen services, restaurant interaction, emergency health vocabulary, household objects, body vocabulary, location phrases, question formation, and basic connectors.

Rejected candidates include:

- already covered meanings such as `coffee — kafa`, `milk — mleko`, `to want — želeti`, `to know — znati`, `to understand — razumeti`, `cheap — jeftin`, and `expensive — skup`
- separate cards for `kupovati` and `obući se`; concise aspect notes avoid teaching near-duplicates as interchangeable vocabulary
- ijekavian or Croatian-leaning regional alternatives that would break the app's consistent Serbian ekavian model
- slang intensifiers and lower-value advanced interrogatives
- a forced expansion to 360 after meaningful A1 gaps were already covered

`Sunday — nedelja` and `week — sedmica` include notes explaining that `nedelja` is also a common word for week. Separate targets keep Pair and multiple-choice rounds unambiguous.

The machine-checkable totals are recorded in [`SERBIAN-A1-VOCABULARY-SUMMARY.json`](./SERBIAN-A1-VOCABULARY-SUMMARY.json).

## Phase 2C review summary

- Old total: **240**
- New total: **300**
- New source classification: **60 supplementary, 0 verified**
- New entries with paired examples and translations: **60**
- Exact duplicate pairs added: **0**
- Duplicate candidates rejected during review: `to want — želeti`, `to know — znati`, `to understand — razumeti`, `to speak — govoriti`, `to work — raditi`, `to sleep — spavati`, `cheap — jeftin`, and `expensive — skup`

Context-sensitive additions document:

- imperfective `pomagati`, `otvarati`, `zatvarati`, `počinjati`, `završavati`, and `vraćati se`, with concise perfective counterparts
- reflexive `tuširati se`, `oblačiti se`, `vraćati se`, and `odmarati se`
- shorter spoken forms `sad` and `nikad`, including required negation with `nikada`
- adjective gender agreement and secondary meanings of `lak`, `težak`, `srećan`, and `slobodan`
- the common impersonal need pattern `treba mi`
- gendered polite forms `želeo bih` and `želela bih`
- formal/plural `zapišite` and its informal singular alternative `zapiši`
- adverb/adjective distinctions for `malo` and `brzo`

The detailed entry inventory is in [`SERBIAN-A1-VOCABULARY-BATCH-3.md`](./SERBIAN-A1-VOCABULARY-BATCH-3.md).

## Phase 2B review summary

- Old total: **180**
- New total: **240**
- New source classification: **60 supplementary, 0 verified**
- New entries with paired examples and translations: **33**
- Exact duplicate pairs added: **0**
- Duplicate candidates rejected during review: `coffee — kafa`, `milk — mleko`, `left — levo`, `right — desno`, `near — blizu`, `how are you? — kako si?`, and `nice to meet you — drago mi je`

Context-sensitive additions document:

- `pošta` as post office, mail, or the postal service
- `pijaca` as an open-air market rather than a supermarket
- `stajalište` as a stop versus a larger `stanica`
- formal/plural `skrenite`, `govorite`, `ponovite`, and `izvinite`, with informal singular alternatives
- polysemous `pravo`, `star`, and existing meanings of `vreme`
- adjective gender agreement
- collective-noun behavior of `povrće` and `voće`
- locative/accusative alternation with `u` and `na`
- genitive after `iz`, `bez`, `ispred`, and `iza`, and instrumental after `sa`

The detailed entry inventory is in [`SERBIAN-A1-VOCABULARY-BATCH-2.md`](./SERBIAN-A1-VOCABULARY-BATCH-2.md).

## Earlier corrections and review flags

No original target was replaced because the public institutional source does not publish pair-level lexical validation. These original context-sensitive pairs now carry usage/register metadata:

| Stable ID | Pair | Audit note |
| --- | --- | --- |
| lesson-1-word-10 | sorry — izvini | Informal singular; add formal/plural `izvinite` as a separate phrase |
| lesson-1-word-17 | welcome — dobrodošli | Plural/formal or general welcome; singular gender forms need context |
| lesson-2-word-20 | wife — supruga | Correct and neutral/formal; colloquial `žena` is context-dependent and also means woman |
| lesson-4-word-20 | delicious — ukusno | Natural predicative/adverbial use; an attributive adjective needs gender agreement |
| lesson-6-word-1 | car — auto | Common colloquial form; `automobil` is the fuller noun |
| lesson-6-word-12 | map — mapa | Correct; learners also meet `karta`, which is polysemous with ticket |
| lesson-6-word-13 | road — put | Correct but polysemous with way/journey |

These are **questionable only without context**, not established mistranslations.

## Missing or thin A1 domains

Remaining known limitations after the final audit:

- quantities and fuller shopping interactions
- clothing descriptions and shopping interactions beyond basic colours
- possessive adjectives and pronouns beyond a few examples
- transport questions and ticket-buying phrases
- numbers beyond ten and richer clock-time expressions
- fuller school, accommodation, emergency, and healthcare interaction
- receptive vocabulary breadth required by a particular course or exam provider

## Controlled expansion proposal

The controlled expansion concludes at **356 reviewed entries**, not an official total:

- retain all 356 reviewed entries and their stable IDs
- add future entries only when a concrete beginner coverage need is identified
- keep functional domains navigable and exercise rounds bounded
- label every entry `sourceType: "verified"` only when a source directly supports that item; otherwise use `sourceType: "supplementary"`
- add part of speech, register, examples, and translations only after review

The 340–360 range was an app planning target chosen to give balanced A1 practice without uncontrolled bulk import. The final count of 356 is not an institutional lexical minimum or an exam guarantee.

Batch details and per-entry metadata are recorded in [`SERBIAN-A1-VOCABULARY-BATCH-1.md`](./SERBIAN-A1-VOCABULARY-BATCH-1.md), [`SERBIAN-A1-VOCABULARY-BATCH-2.md`](./SERBIAN-A1-VOCABULARY-BATCH-2.md), and [`SERBIAN-A1-VOCABULARY-BATCH-3.md`](./SERBIAN-A1-VOCABULARY-BATCH-3.md).

## Grammar scope decision

The first proof lessons are:

1. Serbian Latin alphabet — topic explicitly supported by the University of Belgrade beginners' programme
2. Serbian Cyrillic alphabet — topic explicitly supported by the same programme
3. Noun gender — app-authored foundational grammar within the programme's generic “basic grammar” scope

All explanations, tables, examples, and exercises are original app-authored teaching content.
