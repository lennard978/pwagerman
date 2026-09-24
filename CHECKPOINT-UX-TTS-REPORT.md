# Checkpoint: Mobile Visual Fixes and Serbian TTS

## A. Files modified

Updated the validated exercise and speech surfaces:

- `src/screen/write/Write.js`
- `src/screen/quiz/Quiz.js`
- `src/screen/test/Test.js`
- `src/components/SoundButton.js`
- `src/data/learningModel.test.js`

No curriculum direction, routes, deployment, service worker, or unrelated `casino.js` changes were made by this checkpoint.

## B. Write fix

The root cause was in the rendered tile component: filled-state props were not being used by the actual `TargetLetter` styling, and the inline gradient background could override the intended filled appearance.

The fix now applies the state directly to the answer tile:

- Empty slot: neutral surface with subtle placeholder styling
- Filled slot: primary orange background with explicit white text
- Correct result: success background
- Incorrect result: error background
- Serbian diacritics remain in the rendered character text
- Spaces remain part of validation but are visually minimized

The compact Write layout was preserved. Focused tests verify that clicking a letter enters the answer and exposes `data-filled="true"`.

## C. Test layout

The active Test content now uses a centered flex column with a minimum height based on the usable exercise area between the utility/header space and bottom navigation.

Very short screens fall back to top-aligned scrolling with safe padding, so longer questions remain usable and are not hidden behind fixed UI.

## D. Quiz feedback

The duplicate pronunciation/correct-answer row was removed. Quiz feedback now uses only the four existing Serbian choice buttons:

- Correct selected option: success state
- Incorrect selected option: error state
- Correct option after a wrong answer: success state
- Answer changes are disabled after selection
- Next action appears after answering

The Quiz still uses one English prompt at a time, up to ten questions per round, Serbian choices, score calculation, and the existing result screen.

## E. Serbian voice improvement

`SoundButton` remains generic and receives the content locale from callers. Lesson and Quiz continue to pass `lang="sr"` and the original Serbian target text.

Voice selection now:

1. Prefers an exact `sr-RS` voice.
2. Then accepts another language beginning with `sr`.
3. Ranks local voices above non-local voices.
4. Gives a small deterministic preference to names suggesting Natural, Enhanced, Premium, Google, Microsoft, or Apple voices.
5. Uses the browser default voice when no Serbian voice exists.

Playback defaults are centralized at:

- `rate: 0.92`
- `pitch: 1`
- `volume: 1`

The Serbian text is never translated or altered. Browser SpeechSynthesis quality still depends on the operating system, browser, and installed voices; a neural Serbian voice cannot be guaranteed by this implementation.

## F. Tests/build results

- Focused suites: **39 tests passed**
- Exercise tests: passed
- Curriculum tests: passed
- Localization tests: passed
- Serbian voice ranking/fallback tests: passed
- Production build: successful
- Diagnostics: no errors

Remaining output is limited to unrelated Node deprecation and Browserslist notices, plus the expected `/pwagerman` CRA deployment assumption.

## G. Remaining limitations

- Browser Serbian voice quality varies by platform and installed voice pack.
- Write still represents spaces internally as answer characters, although they no longer create distracting filled tiles.
- Final visual confirmation should still be performed in Chrome mobile view at the requested phone widths.

## H. Git status

- No commit created.
- No deployment, route, service-worker, or `/pwagerman` changes.
- Existing cumulative source changes remain in the working tree.
- Existing untracked `src/data/casino.js` remains untouched.

## Next checkpoint

Re-open Write, Quiz, Test, and Serbian pronunciation in Chrome mobile view, then decide whether browser Serbian TTS is good enough or whether neural/cloud speech should be evaluated separately.

---

# Checkpoint: My Words, Compact Exercise Headers, and TTS Architecture

## A. Files modified

Added or updated:

- `src/data/myWords.js`
- `src/data/myWords.test.js`
- `src/i18n/MyWordsProvider.js`
- `src/screen/myWords/MyWords.js`
- `src/services/tts/browserTtsProvider.js`
- `src/services/tts/cloudTtsProvider.js`
- `src/services/tts/ttsProvider.js`
- `src/components/App.js`
- `src/components/SoundButton.js`
- `src/screen/home/Home.js`
- `src/screen/write/Write.js`
- `src/screen/pair/Pair.js`
- `src/screen/lesson/Lesson.js`
- `src/screen/cards/Cards.js`
- `src/screen/quiz/Quiz.js`
- `src/screen/test/Test.js`
- English/Serbian localization resources and focused tests

