"use client";

import Link from "next/link";

export function TestnetBanner() {
  function dismiss() {
    document.documentElement.dataset.banner = "off";
    try {
      localStorage.setItem("testnet-banner", "dismissed");
    } catch {
      // Storage may be blocked; the banner stays dismissed for this page view.
    }
  }

  return (
    <div className="banner" role="status">
      <span className="banner-dot" aria-hidden />
      <span>
        Testnet alpha — contracts run on Base Sepolia and addresses can change.{" "}
        <Link href="/docs/reference/base-sepolia-deployment">Deployment snapshot</Link>
      </span>
      <button className="banner-dismiss" type="button" onClick={dismiss} aria-label="Dismiss testnet notice">
        ✕
      </button>
    </div>
  );
}
