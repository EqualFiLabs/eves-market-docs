"use client";

export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const current = root.dataset.theme ?? (prefersDark ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Private browsing modes can block storage; the toggle still works for the session.
    }
  }

  return (
    <button className="theme-toggle" type="button" onClick={toggle} aria-label="Toggle color theme">
      ◐
    </button>
  );
}
