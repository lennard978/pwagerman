# German B1 Listening — format sources and audio status

Reviewed: 2026-10-31

This is an independent preparation tool. It is not affiliated with or endorsed by the Goethe-Institut.

## Official structural references

- [Goethe-Zertifikat B1 exam information](https://www.goethe.de/ins/de/de/prf/gzb1.cfm)
- [Accessible Goethe B1 Listening model](https://bfu.goethe.de/b1_mod/hoeren.php)
- [Current Goethe B1 practice-material page](https://www.goethe.de/ins/de/de/m/prf/gzb1/ueb.html)
- [Current Goethe-Zertifikat B1 implementation regulations](https://www.goethe.de/pro/relaunch/prf/de/Durchfuehrungsbestimmungen_B1.pdf), last updated by Goethe on 2025-09-01

The references were used only to verify the approximately 40-minute, four-part structure; the `10/5/7/8` item distribution; preparation behavior; playback counts; and module-level scoring model.

## Original-content statement

- No official audio was downloaded, repackaged, or copied.
- No official transcript, question, answer, speaker performance, name, or scenario was copied.
- All 24 structured scripts, 90 scored items, distractors, explanations, evidence notes, and speaker identities are original app-authored material.
- The application does not use Goethe branding or present these forms as official tests.

## Audio-production status

Phase 5 contains a provider-neutral audio manifest and data-driven speaker profiles for prerecorded assets and generated development assets. The current repository has no configured German multi-voice provider and the host has no installed German system voice. Consequently, the manifest entries are deliberately marked `pending-generation`; there are no fabricated or unstable runtime-TTS exam recordings.

`developmentAudioPlan.js` maps each structured segment to a configuration-driven `de-DE` voice and target asset path. It refuses multi-speaker production when profiles are missing or resolve to the same voice. This is a build-time handoff contract, not a client-side synthesis path; provider credentials remain outside the repository.

For deterministic local UI checks only, a short silent WAV can be selected by setting `REACT_APP_LISTENING_FIXTURE_MODE=true` in a non-production process. The fixture is labelled in the UI, contains no spoken content, is never selected in production, and must not be treated as a completed Listening form.

Before a scored attempt can start, the app verifies that every required entry is marked ready, has an asset checksum, resolves successfully, exposes valid metadata, and can be decoded by the browser. Until reviewed German multi-voice MP3 assets are generated or human recordings are supplied, this preflight fails with a clear message and the timer does not start.

When assets are produced, each file must:

1. be generated from the matching structured script checksum;
2. use configured `de-DE` speaker profiles without embedded credentials;
3. be reviewed for pronunciation, speaker identity, timing, and B1 clarity;
4. be stored under `public/audio/listening/audio-v1/`;
5. receive an asset checksum and `ready` status in the manifest source.

## Timing and digital answer model

The official accessible model mentions approximately five minutes for marking answers in the real examination. This digital implementation records answers immediately and therefore does not imitate a paper answer-transfer workflow. Answers remain editable until manual submission or the absolute 40-minute deadline.

## Offline and storage behavior

Listening media uses the separate versioned cache `german-b1-listening-audio-v1`. The runtime route is cache-first, retains at most 24 entries for at most 30 days, purges on quota pressure, and does not share the app-shell cache. Old versioned Listening caches are removed by the explicit cache helper. Storage size depends on the final reviewed bitrate; the UI does not promise offline simulation until all required assets pass preflight or are confirmed cached.
