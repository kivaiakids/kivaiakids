-- Migration: Création du bucket media pour les PDFs d'éveil aux langues
-- Date: 2025-01-01
-- Note: Politiques RLS simplifiées pour moins de sécurité

-- 1. Créer le bucket 'eveil-pdfs' dans Supabase Storage
-- Note: Cette commande doit être exécutée via l'API Supabase ou l'interface web
-- car CREATE BUCKET n'est pas supporté directement en SQL

-- 2. Configurer les politiques RLS pour le bucket (TRÈS SIMPLIFIÉES)
-- Ces politiques seront appliquées après création du bucket

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

-- 3. Créer une fonction helper pour générer les noms de fichiers
CREATE OR REPLACE FUNCTION generate_eveil_pdf_filename(
  item_id UUID,
  filename TEXT,
  is_premium BOOLEAN DEFAULT false
) RETURNS TEXT AS $$
BEGIN
  -- Structure: bucket/eveil-pdfs/[premium|published]/[item_id]/[timestamp]_[filename]
  RETURN CASE 
    WHEN is_premium THEN 
      'premium/' || item_id::text || '/' || extract(epoch from now())::bigint || '_' || filename
    ELSE 
      'published/' || item_id::text || '/' || extract(epoch from now())::bigint || '_' || filename
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Créer une fonction pour nettoyer les anciens PDFs lors de la suppression d'un item
CREATE OR REPLACE FUNCTION cleanup_eveil_pdfs(item_id UUID) RETURNS VOID AS $$
BEGIN
  -- Supprimer tous les fichiers associés à cet item
  DELETE FROM storage.objects 
  WHERE bucket_id = 'eveil-pdfs' 
  AND (storage.foldername(name))[2] = item_id::text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Créer un trigger pour nettoyer automatiquement les PDFs lors de la suppression d'un item
CREATE OR REPLACE FUNCTION trigger_cleanup_eveil_pdfs() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM cleanup_eveil_pdfs(OLD.id);
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer le trigger
DROP TRIGGER IF EXISTS eveil_pdfs_cleanup_trigger ON eveil_items;
CREATE TRIGGER eveil_pdfs_cleanup_trigger
  AFTER DELETE ON eveil_items
  FOR EACH ROW
  EXECUTE FUNCTION trigger_cleanup_eveil_pdfs();

-- 6. Ajouter une colonne pour stocker les informations des PDFs dans la table eveil_items
ALTER TABLE eveil_items 
ADD COLUMN IF NOT EXISTS pdf_files JSONB DEFAULT '[]'::jsonb;

-- 7. Créer un index pour optimiser les recherches sur les PDFs
CREATE INDEX IF NOT EXISTS idx_eveil_items_pdf_files 
ON eveil_items USING GIN (pdf_files);

-- 8. Créer une fonction pour mettre à jour les informations des PDFs
CREATE OR REPLACE FUNCTION update_eveil_pdf_files(
  item_id UUID,
  pdf_files JSONB
) RETURNS VOID AS $$
BEGIN
  UPDATE eveil_items 
  SET pdf_files = pdf_files,
      updated_at = now()
  WHERE id = item_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Créer une vue pour faciliter l'accès aux PDFs publiés
CREATE OR REPLACE VIEW eveil_pdfs_public AS
SELECT 
  ei.id,
  ei.slug,
  ei.title,
  ei.subtitle,
  ei.is_premium,
  ei.pdf_files,
  ei.created_at,
  ei.updated_at
FROM eveil_items ei
WHERE ei.is_published = true
AND ei.pdf_files IS NOT NULL
AND jsonb_array_length(ei.pdf_files) > 0;

-- 10. Politique RLS pour la vue (accès public total)
-- Note: Les vues n'ont pas de politiques RLS, elles héritent des permissions de la table sous-jacente

-- 11. Commentaires pour la documentation
COMMENT ON TABLE eveil_items IS 'Table des items d''éveil aux langues avec support PDF';
COMMENT ON COLUMN eveil_items.pdf_files IS 'Array JSON des fichiers PDF associés à cet item';
COMMENT ON FUNCTION generate_eveil_pdf_filename IS 'Génère un nom de fichier unique pour les PDFs d''éveil';
COMMENT ON FUNCTION cleanup_eveil_pdfs IS 'Nettoie tous les PDFs associés à un item supprimé';
COMMENT ON VIEW eveil_pdfs_public IS 'Vue publique des items d''éveil avec PDFs publiés';
