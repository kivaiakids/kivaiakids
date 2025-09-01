# Configuration simple du bucket eveil-pdfs

## 🎯 Objectif
Créer le bucket `eveil-pdfs` dans Supabase Storage pour stocker les PDFs des items d'éveil aux langues.

## 📋 Étapes à suivre

### 1. Créer le bucket dans Supabase Dashboard

1. **Aller dans Supabase Dashboard**
2. **Cliquer sur "Storage"** dans le menu de gauche
3. **Cliquer sur "New bucket"**
4. **Remplir les informations :**
   - **Name** : `eveil-pdfs`
   - **Public bucket** : ✅ **COCHER** (pour un accès simple)
   - **File size limit** : `10MB` (ou laisser par défaut)
   - **Allowed MIME types** : `application/pdf`
5. **Cliquer sur "Create bucket"**

### 2. Exécuter la migration SQL

1. **Aller dans "SQL Editor"** dans Supabase Dashboard
2. **Copier-coller le contenu** de `supabase/migrations/20250101000001_create_eveil_pdf_bucket.sql`
3. **Cliquer sur "Run"**

### 3. Vérifier la configuration

1. **Aller dans "Storage"** → **"eveil-pdfs"**
2. **Vérifier que le bucket est créé**
3. **Vérifier que les politiques RLS sont appliquées**

## 🔒 Politiques de sécurité (SIMPLIFIÉES)

Avec cette configuration :
- ✅ **Lecture** : Tout le monde peut voir tous les PDFs
- ✅ **Upload** : Tous les utilisateurs connectés peuvent uploader
- ✅ **Modification** : Tous les utilisateurs connectés peuvent modifier
- ✅ **Suppression** : Tous les utilisateurs connectés peuvent supprimer

**Note** : C'est une configuration très permissive, parfaite pour le développement et les tests.

## 🧪 Tester la configuration

1. **Exécuter le script de test** : `scripts/test-pdf-upload.sql`
2. **Vérifier que toutes les fonctions sont créées**
3. **Tester l'upload d'un PDF**

## 🚨 En cas de problème

### Erreur : "Bucket eveil-pdfs non trouvé"
- Vérifier que le bucket a bien été créé dans Storage
- Vérifier l'orthographe du nom

### Erreur : "Permission denied"
- Vérifier que l'utilisateur est connecté
- Vérifier que les politiques RLS sont bien appliquées

### Erreur : "Column does not exist"
- Vérifier que la migration SQL a bien été exécutée
- Vérifier que la table `eveil_items` existe

## 📱 Utilisation dans l'application

Une fois configuré, vous pourrez :

1. **Uploader des PDFs** via le composant `PDFUpload`
2. **Afficher les PDFs** via le composant `PDFList`
3. **Gérer les accès** premium/gratuit
4. **Télécharger les PDFs** directement

## 🔄 Mise à jour des types

Après la migration, régénérer les types Supabase si nécessaire :

```bash
npx supabase gen types typescript --project-id [PROJECT_ID] > src/integrations/supabase/types.ts
```

## ✅ Checklist de fin

- [ ] Bucket `eveil-pdfs` créé dans Storage
- [ ] Migration SQL exécutée avec succès
- [ ] Composants `PDFUpload` et `PDFList` intégrés
- [ ] Test d'upload réussi
- [ ] Test de téléchargement réussi
