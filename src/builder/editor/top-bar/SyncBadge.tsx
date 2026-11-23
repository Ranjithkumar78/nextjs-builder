"use client";

import { useSyncStatus } from "../../store";
import { Icon } from "../../ui/Icon";

/** "Saving…", "Saved", or "Not saved · Retry" after a failed save. */
export function SyncBadge() {
  const { sync, retrySync } = useSyncStatus();
  if (sync.status === "error")
    return (
      <button className="b-saved error" title={`${sync.message ?? "Not saved"} — click to try again`} onClick={retrySync}>
        <Icon name="close" size={13} /> Not saved · Retry
      </button>
    );
  const saving = sync.status === "saving";
  return (
    <span className="b-saved" title={saving ? "Saving to the server…" : "All changes are saved to the server"}>
      {saving ? <span className="b-spinner tiny" /> : <Icon name="check" size={13} />} {saving ? "Saving…" : "Saved"}
    </span>
  );
}
