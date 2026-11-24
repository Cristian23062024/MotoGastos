-- El pico y placa pasa de una tabla semanal fija a un calendario por fecha, porque varias
-- ciudades rotan cada semana (Pasto), alternan pares/impares (Turbaco) o descuentan festivos.
-- Lo llena a diario la Edge Function sync-pico-placa desde pyphoy.com.
alter table public.pico_placa
  drop column dias,
  add column slug text unique, -- identificador de la ciudad en pyphoy.com
  add column calendario jsonb not null default '{}'; -- fecha ISO -> dígitos restringidos, p. ej. {"2026-11-24":[8,9]}

-- Mismo nombre que usa pyphoy, para que la sincronización actualice esta fila (cascade a scans.ciudad).
update public.pico_placa set ciudad = 'Medellín' where ciudad = 'Medellín y Valle de Aburrá';
update public.pico_placa set nota = 'No aparece en el listado de motos de pyphoy.com; sin datos.'
  where ciudad in ('Barranquilla', 'Manizales');

-- Sincronización diaria a las 4:00 a. m. hora Colombia (09:00 UTC).
create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;

select cron.schedule(
  'sync-pico-placa',
  '0 9 * * *',
  $$
  select net.http_post(
    url := 'https://hpucuqoykfpzjcboyyeo.supabase.co/functions/v1/sync-pico-placa',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      -- La secret key vive en Vault (ver README); nunca en el SQL.
      'apikey', (select decrypted_secret from vault.decrypted_secrets where name = 'supabase_secret_key')
    ),
    timeout_milliseconds := 120000
  );
  $$
);
