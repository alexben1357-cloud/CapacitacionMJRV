import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from "react";

/* =============== Podcast: El manual de supervivencia para el MJRV 2027 ===============
   Google Drive no expone /view como stream: se intenta la descarga directa por tres
   endpoints públicos con confirmación, con detección por error y por tiempo de espera.
   Si Drive bloquea el stream, la cabina cambia AUTOMÁTICAMENTE al reproductor oficial
   embebido de Drive (funciona siempre) sin que el usuario deba buscar nada. */

const FILE_ID = "1ASF-95B1-YhSpNKKB6R4jBYNAFzfHIZ4";

const SOURCES = [
  `https://drive.usercontent.google.com/download?id=${FILE_ID}&export=download&confirm=t`,
  `https://drive.google.com/uc?export=download&id=${FILE_ID}&confirm=t`,
  `https://docs.google.com/uc?export=download&id=${FILE_ID}&confirm=t`,
];

export const DRIVE_EMBED = `https://drive.google.com/file/d/${FILE_ID}/preview`;

export const PODCAST_TITLE = "Podcast: El manual de supervivencia para el MJRV 2027";

export type PodcastMode = "custom" | "drive";
export type PodcastStatus = "idle" | "loading" | "playing" | "paused";

export interface Podcast {
  mode: PodcastMode;
  status: PodcastStatus;
  time: number;
  dur: number;
  progress: number;
  toggle: () => void;
  seek: (t: number) => void;
  useDrivePlayer: () => void;
  retryCustom: () => void;
}

