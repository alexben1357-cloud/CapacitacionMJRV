import { useCallback, useEffect, useRef, useState } from "react";

/* =============== Podcast: El manual de supervivencia para el MJRV 2027 =============== */

const FILE_ID = "1ASF-95B1-YhSpNKKB6R4jBYNAFzfHIZ4";
const PREVIEW_URL = `https://drive.google.com/file/d/${FILE_ID}/preview`;

/* Google Drive no sirve archivos con /view: se intenta la descarga directa
   por varios endpoints públicos; si todos fallan se ofrece el reproductor
   oficial embebido (funciona siempre). */
const SOURCES = [
  `https://drive.usercontent.google.com/download?id=${FILE_ID}&export=download`,
  `https://drive.google.com/uc?export=download&id=${FILE_ID}`,
  `https://docs.google.com/uc?export=download&id=${FILE_ID}`,
];

export type PodcastStatus = "idle" | "loading" | "playing" | "paused" | "fallback";

export interface Podcast {
  status: PodcastStatus;
  time: number;
  dur: number;
  toggle: () => void;
  iframeOpen: boolean;
  openIframe: () => void;
}

const fmt = (s: number) => {
  if (!isFinite(s) || s < 0) return "--:--";
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, "0")}`;
};

export function usePodcast(): Podcast {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const srcIdxRef = useRef(0);
  const [status, setStatus] = useState<PodcastStatus>("idle");
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);
  const [iframeOpen, setIframeOpen] = useState(false);

  const advanceSource = useCallback((a: HTMLAudioElement) => {
    srcIdxRef.current += 1;
    if (srcIdxRef.current < SOURCES.length) {
      a.src = SOURCES[srcIdxRef.current];
      a.load();
      a.play().catch(() => {
        /* el evento error encadena el siguiente intento */
      });
    } else {
      setStatus("fallback");
    }
  }, []);

  const toggle = useCallback(() => {
    if (iframeOpen || status === "fallback") return;
    let a = audioRef.current;
    if (!a) {
      a = new Audio(SOURCES[0]);
      a.preload = "auto";
      const el = a;
      el.addEventListener("timeupdate", () => setTime(el.currentTime));
      el.addEventListener("loadedmetadata", () => setDur(el.duration || 0));
      el.addEventListener("durationchange", () => {
        if (isFinite(el.duration)) setDur(el.duration || 0);
      });
      el.addEventListener("play", () => setStatus("playing"));
      el.addEventListener("playing", () => setStatus("playing"));
      el.addEventListener("waiting", () => setStatus((s) => (s === "playing" ? "loading" : s)));
      el.addEventListener("pause", () => setStatus((s) => (s === "fallback" ? s : "paused")));
      el.addEventListener("ended", () => {
        setStatus("idle");
        setTime(0);
      });
      el.addEventListener("error", () => {
        /* 1 = MEDIA_ERR_ABORTED: se ignora (cambio de fuente intencional) */
        if (el.error && el.error.code === 1) return;
        advanceSource(el);
      });
      audioRef.current = el;
    }
    if (a.paused) {
      setStatus("loading");
      a.play().catch(() => advanceSource(a as HTMLAudioElement));
    } else {
      a.pause();
    }
  }, [iframeOpen, status, advanceSource]);

  const openIframe = useCallback(() => setIframeOpen(true), []);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  return { status, time, dur, toggle, iframeOpen, openIframe };
}

/* ---------- barra superior fija ---------- */

export function TopPlayerBar({ p }: { p: Podcast }) {
  const playing = p.status === "playing" || p.status === "loading";

  const onPlay = () => {
    if (p.status === "fallback") {
      p.openIframe();
      document.getElementById("podcast")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    p.toggle();
  };

  return (
    <div className="sticky top-0 z-[70] bg-navy text-white border-b-[3px] border-ink shadow-[0_4px_18px_rgba(15,43,102,0.35)]">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 h-12 flex items-center gap-3 sm:gap-4">
        <button
          onClick={onPlay}
          aria-label={playing ? "Pausar podcast" : "Reproducir podcast"}
          className={`shrink-0 w-9 h-9 border-2 border-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${
            playing ? "bg-yellow text-ink" : "bg-red text-white"
          }`}
        >
          {p.status === "loading" ? (
            <span className="w-3 h-3 bg-current blink-soft" />
          ) : playing ? (
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
              <rect x="5" y="4" width="5" height="16" />
              <rect x="14" y="4" width="5" height="16" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="w-4 h-4 ml-0.5" fill="currentColor" aria-hidden="true">
              <path d="M6 4l14 8-14 8z" />
            </svg>
          )}
        </button>

        <div className={`flex items-end gap-[3px] h-4 shrink-0 ${playing ? "" : "eq-paused"}`} aria-hidden="true">
          <span className="eq-bar w-[3px] h-full bg-yellow" />
          <span className="eq-bar w-[3px] h-full bg-yellow" />
          <span className="eq-bar w-[3px] h-full bg-yellow" />
          <span className="eq-bar w-[3px] h-full bg-yellow" />
        </div>

        <span className="hidden md:inline-block font-display text-[11px] tracking-[0.22em] uppercase bg-yellow text-ink px-2 py-0.5 shrink-0">
          Podcast
        </span>

        <p className="flex-1 min-w-0 truncate text-[13px] sm:text-sm font-bold uppercase tracking-[0.08em]">
          {p.status === "fallback"
            ? "El manual de supervivencia para el MJRV 2027 · abrir en Drive"
            : "El manual de supervivencia para el MJRV 2027"}
        </p>

        <span className="shrink-0 font-display text-sm sm:text-base tabular-nums text-white/90">
          {fmt(p.time)} <span className="text-white/50">/</span> {p.dur > 0 ? fmt(p.dur) : "--:--"}
        </span>
      </div>
    </div>
  );
}

/* ---------- forma de onda ---------- */

const WAVE = Array.from({ length: 64 }, (_, i) => {
  const h = 22 + Math.abs(Math.sin(i * 0.9) * 38) + Math.abs(Math.sin(i * 0.23 + 2) * 30);
  return Math.min(96, Math.round(h));
});

function Waveform({ p }: { p: Podcast }) {
  const frac = p.dur > 0 ? p.time / p.dur : 0;
  const live = p.status === "playing";
  return (
    <div
      className={`flex items-end gap-[3px] h-14 sm:h-[72px] ${live ? "wf-live" : ""}`}
      role="img"
      aria-label="Forma de onda del podcast"
    >
      {WAVE.map((h, i) => (
        <span
          key={i}
          className={`wf-bar flex-1 min-w-[2px] transition-colors duration-300 ${
            i / WAVE.length <= frac && frac > 0 ? "bg-red" : "bg-yellow"
          } ${i / WAVE.length <= frac && frac > 0 ? "" : "opacity-45"}`}
          style={{ height: `${h}%`, animationDelay: `${(i % 10) * 0.07}s` }}
        />
      ))}
    </div>
  );
}

/* ---------- vinilo ---------- */

function Vinyl({ playing }: { playing: boolean }) {
  return (
    <div className="relative w-40 sm:w-52 lg:w-60 mx-auto">
      <svg
        viewBox="0 0 220 220"
        className={`w-full h-auto drop-shadow-[8px_10px_0_rgba(9,20,44,0.55)] ${playing ? "spin-vinyl" : ""}`}
        aria-hidden="true"
      >
        <circle cx="110" cy="110" r="106" fill="#101a30" stroke="#14213d" strokeWidth="4" />
        {[92, 80, 68].map((r) => (
          <circle key={r} cx="110" cy="110" r={r} fill="none" stroke="#ffffff" strokeOpacity="0.1" strokeWidth="1.6" />
        ))}
        <path d="M110 18a92 92 0 0 1 79 45" fill="none" stroke="#ffffff" strokeOpacity="0.18" strokeWidth="7" strokeLinecap="round" />
        <circle cx="110" cy="110" r="38" fill="#d0311f" stroke="#14213d" strokeWidth="3" />
        <circle cx="110" cy="110" r="38" fill="none" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1.4" strokeDasharray="3 4" />
        <text x="110" y="106" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="17" fill="#ffffff">
          MJRV
        </text>
        <text x="110" y="126" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="17" fill="#f5a800">
          2027
        </text>
        <circle cx="110" cy="110" r="4.5" fill="#f2f6fc" />
      </svg>
      {/* brazo */}
      <svg
        viewBox="0 0 80 130"
        className={`absolute -top-3 -right-5 w-16 sm:w-20 transition-transform duration-700 ease-out origin-top ${
          playing ? "rotate-[22deg]" : "rotate-[4deg]"
        }`}
        aria-hidden="true"
      >
        <circle cx="52" cy="10" r="9" fill="#f5a800" stroke="#14213d" strokeWidth="3" />
        <line x1="52" y1="14" x2="34" y2="92" stroke="#14213d" strokeWidth="6" strokeLinecap="round" />
        <line x1="52" y1="14" x2="34" y2="92" stroke="#f2f6fc" strokeWidth="2.4" strokeLinecap="round" />
        <rect x="22" y="88" width="20" height="26" rx="3" fill="#d0311f" stroke="#14213d" strokeWidth="3" />
      </svg>
      <p className="mt-2 text-center font-display text-[11px] tracking-[0.28em] uppercase text-white/60">
        Lado A · 45 r.p.m.
      </p>
    </div>
  );
}

/* ---------- sección protagonista ---------- */

export function RadioHero({ p }: { p: Podcast }) {
  const playing = p.status === "playing";
  const loading = p.status === "loading";

  const onPlay = () => {
    if (p.status === "fallback") {
      p.openIframe();
      return;
    }
    p.toggle();
  };

  const statusLabel =
    p.status === "fallback"
      ? "Audio no disponible directamente · usa el reproductor de Drive"
      : p.status === "playing"
        ? "Sonando — sigue leyendo la guía"
        : p.status === "loading"
          ? "Cargando audio…"
          : p.status === "paused"
            ? "En pausa — retoma cuando quieras"
            : "Listo para reproducir";

  return (
    <section id="podcast" className="relative bg-navy text-white border-b-[3px] border-ink overflow-hidden">
      <div className="absolute inset-0 dots-bg-white pointer-events-none" />
      {/* ondas de radio */}
      <svg viewBox="0 0 200 200" className="absolute -top-10 -right-10 w-56 h-56 opacity-60 pointer-events-none" aria-hidden="true">
        {[40, 70, 100].map((r, i) => (
          <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="#f5a800" strokeWidth="2.4" strokeDasharray="10 12" opacity={0.7 - i * 0.18} />
        ))}
        <circle cx="100" cy="100" r="9" fill="#f5a800" className="blink-soft" />
      </svg>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 grid lg:grid-cols-[auto_1fr] gap-10 lg:gap-16 items-center">
        <Vinyl playing={playing} />

        <div className="min-w-0">
          <p className="flex items-center gap-3">
            <span className="inline-block w-10 h-[3px] bg-yellow" />
            <span className="kicker text-yellow">Podcast de la edición · escucha mientras lees</span>
          </p>

          <h2 className="mt-4 font-display uppercase leading-[0.95] text-[34px] sm:text-[52px] xl:text-[64px]">
            El manual de supervivencia
            <span className="block text-yellow">para el MJRV 2027</span>
          </h2>

          <div className="mt-7">
            <Waveform p={p} />
            <div className="mt-2 flex items-center justify-between font-display text-xs sm:text-sm tracking-[0.14em] text-white/70 tabular-nums">
              <span>{fmt(p.time)}</span>
              <span className="hidden sm:block text-[11px] tracking-[0.24em]">EP. 01 · TEMPORADA ELECTORAL</span>
              <span>{p.dur > 0 ? fmt(p.dur) : "--:--"}</span>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-5">
            <button
              onClick={onPlay}
              aria-label={playing ? "Pausar podcast" : "Reproducir podcast"}
              className={`group w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 shadow-[6px_6px_0_rgba(9,20,44,0.55)] ${
                playing ? "bg-yellow text-ink" : "bg-red text-white"
              }`}
            >
              {loading ? (
                <span className="w-6 h-6 bg-current blink-soft" />
              ) : playing ? (
                <svg viewBox="0 0 24 24" className="w-9 h-9" fill="currentColor" aria-hidden="true">
                  <rect x="5" y="4" width="5" height="16" />
                  <rect x="14" y="4" width="5" height="16" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="w-10 h-10 ml-1 transition-transform duration-300 group-hover:scale-110" fill="currentColor" aria-hidden="true">
                  <path d="M6 4l14 8-14 8z" />
                </svg>
              )}
            </button>

            <div className="min-w-0">
              <p className="font-display text-lg sm:text-xl uppercase tracking-[0.06em]">
                {p.status === "fallback" ? "Plan B activado" : playing ? "Al aire" : "Reproducir"}
              </p>
              <p className="text-sm sm:text-[15px] font-medium text-white/75 leading-snug">{statusLabel}</p>
            </div>
          </div>

          {/* respaldo: reproductor oficial de Drive */}
          {p.status === "fallback" && !p.iframeOpen && (
            <div className="mt-8 border-2 border-dashed border-white/50 p-5 sm:p-6 bg-[#0b1f4d]">
              <p className="text-sm sm:text-[15px] font-medium leading-snug text-white/85 max-w-2xl">
                Tu navegador no pudo abrir el archivo directamente desde Google Drive (suele pasar con
                archivos grandes). El reproductor oficial de abajo funciona siempre:
              </p>
              <button
                onClick={p.openIframe}
                className="mt-4 font-display uppercase tracking-[0.1em] text-ink bg-yellow border-[3px] border-white px-5 py-2.5 shadow-[5px_5px_0_rgba(9,20,44,0.6)] transition-transform duration-300 hover:scale-[1.03] active:scale-95"
              >
                Abrir reproductor de Google Drive
              </button>
            </div>
          )}

          {p.iframeOpen && (
            <div className="mt-8">
              <div className="border-[3px] border-white/80 bg-black/30">
                <iframe
                  src={PREVIEW_URL}
                  title="Podcast: El manual de supervivencia para el MJRV 2027 (Google Drive)"
                  className="w-full h-[420px] block"
                  allow="autoplay"
                />
              </div>
              <p className="mt-2 text-xs font-medium text-white/60">
                Pulsa el botón de reproducción dentro del marco · el audio continúa mientras recorres la página.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