## B. Shared header/title layout

The existing shared utility/title spacing remains compact and all exercise screens use the same usable content region. No route, deployment, or bottom-navigation changes were made.

## C. Write correction interaction

Write now tracks each character as a stable tile with an ID. Selecting a letter removes that exact tile from the available pool and places it in the next answer slot. Tapping a filled answer slot removes it and returns the same tile to the pool, preserving duplicate letters and Serbian diacritics.

## D. Pair

Pair rounds now use a maximum of 6 randomized vocabulary pairs. The full lesson remains intact; only the current round is limited. Small custom sets show a minimum-data message rather than inventing pairs.

## E. TTS architecture

Added a provider-neutral client abstraction:

- Browser fallback provider for `sr`/`sr-RS` voices
- Optional cloud provider contract at `REACT_APP_TTS_ENDPOINT`
- Provider facade with normalized text/version cache key

Cloud status: no backend endpoint was added because the current GitHub Pages architecture has no server runtime. The contract is prepared for a future serverless/backend implementation.

Expected endpoint contract:

```text
POST /api/tts
{ "text": "dobro jutro", "lang": "sr-RS" }
```

No credentials are stored in the frontend. Playback priority is cloud when configured, then Serbian browser voice, then browser default voice. Serbian text is never altered. Browser playback remains approximately `rate: 0.92`, `pitch: 1`, `volume: 1`.

## F. My Words

My Words uses localStorage key:

```text
serbian-a1.myWords.v1
```

Entries use:

```js
{ id, source, target, createdAt }
```

The feature supports add, edit, delete with confirmation, trimming, blank/length validation, duplicate pair rejection, malformed-storage tolerance, and Serbian diacritics.

My Words is exposed from Home and included as a special `my-words` dataset in the existing Lesson, Pair, Write, Cards, and Quiz chooser flows. The seven-item bottom navigation is unchanged.

## G. My Words exercise integration

- Lesson: English source and Serbian target with Serbian speech
- Cards: English front and Serbian back
- Write: English prompt and Serbian answer tiles
- Pair: English/Serbian matching, capped at 6 pairs
- Quiz: Serbian choices with graceful minimum-data handling
- Test: remains built-in and independent of custom words

## H. Small-dataset behavior

- 0 words: empty state and minimum-data exercise message
- 1 word: Lesson/Cards/Write can render; Pair and Quiz explain that more words are needed
- 2-3 words: Pair works with the available set; Quiz does not fabricate unrelated distractors

## I. Tests/build results

- Focused suites: **42 tests passed**
- My Words save/load/malformed/duplicate tests: passed
- Exercise and curriculum tests: passed
- Localization tests: passed
- TTS fallback/ranking tests: passed
- Production build: successful
- No new application warnings

Remaining notices are unrelated Node/Browserslist warnings and the expected `/pwagerman` CRA deployment assumption.

## J. Remaining limitations

- Cloud TTS requires a future server/serverless endpoint and server-only Google credentials.
- Browser Serbian voice quality still depends on installed operating-system voices.
- My Words is intentionally local-only and is not included in Test.

## K. Git status

- No commit created.
- No `/pwagerman`, GitHub Pages, service-worker, or deployment changes.
- Built-in curriculum remains unchanged.
- Existing untracked `src/data/casino.js` remains untouched.

## Next checkpoint

Visually validate My Words, compact exercise headers, Write correction, 6-pair rounds, and compare future cloud Serbian TTS against browser Serbian TTS.

---

# Checkpoint: Secure Serbian Neural TTS Backend

## A. Files created/modified

Created:

- `api/tts.js`
- `api/package.json`
- `api/tts.test.js` (reference server test)
- `src/apiTts.test.js` (CRA-discovered API contract test)

Updated:

- `src/services/tts/cloudTtsProvider.js`
- `src/services/tts/ttsProvider.js`
- `.gitignore`
- My Words, exercise, localization, and existing focused-test files from the current checkpoint

## B. Vercel API implementation

Added a Vercel-compatible `POST /api/tts` handler.

