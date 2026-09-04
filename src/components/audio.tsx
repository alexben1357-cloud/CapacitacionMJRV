import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type RefObject,
} from "react";

/* =============== Podcast: El manual de supervivencia para el MJRV 2027 ===============
   UNA sola forma de escuchar. El botón de play intenta la reproducción directa del
   archivo de Drive (un clic). Si Drive la bloquea, ese mismo botón abre el reproductor
   integrado — nunca hay dos reproductores en pantalla al mismo tiempo. */

const FILE_ID = "1ASF-95B1-YhSpNKKB6R4jBYNAFzfHIZ4";
const EMBED_URL = `https://drive.google.com/file/d/${FILE_ID}/preview`;

/* Endpoints de descarga directa de Google Drive (el audio HTML5 los sigue vía redirect). */
const DIRECT_URLS = [
  `https://drive.google.com/uc?export=download&id=${FILE_ID}`,
  `https://drive.usercontent.google.com/download?id=${FILE_ID}&export=download&confirm=t`,
];

const DIRECT_TIMEOUT = 3000;

export type Mode = "idle" | "loading" | "custom" | "embed";

export interface Podcast {
  mode: Mode;
  active: boolean;
  time: number;
  dur: number;
  toggle: () => void;
  seek: (frac: number) => void;
  goPlay: () => void;
  playerRef: RefObject<HTMLElement>;
}

