import { render, screen, fireEvent } from "@testing-library/react";
import { LanguageProvider } from "../i18n/LanguageProvider";
import { InstallHelp, isIosDevice, isStandaloneDisplay } from "./InstallHelp";

const renderInstallHelp = () =>
  render(
    <LanguageProvider>
      <InstallHelp />
    </LanguageProvider>
  );

afterEach(() => {
  delete window.navigator.standalone;
  window.matchMedia = undefined;
});

test("shows iOS install steps on an iPhone Safari user agent", () => {
  jest.spyOn(window.navigator, "userAgent", "get").mockReturnValue(
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15"
  );
  window.matchMedia = jest.fn().mockReturnValue({ matches: false });

  renderInstallHelp();
  fireEvent.click(screen.getByRole("button", { name: "Install app" }));

  expect(screen.getByText("Tap Share in Safari")).toBeTruthy();
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
