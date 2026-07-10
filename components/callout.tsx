import type { ReactNode } from "react";

const icons = { note: "i", success: "✓", warning: "!" } as const;

export function Callout({
  tone,
  title,
  children,
}: {
  tone: keyof typeof icons;
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className={`callout callout-${tone}`}>
      <div className="callout-icon" aria-hidden>
        {icons[tone]}
      </div>
      <div>
        {title ? <div className="callout-title">{title}</div> : null}
        <div className="callout-body">{children}</div>
      </div>
    </div>
  );
}