const fmt = (s: number) => {
  if (!isFinite(s) || s < 0) return "--:--";
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, "0")}`;
};

export function usePodcast(): Podcast {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const srcIdx = useRef(0);
  const loadTimer = useRef<number | null>(null);
  const [mode, setMode] = useState<PodcastMode>("custom");
  const [status, setStatus] = useState<PodcastStatus>("idle");
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);

  const clearTimer = useCallback(() => {
    if (loadTimer.current !== null) {
      window.clearTimeout(loadTimer.current);
      loadTimer.current = null;
    }
  }, []);

  const toDrive = useCallback(() => {
    clearTimer();
    const a = audioRef.current;
    if (a) {
      a.pause();
      a.removeAttribute("src");
      a.load();
    }
    setMode("drive");
    setStatus("idle");
  }, [clearTimer]);

  const trySource = useCallback(
    (a: HTMLAudioElement, i: number) => {
      srcIdx.current = i;
      clearTimer();
      a.src = SOURCES[i];
      setStatus("loading");
      /* si Drive devuelve HTML o tarda demasiado, saltamos a la siguiente fuente */
      loadTimer.current = window.setTimeout(() => {
        if (i + 1 < SOURCES.length) trySource(a, i + 1);
        else toDrive();
      }, 7000);
      a.play().catch(() => {
        if (i + 1 < SOURCES.length) trySource(a, i + 1);
        else toDrive();
      });
    },
    [clearTimer, toDrive]
  );

  const toggle = useCallback(() => {
    if (mode === "drive") return;
    let a = audioRef.current;
    if (!a) {
      a = new Audio();
      a.preload = "auto";
      const el = a;
      el.addEventListener("timeupdate", () => setTime(el.currentTime));
      el.addEventListener("durationchange", () => {
        if (isFinite(el.duration) && el.duration > 0) setDur(el.duration);
      });
      el.addEventListener("play", () => setStatus("playing"));
      el.addEventListener("pause", () => setStatus((s) => (s === "loading" ? s : "paused")));
      el.addEventListener("ended", () => {
        setStatus("idle");
        setTime(0);
      });
      el.addEventListener("canplay", clearTimer);
      el.addEventListener("error", () => {
        if (el.error && el.error.code === 1) return; /* abortado a propósito */
        const i = srcIdx.current;
        if (i + 1 < SOURCES.length) trySource(el, i + 1);
        else toDrive();
      });
      audioRef.current = a;
    }
    if (!a.paused) {
      a.pause();
      return;
    }
    if (!a.src) {
      trySource(a, 0);
      return;
    }
    clearTimer();
    setStatus("loading");
    a.play().catch(() => {
      const i = srcIdx.current;
      if (i + 1 < SOURCES.length) trySource(a, i + 1);
      else toDrive();
    });
  }, [mode, clearTimer, trySource, toDrive]);

  const seek = useCallback((t: number) => {
    const a = audioRef.current;
    if (a && isFinite(t) && t >= 0) {
      a.currentTime = t;
      setTime(t);
    }
  }, []);

  const retryCustom = useCallback(() => {
    clearTimer();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    srcIdx.current = 0;
    setTime(0);
    setDur(0);
    setMode("custom");
    setStatus("idle");
  }, [clearTimer]);

  useEffect(
    () => () => {
      clearTimer();
      audioRef.current?.pause();
    },
    [clearTimer]
  );

  return {
    mode,
    status,
    time,
    dur,
    progress: dur > 0 ? Math.min(1, time / dur) : 0,
    toggle,
    seek,
    useDrivePlayer: toDrive,
    retryCustom,
  };
}

/* ---------------- iconos de transporte ---------------- */

function PlayGlyph({ state }: { state: PodcastStatus }) {
  if (state === "loading") {
    return (
      <svg viewBox="0 0 24 24" className="w-7 h-7" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="14 42" strokeLinecap="round" className="clock-hand-fast" />
      </svg>
    );
  }
  if (state === "playing") {
    return (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor" aria-hidden="true">
        <rect x="5" y="4" width="5" height="16" rx="1" />
        <rect x="14" y="4" width="5" height="16" rx="1" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="w-7 h-7 translate-x-[2px]" fill="currentColor" aria-hidden="true">
      <path d="M6 3.5v17l14-8.5z" />
    </svg>
  );
}

/* ---------------- barra superior fija ---------------- */

export function TopPlayerBar({ p }: { p: Podcast }) {
  const live = p.mode === "custom" && p.status === "playing";
  return (
    <div className="sticky top-0 z-[70] h-12 bg-navy text-white border-b-[3px] border-ink shadow-[0_3px_0_rgba(15,43,102,0.25)]">
      <div className="mx-auto max-w-7xl h-full px-4 sm:px-6 flex items-center gap-3 sm:gap-4">
        <div
          className={`flex items-end gap-[3px] h-5 w-6 shrink-0 ${live ? "" : "eq-paused"}`}
          aria-hidden="true"
        >
          {[10, 16, 20, 13].map((h, i) => (
            <span key={i} className="eq-bar flex-1 bg-yellow" style={{ height: `${h}px` }} />
          ))}
        </div>

        {p.mode === "custom" ? (
          <button
            onClick={p.toggle}
            aria-label={p.status === "playing" ? "Pausar el podcast" : "Reproducir el podcast"}
            className={`shrink-0 w-8 h-8 border-2 border-white/90 flex items-center justify-center transition-all duration-300 hover:scale-110 ${
              p.status === "playing" ? "bg-yellow text-ink" : "bg-red hover:bg-red-deep"
            }`}
          >
            <PlayGlyph state={p.status} />
          </button>
        ) : (
          <span className="shrink-0 w-8 h-8 border-2 border-white/90 flex items-center justify-center bg-red" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-white blink-soft" />
          </span>
        )}

        <div className="min-w-0 flex-1 leading-tight">
          <p className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-[0.22em] text-white/55 truncate">
            {p.mode === "drive"
              ? "Reproductor oficial de Drive activo"
              : p.status === "playing"
                ? "Sonando — sigue leyendo la guía"
                : p.status === "loading"
                  ? "Conectando con Drive…"
                  : p.status === "paused"
                    ? "En pausa"
                    : "Reproduce y sigue leyendo"}
          </p>
          <p className="text-xs sm:text-sm font-extrabold truncate">{PODCAST_TITLE}</p>
        </div>

        {p.mode === "custom" && p.dur > 0 && (
          <span className="font-display text-sm tabular-nums text-yellow shrink-0 hidden sm:block">
            {fmt(p.time)} / {fmt(p.dur)}
          </span>
        )}

        {p.mode === "custom" ? (
          <button
            onClick={p.useDrivePlayer}
            className="shrink-0 hidden md:block text-[11px] font-extrabold uppercase tracking-[0.14em] text-white/70 hover:text-yellow transition-colors link-sweep"
          >
            Reproductor oficial
          </button>
        ) : (
          <a
            href="#cabina"
            className="shrink-0 text-[11px] font-extrabold uppercase tracking-[0.14em] text-yellow hover:text-white transition-colors link-sweep"
          >
            Ir a la cabina ↓
          </a>
        )}
      </div>
    </div>
  );
}

/* ---------------- vinilo ---------------- */

function Vinyl({ playing }: { playing: boolean }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-auto" aria-hidden="true">
      <circle cx="100" cy="100" r="96" fill="#0a1d4a" stroke="#14213d" strokeWidth="4" />
      <g className={playing ? "spin-vinyl" : ""}>
        {[82, 70, 58].map((r) => (
          <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="#ffffff" strokeOpacity="0.14" strokeWidth="1.6" />
        ))}
        <circle cx="100" cy="100" r="34" fill="#f5a800" stroke="#14213d" strokeWidth="3.4" />
        <text x="100" y="95" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="13" fill="#14213d">
          MJRV
        </text>
        <text x="100" y="111" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="13" fill="#d0311f">
          2027
        </text>
        <rect x="98.6" y="66" width="2.8" height="14" fill="#14213d" />
      </g>
      <circle cx="100" cy="100" r="5" fill="#14213d" stroke="#ffffff" strokeWidth="2" />
      {/* brazo */}
      <g
        style={{
          transformOrigin: "168px 30px",
          transformBox: "fill-box",
          transform: playing ? "rotate(24deg)" : "rotate(0deg)",
          transition: "transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
      >
        <circle cx="168" cy="30" r="10" fill="#d0311f" stroke="#14213d" strokeWidth="3" />
        <line x1="168" y1="30" x2="132" y2="92" stroke="#14213d" strokeWidth="6" strokeLinecap="round" />
        <rect x="122" y="88" width="20" height="13" rx="3" fill="#ffffff" stroke="#14213d" strokeWidth="3" />
      </g>
    </svg>
  );
}

/* ---------------- cabina protagonista ---------------- */

export function RadioHero({ p }: { p: Podcast }) {
  const WAVE = useMemo(
    () =>
      Array.from({ length: 64 }, (_, i) =>
        Math.round(24 + 58 * Math.abs(Math.sin(i * 0.83) * Math.cos(i * 0.31)))
      ),
    []
  );

  const seekAt = (e: MouseEvent<HTMLDivElement>) => {
    if (p.mode !== "custom" || p.dur <= 0) return;
    const r = e.currentTarget.getBoundingClientRect();
    const frac = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    p.seek(frac * p.dur);
  };

  const playing = p.mode === "custom" && p.status === "playing";

  return (
    <section
      id="cabina"
      className="relative bg-navy text-white border-b-[3px] border-ink overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.10) 1.2px, transparent 1.2px)",
          backgroundSize: "16px 16px",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 grid lg:grid-cols-[360px_1fr] gap-10 lg:gap-16 items-center">
        {/* columna vinilo */}
        <div className="flex lg:flex-col items-center gap-6 lg:gap-5">
          <div className="relative w-48 sm:w-60 lg:w-full lg:max-w-[300px] shrink-0">
            <Vinyl playing={playing} />
            {p.mode === "custom" && (
              <button
                onClick={p.toggle}
                aria-label={playing ? "Pausar el podcast" : "Reproducir el podcast"}
                className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2 w-[74px] h-[74px] rounded-full border-4 border-ink flex items-center justify-center shadow-[0_10px_24px_rgba(0,0,0,0.45)] transition-all duration-300 hover:scale-110 ${
                  playing ? "bg-yellow text-ink" : "bg-red text-white hover:bg-red-deep"
                }`}
              >
                <PlayGlyph state={p.status} />
              </button>
            )}
            <span
              className={`absolute -top-3 -right-3 font-display text-sm tracking-[0.16em] px-3 py-1 border-2 border-ink text-white flex items-center gap-2 ${
                playing ? "bg-red" : "bg-ink"
              }`}
            >
              <span className={`w-2 h-2 rounded-full bg-white ${playing ? "blink-soft" : "opacity-40"}`} />
              ON AIR
            </span>
          </div>
          <p className="lg:w-full text-center lg:text-left text-sm font-bold text-white/60 max-w-[300px]">
            {p.mode === "drive"
              ? "Reproductor oficial activo: pulsa play dentro del recuadro."
              : playing
                ? "Sonando — la guía sigue abajo, el audio te acompaña."
                : p.status === "loading"
                  ? "Conectando con Google Drive…"
                  : p.status === "paused"
                    ? "En pausa. Pulsa para continuar."
                    : "Pulsa el botón rojo y escucha mientras lees la guía."}
          </p>
        </div>

        {/* columna contenido */}
        <div>
          <p className="kicker text-yellow flex items-center gap-3">
            <span className="inline-block w-10 h-[3px] bg-yellow" />
            Audio oficial de la jornada
          </p>
          <h2 className="mt-4 font-display uppercase leading-[0.94] text-[34px] sm:text-[52px] xl:text-[64px]">
            <span className="line-mask is-in">
              <span>El manual de <span className="text-yellow">supervivencia</span></span>
            </span>
            <span className="line-mask is-in">
              <span>
                para el MJRV <span className="text-red">2027</span>
                <span className="text-yellow">.</span>
              </span>
            </span>
          </h2>
          <p className="mt-3 text-white/70 font-semibold text-sm sm:text-base">
            {PODCAST_TITLE} · Episodio único para miembros de la Junta Receptora del Voto.
          </p>

          {p.mode === "custom" ? (
            <div className="mt-7">
              <div
                className={`flex items-end gap-[3px] h-24 cursor-pointer select-none ${playing ? "wf-live" : ""}`}
                onClick={seekAt}
                role="slider"
                aria-label="Posición del audio"
                aria-valuemin={0}
                aria-valuemax={Math.round(p.dur)}
                aria-valuenow={Math.round(p.time)}
                title={p.dur > 0 ? "Toca la onda para saltar a ese punto" : undefined}
              >
                {WAVE.map((h, i) => {
                  const played = p.dur > 0 && i / WAVE.length <= p.progress;
                  return (
                    <span
                      key={i}
                      className="wf-bar flex-1 min-w-0"
                      style={{
                        height: `${h}%`,
                        backgroundColor: played ? "#d0311f" : "rgba(255,255,255,0.28)",
                        animationDelay: `${(i % 9) * 0.07}s`,
                        transition: "background-color 0.2s",
                      }}
                    />
                  );
                })}
              </div>
              <div className="mt-3 flex items-center justify-between gap-4">
                <span className="font-display text-lg tabular-nums text-yellow">{fmt(p.time)}</span>
                <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/45 hidden sm:block">
                  Toca la onda para saltar de minuto
                </span>
                <span className="font-display text-lg tabular-nums text-white/70">{fmt(p.dur)}</span>
              </div>
              <button
                onClick={p.useDrivePlayer}
                className="mt-4 text-xs font-extrabold uppercase tracking-[0.16em] text-white/60 hover:text-yellow transition-colors link-sweep"
              >
                ¿No se escucha? Activa el reproductor oficial de Drive →
              </button>
            </div>
          ) : (
            <div className="mt-7">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="font-display text-sm tracking-[0.16em] px-3 py-1 bg-red border-2 border-white/80 text-white">
                  REPRODUCTOR OFICIAL
                </span>
                <span className="text-sm font-bold text-white/75">
                  Drive bloqueó el stream directo — este reproductor siempre funciona.
                </span>
              </div>
              <div className="ink-frame bg-white p-2 sm:p-3 shadow-[8px_8px_0_rgba(245,168,0,0.85)]">
                <iframe
                  title="Reproductor oficial de Google Drive — Podcast MJRV 2027"
                  src={DRIVE_EMBED}
                  className="w-full aspect-video border-2 border-ink bg-white"
                  allow="autoplay; encrypted-media"
                />
              </div>
              <button
                onClick={p.retryCustom}
                className="mt-4 text-xs font-extrabold uppercase tracking-[0.16em] text-white/60 hover:text-yellow transition-colors link-sweep"
              >
                ↺ Reintentar con el reproductor propio
              </button>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-2.5">
            {["EP. 01", "Temporada electoral", "Instalación", "Votación", "Escrutinio", "Embalaje"].map((c) => (
              <span
                key={c}
                className="text-[11px] font-extrabold uppercase tracking-[0.16em] px-3 py-1.5 border-2 border-white/25 text-white/80 hover:border-yellow hover:text-yellow transition-colors"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
