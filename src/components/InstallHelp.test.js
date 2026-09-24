import { render, screen, fireEvent } from "@testing-library/react";
import { LanguageProvider } from "../i18n/LanguageProvider";
import {
  INSTALL_HELP_DISMISSED_KEY,
  InstallHelp,
  isIosDevice,
  isMobileDevice,
  isStandaloneDisplay,
} from "./InstallHelp";

const renderInstallHelp = () =>
  render(
    <LanguageProvider>
      <InstallHelp />
    </LanguageProvider>
  );

afterEach(() => {
  jest.restoreAllMocks();
  delete window.navigator.standalone;
  window.matchMedia = undefined;
  localStorage.clear();
});

test("shows iOS install steps on an iPhone Safari user agent", () => {
  jest.spyOn(window.navigator, "userAgent", "get").mockReturnValue(
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15"
  );
  window.matchMedia = jest.fn().mockReturnValue({ matches: false });

  renderInstallHelp();

  expect(screen.getByText("Tap Share in Safari")).toBeTruthy();
  expect(screen.getByText("Choose Add to Home Screen")).toBeTruthy();
});

test("hides the install help entirely when already running standalone", () => {
  window.matchMedia = jest.fn().mockReturnValue({ matches: true });

  renderInstallHelp();

  expect(screen.queryByRole("button", { name: "Install app" })).toBeNull();
});

test("isIosDevice recognizes iPadOS reporting as a touch-enabled Mac", () => {
  jest.spyOn(window.navigator, "platform", "get").mockReturnValue("MacIntel");
  Object.defineProperty(window.navigator, "maxTouchPoints", {
    value: 5,
    configurable: true,
  });

  expect(isIosDevice()).toBe(true);
});

test("isStandaloneDisplay detects iOS navigator.standalone", () => {
  window.matchMedia = jest.fn().mockReturnValue({ matches: false });
  window.navigator.standalone = true;

  expect(isStandaloneDisplay()).toBe(true);
});

test("shows Android install steps and remembers dismissal", () => {
  jest.spyOn(window.navigator, "userAgent", "get").mockReturnValue(
    "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/126 Mobile"
  );
  window.matchMedia = jest.fn().mockReturnValue({ matches: false });

  const view = renderInstallHelp();
  expect(screen.getByText("Open the browser menu in Chrome")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Got it" }));
  expect(localStorage.getItem(INSTALL_HELP_DISMISSED_KEY)).toBe("true");
  expect(screen.queryByText("Open the browser menu in Chrome")).toBeNull();

  view.unmount();
  renderInstallHelp();
  expect(screen.queryByText("Open the browser menu in Chrome")).toBeNull();
});

test("does not show install help on desktop browsers", () => {
  jest.spyOn(window.navigator, "userAgent", "get").mockReturnValue(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126"
  );
  window.matchMedia = jest.fn().mockReturnValue({ matches: false });

  renderInstallHelp();

  expect(screen.queryByText("Install app")).toBeNull();
  expect(isMobileDevice()).toBe(false);
});
