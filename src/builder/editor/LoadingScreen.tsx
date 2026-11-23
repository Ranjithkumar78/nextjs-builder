import type { SyncState } from "../store";

/** Shown until the themes are loaded from the API (or when loading failed). */
export function LoadingScreen({ sync }: { sync: SyncState }) {
  if (sync.status === "error")
    return (
      <div className="b-loading">
        <strong>Your themes could not be loaded</strong>
        <span>{sync.message}</span>
        <button className="b-btn primary" onClick={() => window.location.reload()}>
          Try again
        </button>
      </div>
    );
  return (
    <div className="b-loading">
      <div className="b-spinner" />
      Loading your themes…
    </div>
  );
}
