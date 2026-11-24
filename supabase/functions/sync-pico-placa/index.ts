// Sincroniza el calendario de pico y placa para MOTOS desde pyphoy.com hacia public.pico_placa.
// La llama pg_cron una vez al día con la secret key (ver migración *_sync_pico_placa_cron.sql).
import { withSupabase } from "npm:@supabase/server@1";

import { parseCity, type Regla } from "./parse.ts";

const BASE = "https://www.pyphoy.com";
const HEADERS = { "User-Agent": "MotoGastos/1.0 (sincronizacion diaria de pico y placa)" };

async function get(path: string): Promise<string> {
  const res = await fetch(BASE + path, { headers: HEADERS });
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
  return res.text();
}

export default {
  fetch: withSupabase({ auth: "secret" }, async (_req, ctx) => {
    let slugs: string[];
    try {
      const listado = await get("/colombia/motos");
      slugs = [...new Set([...listado.matchAll(/href="\/([a-z-]+)\/motos"/g)].map((m) => m[1]))];
    } catch (e) {
      return Response.json({ error: `No se pudo leer el listado: ${e}` }, { status: 502 });
    }
    if (slugs.length === 0) return Response.json({ error: "Listado sin ciudades (¿cambió la página?)" }, { status: 502 });

    const rows: (Regla & { nota: string; updated_at: string })[] = [];
    const errores: string[] = [];
    for (const slug of slugs) { // en serie para no saturar al sitio
      try {
        const r = parseCity(slug, await get(`/${slug}/motos`));
        rows.push({ ...r, nota: `Fuente: pyphoy.com/${slug}/motos`, updated_at: new Date().toISOString() });
      } catch (e) {
        errores.push(String(e)); // la ciudad conserva los datos de la última sincronización buena
      }
    }
    const { error } = await ctx.supabaseAdmin.from("pico_placa").upsert(rows, { onConflict: "ciudad" });
    if (error) return Response.json({ error: error.message, errores }, { status: 500 });
    console.log(`pico_placa: ${rows.length} ciudades actualizadas, ${errores.length} errores`, errores);
    return Response.json({ actualizadas: rows.length, errores });
  }),
};
