export type LoadType = "peso_corporal" | "1_garrafa" | "2_garrafas";
export type Pattern = "squat" | "hinge" | "push" | "pull" | "unilateral" | "core";
export type DayType = "A" | "B" | "rest";

export interface Exercise {
  id: string;
  name: string;
  pattern: Pattern;
  sets: number;
  reps: string; // display string, e.g. "10" or "8 / pierna" or "30 seg"
  load: LoadType;
  cue: string;
}

export interface TrainingDay {
  week: number;
  day: number; // 1-7
  type: DayType;
  title: string;
  focus: string;
  durationMin: number;
  note: string;
  exercises: Exercise[];
  warmup?: string[];
  mobility?: string[];
}

export interface Phase {
  id: number;
  weeks: [number, number];
  name: string;
  goal: string;
}

export const PHASES: Phase[] = [
  {
    id: 1,
    weeks: [1, 2],
    name: "Reactivación",
    goal: "Reaprender el patrón con el propio peso corporal. Series moderadas, foco total en técnica y rango de movimiento.",
  },
  {
    id: 2,
    weeks: [3, 4],
    name: "Carga progresiva",
    goal: "Se introducen las garrafas de 6L. Empieza el trabajo unilateral ligero en los días suaves.",
  },
  {
    id: 3,
    weeks: [5, 6],
    name: "Consolidación",
    goal: "Más carga, más unilateral, tempos y pausas. Última etapa antes de pasar a cargas reales de gimnasio.",
  },
];

const PATTERN_LABEL: Record<Pattern, string> = {
  squat: "Sentadilla",
  hinge: "Bisagra de cadera",
  push: "Empuje",
  pull: "Tracción",
  unilateral: "Pierna única",
  core: "Core",
};

export { PATTERN_LABEL };

function ex(
  id: string,
  name: string,
  pattern: Pattern,
  sets: number,
  reps: string,
  load: LoadType,
  cue: string
): Exercise {
  return { id, name, pattern, sets, reps, load, cue };
}

// ---- Semanas 1-2: Reactivación (peso corporal) ----
const week12DayA: Exercise[] = [
  ex("sq", "Sentadilla a silla", "squat", 3, "10", "peso_corporal", "Baja controlado hasta rozar el asiento, rodillas en línea con los pies."),
  ex("hg", "Bisagra de cadera (buenos días)", "hinge", 3, "10", "peso_corporal", "Manos en el pecho, cadera atrás, espalda neutra, mirada al frente."),
  ex("ph", "Flexión inclinada en encimera", "push", 3, "8-10", "peso_corporal", "Cuerpo en línea recta, codos a 45°, baja el pecho hacia el borde."),
  ex("pl", "Remo prono (Superman en W)", "pull", 3, "12", "peso_corporal", "Tumbado boca abajo, aprieta omóplatos al subir brazos en W."),
  ex("lg", "Zancada estática (apoyo en pared)", "unilateral", 3, "8 / pierna", "peso_corporal", "Rodilla trasera casi al suelo, tronco vertical. Si la rodilla de delante protesta, reduce el recorrido."),
  ex("co", "Plancha frontal", "core", 3, "20-30 seg", "peso_corporal", "Cadera alineada, no dejes que caiga ni que suba en exceso."),
];

const week12DayB: Exercise[] = [
  ex("sq", "Sentadilla con tempo (3s bajada)", "squat", 2, "12", "peso_corporal", "Baja en 3 tiempos, sube normal. Sensación de control, no de esfuerzo."),
  ex("hg", "Bisagra con vara imaginaria", "hinge", 2, "12", "peso_corporal", "Manos detrás de la cabeza, empuja cadera atrás sin redondear la espalda."),
  ex("ph", "Flexión de rodillas", "push", 2, "10", "peso_corporal", "Igual que la flexión completa pero apoyando rodillas, cuerpo en línea recta."),
  ex("pl", "Remo prono (Superman en W)", "pull", 2, "15", "peso_corporal", "Ritmo suave, más reps que el día A, sin prisa."),
  ex("lg", "Zancada dinámica en el sitio", "unilateral", 2, "10 / pierna", "peso_corporal", "Alterna piernas sin desplazarte, controla la bajada."),
  ex("co", "Plancha lateral", "core", 2, "15-20 seg / lado", "peso_corporal", "Cadera arriba, línea recta de hombro a pie."),
];

