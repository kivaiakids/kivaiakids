-- Script de test pour la migration Éveil aux langues
-- À exécuter dans Supabase SQL Editor pour vérifier que tout fonctionne

-- 1. Vérifier que les types existent
SELECT enumlabel FROM pg_enum WHERE enumtypid = 'public.eveil_section'::regtype;

-- 2. Vérifier que la table existe
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'eveil_items' AND table_schema = 'public';

-- 3. Vérifier les indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'eveil_items';

-- 4. Vérifier les policies RLS
SELECT policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'eveil_items';

-- 5. Tester l'insertion d'un item de test
INSERT INTO public.eveil_items (
  section, 
  slug, 
  title, 
  subtitle, 
  media, 
  tags, 
  is_premium, 
  is_published, 
  order_index
) VALUES (
  'ateliers_interactifs',
  'test-migration',
  'Test Migration',
  'Item de test pour vérifier la migration',
  '[{"type": "image", "url": "/media/test.jpg", "caption": "Image de test"}]',
  ARRAY['test', 'migration'],
  false,
  true,
  999
);

-- 6. Vérifier l'insertion
SELECT * FROM public.eveil_items WHERE slug = 'test-migration';

-- 7. Nettoyer le test
DELETE FROM public.eveil_items WHERE slug = 'test-migration';

-- 8. Vérifier les données de seed
SELECT section, COUNT(*) as count 
FROM public.eveil_items 
GROUP BY section 
ORDER BY section;
