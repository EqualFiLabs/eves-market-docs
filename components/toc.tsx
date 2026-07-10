"use client";

import { useEffect, useState } from "react";

import type { TocEntry } from "@/lib/docs";

export function Toc({ entries }: { entries: TocEntry[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const headings = entries
      .map((entry) => document.getElementById(entry.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (observed) => {
        for (const entry of observed) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [entries]);

  if (entries.length === 0) {
    return null;
  }

  return (
    <nav className="toc" aria-label="On this page">
      <div className="toc-title">On this page</div>
      <div className="toc-links">
        {entries.map((entry) => {
          const classNames = [entry.depth === 3 ? "toc-sub" : "", entry.id === activeId ? "active" : ""]
            .filter(Boolean)
            .join(" ");
          return (
            <a href={`#${entry.id}`} className={classNames || undefined} key={entry.id}>
              {entry.title}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
