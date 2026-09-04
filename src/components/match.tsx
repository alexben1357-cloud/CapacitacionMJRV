import { useState, type DragEvent } from "react";

/* =============== Prácticas visuales: actas y sobres ===============
   Banco de 7 dinámicas. El quiz sortea 3 por sesión y las mezcla con las
   preguntas de opción múltiple. Cada dinámica: arrastrar (o tocar) el
   documento hasta su sobre/destino correcto, siguiendo los tres flujos:
   T → Coordinador de Mesa · P → Paquete Electoral · C → CPE.            */

const INK = "#14213d";
const s2 = { stroke: INK, strokeWidth: 2.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

/* ---------- documentos ---------- */

function ActaSvg({ code, franja, titulo }: { code: string; franja: string; titulo: string }) {
  return (
    <svg viewBox="0 0 150 190" className="h-full w-auto mx-auto" role="img" aria-label={`Acta ${code}`}>
      <rect x="8" y="6" width="134" height="178" fill="#ffffff" {...s2} />
      <rect x="8" y="6" width="26" height="178" fill={franja} stroke={INK} strokeWidth="2" />
      <text x="21" y="98" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="15" fill="#ffffff" transform="rotate(-90 21 98)">
        {code}
      </text>
      <text x="90" y="34" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="14" fill={INK}>
        ACTA DE
      </text>
      <text x="90" y="52" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="14" fill={INK}>
        {titulo}
      </text>
      <line x1="44" y1="62" x2="132" y2="62" stroke={INK} strokeWidth="1.6" opacity="0.45" />
      {[76, 90, 104, 118, 132].map((y) => (
        <line key={y} x1="44" y1={y} x2="132" y2={y} stroke={INK} strokeWidth="1.4" opacity="0.22" />
      ))}
      <path d="M52 158c8-8 14 4 22-3s12 2 20-3" fill="none" stroke="#1d4fc4" strokeWidth="2.2" />
      <text x="90" y="176" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="19" fill={INK}>
        {code}
      </text>
    </svg>
  );
}

function BorradorSvg() {
  return (
    <svg viewBox="0 0 150 190" className="h-full w-auto mx-auto" role="img" aria-label="Borrador de escrutinio">
      <rect x="8" y="6" width="134" height="178" fill="#ffffff" {...s2} />
      <rect x="8" y="6" width="26" height="178" fill="#8a93a6" stroke={INK} strokeWidth="2" />
      <text x="21" y="98" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="11" fill="#ffffff" transform="rotate(-90 21 98)">
        BORRADOR
      </text>
      <text x="90" y="30" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="13" fill={INK}>
        BORRADOR DE
      </text>
      <text x="90" y="47" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="13" fill={INK}>
        ESCRUTINIO
      </text>
      {[64, 92, 120].map((y) =>
        [52, 80, 108].map((x) => (
          <rect key={`${x}${y}`} x={x} y={y} width="20" height="20" fill="none" stroke={INK} strokeWidth="1.5" />
        ))
      )}
      <line x1="56" y1="70" x2="56" y2="80" stroke="#1d4fc4" strokeWidth="2.2" />
      <line x1="62" y1="70" x2="62" y2="80" stroke="#1d4fc4" strokeWidth="2.2" />
      <line x1="68" y1="70" x2="68" y2="80" stroke="#1d4fc4" strokeWidth="2.2" />
      <line x1="52" y1="80" x2="72" y2="70" stroke="#1d4fc4" strokeWidth="2.2" />
      <path d="M50 156c8-7 14 4 22-3s12 2 20-3" fill="none" stroke="#1d4fc4" strokeWidth="2" />
    </svg>
  );
}

function PapeletaSvg({ usada }: { usada: boolean }) {
  return (
    <svg viewBox="0 0 150 190" className="h-full w-auto mx-auto" role="img" aria-label={usada ? "Papeletas utilizadas" : "Papeletas no utilizadas"}>
      <rect x="8" y="6" width="134" height="178" fill="#ffffff" {...s2} />
      <rect x="8" y="6" width="134" height="26" fill="#dce8fb" stroke={INK} strokeWidth="2" />
      <text x="75" y="25" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="13" fill={INK}>
        PAPELETAS
      </text>
      {[48, 78, 108, 138].map((y, i) => (
        <g key={y}>
          <rect x="18" y={y - 9} width="18" height="18" fill={i === 1 ? "#dce8fb" : "#ffffff"} stroke={INK} strokeWidth="1.8" />
          <line x1="46" y1={y} x2="100" y2={y} stroke={INK} strokeWidth="1.6" opacity="0.4" />
          <rect x="112" y={y - 8} width="16" height="16" fill="#ffffff" stroke={INK} strokeWidth="1.8" />
        </g>
      ))}
      {usada ? (
        <path d="m113 76 5 5 10-11" fill="none" stroke="#1d4fc4" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <>
          <path d="M8 6l10 10L8 26l10 10L8 46l10 10L8 66l10 10L8 86l10 10L8 106l10 10L8 126l10 10L8 146l10 10L8 166l10 10L8 184" fill="none" stroke="#ffffff" strokeWidth="4" />
          <path d="M8 6l10 10L8 26l10 10L8 46l10 10L8 66l10 10L8 86l10 10L8 106l10 10L8 126l10 10L8 146l10 10L8 166l10 10L8 184" fill="none" stroke={INK} strokeWidth="1.6" />
          <g transform="rotate(-14 75 110)">
            <rect x="34" y="96" width="84" height="30" fill="none" stroke="#d0311f" strokeWidth="2.4" />
            <text x="76" y="117" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="15" fill="#d0311f">
              MUTILADAS
            </text>
          </g>
        </>
      )}
    </svg>
  );
}

function PaqueteSvg() {
  return (
    <svg viewBox="0 0 170 150" className="h-full w-auto mx-auto" role="img" aria-label="Paquete electoral">
      <rect x="10" y="26" width="150" height="104" fill="#dce8fb" {...s2} />
      <rect x="10" y="26" width="150" height="22" fill="#1d4fc4" />
      <rect x="76" y="26" width="18" height="104" fill="#0f2b66" />
      <line x1="10" y1="86" x2="160" y2="86" stroke={INK} strokeWidth="1.6" strokeDasharray="5 5" />
      <circle cx="46" cy="86" r="17" fill="#d0311f" stroke={INK} strokeWidth="2" />
      <path d="m39 86 5 5 10-11" fill="none" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <text x="118" y="116" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="12" fill="#0f2b66">
        PAQUETE ELECTORAL
      </text>
    </svg>
  );
}

/* ---------- sobres ---------- */

function SobreSvg({ code, body, lid, inkOn }: { code: string; body: string; lid: string; inkOn: string }) {
  return (
    <svg viewBox="0 0 170 130" className="h-full w-auto mx-auto" role="img" aria-label={`Sobre ${code}`}>
      <rect x="8" y="34" width="154" height="88" fill={body} {...s2} />
      <polygon points="8,34 162,34 85,96" fill={lid} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      <rect x="126" y="44" width="22" height="16" fill="#ffffff" stroke={INK} strokeWidth="1.8" />
      <circle cx="137" cy="52" r="4" fill="none" stroke="#d0311f" strokeWidth="1.6" />
      <text x="85" y="114" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="21" fill={inkOn}>
        SOBRE {code}
      </text>
    </svg>
  );
}

const YL = "#f5a800";
const YLD = "#c77f00";
const BL = "#1d4fc4";
const BLN = "#0f2b66";
const RD = "#d0311f";

/* ---------- banco de 7 dinámicas ---------- */

export interface DynItem {
  id: string;
  name: string;
  svg: string;
}
export interface DynTarget {
  accepts: string;
  label: string;
  svg: string;
}
export interface DynamicSpec {
  id: string;
  title: string;
  desc: string;
  item: DynItem;
  targets: DynTarget[];
}

export const DYNAMICS: DynamicSpec[] = [
  {
    id: "t1",
    title: "Acta de escrutinio de alcalde, firmada y sellada",
    desc: "Su franja lateral es amarilla: es un acta de transmisión. Llévala a su sobre.",
    item: { id: "actaT1", name: "Acta T1 · Alcalde", svg: "actaT1" },
    targets: [
      { accepts: "actaT1", label: "Sobre amarillo T1", svg: "sobreT1" },
      { accepts: "__x__", label: "Sobre rojo P1", svg: "sobreP1" },
      { accepts: "__x__", label: "Paquete electoral", svg: "paquete" },
    ],
  },
  {
    id: "t5",
    title: "Actas de escrutinio de consejeras y consejeros del CPCCS",
    desc: "Franja amarilla, código T5: van a la transmisión, al Coordinador de Mesa.",
    item: { id: "actaT5", name: "Acta T5 · CPCCS", svg: "actaT5" },
    targets: [
      { accepts: "actaT5", label: "Sobre amarillo T5", svg: "sobreT5" },
      { accepts: "__x__", label: "Sobre amarillo T3", svg: "sobreT3" },
      { accepts: "__x__", label: "Sobre azul C1", svg: "sobreC1" },
    ],
  },
  {
    id: "p1",
    title: "Acta de escrutinio P1, con franja lateral roja",
    desc: "Es la copia física oficial: pertenece al flujo del paquete electoral.",
    item: { id: "actaP1", name: "Acta P1", svg: "actaP1" },
    targets: [
      { accepts: "actaP1", label: "Sobre rojo P1", svg: "sobreP1" },
      { accepts: "__x__", label: "Paquete electoral", svg: "paquete" },
      { accepts: "__x__", label: "Sobre azul C1", svg: "sobreC1" },
    ],
  },
  {
    id: "borrador",
    title: "Borrador de escrutinio con la cuadrícula de palotes",
    desc: "Franja lateral gris: no va a ningún sobre, tiene un destino directo.",
    item: { id: "borrador", name: "Borrador de escrutinio", svg: "borrador" },
    targets: [
      { accepts: "borrador", label: "Paquete electoral", svg: "paquete" },
      { accepts: "__x__", label: "Sobre rojo P1", svg: "sobreP1" },
      { accepts: "__x__", label: "Sobre amarillo T1", svg: "sobreT1" },
    ],
  },
  {
    id: "mutiladas",
    title: "Papeletas no utilizadas, ya mutiladas",
    desc: "Se rompieron parcialmente al cierre de la votación. ¿A qué sobre van?",
    item: { id: "mutiladas", name: "Papeletas no utilizadas", svg: "mutiladas" },
    targets: [
      { accepts: "mutiladas", label: "Sobre naranja P2", svg: "sobreP2" },
      { accepts: "__x__", label: "Sobre granate P3", svg: "sobreP3" },
      { accepts: "__x__", label: "Sobre azul C2", svg: "sobreC2" },
    ],
  },
  {
    id: "usadas",
    title: "Papeletas utilizadas: votos válidos, blancos y nulos",
    desc: "Ya escrutadas y clasificadas por dignidad. Dales su sobre del paquete.",
    item: { id: "usadas", name: "Papeletas utilizadas", svg: "usadas" },
    targets: [
      { accepts: "usadas", label: "Sobre granate P3", svg: "sobreP3" },
      { accepts: "__x__", label: "Sobre naranja P2", svg: "sobreP2" },
      { accepts: "__x__", label: "Sobre amarillo T1", svg: "sobreT1" },
    ],
  },
  {
    id: "c1",
    title: "Acta de instalación C1, con franja lateral azul",
    desc: "Resguardo legal de la mesa: viaja al Centro de Procesamiento Electoral.",
    item: { id: "actaC1", name: "Acta C1 · Instalación", svg: "actaC1" },
    targets: [
      { accepts: "actaC1", label: "Sobre azul C1", svg: "sobreC1" },
      { accepts: "__x__", label: "Sobre azul C3", svg: "sobreC3" },
      { accepts: "__x__", label: "Sobre amarillo T1", svg: "sobreT1" },
    ],
  },
];

/* ---------- render de svgs ---------- */

function DocSvg({ id }: { id: string }) {
  switch (id) {
    case "actaT1":
      return <ActaSvg code="T1" franja={YL} titulo="ESCRUTINIO" />;
    case "actaT5":
      return <ActaSvg code="T5" franja={YL} titulo="ESCRUTINIO" />;
    case "actaP1":
      return <ActaSvg code="P1" franja={RD} titulo="ESCRUTINIO" />;
    case "actaC1":
      return <ActaSvg code="C1" franja={BL} titulo="INSTALACIÓN" />;
    case "borrador":
      return <BorradorSvg />;
    case "mutiladas":
      return <PapeletaSvg usada={false} />;
    case "usadas":
      return <PapeletaSvg usada />;
    default:
      return null;
  }
}

function TargetSvg({ id }: { id: string }) {
  switch (id) {
    case "sobreT1":
      return <SobreSvg code="T1" body={YL} lid={YLD} inkOn={INK} />;
    case "sobreT3":
      return <SobreSvg code="T3" body={YL} lid={YLD} inkOn={INK} />;
    case "sobreT5":
      return <SobreSvg code="T5" body={YL} lid={YLD} inkOn={INK} />;
    case "sobreP1":
      return <SobreSvg code="P1" body={RD} lid="#a12415" inkOn="#ffffff" />;
    case "sobreP2":
      return <SobreSvg code="P2" body="#f2762e" lid="#d95c12" inkOn="#ffffff" />;
    case "sobreP3":
      return <SobreSvg code="P3" body="#8e3a30" lid="#6d2a22" inkOn="#ffffff" />;
    case "sobreC1":
      return <SobreSvg code="C1" body={BL} lid={BLN} inkOn="#ffffff" />;
    case "sobreC2":
      return <SobreSvg code="C2" body={BL} lid={BLN} inkOn="#ffffff" />;
    case "sobreC3":
      return <SobreSvg code="C3" body={BL} lid={BLN} inkOn="#ffffff" />;
    case "paquete":
      return <PaqueteSvg />;
    default:
      return null;
  }
}

/* ---------- chips: código por franja lateral ---------- */

const CHIPS: Array<[string, string]> = [
  ["#f5a800", "Amarilla → sobre T"],
  ["#d0311f", "Roja → sobre P1"],
  ["#1d4fc4", "Azul → sobre C1"],
  ["#8a93a6", "Gris → paquete"],
];

function Chuleta() {
  return (
    <div className="flex flex-wrap gap-2">
      {CHIPS.map(([c, t]) => (
        <span
          key={t}
          className="inline-flex items-center gap-1.5 border-2 border-ink bg-white px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-ink"
        >
          <span className="w-2.5 h-2.5 border border-ink" style={{ backgroundColor: c }} />
          {t}
        </span>
      ))}
    </div>
  );
}

function FranjaHint({ item }: { item: DynItem }) {
  if (item.svg.startsWith("actaT")) return <>Pista: franja <strong>amarilla</strong> → sobres T de transmisión.</>;
  if (item.svg === "actaP1") return <>Pista: franja <strong>roja</strong> → sobre P1 del paquete.</>;
  if (item.svg === "actaC1") return <>Pista: franja <strong>azul</strong> → sobre C1 para el CPE.</>;
  if (item.svg === "borrador") return <>Pista: franja <strong>gris</strong> → directo al paquete, sin sobre.</>;
  if (item.svg === "mutiladas") return <>Pista: las no utilizadas van al sobre <strong>P2</strong>.</>;
  return <>Pista: las utilizadas van al sobre <strong>P3</strong>.</>;
}

/* ---------- una dinámica individual ---------- */

export function MatchItem({
  dyn,
  onResolved,
}: {
  dyn: DynamicSpec;
  onResolved: (earned: boolean) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const [selected, setSelected] = useState(false);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [sealed, setSealed] = useState(false);
  const [errored, setErrored] = useState(false);

  const accepted = dyn.targets.find((t) => t.accepts === dyn.item.id);

  const tryTarget = (t: DynTarget) => {
    if (sealed) return;
    if (t.accepts === dyn.item.id) {
      setSealed(true);
      setSelected(false);
      setDragging(false);
      onResolved(!errored);
    } else {
      setErrored(true);
      setWrongId(t.accepts);
      setSelected(false);
      window.setTimeout(() => setWrongId(null), 650);
    }
  };

  return (
    <div>
      <h3 className="text-xl sm:text-2xl font-extrabold leading-snug text-ink">{dyn.title}</h3>
      <p className="mt-2 text-[15px] sm:text-base font-medium text-ink-soft">{dyn.desc}</p>

      <div className="mt-4">
        <Chuleta />
      </div>

      <div className="mt-6 grid lg:grid-cols-[240px_1fr] gap-6 items-start">
        {/* documento a mover */}
        <div>
          <div
            draggable={!sealed}
            onDragStart={(e: DragEvent<HTMLDivElement>) => {
              e.dataTransfer.setData("text/plain", dyn.item.id);
              e.dataTransfer.effectAllowed = "move";
              setDragging(true);
            }}
            onDragEnd={() => setDragging(false)}
            onClick={() => !sealed && setSelected((v) => !v)}
            role="button"
            aria-label={`Mover ${dyn.item.name} a su destino`}
            className={`relative h-52 border-[3px] border-ink bg-white p-3 shadow-[6px_6px_0_rgba(20,33,61,0.9)] transition-all duration-300 ${
              sealed
                ? "opacity-50"
                : "cursor-grab active:cursor-grabbing hover:-translate-y-1 hover:shadow-[9px_9px_0_rgba(20,33,61,0.9)]"
            } ${dragging ? "opacity-40" : ""} ${selected && !sealed ? "-translate-y-1 ring-4 ring-blue" : ""}`}
          >
            <DocSvg id={dyn.item.svg} />
            {sealed && (
              <span className="absolute top-2 right-2 font-display text-xs tracking-[0.14em] bg-blue text-white border-2 border-ink px-2 py-0.5">
                ENVIADO ✓
              </span>
            )}
          </div>
          <p className="mt-3 text-center text-[15px] font-extrabold text-ink">{dyn.item.name}</p>
          <p className="mt-1 text-center text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft">
            {selected ? "Ahora toca su destino ↓" : "Arrástralo · o tócalo y toca el destino"}
          </p>
        </div>

        {/* destinos */}
        <div className="grid sm:grid-cols-3 gap-3.5">
          {dyn.targets.map((t) => {
            const isWrong = wrongId === t.accepts;
            const isAccepted = sealed && t.accepts === dyn.item.id;
            return (
              <div
                key={t.label}
                onDragOver={(e: DragEvent<HTMLDivElement>) => e.preventDefault()}
                onDrop={(e: DragEvent<HTMLDivElement>) => {
                  e.preventDefault();
                  setDragging(false);
                  tryTarget(t);
                }}
                onClick={() => selected && tryTarget(t)}
                className={`relative h-44 border-[3px] border-ink bg-white p-2.5 flex flex-col justify-between transition-all duration-300 ${
                  isWrong ? "border-red bg-red-soft shake" : ""
                } ${isAccepted ? "ring-4 ring-blue" : ""} ${
                  dragging || selected ? "border-dashed border-blue bg-blue-soft/60 cursor-pointer hover:bg-blue-soft" : ""
                }`}
              >
                <div className="h-[92px] flex items-end">
                  <TargetSvg id={t.svg} />
                </div>
                <p className="text-[12px] font-extrabold uppercase tracking-[0.06em] text-ink text-center leading-tight">
                  {t.label}
                </p>
                {isAccepted && (
                  <span className="absolute -top-3 -right-3 w-9 h-9 bg-blue border-[3px] border-ink flex items-center justify-center shadow-[3px_3px_0_rgba(20,33,61,0.9)]">
                    <svg viewBox="0 0 16 16" className="w-4 h-4" aria-hidden="true">
                      <path d="m3 8.5 3.5 3.5L13 5" fill="none" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* alertas en línea (sin sobreposición) */}
      {wrongId !== null && !sealed && (
        <div
          role="alert"
          className="mt-6 flex items-start gap-4 border-[3px] border-red bg-red-soft px-5 py-4 shadow-[6px_6px_0_rgba(208,49,31,0.55)]"
        >
          <span className="font-display text-2xl text-red leading-none pt-0.5" aria-hidden="true">✗</span>
          <div>
            <p className="font-display text-xl uppercase tracking-wide text-red">Destino equivocado</p>
            <p className="mt-1 text-[15px] font-semibold text-ink leading-snug">
              Vuelve a intentarlo. <FranjaHint item={dyn.item} />
            </p>
          </div>
        </div>
      )}
      {sealed && accepted && (
        <div
          role="status"
          className="mt-6 flex items-start gap-4 border-[3px] border-blue bg-blue-soft px-5 py-4 shadow-[6px_6px_0_rgba(29,79,196,0.55)]"
        >
          <span className="font-display text-2xl text-blue leading-none pt-0.5" aria-hidden="true">✓</span>
          <p className="text-[15px] font-extrabold text-navy leading-snug pt-1">
            {errored
              ? `Bien sellado, aunque con tropiezo: ${dyn.item.name} va al ${accepted.label.toLowerCase()}.`
              : `¡Perfecto! ${dyn.item.name} quedó sellado en ${accepted.label.toLowerCase()}.`}
          </p>
        </div>
      )}
    </div>
  );
}
