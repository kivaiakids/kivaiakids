# Configuration du système d'upload de PDFs pour l'éveil aux langues

## 🎯 Objectif

Permettre aux administrateurs d'uploader des fichiers PDF pour les items d'éveil aux langues, avec gestion des accès premium et gratuit.

## 🗄️ Configuration Supabase

### 1. Création du bucket Storage

Dans l'interface Supabase Dashboard :

1. **Aller à Storage** dans le menu de gauche
2. **Créer un nouveau bucket** nommé `eveil-pdfs`
3. **Activer RLS** (Row Level Security)
4. **Permissions publiques** : Aucune (contrôlé par RLS)

### 2. Structure des dossiers

Le bucket `eveil-pdfs` aura cette structure :
```
eveil-pdfs/
├── published/          # PDFs gratuits
│   └── [item_id]/
│       └── [timestamp]_[item_id].pdf
└── premium/            # PDFs premium
    └── [item_id]/
        └── [timestamp]_[item_id].pdf
```

### 3. Exécution de la migration SQL

Exécuter le fichier `supabase/migrations/20250101000001_create_eveil_pdf_bucket.sql` dans l'éditeur SQL de Supabase.

Cette migration :
- ✅ Configure les politiques RLS pour le bucket
- ✅ Ajoute la colonne `pdf_files` à la table `eveil_items`
- ✅ Crée les fonctions helper pour la gestion des PDFs
- ✅ Configure les triggers de nettoyage automatique

## 🔧 Configuration des composants

### 1. Composant PDFUpload

**Fichier** : `src/components/Eveil/PDFUpload.tsx`

**Fonctionnalités** :
- ✅ Upload de fichiers PDF (max 10MB)
- ✅ Validation du type de fichier
- ✅ Gestion des statuts premium/gratuit
- ✅ Barre de progression d'upload
- ✅ Interface drag & drop
- ✅ Suppression de PDFs

**Utilisation** :
```tsx
<PDFUpload
  itemId={item.id}
  pdfFiles={item.pdf_files}
  onPDFsChange={handlePDFsChange}
  isPremium={item.is_premium}
/>
```

### 2. Composant PDFList

**Fichier** : `src/components/Eveil/PDFList.tsx`

**Fonctionnalités** :
- ✅ Affichage de la liste des PDFs
- ✅ Gestion des accès premium/gratuit
- ✅ Boutons de téléchargement
- ✅ Badges de statut
- ✅ CTA pour l'abonnement premium

**Utilisation** :
```tsx
<PDFList
  pdfFiles={item.pdf_files}
  itemTitle={item.title}
/>
```

## 📱 Intégration dans les pages

### 1. Page de création/édition d'item

Dans `src/pages/admin/CreateEveil.tsx`, ajouter :

```tsx
import PDFUpload from '@/components/Eveil/PDFUpload';

// Dans le formulaire
<PDFUpload
  itemId={itemId || 'new'}
  pdfFiles={formData.pdf_files || []}
  onPDFsChange={(pdfs) => setFormData({ ...formData, pdf_files: pdfs })}
  isPremium={formData.is_premium}
/>
```

### 2. Page de détail d'item

Dans `src/pages/EveilDetail.tsx`, ajouter :

```tsx
import PDFList from '@/components/Eveil/PDFList';

// Après les informations de l'item
<PDFList
  pdfFiles={item.pdf_files}
  itemTitle={item.title}
/>
```

## 🔐 Sécurité et permissions

### 1. Politiques RLS

**Lecture des PDFs publiés** : Accès public
**Lecture des PDFs premium** : Utilisateurs connectés uniquement
**Upload/Modification** : Admins et auteurs uniquement
**Suppression** : Admins et auteurs uniquement

### 2. Validation côté client

- ✅ Type de fichier : PDF uniquement
- ✅ Taille maximale : 10MB
- ✅ Nom de fichier sécurisé
- ✅ Vérification des permissions utilisateur

### 3. Validation côté serveur

- ✅ Authentification requise pour les opérations sensibles
- ✅ Vérification des permissions RLS
- ✅ Nettoyage automatique des fichiers orphelins

## 🚀 Fonctionnalités avancées

### 1. Gestion des versions

Chaque upload génère un nouveau fichier avec timestamp :
```
[timestamp]_[item_id].pdf
```

### 2. Nettoyage automatique

Lors de la suppression d'un item :
- ✅ Suppression automatique de tous les PDFs associés
- ✅ Nettoyage des métadonnées
- ✅ Libération de l'espace de stockage

### 3. Cache et performance

- ✅ URLs publiques pour les PDFs
- ✅ Cache control headers
- ✅ Compression automatique des assets

## 📋 Checklist de déploiement

### Phase 1 : Configuration Supabase
- [ ] Créer le bucket `eveil-pdfs`
- [ ] Exécuter la migration SQL
- [ ] Vérifier les politiques RLS
- [ ] Tester les permissions

### Phase 2 : Intégration frontend
- [ ] Ajouter PDFUpload dans CreateEveil
- [ ] Ajouter PDFList dans EveilDetail
- [ ] Tester l'upload de fichiers
- [ ] Vérifier la gestion des accès

### Phase 3 : Tests et validation
- [ ] Test d'upload de PDFs
- [ ] Test de téléchargement
- [ ] Test des permissions premium
- [ ] Test de suppression
- [ ] Validation des performances

## 🐛 Dépannage

### Erreur : "Bucket eveil-pdfs non trouvé"
**Solution** : Vérifier que le bucket a été créé dans Supabase Storage

### Erreur : "Permission denied"
**Solution** : Vérifier les politiques RLS et les permissions utilisateur

### Erreur : "File too large"
**Solution** : Vérifier la limite de 10MB côté client et serveur

### Erreur : "Invalid file type"
**Solution** : Vérifier que seuls les PDFs sont acceptés

## 🔄 Mise à jour des types

Après la migration, régénérer les types Supabase :

```bash
npx supabase gen types typescript --project-id [PROJECT_ID] > src/integrations/supabase/types.ts
```

## 📚 Ressources

- [Documentation Supabase Storage](https://supabase.com/docs/guides/storage)
- [Politiques RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [API Storage JavaScript](https://supabase.com/docs/reference/javascript/storage-createbucket)
