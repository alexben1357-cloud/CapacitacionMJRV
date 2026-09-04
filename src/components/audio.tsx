import {
  useCallback, useEffect, useMemo, useRef, useState,
  type MouseEvent as ReactMouseEvent, type ReactNode, type RefObject,
} from "react";
import { Reveal } from "./bits";

/* =============== Podcast: El manual de supervivencia para el MJRV 2027 ===============
   Reproducción interna desde Google Drive:
   1) Se intenta el stream directo del archivo (audio oculto, sin reproductor visible).
   2) Si Drive protege el archivo, se arma un reproductor de Drive INVISIBLE
      (opacidad 0) calzado sobre el botón: cada pulsación del botón reproduce o
      detiene el audio internamente, sin mostrar jamás la interfaz de Drive.   */

const FILE_ID = "1ASF-95B1-YhSpNKKB6R4jBYNAFzfHIZ4";
const PREVIEW_URL = `https://drive.google.com/file/d/${FILE_ID}/preview`;

const SOURCES = [
  `https://drive.usercontent.google.com/download?id=${FILE_ID}&export=download&confirm=t`,
  `https://drive.google.com/uc?export=download&id=${FILE_ID}&confirm=t`,
  `https://docs.google.com/uc?export=download&id=${FILE_ID}&confirm=t`,
];

/* tiempo máximo esperando el stream directo antes de armar el motor interno */
const DIRECT_BUDGET = 8000;

