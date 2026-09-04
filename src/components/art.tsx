/* Ilustraciones editoriales — trazo tinta, rellenos planos, tramado de línea.
   Inspiradas en el humor conceptual de la ilustración de prensa británica. */

const INK = "#14213d";
const BLUE = "#1d4fc4";
const BLUEMID = "#4f7de0";
const BLUESOFT = "#dce8fb";
const NAVY = "#0f2b66";
const YELLOW = "#f5a800";
const RED = "#d0311f";
const CAFE = "#8a5a2b";
const WHITE = "#ffffff";

const stroke = {
  stroke: INK,
  strokeWidth: 3,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function HatchPattern({ id, color = INK, opacity = 0.35 }: { id: string; color?: string; opacity?: number }) {
  return (
    <pattern id={id} width="8" height="8" patternTransform="rotate(-45)" patternUnits="userSpaceOnUse">
      <rect width="8" height="8" fill="none" />
      <line x1="0" y1="0" x2="0" y2="8" stroke={color} strokeWidth="1.6" opacity={opacity} />
    </pattern>
  );
}

function DotsPattern({ id, color = BLUE }: { id: string; color?: string }) {
  return (
    <pattern id={id} width="14" height="14" patternUnits="userSpaceOnUse">
      <circle cx="2.5" cy="2.5" r="1.7" fill={color} opacity="0.4" />
    </pattern>
  );
}

/* ================= PORTADA ================= */

export function CoverArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 560" className={className} role="img" aria-label="Ilustración: una mano deposita una papeleta en la urna">
      <defs>
        <HatchPattern id="cv-hatch" />
        <DotsPattern id="cv-dots" />
        <HatchPattern id="cv-hatch-blue" color={BLUE} opacity={0.5} />
      </defs>

      {/* fondo */}
      <rect x="4" y="4" width="632" height="552" fill={WHITE} {...stroke} />
      <circle cx="330" cy="270" r="222" fill={BLUESOFT} />
      <circle cx="330" cy="270" r="222" fill="url(#cv-dots)" />
      <circle cx="330" cy="270" r="180" fill="none" stroke={BLUE} strokeWidth="2" strokeDasharray="2 10" />

      {/* suelo tramado */}
      <rect x="70" y="468" width="500" height="30" fill="url(#cv-hatch)" />
      <line x1="70" y1="468" x2="570" y2="468" {...stroke} />

      {/* urna */}
      <g>
        <rect x="196" y="308" width="248" height="160" fill={WHITE} {...stroke} />
        <rect x="384" y="308" width="60" height="160" fill="url(#cv-hatch-blue)" />
        <polygon points="176,308 464,308 440,258 200,258" fill={BLUE} {...stroke} />
        <rect x="276" y="270" width="92" height="14" rx="4" fill={INK} />
        <text x="320" y="420" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="76" fill={NAVY}>
          27
        </text>
        <rect x="216" y="330" width="120" height="30" fill={YELLOW} {...stroke} strokeWidth={2.4} />
        <text x="276" y="351" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="19" fill={INK}>
          JRV · ECUADOR
        </text>
      </g>

      {/* papeleta cayendo */}
      <g className="drop-paper">
        <polygon points="292,150 356,138 368,196 304,208" fill={WHITE} {...stroke} />
        <line x1="306" y1="166" x2="352" y2="157" stroke={BLUE} strokeWidth="3" />
        <line x1="310" y1="180" x2="344" y2="174" stroke={BLUESOFT} strokeWidth="5" />
        <path d="m316 190 5 5 10-12" fill="none" stroke={BLUE} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* brazo con guante amarillo */}
      <g>
        <polygon points="640,26 640,120 452,168 420,92" fill={NAVY} {...stroke} />
        <polygon points="452,168 420,92 388,104 416,180" fill={WHITE} {...stroke} />
        <path d="M416 180c-26 10-52 4-60-16-6-15 4-26 18-28l66-14z" fill={YELLOW} {...stroke} />
        <path d="M362 152c-10 4-14 12-10 20" fill="none" {...stroke} strokeWidth={2.4} />
      </g>

      {/* reloj 07:00 */}
      <g>
        <circle cx="104" cy="112" r="58" fill={WHITE} {...stroke} />
        <circle cx="104" cy="112" r="46" fill="none" stroke={BLUESOFT} strokeWidth="8" />
        {[0, 90, 180, 270].map((a) => (
          <line
            key={a}
            x1="104"
            y1="70"
            x2="104"
            y2="78"
            stroke={INK}
            strokeWidth="4"
            strokeLinecap="round"
            transform={`rotate(${a} 104 112)`}
          />
        ))}
        <line x1="104" y1="112" x2="104" y2="140" stroke={INK} strokeWidth="5" strokeLinecap="round" transform="rotate(180 104 112)" />
        <line x1="104" y1="112" x2="104" y2="136" stroke={INK} strokeWidth="5" strokeLinecap="round" transform="rotate(90 104 112)" />
        <g className="clock-hand">
          <line x1="104" y1="112" x2="104" y2="76" stroke={RED} strokeWidth="4" strokeLinecap="round" />
        </g>
        <circle cx="104" cy="112" r="6" fill={INK} />
      </g>

      {/* sello estrella */}
      <g transform="rotate(12 545 470)">
        <path
          d="M545 415l14 29 32 5-23 22 5 32-28-15-28 15 5-32-23-22 32-5z"
          fill={RED}
          {...stroke}
          strokeWidth={2.6}
        />
        <text x="545" y="478" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="22" fill={WHITE}>
          2027
        </text>
      </g>

      {/* marcas sueltas */}
      <g stroke={BLUE} strokeWidth="3.4" strokeLinecap="round">
        <path d="M196 216v16M188 224h16" />
        <path d="M500 236v16M492 244h16" />
      </g>
      <circle cx="470" cy="120" r="7" fill="none" stroke={YELLOW} strokeWidth="4" />
      <circle cx="180" cy="90" r="5" fill={YELLOW} />
    </svg>
  );
}

