# German B1 release checklist

Audit date: 2026-10-31

Audited branch: `feature/german-b1-foundation`

Starting commit: `36198f752fa16772ec55e7abe7e36a726a051e66`

Product status: release candidate; not merged; not deployed

## Release inventory

- German B1 Exam Preparation by Asenda Studio, with an explicit independent-product disclaimer.
- 800 production lexemes across 25 categories; Favorites, Learning, Known, Review, and My Words flows.
- 24 grammar lessons with eight exercises each, diagnostic, completion, retry, and mistake review.
- Reading: five parts, 30 items, 65-minute absolute timer, scoring, results, review, and resume.
- Listening: four parts, 30 items, three forms, 24 generated German MP3 assets, replay rules, review, and prepared-form offline cache.
- Writing: three tasks, 60-minute timer, autosave/restore, word count, checklist, immutable submission, revision copy, and transparent self-assessment.
- Speaking: 15-minute preparation, three parts, solo/pair flows, optional local recording, playback, deletion, and no-recording mode.
- Full B1 practice mock: Reading → Listening → Writing → Speaking → summary, with independent module results and no aggregate pass claim.
- PWA shell, install guidance, onboarding, update notification/takeover flow, German branding, and `/pwagerman/` basename.

## Automated evidence

| Gate | Result | Evidence |
|---|---|---|
| Content/data validation | PASS | 800 lexemes, 25 categories, 24 grammar lessons; module/form/reference tests pass. |
| Jest suite | PASS | 60 suites, 344 tests, 0 failures, 0 skipped. |
| Audio pipeline | PASS | 11 tests; 24/24 assets ready; 8,773,536 MP3 bytes; checksums/script hashes/metadata valid. |
| Production build | PASS | `main.0729fb3e.js`, 291.21 kB gzip; CSS 338 B gzip; basename `/pwagerman/`; fixture isolation pass. |
| Production assets | PASS | 24 MP3s emitted; icons and German wordmarks emitted; retired Serbian wordmark PNGs removed. |
| Active runtime scan | PASS | No active `Serbian A1`, `Srpski`, `sr-RS`, `sr-Latn`, retired wordmark, or development-fixture markers. |
| Route/deep-link files | PASS | Production root and route-restore shell resolve; each direct route returns the expected GitHub Pages 404 fallback that restores the route through `index.html`. |
| Service-worker update state machine | PASS | Waiting worker, explicit update, `SKIP_WAITING`, controller takeover, and single reload covered by tests. |
| Storage failure handling | PASS | Malformed records, unavailable IndexedDB/localStorage, quota failures, and versioned normalization covered. |
| Storage bounds | PASS | Attempts/history 20, mistakes 100, exercises 200, exam sessions 100, mocks 50, activity dates 365, recordings 15 MiB each/50 MiB total, audio cache 24. |
| TTS request validation | PASS | `de-DE` only, 300-character limit, origin allowlist, fixed configured voice, controlled errors, and 30 requests/client/minute in-process limiter. |
| Privacy disclosure | PASS | Product page covers localStorage/IndexedDB, optional local recording/no upload, TTS network use, and offline limits. |
| Recovery | PASS | Application error boundary and invalid-route recovery preserve local data. |

## Manual and physical gates

| Gate | Classification | Required evidence before public release |
|---|---|---|
| Human Listening QA | BLOCKER / HUMAN QA PENDING | Listen to all 24 tracks for German accuracy, pronunciation, pacing, numbers/times, voice assignment, clipping, pauses, and transcript match. Record reviewer/date in `GERMAN-B1-LISTENING-AUDIO-QA.md`. |
| Expert linguistic review | HUMAN QA PENDING | Native German and preferably B1-teacher review of the 800-lexeme curriculum plus representative grammar and all original exam forms. Automated validation is not linguistic certification. |
| Android browser/PWA | PHYSICAL CHECK PENDING | Install/update takeover, TTS, prepared-form offline audio, microphone, recording/playback, screen lock, and headset/Bluetooth. |
| iOS Safari/Home Screen | PHYSICAL CHECK PENDING | Add to Home Screen, standalone/update behavior, install help, TTS, Listening, microphone, recording/playback, Writing keyboard, and persistence. |
| Production-build interactive browser rerun | PHYSICAL CHECK PENDING | The Windows browser-control safety layer blocked the final local navigation. Re-run core routes, responsive matrix, console, back navigation, direct reload, and one prepared Listening form offline in a human-controlled browser. |
| Production TTS endpoint | BLOCKER | Confirm the exact existing endpoint for `REACT_APP_TTS_ENDPOINT`; it is intentionally not stored in this repository. Verify production CORS and a real `de-DE` request. |
| Distributed TTS abuse control | BLOCKER | The new in-process limiter is useful but not a cross-instance serverless cost boundary. Configure hosting/provider rate limiting, quota/budget alerts, and monitoring before publishing the endpoint. |

## Human audio QA procedure

1. Use the table in `GERMAN-B1-LISTENING-AUDIO-QA.md`; one reviewer listens through every track without skipping.
2. Compare the full transcript while checking pronunciation, numbers, dates, times, names, and speaker assignment.
3. Check natural B1 pacing, pauses, speaker separation, and the start/end for silence or clipping on both speakers and headphones.
4. Mark each row with reviewer, date, and PASS/FAIL. Regenerate and revalidate any failed track; do not waive defects.
5. Re-run `npm.cmd run audio:validate`, the full Jest suite, build, and prepared-form offline playback after any regeneration.

## PWA, offline, and old-user transition

- A successful online load installs the German app shell. TTS requires network access; Listening requires network unless the selected form was explicitly prepared.
- The service worker updates only after user action, requests `SKIP_WAITING`, takes control, and reloads once.
- German data uses `asenda.german-b1.*` and `asenda-german-b1`; preserved Serbian localStorage/IndexedDB names are not migrated, overwritten, or deleted.
- An existing Serbian installation is expected to receive the German shell after accepting the update and begin with a fresh German namespace while old Serbian browser data remains dormant.
- Final installed-PWA transition testing on Android and iOS remains a physical gate.

## Security and privacy notes

- No credential, ADC, private-key, token, or service-account file is part of the release.
- Speaking recordings are created only after an explicit microphone action, stay in IndexedDB, are not uploaded, and have delete and size-limit controls.
- The development WAV remains a test fixture but is removed by the production build and has no active runtime reference.
- No unsafe HTML injection API is used. Runtime external destinations are limited to the configured TTS endpoint and the Asenda attribution link.

## Release blockers and follow-ups

Blockers: all 24 audio tracks need human listening QA; the exact production TTS endpoint and real request must be verified; distributed TTS abuse/cost controls must be enabled. Physical Android/iOS and the final human-controlled production-browser matrix remain pending gates.

Non-blocking follow-ups after those gates: refresh the Browserslist database in a dependency-maintenance change, consider route-level splitting if the main bundle grows materially beyond the current 291.21 kB gzip, and remove source maps from public hosting if deployment policy does not need them.

## Merge and deployment status

- Merge: **NOT EXECUTED**. The feature branch is a clean fast-forward candidate from `master` at the audit start.
- Deployment: **NOT EXECUTED**. No `gh-pages` update was made.
- Use the merge and deployment commands from the Phase 9C final report only after every blocker above is closed.