const fmt = (s: number) => {
  if (!isFinite(s) || s <= 0) return "--:--";
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, "0")}`;
};

export type Engine = "pending" | "direct" | "phantom";

export interface Podcast {
  engine: Engine;
  playing: boolean;
  loading: boolean;
  time: number;
  dur: number;
  press: () => void;
  goHero: () => void;
  seek: (frac: number) => void;
  heroRef: RefObject<HTMLElement>;
  phantomRef: RefObject<HTMLIFrameElement>;
}

export function usePodcast(): Podcast {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const srcIdx = useRef(0);
  const watchdog = useRef<number | null>(null);
  const engineRef = useRef<Engine>("pending");
  const [engine, setEngineState] = useState<Engine>("pending");
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const phantomRef = useRef<HTMLIFrameElement>(null);
  const lastToggle = useRef(0);

  const setEngine = useCallback((e: Engine) => {
    engineRef.current = e;
    setEngineState(e);
  }, []);

  const clearWatchdog = useCallback(() => {
    if (watchdog.current !== null) {
      window.clearTimeout(watchdog.current);
      watchdog.current = null;
    }
  }, []);

  /* paso al motor interno invisible (Drive protege el stream directo) */
  const toPhantom = useCallback(() => {
    if (engineRef.current === "phantom") return;
    clearWatchdog();
    const a = audioRef.current;
    if (a) {
      a.pause();
      a.removeAttribute("src");
      try { a.load(); } catch { /* noop */ }
    }
    setLoading(false);
    setPlaying(false);
    setEngine("phantom");
  }, [clearWatchdog, setEngine]);

  const ensureAudio = useCallback((): HTMLAudioElement => {
    let a = audioRef.current;
    if (a) return a;
    a = new Audio();
    a.preload = "auto";
    const el = a;
    el.addEventListener("timeupdate", () => setTime(el.currentTime));
    const onReady = () => {
      /* el archivo responde como audio: el stream directo es viable */
      if (isFinite(el.duration) && el.duration > 0) setDur(el.duration);
      if (engineRef.current === "pending") {
        clearWatchdog();
        setEngine("direct");
        setLoading(false);
      }
    };
    el.addEventListener("loadedmetadata", onReady);
    el.addEventListener("canplay", onReady);
    el.addEventListener("durationchange", onReady);
    el.addEventListener("playing", () => {
      clearWatchdog();
      setEngine("direct");
      setLoading(false);
      setPlaying(true);
    });
    el.addEventListener("pause", () => setPlaying(false));
    el.addEventListener("ended", () => {
      setPlaying(false);
      setTime(0);
    });
    el.addEventListener("error", () => {
      /* 1 = MEDIA_ERR_ABORTED: cambio de fuente intencional */
      if (el.error && el.error.code === 1) return;
      srcIdx.current += 1;
      if (srcIdx.current < SOURCES.length && engineRef.current !== "phantom") {
        el.src = SOURCES[srcIdx.current];
        el.load();
      } else {
        toPhantom();
      }
    });
    audioRef.current = a;
    return a;
  }, [clearWatchdog, setEngine, toPhantom]);

  /* Pre-sondeo al cargar: averiguamos en segundo plano si Drive sirve el
     archivo como stream directo. Así, cuando la persona pulsa REPRODUCIR,
     un solo clic basta: o suena el stream directo, o el botón ya está calzado
     sobre el reproductor interno invisible de Drive. */
  useEffect(() => {
    const a = ensureAudio();
    srcIdx.current = 0;
    a.src = SOURCES[0];
    setLoading(true);
    clearWatchdog();
    watchdog.current = window.setTimeout(toPhantom, DIRECT_BUDGET);
    a.load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const press = useCallback(() => {
    /* solo opera en stream directo; en modo interno el clic lo recibe Drive */
    if (engineRef.current !== "direct") return;
    const a = ensureAudio();
    if (a.paused) {
      a.play().catch(() => { /* noop */ });
    } else {
      a.pause();
    }
  }, [ensureAudio]);

  /* En modo interno el clic entra al iframe de Drive (origen cruzado) y su
     evento NO burbujea al padre. La señal confiable de que el usuario pulsó el
     reproductor invisible es que la ventana pierde el foco y el iframe pasa a
     ser el activeElement. Lo detectamos para sincronizar vinilo/etiqueta y
     devolvemos el foco a la página para que la siguiente pulsación vuelva a
     ser detectable. */
  useEffect(() => {
    if (engine !== "phantom") return;
    const onBlur = () => {
      const now = Date.now();
      if (now - lastToggle.current < 450) return; /* anti doble conteo */
      if (document.activeElement !== phantomRef.current) return;
      lastToggle.current = now;
      setPlaying((p) => !p);
      window.setTimeout(() => {
        phantomRef.current?.blur();
        window.focus();
      }, 120);
    };
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, [engine]);

  const goHero = useCallback(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    heroRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  }, []);

  const seek = useCallback((frac: number) => {
    if (engineRef.current !== "direct") return;
    const a = audioRef.current;
    if (a && isFinite(dur) && dur > 0) {
      a.currentTime = Math.min(Math.max(frac, 0), 1) * dur;
    }
  }, [dur]);

  useEffect(() => () => {
    clearWatchdog();
    audioRef.current?.pause();
  }, [clearWatchdog]);

  return { engine, playing, loading, time, dur, press, goHero, seek, heroRef, phantomRef };
}

/* =============== barra superior (siempre visible) =============== */

export function TopPlayerBar({ p }: { p: Podcast }) {
  const pct = p.dur > 0 ? Math.min(100, (p.time / p.dur) * 100) : 0;
  const internal = p.engine === "phantom";

  const label = internal
    ? "IR AL REPRODUCTOR"
    : p.loading
      ? "CONECTANDO…"
      : p.playing
        ? "PAUSAR"
        : "REPRODUCIR";

  return (
    <div className="sticky top-0 z-[70] bg-navy text-white border-b-[3px] border-ink shadow-[0_4px_0_rgba(20,33,61,0.25)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-12 flex items-center gap-3 sm:gap-5">
        <button
          onClick={internal ? p.goHero : p.press}
          aria-label={internal ? "Ir al reproductor de la cabina" : p.playing ? "Pausar podcast" : "Reproducir podcast"}
          className={`w-9 h-9 shrink-0 border-2 border-white/70 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-white ${
            p.playing ? "bg-yellow text-navy" : "bg-red text-white"
          }`}
        >
          {internal ? (
            <svg viewBox="0 0 16 16" className="w-4 h-4" aria-hidden="true">
              <path d="M8 2v9M4 7.5 8 12l4-4.5M3 14h10" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : p.playing ? (
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
            <span key={i} className="eq-bar w-[4px] bg-yellow" style={{ height: `${100}%`, animationDuration: `${0.7 + i * 0.13}s` }} />
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] sm:text-[13px] font-extrabold uppercase tracking-[0.12em] leading-none">
            Podcast: El manual de supervivencia para el MJRV 2027
          </p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 leading-none">
            {internal
              ? "Audio interno · toca play en la cabina"
              : p.loading
                ? "Conectando con Drive…"
                : p.playing
                  ? "Sonando — sigue leyendo la guía"
                  : "Listo para reproducir"}
          </p>
        </div>

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
  const internal = p.engine === "phantom";

  const bigLabel = p.loading ? "CONECTANDO…" : p.playing ? "PAUSAR" : "REPRODUCIR";

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
            <RevealInline>
              <p className="kicker flex items-center gap-3 text-yellow">
                <span className="inline-block w-10 h-[3px] bg-yellow" />
                Audio de bolsillo · Escúchalo mientras lees
              </p>
            </RevealInline>
            <h1 className="mt-4 font-display uppercase leading-[0.94] text-4xl sm:text-6xl xl:text-[72px]">
              El manual de
              <br />
              supervivencia
              <br />
              <span className="text-yellow">para el MJRV 2027</span>
            </h1>
            <p className="mt-5 text-white/80 font-medium text-lg sm:text-xl max-w-xl leading-snug">
              Las cuatro etapas de la jornada — instalación, votación, escrutinio y embalaje — contadas al oído,
              para repasar con las manos libres mientras tu mesa abre, cuenta y sella.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="border-2 border-white/40 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em]">
                EP. 01 · Temporada electoral
              </span>
              <span className="border-2 border-white/40 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${p.playing ? "bg-red blink-soft" : "bg-white/40"}`} />
                {p.playing ? "Al aire" : "En cabina"}
              </span>
            </div>
          </div>

          {/* tocadiscos + botón */}
          <div className="lg:col-span-5">
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
                <div
                  onClick={p.press}
                  className="relative w-32 h-32 sm:w-36 sm:h-36 mx-auto cursor-pointer select-none"
                  role="button"
                  aria-label={p.playing ? "Detener el podcast" : "Reproducir el podcast"}
                >
                  <span
                    className={`absolute inset-0 border-[3px] border-white bg-red text-white flex flex-col items-center justify-center gap-1.5 transition-all duration-300 shadow-[7px_7px_0_rgba(0,0,0,0.4)] hover:shadow-[10px_10px_0_rgba(0,0,0,0.45)] hover:-translate-y-1 ${
                      p.playing ? "bg-yellow text-navy" : ""
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
                  </span>

                  {/* reproductor interno de Drive: invisible, calzado sobre el botón */}
                  <div
                    className={`absolute -inset-2 z-20 ${internal ? "pointer-events-auto" : "pointer-events-none"}`}
                    aria-hidden="true"
                  >
                    <iframe
                      ref={p.phantomRef}
                      src={PREVIEW_URL}
                      title="Reproductor interno de audio"
                      className="w-full h-full opacity-0 border-0"
                      allow="autoplay"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              {/* forma de onda */}
              <Waveform wave={wave} frac={frac} playing={p.playing} engine={p.engine} seek={p.seek} />

              <div className="mt-4 flex items-center justify-between text-[12px] font-extrabold uppercase tracking-[0.18em] text-white/60">
                <span className="tabular-nums text-white/90">{fmt(p.time)}</span>
                <span>
                  {internal
                    ? "El botón reproduce el audio internamente desde Drive"
                    : p.loading
                      ? "Conectando con Google Drive…"
                      : p.playing
                        ? "Sonando — desliza para seguir leyendo"
                        : "Pulsa reproducir y sigue leyendo la guía"}
                </span>
                <span className="tabular-nums text-white/90">{fmt(p.dur)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* forma de onda: viva mientras suena; permite saltar de minuto en reproducción directa */
function Waveform({
  wave, frac, playing, engine, seek,
}: {
  wave: number[];
  frac: number;
  playing: boolean;
  engine: Engine;
  seek: (frac: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const clickable = engine === "direct";

  const click = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!clickable || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    seek((e.clientX - r.left) / r.width);
  };

  return (
    <div
      ref={ref}
      onClick={click}
      className={`mt-6 flex items-end gap-[3px] h-20 ${playing ? "wf-live" : ""} ${
        clickable ? "cursor-pointer" : ""
      }`}
      aria-hidden="true"
    >
      {wave.map((h, i) => {
        const passed = frac > 0 && i / wave.length <= frac;
        return (
          <span
            key={i}
            className="wf-bar flex-1 rounded-[1px] transition-colors duration-300"
            style={{
              height: `${h}%`,
              backgroundColor: passed ? "#d0311f" : playing ? "#f5a800" : "rgba(255,255,255,0.35)",
              animationDelay: `${(i % 10) * 0.06}s`,
              animationDuration: `${0.7 + (i % 5) * 0.09}s`,
            }}
          />
        );
      })}
    </div>
  );
}

/* revelado del kicker de la cabina */
function RevealInline({ children }: { children: ReactNode }) {
  return <Reveal>{children}</Reveal>;
}
