create table if not exists public.orders (
 id uuid primary key,
 order_number text unique not null,
 created_at timestamptz not null default now(),
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
 quantity integer not null check (quantity > 0),
 unit_price numeric(10,2) not null default 25,
 total numeric(10,2) not null,
 status text not null default 'pending_payment',
 batch_cutoff timestamptz not null
);
alter table public.orders enable row level security;
-- No public policies are required. The app uses the server-only service role key.
create index if not exists orders_batch_cutoff_idx on public.orders(batch_cutoff);
create index if not exists orders_status_idx on public.orders(status);
