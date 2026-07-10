import Link from "next/link";

import { SiteHeader } from "@/components/site-header";
import { TestnetBanner } from "@/components/testnet-banner";
import { getNavigationGroups, getPageHref } from "@/lib/docs";

export default function NotFound() {
  const navigationGroups = getNavigationGroups();

  return (
    <div className="docs-app">
      <TestnetBanner />
      <SiteHeader />

      <main className="landing nf">
        <section className="landing-hero">
          <div className="crumbs">
            <span className="crumb-here">404</span>
          </div>
          <h1>Page not found</h1>
          <p className="lede">
            The page you followed doesn&apos;t exist — it may have moved during a docs reorganization. Everything
            published lives in the sections below.
          </p>
          <div className="landing-actions">
            <Link className="cta" href="/docs/introduction">
              Read the introduction
            </Link>
            <Link className="cta-secondary" href="/">
              Docs home
            </Link>
          </div>
        </section>

        <section className="landing-section">
          <h2>All pages</h2>
          <div className="card-grid persona-grid">
            {navigationGroups.map((group) => (
              <div className="landing-card persona-card" key={group.title}>
                <div className="landing-card-title">{group.title}</div>
                <div className="persona-links">
                  {group.pages.map((page) => (
                    <Link href={getPageHref(page)} key={page.id}>
                      {page.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="docs-footer">
        <div className="docs-footer-inner">© EqualFi Labs. All rights reserved.</div>
      </footer>
    </div>
  );
}
