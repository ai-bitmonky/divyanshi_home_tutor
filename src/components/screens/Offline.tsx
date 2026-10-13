"use client";

import { Icon } from "../Icons";

export function OfflineScreen() {
  return (
    <div className="offline" role="status">
      <span className="offline-ic">
        <Icon name="globe" size={30} />
      </span>
      <h1>You&apos;re offline</h1>
      <p>Check your internet connection. Pages you opened before still work.</p>
      <button type="button" className="btn btn-p" onClick={() => window.location.reload()}>
        <Icon name="refresh" size={18} /> Try again
      </button>
    </div>
  );
}
