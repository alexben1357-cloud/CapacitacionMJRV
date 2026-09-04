import { useState, type ReactNode } from "react";
import {
  instalacionSteps, rolesMJRV,
  votacionSteps, votacionAlertas, inclusionMecanismos, mapSteps, brailleNota,
  escrutinioIntro, escrutinioGeneral, escrutinioAlcalde, notaDelegados, cpccsOrden,
  cpccsMujeres, cpccsCierre, sobresAzules, embalajeChecklist, leyendaSobres,
} from "./data/content";
import { Icon } from "./components/icons";
import {
  CoverArt, InstalacionArt, VotacionArt, EscrutinioArt, EmbalajeArt, BallotDiagram, RotaryStamp,
} from "./components/art";
import {
  Reveal, MaskLines, Ticker, StageNav, useActiveSection, StepRow, Callout, SubHead,
} from "./components/bits";
import { usePodcast, TopPlayerBar, RadioHero } from "./components/audio";

/* ================= metas de etapa ================= */

const STAGES = [
  {
    id: "instalacion", num: "01", label: "Instalación", hex: "#0f2b66", soft: "#e2e9f7",
    title: "Instalación de la Junta Receptora del Voto", time: "06:30",
    stand: "La jornada empieza antes del primer voto: recibir el paquete, verificar sellos, armar urnas y biombos, y dejar el acta firmada.",
    caption: "06:30 en punto: el paquete llega sellado, la mesa se arma y el acta espera tres firmas.",
  },
  {
    id: "votacion", num: "02", label: "Votación", hex: "#1d4fc4", soft: "#dce8fb",
    title: "Votación", time: "07:00 – 17:00",
    stand: "Diez horas para que cada elector reciba sus papeletas, sufrague en secreto y salga con su certificado en mano.",
    caption: "Entre el biombo y la urna no caben teléfonos, cámaras ni prisas: el voto es secreto y personal.",
  },
  {
    id: "escrutinio", num: "03", label: "Escrutinio", hex: "#c77f00", soft: "#fdf1d2",
    title: "Escrutinio", time: "17:00 hasta finalizar",
    stand: "Cerrada la votación, la mesa se vuelve contador: firmas contra papeletas, palote por palote, acta por acta.",
    caption: "Después de las 17:00 la mesa cambia de oficio: contar, clasificar y dejar todo por escrito.",
  },
  {
    id: "embalaje", num: "04", label: "Embalaje y envío", hex: "#d0311f", soft: "#fbe4de",
    title: "Embalaje y envío", time: "Al cierre",
    stand: "Cada sobre tiene un destino: los azules al coordinador, el paquete sellado a Fuerzas Armadas. Nada queda suelto.",
    caption: "Sobres azules, rojos y amarillos: cada documento tiene sobre, y cada sobre tiene destino.",
  },
];

const NAVY = "#0f2b66";
const BLUE = "#1d4fc4";
const YELLOW = "#c77f00";
const RED = "#d0311f";
const FUCSIA = "#d6489f";

const TICKER = [
  "06:30 · Instalación de la JRV",
  "07:00 – 17:00 · Votación",
  "17:00 · Arranca el escrutinio",
  "Urna blanca · Seccionales",
  "Urna café · CPCCS",
  "Tu voto, tu decisión",
  "Embalaje y envío con sellos de seguridad",
];

/* ================= cabecera de etapa ================= */

