import { lazy, type ComponentType } from "react";

type LazyModule<T extends ComponentType<any>> = { default: T };
type RetryStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;
export type RetryWindow = {
  sessionStorage: RetryStorage;
  location: Pick<Location, "reload">;
};

function getRetryWindow(): RetryWindow | undefined {
  if (typeof window === "undefined") return undefined;
  return window;
}

/**
 * Loads a lazy module and retries one interrupted chunk load with a full page
 * reload. This handles deployments that leave a browser with an old HTML
 * document pointing at a removed chunk hash.
 */
export async function loadWithRetry<T extends ComponentType<any>>(
  importer: () => Promise<LazyModule<T>>,
  chunkName: string,
  retryWindow: RetryWindow | undefined = getRetryWindow(),
) {
  const retryKey = `purely-divine:lazy-retry:${chunkName}`;
  let hasRetried = false;

  try {
    hasRetried = retryWindow?.sessionStorage.getItem(retryKey) === "1";
  } catch {
    // Some privacy modes expose sessionStorage but reject access to it.
  }

  try {
    const module = await importer();
    try {
      retryWindow?.sessionStorage.removeItem(retryKey);
    } catch {
      // The loaded assessment remains usable even if storage cleanup is blocked.
    }
    return module;
  } catch (error) {
    if (retryWindow && !hasRetried) {
      try {
        retryWindow.sessionStorage.setItem(retryKey, "1");
      } catch {
        // Continue to the visible error boundary when a retry flag cannot be stored.
      }
      retryWindow.location.reload();
    }
    throw error;
  }
}

export function lazyWithRetry<T extends ComponentType<any>>(
  importer: () => Promise<LazyModule<T>>,
  chunkName: string,
) {
  return lazy(() => loadWithRetry(importer, chunkName));
}

export function clearLazyRetry(chunkName: string) {
  if (typeof window !== "undefined") {
    try {
      window.sessionStorage.removeItem(`purely-divine:lazy-retry:${chunkName}`);
    } catch {
      // Recovery should still proceed with a full reload when storage is blocked.
    }
  }
}
