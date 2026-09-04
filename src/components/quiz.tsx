import { useEffect, useRef, useState } from "react";
import { QUESTION_BANK } from "../data/quiz";
import { Reveal } from "./bits";
import { DYNAMICS, MatchItem, type DynamicSpec } from "./match";

/* Examen relámpago del MJRV: 10 ítems por sesión, mezclados al azar:
   7 preguntas de opción múltiple (del banco de 32) + 3 prácticas visuales
   de actas y sobres (del banco de 7 dinámicas).
   Respuesta incorrecta → alerta roja en línea (sin sobreposición) y reintento. */

const LETTERS = ["A", "B", "C", "D"];
const MC_COUNT = 7;
const MATCH_COUNT = 3;
const TOTAL = MC_COUNT + MATCH_COUNT;

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Opt {
  text: string;
  correct: boolean;
}

type Slot =
  | { kind: "mc"; q: string; opts: Opt[] }
  | { kind: "match"; dyn: DynamicSpec };

function buildSession(): Slot[] {
  const mcs: Slot[] = shuffle(QUESTION_BANK)
    .slice(0, MC_COUNT)
    .map((item) => ({
      kind: "mc" as const,
      q: item.q,
      opts: shuffle(item.opts.map((text, i) => ({ text, correct: i === item.a }))),
    }));
  const dyns: Slot[] = shuffle(DYNAMICS)
    .slice(0, MATCH_COUNT)
    .map((dyn) => ({ kind: "match" as const, dyn }));
  return shuffle([...mcs, ...dyns]);
}

/* categorías según aciertos (sobre 10) */
type Tone = "gold" | "blue" | "ink" | "red";
interface Tier {
  stamp: string;
  tag: string;
  note: string;
  tone: Tone;
  winner?: boolean;
}

const tierFor = (score: number): Tier =>
  score >= 10
    ? {
        stamp: "Presidente de mesa",
        tag: "¡Ganador!",
        note: "10 de 10: dominio total de la jornada. La mesa está en tus manos.",
        tone: "gold",
        winner: true,
      }
    : score === 9
      ? {
          stamp: "Secretario de la JRV",
          tag: "Casi perfecto",
          note: "9 de 10: un repaso fino y llegas a la presidencia de la mesa.",
          tone: "blue",
        }
      : score >= 7
        ? {
            stamp: "Segundo vocal",
            tag: "Sigue estudiando",
            note: "7–8 de 10: buena base; refuerza las etapas con la guía de arriba.",
            tone: "ink",
          }
        : score >= 5
          ? {
              stamp: "Tercer vocal",
              tag: "Sigue estudiando",
              note: "5–6 de 10: vas encaminado, pero la jornada todavía te exige más repaso.",
              tone: "ink",
            }
          : score >= 2
            ? {
                stamp: "Elector",
                tag: "Te hace falta capacitación",
                note: "Menos de 5 de 10: como elector cumples, pero como MJRV necesitas capacitación.",
                tone: "red",
              }
            : {
                stamp: "Fuera de las elecciones",
                tag: "Te hace falta capacitación",
                note: "Menos de 2 de 10: vuelve a leer la guía completa y reintenta el examen.",
                tone: "red",
              };

