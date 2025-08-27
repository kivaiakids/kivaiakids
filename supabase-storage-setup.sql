-- 1. Ajouter la colonne 'content' à la table courses
ALTER TABLE public.courses 
ADD COLUMN content TEXT;

-- 2. Créer un bucket de stockage pour les images de cours
-- Note: Cette commande doit être exécutée dans l'interface Supabase (Storage > Buckets > Create bucket)
-- Nom du bucket: 'course-images'
-- Description: 'Images for course thumbnails and content'

-- 3. Politique pour permettre l'upload d'images (exécuter dans SQL Editor)
CREATE POLICY "Allow authenticated users to upload images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'course-images');

-- 4. Politique pour permettre la lecture d'images publiques
CREATE POLICY "Allow public read access to images" ON storage.objects
FOR SELECT USING (bucket_id = 'course-images');

-- 5. Politique pour permettre la mise à jour d'images
CREATE POLICY "Allow authenticated users to update images" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'course-images')
WITH CHECK (bucket_id = 'course-images');

-- 6. Politique pour permettre la suppression d'images
CREATE POLICY "Allow authenticated users to delete images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'course-images');

-- 7. Mettre à jour les types TypeScript (optionnel - pour la cohérence des types)
-- Ajouter dans src/integrations/supabase/types.ts dans la section courses:
-- content: string | null

-- Instructions manuelles pour Supabase Dashboard:
-- 1. Aller dans Storage > Buckets
-- 2. Cliquer sur "Create bucket"
-- 3. Nom: course-images
-- 4. Description: Images for course thumbnails and content
-- 5. Choisir "Public bucket" pour permettre l'accès public aux images
-- 6. Cliquer sur "Create bucket"

-- Notes importantes:
-- - Le bucket doit être public pour que les URLs fonctionnent
-- - Les politiques RLS sont configurées pour permettre l'upload/lecture/suppression
-- - Les fichiers seront organisés dans le dossier 'course-thumbnails/' automatiquement
-- - Les URLs générées seront publiques et accessibles directement
