let waitingRegistration = null;
let reloadRequested = false;
let reloadTriggered = false;
const listeners = new Set();

export const getWaitingRegistration = () => waitingRegistration;

const notifyListeners = () => {
  listeners.forEach((listener) => listener(waitingRegistration));
};

export const setWaitingRegistration = (registration) => {
  if (!registration?.waiting) return;
  waitingRegistration = registration;
  notifyListeners();
};

export const subscribeToServiceWorkerUpdate = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const activateWaitingServiceWorker = (
  reloadPage = () => window.location.reload()
) => {
  if (!waitingRegistration?.waiting || reloadRequested) return;
  reloadRequested = true;
  const waitingWorker = waitingRegistration.waiting;

  const reloadOnce = () => {
    if (reloadTriggered) return;
    reloadTriggered = true;
    waitingRegistration = null;
    notifyListeners();
    navigator.serviceWorker.removeEventListener?.("controllerchange", reloadOnce);
    reloadPage();
  };

  navigator.serviceWorker.addEventListener("controllerchange", reloadOnce);
  waitingWorker.addEventListener?.("statechange", () => {
    if (waitingWorker.state === "activated") reloadOnce();
  });

  waitingWorker.postMessage({ type: "SKIP_WAITING" });
};

export const resetServiceWorkerUpdateForTests = () => {
  waitingRegistration = null;
  reloadRequested = false;
  reloadTriggered = false;
  listeners.clear();
};