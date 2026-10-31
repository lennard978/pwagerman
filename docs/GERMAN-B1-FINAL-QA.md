# German B1 final human and physical QA record

QA attempt date: 2026-10-31

Branch: `feature/german-b1-foundation`

Starting HEAD: `c4ac730f9e0a5c19d8945a7a2871e55771e03b49`

Overall status: **INCOMPLETE — DO NOT MERGE OR DEPLOY**

This record separates automated evidence from human and physical-device evidence. No human/native-German reviewer, Android device, or iPhone/iPad was available during this QA attempt. Automated checks do not close those gates.

## Human Listening QA

Status: **PENDING (0/24 audibly reviewed by a human)**

The complete track metadata and per-criterion review sheet are in `GERMAN-B1-LISTENING-AUDIO-QA.md`. All 24 assets remain `PENDING`. No audible defect was reported and no asset was regenerated because no human listening occurred.

## Human vocabulary QA

Status: **HUMAN CONTENT QA PARTIAL — native/expert review not performed**

The deterministic audit artifact `GERMAN-B1-VOCABULARY-AUDIT-SAMPLE.json` contains 304 entries selected across all 25 production categories and includes structurally unusual noun, verb, and fixed-phrase records. It provides more than the required 100-entry review pool, but it is an automated developer sample and is not evidence of human linguistic approval.

Reviewer: `PENDING`

Review date: `PENDING`

Minimum reviewed entries: `0 / 100`

| Required coverage | Available in review pool | Human result |
|---|---:|---|
| Nouns, including article and plural | YES | PENDING |
| Verbs, including irregular, reflexive, and separable metadata | YES | PENDING |
| Adjectives and adverbs | YES | PENDING |
| Connectors and prepositions | YES | PENDING |
| Functional phrases | YES | PENDING |
| Regional variants | YES, through the reference inventory where mapped | PENDING |

For each selected lexeme, the human reviewer must check the English gloss, article, plural, verb metadata, German example, English translation, register, naturalness, and any regional label. Record the reviewed lexeme IDs and corrections in this section before changing the status.

Reviewed lexeme IDs/corrections: `PENDING`

## Human grammar QA

Status: **HUMAN CONTENT QA PARTIAL — 0/24 lessons human-reviewed**

For every lesson, a native-German/B1-qualified reviewer must check its explanation, one representative rule/table, two examples, and two exercises. The reviewer must record German correctness, English explanation accuracy, B1 suitability, absence of false simplification, and deterministic answer support.

Reviewer: `PENDING`

Review date: `PENDING`

| # | Lesson | Explanation | Rule/table | 2 examples | 2 exercises | German/English accuracy | B1 level | Deterministic | Verdict |
|---:|---|---|---|---|---|---|---|---|---|
| 1 | Word order, questions, negation, sentence bracket | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING |
| 2 | Nominative, accusative, dative articles | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING |
| 3 | Personal, possessive, reflexive, object pronouns | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING |
| 4 | Modal verbs and sentence bracket | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING |
| 5 | Separable and reflexive verbs | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING |
| 6 | Conversational past narration | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING |
| 7 | `sein`, `haben`, and high-frequency modal forms | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING |
| 8 | Location, direction, and time | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING |
| 9 | Practical adjective agreement | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING |
| 10 | Comparison, `als`, and `wie` | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING |
| 11 | `weil`, `dass`, `wenn`, `obwohl` | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING |
| 12 | `deshalb`, `trotzdem`, `sonst`, and related connectors | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING |
| 13 | `als`, `wenn`, `bevor`, `nachdem`, and related clauses | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING |
| 14 | Nominative, accusative, dative, and prepositional relatives | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING |
| 15 | `ob` and W-word indirect questions | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING |
| 16 | Infinitive clauses with `zu` | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING |
| 17 | Purpose with shared and different subjects | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING |
| 18 | Present and past passive | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING |
| 19 | Politeness, wishes, advice, hypotheticals | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING |
| 20 | Fixed prepositions and da-/wo-compounds | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING |
| 21 | Common written genitive structures | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING |
| 22 | Present-for-future and Futur I | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING |
| 23 | Cause, concession, result, and balanced contrast | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING |
| 24 | Noun-verb combinations and cohesive writing | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING |

## Human exam-content QA

Status: **HUMAN CONTENT QA PARTIAL — native/expert review not performed**

For every row, review natural German, B1 appropriateness, ambiguity, originality/no copied official Goethe text, answer support where applicable, register, and realism.

Reviewer: `PENDING`

Review date: `PENDING`

| Module | Required coverage | Human result |
|---|---|---|
| Reading | Part/task types 1, 2, 3, 4, and 5 | PENDING |
| Listening | Parts 1, 2, 3, and 4 across the three forms | PENDING |
| Writing | Tasks 1, 2, and 3 | PENDING |
| Speaking | Parts 1, 2, and 3, including solo/pair variants | PENDING |

## Android physical QA

Status: **PENDING — NO PHYSICAL ANDROID DEVICE CONNECTED**