/* ================= INSTALACIÓN ================= */

export function InstalacionArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 560 420" className={className} role="img" aria-label="Ilustración: mesa con urnas, biombos y sobres del paquete electoral">
      <defs>
        <HatchPattern id="in-hatch" />
        <DotsPattern id="in-dots" />
      </defs>

      <rect x="340" y="36" width="180" height="120" fill="url(#in-dots)" />

      {/* biombo */}
      <g>
        <rect x="150" y="96" width="86" height="160" fill={BLUESOFT} {...stroke} />
        <rect x="236" y="80" width="88" height="176" fill={WHITE} {...stroke} />
        <rect x="324" y="96" width="86" height="160" fill={BLUESOFT} {...stroke} />
        <path d="M160 110h66M160 124h66" stroke={BLUE} strokeWidth="3" strokeLinecap="round" />
        <path d="M334 110h66M334 124h66" stroke={BLUE} strokeWidth="3" strokeLinecap="round" />
        <circle cx="280" cy="150" r="22" fill={YELLOW} {...stroke} strokeWidth={2.6} />
        <path d="m271 150 7 7 12-14" fill="none" stroke={INK} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* mesa */}
      <rect x="60" y="256" width="440" height="24" fill={NAVY} {...stroke} />
      <rect x="84" y="280" width="18" height="104" fill={NAVY} {...stroke} />
      <rect x="458" y="280" width="18" height="104" fill={NAVY} {...stroke} />
      <rect x="60" y="384" width="440" height="14" fill="url(#in-hatch)" />

      {/* urna blanca */}
      <g>
        <rect x="96" y="176" width="120" height="80" fill={WHITE} {...stroke} />
        <polygon points="86,176 226,176 212,150 100,150" fill={BLUESOFT} {...stroke} />
        <rect x="132" y="158" width="48" height="9" fill={INK} />
        <text x="156" y="228" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="24" fill={NAVY}>
          SECC.
        </text>
      </g>

      {/* urna café */}
      <g>
        <rect x="344" y="176" width="120" height="80" fill={WHITE} {...stroke} />
        <rect x="344" y="176" width="120" height="80" fill={CAFE} opacity="0.25" />
        <polygon points="334,176 474,176 460,150 348,150" fill={CAFE} opacity="0.75" {...stroke} />
        <rect x="380" y="158" width="48" height="9" fill={INK} />
        <text x="404" y="228" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="24" fill={CAFE}>
          CPCCS
        </text>
      </g>

      {/* sobres al frente */}
      <g transform="rotate(-7 262 236)">
        <rect x="232" y="216" width="60" height="40" fill={BLUE} {...stroke} strokeWidth={2.6} />
        <path d="m232 218 30 22 30-22" fill="none" stroke={WHITE} strokeWidth="2.4" />
        <text x="262" y="250" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="15" fill={WHITE}>
          C1
        </text>
      </g>
      <g transform="rotate(6 320 238)">
        <rect x="292" y="220" width="56" height="38" fill={YELLOW} {...stroke} strokeWidth={2.6} />
        <path d="m292 222 28 20 28-20" fill="none" stroke={INK} strokeWidth="2.2" />
        <text x="320" y="252" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="15" fill={INK}>
          T1
        </text>
      </g>

      {/* reloj 06:30 */}
      <g>
        <circle cx="94" cy="86" r="50" fill={WHITE} {...stroke} />
        {[0, 90, 180, 270].map((a) => (
          <line key={a} x1="94" y1="48" x2="94" y2="55" stroke={INK} strokeWidth="3.4" strokeLinecap="round" transform={`rotate(${a} 94 86)`} />
        ))}
        {/* 06:30 → hora ~195°, minuto 180° */}
        <line x1="94" y1="86" x2="94" y2="116" stroke={INK} strokeWidth="4.6" strokeLinecap="round" transform="rotate(15 94 86)" />
        <line x1="94" y1="86" x2="94" y2="118" stroke={INK} strokeWidth="4.6" strokeLinecap="round" transform="rotate(180 94 86)" />
        <circle cx="94" cy="86" r="5" fill={RED} />
        <text x="94" y="158" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="24" fill={NAVY}>
          06:30
        </text>
      </g>

      {/* lista de verificación */}
      <g transform="rotate(8 486 210)">
        <rect x="446" y="160" width="84" height="104" fill={WHITE} {...stroke} strokeWidth={2.6} />
        <path d="m456 178 4 4 7-8" stroke={BLUE} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="474" y1="176" x2="520" y2="176" stroke={INK} strokeWidth="2.4" />
        <path d="m456 198 4 4 7-8" stroke={BLUE} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="474" y1="196" x2="520" y2="196" stroke={INK} strokeWidth="2.4" />
        <path d="m456 218 4 4 7-8" stroke={BLUE} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="474" y1="216" x2="520" y2="216" stroke={INK} strokeWidth="2.4" />
        <line x1="456" y1="240" x2="520" y2="240" stroke={INK} strokeWidth="2.4" strokeDasharray="3 5" />
      </g>
    </svg>
  );
}

