import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Step } from "../data/content";
import { Icon } from "./icons";

/* ---------- reveal on scroll ---------- */

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("is-in");
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ ["--rv-delay" as string]: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ---------- line-mask headline ---------- */

export function MaskLines({ lines, className = "" }: { lines: ReactNode[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("is-in");
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={className}>
      {lines.map((l, i) => (
        <span key={i} className="line-mask" style={{ ["--rv-delay" as string]: `${i * 120}ms` }}>
          <span>{l}</span>
        </span>
      ))}
    </div>
  );
}

/* ---------- ticker ---------- */

export function Ticker({ items, dark = true }: { items: string[]; dark?: boolean }) {
  const row = items.concat(items);
  return (
    <div className={`overflow-hidden border-y-[3px] border-ink ${dark ? "bg-navy text-white" : "bg-yellow text-ink"}`}>
      <div className="ticker-track flex whitespace-nowrap py-2.5 will-change-transform" style={{ width: "max-content" }}>
        {row.map((t, i) => (
          <span key={i} className="font-display text-lg sm:text-xl tracking-wide uppercase flex items-center">
            <span className="px-5">{t}</span>
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" aria-hidden="true">
              <path d="M8 0l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill={dark ? "#f5a800" : "#d0311f"} />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- progress + scroll spy ---------- */

export function ProgressBar() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      setP(total > 0 ? (h.scrollTop / total) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[70] h-[5px] bg-transparent">
      <div className="h-full bg-red transition-[width] duration-150 ease-out" style={{ width: `${p}%` }} />
    </div>
  );
}

export interface StageMeta {
  id: string;
  num: string;
  label: string;
  hex: string;
  soft: string;
}

export function StageNav({ stages, active }: { stages: StageMeta[]; active: string }) {
  return (
    <nav className="sticky top-0 z-[60] bg-white/95 backdrop-blur-sm border-b-[3px] border-ink">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-stretch overflow-x-auto">
        <span className="hidden md:flex items-center pr-5 mr-2 border-r-2 border-ink/15">
          <span className="kicker text-ink/70">La jornada</span>
        </span>
        {stages.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={`group flex items-center gap-2.5 px-3.5 sm:px-5 py-3 border-r-2 border-ink/10 transition-colors duration-300 shrink-0 ${
              active === s.id ? "text-white" : "text-ink hover:bg-paper-2"
            }`}
            style={active === s.id ? { backgroundColor: s.hex } : undefined}
          >
            <span
              className="font-display text-lg leading-none"
              style={{ color: active === s.id ? "#ffffff" : s.hex }}
            >
              {s.num}
            </span>
            <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.14em] whitespace-nowrap">
              {s.label}
            </span>
          </a>
        ))}
      </div>
    </nav>
  );
}

export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? "");
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-30% 0px -55% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(",")]);
  return active;
}

/* ---------- paso numerado ---------- */

export function StepRow({ step, hex, soft, i }: { step: Step; hex: string; soft: string; i: number }) {
  return (
    <Reveal delay={(i % 4) * 70}>
      <div
        className="step-row group grid grid-cols-[56px_1fr] sm:grid-cols-[92px_1fr_72px] gap-4 sm:gap-6 items-start border-t-[3px] border-ink py-6 sm:py-7 px-2 sm:px-4"
        style={{ ["--stage" as string]: hex }}
      >
        <div className="font-display text-[52px] sm:text-[72px] leading-[0.85] step-num select-none">
          {step.n}
        </div>
        <div>
          <p className="text-[17px] sm:text-[19px] leading-snug font-medium text-ink max-w-3xl">{step.text}</p>
          {step.note && (
            <p className="mt-3 inline-flex items-start gap-2.5 text-[15px] font-semibold leading-snug px-4 py-3 border-2 border-ink/80 bg-white shadow-[4px_4px_0_rgba(20,33,61,0.9)]"
              style={{ backgroundColor: soft }}>
              <svg viewBox="0 0 20 20" className="w-5 h-5 mt-0.5 shrink-0" aria-hidden="true">
                <path d="M10 1l2.4 5.6L18 8l-5.6 2.4L10 16l-2.4-5.6L2 8l5.6-1.4z" fill={hex} stroke="#14213d" strokeWidth="1.4" />
              </svg>
              {step.note}
            </p>
          )}
          {step.bullets && (
            <ul className="mt-4 space-y-3">
              {step.bullets.map((b, bi) => (
                <li key={bi} className="flex items-start gap-3 border-2 border-ink bg-white p-3.5 shadow-[4px_4px_0_rgba(20,33,61,0.85)]">
                  <span className="mt-1 w-3 h-3 shrink-0 rotate-45" style={{ backgroundColor: hex }} />
                  <span className="text-[15px] sm:text-base leading-snug">
                    <strong className="font-extrabold">{b.title}.</strong> <span className="font-medium">{b.desc}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="hidden sm:flex justify-end">
          <div className="step-icon p-2.5 border-2 border-ink bg-white shadow-[4px_4px_0_rgba(20,33,61,0.85)]" style={{ color: hex }}>
            <Icon name={step.icon} className="w-9 h-9" />
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ---------- recuadro editorial ---------- */

export function Callout({
  icon,
  title,
  text,
  hex,
  soft,
  tag = "OJO",
}: {
  icon?: string;
  title: string;
  text: string;
  hex: string;
  soft: string;
  tag?: string;
}) {
  return (
    <Reveal>
      <div className="relative border-[3px] border-ink bg-white p-5 sm:p-6 shadow-[6px_6px_0_rgba(20,33,61,0.9)]">
        <span
          className="absolute -top-3.5 left-5 font-display text-sm tracking-[0.18em] px-3 py-1 border-2 border-ink text-white stamp-tilt"
          style={{ backgroundColor: hex }}
        >
          {tag}
        </span>
        <div className="flex items-start gap-4">
          {icon && (
            <div className="shrink-0 w-12 h-12 border-2 border-ink flex items-center justify-center" style={{ backgroundColor: soft }}>
              <Icon name={icon as never} className="w-8 h-8" />
            </div>
          )}
          <div>
            <h4 className="font-display text-xl sm:text-2xl uppercase tracking-wide" style={{ color: hex }}>
              {title}
            </h4>
            <p className="mt-1.5 text-[15px] sm:text-base font-medium leading-snug text-ink">{text}</p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ---------- encabezado de sub-bloque ---------- */

export function SubHead({ label, title, hex }: { label: string; title: string; hex: string }) {
  return (
    <Reveal className="mt-14 mb-2">
      <div className="flex items-end gap-4 border-b-[3px] border-ink pb-3">
        <span className="font-display text-white px-3 py-1.5 text-sm sm:text-base tracking-[0.14em] uppercase -mb-[3px]" style={{ backgroundColor: hex }}>
          {label}
        </span>
        <h3 className="font-display text-2xl sm:text-4xl uppercase leading-none text-ink">{title}</h3>
      </div>
    </Reveal>
  );
}
