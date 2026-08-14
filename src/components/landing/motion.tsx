import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

export function Icon({ name, className = "", filled = false }: { name: string; className?: string; filled?: boolean }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
    >
      {name}
    </span>
  );
}

export function withEnterDelay(delay: number): CSSProperties {
  return { "--enter-delay": `${delay}s` } as CSSProperties;
}

export function withProgress(pct: number, delay: number): CSSProperties {
  return { "--progress": `${pct}%`, "--progress-delay": `${delay}s` } as CSSProperties;
}

type MotionTag = "div" | "a" | "article" | "span" | "h1" | "p" | "li" | "section" | "nav" | "footer" | "header" | "form";

type MotionRevealProps = {
  className?: string;
  delay?: number;
  as?: MotionTag;
  children: ReactNode;
  href?: string;
  id?: string;
  style?: CSSProperties;
};

export function MotionReveal({ children, className = "", delay = 0, as, href, id, style }: MotionRevealProps) {
  const Tag = as ?? "div";
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || isVisible) return;
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setIsVisible(true); return; }
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry?.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [isVisible]);

  const mergedStyle = { ...withEnterDelay(delay), ...style };

  if (Tag === "a") {
    return (
      <a ref={(n) => { ref.current = n; }} className={isVisible ? className : `motion-enter ${className}`.trim()} style={mergedStyle} href={href} id={id}>
        {children}
      </a>
    );
  }
  return (
    <Tag ref={(n: HTMLElement | null) => { ref.current = n; }} className={isVisible ? className : `motion-enter ${className}`.trim()} style={mergedStyle} id={id}>
      {children}
    </Tag>
  );
}

export function ProgressBar({ pct, delay }: { pct: number; delay: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || isVisible) return;
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setIsVisible(true); return; }
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry?.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [isVisible]);

  return (
    <div ref={ref} className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
      <div
        className={isVisible ? "motion-progress h-full bg-secondary" : "h-full bg-secondary"}
        style={isVisible ? withProgress(pct, delay) : ({ width: "0%" } as CSSProperties)}
      />
    </div>
  );
}
