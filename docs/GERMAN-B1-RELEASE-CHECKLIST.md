# German B1 release checklist

Audit date: 2026-10-31

Audited branch: `feature/german-b1-foundation`

Phase 9D starting commit: `c16e74ad562560403fc14d64294f1541fa5d4d18`

Product status: release candidate; German TTS backend deployed; frontend not merged or deployed

Phase 9D.1 deployment verification: 2026-10-31

Final human/physical QA attempt: 2026-10-31. Detailed record: `GERMAN-B1-FINAL-QA.md`.

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
| Jest suite | PASS | Final-QA rerun: 61 suites, 353 tests, 0 failures, 0 skipped. The first sandboxed attempt was unable to create Jest's temporary transform cache (`EPERM`); the unrestricted rerun executed normally and passed. |
| Audio pipeline | PASS | 11 tests; 24/24 assets ready; 8,773,536 MP3 bytes; checksums/script hashes/metadata valid. |
| Production build | PASS | Final-QA rerun: `main.25619cdc.js`, 291.06 kB gzip; CSS 338 B gzip; basename `/pwagerman/`; fixture isolation pass; built with the verified public endpoint value. |
| Production assets | PASS | 24 MP3s emitted; icons and optimized German SVG wordmarks emitted; the unreferenced design-source PNG is preserved under `docs/`, and retired Serbian wordmark PNGs are removed. |
| Active runtime scan | PASS | No active `Serbian A1`, `Srpski`, `sr-RS`, `sr-Latn`, retired wordmark, or development-fixture markers. |
| Production browser matrix | PASS | Actual production build: 72/72 route/viewport combinations across 12 high-risk routes and six requested viewports had no horizontal overflow or visibly clipped controls. |
| Route/deep-link files | PASS | Twelve direct routes loaded/reloaded with the same heading; back/forward passed; a clean-origin nested URL restored through `404.html` to the intended route. The actual mock route is `/exam/full-mock-b1`. |
| Production console | PASS | Clean-origin representative Home, Learn, Vocabulary, Exam, and Listening flows produced zero console errors or warnings. |
| Prepared Listening cache | PASS WITH COMBINED EVIDENCE | Browser prepared 8/8 tracks, reloaded offline, passed cached preflight, resumed interrupted playback, and started all eight MP3s through the service worker without a range-response error. Replay/scoring/results/review contracts remain covered by the passing Listening UI/session tests. |
| Service-worker update state machine | PASS | Two local production-worker revisions verified notification, `Update now`, `SKIP_WAITING`, takeover, one reload, no loop, and no new console error; automated coverage remains green. |
| Storage failure handling | PASS | Malformed records, unavailable IndexedDB/localStorage, quota failures, and versioned normalization covered. |
| Storage bounds | PASS | Attempts/history 20, mistakes 100, exercises 200, exam sessions 100, mocks 50, activity dates 365, recordings 15 MiB each/50 MiB total, audio cache 24. |
| Local TTS request validation | PASS | Current source accepts `de-DE` only, enforces 300 characters, origin allowlist, fixed server-side voice, controlled errors, and a 30 requests/client/minute in-process defense. |
| Production TTS | PASS | Endpoint `https://serbian-a1-tts-one.vercel.app/api/tts` serves the promoted, staged-and-tested deployment `dpl_DhRoqdRwXQHgzsAihrgrkAgioZWB`. Live `de-DE` returned HTTP 200 `audio/mpeg` and a valid 4.344-second MP3; live `sr-RS` returned HTTP 400. Fixed voice: `de-DE-Chirp3-HD-Aoede`. |
| Distributed TTS rate limit | PASS | Published Vercel rule `rate-limit-tts` (`rule_observe_tts_post_traffic_DwtTxg`): path exactly `/api/tts`, method exactly `POST`, fixed-window 30 requests/60 seconds keyed by IP, exceeded action `rate_limit`/HTTP 429. Firewall telemetry recorded the controlled rate-limit action. The application limiter remains defense in depth. |
| Final-QA TTS sanity | PASS | One non-burst `POST /api/tts` request for `Guten Morgen`/`de-DE` returned HTTP 200, `audio/mpeg`, 4,896 bytes after the firewall rule was active. This is endpoint evidence, not physical-device playback evidence. |
| Privacy disclosure | PASS | Product page covers localStorage/IndexedDB, optional local recording/no upload, TTS network use, and offline limits. |
| Recovery | PASS | Application error boundary and invalid-route recovery preserve local data. |

