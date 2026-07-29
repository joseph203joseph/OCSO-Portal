create extension if not exists pgcrypto;

create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  slug text not null unique,
  logo_url text not null default '',
  primary_color text not null default '#003d2b',
  accent_color text not null default '#e2aa1b',
  access_code_hash text not null,
  square_payment_link text not null default '',
  report_email text not null default '',
  distribution_contact text not null default '',
  tax_exempt boolean not null default false,
  selection_mode text not null default 'single' check (selection_mode in ('single','paired')),
  order_schedule text not null default 'on_demand' check (order_schedule in ('on_demand','biweekly')),
  batch_anchor timestamptz,
  batch_interval_days integer not null default 14,
  reference_label text not null default 'Employee / Reference ID',
  division_label text not null default 'Department / Division',
  active boolean not null default true
);

alter table public.stores enable row level security;

insert into public.stores (
  name, slug, access_code_hash, square_payment_link, report_email,
  distribution_contact, tax_exempt, selection_mode, order_schedule,
  batch_anchor, batch_interval_days, reference_label, division_label,
  primary_color, accent_color, active
)
values (
  'Orange County Sheriff''s Office',
  'ocso',
  'f51008c04b612ce5f649cb14830d02db0f6bbe7693a65fbb5d525c2923aa655f',
  'https://square.link/u/c4zgZFhq',
  'joseph@eightleggedcustoms.com',
  'Kevin Vilches',
  true,
  'paired',
  'biweekly',
  '2026-07-31T23:30:00-04:00',
  14,
  'Badge / Employee Number',
  'Division / Unit',
  '#003d2b',
  '#e2aa1b',
  true
)
on conflict (slug) do update set
  name = excluded.name,
  square_payment_link = excluded.square_payment_link,
  report_email = excluded.report_email,
  distribution_contact = excluded.distribution_contact,
  tax_exempt = excluded.tax_exempt,
  selection_mode = excluded.selection_mode,
  order_schedule = excluded.order_schedule,
  batch_anchor = excluded.batch_anchor,
  batch_interval_days = excluded.batch_interval_days,
  reference_label = excluded.reference_label,
  division_label = excluded.division_label;

alter table public.products add column if not exists store_id uuid references public.stores(id) on delete cascade;
alter table public.orders add column if not exists store_id uuid references public.stores(id) on delete restrict;

update public.products
set store_id = (select id from public.stores where slug = 'ocso')
where store_id is null;

update public.orders
set store_id = (select id from public.stores where slug = 'ocso')
where store_id is null;

alter table public.products alter column store_id set not null;
alter table public.orders alter column store_id set not null;

drop index if exists public.products_type_code_key;
drop index if exists public.products_store_type_code_key;
create unique index if not exists products_store_type_code_key on public.products(store_id, type, code);
create index if not exists products_store_sort_idx on public.products(store_id, archived, type, sort_order);
create index if not exists orders_store_created_idx on public.orders(store_id, created_at desc);
create index if not exists stores_slug_active_idx on public.stores(slug, active);
