"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

type NavigationPage = {
  id: string;
  label: string;
  slug: string[];
  badge?: string;
};

type NavigationGroup = {
  title: string;
  pages: NavigationPage[];
};

type PageSection = {
  id: string;
  title: string;
};

function getHref(page: Pick<NavigationPage, "slug">) {
  return `/docs/${page.slug.join("/")}`;
}

export function MobileDocsMenu({
  activePageId,
  navigationGroups,
  sections,
}: {
  activePageId: string;
  navigationGroups: NavigationGroup[];
  sections: PageSection[];
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const menuPanel = open ? (
    <div className="mobile-menu-panel" role="dialog" aria-modal="true" aria-label="Docs navigation">
      <div className="mobile-menu-top">
        <div>
          <div className="mobile-menu-title">Contents</div>
          <div className="mobile-menu-subtitle">Eves Market Protocol Docs</div>
        </div>
        <button
          aria-label="Close docs navigation"
          className="mobile-menu-close"
          onClick={() => setOpen(false)}
          type="button"
        >
          <span />
          <span />
        </button>
      </div>

      <div className="mobile-menu-scroll">
        <div className="mobile-menu-section">
          <div className="mobile-menu-heading">On this page</div>
          <div className="mobile-anchor-links">
            {sections.map((section) => (
              <a href={`#${section.id}`} key={section.id} onClick={() => setOpen(false)}>
                {section.title}
              </a>
            ))}
          </div>
        </div>

        {navigationGroups.map((group) => (
          <div className="mobile-menu-section" key={group.title}>
            <div className="mobile-menu-heading">{group.title}</div>
            <div className="mobile-nav-links">
              {group.pages.map((entry) => {
                const active = entry.id === activePageId;
                return (
                  <Link
                    className={`mobile-nav-link${active ? " mobile-nav-link-active" : ""}`}
                    href={getHref(entry)}
                    key={entry.id}
                    onClick={() => setOpen(false)}
                  >
                    <span>{entry.label}</span>
                    {entry.badge ? <span className="nav-badge">{entry.badge}</span> : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        aria-expanded={open}
        aria-label="Open docs navigation"
        className="mobile-menu-button"
        onClick={() => setOpen(true)}
        type="button"
      >
        <span />
        <span />
        <span />
      </button>

      {mounted && menuPanel ? createPortal(menuPanel, document.body) : null}
    </>
  );
}