/* ================= VOTACIÓN ================= */

export function VotacionArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 560 420" className={className} role="img" aria-label="Ilustración: elector tras el biombo deposita su papeleta en la urna">
      <defs>
        <HatchPattern id="vo-hatch" />
        <DotsPattern id="vo-dots" color={NAVY} />
      </defs>

      {/* banderines */}
      <path d="M20 46 Q 280 96 540 40" fill="none" stroke={INK} strokeWidth="2.4" />
      {[
        [70, 56, BLUE], [130, 66, YELLOW], [190, 73, RED], [250, 77, BLUE], [310, 78, YELLOW], [370, 75, BLUE], [430, 68, RED], [490, 58, YELLOW],
      ].map(([x, y, c], i) => (
        <polygon key={i} points={`${x},${y} ${Number(x) + 26},${Number(y) + 3} ${Number(x) + 12},${Number(y) + 26}`} fill={String(c)} stroke={INK} strokeWidth="2" />
      ))}

      {/* biombo con elector */}
      <g>
        <rect x="300" y="150" width="74" height="180" fill={BLUESOFT} {...stroke} />
        <rect x="374" y="130" width="82" height="200" fill={WHITE} {...stroke} />
        <rect x="456" y="150" width="74" height="180" fill={BLUESOFT} {...stroke} />
        {/* elector detrás */}
        <circle cx="415" cy="176" r="24" fill={NAVY} {...stroke} strokeWidth={2.4} />
        <path d="M383 244c0-26 14-40 32-40s32 14 32 40v88h-64z" fill={NAVY} {...stroke} strokeWidth={2.4} />
        {/* brazo con papeleta */}
        <path d="M383 252c-26-4-46-22-52-44l20-10c8 18 22 30 40 34z" fill={NAVY} {...stroke} strokeWidth={2.4} />
        <g className="bob">
          <polygon points="306,196 344,186 352,216 314,226" fill={WHITE} {...stroke} strokeWidth={2.6} />
          <path d="m318 208 4 4 9-10" fill="none" stroke={BLUE} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <path d="M310 168h64M310 156h64" stroke={BLUE} strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* urna blanca */}
      <g>
        <rect x="84" y="216" width="150" height="114" fill={WHITE} {...stroke} />
        <rect x="186" y="216" width="48" height="114" fill="url(#vo-hatch)" />
        <polygon points="70,216 248,216 230,180 88,180" fill={BLUE} {...stroke} />
        <rect x="132" y="190" width="56" height="11" rx="3" fill={INK} />
        <text x="158" y="292" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="26" fill={NAVY}>
          BLANCA
        </text>
      </g>

      {/* urna café pequeña */}
      <g>
        <rect x="252" y="258" width="88" height="72" fill={WHITE} {...stroke} />
        <rect x="252" y="258" width="88" height="72" fill={CAFE} opacity="0.25" />
        <polygon points="244,258 348,258 336,232 256,232" fill={CAFE} opacity="0.75" {...stroke} />
        <rect x="280" y="240" width="32" height="8" fill={INK} />
        <text x="296" y="306" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="17" fill={CAFE}>
          CAFÉ
        </text>
      </g>

      {/* fila de electores */}
      <g>
        <rect x="44" y="336" width="490" height="16" fill="url(#vo-hatch)" />
        {[
          [76, BLUE], [128, NAVY], [180, BLUEMID],
        ].map(([x, c], i) => (
          <g key={i}>
            <circle cx={Number(x)} cy="296" r="13" fill={String(c)} stroke={INK} strokeWidth="2.4" />
            <path d={`M${Number(x) - 17} 336c0-15 8-24 17-24s17 9 17 24z`} fill={String(c)} stroke={INK} strokeWidth="2.4" />
          </g>
        ))}
      </g>

      {/* horario */}
      <g transform="rotate(-4 470 372)">
        <rect x="396" y="348" width="150" height="46" fill={YELLOW} {...stroke} strokeWidth={2.6} />
        <text x="471" y="379" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="22" fill={INK}>
          07:00 – 17:00
        </text>
      </g>

      <rect x="430" y="96" width="90" height="34" fill="url(#vo-dots)" />
    </svg>
  );
}

