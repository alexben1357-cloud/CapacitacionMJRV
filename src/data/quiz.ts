/* Banco de 32 preguntas de opción múltiple (Instalación, Sufragio y Escrutinio).
   `a` = índice de la respuesta correcta dentro de `opts`. */

export interface QuizQ {
  q: string;
  opts: string[];
  a: number;
}

export const QUESTION_BANK: QuizQ[] = [
  {
    q: "¿A qué hora deben ingresar los Miembros de la Junta Receptora del Voto (MJRV) al recinto electoral?",
    opts: ["06:00 AM", "06:30 AM", "07:00 AM", "07:30 AM"],
    a: 1,
  },
  {
    q: "¿Cuántos ejemplares del Acta de Instalación deben firmar los MJRV y los delegados de las organizaciones políticas?",
    opts: ["1 ejemplar", "2 ejemplares", "3 ejemplares", "4 ejemplares"],
    a: 2,
  },
  {
    q: "¿En qué sobre se guarda el listado de verificación del paquete electoral y el Acta de Instalación en ejemplar azul?",
    opts: ["Sobre Amarillo T1", "Sobre Azul C1", "Sobre Rojo P1", "Sobre Fucsia"],
    a: 1,
  },
  {
    q: "¿A quién se le entregan las urnas y el paquete electoral al inicio de la jornada?",
    opts: ["Al Coordinador de Mesa", "A la Policía Nacional", "A las Fuerzas Armadas (FF.AA.)", "Al Presidente del CNE"],
    a: 2,
  },
  {
    q: "¿Qué integrante de la mesa es responsable de manejar el Padrón Electoral, la almohadilla dactilar y tomar las firmas/huellas?",
    opts: ["Presidente", "Secretario", "Primer Vocal", "Segundo Vocal"],
    a: 1,
  },
  {
    q: "¿Qué integrante de la mesa administra el talonario con los certificados de votación?",
    opts: ["Presidente", "Secretario", "Primer Vocal", "Segundo Vocal"],
    a: 0,
  },
  {
    q: "¿Qué material entrega el Primer Vocal al elector para las dignidades de la Urna Blanca?",
    opts: [
      "Certificado de votación y esfero",
      "Papeletas seccionales y cera dactilar",
      "Papeletas CPCCS",
      "Padrón Electoral",
    ],
    a: 1,
  },
  {
    q: "¿A qué hora inicia y finaliza oficialmente la fase de votación/sufragio?",
    opts: ["De 06:30 a 16:30", "De 07:00 a 17:00", "De 07:00 a 18:00", "De 08:00 a 17:00"],
    a: 1,
  },
  {
    q: "¿En qué urna se depositan las papeletas para Alcalde, Prefecto, Concejales y Juntas Parroquiales?",
    opts: ["Urna Café", "Urna Fucsia", "Urna Blanca", "Urna Transparente"],
    a: 2,
  },
  {
    q: "¿En qué urna se depositan las papeletas correspondientes a los Consejeros del CPCCS?",
    opts: ["Urna Blanca", "Urna Café", "Urna Azul", "Urna Amarilla"],
    a: 1,
  },
  {
    q: "¿Qué documento debe presentar un militar o policía en activo para poder votar?",
    opts: [
      "Únicamente la cédula de ciudadanía",
      "Pase militar y cédula",
      "Cédula de ciudadanía y la “Credencial para votar”",
      "Nombramiento del CNE",
    ],
    a: 2,
  },
  {
    q: "¿Qué procedimiento debe realizar el Secretario si un elector incumple la prohibición de usar teléfono celular o cámara en el biombo?",
    opts: [
      "Llenar la “Boleta de cometimiento de infracción electoral”",
      "Anular el voto inmediatamente",
      "Retener la cédula del ciudadano",
      "Expulsar al ciudadano del recinto sin certificado",
    ],
    a: 0,
  },
  {
    q: "¿Cuál de las siguientes personas puede hacer uso de la Votación Preferencial sin hacer fila?",
    opts: [
      "Solo los brigadistas políticos",
      "Personas con discapacidad, adultos mayores y embarazadas",
      "Únicamente miembros de las FF.AA.",
      "Estudiantes universitarios",
    ],
    a: 1,
  },
  {
    q: "¿En qué sobre guarda el Presidente el padrón, papeletas y certificado cuando debe trasladarse a la Mesa de Atención Preferente (MAP)?",
    opts: ["Sobre Azul C2", "Sobre Amarillo T1", "Sobre Fucsia", "Sobre Rojo P1"],
    a: 2,
  },
  {
    q: "Al trasladarse a la Mesa de Atención Preferente (MAP), ¿quién debe custodiar al Presidente de la JRV?",
    opts: [
      "Los delegados de partidos",
      "El Coordinador de Recinto",
      "Personal de las Fuerzas Armadas",
      "El Secretario de la junta",
    ],
    a: 2,
  },
  {
    q: "¿Cuál es el orden estricto de conteo de dignidades al iniciar el escrutinio a partir de las 17:00?",
    opts: [
      "CPCCS, Alcalde, Prefecto, Concejales, Juntas Parroquiales",
      "Prefecto, Alcalde, Concejales, Juntas Parroquiales, CPCCS",
      "1° Alcalde, 2° Prefecto, 3° Concejales, 4° Juntas Parroquiales, 5° CPCCS",
      "Juntas Parroquiales, Concejales, Prefecto, Alcalde, CPCCS",
    ],
    a: 2,
  },
  {
    q: "¿Qué se debe hacer con las papeletas que no fueron utilizadas al cierre de la votación?",
    opts: [
      "Desecharlas en la basura",
      "Inutilizarlas (romperlas parcialmente) y guardarlas en el sobre rojo P2",
      "Guardarlas en el sobre amarillo T1",
      "Dejarlas dentro de la urna vacía",
    ],
    a: 1,
  },
  {
    q: "¿Qué sello debe colocar el Secretario en los casilleros del Padrón Electoral donde los ciudadanos no acudieron a votar?",
    opts: ["Sello “NO VOTÓ”", "Sello “EN BLANCO”", "Sello “INHABILITADO”", "Sello “NULO”"],
    a: 1,
  },
  {
    q: "¿Cuántas veces como mínimo se deben contar las firmas y huellas marcadas en el Padrón Electoral antes de abrir las urnas?",
    opts: ["1 vez", "2 veces", "3 veces", "No es necesario contarlas"],
    a: 1,
  },
  {
    q: "Si al contar las papeletas dentro de la urna se detecta un excedente con respecto al número de votantes del padrón, ¿cuál es el procedimiento correcto?",
    opts: [
      "Anular todo el escrutinio de la mesa",
      "Guardar las sobrantes en el sobre azul sin registrar",
      "Separar al azar el número sobrante, inutilizarlas sin abrirlas y registrarlas en el borrador/acta como excedentes",
      "Sumarle los votos al candidato con menor puntuación",
    ],
    a: 2,
  },
  {
    q: "Si existen actas borrador o actas finales de escrutinio que sobraron (excedentes sin usar), ¿dónde deben guardarse?",
    opts: [
      "En el Sobre Rojo de material inutilizado P2",
      "En el Sobre Amarillo T1",
      "En la funda cobertora exterior",
      "Se entregan sueltas al Coordinador",
    ],
    a: 0,
  },
  {
    q: "¿Cuándo se considera un voto como “VÁLIDO”?",
    opts: [
      "Cuando tiene marcas sobre dos listas distintas",
      "Cuando tiene una marca clara de preferencia por un candidato, binomio o lista",
      "Cuando la papeleta está totalmente limpia",
      "Cuando tiene inscrita la palabra “NULO”",
    ],
    a: 1,
  },
  {
    q: "¿Cuándo se considera un voto como “NULO”?",
    opts: [
      "Cuando se marca una sola casilla de un candidato",
      "Cuando la papeleta no tiene ninguna marca",
      "Cuando se marcan opciones por más de un candidato/lista, o tiene tachaduras/palabras como “NULO”",
      "Cuando se usa un esferográfico azul",
    ],
    a: 2,
  },
  {
    q: "¿Qué marca o sello se aplica a una papeleta en la que el elector no realizó ninguna marca?",
    opts: [
      "Se marca con una “X” azul",
      "Se le coloca el sello “EN BLANCO” en la parte frontal",
      "Se escribe la palabra “ANULADO”",
      "Se le coloca el sello “VÁLIDO”",
    ],
    a: 1,
  },
  {
    q: "En el escrutinio del CPCCS (Urna Café), ¿cuál es el orden correcto de conteo de las tres papeletas?",
    opts: [
      "1. Hombres, 2. Mujeres, 3. Extranjeros",
      "1. Mujeres, 2. Hombres, 3. Pueblos y Nacionalidades / Exterior",
      "1. Pueblos y Nacionalidades, 2. Mujeres, 3. Hombres",
      "Se cuentan las tres simultáneamente",
    ],
    a: 1,
  },
  {
    q: "¿Cuántos votos válidos como máximo puede marcar un ciudadano en la papeleta de CPCCS de Mujeres?",
    opts: ["1 voto", "Hasta 2 votos", "Hasta 3 votos válidos", "Hasta 5 votos"],
    a: 2,
  },
  {
    q: "¿Cuántos votos válidos como máximo se pueden marcar en la papeleta de CPCCS de Pueblos y Nacionalidades / Exterior?",
    opts: ["1 voto válido", "2 votos válidos", "3 votos válidos", "Todos los candidatos de la lista"],
    a: 0,
  },
  {
    q: "¿En qué herramienta registra el vocal escrutador los votos del escrutinio agrupándolos en palotes/cuadrículas de 5?",
    opts: [
      "En el certificado de votación",
      "En el Borrador de Escrutinio (fijado en la pared)",
      "En el Padrón Electoral",
      "En una hoja borrador personal",
    ],
    a: 1,
  },
  {
    q: "¿Qué destino tienen los Sobres Amarillos T (T1 y T5)?",
    opts: [
      "Se introducen dentro de la urna",
      "Se entregan directamente al Coordinador de Mesa/Recinto con recibo",
      "Se entregan a las Fuerzas Armadas",
      "Se queman al finalizar la jornada",
    ],
    a: 1,
  },
  {
    q: "¿Qué elementos se guardan en el Sobre Azul C2?",
    opts: [
      "Las papeletas inutilizadas",
      "El Padrón Electoral utilizado",
      "Las actas de escrutinio borrador",
      "La cera dactilar",
    ],
    a: 1,
  },
  {
    q: "¿A quién se entrega el Paquete Electoral empaquetado, asegurado con sellos rojos y dentro de la funda cobertora?",
    opts: [
      "Al Presidente de la Junta",
      "A los Delegados Políticos",
      "Al personal de las Fuerzas Armadas (FF.AA.)",
      "Al Secretario Municipal",
    ],
    a: 2,
  },
  {
    q: "¿Bajo qué normativa el CNE garantiza el ejercicio pleno de los derechos políticos de las mujeres libres de violencia en la junta?",
    opts: [
      "Código Orgánico Integral Penal únicamente",
      "Código de la Democracia y Resolución Nro. PLE-CNE-6-17-10-2025 (Prevención de la Violencia Política de Género)",
      "Ley de Transporte Terrestre",
      "Reglamento Interno de la Policía Nacional",
    ],
    a: 1,
  },
];
