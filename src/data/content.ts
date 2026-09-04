export type IconName =
  | "cedula" | "paquete" | "verificar" | "lista" | "urna" | "biombo" | "acta" | "sobre"
  | "boton" | "padron" | "certificado" | "papeleta" | "huella" | "urnaCafe" | "esfero"
  | "noCelular" | "militar" | "infraccion" | "asistida" | "preferente" | "mesaMap"
  | "braille" | "selloBlanco" | "romper" | "organizar" | "contar" | "caratula"
  | "transcribir" | "blanco" | "nulo" | "valido" | "pared" | "leer" | "exhibir"
  | "sumar" | "comparar" | "dictar" | "llenar" | "firmar" | "lamina" | "coordinador"
  | "guardar" | "pegar" | "bolsillos" | "candado" | "selloRojo" | "funda" | "entrega"
  | "flujograma" | "reloj" | "urnaVacia" | "codigo" | "cuadricula" | "selloSeguridad";

export interface StepNote {
  text: string;
}

export interface StepBullet {
  title: string;
  desc: string;
  kind?: "valido" | "nulo" | "blanco" | "neutral";
}

export interface Step {
  n: string;
  text: string;
  note?: string;
  bullets?: StepBullet[];
  icon: IconName;
}

export interface SubBlock {
  id: string;
  label: string;
  title: string;
  intro?: string;
  steps: Step[];
  outro?: string[];
}

/* ================= ETAPA 1 · INSTALACIÓN ================= */

export const instalacionSteps: Step[] = [
  {
    n: "1",
    icon: "cedula",
    text: "Ingrese al recinto electoral a las 06:30 presentando su cédula o pasaporte original y nombramiento a los miembros de las Fuerzas Armadas.",
  },
  {
    n: "2",
    icon: "paquete",
    text: "Reciba el paquete electoral con los sellos de seguridad azules, 2 urnas y 2 biombos por parte de los miembros de las Fuerzas Armadas.",
  },
  {
    n: "3",
    icon: "verificar",
    text: "Revise que los datos del paquete electoral coincidan con los de su junta receptora del voto (JRV).",
  },
  {
    n: "4",
    icon: "lista",
    text: "Verifique el contenido del paquete electoral con el listado de materiales, firme y guarde este listado en el sobre azul C1.",
  },
  {
    n: "5",
    icon: "urna",
    text: "Arme las urnas sin cerrar y pegue las etiquetas. Ubique los biombos armados en un lugar que garantice el voto secreto.",
  },
  {
    n: "6",
    icon: "acta",
    text: "Los miembros de las juntas receptoras del voto presentes firman los 3 ejemplares del acta de instalación donde consta su nombre y número de cédula e invitan a los delegados acreditados a firmar.",
  },
  {
    n: "7",
    icon: "firmar",
    text: "El miembro de la junta receptora del voto (MJRV) que reemplaza en otra junta receptora del voto firma el acta de instalación en la junta que fue designado y en la que reemplaza.",
  },
  {
    n: "8",
    icon: "sobre",
    text: "Guarde el acta amarilla en el sobre T1, acta azul en el sobre C1 y pegue el acta de conocimiento público en un lugar visible.",
  },
  {
    n: "9",
    icon: "boton",
    text: "Los 4 miembros de las juntas receptoras del voto se colocan el botón identificativo y, para receptar el voto, se ubican con el material que van a manejar, en este orden:",
  },
];

export const rolesMJRV = [
  { orden: 1, rol: "Secretario", material: "Padrón electoral, almohadilla dactilar y esfero.", icon: "padron" as IconName },
  { orden: 2, rol: "Presidente", material: "Talonario con certificados y esfero.", icon: "certificado" as IconName },
  { orden: 3, rol: "Vocal", material: "Papeletas seccionales y cera dactilar.", icon: "papeleta" as IconName },
  { orden: 4, rol: "Vocal", material: "Papeletas CPCCS.", icon: "urnaCafe" as IconName },
];

/* ================= ETAPA 2 · VOTACIÓN ================= */