## Manual and physical gates

| Gate | Classification | Required evidence before public release |
|---|---|---|
| Human Listening QA | BLOCKER / PENDING | 0/24 tracks human-reviewed. Listen to all 24 tracks for German accuracy, pronunciation, pacing, numbers/times, voice assignment, clipping, pauses, and transcript match. Record reviewer/date in `GERMAN-B1-LISTENING-AUDIO-QA.md`. |
| Expert linguistic review | HUMAN CONTENT QA PARTIAL | Review worksheets and a 304-entry automated vocabulary audit pool exist, but no native-German/B1-qualified reviewer completed the required 100 lexemes, 24 grammar lessons, or representative exam content. Automated validation is not linguistic certification. |
| Android browser/PWA | PENDING — NO PHYSICAL DEVICE CONNECTED | ADB returned an empty device list. Install/update takeover, TTS, prepared-form offline audio, microphone, recording/playback, Writing keyboard, screen lock, and headset/Bluetooth remain untested on hardware. |
| iOS Safari/Home Screen | PENDING — NO PHYSICAL DEVICE CONNECTED | Windows PnP reported no present iPhone/iPad. Add to Home Screen, standalone/update behavior, install help, TTS, Listening, microphone, recording/playback, Writing keyboard, persistence, and interruption behavior remain untested on hardware. |
| Production TTS endpoint | CLOSED | Staged production deployment passed German audio, negative, fixed-voice, CORS, and frontend-compatibility gates before promotion. Post-promotion browser checks for noun/article, verb, grammar, and My Words produced live HTTP 200 cloud requests without fallback errors. |
| Distributed TTS abuse control | CLOSED | The log-only baseline was published and observed first. The same exact-scope rule was then converted to 30 requests/60 seconds/IP, inspected, published, and validated through Vercel 429 telemetry. GET remains 405, OPTIONS remains 204, and unrelated paths remain outside the rule. |

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
- The configured GitHub Pages URL returned HTTP 404 during Phase 9D. That response carried GitHub's restrictive error-page CSP, not an application policy. The repository contains no meta CSP, and GitHub Pages does not provide repository-configured response headers; no potentially breaking meta policy was added. Re-audit response headers after the German build is actually deployed.
- The privacy page accurately states that selected German text and `de-DE` may be sent to the configured TTS service, recordings remain local, Listening tracks may be cached, progress is local, and uncached/network features are not fully offline.

## Release blockers and follow-ups

Software blockers: none identified after Phase 9D.1. Production German TTS, the fixed voice, live frontend cloud speech, and the distributed Vercel rate limit are verified. The Phase 9D production-browser matrix, deep links, console, service-worker update, and prepared-audio cache rerun remain passed.

External blockers: all 24 audio tracks still need human listening QA; native-German/B1 content review remains incomplete; physical Android and iOS checks remain pending. See `GERMAN-B1-FINAL-QA.md` for the review matrices and exact untested device gates.

Non-blocking follow-ups after those gates: refresh the Browserslist database in a dependency-maintenance change, consider route-level splitting if the main bundle grows materially beyond the current 291.06 kB gzip, and remove source maps from public hosting if deployment policy does not need them.

## Merge and deployment status

- Phase 9D.1 commit/push: **COMPLETED** at `c4ac730f9e0a5c19d8945a7a2871e55771e03b49` before this final-QA attempt.
- Final-QA documentation: prepared on the feature branch; commit and push status are reported in the final handoff.
- Merge: **NOT EXECUTED**.
- Backend deployment: **EXECUTED** for the existing Vercel TTS project only; the previous production deployment remains the rollback target.
- Firewall publication: **EXECUTED** for the exact `POST /api/tts` rule above.
- Frontend deployment: **NOT EXECUTED**. No `gh-pages` update was made.
- Merge only after the remaining human and physical gates are closed.
