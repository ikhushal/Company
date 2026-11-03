"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import styles from "./Tabs.module.css";

export type TabItem = { id: string; label: ReactNode; content: ReactNode };

/**
 * Accessible tabs (WAI-ARIA tabs pattern): arrow keys move between tabs,
 * Home and End jump, only the selected tab is in the Tab order.
 */
export function Tabs({
  items,
  label,
  variant = "list",
  tone = "light",
}: {
  items: TabItem[];
  label: string;
  variant?: "list" | "pills";
  tone?: "light" | "dark";
}) {
  const [active, setActive] = useState(0);
  const base = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (index: number, focus = false) => {
    setActive(index);
    if (focus) tabRefs.current[index]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const moves: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let next: number | null = null;
    if (event.key in moves) next = (index + moves[event.key] + items.length) % items.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = items.length - 1;
    if (next !== null) {
      event.preventDefault();
      select(next, true);
    }
  };

  return (
    <div className={`${styles.tabs} ${variant === "pills" ? styles.pills : styles.vertical} ${tone === "dark" ? styles.dark : ""}`}>
      <div role="tablist" aria-label={label} className={styles.list}>
        {items.map((item, index) => (
          <button
            key={item.id}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            type="button"
            role="tab"
            id={`${base}-tab-${item.id}`}
            aria-selected={active === index}
            aria-controls={`${base}-panel-${item.id}`}
            tabIndex={active === index ? 0 : -1}
            className={styles.tab}
            onClick={() => select(index)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            {variant === "list" && <span className={styles.num}>{String(index + 1).padStart(2, "0")}</span>}
            <span className={styles.tabLabel}>{item.label}</span>
          </button>
        ))}
      </div>
      {items.map((item, index) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`${base}-panel-${item.id}`}
          aria-labelledby={`${base}-tab-${item.id}`}
          tabIndex={0}
          hidden={active !== index}
          className={styles.panel}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
