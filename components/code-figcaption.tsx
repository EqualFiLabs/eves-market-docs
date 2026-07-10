"use client";

import { type ComponentProps, useRef, useState } from "react";

export function CodeFigcaption({ children, ...rest }: ComponentProps<"figcaption">) {
  const ref = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  function copy() {
    const pre = ref.current?.closest("figure")?.querySelector("pre");
    if (!pre) {
      return;
    }
    navigator.clipboard?.writeText(pre.innerText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  }

  return (
    <figcaption ref={ref} {...rest}>
      {children}
      <button type="button" className="code-copy" onClick={copy}>
        {copied ? "Copied" : "Copy"}
      </button>
    </figcaption>
  );
}