export const votacionSteps: Step[] = [
  {
    n: "1",
    icon: "urnaVacia",
    text: "Exhiba las urnas vacías a los presentes y ciérrelas con la cinta adhesiva.",
  },
  {
    n: "2",
    icon: "cedula",
    text: "El secretario solicita al elector el original de la cédula o pasaporte y verifica que conste en el padrón electoral; si es militar o policía solicita la cédula y la “credencial para votar” y verifica que los datos coincidan.",
    note: "Ante cualquier duda consulte a su coordinador de mesa.",
  },
  {
    n: "3",
    icon: "certificado",
    text: "El presidente ubica el certificado de votación según el número del elector en el padrón electoral.",
  },
  {
    n: "4",
    icon: "papeleta",
    text: "El segundo y el tercer vocal entregan las papeletas de todas las dignidades al elector y le informan que no puede utilizar dispositivos móviles, eléctricos o electrónicos mientras sufraga en el biombo. Los MJRV controlan que el elector NO utilice estos dispositivos.",
  },
  {
    n: "5",
    icon: "urnaCafe",
    text: "El tercer vocal indica el destino de cada papeleta:",
    bullets: [
      { title: "Urna blanca", desc: "Papeletas para la alcaldía, prefectura, concejalías y vocalías de las juntas parroquiales rurales.", kind: "neutral" },
      { title: "Urna café", desc: "Papeletas del CPCCS.", kind: "neutral" },
    ],
  },
  {
    n: "6",
    icon: "huella",
    text: "El secretario recepta la firma o huella dactilar del elector en el padrón electoral y rellena el círculo ubicado a la derecha de la firma. En caso de ser militar o policía pega la “credencial para votar” en la página para militares y policías; y, recepta la firma.",
  },
  {
    n: "7",
    icon: "entrega",
    text: "El presidente firma y entrega el certificado de votación con la cédula o pasaporte al elector. El certificado de votación de militares y policías se llena con los datos de la cédula.",
  },
];

export const votacionAlertas = [
  {
    icon: "militar" as IconName,
    title: "Fuerzas Armadas y Policía",
    text: "En cada junta receptora del voto pueden votar hasta cuatro miembros de las Fuerzas Armadas y Policía Nacional. Para ejercer este derecho se acercan sin portar armas.",
  },
  {
    icon: "noCelular" as IconName,
    title: "Cero dispositivos en el biombo",
    text: "Los electores no podrán hacer uso de dispositivos móviles, eléctricos o electrónicos mientras sufragan en el biombo.",
  },
  {
    icon: "infraccion" as IconName,
    title: "Presunta infracción electoral",
    text: "Si un elector incumple esta disposición, el secretario de la JRV llenará la “Boleta de conocimiento de cometimiento de presunta infracción electoral” con los datos del elector que constan en el padrón; la copia entregará al elector y el original, al coordinador de mesa.",
  },
];

export const inclusionMecanismos = [
  {
    icon: "asistida" as IconName,
    title: "Votación asistida",
    text: "El elector que requiere de ayuda para marcar y/o depositar el voto puede ser asistido por una persona de su confianza.",
  },
  {
    icon: "preferente" as IconName,
    title: "Votación preferencial",
    text: "Las personas con discapacidad, personas adultas mayores, mujeres embarazadas o personas con niños en brazos pasarán directamente a votar sin hacer fila.",
  },
  {
    icon: "mesaMap" as IconName,
    title: "Mesa de Atención Preferente (MAP)",
    text: "Se receptará la votación en la MAP a las personas que por su condición física no pueden trasladarse a la junta receptora del voto en la cual están empadronadas.",
  },
];