/* ================= ESCRUTINIO ================= */

export function EscrutinioArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 560 420" className={className} role="img" aria-label="Ilustración: tablero de conteo con palotes y pilas de papeletas clasificadas">
      <defs>
        <HatchPattern id="es-hatch" />
        <DotsPattern id="es-dots" color={YELLOW} />
      </defs>

      {/* lámpara */}
      <line x1="280" y1="0" x2="280" y2="48" stroke={INK} strokeWidth="3" />
      <polygon points="244,86 316,86 300,48 260,48" fill={YELLOW} {...stroke} />
      <polygon points="252,86 308,86 330,150 230,150" fill={YELLOW} opacity="0.18" />

      {/* tablero de palotes */}
      <g>
        <rect x="70" y="56" width="250" height="150" fill={WHITE} {...stroke} />
        <rect x="70" y="56" width="250" height="28" fill={NAVY} />
        <text x="195" y="77" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="18" fill={WHITE}>
          BORRADOR DE ESCRUTINIO
        </text>
        {[96, 136, 176].map((y, r) => (
          <g key={r}>
            {[0, 1, 2, 3].map((i) => (
              <line key={i} x1={92 + i * 9} y1={y} x2={92 + i * 9} y2={y + 30} stroke={BLUE} strokeWidth="3.4" strokeLinecap="round" />
            ))}
            <line x1={86} y1={y + 30} x2={126} y2={y} stroke={BLUE} strokeWidth="3.4" strokeLinecap="round" />
            <line x1={150 + (r % 2) * 6} y1={y} x2={150 + (r % 2) * 6} y2={y + 30} stroke={BLUE} strokeWidth="3.4" strokeLinecap="round" />
            <line x1={159} y1={y} x2={159} y2={y + 30} stroke={BLUE} strokeWidth="3.4" strokeLinecap="round" />
            <text x="230" y={y + 24} fontFamily="Anton, sans-serif" fontSize="24" fill={INK}>
              {["12", "7", "23"][r]}
            </text>
            <rect x="270" y={y + 2} width="36" height="26" fill="none" stroke={RED} strokeWidth="2" strokeDasharray="4 4" />
          </g>
        ))}
      </g>

      {/* mesa */}
      <rect x="40" y="290" width="480" height="22" fill={NAVY} {...stroke} />
      <rect x="64" y="312" width="16" height="84" fill={NAVY} {...stroke} />
      <rect x="480" y="312" width="16" height="84" fill={NAVY} {...stroke} />

      {/* pilas de papeletas */}
      <g>
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={78 + (i % 2) * 4} y={266 - i * 8} width="86" height="12" fill={WHITE} stroke={INK} strokeWidth="2.2" />
        ))}
        <text x="123" y="256" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="15" fill={BLUEMID}>
          BLANCOS
        </text>
      </g>
      <g>
        {[0, 1, 2].map((i) => (
          <rect key={i} x={228 + (i % 2) * 4} y={266 - i * 8} width="86" height="12" fill="#fbe4de" stroke={INK} strokeWidth="2.2" />
        ))}
        <path d="m252 250 8 8m0-8-8 8M282 250l8 8m0-8-8 8" stroke={RED} strokeWidth="2.6" strokeLinecap="round" />
        <text x="271" y="240" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="15" fill={RED}>
          NULOS
        </text>
      </g>
      <g>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={372 + (i % 2) * 4} y={266 - i * 8} width="96" height="12" fill={BLUESOFT} stroke={INK} strokeWidth="2.2" />
        ))}
        <path d="m400 232 5 5 10-11" stroke={BLUE} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <text x="420" y="222" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="15" fill={BLUE}>
          VÁLIDOS
        </text>
      </g>

      {/* lupa */}
      <g>
        <circle cx="452" cy="130" r="46" fill="#fdf1d2" fillOpacity="0.7" {...stroke} />
        <circle cx="452" cy="130" r="46" fill="url(#es-dots)" />
        <line x1="486" y1="164" x2="516" y2="196" stroke={INK} strokeWidth="9" strokeLinecap="round" />
        <path d="m436 130 10 10 20-24" fill="none" stroke={BLUE} strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      <rect x="60" y="380" width="440" height="16" fill="url(#es-hatch)" />
    </svg>
  );
}

