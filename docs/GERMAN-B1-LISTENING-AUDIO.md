# German B1 production Listening audio

Status: generation architecture complete; production audio generation blocked on this host.

The 24 learner scripts are original app-authored German practice material. The planned recordings are synthetic practice audio, not Goethe recordings and not official examiner voices.

## Current operational blocker

The Phase 9A audit found no configured local Google credential source (`GOOGLE_APPLICATION_CREDENTIALS` or the existing three `GOOGLE_CLOUD_*` variables). The host also has no `ffmpeg` or `ffprobe`. No production MP3 was invented, copied, or marked ready. Listening simulations and the Full B1 Mock therefore remain production-blocked.

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

Prerequisites:

- Google Cloud Text-to-Speech access through `GOOGLE_APPLICATION_CREDENTIALS`, or all of `GOOGLE_CLOUD_PROJECT_ID`, `GOOGLE_CLOUD_CLIENT_EMAIL`, and `GOOGLE_CLOUD_PRIVATE_KEY`;
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

The existing cache remains `german-b1-listening-audio-v1`, bounded to 24 entries and 30 days with quota cleanup and old-version removal. Audio is not eagerly requested by application code during install. Before a simulation, only the selected form's eight tracks are checked and cached through normal cache-first requests; the UI reports `completed / 8` progress and the timer starts only after every file exposes valid browser metadata. Preparing all forms offline remains an explicit user action.

## Size and QA status

No audio exists yet, so total, average, largest, and per-form sizes are unavailable rather than estimated. After generation, the manifest and `GERMAN-B1-LISTENING-AUDIO-QA.md` report exact values. Every human-listen status remains `PENDING` until a reviewer checks pronunciation, pacing, naturalness, speaker distinction, clipping, numbers/times, German accuracy, pauses, and transcript identity.

Physical Android/iPhone PWA, screen-lock, Bluetooth/headphone, and actual offline-playback checks remain pending until real assets exist.
