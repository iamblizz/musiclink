-- Run in Supabase SQL editor
create table public.smartlinks(
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  slug text unique not null check (slug ~ '^[a-z0-9-]{2,40}$'),
  title text not null, artist text not null,
  cover_url text, accent text default '#FF3D81',
  links jsonb not null default '[]',
  published boolean not null default true,
  created_at timestamptz default now());
create table public.events(
  id bigint generated always as identity primary key,
  link_id uuid not null references public.smartlinks on delete cascade,
  type text not null check (type in ('view','click')),
  platform text, country text, referrer text,
  created_at timestamptz default now());
alter table public.smartlinks enable row level security;
alter table public.events enable row level security;
create policy "owner manages links" on public.smartlinks for all using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "public reads published" on public.smartlinks for select using (published);
create policy "owner reads events" on public.events for select using (exists(select 1 from public.smartlinks s where s.id=link_id and s.user_id=auth.uid()));
create function public.track_event(p_slug text,p_type text,p_platform text,p_country text,p_referrer text)
returns void language sql security definer set search_path=public as $$
  insert into events(link_id,type,platform,country,referrer)
  select id,p_type,p_platform,p_country,p_referrer from smartlinks where slug=p_slug and published $$;
grant execute on function public.track_event to anon, authenticated;
insert into storage.buckets(id,name,public) values('covers','covers',true) on conflict do nothing;
create policy "covers readable" on storage.objects for select using (bucket_id='covers');
create policy "owner uploads covers" on storage.objects for insert to authenticated
  with check (bucket_id='covers' and (storage.foldername(name))[1]=auth.uid()::text);
