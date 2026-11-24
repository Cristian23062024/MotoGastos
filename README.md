# MotoGastos

App móvil para motociclistas en Colombia (Android e iOS). Le tomas una foto a una moto y la app te dice qué modelo es, te muestra su ficha técnica y calcula **cuánto cuesta tenerla al año**: SOAT, revisión técnico-mecánica, impuesto, gasolina, mantenimiento y llantas. Si la moto es tuya, te avisa los días que tienes **pico y placa** y una semana antes de que se venzan el **SOAT** y la **técnico-mecánica**.

> Los costos son estimaciones generadas por IA, no tarifas oficiales. Verifica siempre los valores de SOAT, RTM, impuestos y pico y placa con las fuentes oficiales.

## Características

- **Escaneo con IA:** foto con la cámara o desde la galería. La IA (Gemini o Claude, a elección) identifica la marca, el modelo, el año y el cilindraje.
- **Ficha técnica:** motor, potencia, torque, transmisión, peso, tanque, consumo y frenos.
- **Costo anual estimado** en pesos colombianos, con desglose por concepto, valor mensual y los supuestos usados (por ejemplo, 10.000 km al año).
- **Historial** de todos tus escaneos, guardado en tu cuenta.
- **Mis motos:** marca cualquier escaneo como propio con su placa, la ciudad donde circula y las fechas de vencimiento del SOAT y la técnico-mecánica. Un botón abre la consulta oficial del RUNT.
- **Pico y placa por ciudad:** más de 30 ciudades, con la restricción de hoy, los próximos 7 días y el horario. Los datos se actualizan solos cada día.
- **Notificaciones:**
  - Pico y placa a las 6:00 a. m. del día en que le toca a tu moto.
  - SOAT y técnico-mecánica a las 9:00 a. m., una semana antes del vencimiento.
- **Acceso sin contraseña:** enlace mágico al correo, Google o GitHub.
- Interfaz Material 3 en español, con modo claro y oscuro según el sistema.

## Tecnologías

| Capa | Tecnología |
|---|---|
| App móvil | Flutter (Dart), Material 3 |
| Autenticación | Supabase Auth: magic link y OAuth con Google y GitHub |
| Base de datos | Supabase Postgres con Row Level Security |
| Backend | Supabase Edge Functions (Deno) |
| IA | Google Gemini o Anthropic Claude, con salida JSON estructurada |
| Tareas programadas | `pg_cron` + `pg_net` y Supabase Vault |
| Notificaciones | `flutter_local_notifications` (locales, sin servidor de push) |

## Arquitectura

```
                         ┌──────────────────────────── Supabase ────────────────────────────┐
 ┌──────────────┐  JWT   │  Edge Function analyze-moto ──► Gemini / Claude                  │
 │  App Flutter │ ─────► │                                                                  │
 │ (Android/iOS)│        │  Postgres + RLS                                                  │
 │              │ ◄────► │   ├─ scans       (escaneos y "mis motos" de cada usuario)        │
 │ avisos       │        │   └─ pico_placa  (calendario por ciudad, solo lectura)           │
 │ locales      │        │            ▲                                                     │
 └──────────────┘        │  pg_cron (4:00 a. m.) ──► Edge Function sync-pico-placa ──► pyphoy.com
                         └──────────────────────────────────────────────────────────────────┘
```

- **Claves de IA:** la app nunca ve la clave de la IA. Envía la foto a la Edge Function `analyze-moto`, que solo atiende a usuarios con sesión iniciada y guarda la clave como secreto del servidor.
- **Base de datos:** cada usuario solo puede leer, crear, editar y borrar sus propios escaneos (RLS). No se guardan fotos, solo los datos del análisis.
- **Notificaciones:** se programan en el propio teléfono y se recalculan cada vez que abres la app o cambias los datos de una moto.

## Requisitos

