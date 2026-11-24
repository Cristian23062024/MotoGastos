// Recibe una foto de moto (base64), la identifica con Gemini y estima sus costos anuales en Colombia.
// Supabase verifica el JWT del usuario antes de llegar aquí (verify_jwt por defecto), así que solo
// usuarios autenticados consumen la clave de Gemini, que vive como secreto del servidor.

import Anthropic from "npm:@anthropic-ai/sdk";

// "gemini" (por defecto) o "claude". Cambia el proveedor sin tocar la app.
const AI_PROVIDER = Deno.env.get("AI_PROVIDER") ?? "gemini";
const CLAUDE_MODEL = Deno.env.get("CLAUDE_MODEL") || "claude-opus-5-5";
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
// El alias "-latest" sigue al Flash vigente; los modelos con versión fija se retiran con el tiempo.
const FALLBACK_MODEL = "gemini-flash-latest";
const MODELS = [...new Set([Deno.env.get("GEMINI_MODEL") || FALLBACK_MODEL, FALLBACK_MODEL])];
const RETRYABLE = new Set([429, 500, 503]);
const MAX_IMAGE_BASE64 = 8_000_000; // ~6 MB de imagen

const schema = {
  type: "OBJECT",
  properties: {
    es_moto: { type: "BOOLEAN" },
    marca: { type: "STRING" },
    modelo: { type: "STRING" },
    anio: { type: "STRING", description: "Año o rango de años estimado del modelo" },
    cilindraje_cc: { type: "INTEGER" },
    ficha: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: { nombre: { type: "STRING" }, valor: { type: "STRING" } },
        required: ["nombre", "valor"],
      },
    },
    costos: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          concepto: { type: "STRING" },
          valor_cop: { type: "INTEGER" },
          detalle: { type: "STRING" },
        },
        required: ["concepto", "valor_cop", "detalle"],
      },
    },
    supuestos: { type: "STRING" },
  },
  required: ["es_moto", "marca", "modelo", "ficha", "costos", "supuestos"],
};

function prompt() {
  const hoy = new Date().toISOString().slice(0, 10);
  return `Eres un experto en motocicletas y en trámites vehiculares en Colombia. Fecha actual: ${hoy}.
1. Identifica la motocicleta de la imagen (marca, modelo, año o rango, cilindraje). Si la imagen no muestra una motocicleta, responde es_moto=false con listas vacías.
2. En "ficha" da la ficha técnica principal: motor, cilindraje, potencia, torque, transmisión, peso, tanque, consumo aproximado (km/galón), frenos.
3. En "costos" estima el costo ANUAL en pesos colombianos (COP, enteros) de tener esta moto en Colombia, con valores vigentes para el año actual:
   - SOAT (tarifa según cilindraje)
   - Revisión técnico-mecánica (indica en el detalle si aún no aplica por ser moto nueva)
   - Impuesto vehicular (indica si no aplica, p. ej. motos de 125 cc o menos)
   - Gasolina (asume 10.000 km al año y el consumo del modelo)
   - Mantenimiento preventivo (aceite, filtros, ajustes)
   - Llantas y kit de arrastre (prorrateado al año)
   Usa valor_cop=0 para lo que no aplique.
4. En "supuestos" resume en una o dos frases los supuestos usados (km/año, precio del galón, etc.).`;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// El esquema de Gemini (tipos en mayúscula) traducido a JSON Schema para Claude, que exige
// tipos en minúscula y additionalProperties:false en cada objeto.
function toJsonSchema(node: any): any {
  if (Array.isArray(node)) return node.map(toJsonSchema);
  if (!node || typeof node !== "object") return node;
  const out: any = {};
  for (const [k, v] of Object.entries(node)) {
    out[k] = k === "type" ? String(v).toLowerCase() : toJsonSchema(v);
  }
  if (out.type === "object") out.additionalProperties = false;
  return out;
}

type Result = { data: unknown } | { error: string; status: number };

async function analyzeWithClaude(image: string, mimeType: string): Promise<Result> {
  if (!Deno.env.get("ANTHROPIC_API_KEY")) return { error: "ANTHROPIC_API_KEY no configurada", status: 500 };
  if (mimeType === "image/heic") return { error: "Claude no acepta HEIC; usa JPEG o PNG", status: 400 };
  const client = new Anthropic(); // lee ANTHROPIC_API_KEY; reintenta 429/5xx por su cuenta
  try {
    const res = await client.beta.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 16000,
      // Si un clasificador de seguridad rechaza la petición, la API la reintenta con otro modelo.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: {
        effort: "medium",
        format: { type: "json_schema", schema: toJsonSchema(schema) },
      },
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mimeType as "image/jpeg", data: image } },
          { type: "text", text: prompt() },
        ],
      }],
    });
    if (res.stop_reason === "refusal") return { error: "La IA rechazó analizar esta imagen", status: 422 };
    if (res.stop_reason === "max_tokens") return { error: "La respuesta de la IA quedó incompleta", status: 502 };
    const text = res.content.find((b) => b.type === "text");
    return { data: JSON.parse(text && text.type === "text" ? text.text : "") };
  } catch (e) {
    console.error("Claude error", e);
    if (e instanceof Anthropic.RateLimitError || (e instanceof Anthropic.APIError && (e.status ?? 0) >= 500)) {
      return { error: "La IA está saturada en este momento. Intenta de nuevo en unos minutos.", status: 503 };
    }
    return { error: "Error al consultar la IA", status: 502 };
  }
}

