# German B1 production Listening audio

Status: **24 / 24 production assets ready**. Generated and objectively validated on 2026-10-31.

The 24 learner scripts are original app-authored German practice material. The recordings were synthesized with Google Cloud Text-to-Speech; they are not Goethe recordings or official examiner voices. Production Listening and the Full B1 Mock unlock from the validated manifest without a manual readiness flag.

## Script audit

All three forms, 24 scripts, 90 questions, correct answers, evidence notes, speaker assignments, names, places, times, and numbers were checked together. No grammar, semantic, attribution, or answer-support defect was found. No learner-visible script was changed.

## Voice map

The generation-only configuration is `scripts/listening-audio/config.cjs`.

| Role | Google Cloud voice | Locale |
|---|---|---|
| narratorFemale | de-DE-Chirp3-HD-Aoede | de-DE |
| narratorMale | de-DE-Chirp3-HD-Puck | de-DE |
| femaleA | de-DE-Chirp3-HD-Kore | de-DE |
| femaleB | de-DE-Chirp3-HD-Leda | de-DE |
| maleA | de-DE-Chirp3-HD-Charon | de-DE |
| maleB | de-DE-Chirp3-HD-Orus | de-DE |

Google's current supported-voices documentation lists these Chirp 3 HD voices for German. The generation tool additionally calls `listVoices` with `de-DE` before any synthesis and stops if a configured name is absent.

## Repeatable generation

Prerequisites for a future regeneration:

- Google Cloud Text-to-Speech access through standard Application Default Credentials, `GOOGLE_APPLICATION_CREDENTIALS`, or all of `GOOGLE_CLOUD_PROJECT_ID`, `GOOGLE_CLOUD_CLIENT_EMAIL`, and `GOOGLE_CLOUD_PRIVATE_KEY`;
- `ffmpeg` and `ffprobe` on `PATH`;
- the existing `@google-cloud/text-to-speech` dependency.

Commands:

```text
npm run audio:plan
npm run audio:generate
node scripts/generate-listening-audio.cjs --form form-001
node scripts/generate-listening-audio.cjs --force
npm run audio:validate
```

`audio:plan` prints the planned asset and API-call count without credentials. Generation skips an existing valid asset unless `--force` is supplied. Provider retries are bounded to three attempts for retryable quota/transient failures. Credentials and provider payloads are never printed.

Google returns lossless `LINEAR16` speaker segments. The tool inserts a 280 ms neutral pause between conversational turns and makes one final MP3 encode through `ffmpeg`. It does not alter pitch, speaking rate, or formants. A failed synthesis or media validation never replaces an existing valid file.

## Stable paths and encoding

Final files use mono MP3, 24 kHz, approximately 64 kbit/s:

```text
public/audio/listening/audio-v1/form-001/part-1-track-01.mp3
public/audio/listening/audio-v1/form-001/part-2.mp3
public/audio/listening/audio-v1/form-001/part-3.mp3
public/audio/listening/audio-v1/form-001/part-4.mp3
```

The same eight-file layout applies to forms 002 and 003. Runtime URLs prepend `PUBLIC_URL`, producing `/pwagerman/audio/...` for the configured GitHub Pages build.

## Manifest and script hashes

`productionAudioManifest.json` has exactly 24 records. Each includes the audio/form/part/track identity, stable path, `de-DE` locale, source type, speaker-to-voice metadata, duration, SHA-256, byte size, content/audio versions, normalized SHA-256 script hash, source checksum, readiness, and human-QA status.

Normalization applies Unicode NFKC and collapses whitespace while retaining speaker IDs and turn order. A script/source-checksum mismatch changes runtime status to `stale-script`; production cannot become ready until the track is regenerated. `ready: true` is accepted only when file existence, bytes, SHA-256, MP3 signature, `ffprobe` decoding, duration, script hash, and version all match.

## Multi-speaker production

Part 3 maps every conversation to at least two distinct German voices. Part 4 maps moderator and two guests to three distinct voices. Each speaker keeps one voice for the entire recording. Speaker labels are metadata and are not synthesized as dialogue.

## PWA caching and preflight

The runtime cache remains `german-b1-listening-audio-v1`, bounded to 24 entries and 30 days with quota cleanup and old-version removal. Listening media is filtered out of the app-shell precache. The Listening hub explicitly prepares the next selected form's eight tracks and reports `completed / 8` progress. Before a practice or simulation starts, the same eight assets must expose valid browser metadata; the timer does not start on a preflight failure. A form is not claimed as offline-ready until its eight files have been cached.

When the browser is offline, preflight and playback resolve a prepared MP3 from Cache Storage as a revocable blob URL. This avoids depending on the service worker or browser implementing byte-range requests against an offline cached response. Automated tests cover cached resolution, cache misses, URL cleanup, preflight failure, and the rule that a failed start cannot consume a playback allowance.

## Production inventory

| Set | Assets | Bytes | MiB | Duration |
|---|---:|---:|---:|---:|
| Form 001 | 8 | 2,817,376 | 2.687 | 351.48 s |
| Form 002 | 8 | 2,959,648 | 2.823 | 369.28 s |
| Form 003 | 8 | 2,996,512 | 2.858 | 373.88 s |
| **Total** | **24** | **8,773,536** | **8.367** | **1,094.64 s (18:14.64)** |

Average file size is 365,564 bytes. The smallest asset is `form-001/part-1-track-05.mp3` at 132,908 bytes; the largest is `form-002/part-4.mp3` at 779,180 bytes.

All 24 files are mono MP3 at 24 kHz and 64 kbit/s. `ffprobe` inspected every file. Manifest checksums, current normalized script hashes, byte sizes, durations, content/audio versions, stable mappings, and multi-speaker requirements all pass.

## QA status

Automated objective QA is `PASS` for all 24 rows in `GERMAN-B1-LISTENING-AUDIO-QA.md`. Browser smoke testing confirmed Form 001 playback starts and decodes in Parts 1–4 with the official 2/1/1/2 playback limits. Production Chrome also prepared all eight Form 001 tracks. A simulated-offline browser check exposed the prior range-response failure and led to the Cache Storage blob-URL fallback above; that fix passes unit and production-build verification. A final native-browser offline playback rerun remains pending because browser automation became unavailable during the service-worker reload.

Human-listen status remains `PENDING` for every asset. Pronunciation, pacing, numbers/times, naturalness, speaker distinction, clipping, silence, pauses, and transcript identity must still be reviewed by a person. Physical Android Chrome/PWA, iPhone Safari/Home Screen, screen-lock, and Bluetooth/headset validation also remain pending.
