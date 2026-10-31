import { getFullMockAvailability } from "../config/goetheB1Mock";
import { mockForms, validateMockForms } from "./mockForms";

describe("Full B1 mock definitions", () => {
  test("defines three complete configurations referencing existing forms", () => {
    expect(mockForms).toHaveLength(3);
    expect(validateMockForms()).toEqual({ valid: true, errors: [] });
    mockForms.forEach((mock) => {
      expect(Object.keys(mock.modules)).toEqual(["reading", "listening", "writing", "speaking"]);
      expect(mock.modules.reading.durationSeconds).toBe(3900);
      expect(mock.modules.listening.durationSeconds).toBe(2400);
      expect(mock.modules.writing.durationSeconds).toBe(3600);
      expect(mock.modules.speaking.preparationSeconds).toBe(900);
    });
  });

  test("blocks production when Listening assets are pending", () => {
    const manifest = [{ assetStatus: "pending", assetChecksum: null, developmentFixture: false }];
    expect(getFullMockAvailability({ manifest, nodeEnv: "production" })).toEqual(expect.objectContaining({ available: false, reason: "listening-audio-pending" }));
  });

  test("allows fixtures only through explicit non-production configuration", () => {
    const manifest = [{ assetStatus: "development-fixture", assetChecksum: "fixture", developmentFixture: true }];
    expect(getFullMockAvailability({ manifest, nodeEnv: "test", fixtureMode: true, allowDevelopmentFixture: true }).available).toBe(true);
    expect(getFullMockAvailability({ manifest, nodeEnv: "production", fixtureMode: true, allowDevelopmentFixture: true }).available).toBe(false);
    expect(getFullMockAvailability({ manifest, nodeEnv: "test", fixtureMode: false, allowDevelopmentFixture: true }).available).toBe(false);
  });
});
