"use client";

import { useState, type FormEvent } from "react";
import styles from "./NewsletterForm.module.css";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterForm({ endpoint }: { endpoint: string }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "invalid" | "failed">("idle");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!EMAIL.test(String(data.get("email") ?? "").trim())) return setState("invalid");
    setState("sending");
    try {
      const response = await fetch(endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } });
      setState(response.ok ? "done" : "failed");
    } catch {
      setState("failed");
    }
  };

  if (state === "done") return <p role="status" className={styles.done}>Thank you for subscribing.</p>;

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate method="post" action={endpoint}>
      <label htmlFor="newsletter-email" className={styles.label}>Occasional news and updates</label>
      <div className={styles.row}>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={state === "invalid"}
          aria-describedby={state === "invalid" || state === "failed" ? "newsletter-msg" : undefined}
        />
        <button type="submit" className="btn btn--light btn--sm" disabled={state === "sending"}>
          {state === "sending" ? "…" : "Subscribe"}
        </button>
      </div>
      {(state === "invalid" || state === "failed") && (
        <p id="newsletter-msg" role="alert" className={styles.msg}>
          {state === "invalid" ? "Enter an email address in the correct format, like name@example.com" : "Sorry, that did not work. Please try again."}
        </p>
      )}
    </form>
  );
}