Validation:

- POST only
- Serbian `sr-RS` only
- Required non-empty string text
- 300-character maximum
- JSON payload validation
- Safe 400/405/413/502/503 responses

Successful responses are direct `audio/mpeg` bytes with a one-day cache header. The handler accepts an optional configured voice name but does not guess or hardcode an unsupported Google voice ID.

## C. Google Cloud TTS configuration

The separate Vercel API project should install the dependency described in `api/package.json`:

```text
@google-cloud/text-to-speech
```

Server-only environment variables:

```text
GOOGLE_CLOUD_PROJECT_ID
GOOGLE_CLOUD_CLIENT_EMAIL
GOOGLE_CLOUD_PRIVATE_KEY
GOOGLE_TTS_VOICE_NAME (optional override; defaults to sr-RS-Chirp3-HD-Aoede)
TTS_ALLOWED_ORIGINS (optional comma-separated override)
```

Private-key escaped newlines are normalized before creating the Google client. No credentials are imported into React, `public/`, or the generated frontend build.

## D. Security

- Credentials are read only in `api/tts.js`.
- `.env` and `api/.env` are ignored.
- Text length and language are restricted.
- CORS defaults to localhost and `https://lennard978.github.io`, with an environment override.
- Production CORS does not use unrestricted `*`.
- Provider errors return generic messages without credential details.
- No credentials were logged or committed.

## E. Client integration

The existing `REACT_APP_TTS_ENDPOINT` path remains the only frontend configuration. The cloud provider receives Serbian target text and `sr-RS`, consumes direct MP3, creates an object URL, and revokes it after playback. Cloud failure falls back to browser speech.

The client keeps a small in-memory audio cache keyed by language, version, and normalized text. Audio is not placed in localStorage.

## F. Browser fallback

Fallback priority:

1. Configured cloud endpoint
2. Best available Serbian browser voice
3. Browser default voice with unchanged Serbian text

Browser playback remains approximately `rate: 0.92`, `pitch: 1`, and `volume: 1`. Browser quality still depends on installed operating-system voices.

## G. My Words speech integration

My Words entries flow through the same lesson/exercise dataset. Their Serbian `target` values use the same `SoundButton` and TTS provider path; no special speech implementation was added.

## H. UI/header validation

The compact utility bar and fixed title structure remain shared across Lesson, Pair, Write, Cards, Test, and Quiz. My Words uses the same warm orange surfaces, form controls, cards, and mobile-safe bottom spacing.

## I. Tests/build results

- API contract, My Words, exercise, curriculum, localization, and selector tests: **44 passed**
- Production build: successful
- No live Google synthesis call was made
- No new application warnings

Remaining notices are unrelated Node/Browserslist advisories and the expected `/pwagerman` CRA deployment assumption.

## J. Required manual setup

1. Create or select a separate Vercel project rooted at the repository so `/api/tts` is deployed alongside the API package, or deploy the `api/` directory as the server project according to the chosen Vercel layout.
2. Enable the **Cloud Text-to-Speech API** in the Google Cloud project.
3. Create a service account and grant it the **Cloud Text-to-Speech User** role (`roles/cloudtts.user`) or an equivalent least-privilege permission set.
4. Add the server-only environment variables listed above to Vercel. Never use `REACT_APP_` for credentials.
5. Set the frontend build variable:

```text
REACT_APP_TTS_ENDPOINT=https://<vercel-project>/api/tts
```

6. Rebuild the GitHub Pages frontend after setting that variable. The frontend rebuild is required because Create React App embeds `REACT_APP_*` values at build time.
7. Deploy the Vercel API and GitHub Pages frontend separately. This work did not deploy either one.

The endpoint uses `sr-RS-Chirp3-HD-Aoede` by default and continues to honor `GOOGLE_TTS_VOICE_NAME` as an explicit deployment override. The language code remains `sr-RS`.

## K. Git status

- No commit created.
- No deployment performed.
- `/pwagerman`, GitHub Pages homepage, routes, and service worker remain unchanged.
- Existing cumulative source changes remain in the working tree.
- Existing untracked `src/data/casino.js` remains untouched.

## Next checkpoint

Configure Google Cloud and Vercel environment variables, deploy the TTS endpoint, and compare neural Serbian speech against the browser fallback on the real phone.
