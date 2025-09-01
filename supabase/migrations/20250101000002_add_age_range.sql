-- Migration: Ajout de la colonne age_range pour le filtrage par tranches d'âge
-- Date: 2025-01-01

-- 1. Créer l'enum pour les tranches d'âge
CREATE TYPE age_range AS ENUM (
  '12-18_months',
  '2_years', 
  '3_years',
  'up_to_12_years'
);

-- 2. Ajouter la colonne age_range à la table courses
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS age_range age_range DEFAULT 'up_to_12_years';

-- 3. Ajouter la colonne age_range à la table eveil_items
ALTER TABLE eveil_items 
ADD COLUMN IF NOT EXISTS age_range age_range DEFAULT 'up_to_12_years';

-- 4. Créer des index pour optimiser le filtrage
CREATE INDEX IF NOT EXISTS idx_courses_age_range ON courses(age_range);
CREATE INDEX IF NOT EXISTS idx_eveil_items_age_range ON eveil_items(age_range);

-- 5. Mettre à jour les items existants avec une valeur par défaut
UPDATE courses SET age_range = 'up_to_12_years' WHERE age_range IS NULL;
UPDATE eveil_items SET age_range = 'up_to_12_years' WHERE age_range IS NULL;

-- 6. Rendre la colonne obligatoire
ALTER TABLE courses ALTER COLUMN age_range SET NOT NULL;
ALTER TABLE eveil_items ALTER COLUMN age_range SET NOT NULL;

-- 7. Créer une fonction helper pour obtenir le libellé en français
CREATE OR REPLACE FUNCTION get_age_range_label(age_range age_range) 
RETURNS TEXT AS $$
BEGIN
  RETURN CASE age_range
    WHEN '12-18_months' THEN '12 mois à 18 mois'
    WHEN '2_years' THEN '2 ans'
    WHEN '3_years' THEN '3 ans'
    WHEN 'up_to_12_years' THEN 'Jusqu''à 12 ans'
    ELSE 'Non spécifié'
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 8. Créer une vue pour faciliter l'affichage des cours avec labels
CREATE OR REPLACE VIEW courses_with_age_labels AS
SELECT 
  c.*,
  get_age_range_label(c.age_range) as age_range_label
FROM courses c;

-- 9. Créer une vue pour faciliter l'affichage des items d'éveil avec labels
CREATE OR REPLACE VIEW eveil_items_with_age_labels AS
SELECT 
  e.*,
  get_age_range_label(e.age_range) as age_range_label
FROM eveil_items e;
