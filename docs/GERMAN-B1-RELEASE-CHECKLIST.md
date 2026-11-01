# German B1 release checklist

Audit date: 2026-11-01

Audited branch: `feature/german-b1-foundation`

Phase 10.3 starting commit: `0905bc8cbd5213bb12a82941388bfb4fd1eabcca`

Product status: Phase 10.3 release candidate live on GitHub Pages; German TTS backend deployed; feature branch remains unmerged

Phase 10.3 vocabulary closeout: 2026-11-01

Phase 9D.1 deployment verification: 2026-10-31

Final human/physical QA attempt: 2026-10-31. Detailed record: `GERMAN-B1-FINAL-QA.md`.

## Release inventory

- German B1 Exam Preparation by Asenda Studio, with an explicit independent-product disclaimer.
- 2,367 production lexemes across 25 categories; Favorites, Learning, Known, Review, and My Words flows.
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
| Content/data validation | PASS | 2,367 lexemes, 25 categories, and 24 grammar lessons. All 1,764 pre-Phase-10.3 residual Wortliste rows were reviewed: 417 high-value entries were added, 367 were resolved without duplication, 112 were mapped as regional/metadata variants, and 868 were excluded with a specific low-value, artifact, inflection, abbreviation, proper-name, or non-standalone rationale. No partial or unclassified residual rows remain. |
| Jest suite | PASS | Phase 10.3 unrestricted rerun: 63 suites, 364 tests, 0 failures, 0 skipped. The initial sandboxed run encountered the known Windows Jest transform-cache `EPERM` restriction before executing tests; the unrestricted rerun passed every assertion. |
| Audio pipeline | PASS | 11 tests; 24/24 assets ready; 8,773,536 MP3 bytes; checksums/script hashes/metadata valid. |
| Production build | PASS | Phase 10.3: `main.7344703f.js`, 393.62 kB gzip, SHA-256 `A3CF6A3DFCF5BDA23CCDAA9C93884A0748777D7DCBD25BE26AEFB99330C7E8CE`; CSS 338 B gzip; basename `/pwagerman/`; fixture isolation pass; built with the verified public endpoint value. |
| Production assets | PASS | 24 MP3s emitted; icons and optimized German SVG wordmarks emitted; the unreferenced design-source PNG is preserved under `docs/`, and retired Serbian wordmark PNGs are removed. |
| Active runtime scan | PASS | No active `Serbian A1`, `Srpski`, `sr-RS`, `sr-Latn`, retired wordmark, or development-fixture markers. |
| Production browser matrix | PASS | Phase 10.3 live RC passed the requested responsive matrix: Pair and Quiz at 320×568; Vocabulary search, filters, long-compound details, and Learning actions at 390×844; Listening at 768×1024; and Home plus Full Mock at 1280×800. The inspected views had no clipped controls or horizontal overflow. |
| Route/deep-link files | PASS | Twelve direct routes loaded/reloaded with the same heading; back/forward passed; a clean-origin nested URL restored through `404.html` to the intended route. The actual mock route is `/exam/full-mock-b1`. |
| Production console | PASS | Clean-origin representative Home, Learn, Vocabulary, Exam, and Listening flows produced zero console errors or warnings. |
| Prepared Listening cache | PASS WITH COMBINED EVIDENCE | Browser prepared 8/8 tracks, reloaded offline, passed cached preflight, resumed interrupted playback, and started all eight MP3s through the service worker without a range-response error. Replay/scoring/results/review contracts remain covered by the passing Listening UI/session tests. |
| Service-worker update state machine | PASS | Two local production-worker revisions verified notification, `Update now`, `SKIP_WAITING`, takeover, one reload, no loop, and no new console error; automated coverage remains green. |
| Storage failure handling | PASS | Malformed records, unavailable IndexedDB/localStorage, quota failures, and versioned normalization covered. |
| Storage bounds | PASS | Attempts/history 20, mistakes 100, exercises 200, exam sessions 100, mocks 50, activity dates 365, recordings 15 MiB each/50 MiB total, audio cache 24. |
| Local TTS request validation | PASS | Current source accepts `de-DE` only, enforces 300 characters, origin allowlist, fixed server-side voice, controlled errors, and a 30 requests/client/minute in-process defense. |
| Production TTS | PASS | Endpoint `https://serbian-a1-tts-one.vercel.app/api/tts` serves the promoted, staged-and-tested deployment `dpl_DhRoqdRwXQHgzsAihrgrkAgioZWB`. Live `de-DE` returned HTTP 200 `audio/mpeg` and a valid 4.344-second MP3; live `sr-RS` returned HTTP 400. Fixed voice: `de-DE-Chirp3-HD-Aoede`. |
| Distributed TTS rate limit | PASS | Published Vercel rule `rate-limit-tts` (`rule_observe_tts_post_traffic_DwtTxg`): path exactly `/api/tts`, method exactly `POST`, fixed-window 30 requests/60 seconds keyed by IP, exceeded action `rate_limit`/HTTP 429. Firewall telemetry recorded the controlled rate-limit action. The application limiter remains defense in depth. |
| Final-QA TTS sanity | PASS | Live Phase 10.3 UI pronunciation controls were exercised for a compound and in Pair without changing matching state. Six representative production requests (`die Antwort`, `entschuldigen`, `Bescheid sagen`, `die Pfanne`, `das Verkehrszeichen`, `je`) returned HTTP 200 audio for new noun, verb, phrase, regional, compound, and connector coverage. This is endpoint/browser evidence, not physical-device playback evidence. |
| Privacy disclosure | PASS | Product page covers localStorage/IndexedDB, optional local recording/no upload, TTS network use, and offline limits. |
| Recovery | PASS | Application error boundary and invalid-route recovery preserve local data. |

