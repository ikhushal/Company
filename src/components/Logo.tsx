import Link from "next/link";
import styles from "./Logo.module.css";

/**
 * Temporary mark: a steel I-section in a square, until the client's own logo
 * (questionnaire 6.1, "already shared") is supplied.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="7" fill="currentColor" />
      <path d="M9 8.5h14v3h-5.5v9H23v3H9v-3h5.5v-9H9z" fill="var(--logo-cut, #0a0b0d)" />
    </svg>
  );
}

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <Link href="/" className={`${styles.logo} ${tone === "light" ? styles.light : ""}`} aria-label="Whitestone Civil Engineering home">
      <LogoMark className={styles.mark} />
      <span className={styles.text}>
        <span className={styles.name}>Whitestone</span>
        <span className={styles.descriptor}>Civil Engineering</span>
      </span>
    </Link>
  );
}
