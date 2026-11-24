-- Reglas de pico y placa para motos por ciudad. Se editan desde el panel de Supabase
-- cuando cambie un decreto; la app solo las lee.
create table public.pico_placa (
  ciudad text primary key,
  aplica_motos boolean not null default false,
  digito text not null default 'ultimo' check (digito in ('primero', 'ultimo')), -- dígito de la placa que se evalúa
  dias jsonb not null default '{}', -- día ISO (1=lunes … 7=domingo) -> dígitos restringidos, p. ej. {"1":[5,8]}
  horario text,
  nota text,
  updated_at timestamptz not null default now()
);

alter table public.pico_placa enable row level security;
create policy "pico_placa_read" on public.pico_placa for select to authenticated using (true);

-- Datos cargados el 2026-11-23. Solo Medellín está confirmado por la Alcaldía; el resto debe verificarse.
insert into public.pico_placa (ciudad, aplica_motos, digito, dias, horario, nota) values
  ('Medellín y Valle de Aburrá', true, 'primero',
   '{"1":[5,8],"2":[1,4],"3":[0,2],"4":[3,6],"5":[7,9]}',
   'Lunes a viernes, 5:00 a. m. a 8:00 p. m.',
   'Rotación del segundo semestre de 2026 (desde el 3 de agosto). Fuente: medellin.gov.co'),
  ('Cartagena', true, 'ultimo', '{}', 'Lunes a viernes, 5:00 a. m. a 11:00 p. m.',
   'Por verificar: completar los dígitos de la rotación vigente.'),
  ('Pereira', true, 'primero', '{}', null, 'Por verificar: completar dígitos y horario.'),
  ('Bogotá', false, 'ultimo', '{}', null, 'Sin pico y placa para motos (por verificar).'),
  ('Cali', false, 'ultimo', '{}', null, 'Sin pico y placa para motos (por verificar).'),
  ('Barranquilla', false, 'ultimo', '{}', null, 'Sin pico y placa para motos (por verificar).'),
  ('Bucaramanga', false, 'ultimo', '{}', null, 'Sin pico y placa para motos (por verificar).'),
  ('Manizales', false, 'ultimo', '{}', null, 'Sin pico y placa para motos (por verificar).');

-- "Mi moto": un escaneo con placa es una moto del usuario.
alter table public.scans
  add column placa text,
  add column ciudad text references public.pico_placa (ciudad) on update cascade on delete set null,
  add column soat_vence date,
  add column rtm_vence date;

create policy "scans_update_own" on public.scans for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
