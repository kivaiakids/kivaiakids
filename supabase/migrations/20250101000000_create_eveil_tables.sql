-- Migration: Création des tables et types pour "Éveil aux langues"
-- Date: 2025-01-01
-- Description: Structure complète pour gérer les activités d'éveil aux langues

-- Types
create type public.eveil_section as enum (
  'ateliers_interactifs',
  'jeux_interactifs',
  'activites_creatives',
  'comptines_et_sons_du_monde',
  'videos_culturelles',
  'histoires_du_monde'
);

-- Table items (cartes)
create table if not exists public.eveil_items (
  id uuid primary key default gen_random_uuid(),
  section public.eveil_section not null,
  slug text unique not null,
  title text not null,
  subtitle text,
  media jsonb not null default '[]'::jsonb, -- [{type,url,poster?,caption?}]
  tags text[] default '{}',
  is_premium boolean not null default false,
  is_published boolean not null default false,
  order_index int not null default 0,
  author_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes pour performance
create index if not exists idx_eveil_section on public.eveil_items(section);
create index if not exists idx_eveil_published on public.eveil_items(is_published);
create index if not exists idx_eveil_premium on public.eveil_items(is_premium);
create index if not exists idx_eveil_order on public.eveil_items(order_index);
create index if not exists idx_eveil_author on public.eveil_items(author_id);
create index if not exists idx_eveil_created on public.eveil_items(created_at);

-- Trigger updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

drop trigger if exists trg_eveil_items_updated on public.eveil_items;
create trigger trg_eveil_items_updated
before update on public.eveil_items
for each row execute function public.set_updated_at();

-- RLS
alter table public.eveil_items enable row level security;

-- Policies lecture "grand public" (publiés + premium selon abonnement)
create policy "read_published_eveil"
on public.eveil_items for select
to public
using (
  is_published = true
  and (
    -- si premium → autoriser lecture seulement si abonné premium/annual
    case when is_premium then
      exists(
        select 1 from public.profiles p
        where p.id = auth.uid()
          and p.is_premium = true
      )
    else true end
  )
);

-- Policies lecture pour admins et auteurs (brouillons)
create policy "read_own_unpublished_eveil"
on public.eveil_items for select
to authenticated
using (
  exists(
    select 1 from public.profiles p
    where p.id = auth.uid()
      and (p.role = 'admin' or eveil_items.author_id = auth.uid())
  )
);

-- CRUD réservé admin/auteur
create policy "insert_eveil_admin_or_author"
on public.eveil_items for insert
to authenticated
with check (
  exists(
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
  or author_id = auth.uid()
);

create policy "update_eveil_admin_or_author"
on public.eveil_items for update
to authenticated
using (
  exists(select 1 from public.profiles p where p.id = auth.uid() and p.role='admin')
  or author_id = auth.uid()
)
with check (
  exists(select 1 from public.profiles p where p.id = auth.uid() and p.role='admin')
  or author_id = auth.uid()
);

create policy "delete_eveil_admin_or_author"
on public.eveil_items for delete
to authenticated
using (
  exists(select 1 from public.profiles p where p.id = auth.uid() and p.role='admin')
  or author_id = auth.uid()
);

-- Données de test (optionnel)
insert into public.eveil_items (section, slug, title, subtitle, media, tags, is_premium, is_published, order_index) values
('ateliers_interactifs', 'decouverte-japon', 'Découverte du Japon', 'Une histoire + une comptine + un bricolage + un guide pédagogique', '[{"type": "image", "url": "/media/japan-poster.jpg", "caption": "Drapeau japonais"}]', ARRAY['japon', 'culture', 'activité'], false, true, 1),
('jeux_interactifs', 'devinettes-sons', 'Devinettes des Sons', 'Devine, associe, écoute, joue avec les langues et les sons.', '[{"type": "audio", "url": "/media/sounds-quiz.mp3", "caption": "Quiz audio"}]', ARRAY['sons', 'jeu', 'interactif'], true, true, 1),
('activites_creatives', 'origami-facile', 'Origami Facile', 'DIY, dessins guidés, collages, créations inspirées des cultures.', '[{"type": "image", "url": "/media/origami-steps.jpg", "caption": "Étapes origami"}]', ARRAY['origami', 'japon', 'créativité'], false, true, 1),
('comptines_et_sons_du_monde', 'berceuse-africaine', 'Berceuse Africaine', 'Écoute des langues vivantes, des accents, des chants traditionnels.', '[{"type": "audio", "url": "/media/african-lullaby.mp3", "caption": "Berceuse traditionnelle"}]', ARRAY['afrique', 'berceuse', 'tradition'], true, true, 1),
('videos_culturelles', 'festival-inde', 'Festival en Inde', 'Pour découvrir les gestes, les fêtes, les paysages du monde.', '[{"type": "video", "url": "/media/india-festival.mp4", "poster": "/media/india-poster.jpg", "caption": "Festival des couleurs"}]', ARRAY['inde', 'festival', 'couleurs'], true, true, 1),
('histoires_du_monde', 'conte-arabe', 'Conte Arabe', 'Contes audio avec fiches d''activités associées.', '[{"type": "audio", "url": "/media/arabic-tale.mp3", "caption": "Conte traditionnel"}]', ARRAY['arabe', 'conte', 'tradition'], false, true, 1)
on conflict (slug) do nothing;
