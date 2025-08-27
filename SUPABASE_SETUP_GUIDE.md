# Guide de configuration Supabase

## 🚨 Problèmes à résoudre

### 1. Bucket Storage manquant
**Erreur** : `Bucket not found: course-files`

### 2. Colonne manquante dans la base de données
**Erreur** : `Could not find the 'created_by' column`

## 🔧 Solutions

### Étape 1: Ajouter les colonnes manquantes et corriger l'enum

Exécutez ces migrations SQL dans l'éditeur SQL de Supabase :

**Migration 1 - Colonnes manquantes :**
```sql
-- Migration pour corriger la table courses
DO $$ 
BEGIN
    -- Ajouter created_by si elle n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'courses' AND column_name = 'created_by') THEN
        ALTER TABLE public.courses ADD COLUMN created_by UUID REFERENCES public.profiles(id);
    END IF;
    
    -- Ajouter content si elle n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'courses' AND column_name = 'content') THEN
        ALTER TABLE public.courses ADD COLUMN content TEXT;
    END IF;
END $$;

-- Ajouter les commentaires
COMMENT ON COLUMN public.courses.content IS 'Course content in rich text format';
COMMENT ON COLUMN public.courses.created_by IS 'User who created the course';
```

**Migration 2 - Corriger l'enum category :**
```sql
-- Change category column from enum to text to allow free text
ALTER TABLE public.courses ALTER COLUMN category TYPE TEXT;

-- Drop the enum type if it's no longer used
DROP TYPE IF EXISTS public.course_category;

-- Add comment to document the change
COMMENT ON COLUMN public.courses.category IS 'Course category (free text)';
```

### Étape 2: Créer le bucket Storage

1. **Aller dans le dashboard Supabase**
   - Ouvrir votre projet Supabase
   - Cliquer sur "Storage" dans le menu de gauche

2. **Créer le bucket**
   - Cliquer sur "Create bucket"
   - **Nom** : `course-files`
   - **Description** : `Files for courses (images, documents, etc.)`
   - **Public bucket** : ✅ Cocher cette option
   - Cliquer sur "Create bucket"

3. **Configurer les politiques RLS**
   
   Exécuter ces commandes SQL dans l'éditeur SQL :

```sql
    -- Permettre l'upload de fichiers pour les utilisateurs authentifiés
CREATE POLICY "Allow authenticated users to upload files" ON storage.objects
FOR INSERT TO authenticated 
WITH CHECK (bucket_id = 'course-files');

-- Permettre la lecture publique des fichiers
CREATE POLICY "Allow public read access to files" ON storage.objects
FOR SELECT 
USING (bucket_id = 'course-files');

-- Permettre la mise à jour de fichiers pour les utilisateurs authentifiés
CREATE POLICY "Allow authenticated users to update files" ON storage.objects
FOR UPDATE TO authenticated 
USING (bucket_id = 'course-files')
WITH CHECK (bucket_id = 'course-files');

-- Permettre la suppression de fichiers pour les utilisateurs authentifiés
CREATE POLICY "Allow authenticated users to delete files" ON storage.objects
FOR DELETE TO authenticated 
USING (bucket_id = 'course-files');
```

### Étape 3: Vérifier la configuration

1. **Tester l'upload**
   - Aller sur votre application
   - Essayer de créer un cours
   - Uploader une image

2. **Vérifier les logs**
   - Si tout fonctionne, vous devriez voir "Image uploadée !"
   - Sinon, vérifier les erreurs dans la console

## 🎯 Interface d'éditeur améliorée

L'éditeur Markdown a été remplacé par un éditeur WYSIWYG simple avec :

- **B** : Gras
- **I** : Italique  
- **H1** : Titre principal
- **H2** : Sous-titre
- **P** : Paragraphe
- **Liste** : Puces

Plus besoin d'apprendre Markdown !

## 🚀 Test de configuration

Exécutez ce script pour vérifier que tout fonctionne :

```bash
node setup-supabase-storage.js
```

## 📋 Checklist

- [ ] Migration SQL exécutée
- [ ] Bucket `course-files` créé
- [ ] Politiques RLS configurées
- [ ] Test d'upload réussi
- [ ] Création de cours fonctionnelle

## 🔍 Dépannage

### Erreur "Bucket not found"
- Vérifier que le bucket `course-files` existe
- Vérifier que le nom est exactement `course-files`

### Erreur "column created_by not found"
- Exécuter la migration SQL pour ajouter la colonne
- Vérifier que la table `profiles` existe

### Erreur "Permission denied"
- Vérifier que les politiques RLS sont configurées
- Vérifier que l'utilisateur est authentifié

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifier les logs dans la console du navigateur
2. Vérifier les logs dans Supabase Dashboard
3. S'assurer que toutes les étapes ci-dessus sont suivies
