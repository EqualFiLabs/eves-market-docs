"use client";

import { useEffect } from "react";

const SCROLLBAR_IDLE_DELAY_MS = 720;

export function ScrollbarVisibility() {
  useEffect(() => {
    const root = document.documentElement;
    let idleTimer: number | undefined;

    const revealScrollbar = () => {
      root.classList.add("is-scrolling");

      if (idleTimer !== undefined) {
        window.clearTimeout(idleTimer);
      }

      idleTimer = window.setTimeout(() => {
        root.classList.remove("is-scrolling");
      }, SCROLLBAR_IDLE_DELAY_MS);
    };

    const eventOptions = { passive: true } as const;

    window.addEventListener("scroll", revealScrollbar, eventOptions);
    window.addEventListener("wheel", revealScrollbar, eventOptions);
    window.addEventListener("touchmove", revealScrollbar, eventOptions);

    return () => {
      window.removeEventListener("scroll", revealScrollbar);
      window.removeEventListener("wheel", revealScrollbar);
      window.removeEventListener("touchmove", revealScrollbar);

      if (idleTimer !== undefined) {
        window.clearTimeout(idleTimer);
      }

      root.classList.remove("is-scrolling");
    };
  }, []);

  return null;
}