- [Flutter](https://docs.flutter.dev/get-started/install) 3.x (incluye Dart). Comprueba la instalación con `flutter doctor`.
- Android Studio con un emulador o un teléfono Android. Para iOS hace falta un Mac con Xcode.
- [Node.js](https://nodejs.org/) 20 o superior, para usar la Supabase CLI con `npx`.
- Una cuenta en [Supabase](https://supabase.com/) (el plan gratuito es suficiente).
- Una clave de [Gemini](https://aistudio.google.com/apikey) o de [Claude](https://console.anthropic.com/).

## Instalación y ejecución

### 1. Clonar e instalar dependencias

```bash
git clone https://github.com/Cristian23062024/MotoGastos.git
cd MotoGastos
flutter pub get
```

### 2. Configurar Supabase

Crea un proyecto en Supabase y vincúlalo. En la CLI v3, los comandos que actúan sobre el proyecto en la nube llevan `--remote`.

```bash
npx supabase login
npx supabase link --project-ref <tu-project-ref>
npx supabase db push --remote          # crea las tablas, la seguridad y el cron diario
```

### 3. Desplegar las Edge Functions

```bash
cp supabase/functions/.env.example supabase/functions/.env
# Edita supabase/functions/.env con tu proveedor de IA y su clave (ver tabla abajo)

npx supabase secrets set --env-file supabase/functions/.env
npx supabase functions deploy analyze-moto
npx supabase functions deploy sync-pico-placa
```

### 4. Activar la sincronización de pico y placa

En el **SQL Editor** de Supabase, guarda tu secret key (`sb_secret_...`, en *Project Settings › API Keys*) en Vault. El cron diario la usa para llamar a la función:

```sql
select vault.create_secret('sb_secret_...', 'supabase_secret_key');
```

Para cargar los datos en este momento, sin esperar al cron de las 4:00 a. m.:

```bash
curl -X POST https://<tu-project-ref>.supabase.co/functions/v1/sync-pico-placa -H "apikey: sb_secret_..."
```

### 5. Configurar el inicio de sesión

Las tres opciones de acceso vuelven a la app por el deep link `com.motogastos.motogastos://login-callback`, que ya está configurado en Android e iOS. En el panel de Supabase:

1. **Authentication › URL Configuration › Redirect URLs:** agrega `com.motogastos.motogastos://login-callback`.
2. **Authentication › Sign In / Providers › Google:** actívalo con el Client ID y el Secret de un cliente OAuth de tipo *Web application* en Google Cloud. Su *Authorized redirect URI* debe ser `https://<tu-project-ref>.supabase.co/auth/v1/callback`.
3. **Authentication › Sign In / Providers › GitHub:** crea una OAuth App en GitHub (*Settings › Developer settings*) con la misma *callback URL* y pega el Client ID y el Secret.

### 6. Ejecutar la app

```bash
cp .env.example .env
# Completa SUPABASE_URL y SUPABASE_PUBLISHABLE_KEY (Project Settings › API Keys)

flutter devices                              # ver emuladores y teléfonos conectados
flutter run --dart-define-from-file=.env
```

Con la app en marcha, en la terminal: `r` recarga en caliente, `R` reinicia y `q` cierra.

> Si ejecutas sin `--dart-define-from-file=.env`, la app abre una pantalla avisando que falta la configuración.

## Variables de entorno

**App (`.env`).** Estos valores se compilan dentro de la app, así que pon solo valores públicos.

| Variable | Descripción |
|---|---|
| `SUPABASE_URL` | URL del proyecto (`https://<ref>.supabase.co`) |
| `SUPABASE_PUBLISHABLE_KEY` | Publishable key (`sb_publishable_...`) o la anon key antigua |

**Edge Functions (`supabase/functions/.env`).** Son secretos del servidor y se suben con `supabase secrets set`.

| Variable | Descripción |
|---|---|
| `AI_PROVIDER` | `gemini` (por defecto) o `claude` |
| `GEMINI_API_KEY` | Clave de Google AI Studio |
| `GEMINI_MODEL` | Opcional. Por defecto `gemini-flash-latest` |
| `ANTHROPIC_API_KEY` | Clave de Anthropic, si `AI_PROVIDER=claude` |
| `CLAUDE_MODEL` | Opcional. Por defecto `claude-opus-5-5` |

Para cambiar de proveedor de IA, edita `AI_PROVIDER` y vuelve a ejecutar `supabase secrets set`. No hace falta tocar la app.

## Pruebas y compilación

```bash
flutter analyze                                        # análisis estático
flutter test                                           # todas las pruebas
flutter test test/pico_placa_test.dart                 # un archivo
flutter build apk --release --dart-define-from-file=.env     # APK de Android
flutter build ios --release --dart-define-from-file=.env     # iOS (requiere Mac)
```

## Estructura del proyecto

```
lib/
├── main.dart              Arranque: Supabase, notificaciones y redirección login/inicio
├── scan.dart              Modelo Scan y llamadas a Supabase (analizar, listar, mi moto, borrar)
├── pico_placa.dart        Calendario de pico y placa por ciudad
├── notifications.dart     Programación de avisos locales
└── screens/
    ├── login_screen.dart        Magic link, Google y GitHub
    ├── shell.dart               Navegación inferior y menú de cuenta (cerrar sesión)
    ├── home_screen.dart         Historial y botones de cámara/galería
    ├── scan_detail_screen.dart  Costos, ficha técnica y formulario "Mi moto"
    └── pico_placa_screen.dart   Restricción por ciudad
supabase/
├── config.toml            Configuración de funciones (verify_jwt)
├── migrations/            Esquema de la base de datos, seguridad (RLS) y cron
└── functions/
    ├── analyze-moto/      Identificación y costos con Gemini o Claude
    └── sync-pico-placa/   Sincronización diaria desde pyphoy.com
test/                      Pruebas unitarias
android/, ios/             Proyectos nativos (permisos, deep links, notificaciones)
```

## Fuentes de datos y limitaciones

- **Costos:** los estima la IA con valores aproximados del año en curso. No son cotizaciones.
- **Pico y placa:** sale del calendario que publica [pyphoy.com](https://www.pyphoy.com/colombia/motos), un sitio independiente y no una fuente oficial.
  - Cubre unos 30 días hacia adelante y ya descuenta los festivos.
  - Si el sitio cambia o falla, cada ciudad conserva los últimos datos buenos y la app muestra "Sin datos" cuando el calendario se queda viejo.
  - Barranquilla y Manizales no aparecen en esa fuente y quedan sin datos.
- **SOAT y técnico-mecánica:** el RUNT no tiene una API pública gratuita, así que las fechas se escriben a mano. El botón *Consultar en el RUNT* abre la consulta oficial.
- **Notificaciones:** se programan en el teléfono y se reprograman al abrir la app. iOS permite como máximo 64 avisos pendientes, así que se programan los 60 más próximos. La app asume la hora de Colombia.
- **Magic link:** debe abrirse en el mismo teléfono donde se pidió. En el plan gratuito, el correo integrado de Supabase permite pocos envíos por hora.

## Solución de problemas

| Síntoma | Causa y solución |
|---|---|
| "La IA está saturada…" | El proveedor de IA respondió 503 o 429. Espera unos minutos o cambia a `AI_PROVIDER=claude`. |
| Pantalla "Faltan SUPABASE_URL…" | Ejecuta con `--dart-define-from-file=.env` y revisa que `.env` tenga los dos valores. |
| El magic link o Google no vuelven a la app | Falta `com.motogastos.motogastos://login-callback` en *Redirect URLs* de Supabase. |
| No llega el correo de acceso | Límite de envíos del plan gratuito. Espera o configura un SMTP propio en Supabase. |
| Pico y placa muestra "Sin datos" | No se ha ejecutado la sincronización. Revisa el secreto en Vault (paso 4) y los logs de `sync-pico-placa`. |
| `supabase db push` intenta conectarse a `127.0.0.1` | En la CLI v3 hay que agregar `--remote` para actuar sobre el proyecto en la nube. |

## Seguridad

- `.env` y `supabase/functions/.env` están en `.gitignore`. Nunca subas claves al repositorio.
- La app solo incluye la URL y la publishable key de Supabase, que son públicas por diseño. La seguridad la garantizan las políticas RLS de la base de datos.
- Las claves de la IA viven como secretos de las Edge Functions. La secret key de Supabase que usa el cron vive en Vault, nunca en el SQL ni en el código.
- La función `sync-pico-placa` solo acepta llamadas con la secret key, y `analyze-moto` solo acepta usuarios con sesión iniciada.
