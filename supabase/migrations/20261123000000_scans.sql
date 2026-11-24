-- Escaneos de motos por usuario. Cada usuario solo ve y gestiona los suyos (RLS).
create table public.scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  marca text not null,
  modelo text not null,
  anio text,
  cilindraje_cc integer,
  ficha jsonb not null default '[]',   -- [{nombre, valor}]
  costos jsonb not null default '[]',  -- [{concepto, valor_cop, detalle}]
  supuestos text,
  total_anual_cop bigint not null default 0
);

create index scans_user_created_idx on public.scans (user_id, created_at desc);

alter table public.scans enable row level security;

create policy "scans_select_own" on public.scans for select to authenticated using (user_id = auth.uid());
create policy "scans_insert_own" on public.scans for insert to authenticated with check (user_id = auth.uid());
create policy "scans_delete_own" on public.scans for delete to authenticated using (user_id = auth.uid());
