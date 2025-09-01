-- Script de test pour la configuration des PDFs d'éveil aux langues
-- À exécuter après la migration principale

-- 1. Vérifier que la colonne pdf_files existe
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'eveil_items' 
AND column_name = 'pdf_files';

-- 2. Vérifier que les fonctions existent
SELECT 
  routine_name, 
  routine_type,
  data_type
FROM information_schema.routines 
WHERE routine_name IN (
  'generate_eveil_pdf_filename',
  'cleanup_eveil_pdfs',
  'update_eveil_pdf_files',
  'get_eveil_pdf_download_url'
);

-- 3. Vérifier que le trigger existe
SELECT 
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'eveil_pdfs_cleanup_trigger';

-- 4. Vérifier que la vue existe
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_name = 'eveil_pdfs_public';

-- 5. Tester la fonction generate_eveil_pdf_filename
SELECT 
  generate_eveil_pdf_filename(
    '123e4567-e89b-12d3-a456-426614174000'::uuid,
    'test.pdf',
    false
  ) as published_filename,
  generate_eveil_pdf_filename(
    '123e4567-e89b-12d3-a456-426614174000'::uuid,
    'test.pdf',
    true
  ) as premium_filename;

-- 6. Vérifier les politiques RLS sur storage.objects
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%eveil%';

-- 7. Tester l'insertion d'un item avec PDFs
INSERT INTO eveil_items (
  section,
  slug,
  title,
  subtitle,
  media,
  pdf_files,
  tags,
  is_premium,
  is_published,
  order_index,
  author_id
) VALUES (
  'ateliers-interactifs',
  'test-pdf-upload',
  'Test PDF Upload',
  'Test de la fonctionnalité PDF',
  '[]'::jsonb,
  '[
    {
      "id": "pdf-1",
      "filename": "test1.pdf",
      "original_name": "Document Test 1.pdf",
      "size": 1024000,
      "url": "https://example.com/test1.pdf",
      "uploaded_at": "2025-01-01T10:00:00Z",
      "is_premium": false
    },
    {
      "id": "pdf-2",
      "filename": "test2.pdf",
      "original_name": "Document Premium.pdf",
      "size": 2048000,
      "url": "https://example.com/test2.pdf",
      "uploaded_at": "2025-01-01T11:00:00Z",
      "is_premium": true
    }
  ]'::jsonb,
  '["test", "pdf"]',
  true,
  true,
  1,
  '00000000-0000-0000-0000-000000000000'
) RETURNING id, title, pdf_files;

-- 8. Vérifier que l'item a bien été créé avec ses PDFs
SELECT 
  id,
  title,
  jsonb_array_length(pdf_files) as pdf_count,
  pdf_files
FROM eveil_items 
WHERE slug = 'test-pdf-upload';

-- 9. Tester la fonction update_eveil_pdf_files
SELECT update_eveil_pdf_files(
  (SELECT id FROM eveil_items WHERE slug = 'test-pdf-upload'),
  '[
    {
      "id": "pdf-3",
      "filename": "test3.pdf",
      "original_name": "Nouveau Document.pdf",
      "size": 1536000,
      "url": "https://example.com/test3.pdf",
      "uploaded_at": "2025-01-01T12:00:00Z",
      "is_premium": false
    }
  ]'::jsonb
);

-- 10. Vérifier la mise à jour
SELECT 
  id,
  title,
  jsonb_array_length(pdf_files) as pdf_count,
  pdf_files
FROM eveil_items 
WHERE slug = 'test-pdf-upload';

-- 11. Tester la vue publique
SELECT * FROM eveil_pdfs_public WHERE slug = 'test-pdf-upload';

-- 12. Nettoyer le test
DELETE FROM eveil_items WHERE slug = 'test-pdf-upload';

-- 13. Vérifier que le nettoyage a fonctionné
SELECT COUNT(*) as remaining_items FROM eveil_items WHERE slug = 'test-pdf-upload';

-- Résumé des tests
SELECT 
  'Configuration PDFs' as test_suite,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'eveil_items' AND column_name = 'pdf_files'
    ) THEN '✅ Colonne pdf_files créée'
    ELSE '❌ Colonne pdf_files manquante'
  END as column_test,
  
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.routines 
      WHERE routine_name = 'generate_eveil_pdf_filename'
    ) THEN '✅ Fonctions PDF créées'
    ELSE '❌ Fonctions PDF manquantes'
  END as functions_test,
  
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.triggers 
      WHERE trigger_name = 'eveil_pdfs_cleanup_trigger'
    ) THEN '✅ Trigger de nettoyage créé'
    ELSE '❌ Trigger de nettoyage manquant'
  END as trigger_test,
  
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_name = 'eveil_pdfs_public'
    ) THEN '✅ Vue publique créée'
    ELSE '❌ Vue publique manquante'
  END as view_test;
