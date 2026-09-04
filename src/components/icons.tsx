import type { JSX } from "react";
import type { IconName } from "../data/content";

/* Iconografía editorial: trazo tinta + acentos azul / amarillo / rojo */

const INK = "#14213d";
const BLUE = "#1d4fc4";
const BLUESOFT = "#dce8fb";
const YELLOW = "#f5a800";
const RED = "#d0311f";
const CAFE = "#8a5a2b";

const paths: Record<IconName, JSX.Element> = {
  cedula: (
    <g>
      <rect x="6" y="12" width="36" height="24" rx="2" fill={BLUESOFT} />
      <circle cx="16" cy="23" r="5" fill={BLUE} />
      <path d="M26 19h12M26 25h12M10 32h8" />
    </g>
  ),
  paquete: (
    <g>
      <rect x="8" y="14" width="32" height="24" fill={BLUESOFT} />
      <path d="M8 14 24 6l16 8M24 6v32" />
      <rect x="18" y="24" width="12" height="6" fill={BLUE} />
    </g>
  ),
  verificar: (
    <g>
      <rect x="9" y="6" width="30" height="36" fill="#fff" />
      <path d="M15 15h18M15 22h18M15 29h10" />
      <path d="m24 33 5 5 9-11" stroke={BLUE} strokeWidth="3.2" />
    </g>
  ),
  lista: (
    <g>
      <rect x="8" y="6" width="32" height="36" fill={BLUESOFT} />
      <path d="m13 14 2.5 2.5L20 12m-7 10 2.5 2.5L20 22m-7 10 2.5 2.5L20 32" stroke={BLUE} />
      <path d="M24 14h12M24 24h12M24 34h12" />
    </g>
  ),
  urna: (
    <g>
      <path d="M10 16h28v24H10z" fill={BLUESOFT} />
      <path d="M8 16h32M14 8h20l4 8H10z" fill="#fff" />
      <rect x="18" y="11" width="12" height="3" fill={INK} stroke="none" />
      <path d="M16 24h16M16 30h16" stroke={BLUE} />
    </g>
  ),
  biombo: (
    <g>
      <path d="M6 38V12l10-4v30M16 38V8l10 4v26M26 38V12l10-4v30M36 38V8l6 3v27" fill={BLUESOFT} />
      <path d="M6 38h36" />
    </g>
  ),
  acta: (
    <g>
      <rect x="9" y="6" width="30" height="36" fill={YELLOW} fillOpacity="0.35" />
      <path d="M15 13h18M15 19h18M15 25h12" />
      <path d="M14 35c4-4 6 2 9-2s5 1 11-2" stroke={BLUE} />
    </g>
  ),
  sobre: (
    <g>
      <rect x="6" y="12" width="36" height="24" fill={BLUESOFT} />
      <path d="m6 13 18 14L42 13" stroke={BLUE} />
    </g>
  ),
  boton: (
    <g>
      <circle cx="24" cy="24" r="15" fill={YELLOW} />
      <circle cx="24" cy="24" r="15" />
      <circle cx="24" cy="24" r="8" fill="#fff" />
      <path d="M24 3v6M24 39v6" />
    </g>
  ),
  padron: (
    <g>
      <path d="M8 8c6-3 10-3 16 0s10 3 16 0v30c-6 3-10 3-16 0s-10-3-16 0z" fill={BLUESOFT} />
      <path d="M24 8v30" />
      <path d="M30 20c3-3 6 0 3 3s0 6 3 4" stroke={BLUE} />
      <path d="M12 16h8M12 22h8M12 28h8" />
    </g>
  ),
  certificado: (
    <g>
      <rect x="7" y="8" width="34" height="24" fill="#fff" />
      <path d="M13 15h14M13 21h10" />
      <circle cx="32" cy="26" r="7" fill={YELLOW} />
      <path d="m29 32-3 9 6-3 6 3-3-9" fill={RED} stroke={INK} />
    </g>
  ),
  papeleta: (
    <g>
      <rect x="10" y="5" width="28" height="38" fill="#fff" />
      <path d="M15 12h12M15 19h12M15 26h12" />
      <rect x="29" y="10" width="5" height="5" fill={BLUESOFT} />
      <rect x="29" y="17" width="5" height="5" fill={BLUE} />
      <rect x="29" y="24" width="5" height="5" fill={BLUESOFT} />
      <path d="m15 33 3 3 6-6" stroke={BLUE} />
    </g>
  ),
  huella: (
    <g>
      <path d="M24 8c-8 0-13 6-13 14 0 6 1 11 3 16" stroke={BLUE} />
      <path d="M24 14c-5 0-8 4-8 10 0 5 1 9 2 13" />
      <path d="M24 20c-2.5 0-4 2-4 6 0 4 .5 8 1.5 12" stroke={BLUE} />
      <path d="M24 8c8 0 13 6 13 14 0 6-1 11-3 16" />
      <path d="M24 14c5 0 8 4 8 10 0 5-1 9-2 13" stroke={BLUE} />
      <path d="M24 20c2.5 0 4 2 4 6 0 4-.5 8-1.5 12" />
    </g>
  ),
  urnaCafe: (
    <g>
      <path d="M10 16h28v24H10z" fill={CAFE} fillOpacity="0.3" />
      <path d="M8 16h32M14 8h20l4 8H10z" fill={CAFE} fillOpacity="0.55" />
      <rect x="18" y="11" width="12" height="3" fill={INK} stroke="none" />
      <path d="M16 24h16M16 30h16" stroke={CAFE} />
    </g>
  ),
  esfero: (
    <g>
      <path d="M10 38 34 14l6 6-24 24-8 2z" fill={BLUESOFT} />
      <path d="m30 10 8 8" />
      <path d="m10 38 2-8 6 6z" fill={BLUE} />
    </g>
  ),
  noCelular: (
    <g>
      <rect x="16" y="6" width="16" height="36" rx="3" fill={BLUESOFT} />
      <path d="M21 36h6" />
      <path d="M8 42 40 8" stroke={RED} strokeWidth="3.4" />
    </g>
  ),
  militar: (
    <g>
      <path d="M24 6l4.5 9.5L38 17l-7 7 2 10-9-5-9 5 2-10-7-7 9.5-1.5z" fill={YELLOW} />
    </g>
  ),
  infraccion: (
    <g>
      <rect x="9" y="6" width="30" height="36" fill="#fff" />
      <path d="M24 13v12" stroke={RED} strokeWidth="3.4" />
      <circle cx="24" cy="32" r="2.2" fill={RED} stroke="none" />
      <path d="M15 37h18" />
    </g>
  ),
  asistida: (
    <g>
      <circle cx="16" cy="12" r="5" fill={BLUE} />
      <path d="M8 40v-8c0-5 4-8 8-8s8 3 8 8v8" fill={BLUESOFT} />
      <circle cx="33" cy="15" r="4" fill={YELLOW} />
      <path d="M26 40v-6c0-4 3-7 7-7s7 3 7 7v6" fill="#fff" />
    </g>
  ),
  preferente: (
    <g>
      <circle cx="15" cy="11" r="5" fill={BLUE} />
      <path d="M7 40v-9c0-5 4-8 8-8s8 3 8 8v9" fill={BLUESOFT} />
      <path d="M28 24h14m0 0-6-6m6 6-6 6" stroke={YELLOW} strokeWidth="3.4" />
    </g>
  ),
  mesaMap: (
    <g>
      <path d="M6 20h24v4H6zM10 24v14M26 24v14" fill={BLUESOFT} />
      <circle cx="36" cy="16" r="4" fill={YELLOW} />
      <path d="M36 20v10m0 0h6l3 8m-9-8-3 8m-1-14 4 6" />
      <circle cx="33" cy="40" r="3" />
    </g>
  ),
  braille: (
    <g>
      <rect x="9" y="6" width="30" height="36" fill={BLUESOFT} />
      <circle cx="17" cy="14" r="2.4" fill={BLUE} stroke="none" />
      <circle cx="17" cy="24" r="2.4" fill={INK} stroke="none" />
      <circle cx="17" cy="34" r="2.4" fill={BLUE} stroke="none" />
      <circle cx="31" cy="14" r="2.4" fill={INK} stroke="none" />
      <circle cx="31" cy="24" r="2.4" fill={BLUE} stroke="none" />
      <circle cx="31" cy="34" r="2.4" fill={INK} stroke="none" />
    </g>
  ),
  selloBlanco: (
    <g>
      <path d="M18 6h12v10c0 3 4 4 4 8H14c0-4 4-5 4-8z" fill={YELLOW} />
      <rect x="10" y="24" width="28" height="7" fill={INK} stroke="none" />
      <path d="M12 36h24" stroke={BLUE} strokeWidth="3" />
    </g>
  ),
  romper: (
    <g>
      <path d="M10 6h12v14l4-3 4 3 4-3 4 3V6" fill={BLUESOFT} />
      <path d="M10 20v22h12V28M38 20v22H26V28" fill="#fff" />
      <path d="M22 20v22M26 20v22" strokeDasharray="3 3" />
    </g>
  ),
  organizar: (
    <g>
      <rect x="6" y="8" width="16" height="12" fill={BLUESOFT} />
      <rect x="26" y="8" width="16" height="12" fill={YELLOW} fillOpacity="0.5" />
      <rect x="6" y="26" width="16" height="12" fill={RED} fillOpacity="0.35" />
      <rect x="26" y="26" width="16" height="12" fill="#fff" />
    </g>
  ),
  contar: (
    <g>
      <path d="M8 10v22M15 10v22M22 10v22M29 10v22" stroke={BLUE} strokeWidth="3" />
      <path d="M4 28 34 14" stroke={RED} strokeWidth="3" />
      <path d="M38 14h6M38 22h6M38 30h6" />
    </g>
  ),
  caratula: (
    <g>
      <rect x="9" y="6" width="30" height="36" fill="#fff" />
      <rect x="14" y="12" width="20" height="9" fill={BLUESOFT} />
      <path d="M14 28h20M14 34h14" />
      <path d="m30 31 3 3 6-7" stroke={BLUE} />
    </g>
  ),
  transcribir: (
    <g>
      <rect x="6" y="8" width="20" height="26" fill={BLUESOFT} />
      <rect x="22" y="14" width="20" height="26" fill="#fff" />
      <path d="M10 14h12M10 20h12M10 26h8" />
      <path d="M26 20h12M26 26h12M26 32h8" stroke={BLUE} />
    </g>
  ),
  blanco: (
    <g>
      <rect x="10" y="5" width="28" height="38" fill="#fff" />
      <path d="M15 13h18M15 20h18M15 27h18M15 34h12" strokeDasharray="2 4" opacity="0.55" />
    </g>
  ),
  nulo: (
    <g>
      <rect x="10" y="5" width="28" height="38" fill="#fff" />
      <path d="m14 12 6 6m0-6-6 6M28 12l6 6m0-6-6 6M14 26l6 6m0-6-6 6" stroke={RED} />
      <path d="M26 30c4-3 8 2 10-2" stroke={RED} />
    </g>
  ),
  valido: (
    <g>
      <rect x="10" y="5" width="28" height="38" fill="#fff" />
      <path d="M15 13h10M15 20h10M15 27h10" />
      <path d="m27 24 4 4 7-9" stroke={BLUE} strokeWidth="3.4" />
    </g>
  ),
  pared: (
    <g>
      <path d="M6 6h36v32H6z" fill={BLUESOFT} />
      <rect x="12" y="12" width="11" height="14" fill="#fff" />
      <rect x="26" y="12" width="11" height="14" fill={YELLOW} fillOpacity="0.6" />
      <path d="M14 16h7M14 20h7M28 16h7M28 20h7" />
      <path d="M6 38h36" />
    </g>
  ),
  leer: (
    <g>
      <path d="M8 20v8h7l11 8V12L15 20z" fill={YELLOW} />
      <path d="M31 18c3 2 3 10 0 12M36 14c6 4 6 16 0 20" stroke={BLUE} />
    </g>
  ),
  exhibir: (
    <g>
      <rect x="14" y="4" width="22" height="28" fill="#fff" />
      <path d="m19 17 4 4 8-9" stroke={BLUE} />
      <path d="M18 44v-8c0-2 2-4 4-4h8c4 0 6 3 6 6v6" fill={BLUESOFT} />
    </g>
  ),
  sumar: (
    <g>
      <circle cx="24" cy="24" r="17" fill={BLUESOFT} />
      <path d="M24 14v20M14 24h20" stroke={BLUE} strokeWidth="3.6" />
    </g>
  ),
  comparar: (
    <g>
      <rect x="6" y="10" width="16" height="28" fill={BLUESOFT} />
      <rect x="26" y="10" width="16" height="28" fill={YELLOW} fillOpacity="0.5" />
      <path d="M20 21h8m0 0-3-3m3 3-3 3M28 27h-8m0 0 3-3m-3 3 3 3" strokeWidth="2" />
    </g>
  ),
  dictar: (
    <g>
      <circle cx="17" cy="24" r="9" fill={BLUESOFT} />
      <path d="M17 15v18" />
      <path d="M30 16c4 3 4 13 0 16M35 12c7 5 7 19 0 24" stroke={RED} />
    </g>
  ),
  llenar: (
    <g>
      <rect x="8" y="6" width="32" height="36" fill="#fff" />
      <path d="M14 14h14M14 21h10M14 28h12" />
      <path d="m26 36 10-10 4 4-10 10-5 1z" fill={YELLOW} />
    </g>
  ),
  firmar: (
    <g>
      <rect x="8" y="8" width="32" height="32" fill="#fff" />
      <path d="M12 32c5-7 8 3 12-4s7 2 12-3" stroke={BLUE} strokeWidth="2.8" />
      <path d="M34 12l4 4-12 12h-4v-4z" fill={YELLOW} />
    </g>
  ),
  lamina: (
    <g>
      <rect x="8" y="8" width="32" height="32" fill={BLUESOFT} />
      <path d="M24 12l12 4v8c0 8-6 12-12 14-6-2-12-6-12-14v-8z" fill="#fff" />
      <path d="m19 24 4 4 7-8" stroke={BLUE} />
    </g>
  ),
  coordinador: (
    <g>
      <circle cx="24" cy="12" r="6" fill={YELLOW} />
      <path d="M10 42v-8c0-7 6-11 14-11s14 4 14 11v8" fill={BLUESOFT} />
      <rect x="19" y="28" width="10" height="12" fill="#fff" />
      <path d="M22 32h4M22 36h4" stroke={BLUE} />
    </g>
  ),
  guardar: (
    <g>
      <path d="M8 22v18h32V22" fill={BLUESOFT} />
      <path d="M24 6v20m0 0-7-7m7 7 7-7" stroke={BLUE} strokeWidth="3" />
    </g>
  ),
  pegar: (
    <g>
      <rect x="8" y="10" width="32" height="28" fill="#fff" />
      <rect x="18" y="4" width="12" height="12" fill={YELLOW} fillOpacity="0.8" transform="rotate(8 24 10)" />
      <path d="M14 22h20M14 29h20" />
    </g>
  ),
  bolsillos: (
    <g>
      <rect x="6" y="8" width="36" height="32" fill={RED} fillOpacity="0.25" />
      <path d="M6 8h36M18 8v32M30 8v32" />
      <path d="m9 16 3 3 5-6M21 16l3 3 5-6" stroke={BLUE} />
      <path d="m33 15 6 6m0-6-6 6" stroke={RED} />
    </g>
  ),
  candado: (
    <g>
      <rect x="12" y="20" width="24" height="20" fill={YELLOW} />
      <path d="M16 20v-6a8 8 0 0 1 16 0v6" />
      <circle cx="24" cy="29" r="3" fill={INK} stroke="none" />
      <path d="M24 31v5" strokeWidth="3" />
    </g>
  ),
  selloRojo: (
    <g>
      <rect x="8" y="16" width="32" height="16" fill={RED} />
      <path d="M8 16l6 8-6 8M40 16l-6 8 6 8" fill="#fff" stroke="none" />
      <path d="M14 24h20" stroke="#fff" />
    </g>
  ),
  funda: (
    <g>
      <path d="M12 14h24l4 28H8z" fill={BLUESOFT} />
      <path d="M18 14c0-5 3-8 6-8s6 3 6 8" />
      <path d="M14 24h20" stroke={BLUE} strokeDasharray="3 3" />
    </g>
  ),
  entrega: (
    <g>
      <path d="M4 30l8-6 8 4v8H4z" fill={BLUESOFT} />
      <path d="M44 30l-8-6-8 4v8h16z" fill={YELLOW} fillOpacity="0.6" />
      <rect x="17" y="12" width="14" height="12" fill="#fff" />
      <path d="m20 18 3 3 5-6" stroke={BLUE} />
    </g>
  ),
  flujograma: (
    <g>
      <rect x="16" y="4" width="16" height="10" fill={BLUESOFT} />
      <rect x="4" y="30" width="14" height="10" fill={YELLOW} fillOpacity="0.6" />
      <rect x="30" y="30" width="14" height="10" fill={RED} fillOpacity="0.35" />
      <path d="M24 14v8m0 0-12 8m12-8 12 8" />
    </g>
  ),
  reloj: (
    <g>
      <circle cx="24" cy="24" r="17" fill="#fff" />
      <path d="M24 12v12l8 5" stroke={BLUE} strokeWidth="3" />
      <path d="M24 4v3M44 24h-3M24 44v-3M4 24h3" />
    </g>
  ),
  urnaVacia: (
    <g>
      <path d="M10 20h28v20H10z" fill="#fff" />
      <path d="M8 20h32" />
      <path d="M14 12h20l4 8H10z" fill={BLUESOFT} />
      <rect x="18" y="14" width="12" height="3" fill={INK} stroke="none" />
      <path d="M17 26l4 4 4-4 4 4 4-4" stroke={BLUE} strokeDasharray="2 3" />
    </g>
  ),
  codigo: (
    <g>
      <path d="M6 24 14 8h28l-8 16 8 16H14z" fill={BLUESOFT} />
      <path d="M16 20h14M16 28h10" stroke={BLUE} />
      <path d="M34 18v12" strokeWidth="3" />
    </g>
  ),
  cuadricula: (
    <g>
      <rect x="6" y="6" width="36" height="36" fill="#fff" />
      <path d="M6 15h36M6 24h36M6 33h36M15 6v36M24 6v36M33 6v36" strokeWidth="1.6" />
      <circle cx="10.5" cy="10.5" r="2" fill={BLUE} stroke="none" />
      <circle cx="19.5" cy="10.5" r="2" fill={BLUE} stroke="none" />
      <circle cx="28.5" cy="10.5" r="2" fill={BLUE} stroke="none" />
      <circle cx="10.5" cy="19.5" r="2" fill={BLUE} stroke="none" />
      <circle cx="19.5" cy="19.5" r="2" fill={BLUE} stroke="none" />
    </g>
  ),
  selloSeguridad: (
    <g>
      <circle cx="24" cy="24" r="16" fill={RED} fillOpacity="0.9" />
      <circle cx="24" cy="24" r="10" fill="none" stroke="#fff" strokeDasharray="3 3" />
      <path d="m20 24 3 3 6-7" stroke="#fff" strokeWidth="2.6" />
    </g>
  ),
};

export function Icon({ name, className = "w-10 h-10" }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      stroke={INK}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
