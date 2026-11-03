"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { services } from "@/content/services";
import { Icon } from "./Icon";
import styles from "./EnquiryForm.module.css";

type Variant = "contact" | "quote";
type FieldError = { id: string; message: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FILE_TYPES = ["pdf", "dwg", "dxf", "jpg", "jpeg", "png"];

const formatSize = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

export function EnquiryForm({
  variant,
  endpoint,
  preview,
  email,
  phone,
  maxUploadMb,
}: {
  variant: Variant;
  endpoint: string | null;
  preview: boolean;
  email: string;
  phone: string;
  maxUploadMb: number;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [status, setStatus] = useState<{ kind: "info" | "error"; text: string } | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const id = (name: string) => `${variant}-${name}`;

  // Pre-select a service when arriving from a service page (?service=slug).
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("service");
    const box = slug ? formRef.current?.querySelector<HTMLInputElement>(`input[name="service"][value="${CSS.escape(slug)}"]`) : null;
    if (box) box.checked = true;
  }, []);

  useEffect(() => {
    if (errors.length) summaryRef.current?.focus();
  }, [errors]);

  useEffect(() => {
    if (sent) successRef.current?.focus();
  }, [sent]);

  const errorFor = (name: string) => errors.find((e) => e.id === id(name));

  const validate = (form: HTMLFormElement): FieldError[] => {
    const data = new FormData(form);
    const text = (name: string) => String(data.get(name) ?? "").trim();
    const found: FieldError[] = [];
    const require = (name: string, message: string) => {
      if (!text(name)) found.push({ id: id(name), message });
    };

    require("name", "Enter your name");
    if (!text("email")) found.push({ id: id("email"), message: "Enter your email address" });
    else if (!EMAIL.test(text("email")))
      found.push({ id: id("email"), message: "Enter an email address in the correct format, like name@example.com" });

    if (variant === "contact") {
      require("message", "Enter your message");
    } else {
      require("phone", "Enter a telephone number so we can discuss the project");
      if (!data.getAll("service").length) found.push({ id: id("service"), message: "Select at least one service, or choose ‘Not sure yet’" });
      require("location", "Enter the project location");
      require("description", "Describe the project");
      if (files.some((f) => !FILE_TYPES.includes(f.name.split(".").pop()?.toLowerCase() ?? "")))
        found.push({ id: id("files"), message: "Attach PDF, DWG, DXF, JPG or PNG files only" });
      else if (files.reduce((sum, f) => sum + f.size, 0) > maxUploadMb * 1024 * 1024)
        found.push({ id: id("files"), message: `The files are larger than ${maxUploadMb} MB in total. Remove some, or send them once we reply` });
    }
    return found;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus(null);
    const found = validate(form);
    setErrors(found);
    if (found.length) return;

    if (preview || !endpoint) {
      setStatus({ kind: "info", text: "Preview only: this form is not connected yet, so nothing has been sent." });
      return;
    }

    setSending(true);
    try {
      const response = await fetch(endpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error(`Unexpected response: ${response.status}`);
      setSent(true);
    } catch {
      setStatus({ kind: "error", text: `Sorry, your message could not be sent. Please try again, or email us at ${email}.` });
    } finally {
      setSending(false);
    }
  };

  const described = (name: string, hint = false) =>
    [hint ? id(`${name}-hint`) : null, errorFor(name) ? id(`${name}-error`) : null].filter(Boolean).join(" ") || undefined;

  const errorText = (name: string) => {
    const error = errorFor(name);
    return error ? (
      <p className={styles.error} id={id(`${name}-error`)}>
        <span className="visually-hidden">Error: </span>
        {error.message}
      </p>
    ) : null;
  };

  const fieldClass = (name: string) => `${styles.field} ${errorFor(name) ? styles.invalid : ""}`;

  if (sent) {
    return (
      <div ref={successRef} tabIndex={-1} className={styles.success}>
        <span className={styles.successIcon}><Icon name="check" /></span>
        <h2>Thank you. Your message has been sent.</h2>
        <p>We will reply by email. If it is urgent, call or WhatsApp {phone}.</p>
      </div>
    );
  }

  return (
    <form ref={formRef} className={styles.form} method="post" action={endpoint ?? undefined} encType="multipart/form-data" noValidate onSubmit={onSubmit}>
      <input type="hidden" name="form" value={variant} />

      {errors.length > 0 && (
        <div ref={summaryRef} tabIndex={-1} role="alert" aria-labelledby={id("errors-title")} className={styles.summary}>
          <h2 id={id("errors-title")}>There is a problem</h2>
          <ul>
            {errors.map((e) => (
              <li key={e.id}>
                <a href={`#${e.id}`} onClick={(ev) => { ev.preventDefault(); document.getElementById(e.id)?.focus(); }}>
                  {e.message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.row}>
        <div className={fieldClass("name")}>
          <label htmlFor={id("name")}>Your name</label>
          {errorText("name")}
          <input id={id("name")} name="name" type="text" autoComplete="name" maxLength={200} aria-invalid={!!errorFor("name")} aria-describedby={described("name")} />
        </div>
        {variant === "quote" ? (
          <div className={styles.field}>
            <label htmlFor={id("company")}>Company name <span className={styles.optional}>(optional)</span></label>
            <input id={id("company")} name="company" type="text" autoComplete="organization" maxLength={200} />
          </div>
        ) : (
          <div className={styles.field}>
            <label htmlFor={id("phone")}>Telephone <span className={styles.optional}>(optional)</span></label>
            <input id={id("phone")} name="phone" type="tel" autoComplete="tel" maxLength={40} />
          </div>
        )}
      </div>

      <div className={variant === "quote" ? styles.row : undefined}>
        <div className={fieldClass("email")}>
          <label htmlFor={id("email")}>Email address</label>
          {errorText("email")}
          <input id={id("email")} name="email" type="email" autoComplete="email" spellCheck={false} maxLength={254} aria-invalid={!!errorFor("email")} aria-describedby={described("email")} />
        </div>
        {variant === "quote" && (
          <div className={fieldClass("phone")}>
            <label htmlFor={id("phone")}>Telephone</label>
            {errorText("phone")}
            <input id={id("phone")} name="phone" type="tel" autoComplete="tel" maxLength={40} aria-invalid={!!errorFor("phone")} aria-describedby={described("phone")} />
          </div>
        )}
      </div>

      {variant === "contact" ? (
        <div className={fieldClass("message")}>
          <label htmlFor={id("message")}>Message</label>
          {errorText("message")}
          <textarea id={id("message")} name="message" rows={6} maxLength={5000} aria-invalid={!!errorFor("message")} aria-describedby={described("message")} />
        </div>
      ) : (
        <>
          <fieldset className={fieldClass("service")} aria-describedby={described("service")}>
            <legend>Which services do you need? <span className={styles.optional}>Select all that apply</span></legend>
            {errorText("service")}
            <div className={styles.choices}>
              {services.map((s, i) => (
                <label key={s.slug} className={styles.choice}>
                  <input type="checkbox" name="service" value={s.slug} id={i === 0 ? id("service") : undefined} />
                  <span className={styles.choiceBox}>
                    <span className={styles.choiceIndex}>{s.index}</span>
                    <span className={styles.choiceName}>{s.name}</span>
                    <span className={styles.tick}><Icon name="check" /></span>
                  </span>
                </label>
              ))}
              <label className={styles.choice}>
                <input type="checkbox" name="service" value="not-sure" />
                <span className={styles.choiceBox}>
                  <span className={styles.choiceIndex}>??</span>
                  <span className={styles.choiceName}>Not sure yet</span>
                  <span className={styles.tick}><Icon name="check" /></span>
                </span>
              </label>
            </div>
          </fieldset>

          <div className={fieldClass("location")}>
            <label htmlFor={id("location")}>Project location</label>
            <p className={styles.hint} id={id("location-hint")}>Town, or the first part of the postcode, for example E14.</p>
            {errorText("location")}
            <input id={id("location")} name="location" type="text" maxLength={100} aria-invalid={!!errorFor("location")} aria-describedby={described("location", true)} />
          </div>

          <div className={fieldClass("description")}>
            <label htmlFor={id("description")}>Project description</label>
            <p className={styles.hint} id={id("description-hint")}>What you want to build, change, or have drawn or estimated.</p>
            {errorText("description")}
            <textarea id={id("description")} name="description" rows={6} maxLength={5000} aria-invalid={!!errorFor("description")} aria-describedby={described("description", true)} />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor={id("start")}>Expected start <span className={styles.optional}>(optional)</span></label>
              <select id={id("start")} name="start_date" defaultValue="">
                <option value="">Select</option>
                <option>As soon as possible</option>
                <option>Within 1 month</option>
                <option>In 1 to 3 months</option>
                <option>In 3 to 6 months</option>
                <option>More than 6 months away</option>
                <option>Not sure yet</option>
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor={id("budget")}>Approximate project budget <span className={styles.optional}>(optional)</span></label>
              <select id={id("budget")} name="budget" defaultValue="">
                <option value="">Select</option>
                <option>Under £25,000</option>
                <option>£25,000 to £100,000</option>
                <option>£100,000 to £500,000</option>
                <option>Over £500,000</option>
                <option>Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className={fieldClass("files")}>
            <span className={styles.label} id={id("files-label")}>Drawings, specifications or photos <span className={styles.optional}>(optional)</span></span>
            {errorText("files")}
            <div className={styles.drop}>
              <input
                id={id("files")}
                name="attachments"
                type="file"
                multiple
                accept=".pdf,.dwg,.dxf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                aria-labelledby={id("files-label")}
                aria-describedby={[id("files-hint"), errorFor("files") ? id("files-error") : null].filter(Boolean).join(" ")}
                aria-invalid={!!errorFor("files")}
                onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
              />
              <span className={styles.dropIcon}><Icon name="upload" /></span>
              <span className={styles.dropText}><strong>Choose files</strong> or drag them here</span>
              <span className={styles.dropHint} id={id("files-hint")}>PDF, DWG, DXF, JPG or PNG · up to {maxUploadMb} MB in total</span>
            </div>
            {files.length > 0 && (
              <ul className={styles.fileList} aria-live="polite">
                {files.map((f) => (
                  <li key={f.name + f.size}>
                    <Icon name="file" />
                    <span className={styles.fileName}>{f.name}</span>
                    <span className={styles.fileSize}>{formatSize(f.size)}</span>
                  </li>
                ))}
                <li className={styles.fileTotal}>
                  <span>{files.length} file{files.length === 1 ? "" : "s"}</span>
                  <span className={styles.fileSize}>{formatSize(files.reduce((s, f) => s + f.size, 0))} of {maxUploadMb} MB</span>
                </li>
              </ul>
            )}
          </div>
        </>
      )}

      <label className={styles.consent}>
        <input type="checkbox" name="marketing_consent" value="yes" />
        <span>Send me occasional news and updates from Whitestone Civil Engineering. <span className={styles.optional}>Optional. Unsubscribe at any time.</span></span>
      </label>

      <div className={styles.honeypot} aria-hidden="true">
        <label>Leave this field empty <input name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <div className={styles.submitRow}>
        <button type="submit" className="btn btn--primary" disabled={sending}>
          {sending ? "Sending…" : variant === "quote" ? "Send quote request" : "Send message"}
          {!sending && <Icon name="arrow-right" className="btn__arrow" />}
        </button>
        <p className={styles.privacy}>
          We use these details to respond to your enquiry. See our <Link href="/privacy/">privacy notice</Link>.
        </p>
      </div>

      {status && (
        <p role="alert" className={status.kind === "info" ? styles.statusInfo : styles.statusError}>
          {status.text}
        </p>
      )}
    </form>
  );
}