/* ================= EMBALAJE ================= */

export function EmbalajeArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 560 420" className={className} role="img" aria-label="Ilustración: paquete electoral sellado con candado, sobres clasificados y entrega a Fuerzas Armadas">
      <defs>
        <HatchPattern id="em-hatch" />
        <DotsPattern id="em-dots" />
      </defs>

      <rect x="20" y="40" width="150" height="90" fill="url(#em-dots)" />

      {/* sobres clasificados */}
      <g transform="rotate(-6 96 208)">
        <rect x="46" y="176" width="104" height="64" fill={BLUE} {...stroke} strokeWidth={2.6} />
        <path d="m46 180 52 36 52-36" fill="none" stroke={WHITE} strokeWidth="2.4" />
        <text x="98" y="232" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="18" fill={WHITE}>C1·C2·C3</text>
      </g>
      <g transform="rotate(5 190 250)">
        <rect x="140" y="222" width="100" height="58" fill={YELLOW} {...stroke} strokeWidth={2.6} />
        <path d="m140 226 50 32 50-32" fill="none" stroke={INK} strokeWidth="2.2" />
        <text x="190" y="272" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="18" fill={INK}>T1 · T5</text>
      </g>
      <g transform="rotate(-4 120 316)">
        <rect x="64" y="288" width="110" height="60" fill={RED} {...stroke} strokeWidth={2.6} />
        <path d="m64 292 55 34 55-34" fill="none" stroke={WHITE} strokeWidth="2.4" />
        <text x="119" y="340" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="18" fill={WHITE}>P1·P2·P3</text>
      </g>

      {/* paquete sellado */}
      <g>
        <rect x="280" y="150" width="200" height="150" fill={BLUESOFT} {...stroke} />
        <rect x="280" y="150" width="200" height="26" fill={BLUE} />
        <rect x="280" y="150" width="200" height="150" fill="none" {...stroke} />
        <rect x="368" y="150" width="24" height="150" fill={NAVY} />
        <path d="M280 226h200" stroke={INK} strokeWidth="2" strokeDasharray="6 6" />
        {/* sello de seguridad rojo */}
        <circle cx="330" cy="226" r="26" fill={RED} {...stroke} strokeWidth={2.6} />
        <circle cx="330" cy="226" r="16" fill="none" stroke={WHITE} strokeWidth="2" strokeDasharray="3 4" />
        <path d="m322 226 6 6 12-13" fill="none" stroke={WHITE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {/* candado plástico */}
        <rect x="412" y="206" width="42" height="36" rx="6" fill={YELLOW} {...stroke} strokeWidth={2.6} />
        <path d="M420 206v-10a13 13 0 0 1 26 0v10" fill="none" {...stroke} strokeWidth={2.6} />
        <circle cx="433" cy="220" r="4.4" fill={INK} stroke="none" />
        <line x1="433" y1="224" x2="433" y2="234" stroke={INK} strokeWidth="3.4" strokeLinecap="round" />
        <text x="380" y="282" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="17" fill={NAVY}>
          PAQUETE ELECTORAL
        </text>
      </g>

      {/* flecha de envío */}
      <g>
        <path d="M470 120c30-8 44 10 40 34" fill="none" stroke={INK} strokeWidth="3.4" strokeLinecap="round" />
        <polygon points="504,160 522,150 512,172" fill={INK} />
      </g>

      {/* vehículo FF.AA. */}
      <g>
        <rect x="330" y="330" width="190" height="44" rx="8" fill={NAVY} {...stroke} />
        <rect x="468" y="306" width="52" height="34" rx="6" fill={NAVY} {...stroke} />
        <rect x="478" y="312" width="30" height="18" fill={BLUESOFT} stroke={INK} strokeWidth="2" />
        <path d="M344 340l10 10 18-20 18 20 10-10" fill="none" stroke={YELLOW} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="376" cy="380" r="17" fill={INK} />
        <circle cx="376" cy="380" r="7" fill={BLUESOFT} />
        <circle cx="482" cy="380" r="17" fill={INK} />
        <circle cx="482" cy="380" r="7" fill={BLUESOFT} />
        <path d="M350 310l10-18 10 18z" fill={YELLOW} {...stroke} strokeWidth={2.2} />
      </g>

      <rect x="40" y="392" width="480" height="16" fill="url(#em-hatch)" />
    </svg>
  );
}