// ---- Semanas 3-4: Carga progresiva (garrafas) ----
const week34DayA: Exercise[] = [
  ex("sq", "Sentadilla goblet", "squat", 3, "10", "1_garrafa", "Garrafa pegada al pecho, codos apuntando al suelo, pecho alto. Baja hasta donde la rodilla esté cómoda, sin forzar profundidad."),
  ex("hg", "Peso muerto rumano bilateral", "hinge", 3, "10", "2_garrafas", "Garrafas cerca de las piernas, rodilla con flexión mínima, empuja cadera atrás."),
  ex("ph", "Flexión estándar en suelo", "push", 3, "8-10", "peso_corporal", "Si no llega, vuelve a la versión inclinada sin problema."),
  ex("pl", "Remo inclinado a dos manos", "pull", 3, "10", "2_garrafas", "Tronco a 45°, tira de las garrafas hacia la cadera, aprieta omóplatos."),
  ex("lg", "Zancada con garrafas", "unilateral", 3, "8 / pierna", "2_garrafas", "Una garrafa a cada lado, torso erguido, paso amplio y estable. Corta el recorrido si la rodilla protesta."),
  ex("co", "Plancha con toques de hombro", "core", 3, "10 toques / lado", "peso_corporal", "Cadera lo más quieta posible mientras tocas el hombro contrario."),
];

const week34DayB: Exercise[] = [
  ex("sq", "Sentadilla goblet (tempo 3s)", "squat", 2, "12", "1_garrafa", "Baja en 3 tiempos con la garrafa al pecho, sube normal."),
  ex("hg", "Peso muerto rumano a una pierna (apoyo)", "unilateral", 2, "8 / pierna", "1_garrafa", "Apóyate en una pared o silla si hace falta equilibrio, cadera cuadrada."),
  ex("ph", "Flexión inclinada o de rodillas", "push", 2, "10", "peso_corporal", "Elige la variante que te permita llegar a buena técnica."),
  ex("pl", "Remo a una mano", "pull", 2, "10 / brazo", "1_garrafa", "Apoya la mano libre en una silla, tira con el codo pegado al cuerpo."),
  ex("lg", "Step-up en escalón bajo", "unilateral", 2, "8 / pierna", "peso_corporal", "Sube con control, no empujes con la pierna de abajo."),
  ex("co", "Puente de glúteo", "core", 2, "15", "peso_corporal", "Aprieta glúteo arriba, evita arquear la zona lumbar."),
];

// ---- Semanas 5-6: Consolidación ----
const week56DayA: Exercise[] = [
  ex("sq", "Sentadilla goblet con pausa", "squat", 4, "8-10", "2_garrafas", "Pausa de 1 segundo abajo antes de subir, hasta donde la rodilla esté cómoda. Sube dos garrafas si el cuerpo lo pide."),
  ex("hg", "Peso muerto rumano a una pierna", "unilateral", 3, "8 / pierna", "1_garrafa", "Versión completa sin apoyo, cadera y hombros cuadrados al frente."),
  ex("ph", "Flexión con pies elevados", "push", 3, "8-10", "peso_corporal", "Pies en un escalón o banco, más exigencia sobre el tren superior."),
  ex("pl", "Remo inclinado con pausa arriba", "pull", 3, "10", "2_garrafas", "1 segundo de pausa arriba apretando omóplatos antes de bajar."),
  ex("lg", "Zancada hacia atrás con garrafas", "unilateral", 3, "8 / pierna", "2_garrafas", "El paso hacia atrás carga menos la rodilla de apoyo que la zancada hacia delante. Corta el recorrido si protesta."),
  ex("co", "Plancha larga", "core", 3, "40 seg", "peso_corporal", "Si dominas los 40 segundos, añade un toque de hombro cada 5 segundos."),
];