## Manual and physical gates

| Gate | Classification | Required evidence before public release |
|---|---|---|
| Human Listening QA | BLOCKER / PENDING | 0/24 tracks human-reviewed. Listen to all 24 tracks for German accuracy, pronunciation, pacing, numbers/times, voice assignment, clipping, pauses, and transcript match. Record reviewer/date in `GERMAN-B1-LISTENING-AUDIO-QA.md`. |
| Expert linguistic review | HUMAN CONTENT QA PARTIAL | Review worksheets and an expanded automated vocabulary audit pool exist, but no native-German/B1-qualified reviewer completed the required vocabulary sample, 24 grammar lessons, or representative exam content. Automated validation is not linguistic certification. |
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

Software blockers: none identified in the Phase 10.3 source, data, automated-test, audio-validation, production-build, deployment, or live-browser gates. Production German TTS, the fixed voice, live frontend cloud speech, and the distributed Vercel rate limit remain verified. The live update prompt activated `ec2b67b0f6def0728d32ef11e09637a675d4eb6d`, changed the visible vocabulary total from 1,950 to 2,367, and completed without a reload loop.

External blockers: all 24 audio tracks still need human listening QA; native-German/B1 content review remains incomplete; physical Android and iOS checks remain pending. See `GERMAN-B1-FINAL-QA.md` for the review matrices and exact untested device gates.

Non-blocking follow-ups after those gates: refresh the Browserslist database in a dependency-maintenance change, consider route-level splitting because the main bundle is now 393.62 kB gzip, and remove source maps from public hosting if deployment policy does not need them.

## Merge and deployment status

- Phase 10.3 feature commit/push: **COMPLETED** at `1366501b6961c5db33eade33e7bcc12d8a504a1c`.
- Phase 9D.1 commit/push: **COMPLETED** at `c4ac730f9e0a5c19d8945a7a2871e55771e03b49` before this final-QA attempt.
- Final-QA documentation: prepared on the feature branch; commit and push status are reported in the final handoff.
- Merge: **NOT EXECUTED**.
- Backend deployment: **EXECUTED** for the existing Vercel TTS project only; the previous production deployment remains the rollback target.
- Firewall publication: **EXECUTED** for the exact `POST /api/tts` rule above.
- Frontend deployment: **COMPLETED** after passing tests, production build, feature commit, and push. `gh-pages` advanced from `e937bc9c51c5ab9bb13dfc690501991fa06074bd` to `ec2b67b0f6def0728d32ef11e09637a675d4eb6d`; Pages reported the new commit built and the live origin served `main.7344703f.js`.
- Merge only after the remaining human and physical gates are closed.
