import { describe, expect, it, vi } from "vitest";
import { clearLazyRetry, loadWithRetry, type RetryWindow } from "./lazyWithRetry";

function createRetryWindow(initialValue?: string): RetryWindow & { value: string | null } {
  let value = initialValue ?? null;
  return {
    value,
    sessionStorage: {
      getItem: vi.fn(() => value),
      setItem: vi.fn((_key: string, next: string) => {
        value = next;
      }),
      removeItem: vi.fn(() => {
        value = null;
      }),
    },
    location: { reload: vi.fn() },
  };
}

describe("lazy assessment chunk loading", () => {
  it("reloads once after an interrupted chunk import", async () => {
    const retryWindow = createRetryWindow();
    const importer = vi.fn(() => Promise.reject(new Error("ChunkLoadError")));

    await expect(loadWithRetry(importer, "voice-quiz", retryWindow)).rejects.toThrow("ChunkLoadError");

    expect(importer).toHaveBeenCalledTimes(1);
    expect(retryWindow.sessionStorage.setItem).toHaveBeenCalledWith("purely-divine:lazy-retry:voice-quiz", "1");
    expect(retryWindow.location.reload).toHaveBeenCalledTimes(1);
  });

  it("does not loop reloads after the one retry has already happened", async () => {
    const retryWindow = createRetryWindow("1");

    await expect(loadWithRetry(() => Promise.reject(new Error("ChunkLoadError")), "divine-mindset", retryWindow)).rejects.toThrow(
      "ChunkLoadError",
    );

    expect(retryWindow.location.reload).not.toHaveBeenCalled();
    expect(retryWindow.sessionStorage.setItem).not.toHaveBeenCalled();
  });

  it("clears a successful chunk retry flag", async () => {
    const retryWindow = createRetryWindow("1");
    const module = { default: (() => null) as never };

    await expect(loadWithRetry(() => Promise.resolve(module), "voice-quiz", retryWindow)).resolves.toBe(module);
    expect(retryWindow.sessionStorage.removeItem).toHaveBeenCalledWith("purely-divine:lazy-retry:voice-quiz");

    clearLazyRetry("voice-quiz");
  });
});
