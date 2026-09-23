let waitingRegistration = null;
let reloadRequested = false;
const listeners = new Set();

export const getWaitingRegistration = () => waitingRegistration;

export const setWaitingRegistration = (registration) => {
  if (!registration?.waiting) return;
  waitingRegistration = registration;
  listeners.forEach((listener) => listener(waitingRegistration));
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
  let reloaded = false;

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (reloaded) return;
    reloaded = true;
    reloadPage();
  }, { once: true });

  waitingRegistration.waiting.postMessage({ type: "SKIP_WAITING" });
};

export const resetServiceWorkerUpdateForTests = () => {
  waitingRegistration = null;
  reloadRequested = false;
  listeners.clear();
};