// Lectura del calendario de pico y placa incrustado en las páginas de pyphoy (payload de Next.js).

type Day = { day: number; month: number; year: number; numbers: unknown; scheme?: string; hours: unknown };

/** Une los fragmentos del payload de Next.js (self.__next_f.push([1,"..."])) en un solo texto. */
export function flightText(html: string): string {
  let out = "";
  for (const m of html.matchAll(/self\.__next_f\.push\(\[1,"((?:[^"\\]|\\.)*)"\]\)/g)) out += JSON.parse(`"${m[1]}"`);
  return out;
}

/** Extrae el arreglo JSON que empieza en `start`, respetando strings. */
function sliceArray(txt: string, start: number): string {
  let depth = 0, inStr = false;
  for (let i = start; i < txt.length; i++) {
    const ch = txt[i];
    if (inStr) {
      if (ch === "\\") i++;
      else if (ch === '"') inStr = false;
    } else if (ch === '"') inStr = true;
    else if (ch === "[") depth++;
    else if (ch === "]" && --depth === 0) return txt.slice(start, i + 1);
  }
  throw new Error("arreglo sin cerrar");
}

/** Next.js reemplaza valores repetidos por "$..:data:<i>:<campo>"; los resuelve contra el mismo arreglo. */
function resolve(days: Day[], value: unknown, field: keyof Day, depth = 0): unknown {
  if (typeof value !== "string" || !value.startsWith("$") || depth > 50) return value;
  const m = value.match(/data:(\d+):(\w+)$/);
  return m ? resolve(days, days[Number(m[1])]?.[m[2] as keyof Day], field, depth + 1) : undefined;
}

export type Regla = {
  ciudad: string;
  slug: string;
  aplica_motos: boolean;
  digito: "primero" | "ultimo";
  calendario: Record<string, number[]>;
  horario: string | null;
};

/** Convierte la página de motos de una ciudad en una fila de pico_placa. */
export function parseCity(slug: string, html: string): Regla {
  const txt = flightText(html);
  const key = '"categoryData":{"data":';
  const i = txt.indexOf(key);
  if (i < 0) throw new Error(`${slug}: sin categoryData`);
  const days: Day[] = JSON.parse(sliceArray(txt, i + key.length));
  const names = [...txt.slice(0, i).matchAll(/"cityName":"([^"]+)"/g)];
  const calendario: Record<string, number[]> = {};
  let first = 0, horario: string | null = null;
  for (const d of days) {
    const nums = resolve(days, d.numbers, "numbers");
    if (d.scheme === "first") first++;
    if (!Array.isArray(nums) || nums.length === 0) continue;
    const iso = `${d.year}-${String(d.month).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`;
    calendario[iso] = nums.map(Number);
    const hours = resolve(days, d.hours, "hours");
    if (!horario && Array.isArray(hours)) {
      const ranges = hours.flatMap((h: { hours?: string[][] }) => h?.hours ?? []);
      horario = ranges.map((r) => `${r[0]}–${r[1]}`).join(", ") || null;
    }
  }
  return {
    ciudad: names.at(-1)?.[1] ?? slug,
    slug,
    aplica_motos: Object.keys(calendario).length > 0,
    digito: first > days.length / 2 ? "primero" : "ultimo",
    calendario,
    horario,
  };
}
