import type { ReactNode } from "react";

import Image from "next/image";
import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";
import { APP_URL } from "@/lib/site";

export function SiteHeader({ leading }: { leading?: ReactNode }) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        {leading}

        <Link className="brand" href="/">
          <Image src="/eve-logo.png" alt="" width={26} height={26} className="brand-mark" priority />
          <span className="brand-name">
            eves.market <span>/ docs</span>
          </span>
        </Link>

        <nav className="top-links" aria-label="Site">
          <Link href="/docs/introduction">Protocol</Link>
          <Link href="/docs/reference/builder-reference">Builders</Link>
          <Link href="/docs/reference/base-sepolia-deployment">Addresses</Link>
        </nav>
        <ThemeToggle />
        <a className="cta" href={APP_URL} target="_blank" rel="noreferrer">
          Launch app ↗
        </a>
      </div>
    </header>
  );
}
