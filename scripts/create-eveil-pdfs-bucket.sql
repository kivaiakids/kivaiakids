-- Script pour créer le bucket 'eveil-pdfs' et configurer les politiques RLS
-- À exécuter dans l'interface SQL de Supabase

-- 1. Créer le bucket 'eveil-pdfs' (via l'interface web ou l'API)
-- Note: CREATE BUCKET n'est pas supporté en SQL, utilisez l'interface web

-- 2. Vérifier que le bucket existe
SELECT * FROM storage.buckets WHERE id = 'eveil-pdfs';

-- 3. Configurer les politiques RLS pour le bucket (TRÈS SIMPLIFIÉES)

-- Politique pour permettre la lecture de TOUS les PDFs (accès public)
CREATE POLICY "Allow public read access to all eveil PDFs" ON storage.objects
FOR SELECT USING (bucket_id = 'eveil-pdfs');

-- Politique pour permettre l'upload à TOUS les utilisateurs connectés
CREATE POLICY "Allow authenticated users to upload eveil PDFs" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'eveil-pdfs' 
  AND auth.role() = 'authenticated'
);

-- Politique pour permettre la mise à jour à TOUS les utilisateurs connectés
CREATE POLICY "Allow authenticated users to update eveil PDFs" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'eveil-pdfs' 
  AND auth.role() = 'authenticated'
);

-- Politique pour permettre la suppression à TOUS les utilisateurs connectés
CREATE POLICY "Allow authenticated users to delete eveil PDFs" ON storage.objects
FOR DELETE USING (
  bucket_id = 'eveil-pdfs' 
  AND auth.role() = 'authenticated'
);

-- 4. Vérifier les politiques créées (via l'interface web)
-- Note: Les politiques RLS ne sont pas visibles via SQL direct
-- Allez dans Storage > EVEIL-PDFS > Policies pour les voir

-- 5. Tester l'accès au bucket
SELECT * FROM storage.objects WHERE bucket_id = 'eveil-pdfs' LIMIT 5;
