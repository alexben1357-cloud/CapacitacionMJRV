import { useEffect, useRef, useState, type MouseEvent } from "react";

const FILE_ID = "1ASF-95B1-YhSpNKKB6R4jBYNAFzfHIZ4";
const SRC_PRIMARY = `https://drive.google.com/uc?export=download&id=${FILE_ID}`;
const SRC_FALLBACK = `https://docs.google.com/uc?export=download&id=${FILE_ID}`;

function fmt(t: number) {
  if (!Number.isFinite(t) || t <= 0) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function AudioBar() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const triedFallback = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [failed, setFailed] = useState(false);
  const [scroll, setScroll] = useState(0);

  /* progreso de lectura de la página */
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      setScroll(total > 0 ? (h.scrollTop / total) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (!a || failed) return;
    if (a.paused) {
      a.play().catch(() => setFailed(true));
    } else {
      a.pause();
    }
  };

  const seek = (e: MouseEvent<HTMLDivElement>) => {
    const a = audioRef.current;
    if (!a || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    a.currentTime = ratio * duration;
    setCurrent(a.currentTime);
  };

  const pct = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div className="sticky top-0 z-[80] h-12 bg-navy text-white border-b-[3px] border-ink">
      <div className="mx-auto max-w-7xl h-full px-3 sm:px-6 flex items-center gap-3">
        {/* botón reproducir */}
        <button
          onClick={toggle}
          disabled={failed}
          aria-label={playing ? "Pausar podcast" : "Reproducir podcast"}
          className={`w-9 h-9 shrink-0 border-2 border-white flex items-center justify-center transition-colors duration-300 ${
            failed
              ? "bg-white/20 cursor-not-allowed"
              : playing
                ? "bg-yellow text-ink hover:bg-white"
                : "bg-red hover:bg-yellow hover:text-ink"
          }`}
        >
          {playing ? (
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="currentColor" aria-hidden="true">
              <rect x="2.5" y="2" width="4" height="12" />
              <rect x="9.5" y="2" width="4" height="12" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 translate-x-[1px]" fill="currentColor" aria-hidden="true">
              <path d="M3 1.5 14 8 3 14.5z" />
            </svg>
          )}
        </button>

        {/* ecualizador */}
        <span className={`flex items-end gap-[3px] h-4 shrink-0 ${playing ? "" : "eq-paused"}`} aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="eq-bar w-[3px] h-4 bg-yellow inline-block" />
          ))}
        </span>

        {/* leyenda */}
        <p className="min-w-0 flex-1 truncate text-[11px] sm:text-[13px] font-bold tracking-wide">
          <span className="text-yellow uppercase tracking-[0.16em] font-extrabold">Podcast:</span>{" "}
          El manual de supervivencia para el MJRV 2027
          {failed && <span className="text-red-soft font-semibold"> · audio no disponible por ahora</span>}
        </p>

        {/* estado */}
        <span
          className={`hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 border border-white/40 font-display text-[11px] tracking-[0.18em] uppercase ${
            playing ? "text-yellow" : "text-white/70"
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${playing ? "bg-red blink-soft" : "bg-white/50"}`} />
          {playing ? "Sonando" : "Listo"}
        </span>

        {/* tiempo */}
        <span className="font-display text-sm tabular-nums shrink-0 text-white/90">
          {fmt(current)} <span className="text-white/50">/ {duration ? fmt(duration) : "--:--"}</span>
        </span>

        {/* barra de posición */}
        <div
          onClick={seek}
          role="slider"
          aria-label="Posición del audio"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pct)}
          className="group/seek hidden sm:flex items-center h-8 w-36 lg:w-56 shrink-0 cursor-pointer"
        >
          <div className="relative w-full h-[6px] bg-white/25">
            <div className="absolute inset-y-0 left-0 bg-yellow" style={{ width: `${pct}%` }} />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-red border border-white opacity-0 group-hover/seek:opacity-100 transition-opacity duration-200"
              style={{ left: `calc(${pct}% - 6px)` }}
            />
          </div>
        </div>
      </div>

      {/* progreso de lectura del sitio */}
      <div
        className="absolute left-0 bottom-[3px] h-[3px] bg-red transition-[width] duration-150 ease-out"
        style={{ width: `${scroll}%` }}
        aria-hidden="true"
      />

      <audio
        ref={audioRef}
        src={SRC_PRIMARY}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setCurrent(0);
        }}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => {
          const d = e.currentTarget.duration;
          if (Number.isFinite(d)) setDuration(d);
        }}
        onDurationChange={(e) => {
          const d = e.currentTarget.duration;
          if (Number.isFinite(d) && d > 0) setDuration(d);
        }}
        onError={() => {
          const a = audioRef.current;
          if (!a) return;
          if (!triedFallback.current) {
            triedFallback.current = true;
            a.src = SRC_FALLBACK;
            a.load();
          } else {
            setFailed(true);
            setPlaying(false);
          }
        }}
      />
    </div>
  );
}