/* ================= PAPELETAS: BLANCO / NULO / VÁLIDO ================= */

export function BallotDiagram({ kind }: { kind: "blanco" | "nulo" | "valido" }) {
  return (
    <svg viewBox="0 0 150 190" className="w-full" role="img" aria-label={`Papeleta de ejemplo: voto ${kind}`}>
      <defs>
        <HatchPattern id={`bp-${kind}`} />
      </defs>
      <rect x="10" y="8" width="130" height="174" fill={WHITE} {...stroke} strokeWidth={2.6} />
      <rect x="10" y="8" width="130" height="26" fill={kind === "nulo" ? "#fbe4de" : BLUESOFT} stroke={INK} strokeWidth="2" />
      <text x="75" y="27" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="14" fill={INK}>
        PAPELETA
      </text>
      {[52, 80, 108, 136].map((y, i) => (
        <g key={y}>
          <rect x="22" y={y - 10} width="20" height="20" fill={i === 1 ? BLUESOFT : WHITE} stroke={INK} strokeWidth="2" />
          <line x1="52" y1={y} x2="100" y2={y} stroke={INK} strokeWidth="2" opacity="0.5" />
          <rect x="110" y={y - 9} width="18" height="18" fill={WHITE} stroke={INK} strokeWidth="2" />
        </g>
      ))}
      {kind === "valido" && (
        <path d="m112 78 6 6 12-14" fill="none" stroke={BLUE} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      )}
      {kind === "nulo" && (
        <g stroke={RED} strokeWidth="3.4" strokeLinecap="round">
          <path d="m110 44 16 16m0-16-16 16" />
          <path d="m110 72 16 16m0-16-16 16" />
          <path d="m110 100 16 16m0-16-16 16" />
          <path d="M30 158c14-12 30 8 46-6s30 4 44-6" fill="none" strokeWidth="2.6" />
        </g>
      )}
      {kind === "blanco" && <rect x="10" y="8" width="130" height="174" fill={`url(#bp-${kind})`} opacity="0.16" />}
    </svg>
  );
}

/* ================= SELLO CIRCULAR GIRATORIO ================= */

export function RotaryStamp({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" className={className} aria-hidden="true">
      <defs>
        <path id="stamp-circle" d="M80 80m-56 0a56 56 0 1 1 112 0a56 56 0 1 1-112 0" fill="none" />
      </defs>
      <circle cx="80" cy="80" r="76" fill={WHITE} stroke={RED} strokeWidth="3" />
      <circle cx="80" cy="80" r="42" fill="none" stroke={RED} strokeWidth="2" strokeDasharray="4 5" />
      <g className="spin-slow">
        <text fontFamily="Archivo, sans-serif" fontWeight="800" fontSize="13.5" letterSpacing="3.2" fill={RED}>
          <textPath href="#stamp-circle">TU VOTO · TU DECISIÓN · SECCIONALES · CPCCS ·</textPath>
        </text>
      </g>
      <text x="80" y="92" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="34" fill={RED}>
        2027
      </text>
    </svg>
  );
}
