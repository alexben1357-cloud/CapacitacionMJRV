import { useState, type DragEvent } from "react";
import { Reveal } from "./bits";

/* =============== Ronda práctica: actas → sobres ===============
   7 ejercicios interactivos de arrastrar y soltar (con alternativa de
   tocar-seleccionar / tocar-colocar para pantallas táctiles).          */

/* ---------- paleta ---------- */
const INK = "#14213d";
const YELLOW = "#f5a800";
const BLUE = "#1d4fc4";
const RED = "#d0311f";
const P2C = "#e8762a";
const P3C = "#7d1a0f";
const GRIS = "#9aa5b8";

/* ---------- SVG: acta con franja lateral ---------- */

function ActaSVG({ stripe, code, title, className = "" }: { stripe: string; code: string; title: string; className?: string }) {
  return (
    <svg viewBox="0 0 120 156" className={className} aria-hidden="true">
      <rect x="8" y="6" width="104" height="144" fill="#ffffff" stroke={INK} strokeWidth="3" />
      <rect x="8" y="6" width="18" height="144" fill={stripe} stroke={INK} strokeWidth="3" />
      <text x="71" y="26" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="13" fill={INK}>
        ACTA
      </text>
      <text x="71" y="40" textAnchor="middle" fontFamily="Archivo, sans-serif" fontWeight="800" fontSize="9" letterSpacing="1" fill={INK}>
        {title}
      </text>
      <rect x="40" y="50" width="62" height="34" fill={stripe} stroke={INK} strokeWidth="2.4" />
      <text x="71" y="76" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="24" fill={INK}>
        {code}
      </text>
      <line x1="36" y1="96" x2="104" y2="96" stroke={INK} strokeWidth="2" opacity="0.5" />
      <line x1="36" y1="106" x2="104" y2="106" stroke={INK} strokeWidth="2" opacity="0.5" />
      <line x1="36" y1="116" x2="92" y2="116" stroke={INK} strokeWidth="2" opacity="0.5" />
      <path d="M36 136c8-8 12 4 20-4s12 4 22-3 14 3 20-2" fill="none" stroke={BLUE} strokeWidth="2.4" strokeLinecap="round" />
      <line x1="34" y1="142" x2="104" y2="142" stroke={INK} strokeWidth="2" />
    </svg>
  );
}

/* ---------- SVG: borrador de escrutinio (franja gris) ---------- */