export const mapSteps: Step[] = [
  {
    n: "1",
    icon: "mesaMap",
    text: "El personal de la Mesa de Atención Preferente comunica al presidente de la junta receptora del voto que una persona requiere votar.",
  },
  {
    n: "2",
    icon: "padron",
    text: "El presidente suspende las actividades de su junta, recibe la cédula o pasaporte y el secretario verifica que conste en el padrón electoral.",
  },
  {
    n: "3",
    icon: "sobre",
    text: "El presidente toma el padrón electoral, las papeletas de todas las dignidades, el certificado de votación, almohadilla dactilar y los coloca en el sobre de color fucsia. Se traslada a la MAP con custodia militar y acompañado de delegados acreditados.",
  },
  {
    n: "4",
    icon: "papeleta",
    text: "El presidente entrega las papeletas al elector para que sufrague y las recepta en el sobre fucsia.",
  },
  {
    n: "5",
    icon: "urna",
    text: "El presidente recepta la firma o huella dactilar en el padrón electoral, regresa a su junta, deposita las papeletas en las urnas respectivas y reactiva las actividades.",
    note: "Es prohibido sacar los documentos electorales del recinto electoral.",
  },
];

export const brailleNota = {
  title: "Plantilla Braille",
  text: "El personal de la MAP entrega la plantilla Braille al elector con discapacidad visual que la solicite, lo acompaña a su junta receptora del voto hasta que sufrague y retorna a la MAP con la plantilla.",
};

/* ================= ETAPA 3 · ESCRUTINIO ================= */

export const escrutinioIntro =
  "La votación finaliza a las 17:00. El presidente informa a los electores que se encuentran en fila que no pueden votar y les entrega el certificado de presentación.";

export const escrutinioGeneral: Step[] = [
  {
    n: "1",
    icon: "noCelular",
    text: "Los MJRV durante el escrutinio no pueden utilizar dispositivos móviles, eléctricos o electrónicos; excepto el vocal escrutador que realiza la suma de los votos obtenidos. Rompa parcialmente las papeletas no utilizadas de todas las dignidades y guarde en el sobre rojo P2. Asegure con el candado plástico y coloque en el paquete electoral.",
  },
  {
    n: "2",
    icon: "organizar",
    text: "Organice en la mesa el padrón electoral, borradores de escrutinio, actas de escrutinio, talonario con certificados, sello EN BLANCO, cera dactilar, esferos, marcadores y láminas de seguridad.",
  },
  {
    n: "3",
    icon: "selloBlanco",
    text: "El secretario coloca el sello “EN BLANCO” en los espacios sin firmas ni huellas dactilares del padrón electoral y en los certificados de votación no utilizados.",
  },
  {
    n: "4",
    icon: "urna",
    text: "Los vocales abren la urna blanca y clasifican las papeletas por dignidad. Luego separan las papeletas de alcalde y las demás guardan en la urna manteniendo la clasificación.",
  },
  {
    n: "5",
    icon: "contar",
    text: "El secretario y el presidente cuentan las firmas y huellas dactilares que constan en el padrón electoral, incluidas las firmas de militares y policías. Cuentan, mínimo 2 veces, para confirmar que el total sea el mismo.",
  },
  {
    n: "6",
    icon: "caratula",
    text: "El secretario escribe el total de firmas y huellas dactilares en números y letras en los casilleros de la carátula del padrón electoral y firma con el presidente.",
  },
  {
    n: "7",
    icon: "transcribir",
    text: "El secretario y el presidente transcriben el total de firmas y huellas dactilares del padrón electoral en los casilleros respectivos de los borradores de escrutinio y de las actas de escrutinio de todas las dignidades.",
    note: "El conteo y registro de votos se realizará en este orden: alcaldía, prefectura, concejalías y vocalías de las juntas parroquiales rurales.",
  },
];

