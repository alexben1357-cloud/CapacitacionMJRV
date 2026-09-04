import { useCallback, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent, type RefObject } from "react";
import { Reveal } from "./bits";

/* =============== Podcast: El manual de supervivencia para el MJRV 2027 ===============
   Reproductor propio de la página: un solo audio, dos puntos de acceso sincronizados
   (la barra superior y la cabina). Todo el control es visualmente editorial. */

const AUDIO_SRC = "https://docs.google.com/uc?export=download&id=1ASF-95B1-YhSpNKKB6R4jBYNAFzfHIZ4";

const fmt = (s: number) => {
  if (!isFinite(s) || s <= 0) return "--:--";
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, "0")}`;
};

export interface Podcast {
  playing: boolean;
  loading: boolean;
  error: boolean;
  time: number;
  dur: number;
  press: () => void;
  seek: (frac: number) => void;
  goHero: () => void;
  heroRef: RefObject<HTMLElement>;
}

export function usePodcast(): Podcast {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);
  const heroRef = useRef<HTMLElement>(null);

  const attach = useCallback((el: HTMLAudioElement) => {
    const onReady = () => {
      if (isFinite(el.duration) && el.duration > 0) setDur(el.duration);
    };
    el.addEventListener("loadedmetadata", onReady);
    el.addEventListener("durationchange", onReady);
    el.addEventListener("canplay", onReady);
    el.addEventListener("playing", () => {
      setPlaying(true);
      setLoading(false);
      setError(false);
    });
    el.addEventListener("waiting", () => setLoading(true));
    el.addEventListener("pause", () => setPlaying(false));
    el.addEventListener("ended", () => {
      setPlaying(false);
      setTime(0);
    });
    el.addEventListener("timeupdate", () => setTime(el.currentTime));
    el.addEventListener("error", () => {
      setPlaying(false);
      setLoading(false);
      setError(true);
    });
  }, []);

  const build = useCallback((): HTMLAudioElement => {
    const old = audioRef.current;
    if (old) {
      old.pause();
      old.removeAttribute("src");
      try { old.load(); } catch { /* noop */ }
    }
    /* elemento nuevo en cada intento: sin escuchadores acumulados */
    const el = new Audio();
    el.preload = "auto";
    el.src = AUDIO_SRC;
    attach(el);
    audioRef.current = el;
    return el;
  }, [attach]);

  const press = useCallback(() => {
    let el = audioRef.current;
    if (!el || error) {
      el = build();
      setError(false);
      setLoading(true);
      el.play().catch(() => setLoading(false));
      return;
    }
    if (!el.getAttribute("src")) {
      el.src = AUDIO_SRC;
      setLoading(true);
      el.play().catch(() => setLoading(false));
      return;
    }
    if (el.paused) {
      setLoading(true);
      el.play().catch(() => setLoading(false));
    } else {
      el.pause();
    }
  }, [build, error]);

  const seek = useCallback((frac: number) => {
    const el = audioRef.current;
    if (el && isFinite(dur) && dur > 0) {
      el.currentTime = Math.min(Math.max(frac, 0), 1) * dur;
    }
  }, [dur]);

  const goHero = useCallback(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    heroRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  }, []);

  return { playing, loading, error, time, dur, press, seek, goHero, heroRef };
}

/* =============== barra superior (siempre visible) =============== */

export function TopPlayerBar({ p }: { p: Podcast }) {
  const pct = p.dur > 0 ? Math.min(100, (p.time / p.dur) * 100) : 0;

  return (
    <div className="sticky top-0 z-[70] bg-navy text-white border-b-[3px] border-ink shadow-[0_4px_0_rgba(20,33,61,0.25)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-12 flex items-center gap-3 sm:gap-5">
        <button
          onClick={p.press}
          aria-label={p.playing ? "Pausar el podcast" : "Reproducir el podcast"}
          className={`w-9 h-9 shrink-0 border-2 border-white/70 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-white ${
            p.playing ? "bg-yellow text-navy" : "bg-red text-white"
          } ${p.loading ? "blink-soft" : ""}`}
        >
          {p.playing ? (
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" aria-hidden="true">
              <path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" aria-hidden="true">
              <path d="M4 2.2v11.6L13.6 8z" fill="currentColor" />
            </svg>
          )}
        </button>

        <div className={`hidden sm:flex items-end gap-[3px] h-6 ${p.playing ? "" : "eq-paused"}`} aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="eq-bar w-[4px] bg-yellow" style={{ height: "100%", animationDuration: `${0.7 + i * 0.13}s` }} />
          ))}
        </div>

        <button onClick={p.goHero} className="min-w-0 flex-1 text-left group">
          <p className="truncate text-[12px] sm:text-[13px] font-extrabold uppercase tracking-[0.12em] leading-none group-hover:text-yellow transition-colors duration-300">
            Podcast: El manual de supervivencia para el MJRV 2027
          </p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 leading-none">
            {p.error
              ? "Sin conexión con el audio · reintenta"
              : p.loading
                ? "Conectando…"
                : p.playing
                  ? "Sonando — sigue leyendo la guía"
                  : "Listo para reproducir"}
          </p>
        </button>

        <span className="font-display text-sm sm:text-base tabular-nums text-yellow shrink-0">
          {fmt(p.time)} <span className="text-white/50">/ {fmt(p.dur)}</span>
        </span>
      </div>
      <div className="h-[4px] bg-white/15">
        <div className="h-full bg-red transition-[width] duration-300 ease-linear" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* =============== cabina protagonista =============== */

export function RadioHero({ p }: { p: Podcast }) {
  const wave = useMemo(
    () => Array.from({ length: 64 }, (_, i) => 18 + Math.round(52 * Math.abs(Math.sin(i * 0.55) * Math.cos(i * 0.21)))),
    []
  );
  const frac = p.dur > 0 ? p.time / p.dur : 0;

  const bigLabel = p.loading ? "CONECTANDO…" : p.error ? "REINTENTAR" : p.playing ? "PAUSAR" : "REPRODUCIR";

  const onWave = (e: ReactMouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    p.seek((e.clientX - r.left) / r.width);
  };

  return (
    <section
      ref={p.heroRef as RefObject<HTMLElement>}
      id="podcast"
      className="relative bg-navy text-white border-b-[3px] border-ink overflow-hidden"
    >
      <div className="absolute inset-0 dots-bg opacity-[0.25] pointer-events-none" />
      <div className="absolute -right-20 -top-24 w-72 h-72 rounded-full border-[3px] border-white/10 pointer-events-none" />
      <div className="absolute -right-8 -top-10 w-44 h-44 rounded-full border-[3px] border-white/10 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-12 sm:pt-16 pb-12">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* texto */}
          <div className="lg:col-span-7">
            <Reveal>
              <p className="kicker flex items-center gap-3 text-yellow">
                <span className="inline-block w-10 h-[3px] bg-yellow" />
                Audio de bolsillo · Escúchalo mientras lees
              </p>
            </Reveal>
            <Reveal delay={120}>
              <h1 className="mt-4 font-display uppercase leading-[0.94] text-4xl sm:text-6xl xl:text-[72px]">
                El manual de
                <br />
                supervivencia
                <br />
                <span className="text-yellow">para el MJRV 2027</span>
              </h1>
            </Reveal>
            <Reveal delay={220}>
              <p className="mt-5 text-white/80 font-medium text-lg sm:text-xl max-w-xl leading-snug">
                Las cuatro etapas de la jornada — instalación, votación, escrutinio y embalaje — contadas al oído,
                para repasar con las manos libres mientras tu mesa abre, cuenta y sella.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="border-2 border-white/40 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em]">
                  EP. 01 · Temporada electoral
                </span>
                <span className="border-2 border-white/40 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${p.playing ? "bg-red blink-soft" : "bg-white/40"}`} />
                  {p.playing ? "Al aire" : "En cabina"}
                </span>
              </div>
            </Reveal>
          </div>

          {/* tocadiscos + controles */}
          <div className="lg:col-span-5">
            <Reveal delay={150}>
              <div className="border-[3px] border-white/25 bg-white/[0.06] p-6 sm:p-8 relative">
                <span
                  className={`absolute -top-3.5 right-6 font-display text-sm tracking-[0.2em] px-3 py-1 border-2 border-white bg-red text-white ${
                    p.playing ? "blink-soft" : "opacity-70"
                  }`}
                >
                  ON AIR
                </span>

                <div className="flex items-center gap-6">
                  {/* vinilo */}
                  <div className="w-28 h-28 sm:w-32 sm:h-32 shrink-0 relative">
                    <svg viewBox="0 0 120 120" className={`w-full h-full ${p.playing ? "spin-vinyl" : ""}`} aria-hidden="true">
                      <circle cx="60" cy="60" r="57" fill="#0a1e47" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="2" />
                      <circle cx="60" cy="60" r="46" fill="none" stroke="#ffffff" strokeOpacity="0.16" strokeWidth="1.6" />
                      <circle cx="60" cy="60" r="36" fill="none" stroke="#ffffff" strokeOpacity="0.16" strokeWidth="1.6" />
                      <circle cx="60" cy="60" r="20" fill="#f5a800" stroke="#14213d" strokeWidth="2.4" />
                      <circle cx="60" cy="60" r="4" fill="#14213d" />
                      <path d="M60 12a48 48 0 0 1 34 14" fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="2.4" strokeLinecap="round" />
                    </svg>
                    {/* brazo */}
                    <svg
                      viewBox="0 0 80 120"
                      className={`absolute -right-7 -top-3 w-16 h-24 transition-transform duration-700 origin-top-right ${
                        p.playing ? "rotate-[16deg]" : "rotate-[0deg]"
                      }`}
                      aria-hidden="true"
                    >
                      <line x1="66" y1="8" x2="30" y2="78" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
                      <circle cx="66" cy="8" r="7" fill="#f5a800" stroke="#14213d" strokeWidth="2" />
                      <rect x="22" y="72" width="16" height="14" rx="2" fill="#f5a800" stroke="#14213d" strokeWidth="2" />
                    </svg>
                  </div>

                  {/* botón principal */}
                  <button
                    onClick={p.press}
                    aria-label={p.playing ? "Pausar el podcast" : "Reproducir el podcast"}
                    className={`relative w-32 h-32 sm:w-36 sm:h-36 mx-auto cursor-pointer select-none border-[3px] border-white flex flex-col items-center justify-center gap-1.5 transition-all duration-300 shadow-[7px_7px_0_rgba(0,0,0,0.4)] hover:shadow-[10px_10px_0_rgba(0,0,0,0.45)] hover:-translate-y-1 ${
                      p.playing ? "bg-yellow text-navy" : "bg-red text-white"
                    } ${p.loading ? "blink-soft" : ""}`}
                  >
                    {p.playing ? (
                      <svg viewBox="0 0 16 16" className="w-9 h-9" aria-hidden="true">
                        <path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" fill="currentColor" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 16 16" className="w-9 h-9" aria-hidden="true">
                        <path d="M4 2.2v11.6L13.6 8z" fill="currentColor" />
                      </svg>
                    )}
                    <span className="font-display text-lg tracking-[0.14em] leading-none">{bigLabel}</span>
                  </button>
                </div>

                {/* forma de onda clicable */}
                <div
                  onClick={onWave}
                  className={`mt-7 flex items-end gap-[3px] h-14 cursor-pointer ${p.playing ? "wf-live" : ""}`}
                  aria-label="Barra de progreso del audio"
                >
                  {wave.map((h, i) => {
                    const passed = p.dur > 0 && i / wave.length <= frac;
                    return (
                      <span
                        key={i}
                        className="wf-bar flex-1"
                        style={{
                          height: `${h}%`,
                          backgroundColor: passed ? "#d0311f" : p.playing ? "#f5a800" : "rgba(255,255,255,0.35)",
                          animationDelay: `${(i % 10) * 0.06}s`,
                          animationDuration: `${0.7 + (i % 5) * 0.09}s`,
                        }}
                      />
                    );
                  })}
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/65">
                    {p.error
                      ? "No se pudo conectar · inténtalo de nuevo"
                      : p.loading
                        ? "Conectando con el episodio…"
                        : p.playing
                          ? "Sonando — sigue leyendo la guía"
                          : "Pulsa play y sigue leyendo"}
                  </p>
                  <p className="font-display text-base sm:text-lg tabular-nums text-yellow shrink-0">
                    {fmt(p.time)} <span className="text-white/45">/ {fmt(p.dur)}</span>
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
