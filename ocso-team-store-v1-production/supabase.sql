create extension if not exists pgcrypto;
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  order_number text not null unique,
  customer_name text not null,
  email text not null,
  phone text,
  badge_number text not null,
  division text not null,
  supervisor text,
  patch_id text not null,
  patch_name text not null,
  hat_id text not null,
  hat_model text not null,
  hat_name text not null,
  size text not null,
  quantity integer not null check (quantity between 1 and 10),
  unit_price numeric(10,2) not null default 25,
  total numeric(10,2) not null,
  status text not null default 'pending_payment',
  batch_cutoff timestamptz not null
);
alter table public.orders enable row level security;
