"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Moves its content a few pixels against the pointer, for depth. Off with reduced motion or touch. */
export function Parallax({ children, strength = 14, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce), (hover: none)").matches) return;

    let frame = 0;
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const x = event.clientX / window.innerWidth - 0.5;
        const y = event.clientY / window.innerHeight - 0.5;
        el.style.transform = `translate3d(${(-x * strength).toFixed(1)}px, ${(-y * strength).toFixed(1)}px, 0)`;
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, [strength]);

  return (
    <div ref={ref} className={className} style={{ transition: "transform 600ms cubic-bezier(0.16, 1, 0.3, 1)", willChange: "transform" }}>
      {children}
    </div>
  );
}
