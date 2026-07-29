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
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  type text not null check (type in ('hat','patch')),
  code text not null,
  name text not null,
  label text,
  description text,
  image_url text not null,
  sizes jsonb not null default '[]'::jsonb,
  price numeric(10,2) not null default 25,
  active boolean not null default true,
  sort_order integer not null default 100
);

create unique index if not exists products_type_code_key on public.products(type, code);
alter table public.products enable row level security;

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

insert into public.products (type,code,name,label,description,image_url,sizes,price,active,sort_order) values
('patch','badge','OCSO Blackout Badge','SHERIFF''S OFFICE','Official OCSO blackout badge patch.','/images/patches/badge.png','[]',25,true,10),
('patch','alpha-blackout','Alpha Squad – Blackout','ALPHA SQUAD','Official Alpha Squad blackout patch.','/images/patches/alpha-blackout.png','[]',25,true,20),
('patch','alpha-color','Alpha Squad – Color','ALPHA SQUAD','Official full-color Alpha Squad patch.','/images/patches/alpha-color.png','[]',25,true,30),
('hat','112','Classic Trucker','RICHARDSON 112','Traditional structured trucker fit with snapback closure.','/images/hats/112.png','["M/L","XL"]',25,true,10),
('hat','110','Stretch-Fit Trucker','RICHARDSON 110','Structured trucker profile with flexible fitted sizing.','/images/hats/110.png','["S/M","L/XL"]',25,true,20),
('hat','112pl','Adjustable Stretch Trucker','RICHARDSON 112PL','Stretch comfort with an adjustable rear closure.','/images/hats/112pl.png','["Adjustable"]',25,true,30),
('hat','c938','Flexfit Delta','PORT AUTHORITY C938','Premium performance cap with moisture-wicking fabric and stretch fit.','/images/hats/c938.png','["S/M","L/XL"]',25,true,40),
('hat','1010-5','5 Panel Waterproof','10/10 HATS – 5 PANEL','Modern 5 panel performance hat with waterproof technology.','/images/hats/1010-5.png','["Adjustable"]',25,true,50),
('hat','1010-6','6 Panel Waterproof','10/10 HATS – 6 PANEL','Classic 6 panel performance hat with waterproof technology.','/images/hats/1010-6.png','["Adjustable"]',25,true,60)
on conflict (type,code) do nothing;
