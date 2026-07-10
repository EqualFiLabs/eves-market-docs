import Image from "next/image";
import Link from "next/link";

import { MobileDocsMenu } from "@/components/mobile-docs-menu";
import { type DocBlock, type DocPage as DocPageType, getAllPages, getNavigationGroups, getPageHref } from "@/lib/docs";

function renderInline(text: string) {
  const parts = text.split(/(`[^`]+`|\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={`${part}-${index}`}>{part.slice(1, -1)}</code>;
    }

    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
    }

    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a href={linkMatch[2]} key={`${part}-${index}`}>
          {linkMatch[1]}
        </a>
      );
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

function renderBlock(block: DocBlock, index: number) {
  if (block.type === "paragraph") {
    return <p key={index}>{renderInline(block.text)}</p>;
  }

  if (block.type === "list") {
    return (
      <ul className="doc-list" key={index}>
        {block.items.map((item, itemIndex) => (
          <li key={`${item}-${itemIndex}`}>{renderInline(item)}</li>
        ))}
      </ul>
    );
  }

  if (block.type === "table") {
    return (
      <div className="table-wrap" key={index}>
        <table>
          <thead>
            <tr>
              {block.columns.map((column, columnIndex) => (
                <th key={`${column}-${columnIndex}`}>{renderInline(column)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr key={row.join("|") || rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={`${cell}-${cellIndex}`}>{renderInline(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (block.type === "code") {
    return (
      <div className="code-block" key={index}>
        <div className="code-header">
          <span>{block.label}</span>
          <span>{block.language}</span>
        </div>
        <pre>
          <code>{block.content}</code>
        </pre>
      </div>
    );
  }

  return (
    <div className={`callout callout-${block.tone}`} key={index}>
      <div className="callout-title">{block.title}</div>
      <p>{renderInline(block.body)}</p>
    </div>
  );
}

export function DocsPage({ page }: { page: DocPageType }) {
  const allPages = getAllPages();
  const navigationGroups = getNavigationGroups();
  const pageIndex = allPages.findIndex((entry) => entry.id === page.id);
  const previousPage = pageIndex > 0 ? allPages[pageIndex - 1] : null;
  const nextPage = pageIndex >= 0 && pageIndex < allPages.length - 1 ? allPages[pageIndex + 1] : null;

  return (
    <div className="docs-app">
      <header className="topbar">
        <div className="topbar-inner">
          <MobileDocsMenu activePageId={page.id} navigationGroups={navigationGroups} sections={page.sections} />

          <Link className="brand" href="/docs/introduction">
            <span className="brand-mark">
              <Image
                src="/eve-logo.png"
                alt="Eves Market"
                width={40}
                height={40}
                className="brand-mark-image"
                priority
              />
            </span>
            <div>
              <div className="brand-title">Eves Market Protocol Docs</div>
              <div className="brand-subtitle">Markets, collateral, resolution, and integrations</div>
            </div>
          </Link>

          <nav className="top-actions">
            <Link href="/docs/markets/orderbook-markets">Markets</Link>
            <Link href="/docs/markets/combinatorial-positions">Combos</Link>
            <Link href="/docs/resolution/optimistic-resolution">Resolution</Link>
            <Link href="/docs/reference/base-sepolia-deployment">Addresses</Link>
            <Link href="/docs/collateral/eveusdc">Collateral</Link>
          </nav>
        </div>
      </header>

      <div className="docs-grid">
        <aside className="sidebar">
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
                    >
                      <span>{entry.label}</span>
                      {entry.badge ? <span className="nav-badge">{entry.badge}</span> : null}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </aside>

        <main className="article">
          <div className="hero-panel">
            <div className="eyebrow-row">
              <span className="eyebrow">{page.eyebrow}</span>
            </div>
            <h1>{page.title}</h1>
            <p className="hero-description">{page.description}</p>
            <div className="hero-meta">
              <span>Updated {page.updated}</span>
              <span>{page.status}</span>
              <span>{allPages.length} pages</span>
              <span>Eves Market Protocol</span>
            </div>
          </div>

          {page.sections.map((section) => (
            <section className="content-section" id={section.id} key={section.id}>
              <h2>{section.title}</h2>
              {section.blocks.map(renderBlock)}
            </section>
          ))}

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

        <aside className="toc">
          <div className="toc-card">
            <div className="toc-title">On this page</div>
            <div className="toc-links">
              {page.sections.map((section) => (
                <a href={`#${section.id}`} key={section.id}>
                  {section.title}
                </a>
              ))}
            </div>

          </div>
        </aside>
      </div>

      <footer className="docs-footer">
        <div className="docs-footer-inner">© EqualFi Labs. All rights reserved.</div>
      </footer>
    </div>
  );
}
