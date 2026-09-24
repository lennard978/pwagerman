# Serbian A1 curriculum audit

## Status and claim boundary

The app began with 120 app-authored English–Serbian pairs across six lessons. Phase 2A adds 60 reviewed supplementary entries across nine focused domains, bringing the current total to **180**. This remains **not** an official or complete Serbian A1 exam word list. No authoritative, complete public A1 word list from the University of Belgrade Center for Serbian as a Foreign Language was confirmed during this audit.

The University of Belgrade describes its first-semester beginners' programme as CEFR A1 and states that it covers basic grammar and vocabulary for everyday communication, reading, and understanding. The Council of Europe A1 descriptor supports familiar everyday expressions, basic personal information, and simple interaction. Those sources define scope; they do not validate each pair in this app.

## Current inventory

| Lesson | Current domain | Pairs | Audit decision |
| --- | --- | ---: | --- |
| lesson-1 | Greetings and introductions | 20 | Keep all; add register metadata later |
| lesson-2 | Family and people | 20 | Keep all; broaden personal information |
| lesson-3 | Home and everyday objects | 20 | Keep all |
| lesson-4 | Food and drink | 20 | Keep all; clarify adjective/predicate context |
| lesson-5 | Numbers, time, and days | 20 | Keep all; add dates, weekend, and clock time |
| lesson-6 | Travel and places | 20 | Keep all; add directions and transport phrases |
| lesson-7 | Personal information | 7 | Added in reviewed batch 1 |
| lesson-8 | Daily routine | 7 | Added in reviewed batch 1 |
| lesson-9 | Shopping and money | 7 | Added in reviewed batch 1 |
| lesson-10 | Jobs and work | 6 | Added in reviewed batch 1 |
| lesson-11 | Weather | 6 | Added in reviewed batch 1 |
| lesson-12 | Body and basic health | 7 | Added in reviewed batch 1 |
| lesson-13 | Clothes | 6 | Added in reviewed batch 1 |
| lesson-14 | Question words | 7 | Added in reviewed batch 1 |
| lesson-15 | Common verbs | 7 | Added in reviewed batch 1 |
| **Total** |  | **180** | **120 retained, 60 added, 0 silently replaced** |

No exact duplicate English–Serbian pairs are present. Existing IDs (`lesson-N-word-N`) remain stable.

## Corrections and review flags

No target was replaced in this checkpoint because the public institutional source does not publish pair-level lexical validation. The following valid but context-sensitive pairs should receive usage/register metadata before a later vocabulary expansion:

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

After reviewed batch 1, the curriculum still lacks or under-represents:

- dates and full time expressions: months, weekend, clock time
- quantities and fuller shopping interactions
- city services and common public places
- transport questions and route directions
- weather and seasons
- colours and clothing interactions
- additional high-frequency verbs and aspect pairs
- high-frequency adjectives and opposites
- common prepositions
- essential repair and survival phrases

## Controlled expansion proposal

Plan toward **approximately 360 reviewed entries**, not an official total:

- retain the original 120 stable entries and the reviewed 60-entry first batch
- add approximately 180 further entries only in small reviewed batches
- organize entries across roughly 18 functional domains
- label every entry `sourceType: "verified"` only when a source directly supports that item; otherwise use `sourceType: "supplementary"`
- add part of speech, register, examples, and translations only after review

The number 360 is an app planning target chosen to give balanced A1 practice without uncontrolled bulk import. It is not an institutional lexical minimum or an exam guarantee.

Batch details and per-entry metadata are recorded in [`SERBIAN-A1-VOCABULARY-BATCH-1.md`](./SERBIAN-A1-VOCABULARY-BATCH-1.md).

## Grammar scope decision

The first proof lessons are:

1. Serbian Latin alphabet — topic explicitly supported by the University of Belgrade beginners' programme
2. Serbian Cyrillic alphabet — topic explicitly supported by the same programme
3. Noun gender — app-authored foundational grammar within the programme's generic “basic grammar” scope

All explanations, tables, examples, and exercises are original app-authored teaching content.
