alter table public.products add column if not exists archived boolean not null default false;
create index if not exists products_catalog_order_idx on public.products(archived, type, sort_order);
update public.products set archived = false where archived is null;
