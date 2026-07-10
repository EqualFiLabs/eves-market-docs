import Image from "next/image";
import Link from "next/link";

import { MdxContent } from "@/components/mdx-content";
import { MobileDocsMenu } from "@/components/mobile-docs-menu";
import { TestnetBanner } from "@/components/testnet-banner";
import { ThemeToggle } from "@/components/theme-toggle";
import { type DocPage as DocPageType, getAllPages, getNavigationGroups, getPageHref } from "@/lib/docs";
import { APP_URL } from "@/lib/site";

export function DocsPage({ page }: { page: DocPageType }) {
  const allPages = getAllPages();
  const navigationGroups = getNavigationGroups();
  const pageIndex = allPages.findIndex((entry) => entry.id === page.id);
  const previousPage = pageIndex > 0 ? allPages[pageIndex - 1] : null;
  const nextPage = pageIndex >= 0 && pageIndex < allPages.length - 1 ? allPages[pageIndex + 1] : null;
  const crumbSegments = page.slug.slice(0, -1);

  // Slim the props crossing into the client component: passing full DocPage
  // objects serializes every page's content into each page's RSC payload.
  const mobileNavigationGroups = navigationGroups.map((group) => ({
    title: group.title,
    pages: group.pages.map((entry) => ({
      id: entry.id,
      label: entry.label,
      slug: entry.slug,
      badge: entry.badge,
    })),
  }));
  const mobileSections = page.toc
    .filter((entry) => entry.depth === 2)
    .map((entry) => ({ id: entry.id, title: entry.title }));

  return (
    <div className="docs-app">
      <a className="skip-link" href="#doc-content">
        Skip to content
      </a>
      <TestnetBanner />

      <header className="topbar">
        <div className="topbar-inner">
          <MobileDocsMenu activePageId={page.id} navigationGroups={mobileNavigationGroups} sections={mobileSections} />

          <Link className="brand" href="/docs/introduction">
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

      <div className="shell">
        <nav className="sidebar" aria-label="Docs">
          {navigationGroups.map((group) => (
            <div className="nav-group" key={group.title}>
              <div className="nav-group-title">{group.title}</div>
              <div className="nav-links">
                {group.pages.map((entry) => {
                  const active = entry.id === page.id;
                  return (
                    <Link
                      className={`nav-link${active ? " nav-link-active" : ""}`}
                      href={getPageHref(entry)}
                      key={entry.id}
                      aria-current={active ? "page" : undefined}
                    >
                      <span>{entry.label}</span>
                      {entry.badge ? <span className="nav-badge">{entry.badge}</span> : null}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <main className="article" id="doc-content">
          <div className="crumbs">
            <Link href="/docs/introduction">docs</Link>
            {crumbSegments.map((segment) => (
              <span key={segment}>
                <span className="crumb-sep">/</span>
                {segment}
              </span>
            ))}
            <span>
              <span className="crumb-sep">/</span>
              <span className="crumb-here">{page.slug[page.slug.length - 1]}</span>
            </span>
          </div>

          <h1>{page.title}</h1>
          <p className="lede">{page.description}</p>
          <div className="page-meta">
            <span>Updated {page.updated}</span>
          </div>

          <MdxContent source={page.body} />

          <div className="pager">
            {previousPage ? (
              <Link className="pager-card" href={getPageHref(previousPage)}>
                <span className="pager-label">Previous</span>
                <span className="pager-title">{previousPage.label}</span>
              </Link>
            ) : (
              <div />
            )}

            {nextPage ? (
              <Link className="pager-card pager-card-next" href={getPageHref(nextPage)}>
                <span className="pager-label">Next</span>
                <span className="pager-title">{nextPage.label}</span>
              </Link>
            ) : null}
          </div>
        </main>

        <nav className="toc" aria-label="On this page">
          <div className="toc-title">On this page</div>
          <div className="toc-links">
            {page.toc.map((entry) => (
              <a href={`#${entry.id}`} className={entry.depth === 3 ? "toc-sub" : undefined} key={entry.id}>
                {entry.title}
              </a>
            ))}
          </div>
        </nav>
      </div>

      <footer className="docs-footer">
        <div className="docs-footer-inner">© EqualFi Labs. All rights reserved.</div>
      </footer>
    </div>
  );
}