ADB inventory on 2026-10-31 returned an empty device list. Browser emulation and automated tests do not satisfy this gate.

Device/model: `NOT TESTED — NO DEVICE`

Android version: `NOT TESTED — NO DEVICE`

Chrome version: `NOT TESTED — NO DEVICE`

Mode: `NOT TESTED — NO DEVICE`

| Gate | Status | Required evidence/result |
|---|---|---|
| Chrome launch and responsive layout | PENDING | Open the production candidate on the device. |
| Install help, PWA install, icon/name, standalone, safe navigation | PENDING | Test Chrome and installed PWA. |
| Installed-PWA update/takeover and state preservation | PENDING | Trigger a controlled worker revision; verify one reload and no loop. |
| Live German TTS: noun, verb, grammar, My Words | PENDING | Confirm playable `de-DE`, no unintended fallback/crash; then test network failure. |
| Listening hub and Parts 1–4, replay, results/review | PENDING | Exercise one complete form. |
| Prepared full form offline | PENDING | Cache eight tracks online; disable network; verify only prepared content. |
| Microphone allow/deny, record/playback/re-record/delete | PENDING | Confirm permission only after explicit action and no upload. |
| Writing keyboard, scrolling, tabs, counter, autosave/restore, timer | PENDING | Confirm controls remain reachable. |
| Screen lock/background during audio and recording | PENDING | Record exact OS behavior and recovery. |
| Bluetooth/headset playback and microphone | NOT TESTED — HARDWARE UNAVAILABLE | Test only when compatible hardware is available. |
| Full Mock start, transitions, resume, summary | PENDING | A two-hour wall-clock run is not required. |

## iOS physical QA

Status: **PENDING — NO PHYSICAL IPHONE OR IPAD CONNECTED**

Windows PnP inventory on 2026-10-31 found no present Apple mobile device. Browser emulation and automated tests do not satisfy this gate.

Device/model: `NOT TESTED — NO DEVICE`

iOS version: `NOT TESTED — NO DEVICE`

Safari version: `NOT TESTED — NO DEVICE`

| Gate | Status | Required evidence/result |
|---|---|---|
| Safari launch | PENDING | Open the production candidate on the device. |
| Add to Home Screen help/install, icon/name, standalone | PENDING | Confirm help is hidden after standalone launch. |
| Installed Home Screen update behavior | PENDING | Use a controlled update and record the exact iOS lifecycle result. |
| Live German TTS: Vocabulary, Grammar, My Words | PENDING | Confirm playback unlock, repeat tap, and no silent failure. |
| Listening playback, preflight, replay, results/review | PENDING | Exercise production MP3 playback. |
| Prepared form offline | PENDING | Cache one form and disable network where practical. |
| Microphone request, recording, playback/delete, no-recording flow | PENDING | Record exact MediaRecorder support/behavior. |
| Writing keyboard, scrolling, task navigation, counter, autosave/restore | PENDING | Confirm no permanently hidden controls. |
| Known/Favorites, vocabulary, grammar, Writing, Exam, My Words persistence | PENDING | Close and reopen Home Screen PWA. |
| Screen lock/background during audio and recording | PENDING | Record exact OS interruption/recovery behavior. |
| Bluetooth/headset playback and microphone | NOT TESTED — HARDWARE UNAVAILABLE | Test only when compatible hardware is available. |

## Privacy and device-network QA

Status: **PENDING — PHYSICAL DEVICES UNAVAILABLE**

The automated product/privacy implementation states that Speaking recordings remain local, but a physical-device network inspection was not possible. On each platform, verify that recording creates no upload request and that normal German TTS makes a single playable cloud request without unnecessary rate-limit probing.

## Defects and fixes

No new product defect was established by this attempt. Human audio/content review and physical-device behavior were not executed, so their absence cannot be interpreted as a pass. No source or audio asset was changed.

## Automated final regression

| Check | Result |
|---|---|
| Listening production validator | PASS — 24/24 ready, 8,773,536 bytes, no errors |
| Jest | PASS — 61 suites, 353 tests, 0 failures, 0 skipped |
| Production build | PASS — `main.25619cdc.js` 291.06 kB gzip; CSS 338 B gzip; fixture isolation passed |
| Build inventory | PASS — 24 MP3s, Full Mock route, manifest, service worker, all manifest icons, and `404.html` present |
| German-only runtime scan | PASS — no active `Serbian A1`, `Srpski`, `sr-RS`, or `sr-Latn` marker in built JavaScript |
| Live TTS/firewall sanity | PASS — one normal `de-DE` request returned HTTP 200 `audio/mpeg`, 4,896 bytes |

The initial sandboxed Jest attempt encountered `EPERM` while writing Jest's temporary transform cache and executed zero tests. The required rerun outside that sandbox restriction completed successfully; this was an environment limitation, not an application failure.

## Remaining release blockers

1. Human listening QA for all 24 tracks.
2. Native-German/B1-qualified vocabulary, grammar, and exam-content review.
3. Physical Android Chrome and installed-PWA validation.
4. Physical iOS Safari and Home Screen validation.

Until all four blockers are closed with recorded evidence, the recommendation is **do not merge and do not deploy the frontend**.
