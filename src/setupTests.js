// jsdom does not implement media playback. Provide the browser-shaped no-op
// behavior that component tests expect so real console warnings remain visible.
Object.defineProperty(window.HTMLMediaElement.prototype, "play", {
  configurable: true,
  value: jest.fn().mockResolvedValue(undefined),
});
Object.defineProperty(window.HTMLMediaElement.prototype, "pause", {
  configurable: true,
  value: jest.fn(),
});
