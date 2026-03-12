-- Centralized cellar sync schema for PostgreSQL.
-- This replaces whole-document sync with item-level records owned by a user.

create extension if not exists pgcrypto;

-- Interim pre-auth sync namespace.
-- This is what the current app can use immediately with the existing sync code.

create table if not exists cellar_sync_namespace (
  sync_id text primary key,
  owner_user_id text not null,
  owner_secret_hash text null,
  owner_email text null,
  recovery_key_hash text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists cellar_sync_item (
  sync_id text not null references cellar_sync_namespace(sync_id) on delete cascade,
  item_id text not null,
  item_updated_at timestamptz not null,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (sync_id, item_id)
);

create index if not exists idx_cellar_sync_item_sync_id_updated_at
  on cellar_sync_item(sync_id, item_updated_at desc);

create table if not exists cellar_sync_session (
  sync_id text not null references cellar_sync_namespace(sync_id) on delete cascade,
  token_hash text primary key,
  user_id text not null,
  device_id text not null,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create index if not exists idx_cellar_sync_session_sync_id
  on cellar_sync_session(sync_id, last_seen_at desc);

create table if not exists cellar_sync_owner_session (
  sync_id text not null references cellar_sync_namespace(sync_id) on delete cascade,
  token_hash text primary key,
  owner_email text not null,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create index if not exists idx_cellar_sync_owner_session_sync_id
  on cellar_sync_owner_session(sync_id, last_seen_at desc);

-- Future authenticated multi-device model.
-- Keep this alongside the interim tables so migration can be staged cleanly.

create table if not exists app_user (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  display_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists user_device (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references app_user(id) on delete cascade,
  device_label text not null default '',
  platform text not null default '',
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists cellar_item (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references app_user(id) on delete cascade,
  source_wine_id text null,
  status text not null check (status in ('bottle', 'wishlist', 'tasted')),
  name text not null,
  producer text not null default '',
  vintage text not null default '',
  region text not null default '',
  country text not null default '',
  category text not null default '',
  quantity integer not null default 1 check (quantity > 0),
  purchase_price_pence integer null check (purchase_price_pence >= 0),
  purchase_date date null,
  drink_from_year integer null,
  drink_by_year integer null,
  notes text not null default '',
  tasting_note text not null default '',
  location text not null default '',
  purchase_source_type text not null default '',
  purchase_retailer text not null default '',
  purchase_retailer_other text not null default '',
  rating smallint null check (rating between 0 and 5),
  score smallint null check (score between 0 and 100),
  tasted_at timestamptz null,
  source text not null default '',
  item_signature text not null default '',
  client_created_at timestamptz null,
  client_updated_at timestamptz null,
  last_modified_by_device_id uuid null references user_device(id) on delete set null,
  version bigint not null default 1,
  deleted_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists cellar_item_event (
  id bigserial primary key,
  cellar_item_id uuid not null references cellar_item(id) on delete cascade,
  user_id uuid not null references app_user(id) on delete cascade,
  device_id uuid null references user_device(id) on delete set null,
  event_type text not null check (event_type in ('created', 'updated', 'status_changed', 'deleted', 'restored')),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_user_device_user_id on user_device(user_id);

create index if not exists idx_cellar_item_user_id on cellar_item(user_id);
create index if not exists idx_cellar_item_user_status on cellar_item(user_id, status);
create index if not exists idx_cellar_item_user_updated_at on cellar_item(user_id, updated_at desc);
create index if not exists idx_cellar_item_user_deleted_at on cellar_item(user_id, deleted_at);
create index if not exists idx_cellar_item_user_signature on cellar_item(user_id, item_signature);

create index if not exists idx_cellar_item_event_item_id on cellar_item_event(cellar_item_id);
create index if not exists idx_cellar_item_event_user_created_at on cellar_item_event(user_id, created_at desc);

create or replace function set_row_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_app_user_updated_at on app_user;
create trigger trg_app_user_updated_at
before update on app_user
for each row
execute function set_row_updated_at();

drop trigger if exists trg_cellar_item_updated_at on cellar_item;
create trigger trg_cellar_item_updated_at
before update on cellar_item
for each row
execute function set_row_updated_at();

comment on table cellar_item is 'Normalized cellar records. One row per bottle, wishlist item, or tasted item.';
comment on column cellar_item.version is 'Monotonic optimistic-lock version for conflict handling.';
comment on column cellar_item.deleted_at is 'Soft delete marker so sync can propagate deletions.';
comment on table cellar_sync_namespace is 'Interim sync namespace keyed by the current cloud sync code.';
comment on table cellar_sync_item is 'Interim item-level sync table used before full account-based auth is introduced.';
comment on table cellar_sync_session is 'Per-device bearer-token sessions for the interim sync-code ownership model.';
comment on table cellar_sync_owner_session is 'Owner-management bearer-token sessions used for linked-device management and credential rotation.';
comment on column cellar_sync_namespace.owner_secret_hash is 'Hashed shared passphrase required to mint new device sessions.';
comment on column cellar_sync_namespace.owner_email is 'Owner email recorded when the sync namespace is first created.';
comment on column cellar_sync_namespace.recovery_key_hash is 'Hashed recovery key that can rotate the shared passphrase and revoke sessions.';