function BorradorSVG({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 156" className={className} aria-hidden="true">
      <rect x="8" y="6" width="104" height="144" fill="#ffffff" stroke={INK} strokeWidth="3" />
      <rect x="8" y="6" width="18" height="144" fill={GRIS} stroke={INK} strokeWidth="3" />
      <text x="71" y="24" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="12" fill={INK}>
        BORRADOR
      </text>
      <text x="71" y="37" textAnchor="middle" fontFamily="Archivo, sans-serif" fontWeight="800" fontSize="8.5" letterSpacing="1" fill={INK}>
        DE ESCRUTINIO
      </text>
      <rect x="34" y="46" width="70" height="88" fill="none" stroke={INK} strokeWidth="2" />
      <line x1="34" y1="68" x2="104" y2="68" stroke={INK} strokeWidth="1.6" />
      <line x1="34" y1="90" x2="104" y2="90" stroke={INK} strokeWidth="1.6" />
      <line x1="34" y1="112" x2="104" y2="112" stroke={INK} strokeWidth="1.6" />
      {[44, 53, 62, 71].map((x, i) => (
        <line key={i} x1={x} y1="50" x2={x} y2="64" stroke={BLUE} strokeWidth="2.6" strokeLinecap="round" />
      ))}
      <line x1="40" y1="64" x2="74" y2="50" stroke={BLUE} strokeWidth="2.6" strokeLinecap="round" />
      {[44, 53].map((x, i) => (
        <line key={i} x1={x} y1="72" x2={x} y2="86" stroke={BLUE} strokeWidth="2.6" strokeLinecap="round" />
      ))}
      <text x="90" y="63" fontFamily="Anton, sans-serif" fontSize="13" fill={INK}>6</text>
      <text x="90" y="85" fontFamily="Anton, sans-serif" fontSize="13" fill={INK}>2</text>
      <path d="M36 144c7-6 11 3 18-3s11 3 19-3" fill="none" stroke={BLUE} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- SVG: papeletas (usadas / mutiladas) ---------- */

function PapeletasSVG({ used, className = "" }: { used: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 120 156" className={className} aria-hidden="true">
      <rect x="22" y="18" width="84" height="118" fill="#ffffff" stroke={INK} strokeWidth="2.4" />
      <rect x="14" y="12" width="84" height="118" fill="#ffffff" stroke={INK} strokeWidth="2.4" />
      {used ? (
        <g>
          <rect x="6" y="6" width="84" height="118" fill="#ffffff" stroke={INK} strokeWidth="3" />
          <rect x="6" y="6" width="84" height="20" fill="#dce8fb" stroke={INK} strokeWidth="2" />
          <text x="48" y="20" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="10" fill={INK}>PAPELETA</text>
          <rect x="14" y="34" width="14" height="14" fill="#ffffff" stroke={INK} strokeWidth="2" />
          <line x1="34" y1="41" x2="66" y2="41" stroke={INK} strokeWidth="2" opacity="0.5" />
          <rect x="72" y="34" width="12" height="14" fill="#ffffff" stroke={INK} strokeWidth="2" />
          <rect x="14" y="56" width="14" height="14" fill="#ffffff" stroke={INK} strokeWidth="2" />
          <line x1="34" y1="63" x2="66" y2="63" stroke={INK} strokeWidth="2" opacity="0.5" />
          <rect x="72" y="56" width="12" height="14" fill="#dce8fb" stroke={INK} strokeWidth="2" />
          <path d="m74 62 3.5 3.5 7-8" fill="none" stroke={BLUE} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="14" y="78" width="14" height="14" fill="#ffffff" stroke={INK} strokeWidth="2" />
          <line x1="34" y1="85" x2="66" y2="85" stroke={INK} strokeWidth="2" opacity="0.5" />
          <rect x="72" y="78" width="12" height="14" fill="#ffffff" stroke={INK} strokeWidth="2" />
          <text x="48" y="112" textAnchor="middle" fontFamily="Archivo, sans-serif" fontWeight="800" fontSize="8" letterSpacing="1" fill={BLUE}>
            UTILIZADAS
          </text>
        </g>
      ) : (
        <g>
          <path d="M6 6h84v86l-8 8 8 8-10 8 10 8H6z" fill="#ffffff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <rect x="6" y="6" width="84" height="20" fill="#fbe4de" stroke={INK} strokeWidth="2" />
          <text x="48" y="20" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="10" fill={INK}>PAPELETA</text>
          <line x1="14" y1="38" x2="82" y2="38" stroke={INK} strokeWidth="2" opacity="0.5" />
          <line x1="14" y1="50" x2="82" y2="50" stroke={INK} strokeWidth="2" opacity="0.5" />
          <line x1="14" y1="62" x2="60" y2="62" stroke={INK} strokeWidth="2" opacity="0.5" />
          <g transform="rotate(-14 48 86)">
            <rect x="12" y="74" width="72" height="24" fill="none" stroke={RED} strokeWidth="2.6" />
            <text x="48" y="91" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="13" letterSpacing="2" fill={RED}>
              MUTILADA
            </text>
          </g>
        </g>
      )}
    </svg>
  );
}

/* ---------- SVG: materiales (padrón / talonario) ---------- */

function MaterialSVG({ kind, className = "" }: { kind: "padron" | "talonario"; className?: string }) {
  if (kind === "padron") {
    return (
      <svg viewBox="0 0 120 156" className={className} aria-hidden="true">
        <path d="M18 14c14-7 26-7 42 0s28 7 42 0v118c-14 7-26 7-42 0s-28-7-42 0z" fill="#dce8fb" stroke={INK} strokeWidth="3" />
        <line x1="60" y1="17" x2="60" y2="135" stroke={INK} strokeWidth="2.4" />
        {[32, 46, 60, 74].map((y) => (
          <g key={y}>
            <line x1="26" y1={y} x2="52" y2={y} stroke={INK} strokeWidth="2" opacity="0.55" />
            <line x1="68" y1={y} x2="94" y2={y} stroke={INK} strokeWidth="2" opacity="0.55" />
          </g>
        ))}
        <path d="M70 96c6-7 12 0 6 6s0 12 6 8" fill="none" stroke={BLUE} strokeWidth="2.6" strokeLinecap="round" />
        <text x="60" y="150" textAnchor="middle" fontFamily="Archivo, sans-serif" fontWeight="800" fontSize="9" letterSpacing="1.4" fill={INK}>
          PADRÓN ELECTORAL
        </text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 156" className={className} aria-hidden="true">
      <rect x="20" y="10" width="80" height="112" fill="#fdf1d2" stroke={INK} strokeWidth="3" />
      <rect x="20" y="10" width="80" height="24" fill={YELLOW} stroke={INK} strokeWidth="2.4" />
      <text x="60" y="26" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="11" fill={INK}>CERTIFICADOS</text>
      {[46, 68, 90].map((y) => (
        <g key={y}>
          <rect x="28" y={y} width="64" height="16" fill="#ffffff" stroke={INK} strokeWidth="2" />
          <line x1="80" y1={y} x2="80" y2={y + 16} stroke={INK} strokeWidth="2" strokeDasharray="3 3" />
          <circle cx="38" cy={y + 8} r="4" fill="none" stroke={RED} strokeWidth="2" />
        </g>
      ))}
      <text x="60" y="150" textAnchor="middle" fontFamily="Archivo, sans-serif" fontWeight="800" fontSize="9" letterSpacing="1.4" fill={INK}>
        TALONARIO · C. VOTACIÓN
      </text>
    </svg>
  );
}

/* ---------- SVG: sobre ---------- */

export type SobreColor = "T" | "C" | "P1" | "P2" | "P3";

const SOBRE_FILL: Record<SobreColor, { fill: string; text: string; name: string }> = {
  T: { fill: YELLOW, text: INK, name: "Amarillo" },
  C: { fill: BLUE, text: "#ffffff", name: "Azul" },
  P1: { fill: RED, text: "#ffffff", name: "Rojo" },
  P2: { fill: P2C, text: INK, name: "Naranja" },
  P3: { fill: P3C, text: "#ffffff", name: "Granate" },
};

function SobreSVG({ color, code, className = "" }: { color: SobreColor; code: string; className?: string }) {
  const c = SOBRE_FILL[color];
  return (
    <svg viewBox="0 0 160 120" className={className} aria-hidden="true">
      <rect x="6" y="26" width="148" height="88" fill={c.fill} stroke={INK} strokeWidth="3.4" />
      <path d="M6 28 80 80l74-52" fill="none" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M6 112 58 76M154 112l-52-36" stroke={INK} strokeWidth="2.2" opacity="0.55" />
      <rect x="122" y="32" width="24" height="18" fill="#ffffff" stroke={INK} strokeWidth="2.2" />
      <text x="80" y="108" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="26" fill={c.text}>
        {code}
      </text>
    </svg>
  );
}

/* ---------- SVG: paquete electoral ---------- */

function PaqueteSVG({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 120" className={className} aria-hidden="true">
      <rect x="14" y="22" width="132" height="84" fill="#dce8fb" stroke={INK} strokeWidth="3.4" />
      <rect x="14" y="22" width="132" height="16" fill={BLUE} stroke={INK} strokeWidth="2.6" />
      <rect x="70" y="22" width="20" height="84" fill={INK} />
      <line x1="14" y1="66" x2="146" y2="66" stroke={INK} strokeWidth="2" strokeDasharray="6 5" />
      <circle cx="42" cy="66" r="15" fill={RED} stroke={INK} strokeWidth="2.6" />
      <circle cx="42" cy="66" r="9" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeDasharray="3 3" />
      <path d="m37 66 4 4 8-9" fill="none" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <text x="112" y="98" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="14" fill={INK}>
        PAQUETE
      </text>
    </svg>
  );
}

/* ---------- ícono de item (mini) ---------- */

type ItemKind = "acta" | "borrador" | "papeletas" | "padron" | "talonario";

interface ItemArt {
  kind: ItemKind;
  code?: string;
  stripe?: string;
  title?: string;
  used?: boolean;
}

function ItemArtSVG({ art, className = "" }: { art: ItemArt; className?: string }) {
  switch (art.kind) {
    case "acta":
      return <ActaSVG stripe={art.stripe!} code={art.code!} title={art.title!} className={className} />;
    case "borrador":
      return <BorradorSVG className={className} />;
    case "papeletas":
      return <PapeletasSVG used={art.used!} className={className} />;
    case "padron":
      return <MaterialSVG kind="padron" className={className} />;
    case "talonario":
      return <MaterialSVG kind="talonario" className={className} />;
  }
}

/* ---------- datos de las 7 prácticas ---------- */

interface MatchItem {
  id: string;
  label: string;
  art: ItemArt;
}
interface MatchSlot {
  id: string;
  kind: "sobre" | "paquete";
  color?: SobreColor;
  code?: string;
  label: string;
  destino: string;
  accept: string[];
}
export interface MatchQuestion {
  id: string;
  flow: string;
  prompt: string;
  hint: string;
  items: MatchItem[];
  slots: MatchSlot[];
}

const q = (
  id: string, flow: string, prompt: string, hint: string,
  items: MatchItem[], slots: MatchSlot[]
): MatchQuestion => ({ id, flow, prompt, hint, items, slots });

export const MATCH_QUESTIONS: MatchQuestion[] = [
  q(
    "m1",
    "Flujo de transmisión · Coordinador/a de Mesa",
    "Arrastra cada acta de escrutinio T hasta su sobre amarillo.",
    "Franja amarilla → sobres amarillos T1, T2, T3 y T5, directo a la transmisión.",
    [
      { id: "a-t1", label: "Acta T1 · Alcaldía", art: { kind: "acta", code: "T1", stripe: YELLOW, title: "DE ESCRUTINIO" } },
      { id: "a-t2", label: "Acta T2 · Prefectura", art: { kind: "acta", code: "T2", stripe: YELLOW, title: "DE ESCRUTINIO" } },
      { id: "a-t3", label: "Acta T3 · Concejalías", art: { kind: "acta", code: "T3", stripe: YELLOW, title: "DE ESCRUTINIO" } },
      { id: "a-t5", label: "Acta T5 · CPCCS", art: { kind: "acta", code: "T5", stripe: YELLOW, title: "DE ESCRUTINIO" } },
    ],
    [
      { id: "s-t1", kind: "sobre", color: "T", code: "T1", label: "Sobre amarillo T1", destino: "Transmisión", accept: ["a-t1"] },
      { id: "s-t2", kind: "sobre", color: "T", code: "T2", label: "Sobre amarillo T2", destino: "Transmisión", accept: ["a-t2"] },
      { id: "s-t3", kind: "sobre", color: "T", code: "T3", label: "Sobre amarillo T3", destino: "Transmisión", accept: ["a-t3"] },
      { id: "s-t5", kind: "sobre", color: "T", code: "T5", label: "Sobre amarillo T5", destino: "Transmisión", accept: ["a-t5"] },
    ]
  ),
  q(
    "m2",
    "Flujo del paquete electoral · Sobres P",
    "El acta P1 (franja roja) ya está firmada y sellada. ¿En qué sobre viaja?",
    "Franja roja → sobre rojo P1, dentro del paquete electoral.",
    [{ id: "a-p1", label: "Acta P1 · Escrutinio", art: { kind: "acta", code: "P1", stripe: RED, title: "DE ESCRUTINIO" } }],
    [
      { id: "s-p1", kind: "sobre", color: "P1", code: "P1", label: "Sobre rojo P1", destino: "Paquete electoral", accept: ["a-p1"] },
      { id: "s-p2", kind: "sobre", color: "P2", code: "P2", label: "Sobre P2", destino: "Paquete electoral", accept: [] },
      { id: "s-c1", kind: "sobre", color: "C", code: "C1", label: "Sobre azul C1", destino: "CPE", accept: [] },
    ]
  ),
  q(
    "m3",
    "Flujo del paquete electoral · Sobres P",
    "Las papeletas que sobraron ya fueron mutiladas. ¿A dónde van?",
    "Papeletas NO utilizadas (mutiladas) → sobre P2.",
    [{ id: "pp-mut", label: "Papeletas no utilizadas", art: { kind: "papeletas", used: false } }],
    [
      { id: "s-p2b", kind: "sobre", color: "P2", code: "P2", label: "Sobre P2", destino: "Paquete electoral", accept: ["pp-mut"] },
      { id: "s-p3b", kind: "sobre", color: "P3", code: "P3", label: "Sobre P3", destino: "Paquete electoral", accept: [] },
      { id: "s-c2", kind: "sobre", color: "C", code: "C2", label: "Sobre azul C2", destino: "CPE", accept: [] },
    ]
  ),
  q(
    "m4",
    "Flujo del paquete electoral · Sobres P",
    "Las papeletas utilizadas (votos válidos, blancos y nulos) se guardan en…",
    "Papeletas utilizadas → sobre P3, ordenadas por dignidad.",
    [{ id: "pp-usa", label: "Papeletas utilizadas", art: { kind: "papeletas", used: true } }],
    [
      { id: "s-p3c", kind: "sobre", color: "P3", code: "P3", label: "Sobre P3", destino: "Paquete electoral", accept: ["pp-usa"] },
      { id: "s-p2c", kind: "sobre", color: "P2", code: "P2", label: "Sobre P2", destino: "Paquete electoral", accept: [] },
      { id: "s-p1c", kind: "sobre", color: "P1", code: "P1", label: "Sobre rojo P1", destino: "Paquete electoral", accept: [] },
    ]
  ),
  q(
    "m5",
    "Flujo del paquete electoral · Borradores",
    "Los borradores de escrutinio (franja gris) se guardan…",
    "Franja gris → directo dentro del paquete electoral, sin sobre.",
    [{ id: "borr", label: "Borradores de escrutinio", art: { kind: "borrador" } }],
    [
      { id: "pq1", kind: "paquete", label: "Dentro del paquete electoral", destino: "Fuerzas Armadas", accept: ["borr"] },
      { id: "s-c1b", kind: "sobre", color: "C", code: "C1", label: "Sobre azul C1", destino: "CPE", accept: [] },
      { id: "s-p2d", kind: "sobre", color: "P2", code: "P2", label: "Sobre P2", destino: "Paquete electoral", accept: [] },
    ]
  ),
  q(
    "m6",
    "Flujo del CPE · Sobres C",
    "El acta de instalación C1 (franja azul) viaja al CPE dentro del…",
    "Franja azul → sobre azul C1, rumbo al Centro de Procesamiento Electoral.",
    [{ id: "a-c1", label: "Acta C1 · Instalación", art: { kind: "acta", code: "C1", stripe: BLUE, title: "DE INSTALACIÓN" } }],
    [
      { id: "s-c1c", kind: "sobre", color: "C", code: "C1", label: "Sobre azul C1", destino: "CPE", accept: ["a-c1"] },
      { id: "s-c2b", kind: "sobre", color: "C", code: "C2", label: "Sobre azul C2", destino: "CPE", accept: [] },
      { id: "s-t1b", kind: "sobre", color: "T", code: "T1", label: "Sobre amarillo T1", destino: "Transmisión", accept: [] },
    ]
  ),
  q(
    "m7",
    "Flujo del CPE · Sobres C",
    "El padrón y el talonario de certificados van a los sobres azules…",
    "Padrón electoral → C2 · Talonario con certificados → C3.",
    [
      { id: "mat-pad", label: "Padrón electoral", art: { kind: "padron" } },
      { id: "mat-tal", label: "Talonario de certificados", art: { kind: "talonario" } },
    ],
    [
      { id: "s-c2c", kind: "sobre", color: "C", code: "C2", label: "Sobre azul C2", destino: "CPE", accept: ["mat-pad"] },
      { id: "s-c3", kind: "sobre", color: "C", code: "C3", label: "Sobre azul C3", destino: "CPE", accept: ["mat-tal"] },
    ]
  ),
];

/* ---------- chuleta por franja ---------- */

export function FranjaCheatsheet() {
  const rows = [
    { color: YELLOW, name: "Franja amarilla", target: "Actas T1 · T2 · T3 · T5", dest: "Sobres amarillos → Transmisión", text: "#14213d" },
    { color: RED, name: "Franja roja", target: "Actas P1 de todas las dignidades", dest: "Sobre rojo P1 → Paquete electoral", text: "#ffffff" },
    { color: BLUE, name: "Franja azul", target: "Acta de instalación C1", dest: "Sobre azul C1 → CPE", text: "#ffffff" },
    { color: GRIS, name: "Franja gris", target: "Borradores de escrutinio", dest: "Directo al paquete electoral", text: "#14213d" },
  ];
  return (
    <Reveal>
      <div className="border-[3px] border-ink bg-white shadow-[8px_8px_0_rgba(20,33,61,0.9)]">
        <div className="border-b-[3px] border-ink bg-navy text-white px-5 py-2.5 flex items-center justify-between">
          <span className="font-display text-base sm:text-lg tracking-[0.12em]">CHULETA POR FRANJA LATERAL</span>
          <span className="font-display text-sm tracking-[0.1em] text-yellow hidden sm:block">MEMORÍZALA</span>
        </div>
        <ul className="divide-y-2 divide-ink/10">
          {rows.map((r) => (
            <li key={r.name} className="flex items-center gap-4 px-5 py-3.5 hover:bg-paper-2 transition-colors duration-300">
              <span
                className="w-5 h-12 shrink-0 border-2 border-ink font-display flex items-center justify-center text-[10px]"
                style={{ backgroundColor: r.color, color: r.text }}
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="font-extrabold text-ink leading-tight">{r.name} <span className="font-semibold text-ink-soft">· {r.target}</span></p>
                <p className="text-sm font-bold uppercase tracking-[0.08em] text-ink-soft mt-0.5">{r.dest}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

/* ---------- juego de una práctica ---------- */

function MatchPlay({
  question, index, score, onPoint, onNext, isLast,
}: {
  question: MatchQuestion;
  index: number;
  score: number;
  onPoint: (earned: boolean) => void;
  onNext: () => void;
  isLast: boolean;
}) {
  const [placed, setPlaced] = useState<Record<string, string>>({}); // itemId -> slotId
  const [selected, setSelected] = useState<string | null>(null);
  const [wrongSlot, setWrongSlot] = useState<string | null>(null);
  const [wrongItem, setWrongItem] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [solved, setSolved] = useState(false);

  const total = question.items.length;
  const placedCount = Object.keys(placed).length;

  const tryPlace = (itemId: string, slotId: string) => {
    if (solved || placed[itemId]) return;
    const slot = question.slots.find((s) => s.id === slotId);
    if (!slot) return;
    if (slot.accept.includes(itemId)) {
      const next = { ...placed, [itemId]: slotId };
      setPlaced(next);
      setSelected(null);
      setWrongSlot(null);
      setWrongItem(null);
      if (Object.keys(next).length === total) {
        setSolved(true);
        onPoint(attempts === 0);
        window.setTimeout(onNext, 1400);
      }
    } else {
      setAttempts((a) => a + 1);
      setWrongSlot(slotId);
      setWrongItem(itemId);
      setSelected(null);
      window.setTimeout(() => setWrongSlot(null), 650);
    }
  };

  const onDrop = (e: DragEvent<HTMLDivElement>, slotId: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (id) tryPlace(id, slotId);
  };

  return (
    <div className="relative border-[3px] border-ink bg-white shadow-[10px_10px_0_rgba(29,79,196,0.9)]">
      <div className="flex items-center justify-between gap-4 border-b-[3px] border-ink bg-navy text-white px-5 sm:px-7 py-3.5">
        <span className="font-display text-lg sm:text-xl tracking-[0.1em]">
          PRÁCTICA {String(index + 1).padStart(2, "0")} / 07
        </span>
        <span className="font-display text-lg sm:text-xl text-yellow tabular-nums">ACIERTOS: {score}</span>
      </div>

      <div className="px-5 sm:px-7 py-7 sm:py-9">
        <p className="kicker text-blue">{question.flow}</p>
        <h3 className="mt-2 text-xl sm:text-2xl font-extrabold leading-snug text-ink max-w-3xl">{question.prompt}</h3>
        <p className="mt-2 text-[15px] font-semibold text-ink-soft">
          Arrastra cada documento hasta su destino — o tócalo y luego toca el sobre.
          <span className="ml-2 inline-flex items-center gap-1.5 text-blue font-extrabold">
            Colocados: {placedCount}/{total}
          </span>
        </p>

        <div className="mt-8 grid lg:grid-cols-2 gap-8 lg:gap-10">
          {/* bandeja de documentos */}
          <div>
            <p className="font-display text-sm tracking-[0.18em] text-ink-soft mb-4 uppercase">Documentos sobre la mesa</p>
            <div className={`grid gap-4 ${question.items.length > 2 ? "sm:grid-cols-2" : ""}`}>
              {question.items.map((item) => {
                const done = Boolean(placed[item.id]);
                const isSel = selected === item.id;
                const isWrong = wrongItem === item.id;
                return (
                  <div
                    key={item.id}
                    draggable={!done}
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", item.id);
                      e.dataTransfer.effectAllowed = "move";
                    }}
                    onClick={() => !done && setSelected(isSel ? null : item.id)}
                    className={`relative border-[3px] border-ink bg-white p-3 transition-all duration-300 select-none ${
                      done
                        ? "opacity-40 cursor-default"
                        : "cursor-grab active:cursor-grabbing hover:-translate-y-1 hover:shadow-[6px_6px_0_rgba(29,79,196,0.85)]"
                    } ${isSel ? "-translate-y-1 shadow-[6px_6px_0_rgba(208,49,31,0.85)] outline outline-[3px] outline-dashed outline-red" : ""} ${
                      isWrong ? "shake" : ""
                    }`}
                  >
                    <ItemArtSVG art={item.art} className="w-full max-w-[120px] mx-auto h-auto" />
                    <p className="mt-2 text-center text-[13px] font-extrabold text-ink leading-tight">{item.label}</p>
                    {done && (
                      <span className="absolute -top-3 -right-3 w-8 h-8 bg-blue border-[3px] border-ink flex items-center justify-center">
                        <svg viewBox="0 0 16 16" className="w-4 h-4" aria-hidden="true">
                          <path d="m3 8.5 3.5 3.5L13 5" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    )}
                    {isSel && (
                      <span className="absolute -top-3 -left-3 font-display text-[11px] tracking-[0.1em] bg-red text-white border-2 border-ink px-2 py-0.5">
                        EN MANO
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* destinos */}
          <div>
            <p className="font-display text-sm tracking-[0.18em] text-ink-soft mb-4 uppercase">Destinos</p>
            <div className={`grid gap-4 ${question.slots.length > 1 ? "sm:grid-cols-2" : ""}`}>
              {question.slots.map((slot) => {
                const filledBy = question.items.find((it) => placed[it.id] === slot.id);
                const isWrong = wrongSlot === slot.id;
                return (
                  <div
                    key={slot.id}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => onDrop(e, slot.id)}
                    onClick={() => {
                      if (selected) tryPlace(selected, slot.id);
                    }}
                    className={`relative border-[3px] p-4 text-center transition-all duration-300 ${
                      filledBy ? "border-blue bg-blue-soft" : "border-ink bg-white"
                    } ${selected ? "cursor-pointer hover:-translate-y-1 hover:shadow-[6px_6px_0_rgba(208,49,31,0.7)]" : ""} ${
                      isWrong ? "shake border-red bg-red-soft" : ""
                    }`}
                  >
                    {slot.kind === "sobre" ? (
                      <SobreSVG color={slot.color!} code={slot.code!} className="w-32 sm:w-36 mx-auto h-auto" />
                    ) : (
                      <PaqueteSVG className="w-36 sm:w-40 mx-auto h-auto" />
                    )}
                    <p className="mt-2 text-[13px] font-extrabold text-ink leading-tight">{slot.label}</p>
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-soft mt-0.5">→ {slot.destino}</p>

                    {filledBy && (
                      <div className="mt-3 flex items-center justify-center gap-2 border-2 border-blue bg-white px-2.5 py-1.5">
                        <ItemArtSVG art={filledBy.art} className="w-6 h-auto shrink-0" />
                        <span className="text-[12px] font-extrabold text-navy leading-tight text-left">{filledBy.label}</span>
                        <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0" aria-hidden="true">
                          <path d="m3 8.5 3.5 3.5L13 5" fill="none" stroke="#1d4fc4" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* alertas en línea */}
        {wrongSlot && !solved && (
          <div role="alert" className="mt-6 flex items-start gap-4 border-[3px] border-red bg-red-soft px-5 py-4 shadow-[6px_6px_0_rgba(208,49,31,0.55)]">
            <span className="font-display text-2xl text-red leading-none pt-0.5" aria-hidden="true">✗</span>
            <div>
              <p className="font-display text-xl uppercase tracking-wide text-red">Destino equivocado</p>
              <p className="mt-1 text-[15px] font-semibold text-ink leading-snug">
                Ese documento no va ahí. Vuelve a intentarlo: {question.hint}
              </p>
            </div>
          </div>
        )}
        {solved && (
          <div role="status" className="mt-6 flex items-start gap-4 border-[3px] border-blue bg-blue-soft px-5 py-4 shadow-[6px_6px_0_rgba(29,79,196,0.55)]">
            <span className="font-display text-2xl text-blue leading-none pt-0.5" aria-hidden="true">✓</span>
            <p className="text-[15px] font-extrabold text-navy leading-snug pt-1">
              {attempts === 0 ? "¡Impecable! Todo sellado y en orden." : "¡Listo! Documentos en su sitio."}{" "}
              {isLast ? "Cerrando el examen…" : "Siguiente práctica en un instante…"}
            </p>
          </div>
        )}

        <p className="mt-6 text-sm font-semibold text-ink-soft border-l-4 border-yellow pl-3">
          <strong className="font-extrabold text-ink">Pista:</strong> {question.hint}
        </p>
      </div>
    </div>
  );
}

/* ---------- ronda completa (7 prácticas) ---------- */

export function MatchRound({
  score, onPoint, onDone, onIndex,
}: {
  score: number;
  onPoint: (earned: boolean) => void;
  onDone: () => void;
  onIndex: (i: number) => void;
}) {
  const [idx, setIdx] = useState(0);
  const question = MATCH_QUESTIONS[idx];

  const next = () => {
    if (idx + 1 >= MATCH_QUESTIONS.length) {
      onDone();
    } else {
      const n = idx + 1;
      setIdx(n);
      onIndex(n);
    }
  };

  return (
    <div className="space-y-8">
      <FranjaCheatsheet />
      <MatchPlay
        key={question.id}
        question={question}
        index={idx}
        score={score}
        onPoint={onPoint}
        onNext={next}
        isLast={idx + 1 >= MATCH_QUESTIONS.length}
      />
    </div>
  );
}
