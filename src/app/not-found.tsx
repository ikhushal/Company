import Link from "next/link";
import { Icon } from "@/components/Icon";
import s from "./not-found.module.css";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className={`dark ${s.wrap}`}>
      <div className={`container ${s.inner}`}>
        <p className={s.code} aria-hidden="true">404</p>
        <h1>This page is not on the drawings.</h1>
        <p className="lead">The page you were looking for may have moved or no longer exists.</p>
        <div className="btn-row">
          <Link href="/" className="btn btn--light">Home <Icon name="arrow-right" className="btn__arrow" /></Link>
          <Link href="/services/" className="btn btn--ghost-dark">Services</Link>
          <Link href="/contact/" className="btn btn--ghost-dark">Contact</Link>
        </div>
      </div>
    </section>
  );
}
