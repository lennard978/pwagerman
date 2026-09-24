import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { UpdateNotification } from "../components/UpdateNotification";
import { LanguageProvider } from "../i18n/LanguageProvider";
import {
  activateWaitingServiceWorker,
  resetServiceWorkerUpdateForTests,
  setWaitingRegistration,
} from "./serviceWorkerUpdate";

beforeEach(() => {
  resetServiceWorkerUpdateForTests();
});

test("update notification appears only for a waiting service worker", () => {
  render(
    <LanguageProvider>
      <UpdateNotification />
    </LanguageProvider>
  );

  expect(screen.queryByText("New version available")).toBeNull();
  act(() => setWaitingRegistration({ waiting: null }));
  expect(screen.queryByText("New version available")).toBeNull();

  act(() => setWaitingRegistration({ waiting: { postMessage: jest.fn() } }));
  expect(screen.getByText("New version available")).toBeTruthy();
  expect(screen.getByRole("button", { name: "Update now" })).toBeTruthy();
});

test("Update now requests activation and reloads once after controller change", () => {
  const postMessage = jest.fn();
  const reloadPage = jest.fn();
  let controllerChange;
  const originalServiceWorker = navigator.serviceWorker;
  Object.defineProperty(navigator, "serviceWorker", {
    configurable: true,
    value: {
      addEventListener: jest.fn((event, listener, options) => {
        expect(event).toBe("controllerchange");
        expect(options).toBeUndefined();
        controllerChange = listener;
      }),
      removeEventListener: jest.fn(),
    },
  });

  setWaitingRegistration({ waiting: { postMessage } });
  activateWaitingServiceWorker(reloadPage);

  expect(postMessage).toHaveBeenCalledWith({ type: "SKIP_WAITING" });
  expect(reloadPage).not.toHaveBeenCalled();
  controllerChange();
  controllerChange();
  expect(reloadPage).toHaveBeenCalledTimes(1);

  Object.defineProperty(navigator, "serviceWorker", {
    configurable: true,
    value: originalServiceWorker,
  });
});

test("activated waiting worker is a safe reload fallback when controllerchange is missed", () => {
  const reloadPage = jest.fn();
  let stateChange;
  const waiting = {
    state: "installed",
    postMessage: jest.fn(),
    addEventListener: jest.fn((event, listener) => {
      expect(event).toBe("statechange");
      stateChange = listener;
    }),
  };
  const originalServiceWorker = navigator.serviceWorker;
  Object.defineProperty(navigator, "serviceWorker", {
    configurable: true,
    value: {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
  });

  setWaitingRegistration({ waiting });
  activateWaitingServiceWorker(reloadPage);
  waiting.state = "activated";
  stateChange();
  stateChange();

  expect(waiting.postMessage).toHaveBeenCalledWith({ type: "SKIP_WAITING" });
  expect(reloadPage).toHaveBeenCalledTimes(1);
  Object.defineProperty(navigator, "serviceWorker", {
    configurable: true,
    value: originalServiceWorker,
  });
});

test("activation is harmless when no waiting worker exists", () => {
  expect(() => activateWaitingServiceWorker(jest.fn())).not.toThrow();
});

test("toast clears on takeover and stays absent in the updated page state", () => {
  let controllerChange;
  const originalServiceWorker = navigator.serviceWorker;
  Object.defineProperty(navigator, "serviceWorker", {
    configurable: true,
    value: {
      addEventListener: jest.fn((event, listener) => {
        controllerChange = listener;
      }),
      removeEventListener: jest.fn(),
    },
  });
  const registration = { waiting: { postMessage: jest.fn() } };
  setWaitingRegistration(registration);
  const view = render(
    <LanguageProvider>
      <UpdateNotification />
    </LanguageProvider>
  );
  expect(screen.getByText("New version available")).toBeTruthy();

  activateWaitingServiceWorker(jest.fn());
  act(() => controllerChange());
  expect(screen.queryByText("New version available")).toBeNull();

  view.unmount();
  resetServiceWorkerUpdateForTests();
  render(
    <LanguageProvider>
      <UpdateNotification />
    </LanguageProvider>
  );
  expect(screen.queryByText("New version available")).toBeNull();
  Object.defineProperty(navigator, "serviceWorker", {
    configurable: true,
    value: originalServiceWorker,
  });
});

test("notification button uses the same activation path", () => {
  const postMessage = jest.fn();
  const originalServiceWorker = navigator.serviceWorker;
  Object.defineProperty(navigator, "serviceWorker", {
    configurable: true,
    value: { addEventListener: jest.fn() },
  });
  setWaitingRegistration({ waiting: { postMessage } });

  render(
    <LanguageProvider>
      <UpdateNotification />
    </LanguageProvider>
  );
  fireEvent.click(screen.getByRole("button", { name: "Update now" }));

  expect(postMessage).toHaveBeenCalledWith({ type: "SKIP_WAITING" });
  Object.defineProperty(navigator, "serviceWorker", {
    configurable: true,
    value: originalServiceWorker,
  });
});
