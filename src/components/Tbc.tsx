import type { ReactNode } from "react";
import { isProduction } from "@/content/site";

/**
 * Marks a fact the client has not yet confirmed.
 * Preview builds highlight it. Production builds never reach here, because
 * scripts/check-launch.mjs refuses to build while any <Tbc> remains; the
 * throw is a second line of defence.
 */
export function Tbc({ children }: { children: ReactNode }) {
  if (isProduction) {
    throw new Error(`Unconfirmed content reached a production build: ${String(children)}`);
  }
  return (
    <mark className="tbc">
      <strong>To confirm:</strong> {children}
    </mark>
  );
}

/** A note for the site owner, shown in preview builds only. */
export function DevNote({ children }: { children: ReactNode }) {
  if (isProduction) return null;
  return <p className="dev-note">{children}</p>;
}
