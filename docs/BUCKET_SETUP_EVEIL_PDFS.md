# Configuration du bucket `eveil-pdfs` dans Supabase

## 🚨 Problème identifié
Le bucket `eveil-pdfs` n'existe pas encore dans votre projet Supabase, ce qui empêche l'upload des PDFs.

## 📋 Étapes de configuration

### 1. Créer le bucket via l'interface web

1. **Connectez-vous** à votre projet Supabase
2. **Allez dans** `Storage` (dans le menu de gauche)
3. **Cliquez sur** `New bucket`
4. **Remplissez** :
   - **Name** : `eveil-pdfs`
   - **Public bucket** : ✅ **COCHÉ** (pour l'accès public aux PDFs)
   - **File size limit** : `50 MB` (ou plus selon vos besoins)
5. **Cliquez sur** `Create bucket`

### 2. Exécuter le script SQL

1. **Allez dans** `SQL Editor` (dans le menu de gauche)
2. **Créez un nouveau query**
3. **Copiez-collez** le contenu de `scripts/create-eveil-pdfs-bucket.sql`
4. **Exécutez** le script

### 3. Vérifier la configuration

Après exécution, vous devriez voir :
- ✅ Bucket `eveil-pdfs` créé
- ✅ 4 politiques RLS appliquées
- ✅ Accès public en lecture
- ✅ Upload autorisé pour les utilisateurs connectés

## 🔧 Test de la configuration

### Vérifier que le bucket existe :
```sql
SELECT * FROM storage.buckets WHERE id = 'eveil-pdfs';
```

### Vérifier les politiques :
```sql
SELECT * FROM storage.policies WHERE bucket_id = 'eveil-pdfs';
```

### Tester l'accès :
```sql
SELECT * FROM storage.objects WHERE bucket_id = 'eveil-pdfs' LIMIT 5;
```

## 🎯 Structure des dossiers

Le bucket sera organisé comme suit :
```
eveil-pdfs/
├── premium/
│   └── [item_id]/
│       └── [timestamp]_[filename].pdf
└── published/
    └── [item_id]/
        └── [timestamp]_[filename].pdf
```

## ✅ Vérification finale

1. **Bucket créé** : `eveil-pdfs` visible dans Storage
2. **Politiques appliquées** : 4 politiques RLS actives
3. **Accès public** : Lecture autorisée pour tous
4. **Upload fonctionnel** : Test avec un PDF dans l'admin

## 🚀 Après configuration

Une fois le bucket configuré :
- ✅ L'upload de PDFs fonctionnera dans l'admin
- ✅ Les PDFs seront visibles sur les pages de détail
- ✅ Le téléchargement sera possible pour tous les utilisateurs
- ✅ La gestion Premium/Gratuit sera opérationnelle

## 🔍 En cas de problème

Si l'upload ne fonctionne toujours pas :
1. **Vérifiez** que le bucket est bien créé
2. **Vérifiez** que les politiques RLS sont actives
3. **Vérifiez** que l'utilisateur est bien connecté
4. **Regardez** les logs de la console pour les erreurs