const fmt = (s: number) => {
  if (!isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, "0")}`;
};

export function usePodcast(): Podcast {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const tryIdx = useRef(0);
  const timer = useRef<number | null>(null);
  const modeRef = useRef<Mode>("idle");
  const playerRef = useRef<HTMLElement>(null);
  const [mode, setModeState] = useState<Mode>("idle");
  const [active, setActive] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);

  const setMode = (m: Mode) => {
    modeRef.current = m;
    setModeState(m);
  };
  const clearTimer = () => {
    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  };
  const killAudio = () => {
    const a = audioRef.current;
    if (a) {
      try {
        a.pause();
      } catch {
        /* noop */
      }
      a.removeAttribute("src");
      try {
        a.load();
      } catch {
        /* noop */
      }
      audioRef.current = null;
    }
  };

  const goEmbed = useCallback(() => {
    clearTimer();
    killAudio();
    setMode("embed");
    setActive(true);
  }, []);

  const onDirectError = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    tryIdx.current += 1;
    if (tryIdx.current < DIRECT_URLS.length) {
      a.src = DIRECT_URLS[tryIdx.current];
      a.load();
      a.play().catch(() => {});
    } else {
      goEmbed();
    }
  }, [goEmbed]);

  const beginDirect = useCallback(() => {
    setMode("loading");
    setActive(false);
    setTime(0);
    setDur(0);
    const a = new Audio();
    a.preload = "auto";
    tryIdx.current = 0;
    a.src = DIRECT_URLS[0];
    audioRef.current = a;
    a.addEventListener("playing", () => {
      clearTimer();
      setMode("custom");
      setActive(true);
    });
    a.addEventListener("play", () => {
      if (modeRef.current === "custom") setActive(true);
    });
    a.addEventListener("pause", () => {
      if (modeRef.current === "custom") setActive(false);
    });
    a.addEventListener("error", onDirectError);
    a.addEventListener("timeupdate", () => setTime(a.currentTime));
    const onMeta = () => {
      if (isFinite(a.duration) && a.duration > 0) setDur(a.duration);
    };
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("durationchange", onMeta);
    a.addEventListener("ended", () => {
      setActive(false);
      setTime(0);
    });
    a.play().catch(() => {});
    timer.current = window.setTimeout(() => {
      if (modeRef.current === "loading") goEmbed();
    }, DIRECT_TIMEOUT);
  }, [goEmbed, onDirectError]);

  const toggle = useCallback(() => {
    const m = modeRef.current;
    if (m === "idle") {
      beginDirect();
      return;
    }
    if (m === "loading") return;
    if (m === "custom") {
      const a = audioRef.current;
      if (!a) return;
      if (a.paused) a.play().catch(() => {});
      else a.pause();
      return;
    }
    if (m === "embed") {
      setActive((v) => !v);
      return;
    }
  }, [beginDirect]);

  const seek = useCallback((frac: number) => {
    if (modeRef.current !== "custom") return;
    const a = audioRef.current;
    if (!a || !isFinite(a.duration)) return;
    a.currentTime = frac * a.duration;
    setTime(a.currentTime);
  }, []);

  const goPlay = useCallback(() => {
    const m = modeRef.current;
    if (m === "idle" || m === "embed") {
      playerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    toggle();
  }, [toggle]);

  useEffect(
    () => () => {
      clearTimer();
      killAudio();
    },
    []
  );

  return { mode, active, time, dur, toggle, seek, goPlay, playerRef };
}

/* ---------- iconos ---------- */

const PlayIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M8 5.5v13l11-6.5z" />
  </svg>
);
const PauseIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M7 5h3.6v14H7zM13.4 5H17v14h-3.6z" />
  </svg>
);
const StopIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M7 7h10v10H7z" />
  </svg>
);

/* ---------- vinilo ---------- */

function Vinyl({ spinning }: { spinning: boolean }) {
  return (
    <svg viewBox="0 0 200 200" className="w-40 h-40 sm:w-52 sm:h-52" aria-hidden="true">
      <circle cx="100" cy="100" r="96" fill="#14213d" />
      <circle cx="100" cy="100" r="96" fill="none" stroke="#0a1226" strokeWidth="3" />
      {[80, 68, 56, 44].map((r) => (
        <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="#22345c" strokeWidth="1.6" />
      ))}
      <g className={spinning ? "spin-vinyl" : ""}>
        <circle cx="100" cy="100" r="34" fill="#d0311f" />
        <circle cx="100" cy="100" r="34" fill="none" stroke="#14213d" strokeWidth="3" />
        <path d="M100 66a34 34 0 0 1 34 34" fill="none" stroke="#f5a800" strokeWidth="4" strokeLinecap="round" />
        <text x="100" y="96" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="13" fill="#fff">
          MJRV
        </text>
        <text x="100" y="112" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="13" fill="#fff">
          2027
        </text>
        <circle cx="100" cy="100" r="5" fill="#14213d" />
      </g>
    </svg>
  );
}

/* ---------- forma de onda ---------- */

function Waveform({
  bars,
  frac,
  live,
  onSeek,
}: {
  bars: number[];
  frac: number;
  live: boolean;
  onSeek: (f: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const click = (e: ReactMouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    onSeek(Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)));
  };
  return (
    <div
      ref={ref}
      onClick={click}
      role="slider"
      aria-label="Posición del audio"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(frac * 100)}
      className={`flex items-end gap-[3px] h-16 cursor-pointer select-none ${live ? "wf-live" : ""}`}
    >
      {bars.map((h, i) => {
        const played = i / bars.length <= frac;
        return (
          <span
            key={i}
            className={`wf-bar flex-1 min-w-[3px] rounded-sm transition-colors duration-200 ${
              played ? "bg-red" : "bg-blue-mid/60"
            }`}
            style={{ height: `${h * 100}%`, animationDelay: `${(i % 8) * 0.07}s` }}
          />
        );
      })}
    </div>
  );
}

/* ---------- reproductor principal (cabina) ---------- */

export function RadioHero({ p }: { p: Podcast }) {
  const { mode, active, time, dur, toggle, seek, playerRef } = p;

  const bars = useMemo(
    () =>
      Array.from({ length: 56 }, (_, i) => {
        const v = Math.abs(Math.sin(i * 0.9) * 0.68 + Math.sin(i * 0.23 + 1.4) * 0.32);
        return 0.22 + v * 0.78;
      }),
    []
  );

  const frac = dur > 0 ? Math.min(1, time / dur) : 0;
  const embedOn = mode === "embed" && active;

  const btnIcon =
    mode === "loading" ? (
      <span className="block w-7 h-7 border-[3px] border-white/40 border-t-white rounded-full animate-spin" />
    ) : active ? (
      mode === "embed" ? (
        <StopIcon className="w-8 h-8" />
      ) : (
        <PauseIcon className="w-8 h-8" />
      )
    ) : (
      <PlayIcon className="w-8 h-8 translate-x-[2px]" />
    );

  const btnLabel =
    mode === "loading"
      ? "Conectando…"
      : mode === "embed"
        ? active
          ? "Detener"
          : "Abrir reproductor"
        : active
          ? "Pausar"
          : mode === "custom"
            ? "Reanudar"
            : "Reproducir";

  const hint =
    mode === "idle"
      ? "Pulsa reproducir y escúchalo mientras recorres la guía."
      : mode === "loading"
        ? "Buscando el audio…"
        : mode === "custom"
          ? active
            ? "Sonando — sigue leyendo, aquí no se detiene."
            : "En pausa. Pulsa para continuar."
          : embedOn
            ? "Se abrió el reproductor integrado: pulsa play dentro de él. «Detener» lo cierra."
            : "Pulsa para abrir el reproductor integrado.";

  return (
    <section
      ref={playerRef}
      className="relative border-b-[3px] border-ink bg-navy text-white overflow-hidden"
    >
      <div className="absolute inset-0 dots-bg opacity-[0.12] pointer-events-none" />
      <span
        aria-hidden="true"
        className="font-display absolute -right-8 -top-10 text-[200px] sm:text-[280px] leading-none text-white opacity-[0.05] select-none"
      >
        POD
      </span>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 grid lg:grid-cols-[auto_1fr] gap-10 items-center">
        {/* vinilo + ON AIR */}
        <div className="relative justify-self-center lg:justify-self-start">
          <Vinyl spinning={active && mode !== "embed"} />
          <span
            className={`absolute -top-2 -right-4 font-display text-sm tracking-[0.18em] px-3 py-1 border-2 border-ink text-ink bg-yellow shadow-[4px_4px_0_rgba(0,0,0,0.35)] ${
              active ? "blink-soft" : "opacity-60"
            }`}
          >
            {active ? "ON AIR" : "STANDBY"}
          </span>
        </div>

        <div>
          <p className="kicker text-yellow flex items-center gap-3">
            <span className="inline-block w-10 h-[3px] bg-yellow" />
            El podcast de la jornada
          </p>
          <h2 className="mt-3 font-display uppercase leading-[0.95] text-[38px] sm:text-[54px] xl:text-[64px]">
            El manual de <span className="text-yellow">supervivencia</span>
            <br />
            para el MJRV <span className="text-red">2027</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg font-medium text-white/80 max-w-2xl">
            Todo lo que necesitas saber de la instalación, el sufragio y el escrutinio — contado para que lo escuches
            mientras repasas esta guía.
          </p>

          {/* tarjeta del reproductor */}
          <div className="mt-7 border-[3px] border-ink bg-white text-ink shadow-[8px_8px_0_rgba(245,168,0,0.9)] p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5">
              <button
                onClick={toggle}
                aria-label={btnLabel}
                className={`shrink-0 w-20 h-20 rounded-full border-[3px] border-ink flex items-center justify-center text-white shadow-[5px_5px_0_rgba(20,33,61,0.9)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[7px_7px_0_rgba(20,33,61,0.9)] self-center sm:self-auto ${
                  active && mode !== "embed"
                    ? "bg-blue hover:bg-blue-mid"
                    : embedOn
                      ? "bg-red hover:bg-red-deep"
                      : "bg-red hover:bg-red-deep"
                }`}
              >
                {btnIcon}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-display text-lg sm:text-xl uppercase tracking-wide text-navy truncate">
                    Podcast: El manual de supervivencia para el MJRV 2027
                  </p>
                  {mode === "custom" && (
                    <p className="font-display text-sm text-ink-soft tabular-nums shrink-0">
                      {fmt(time)} <span className="text-ink/40">/ {fmt(dur)}</span>
                    </p>
                  )}
                </div>

                {embedOn ? (
                  <div className="mt-3 border-[3px] border-ink overflow-hidden bg-paper-2">
                    <iframe
                      src={EMBED_URL}
                      title="Reproductor de audio — Podcast MJRV 2027"
                      className="w-full h-[110px] block"
                      frameBorder="0"
                      allow="autoplay"
                    />
                  </div>
                ) : (
                  <div className="mt-3">
                    <Waveform bars={bars} frac={frac} live={mode === "custom" && active} onSeek={seek} />
                  </div>
                )}

                <p className="mt-2.5 text-[13px] font-semibold text-ink-soft">{hint}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- barra superior (misma única fuente) ---------- */

export function TopPlayerBar({ p }: { p: Podcast }) {
  const { mode, active, time, dur, goPlay } = p;
  const label =
    mode === "loading"
      ? "Conectando…"
      : active
        ? mode === "embed"
          ? "Sonando · Detener"
          : "Sonando · Pausar"
        : "Escuchar el podcast";
  return (
    <div className="sticky top-0 z-[70] bg-ink text-white border-b-[3px] border-ink">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between gap-4 py-2">
        <button
          onClick={goPlay}
          className="flex items-center gap-3 group min-w-0"
          aria-label="Escuchar el podcast"
        >
          <span
            className={`w-9 h-9 shrink-0 rounded-full border-2 border-white/80 flex items-center justify-center transition-colors duration-300 ${
              active ? "bg-red" : "bg-yellow text-ink group-hover:bg-white"
            }`}
          >
            {active ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4 translate-x-[1px]" />}
          </span>
          <span className="min-w-0">
            <span className="kicker block text-yellow">Podcast MJRV 2027</span>
            <span className="block text-[13px] font-bold text-white/90 truncate">{label}</span>
          </span>
        </button>

        {mode === "custom" && (
          <span className="font-display text-sm text-white/80 tabular-nums shrink-0">
            {fmt(time)} / {fmt(dur)}
          </span>
        )}
        {active && (
          <span className="hidden sm:flex items-end gap-[3px] h-5" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="eq-bar w-[4px] h-full bg-yellow" style={{ animationDelay: `${i * 0.12}s` }} />
            ))}
          </span>
        )}
      </div>
      {/* progreso de lectura */}
      <ReadingProgress />
    </div>
  );
}

function ReadingProgress() {
  const [w, setW] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      setW(total > 0 ? (h.scrollTop / total) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div className="h-[4px] bg-red" style={{ width: `${w}%` }} />;
}