function StageHeader({ s, art }: { s: (typeof STAGES)[number]; art: ReactNode }) {
  return (
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-16 sm:pt-24 pb-8">
      <span
        aria-hidden="true"
        className="font-display num-outline-thin pointer-events-none select-none absolute -top-4 right-2 sm:right-8 text-[150px] sm:text-[240px] leading-none opacity-[0.16]"
        style={{ color: s.hex }}
      >
        {s.num}
      </span>
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-end relative">
        <div className="lg:col-span-7">
          <Reveal>
            <p className="kicker flex items-center gap-3" style={{ color: s.hex }}>
              <span className="inline-block w-10 h-[3px]" style={{ backgroundColor: s.hex }} />
              Etapa {s.num} · {s.time}
            </p>
          </Reveal>
          <MaskLines
            className="mt-4 font-display uppercase text-[44px] sm:text-[68px] xl:text-[84px] leading-[0.92] text-ink"
            lines={s.title.split(" ").reduce<string[][]>(
              (acc, w) => {
                const last = acc[acc.length - 1];
                if (last.join(" ").length + w.length > 14) acc.push([w]);
                else last.push(w);
                return acc;
              },
              [[]]
            ).map((l) => l.join(" "))}
          />
          <Reveal delay={200}>
            <p className="mt-6 text-lg sm:text-[22px] leading-snug font-medium text-ink-soft max-w-2xl">{s.stand}</p>
            <p
              className="mt-6 inline-flex items-center gap-3 font-display text-lg sm:text-xl tracking-[0.08em] text-white px-5 py-2.5 border-[3px] border-ink shadow-[5px_5px_0_rgba(20,33,61,0.9)]"
              style={{ backgroundColor: s.hex }}
            >
              <Icon name="reloj" className="w-6 h-6 [&_*]:stroke-white" />
              {s.time}
            </p>
          </Reveal>
        </div>
        <div className="lg:col-span-5">
          <Reveal delay={150}>
            <figure>
              <div className="ink-frame bg-white paper-edge hover:-translate-y-1.5 transition-transform duration-500">
                {art}
              </div>
              <figcaption className="mt-3 text-sm italic font-medium text-ink-soft border-l-4 pl-3" style={{ borderColor: s.hex }}>
                {s.caption}
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

/* ================= clasificadora de votos ================= */

function VoteClassifier() {
  const defs = escrutinioAlcalde.find((s) => s.n === "10")!.bullets!;
  const kinds: ("blanco" | "nulo" | "valido")[] = ["blanco", "nulo", "valido"];
  const hexes = [BLUE, RED, BLUE];
  return (
    <Reveal className="my-8">
      <div className="border-[3px] border-ink bg-white shadow-[7px_7px_0_rgba(20,33,61,0.9)] p-5 sm:p-8">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-6">
          <span className="font-display bg-ink text-white px-3 py-1 text-sm tracking-[0.16em] uppercase">Lámina 03-A</span>
          <h4 className="font-display text-2xl sm:text-3xl uppercase text-ink">Cómo se clasifica cada papeleta</h4>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {kinds.map((k, i) => (
            <div key={k} className="group">
              <div className="border-2 border-ink bg-paper-2 p-4 group-hover:-translate-y-1.5 group-hover:shadow-[5px_5px_0_rgba(20,33,61,0.85)] transition-all duration-300">
                <BallotDiagram kind={k} />
              </div>
              <h5 className="font-display text-xl uppercase mt-4 tracking-wide" style={{ color: hexes[i] }}>
                {defs[i].title}
              </h5>
              <p className="text-[15px] font-medium leading-snug mt-1 text-ink-soft">{defs[i].desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm font-bold text-ink bg-yellow-soft border-2 border-ink inline-block px-3 py-2">
          Regla CPCCS: en papeletas de mujeres se marcan hasta 3 candidatas — más de 3 marcas, voto nulo.
        </p>
      </div>
    </Reveal>
  );
}

/* ================= nota de procedimiento ================= */

function ProcNote({ title, text, hex }: { title: string; text: string; hex: string }) {
  return (
    <Reveal className="my-6">
      <div className="flex items-start sm:items-center gap-4 border-[3px] border-ink bg-white p-4 sm:p-5 shadow-[5px_5px_0_rgba(20,33,61,0.85)]">
        <svg viewBox="0 0 40 40" className="w-10 h-10 shrink-0" aria-hidden="true">
          <circle cx="20" cy="20" r="17" fill={hex} opacity="0.18" stroke="#14213d" strokeWidth="2.4" />
          <path d="M12 20h14m0 0-6-6m6 6-6 6" fill="none" stroke="#14213d" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="text-base sm:text-lg font-semibold leading-snug">
          <span className="font-display uppercase tracking-wide block text-lg" style={{ color: hex }}>{title}</span>
          {text}
        </p>
      </div>
    </Reveal>
  );
}

/* ================= checklist interactivo ================= */

function EmbalajeChecklist() {
  const [done, setDone] = useState<boolean[]>(() => embalajeChecklist.map(() => false));
  const count = done.filter(Boolean).length;
  const all = count === embalajeChecklist.length;
  return (
    <div className="relative border-[3px] border-ink bg-white shadow-[7px_7px_0_rgba(20,33,61,0.9)] p-5 sm:p-7">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h4 className="font-display text-2xl uppercase text-ink">Lista de verificación del cierre</h4>
        <span className="font-display text-lg text-red">{count}/{embalajeChecklist.length}</span>
      </div>
      <div className="mt-3 h-3 border-2 border-ink bg-paper-2">
        <div className="h-full bg-red transition-all duration-500" style={{ width: `${(count / embalajeChecklist.length) * 100}%` }} />
      </div>
      <ul className="mt-5 space-y-2.5">
        {embalajeChecklist.map((item, i) => (
          <li key={i}>
            <button
              onClick={() => setDone((d) => d.map((v, vi) => (vi === i ? !v : v)))}
              className={`w-full flex items-start gap-3.5 text-left border-2 border-ink px-3.5 py-3 transition-all duration-300 cursor-pointer ${
                done[i] ? "bg-red-soft" : "bg-white hover:bg-paper-2 hover:translate-x-1"
              }`}
            >
              <span
                className={`mt-0.5 w-6 h-6 shrink-0 border-2 border-ink flex items-center justify-center transition-colors duration-300 ${
                  done[i] ? "bg-red" : "bg-white"
                }`}
              >
                {done[i] && (
                  <svg viewBox="0 0 16 16" className="w-4 h-4" aria-hidden="true">
                    <path d="m3 8 3.5 3.5L13 4.5" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span className={`text-[15px] sm:text-base font-semibold leading-snug ${done[i] ? "line-through decoration-red decoration-2 text-ink-soft" : "text-ink"}`}>
                {item}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div
        className={`pointer-events-none absolute -right-3 -bottom-6 transition-all duration-500 ${
          all ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-50 rotate-0"
        }`}
      >
        <div className="font-display text-2xl text-red border-4 border-red px-4 py-1.5 tracking-[0.14em] uppercase bg-white/90">
          Paquete listo
        </div>
      </div>
    </div>
  );
}

/* ================= App ================= */

export default function App() {
  const active = useActiveSection(STAGES.map((s) => s.id));
  const podcast = usePodcast();

  return (
    <div className="grain bg-white text-ink min-h-screen">
      <TopPlayerBar p={podcast} />

      {/* ---------- masthead ---------- */}
      <div className="border-b-2 border-ink bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between py-2 text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em] text-ink-soft">
          <span>Edición especial · Material informativo para MJRV</span>
          <span className="hidden sm:block">Ecuador · Domingo de elecciones 2027</span>
        </div>
      </div>
      <div className="bg-red border-b-[3px] border-ink">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between gap-4 py-3">
          <a href="#portada" className="font-display text-white text-xl sm:text-2xl tracking-[0.06em] uppercase leading-none">
            El manual de la JRV
          </a>
          <span className="text-white/90 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-right">
            Guía visual <span className="hidden sm:inline">· Sin logos oficiales</span>
          </span>
        </div>
      </div>

      {/* ---------- podcast protagonista ---------- */}
      <RadioHero p={podcast} />

      {/* ---------- portada ---------- */}
      <header id="portada" className="relative overflow-hidden border-b-[3px] border-ink">
        <div className="absolute inset-0 dots-bg opacity-[0.35] pointer-events-none" />
        <div className="absolute -left-16 top-24 w-64 h-64 rounded-full bg-blue-soft pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-10 sm:pt-16 pb-10">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            <div className="lg:col-span-6 xl:col-span-5">
              <Reveal>
                <p className="kicker text-red flex items-center gap-3">
                  <span className="w-10 h-[3px] bg-red inline-block" />
                  Elecciones Seccionales y CPCCS 2027
                </p>
              </Reveal>
              <MaskLines
                className="mt-5 font-display uppercase text-ink text-[64px] sm:text-[104px] xl:text-[128px] leading-[0.88]"
                lines={[
                  <>Tu voto<span className="text-red">,</span></>,
                  <>tu <span className="relative inline-block">decisión<span className="absolute left-0 -bottom-1 w-full h-[6px] bg-yellow -z-10" /></span><span className="text-blue">.</span></>,
                ]}
              />
              <Reveal delay={250}>
                <p className="mt-7 text-lg sm:text-[21px] leading-snug font-medium text-ink-soft max-w-xl">
                  La jornada electoral completa en <strong className="font-extrabold text-ink">cuatro etapas ilustradas</strong>: de la
                  instalación de la mesa al envío del paquete, con cada paso que siguen los miembros de la Junta Receptora del Voto.
                </p>
              </Reveal>
              <Reveal delay={350}>
                <div className="mt-8 flex flex-wrap gap-3">
                  {STAGES.map((s) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="group border-[3px] border-ink bg-white px-4 py-2.5 font-extrabold text-sm uppercase tracking-[0.1em] shadow-[4px_4px_0_rgba(20,33,61,0.9)] transition-all duration-300 hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
                    >
                      <span className="font-display mr-2 text-base" style={{ color: s.hex }}>{s.num}</span>
                      <span className="group-hover:underline decoration-[3px] underline-offset-4">{s.label}</span>
                    </a>
                  ))}
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-6 xl:col-span-7 relative">
              <Reveal delay={200}>
                <div className="ink-frame bg-white paper-edge relative z-10 transition-transform duration-500">
                  <CoverArt className="w-full h-auto block" />
                  <p className="border-t-[3px] border-ink px-4 py-2.5 text-sm italic font-medium text-ink-soft bg-paper-2">
                    Ilustración 01 — El instante decisivo: la papeleta deja la mano y la urna hace su trabajo.
                  </p>
                </div>
              </Reveal>
              <div className="absolute -left-6 sm:-left-10 -bottom-8 z-20 w-32 sm:w-40">
                <RotaryStamp className="w-full h-auto drop-shadow-lg" />
              </div>
            </div>
          </div>

          {/* índice de la edición */}
          <div className="mt-16 sm:mt-20">
            <Reveal>
              <div className="flex items-center gap-4 mb-5">
                <h2 className="font-display text-2xl sm:text-3xl uppercase text-ink">En esta edición</h2>
                <span className="flex-1 h-[3px] bg-ink" />
                <span className="kicker text-ink-soft">Las 4 etapas</span>
              </div>
            </Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 border-[3px] border-ink bg-white divide-x-0 sm:divide-x-[3px] divide-y-[3px] sm:divide-y-0 divide-ink shadow-[7px_7px_0_rgba(20,33,61,0.9)]">
              {STAGES.map((s, i) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="group relative p-5 overflow-hidden transition-colors duration-300"
                  style={{ backgroundColor: `${s.hex}10`, ["--stage" as string]: s.hex }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = s.hex)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = `${s.hex}10`)}
                >
                  <span className="font-display idx-num text-6xl leading-none block">
                    {s.num}
                  </span>
                  <span className="mt-3 block font-display text-xl uppercase leading-tight text-ink group-hover:text-white transition-colors duration-300">
                    {s.title}
                  </span>
                  <span className="mt-2 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-ink-soft group-hover:text-white/90 transition-colors duration-300">
                    <span className="w-2 h-2" style={{ backgroundColor: s.hex }} />
                    {s.time}
                    <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" aria-hidden="true">
                      <path d="M2 8h11m0 0-4.5-4.5M13 8l-4.5 4.5" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </header>

      <Ticker items={TICKER} />
      <StageNav stages={STAGES.map(({ id, num, label, hex, soft }) => ({ id, num, label, hex, soft }))} active={active} />

      <main>
        {/* ================= ETAPA 1 · INSTALACIÓN ================= */}
        <section id="instalacion" className="scroll-mt-16 border-b-[3px] border-ink bg-white relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-2.5" style={{ backgroundColor: NAVY }} />
          <StageHeader s={STAGES[0]} art={<InstalacionArt className="w-full h-auto block" />} />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-20">
            {instalacionSteps.map((st, i) => (
              <StepRow key={st.n} step={st} hex={NAVY} soft="#e2e9f7" i={i} />
            ))}

            <SubHead label="Paso 9 · En orden" title="Los cuatro puestos de la mesa" hex={NAVY} />
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-6">
              {rolesMJRV.map((r, i) => (
                <Reveal key={r.orden} delay={i * 90}>
                  <div className="group h-full border-[3px] border-ink bg-white shadow-[5px_5px_0_rgba(20,33,61,0.9)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[8px_8px_0_rgba(15,43,102,0.9)]">
                    <div className="flex items-center justify-between border-b-[3px] border-ink px-4 py-2.5" style={{ backgroundColor: "#e2e9f7" }}>
                      <span className="font-display text-2xl text-ink">Puesto {r.orden}</span>
                      <span className="font-display text-navy num-outline-thin text-4xl group-hover:text-navy transition-colors duration-300">{r.orden}</span>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="w-11 h-11 border-2 border-ink bg-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Icon name={r.icon} className="w-7 h-7" />
                        </span>
                        <h4 className="font-display text-2xl uppercase text-navy">{r.rol}</h4>
                      </div>
                      <p className="mt-3 text-[15px] font-semibold leading-snug text-ink-soft">{r.material}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal className="mt-8">
              <p className="inline-flex items-center gap-3 bg-navy text-white font-bold px-5 py-3 border-[3px] border-ink shadow-[5px_5px_0_rgba(20,33,61,0.9)]">
                <Icon name="boton" className="w-7 h-7" />
                Todos con el botón identificativo visible antes de receptar el primer voto.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ================= ETAPA 2 · VOTACIÓN ================= */}
        <section id="votacion" className="scroll-mt-16 border-b-[3px] border-ink relative overflow-hidden" style={{ backgroundColor: "#eef4fd" }}>
          <div className="absolute inset-x-0 top-0 h-2.5" style={{ backgroundColor: BLUE }} />
          <div className="absolute inset-0 dots-bg opacity-25 pointer-events-none" />
          <div className="relative">
            <StageHeader s={STAGES[1]} art={<VotacionArt className="w-full h-auto block" />} />
            <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-20">
              {votacionSteps.map((st, i) => (
                <StepRow key={st.n} step={st} hex={BLUE} soft="#dce8fb" i={i} />
              ))}

              <div className="grid lg:grid-cols-3 gap-6 mt-12">
                {votacionAlertas.map((a, i) => (
                  <div key={a.title} style={{ transitionDelay: `${i * 90}ms` }}>
                    <Callout icon={a.icon} title={a.title} text={a.text} hex={RED} soft="#fbe4de" tag={["OJO", "PROHIBIDO", "FALTA"][i]} />
                  </div>
                ))}
              </div>

              <SubHead label="Inclusión" title="Mecanismos de acceso al voto" hex={BLUE} />
              <Reveal>
                <p className="mt-5 text-base sm:text-lg font-medium text-ink-soft max-w-3xl">
                  Medidas implementadas por el Consejo Nacional Electoral el día de las votaciones:
                </p>
              </Reveal>
              <div className="mt-6 border-[3px] border-ink bg-white divide-y-[3px] divide-ink shadow-[6px_6px_0_rgba(20,33,61,0.9)]">
                {inclusionMecanismos.map((m, i) => (
                  <Reveal key={m.title} delay={i * 90}>
                    <div className="group flex flex-col sm:flex-row sm:items-center gap-4 p-5 transition-colors duration-300 hover:bg-blue-soft">
                      <span className="font-display num-outline-thin text-5xl leading-none w-14 shrink-0 text-blue group-hover:text-blue">
                        {i + 1}
                      </span>
                      <span className="w-14 h-14 border-2 border-ink bg-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <Icon name={m.icon} className="w-9 h-9" />
                      </span>
                      <div>
                        <h4 className="font-display text-xl sm:text-2xl uppercase text-blue leading-tight">{m.title}</h4>
                        <p className="text-[15px] sm:text-base font-medium text-ink-soft leading-snug mt-1">{m.text}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>

              <SubHead label="Voto sin barreras" title="Recepción del voto en la MAP" hex={FUCSIA} />
              <Reveal>
                <p className="mt-4 mb-2 text-base sm:text-lg font-medium text-ink-soft max-w-3xl">
                  La Mesa de Atención Preferente lleva la junta hasta el elector que no puede trasladarse a ella:
                </p>
              </Reveal>
              {mapSteps.map((st, i) => (
                <StepRow key={st.n} step={st} hex={FUCSIA} soft="#fbe7f3" i={i} />
              ))}
              <div className="mt-8">
                <Callout icon="braille" title={brailleNota.title} text={brailleNota.text} hex={FUCSIA} soft="#fbe7f3" tag="BRAILLE" />
              </div>
            </div>
          </div>
        </section>

        {/* ================= ETAPA 3 · ESCRUTINIO ================= */}
        <section id="escrutinio" className="scroll-mt-16 border-b-[3px] border-ink relative overflow-hidden" style={{ backgroundColor: "#fefaf0" }}>
          <div className="absolute inset-x-0 top-0 h-2.5" style={{ backgroundColor: YELLOW }} />
          <div className="relative">
            <StageHeader s={STAGES[2]} art={<EscrutinioArt className="w-full h-auto block" />} />
            <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-20">
              <div className="mb-6">
                <Callout icon="reloj" title="Cierre de la votación" text={escrutinioIntro} hex={YELLOW} soft="#fdf1d2" tag="17:00" />
              </div>

              <SubHead label="Fase A" title="Preparación del escrutinio" hex={YELLOW} />
              {escrutinioGeneral.map((st, i) => (
                <StepRow key={st.n} step={st} hex={YELLOW} soft="#fdf1d2" i={i} />
              ))}

              <SubHead label="Fase B" title="Escrutinio de alcalde" hex={YELLOW} />
              {escrutinioAlcalde.slice(0, 3).map((st, i) => (
                <StepRow key={st.n} step={{ ...st, bullets: st.n === "10" ? undefined : st.bullets }} hex={YELLOW} soft="#fdf1d2" i={i} />
              ))}
              <VoteClassifier />
              <div className="mb-4">
                <Callout icon="exhibir" title="Delegados acreditados" text={notaDelegados} hex={YELLOW} soft="#fdf1d2" tag="DELEGADOS" />
              </div>
              {escrutinioAlcalde.slice(3).map((st, i) => (
                <StepRow key={st.n} step={st} hex={YELLOW} soft="#fdf1d2" i={i + 3} />
              ))}

              <SubHead label="Fase C" title="Prefectos, concejales y vocales rurales" hex={YELLOW} />
              <ProcNote
                title="Mismo procedimiento"
                text="Realice el escrutinio de estas dignidades igual al procedimiento de la dignidad de alcalde."
                hex={YELLOW}
              />

              <SubHead label="Fase D" title="Consejeras y consejeros del CPCCS" hex={YELLOW} />
              <div className="mt-6 mb-2">
                <Callout icon="lista" title="Orden del conteo CPCCS" text={cpccsOrden} hex={YELLOW} soft="#fdf1d2" tag="ORDEN" />
              </div>

              <Reveal className="mt-10 mb-2">
                <div className="flex items-center gap-4">
                  <span className="font-display bg-yellow text-ink border-[3px] border-ink px-4 py-2 text-lg sm:text-2xl uppercase tracking-wide shadow-[4px_4px_0_rgba(20,33,61,0.9)]">
                    Representantes de mujeres
                  </span>
                  <span className="flex-1 h-[3px] bg-ink" />
                </div>
              </Reveal>
              {cpccsMujeres.map((st, i) => (
                <StepRow key={st.n} step={st} hex={YELLOW} soft="#fdf1d2" i={i} />
              ))}

              <div className="grid lg:grid-cols-2 gap-6 mt-10">
                <ProcNote
                  title="Representantes de hombres"
                  text="Realice el escrutinio de esta dignidad igual al procedimiento de representantes de mujeres para el CPCCS."
                  hex={YELLOW}
                />
                <ProcNote
                  title="Pueblos y nacionalidades, afroecuatorianos, montubios y exterior"
                  text="Realice el escrutinio de esta dignidad igual al procedimiento de alcalde."
                  hex={YELLOW}
                />
              </div>

              <Reveal className="mt-8">
                <div className="border-[3px] border-ink bg-white shadow-[6px_6px_0_rgba(20,33,61,0.9)] p-5 sm:p-6">
                  <span className="font-display bg-ink text-white px-3 py-1 text-sm tracking-[0.16em] uppercase">Al finalizar el escrutinio de CPCCS</span>
                  <ul className="mt-4 space-y-3">
                    {cpccsCierre.map((c, i) => (
                      <li key={i} className="flex items-start gap-3 text-base sm:text-lg font-semibold">
                        <svg viewBox="0 0 20 20" className="w-6 h-6 shrink-0 mt-0.5" aria-hidden="true">
                          <rect x="2" y="2" width="16" height="16" fill="#fdf1d2" stroke="#14213d" strokeWidth="2" />
                          <path d="m5.5 10 3 3 6-6.5" fill="none" stroke="#c77f00" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ================= ETAPA 4 · EMBALAJE Y ENVÍO ================= */}
        <section id="embalaje" className="scroll-mt-16 relative overflow-hidden" style={{ backgroundColor: "#fdf3f0" }}>
          <div className="absolute inset-x-0 top-0 h-2.5" style={{ backgroundColor: RED }} />
          <div className="relative">
            <StageHeader s={STAGES[3]} art={<EmbalajeArt className="w-full h-auto block" />} />
            <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-24">
              <div className="grid lg:grid-cols-2 gap-8 items-start">
                <div>
                  <SubHead label="Sobres azules C" title="Documentos de la JRV" hex={RED} />
                  <div className="border-[3px] border-ink bg-white divide-y-[3px] divide-ink shadow-[6px_6px_0_rgba(20,33,61,0.9)] mt-6">
                    {sobresAzules.map((s, i) => (
                      <Reveal key={s.sobre} delay={i * 90}>
                        <div className="group flex items-center gap-4 p-4 sm:p-5 hover:bg-blue-soft transition-colors duration-300">
                          <span className="relative w-16 h-12 shrink-0 border-[3px] border-ink bg-blue flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                            <svg viewBox="0 0 64 48" className="absolute inset-0 w-full h-full" aria-hidden="true">
                              <path d="M2 4l30 22L62 4" fill="none" stroke="#fff" strokeWidth="3" />
                            </svg>
                            <span className="font-display text-white text-lg relative z-10 mt-3">{s.sobre}</span>
                          </span>
                          <p className="text-[15px] sm:text-base font-semibold leading-snug">{s.contenido}</p>
                        </div>
                      </Reveal>
                    ))}
                    <Reveal delay={280}>
                      <div className="flex items-center gap-3 p-4 sm:p-5 bg-red text-white">
                        <Icon name="entrega" className="w-8 h-8 [&_*]:stroke-white" />
                        <p className="font-extrabold uppercase tracking-wide text-sm sm:text-base">
                          Entregue los sobres azules al coordinador de mesa
                        </p>
                      </div>
                    </Reveal>
                  </div>

                  <Reveal className="mt-8">
                    <div className="flex items-center gap-3">
                      <h4 className="font-display text-xl sm:text-2xl uppercase text-ink">Mapa de sobres</h4>
                      <span className="flex-1 h-[3px] bg-ink" />
                    </div>
                  </Reveal>
                  <div className="flex flex-wrap gap-2.5 mt-4">
                    {leyendaSobres.map((l, i) => (
                      <Reveal key={l.codigo} delay={i * 60}>
                        <span className={`inline-flex items-center gap-2.5 border-[3px] border-ink px-3 py-1.5 shadow-[3px_3px_0_rgba(20,33,61,0.85)] ${l.clase}`}>
                          <span className="font-display tracking-wide">{l.codigo}</span>
                          <span className="text-[11px] font-bold uppercase tracking-[0.08em] opacity-80">{l.detalle}</span>
                        </span>
                      </Reveal>
                    ))}
                  </div>
                </div>

                <div className="lg:pt-[74px]">
                  <EmbalajeChecklist />
                  <Reveal className="mt-10">
                    <div className="flex items-start gap-4 border-[3px] border-ink bg-white p-5 shadow-[5px_5px_0_rgba(20,33,61,0.85)]">
                      <Icon name="flujograma" className="w-10 h-10 shrink-0" />
                      <p className="text-[15px] sm:text-base font-semibold leading-snug">
                        <span className="font-display uppercase block text-red text-lg tracking-wide">Última revisión</span>
                        Guíese en el flujograma de material electoral que se encuentra en el paquete electoral y verifique que todos
                        los documentos y materiales estén guardados y entregados.
                      </p>
                    </div>
                  </Reveal>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ---------- footer ---------- */}
      <footer className="bg-navy text-white border-t-[3px] border-ink relative overflow-hidden">
        <span
          aria-hidden="true"
          className="font-display absolute -right-6 -bottom-10 text-[220px] sm:text-[320px] leading-none text-white opacity-[0.06] select-none"
        >
          2027
        </span>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-14">
          <MaskLines
            className="font-display uppercase text-4xl sm:text-6xl xl:text-7xl leading-[0.92]"
            lines={[
              <>Tu voto<span className="text-yellow">,</span></>,
              <>tu decisión<span className="text-red">.</span></>,
            ]}
          />
          <div className="mt-10 grid sm:grid-cols-3 gap-8 border-t-2 border-white/20 pt-8">
            <div>
              <h4 className="kicker text-yellow mb-4">Las cuatro etapas</h4>
              <ul className="space-y-2.5">
                {STAGES.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="link-sweep font-bold text-white/90 hover:text-white">
                      <span className="font-display mr-2" style={{ color: s.hex === YELLOW ? "#f5a800" : s.hex === NAVY ? "#4f7de0" : s.hex }}>{s.num}</span>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="kicker text-yellow mb-4">Horarios de la jornada</h4>
              <ul className="space-y-2.5 text-white/90 font-semibold">
                <li className="flex gap-3"><span className="font-display text-blue-mid w-24 shrink-0">06:30</span> Instalación de la JRV</li>
                <li className="flex gap-3"><span className="font-display text-blue-mid w-24 shrink-0">07–17</span> Votación</li>
                <li className="flex gap-3"><span className="font-display text-yellow w-24 shrink-0">17:00</span> Escrutinio hasta finalizar</li>
                <li className="flex gap-3"><span className="font-display text-red w-24 shrink-0">Cierre</span> Embalaje y envío</li>
              </ul>
            </div>
            <div>
              <h4 className="kicker text-yellow mb-4">Colofón</h4>
              <p className="text-sm leading-relaxed text-white/75 font-medium">
                Documento informativo de referencia ciudadana. No utiliza logos ni símbolos oficiales de ninguna institución.
                Compuesto en Anton y Archivo, con ilustraciones editoriales propias de trazo y tramado.
              </p>
            </div>
          </div>
          <div className="mt-10 pt-5 border-t-2 border-white/20 flex flex-wrap items-center justify-between gap-3 text-xs font-bold uppercase tracking-[0.16em] text-white/60">
            <span>El manual de la JRV · Edición 2027</span>
            <span className="flex items-center gap-2">
              <svg viewBox="0 0 16 16" className="w-3 h-3" aria-hidden="true">
                <path d="M8 0l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="#f5a800" />
              </svg>
              Elecciones Seccionales y CPCCS
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
