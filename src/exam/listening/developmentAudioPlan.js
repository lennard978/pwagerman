import { LISTENING_SPEAKER_PROFILES } from "./speakerProfiles";

const unique = (values) => [...new Set(values)];

export const createDevelopmentAudioPlan = (
  audio,
  environment = {},
  profiles = LISTENING_SPEAKER_PROFILES
) => {
  const profileIds = unique(audio.speakers.map(({ voiceProfile }) => voiceProfile));
  const unknownProfiles = profileIds.filter((id) => !profiles[id]);
  const missingVoiceKeys = profileIds
    .map((id) => profiles[id]?.environmentKey)
    .filter((key) => key && !environment[key]);
  const configuredVoices = profileIds
    .map((id) => environment[profiles[id]?.environmentKey])
    .filter(Boolean);
  const distinctVoicesRequired = audio.speakers.length > 1;
  const distinctVoicesReady = !distinctVoicesRequired || unique(configuredVoices).length === profileIds.length;
  const blockers = [
    ...unknownProfiles.map((profileId) => ({ reason: "unknown-speaker-profile", profileId })),
    ...missingVoiceKeys.map((environmentKey) => ({ reason: "voice-not-configured", environmentKey })),
    ...(!missingVoiceKeys.length && !distinctVoicesReady ? [{ reason: "distinct-voices-required" }] : []),
  ];

  const speakers = Object.fromEntries(audio.speakers.map((speaker) => {
    const profile = profiles[speaker.voiceProfile];
    return [speaker.id, {
      speakerId: speaker.id,
      label: speaker.label,
      locale: profile?.locale || audio.locale,
      voiceProfile: speaker.voiceProfile,
      configuredVoice: profile ? environment[profile.environmentKey] || null : null,
    }];
  }));

  return {
    audioId: audio.id,
    mode: "stable-asset-build",
    ready: blockers.length === 0,
    sourceType: audio.sourceType,
    outputPath: audio.assetPath,
    scriptChecksum: audio.scriptChecksum,
    audioVersion: audio.audioVersion,
    speakers,
    segments: audio.segments.map((segment, index) => ({
      index,
      ...segment,
      locale: speakers[segment.speakerId]?.locale || audio.locale,
      configuredVoice: speakers[segment.speakerId]?.configuredVoice || null,
    })),
    blockers,
  };
};