export const escrutinioAlcalde: Step[] = [
  { n: "8", icon: "contar", text: "Los vocales cuentan las papeletas de alcalde." },
  {
    n: "9",
    icon: "comparar",
    text: "El secretario compara el total de firmas y huellas con el total de papeletas; si no son iguales, cuenta nuevamente y, de persistir la diferencia, procede así:",
    bullets: [
      {
        title: "a. Más papeletas que firmas y huellas",
        desc: "Elimina por sorteo las papeletas excedentes, evitando mirar el voto, las rompe parcialmente y guarda en el paquete electoral. Registra la novedad en observaciones de las actas de escrutinio de la dignidad escrutada.",
        kind: "nulo",
      },
      {
        title: "b. Menos papeletas que firmas y huellas",
        desc: "Busca las faltantes en la urna café. De mantenerse la diferencia, registra el número de papeletas faltantes en observaciones de las actas de escrutinio de la dignidad escrutada y continúan con el escrutinio.",
        kind: "blanco",
      },
    ],
  },
  {
    n: "10",
    icon: "valido",
    text: "Clasifique las papeletas en tres grupos:",
    bullets: [
      { title: "Votos blancos", desc: "Los que no tengan marca alguna.", kind: "blanco" },
      { title: "Votos nulos", desc: "Los que presentan marcas por más de un candidato, binomio o lista; palabras “nulo”, “anulado” o similares; tachaduras que indiquen claramente la voluntad de anular el voto.", kind: "nulo" },
      { title: "Votos válidos", desc: "Los que contengan cualquier marca clara que exprese preferencia por un candidato, binomio o lista.", kind: "valido" },
    ],
  },
  { n: "11", icon: "papeleta", text: "Clasifique los votos válidos por candidato." },
  { n: "12", icon: "pared", text: "El vocal escrutador (segundo o tercer vocal) coloca el borrador de escrutinio en la pared." },
  {
    n: "13",
    icon: "leer",
    text: "El secretario lee en voz alta cada voto blanco, pasa al presidente para que verifique el voto, exhiba la papeleta a los presentes y coloque el sello en blanco en la parte frontal. El vocal escrutador registra el total en el borrador de escrutinio.",
  },
  {
    n: "14",
    icon: "leer",
    text: "El secretario lee en voz alta cada voto nulo, pasa al presidente para que verifique el voto y exhiba la papeleta a los presentes. El vocal escrutador registra el total en el borrador de escrutinio.",
  },
  {
    n: "15",
    icon: "exhibir",
    text: "El secretario lee en voz alta cada voto válido por candidato, pasa al presidente para que verifique el voto y exhiba la papeleta a los presentes. El vocal escrutador registra el total de votos de cada candidato en los casilleros correspondientes del borrador de escrutinio.",
  },
  { n: "16", icon: "sumar", text: "El vocal escrutador suma los votos blancos, votos nulos y votos válidos de cada candidato para obtener la totalidad de los votos." },
  {
    n: "17",
    icon: "comparar",
    text: "El vocal escrutador compara que el total de votos obtenidos sea igual al total de firmas y huellas dactilares. En caso de no coincidir verifica la suma.",
  },
  {
    n: "18",
    icon: "verificar",
    text: "Verifique que el número de firmas y huellas registrado en la carátula del padrón electoral sea igual al número registrado en el borrador de escrutinio y en todas las actas de escrutinio. Seleccione los 3 ejemplares del acta de escrutinio: amarilla, roja y de conocimiento público de la dignidad que se está escrutando.",
  },
  {
    n: "19",
    icon: "dictar",
    text: "El vocal escrutador dicta los totales de votos blancos, votos nulos y votos de cada candidato registrados en el borrador de escrutinio.",
  },
  {
    n: "20",
    icon: "llenar",
    text: "Los otros miembros de la junta receptora del voto llenan los 3 ejemplares del acta de escrutinio, registrando los totales de votos blancos, votos nulos y votos de cada candidato en números y letras.",
  },
  {
    n: "21",
    icon: "firmar",
    text: "El presidente y secretario firman en la parte frontal de los 3 ejemplares del acta de escrutinio. Todos los MJRV y los delegados acreditados firman al final de las actas.",
  },
  { n: "22", icon: "lamina", text: "Coloque la lámina de seguridad sobre los valores numéricos del acta amarilla y roja." },
  {
    n: "23",
    icon: "coordinador",
    text: "Solicite al coordinador de mesa que revise el acta de escrutinio amarilla T1, guárdela en el sobre amarillo T1, entregue al coordinador de mesa y firme el formulario de recibo.",
  },
  { n: "24", icon: "guardar", text: "Guarde el acta de escrutinio roja P1 y el borrador de escrutinio en el sobre rojo P1." },
  {
    n: "25",
    icon: "pegar",
    text: "Pegue el acta de escrutinio de conocimiento público en un lugar visible y entregue una copia a los delegados acreditados.",
  },
  {
    n: "26",
    icon: "bolsillos",
    text: "Guarde las papeletas utilizadas en el sobre rojo P3 de la dignidad escrutada: primer bolsillo los votos válidos; segundo, los nulos; y tercero, los blancos. Cierre y guarde en el paquete electoral.",
  },
];

