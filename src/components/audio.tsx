import { useCallback, useMemo, useRef, type RefObject } from "react";
import { Reveal } from "./bits";

/* =============== Podcast: El manual de supervivencia para el MJRV 2027 ===============
   Una única fuente visual de reproducción: el reproductor embebido, que es el que
   efectivamente reproduce el audio. La barra superior solo lleva hasta la cabina. */

const FILE_ID = "1ASF-95B1-YhSpNKKB6R4jBYNAFzfHIZ4";
const PREVIEW_URL = `https://drive.google.com/file/d/${FILE_ID}/preview`;

export interface Podcast {
  goHero: () => void;
  heroRef: RefObject<HTMLElement>;
}

export function usePodcast(): Podcast {
  const heroRef = useRef<HTMLElement>(null);
  const goHero = useCallback(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    heroRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  }, []);
  return { goHero, heroRef };
}

/* =============== barra superior (atajo a la cabina) =============== */

export function TopPlayerBar({ p }: { p: Podcast }) {
  return (
    <div className="sticky top-0 z-[70] bg-navy text-white border-b-[3px] border-ink shadow-[0_4px_0_rgba(20,33,61,0.25)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-12 flex items-center gap-3 sm:gap-5">
        <button
          onClick={p.goHero}
          aria-label="Ir al podcast"
          className="w-9 h-9 shrink-0 border-2 border-white/70 bg-red text-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-white"
        >
          <svg viewBox="0 0 16 16" className="w-4 h-4" aria-hidden="true">
            <path d="M4 2.2v11.6L13.6 8z" fill="currentColor" />
          </svg>
        </button>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] sm:text-[13px] font-extrabold uppercase tracking-[0.12em] leading-none">
            Podcast: El manual de supervivencia para el MJRV 2027
          </p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 leading-none">
            Reproduce desde la cabina
          </p>
        </div>

        <button
          onClick={p.goHero}
          className="hidden sm:inline-flex font-display text-sm tracking-[0.14em] border-2 border-yellow text-yellow px-4 py-1.5 transition-colors duration-300 hover:bg-yellow hover:text-navy"
        >
          ESCUCHAR
        </button>
      </div>
      <div className="h-[4px] bg-red" />
    </div>
  );
}

/* =============== cabina protagonista (única fuente de reproducción) =============== */

export function RadioHero({ p }: { p: Podcast }) {
  const wave = useMemo(
    () => Array.from({ length: 48 }, (_, i) => 22 + Math.round(50 * Math.abs(Math.sin(i * 0.6) * Math.cos(i * 0.23)))),
    []
  );

  return (
    <section
      ref={p.heroRef as RefObject<HTMLElement>}
      id="podcast"
      className="relative bg-navy text-white border-b-[3px] border-ink overflow-hidden"
    >
      <div className="absolute inset-0 dots-bg opacity-[0.25] pointer-events-none" />
      <div className="absolute -right-20 -top-24 w-72 h-72 rounded-full border-[3px] border-white/10 pointer-events-none" />
      <div className="absolute -right-8 -top-10 w-44 h-44 rounded-full border-[3px] border-white/10 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-12 sm:pt-16 pb-14">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* texto */}
          <div className="lg:col-span-6">
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
                  <span className="w-2.5 h-2.5 rounded-full bg-red blink-soft" />
                  Al aire
                </span>
              </div>
            </Reveal>
          </div>

          {/* reproductor embebido: la única fuente de reproducción */}
          <div className="lg:col-span-6">
            <Reveal delay={150}>
              <div className="border-[3px] border-white bg-white text-ink relative shadow-[12px_12px_0_rgba(0,0,0,0.35)]">
                <div className="flex items-center justify-between gap-3 border-b-[3px] border-ink bg-yellow px-4 sm:px-5 py-2.5">
                  <span className="font-display text-sm sm:text-base tracking-[0.14em] text-ink flex items-center gap-2.5">
                    <svg viewBox="0 0 120 120" className="w-6 h-6 spin-vinyl shrink-0" aria-hidden="true">
                      <circle cx="60" cy="60" r="57" fill="#0a1e47" />
                      <circle cx="60" cy="60" r="20" fill="#f5a800" stroke="#14213d" strokeWidth="4" />
                      <circle cx="60" cy="60" r="5" fill="#14213d" />
                    </svg>
                    AL AIRE
                  </span>
                  <span className="font-display text-sm sm:text-base tracking-[0.1em] text-ink/70">EP. 01</span>
                </div>

                <div className="p-3 sm:p-4">
                  <div className="h-[170px] border-2 border-ink/15">
                    <iframe
                      src={PREVIEW_URL}
                      title="Podcast: El manual de supervivencia para el MJRV 2027"
                      className="w-full h-full border-0"
                      allow="autoplay"
                    />
                  </div>

                  {/* onda decorativa */}
                  <div className="mt-4 flex items-end gap-[3px] h-12 wf-live" aria-hidden="true">
                    {wave.map((h, i) => (
                      <span
                        key={i}
                        className="wf-bar flex-1 bg-blue"
                        style={{
                          height: `${h}%`,
                          animationDelay: `${(i % 8) * 0.07}s`,
                          animationDuration: `${0.6 + (i % 5) * 0.09}s`,
                        }}
                      />
                    ))}
                  </div>

                  <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.16em] text-ink/55">
                    Pulsa play en el reproductor y sigue leyendo la guía
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
