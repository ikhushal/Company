import { links, site } from "@/content/site";
import { iconPathData } from "./Icon";

const escape = (text: string) =>
  text.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

/** Same markup as <Icon>, as a string. */
export function iconHtml(name: keyof typeof iconPathData, className?: string) {
  const cls = className ? ` class="${escape(className)}"` : "";
  return `<svg${cls} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="${iconPathData[name]}"/></svg>`;
}

export { escape as escapeHtml };

/**
 * Telephone link rendered as static HTML.
 *
 * Click-to-call browser extensions (Avaya and similar) wrap every tel: link
 * in their own element before React hydrates, which makes hydration fail.
 * React never diffs inside dangerouslySetInnerHTML, so whatever the extension
 * does to the link is left alone. The wrapper is `display: contents`, so the
 * link still lays out as a direct child of its parent.
 *
 * `inner` replaces the default content (phone icon + number) with custom HTML.
 */
export function PhoneLink({
  className,
  label = site.contact.phoneDisplay,
  wrapLabel = false,
  inner,
}: {
  className?: string;
  label?: string;
  wrapLabel?: boolean;
  inner?: string;
}) {
  const cls = className ? ` class="${escape(className)}"` : "";
  const text = wrapLabel ? `<span>${escape(label)}</span>` : escape(label);
  const html = `<a href="${escape(links.tel)}"${cls}>${inner ?? iconHtml("phone") + text}</a>`;
  return <span className="phone-link" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: html }} />;
}
