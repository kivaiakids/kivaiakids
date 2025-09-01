# Éveil aux langues - Documentation

## Vue d'ensemble

La rubrique "Éveil aux langues" est une nouvelle section de Kivaia Kids qui propose des activités ludiques et interactives pour découvrir les langues, les sons et les cultures du monde. Cette section est orientée médias et s'adresse aux enfants et à leurs accompagnants.

## Structure

### 6 Sections principales

1. **Ateliers Interactifs** (`/eveil-aux-langues/ateliers-interactifs`)
   - Une histoire + une comptine + un bricolage + un guide pédagogique

2. **Jeux Interactifs** (`/eveil-aux-langues/jeux-interactifs`)
   - Devine, associe, écoute, joue avec les langues et les sons

3. **Activités Créatives** (`/eveil-aux-langues/activites-creatives`)
   - DIY, dessins guidés, collages, créations inspirées des cultures

4. **Comptines et Sons du Monde** (`/eveil-aux-langues/comptines-et-sons-du-monde`)
   - Écoute des langues vivantes, des accents, des chants traditionnels

5. **Vidéos Culturelles** (`/eveil-aux-langues/videos-culturelles`)
   - Pour découvrir les gestes, les fêtes, les paysages du monde

6. **Histoires du Monde** (`/eveil-aux-langues/histoires-du-monde`)
   - Contes audio avec fiches d'activités associées

## Installation et Configuration

### 1. Migration de la base de données

Exécutez la migration SQL dans Supabase :

```bash
# Dans Supabase Dashboard > SQL Editor
# Ou via CLI Supabase
supabase db push
```

Le fichier de migration se trouve dans : `supabase/migrations/20250101000000_create_eveil_tables.sql`

### 2. Configuration du bucket de stockage

Créez un bucket `media` dans Supabase Storage :

```sql
-- Dans Supabase Dashboard > Storage
-- Créer un bucket nommé "media"
-- Politique publique pour les assets non premium
```

Politique RLS pour le bucket :

```sql
-- Lecture publique pour les assets non premium
CREATE POLICY "Public read access for non-premium media" ON storage.objects
FOR SELECT USING (
  bucket_id = 'media' AND
  (storage.foldername(name))[1] != 'premium'
);

-- Lecture pour les utilisateurs premium
CREATE POLICY "Premium read access" ON storage.objects
FOR SELECT USING (
  bucket_id = 'media' AND
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_premium = true
  )
);
```

### 3. Variables d'environnement

Aucune variable d'environnement supplémentaire n'est requise. Le système utilise les variables existantes :

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Architecture technique

### Base de données

**Table `eveil_items`** :
- `id` : UUID primaire
- `section` : Enum des 6 sections
- `slug` : Identifiant unique pour l'URL
- `title` : Titre de l'activité
- `subtitle` : Sous-titre optionnel
- `media` : JSONB array des médias associés
- `tags` : Array des tags
- `is_premium` : Boolean pour le gating premium
- `is_published` : Boolean pour la publication
- `order_index` : Ordre d'affichage
- `author_id` : Référence vers profiles
- `created_at` / `updated_at` : Timestamps

**Types de médias supportés** :
- `image` : Images (JPG, PNG, WebP)
- `audio` : Fichiers audio (MP3, WAV, OGG)
- `video` : Vidéos (MP4, WebM) avec poster optionnel
- `pdf` : Documents PDF

### Composants React

**`SectionTile`** : Tuile pour chaque section
- Props : title, subtitle, href, icon
- Design responsive mobile-first
- Hover effects et transitions

**`MediaBadge`** : Badge indiquant le type de média
- Props : type ('image' | 'audio' | 'video' | 'pdf')
- Icônes Lucide React
- Couleurs différenciées par type

**`CardEveil`** : Carte d'activité avec focus médias
- Props : item (EveilItem), onClick
- Preview du média principal
- Gating premium intégré
- CTA adaptatif selon le type de média

### Helpers Supabase

**`getEveilItemsBySection()`** : Récupère les items d'une section
**`getEveilItemBySlug()`** : Récupère un item par son slug
**`upsertEveilItem()`** : Crée ou met à jour un item
**`deleteEveilItem()`** : Supprime un item
**`toggleEveilItemPublish()`** : Change le statut de publication
**`updateEveilItemOrder()`** : Met à jour l'ordre des items

## Gating Premium

### Logique d'accès

1. **Contenu gratuit** : Accessible à tous
2. **Contenu premium** : 
   - Non connecté → Redirection vers `/pricing`
   - Connecté gratuit → Redirection vers `/pricing`
   - Connecté premium → Accès complet

### Implémentation

- RLS policies dans Supabase
- Vérification côté client avec `useAuth()`
- UI adaptative (badges, boutons, états)

## Performance et SEO

### Optimisations

- **Lazy loading** des images
- **Preload "none"** pour les vidéos
- **Posters légers** pour les vidéos
- **Code splitting** par page
- **Meta tags** dynamiques avec Helmet

### Accessibilité

- **Contraste AA** respecté
- **Touch targets ≥ 44px**
- **Aria labels** explicites
- **Navigation clavier** complète
- **Alt texts** pour les images

## Utilisation

### Navigation

1. **Page principale** : `/eveil-aux-langues`
   - Affiche les 6 sections en grille
   - Design mobile-first responsive

2. **Sections** : `/eveil-aux-langues/{section}`
   - Liste les activités de la section
   - Tri par `order_index` puis `created_at`
   - Filtrage automatique (publié + premium selon abonnement)

### Interaction avec les médias

- **Images** : Affichage direct
- **Audio** : Player intégré (à implémenter)
- **Vidéo** : Player avec poster
- **PDF** : Ouverture dans nouvel onglet

## Développement

### Ajout d'une nouvelle activité

```typescript
import { upsertEveilItem } from '@/integrations/supabase/eveil-helpers';

const newItem = {
  section: 'ateliers_interactifs',
  title: 'Mon activité',
  subtitle: 'Description',
  media: [{
    type: 'image',
    url: '/media/mon-image.jpg',
    caption: 'Légende'
  }],
  tags: ['tag1', 'tag2'],
  is_premium: false,
  is_published: true,
  order_index: 1
};

await upsertEveilItem(newItem);
```

### Tests

```bash
# Tests unitaires (à implémenter)
npm test

# Tests e2e (à implémenter)
npm run test:e2e
```

## Roadmap

### Phase 1 ✅ (Actuelle)
- [x] Structure de base
- [x] Composants UI
- [x] Pages principales
- [x] Navigation
- [x] Gating premium

### Phase 2 (À venir)
- [ ] Panel admin CRUD
- [ ] Player audio/vidéo intégré
- [ ] Upload de médias
- [ ] Tests unitaires
- [ ] Analytics

### Phase 3 (Future)
- [ ] Mode hors-ligne
- [ ] Partage social
- [ ] Recommandations
- [ ] Gamification

## Support

Pour toute question ou problème :

1. Vérifiez les logs de la console
2. Consultez les policies RLS dans Supabase
3. Vérifiez la configuration du bucket `media`
4. Contactez l'équipe de développement

---

**Version** : 1.0.0  
**Dernière mise à jour** : Janvier 2025