async function analyzeWithGemini(image: string, mimeType: string): Promise<Result> {
  if (!GEMINI_API_KEY) return { error: "GEMINI_API_KEY no configurada", status: 500 };
  const body = JSON.stringify({
    contents: [{ parts: [{ inline_data: { mime_type: mimeType, data: image } }, { text: prompt() }] }],
    generationConfig: { responseMimeType: "application/json", responseSchema: schema, temperature: 0.2 },
  });

  // Gemini devuelve 503/429 cuando está saturado: reintenta con espera y luego prueba el modelo de respaldo.
  let res: Response | undefined;
  for (const model of MODELS) {
    for (let attempt = 0; attempt < 3; attempt++) {
      if (attempt > 0) await new Promise((r) => setTimeout(r, 1500 * attempt));
      res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": GEMINI_API_KEY },
        body,
      });
      if (res.ok) break;
      console.error("Gemini error", model, res.status, await res.text());
      if (!RETRYABLE.has(res.status)) break;
    }
    if (res?.ok) break;
  }
  if (!res!.ok) {
    return RETRYABLE.has(res!.status)
      ? { error: "La IA está saturada en este momento. Intenta de nuevo en unos minutos.", status: 503 }
      : { error: `Error al consultar la IA (${res!.status})`, status: 502 };
  }

  const data = await res!.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  try {
    return { data: JSON.parse(text) };
  } catch {
    console.error("Respuesta de Gemini no es JSON", text);
    return { error: "La IA devolvió una respuesta inválida", status: 502 };
  }
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405);

  let image: string, mimeType: string;
  try {
    ({ image, mimeType } = await req.json());
  } catch {
    return json({ error: "JSON inválido" }, 400);
  }
  if (typeof image !== "string" || !image || image.length > MAX_IMAGE_BASE64) {
    return json({ error: "Imagen ausente o demasiado grande" }, 400);
  }
  if (!["image/jpeg", "image/png", "image/webp", "image/heic"].includes(mimeType)) {
    return json({ error: "Formato de imagen no soportado" }, 400);
  }

  const result = AI_PROVIDER === "claude"
    ? await analyzeWithClaude(image, mimeType)
    : await analyzeWithGemini(image, mimeType);
  return "data" in result ? json(result.data) : json({ error: result.error }, result.status);
});