export const notaDelegados =
  "Los delegados acreditados tienen voz, pero no deciden la calificación del voto ni manipulan los documentos electorales.";

export const cpccsOrden =
  "El conteo y registro de votos se realizará en este orden: representantes de mujeres; representantes de hombres; y, representante de pueblos y nacionalidades indígenas, afroecuatorianos o montubios y ecuatorianos en el exterior.";

export const cpccsMujeres: Step[] = [
  {
    n: "1",
    icon: "urnaCafe",
    text: "Abra la urna café y clasifique las papeletas en representantes de mujeres; hombres; y, pueblos y nacionalidades indígenas, afroecuatorianos o montubios y ecuatorianos en el exterior. Luego separe las papeletas de representantes de mujeres y las demás guarde en la urna manteniendo la clasificación.",
  },
  { n: "2", icon: "contar", text: "Cuente las papeletas de representantes de mujeres." },
  {
    n: "3",
    icon: "comparar",
    text: "El secretario compara el total de firmas y huellas con el total de papeletas; si no son iguales, cuenta nuevamente y, de persistir la diferencia, procede así:",
    bullets: [
      {
        title: "a. Más papeletas que firmas y huellas",
        desc: "Elimina por sorteo las papeletas excedentes, evitando mirar el voto, las rompe parcialmente y guarda en el paquete electoral. Registra la novedad en observaciones de las actas de escrutinio de la dignidad escrutada.",
        kind: "nulo",
      },
      {
        title: "b. Menos papeletas que firmas y huellas",
        desc: "Registra el número de papeletas faltantes en observaciones de las actas de escrutinio de la dignidad escrutada y continúan con el escrutinio.",
        kind: "blanco",
      },
    ],
  },
  {
    n: "4",
    icon: "valido",
    text: "Clasifique las papeletas en tres grupos:",
    bullets: [
      { title: "Votos blancos", desc: "Los que no tengan marca alguna.", kind: "blanco" },
      { title: "Votos nulos", desc: "Los que presentan marcas por más de 3 candidatas; palabras “nulo”, “anulado” o similares; tachaduras que indiquen claramente la voluntad de anular el voto.", kind: "nulo" },
      { title: "Votos válidos", desc: "Los que contengan cualquier marca clara que exprese preferencia hasta por 3 candidatas.", kind: "valido" },
    ],
  },
  { n: "5", icon: "pared", text: "El vocal escrutador (segundo o tercer vocal) coloca el borrador de escrutinio en la pared." },
  {
    n: "6",
    icon: "leer",
    text: "El secretario lee en voz alta cada voto blanco, pasa al presidente para que verifique el voto, exhiba la papeleta a los presentes y coloque el sello en blanco en la parte frontal. El vocal escrutador registra el total en el borrador de escrutinio.",
  },
  {
    n: "7",
    icon: "leer",
    text: "El secretario lee en voz alta cada voto nulo, pasa al presidente para que verifique el voto y exhiba la papeleta a los presentes. El vocal escrutador registra el total en el borrador de escrutinio.",
  },
  {
    n: "8",
    icon: "codigo",
    text: "El secretario lee en voz alta los votos válidos de cada papeleta, enunciando el código alfanumérico correspondiente a cada candidata, y pasa al presidente para que verifique y exhiba la papeleta a los presentes.",
  },
  {
    n: "9",
    icon: "cuadricula",
    text: "El vocal escrutador registra el voto de cada candidata en el borrador de escrutinio, en las cuadrículas correspondientes al código alfanumérico, formando cuadrículas de 5 votos.",
  },
  {
    n: "10",
    icon: "sumar",
    text: "El vocal escrutador suma los votos registrados en las cuadrículas, en forma horizontal, para obtener el total de votos de cada candidata.",
  },
  {
    n: "11",
    icon: "acta",
    text: "Seleccione los 3 ejemplares del acta de escrutinio: amarilla, roja y de conocimiento público de la dignidad que se está escrutando.",
  },
  {
    n: "12",
    icon: "dictar",
    text: "El vocal escrutador dicta los totales de votos blancos, votos nulos y votos de cada candidata de acuerdo con el código alfanumérico registrado en el borrador de escrutinio.",
  },
  {
    n: "13",
    icon: "llenar",
    text: "Los otros miembros de la junta receptora del voto llenan los 3 ejemplares del acta de escrutinio en números y letras, registrando los totales de votos blancos, votos nulos y votos de cada candidata de acuerdo con el código alfanumérico.",
  },
  {
    n: "14",
    icon: "firmar",
    text: "El presidente y secretario firman en la parte frontal de los 3 ejemplares del acta de escrutinio. Todos los MJRV y los delegados acreditados firman al final de las actas.",
  },
  { n: "15", icon: "lamina", text: "Coloque la lámina de seguridad sobre los valores numéricos del acta amarilla y roja." },
  {
    n: "16",
    icon: "coordinador",
    text: "Solicite al coordinador de mesa que revise el acta de escrutinio amarilla T5 y guárdela en el sobre amarillo T5, sin cerrar el sobre.",
  },
  { n: "17", icon: "guardar", text: "Guarde el acta de escrutinio roja P1 y el borrador de escrutinio en el sobre rojo P1." },
  {
    n: "18",
    icon: "bolsillos",
    text: "Guarde las papeletas utilizadas en el sobre rojo P3 Consejeras CPCCS Mujeres: primer bolsillo, votos válidos; segundo, los nulos; y tercero, los blancos. Cierre y guarde en el paquete electoral.",
  },
];