const week56DayB: Exercise[] = [
  ex("sq", "Sentadilla goblet", "squat", 3, "12", "1_garrafa", "Ritmo fluido, foco en profundidad completa y control."),
  ex("hg", "Peso muerto rumano bilateral (tempo 3s)", "hinge", 3, "10", "2_garrafas", "Bajada lenta de 3 segundos, sube con normalidad."),
  ex("ph", "Flexión estándar (tempo lento)", "push", 3, "10", "peso_corporal", "3 segundos de bajada, sube explosivo controlado."),
  ex("pl", "Remo a una mano con pausa", "pull", 3, "10 / brazo", "1_garrafa", "Pausa arriba apretando el omóplato antes de soltar."),
  ex("lg", "Step-up con garrafas", "unilateral", 3, "8 / pierna", "2_garrafas", "Sube con la pierna de arriba, evita impulsarte con la de abajo. Escalón bajo si la rodilla anda sensible."),
  ex("co", "Puente de glúteo a una pierna", "core", 3, "12 / pierna", "peso_corporal", "Cadera nivelada, sin rotar hacia el lado libre."),
];

const STANDARD_WARMUP = [
  "Movilidad de cadera: círculos y 90/90, 10 por lado",
  "Gato-camello 10 repeticiones, para despertar la zona lumbar",
  "Puente de glúteo sin peso, 15 repeticiones, activación antes de cargar",
  "2-3 sentadillas al aire muy suaves, sintiendo la rodilla — si protesta, hoy reduce el rango",
];

const restMobility = [
  "Movilidad de cadera 5 min (círculos, 90/90)",
  "Estiramiento de isquiotibiales y gemelos",
  "Paseo suave o rodillo si el cuerpo lo pide",
  "Nada de series ni cronómetro: hoy manda el descanso",
];

function buildWeek(week: number, dayA: Exercise[], dayB: Exercise[], phaseName: string): TrainingDay[] {
  // 4 días de fuerza, 2 días ligeros de técnica, 1 descanso — pensado para 2-3 días de bici/carrera a la semana
  const pattern: DayType[] = ["A", "A", "B", "A", "B", "A", "rest"];
  return pattern.map((type, idx) => {
    const day = idx + 1;
    if (type === "rest") {
      return {
        week,
        day,
        type,
        title: "Descanso",
        focus: "Recuperación",
        durationMin: 10,
        note: "Día libre de fuerza. Aprovecha para caminar, estirar o simplemente descansar antes de la semana siguiente.",
        exercises: [],
        mobility: restMobility,
      };
    }
    const isA = type === "A";
    return {
      week,
      day,
      type,
      title: isA ? "Cuerpo completo — Fuerza" : "Cuerpo completo — Técnica y activación",
      focus: `${phaseName} · ${isA ? "carga y esfuerzo algo mayor" : "reps altas, carga baja"}`,
      durationMin: isA ? 25 : 18,
      note: isA
        ? "Con tus 2-3 días de bici o carrera a la semana, la mayoría de días puedes ir con normalidad aquí. Si coincide con un día duro de bici o series, baja una serie en cada ejercicio. No saltes el calentamiento: es lo que le da tiempo al lumbar."
        : "Colócalo en los días que coincidan con bici o carrera más exigente, o cuando notes las piernas cargadas. Prioriza técnica sobre esfuerzo.",
      exercises: isA ? dayA : dayB,
      warmup: STANDARD_WARMUP,
    };
  });
}

export const PROGRAM: TrainingDay[] = [
  ...buildWeek(1, week12DayA, week12DayB, "Reactivación"),
  ...buildWeek(2, week12DayA, week12DayB, "Reactivación"),
  ...buildWeek(3, week34DayA, week34DayB, "Carga progresiva"),
  ...buildWeek(4, week34DayA, week34DayB, "Carga progresiva"),
  ...buildWeek(5, week56DayA, week56DayB, "Consolidación"),
  ...buildWeek(6, week56DayA, week56DayB, "Consolidación"),
];

export function getDay(week: number, day: number): TrainingDay | undefined {
  return PROGRAM.find((d) => d.week === week && d.day === day);
}

export function getPhaseForWeek(week: number): Phase {
  return PHASES.find((p) => week >= p.weeks[0] && week <= p.weeks[1]) ?? PHASES[0];
}

export const TOTAL_WEEKS = 6;
export const DAYS_PER_WEEK = 7;
export const TOTAL_DAYS = TOTAL_WEEKS * DAYS_PER_WEEK;

export const LOAD_LABEL: Record<LoadType, string> = {
  peso_corporal: "Peso corporal",
  "1_garrafa": "1 garrafa (6 kg)",
  "2_garrafas": "2 garrafas (12 kg)",
};