export function Quiz() {
  const [session, setSession] = useState<Slot[]>(() => buildSession());
  const [idx, setIdx] = useState(0);
  const [wrongPick, setWrongPick] = useState<number | null>(null);
  const [correctPick, setCorrectPick] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [finished, setFinished] = useState(false);
  const alertRef = useRef<HTMLDivElement>(null);

  const slot = session[Math.min(idx, session.length - 1)];

  useEffect(() => {
    if (wrongPick !== null && alertRef.current) {
      alertRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [wrongPick]);

  const advance = () => {
    if (idx + 1 >= TOTAL) {
      setFinished(true);
    } else {
      setIdx((v) => v + 1);
      setWrongPick(null);
      setCorrectPick(null);
      setAttempts(0);
    }
  };

  const pick = (i: number) => {
    if (slot.kind !== "mc" || correctPick !== null) return;
    if (slot.opts[i].correct) {
      setCorrectPick(i);
      if (attempts === 0) setScore((s) => s + 1);
      window.setTimeout(advance, 1300);
    } else {
      setWrongPick(i);
      setAttempts((a) => a + 1);
    }
  };

  const onMatchResolved = (earned: boolean) => {
    if (earned) setScore((s) => s + 1);
    window.setTimeout(advance, 1600);
  };

  const restart = () => {
    setSession(buildSession());
    setIdx(0);
    setWrongPick(null);
    setCorrectPick(null);
    setScore(0);
    setAttempts(0);
    setFinished(false);
  };

  const tier = tierFor(score);

  return (
    <section id="quiz" className="relative border-t-[3px] border-ink bg-white overflow-hidden">
      <div className="absolute inset-0 dots-bg-ink opacity-40 pointer-events-none" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
        {/* encabezado */}
        <Reveal>
          <p className="kicker text-red flex items-center gap-3">
            <span className="inline-block w-10 h-[3px] bg-red" />
            Al cierre de esta edición · Ponte a prueba
          </p>
        </Reveal>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <h2 className="font-display uppercase text-ink leading-[0.92] text-[44px] sm:text-[68px] xl:text-[80px]">
              Examen relámpago
              <span className="text-red">.</span>
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <div className="ink-frame bg-yellow px-5 py-3 shadow-[6px_6px_0_rgba(20,33,61,0.9)]">
              <p className="font-display text-2xl leading-none text-ink">10</p>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-ink/70 mt-1">
                Preguntas y prácticas al azar
              </p>
            </div>
          </Reveal>
        </div>
        <Reveal delay={100}>
          <p className="mt-5 text-lg sm:text-xl font-medium text-ink-soft max-w-3xl">
            Diez ítems mezclados al azar: preguntas de opción múltiple y{" "}
            <strong className="text-ink font-extrabold">prácticas visuales de actas y sobres</strong> — arrastra cada
            documento hasta su destino. Si fallas, verás una <strong className="text-red font-extrabold">alerta roja</strong>{" "}
            y podrás volver a intentarlo; el punto solo cuenta a la primera.
          </p>
        </Reveal>

        {/* progreso global: azul = teoría · amarillo = práctica */}
        <Reveal delay={150}>
          <div className="mt-8 flex gap-1.5" aria-hidden="true">
            {session.map((s, i) => (
              <span
                key={i}
                className={`h-2.5 flex-1 transition-colors duration-500 ${
                  i < idx || finished
                    ? s.kind === "mc"
                      ? "bg-blue"
                      : "bg-yellow"
                    : i === idx && !finished
                      ? "bg-red blink-soft"
                      : "bg-ink/15"
                }`}
              />
            ))}
          </div>
        </Reveal>

        {/* tarjeta de examen */}
        <Reveal delay={150} className="mt-6">
          {!finished ? (
            <div className="relative border-[3px] border-ink bg-white shadow-[10px_10px_0_rgba(208,49,31,0.9)]">
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b-[3px] border-ink bg-navy text-white px-5 sm:px-7 py-3.5">
                <span className="font-display text-lg sm:text-xl tracking-[0.1em]">
                  ÍTEM {String(idx + 1).padStart(2, "0")} / {TOTAL}
                  <span className={`ml-3 text-sm px-2 py-0.5 border-2 ${slot.kind === "mc" ? "border-blue-mid text-blue-mid" : "border-yellow text-yellow"}`}>
                    {slot.kind === "mc" ? "TEORÍA" : "PRÁCTICA"}
                  </span>
                </span>
                <span className="font-display text-lg sm:text-xl text-yellow tabular-nums">ACIERTOS: {score}</span>
              </div>

              <div className="px-5 sm:px-7 py-7 sm:py-9">
                <div className="grid md:grid-cols-[88px_1fr] gap-5 sm:gap-7 items-start">
                  <span
                    aria-hidden="true"
                    className="font-display num-outline text-[64px] sm:text-[84px] leading-[0.85] select-none"
                    style={{ color: "#d0311f" }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>

                  <div>
                    {slot.kind === "match" ? (
                      <MatchItem key={idx} dyn={slot.dyn} onResolved={onMatchResolved} />
                    ) : (
                      <>
                        <h3 className="text-xl sm:text-2xl font-extrabold leading-snug text-ink">{slot.q}</h3>

                        <div className="mt-7 grid sm:grid-cols-2 gap-4">
                          {slot.opts.map((o, i) => {
                            const isWrong = wrongPick === i;
                            const isRight = correctPick === i;
                            return (
                              <button
                                key={i}
                                onClick={() => pick(i)}
                                disabled={correctPick !== null}
                                className={`group text-left flex items-start gap-4 border-[3px] border-ink p-4 transition-all duration-300 ${
                                  isRight
                                    ? "bg-blue text-white shadow-[5px_5px_0_rgba(20,33,61,0.9)]"
                                    : isWrong
                                      ? "bg-red text-white shake"
                                      : correctPick !== null
                                        ? "bg-white opacity-45"
                                        : "bg-white hover:bg-blue-soft hover:-translate-y-1 hover:shadow-[5px_5px_0_rgba(29,79,196,0.85)]"
                                }`}
                              >
                                <span
                                  className={`font-display text-lg w-9 h-9 shrink-0 flex items-center justify-center border-2 ${
                                    isRight || isWrong ? "border-white/90" : "border-ink bg-navy text-white group-hover:bg-blue"
                                  }`}
                                >
                                  {isRight ? (
                                    <svg viewBox="0 0 16 16" className="w-4 h-4" aria-hidden="true">
                                      <path d="m3 8.5 3.5 3.5L13 5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  ) : isWrong ? (
                                    <svg viewBox="0 0 16 16" className="w-4 h-4" aria-hidden="true">
                                      <path d="m4 4 8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
                                    </svg>
                                  ) : (
                                    LETTERS[i]
                                  )}
                                </span>
                                <span className="text-[15px] sm:text-base font-semibold leading-snug pt-1.5">{o.text}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* alertas en línea (sin sobreposición) */}
                        {wrongPick !== null && correctPick === null && (
                          <div
                            ref={alertRef}
                            role="alert"
                            className="mt-6 flex items-start gap-4 border-[3px] border-red bg-red-soft px-5 py-4 shadow-[6px_6px_0_rgba(208,49,31,0.55)]"
                          >
                            <span className="font-display text-2xl text-red leading-none pt-0.5" aria-hidden="true">✗</span>
                            <div>
                              <p className="font-display text-xl uppercase tracking-wide text-red">Respuesta incorrecta</p>
                              <p className="mt-1 text-[15px] font-semibold text-ink leading-snug">
                                {attempts === 1
                                  ? "Vuelve a intentarlo: elimina esa opción y elige de nuevo."
                                  : `Llevas ${attempts} intentos. Respira, repasa mentalmente la etapa correspondiente y vuelve a intentarlo.`}
                              </p>
                            </div>
                          </div>
                        )}
                        {correctPick !== null && (
                          <div
                            role="status"
                            className="mt-6 flex items-start gap-4 border-[3px] border-blue bg-blue-soft px-5 py-4 shadow-[6px_6px_0_rgba(29,79,196,0.55)]"
                          >
                            <span className="font-display text-2xl text-blue leading-none pt-0.5" aria-hidden="true">✓</span>
                            <p className="text-[15px] font-extrabold text-navy leading-snug pt-1">
                              {attempts === 0 ? "¡Correcto a la primera! Punto para la mesa." : "¡Correcto! Esta vez sin punto, pero bien hecho."}{" "}
                              {idx + 1 < TOTAL ? "Siguiente ítem en un instante…" : "Cerrando el escrutinio de tu examen…"}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* resultado final · categoría del participante */
            <div
              className={`relative overflow-hidden border-[3px] border-ink px-5 sm:px-7 py-10 sm:py-14 text-center ${
                tier.tone === "gold"
                  ? "bg-yellow shadow-[10px_10px_0_rgba(208,49,31,0.9)]"
                  : "bg-white shadow-[10px_10px_0_rgba(20,33,61,0.9)]"
              }`}
            >
              {/* estrellas de celebración para el ganador */}
              {tier.winner && (
                <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                  {(
                    [
                      ["6%", "12%", "w-6", "rotate-12", "#d0311f", "0s"],
                      ["14%", "74%", "w-5", "-rotate-12", "#1d4fc4", "0.4s"],
                      ["88%", "16%", "w-8", "-rotate-6", "#d0311f", "0.2s"],
                      ["82%", "70%", "w-6", "rotate-45", "#1d4fc4", "0.6s"],
                      ["50%", "6%", "w-5", "rotate-6", "#1d4fc4", "0.8s"],
                    ] as Array<[string, string, string, string, string, string]>
                  ).map(([top, left, w, rot, fill, delay], i) => (
                    <svg
                      key={i}
                      viewBox="0 0 16 16"
                      className={`absolute ${w} ${rot} blink-soft`}
                      style={{ top, left, animationDelay: delay }}
                    >
                      <path d="M8 0l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill={fill} stroke="#14213d" strokeWidth="0.8" />
                    </svg>
                  ))}
                </div>
              )}

              {tier.winner && (
                <div className="inline-flex items-center gap-3 font-display text-xl sm:text-2xl tracking-[0.18em] uppercase text-ink bg-white border-[3px] border-ink px-6 py-2 rotate-[-2deg] shadow-[6px_6px_0_rgba(20,33,61,0.9)]">
                  <svg viewBox="0 0 16 16" className="w-5 h-5" aria-hidden="true">
                    <path d="M8 0l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="#d0311f" stroke="#14213d" strokeWidth="0.8" />
                  </svg>
                  {tier.tag}
                  <svg viewBox="0 0 16 16" className="w-5 h-5" aria-hidden="true">
                    <path d="M8 0l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="#d0311f" stroke="#14213d" strokeWidth="0.8" />
                  </svg>
                </div>
              )}

              <p className={`kicker mt-6 ${tier.winner ? "text-ink/70" : "text-ink-soft"}`}>
                Escrutinio terminado · Tu categoría
              </p>
              <p className="mt-5 font-display leading-none text-ink">
                <span
                  className={`text-[96px] sm:text-[140px] ${
                    tier.tone === "gold" || tier.tone === "red" ? "text-red" : "text-blue"
                  }`}
                >
                  {score}
                </span>
                <span className="text-4xl sm:text-6xl text-ink/40"> / {TOTAL}</span>
              </p>
              <p className="mt-2 text-sm font-extrabold uppercase tracking-[0.2em] text-ink-soft">
                Aciertos a la primera · teoría + práctica
              </p>

              <div
                className={`mt-8 inline-block font-display text-2xl sm:text-3xl tracking-[0.12em] uppercase px-6 py-2.5 rotate-[-1.5deg] border-4 ${
                  tier.tone === "gold"
                    ? "bg-red text-white border-ink shadow-[7px_7px_0_rgba(20,33,61,0.9)]"
                    : tier.tone === "blue"
                      ? "bg-blue text-white border-ink shadow-[7px_7px_0_rgba(20,33,61,0.55)]"
                      : tier.tone === "ink"
                        ? "bg-white text-ink border-ink shadow-[7px_7px_0_rgba(20,33,61,0.35)]"
                        : "bg-red text-white border-ink shadow-[7px_7px_0_rgba(208,49,31,0.4)]"
                }`}
              >
                {tier.stamp}
              </div>

              <p
                className={`mt-4 font-display text-sm sm:text-base tracking-[0.2em] uppercase ${
                  tier.tone === "red" ? "text-red" : tier.tone === "gold" ? "text-ink/80" : "text-ink-soft"
                }`}
              >
                ( {tier.tag} )
              </p>
              <p className="mt-4 text-lg font-medium text-ink-soft max-w-xl mx-auto">{tier.note}</p>

              <div className="mt-9 flex flex-wrap justify-center gap-4">
                <button
                  onClick={restart}
                  className="font-display text-xl uppercase tracking-[0.08em] bg-red text-white border-[3px] border-ink px-7 py-3.5 shadow-[6px_6px_0_rgba(20,33,61,0.9)] transition-all duration-300 hover:-translate-y-1 hover:bg-red-deep hover:shadow-[8px_8px_0_rgba(20,33,61,0.9)]"
                >
                  Nuevo examen ↺
                </button>
                <a
                  href="#instalacion"
                  className="font-display text-xl uppercase tracking-[0.08em] bg-white text-navy border-[3px] border-ink px-7 py-3.5 shadow-[6px_6px_0_rgba(29,79,196,0.7)] transition-all duration-300 hover:-translate-y-1 hover:bg-blue-soft"
                >
                  Repasar la guía ↑
                </a>
              </div>
            </div>
          )}
        </Reveal>

        <Reveal delay={200}>
          <p className="mt-6 text-sm font-semibold text-ink-soft max-w-2xl">
            Cada visita mezcla al azar la teoría y las prácticas, en distinto orden. Las respuestas siguen el procedimiento
            oficial descrito en las cuatro etapas de esta guía.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
