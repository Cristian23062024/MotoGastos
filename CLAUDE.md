# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

MotoGastos: Flutter app (Android + iOS only) for motorcyclists in Colombia. User photographs a bike (camera or gallery) → Gemini identifies it and estimates yearly costs in COP (SOAT, tecnomecánica, impuesto, gasolina, mantenimiento…) → result saved per user in Supabase. UI text is Spanish only.

## Commands

```bash
flutter pub get
flutter run --dart-define-from-file=.env    # .env must define SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY
flutter test                                 # single test: flutter test test/widget_test.dart --plain-name "<name>"
flutter analyze
flutter build apk --debug --dart-define-from-file=.env

supabase db push --remote                    # CLI v3: without --remote it targets the local stack
supabase functions deploy analyze-moto
supabase functions deploy sync-pico-placa
supabase secrets set --env-file supabase/functions/.env   # AI_PROVIDER (gemini|claude), GEMINI_API_KEY, GEMINI_MODEL, ANTHROPIC_API_KEY, CLAUDE_MODEL
```

Without the dart-defines the app shows a "missing config" screen instead of crashing.

## Architecture

- **Gemini is never called from the app.** `lib/scan.dart` `analyzeAndSave()` sends the base64 image to the `analyze-moto` Edge Function (`supabase/functions/analyze-moto/index.ts`, Deno), which holds `GEMINI_API_KEY` and uses Gemini structured output (`responseSchema`). Supabase's default JWT verification restricts it to logged-in users. Do not move the key into the app or `.env`.
- The function returns JSON with Spanish field names (`es_moto, marca, modelo, anio, cilindraje_cc, ficha[{nombre,valor}], costos[{concepto,valor_cop,detalle}], supuestos`). The same shape is the `public.scans` row (`supabase/migrations/`), plus `total_anual_cop`. `Scan.fromJson` parses both; changing the schema means updating the function schema, the migration (new migration file) and `Scan` together.
- The app inserts the row itself via the Supabase client; RLS policies (select/insert/delete own rows, `user_id default auth.uid()`) enforce ownership. Only data is stored, no images.
- `lib/main.dart`: `StreamBuilder` on `auth.onAuthStateChange` switches between `LoginScreen` (magic link, Google/GitHub OAuth; no password) and `MainShell`, which owns the scans list and the selected scan and switches 4 tabs: `ListadoScreen` (tap → Gastos), `EscanearScreen` (in-app `camera` viewfinder + gallery; only built while visible so the camera is released), `GastosScreen` (estimated annual cost of the selected scan + "Mi moto" owner form) and `PicoPlacaScreen` (today/next days per city + SOAT/RTM due cards). `AccountMenu` (avatar in `AppHeader`) signs out and cancels notifications.
- UI follows the mockups in `Diseño/` (gitignored) and the "Apex Telemetry" tokens in `Diseño/apex_telemetry/DESIGN.md`: dark-only theme in `lib/theme.dart` (`AppColors`, `mono()`/`grotesk()` text helpers, google_fonts fetched at runtime) and shared widgets in `lib/widgets.dart` (`AppHeader`, `StatusPill`, `MonoLabel`, `IconTile`, `SectionHeader`, `EmptyState`). Reuse them instead of ad-hoc styling.
- This Flutter version deprecates `package:flutter/material.dart`; import `package:material_ui/material_ui.dart` instead. Supabase init uses `publishableKey` (`anonKey` is deprecated).
- Magic link and OAuth return through the deep link `com.motogastos.motogastos://login-callback` (Android intent-filter in `AndroidManifest.xml`, iOS `CFBundleURLTypes` in `Info.plist`); supabase_flutter handles it automatically. The URL must also be in Supabase's Redirect URLs allowlist.
- The function has two providers selected by the `AI_PROVIDER` secret: Gemini (raw fetch, `responseSchema`) and Claude (`npm:@anthropic-ai/sdk`, `output_config.format` json_schema). Claude's schema is derived from the Gemini `schema` by `toJsonSchema()`, so edit only `schema`.
- "Mi moto" = a `scans` row with `placa` set (plus `ciudad` FK to `pico_placa`, `soat_vence`, `rtm_vence`). Pico y placa lives in the `pico_placa` table (read-only to users): `calendario` is a JSON map ISO date → restricted digits (not a weekly table: cities like Pasto rotate weekly, Turbaco alternates even/odd, holidays are already excluded), `digito` says first or last plate digit. It is filled daily by the `sync-pico-placa` Edge Function (pg_cron + pg_net, `auth: 'secret'` via `@supabase/server`, secret key in Vault as `supabase_secret_key`), which parses the Next.js flight payload (`categoryData`) of pyphoy.com pages in `parse.ts`; values deduplicated as `"$..:data:<i>:<field>"` refs are resolved there. `verify_jwt = false` for that function is set in `supabase/config.toml`.
- Notifications are local (`flutter_local_notifications`), not push. `refreshNotifications()` cancels everything and reschedules from current data: one-shot pico y placa at 6:00 for each restricted calendar date, SOAT/RTM at 9:00 seven days before expiry, capped to the 60 nearest (iOS keeps 64 pending). Call it after any change to owner data or rules (done on shell init, owner save, delete). Time zone is fixed to America/Bogota. Android needs `compileSdk = 37` and core library desugaring for this plugin.
- SOAT/RTM dates are entered manually; RUNT has no free API, the app only opens its public consulta page.