export const cpccsCierre = [
  "Cierre y entregue el sobre amarillo T5 al coordinador de mesa firmando el formulario de recibo.",
  "Pegue el acta de escrutinio de conocimiento público en un lugar visible y entregue una copia a los delegados acreditados.",
];

/* ================= ETAPA 4 · EMBALAJE Y ENVÍO ================= */

export const sobresAzules = [
  { sobre: "C1", contenido: "Listado de materiales, acta de instalación y recibo." },
  { sobre: "C2", contenido: "Padrón electoral." },
  { sobre: "C3", contenido: "Talonario con certificados y formulario de recibo. Material genérico." },
];

export const embalajeChecklist = [
  "Verifique que los sobres azules C contengan todos sus documentos.",
  "Entregue los sobres azules al coordinador de mesa.",
  "Verifique que en el paquete electoral se encuentren guardados todos los sobres rojos P.",
  "Cierre el paquete y asegúrelo con los sellos de seguridad rojos.",
  "Introduzca el paquete en la funda plástica cobertor.",
  "Entregue el paquete electoral, las urnas y los biombos al personal de Fuerzas Armadas.",
  "Guíese en el flujograma de material electoral del paquete y verifique que todos los documentos y materiales estén guardados y entregados.",
];

export const leyendaSobres = [
  { codigo: "C1 · C2 · C3", color: "azul", clase: "bg-blue text-white", detalle: "Documentos de la JRV" },
  { codigo: "T1", color: "amarillo", clase: "bg-yellow text-ink", detalle: "Acta de instalación" },
  { codigo: "T5", color: "amarillo", clase: "bg-yellow text-ink", detalle: "Acta CPCCS" },
  { codigo: "P1 · P2 · P3", color: "rojo", clase: "bg-red text-white", detalle: "Escrutinio y papeletas" },
  { codigo: "MAP", color: "fucsia", clase: "bg-fucsia text-white", detalle: "Sobre fucsia de votación preferente" },
];
