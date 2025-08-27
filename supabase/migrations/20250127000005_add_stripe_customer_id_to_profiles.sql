-- Migration: Ajout de stripe_customer_id à la table profiles
-- Date: 2025-01-27
-- Description: Ajouter la colonne pour lier les profils aux customers Stripe

-- Ajouter la colonne stripe_customer_id
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Ajouter un commentaire
COMMENT ON COLUMN public.profiles.stripe_customer_id IS 'ID du customer Stripe associé à ce profil';

-- Créer un index pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON public.profiles(stripe_customer_id);

-- Ajouter une contrainte d'unicité (optionnel, selon vos besoins)
-- ALTER TABLE public.profiles ADD CONSTRAINT unique_stripe_customer_id UNIQUE (stripe_customer_id);

-- Vérification de la création
DO $$
BEGIN
  RAISE NOTICE 'Colonne stripe_customer_id ajoutée avec succès à la table profiles';
  RAISE NOTICE 'Index créé pour optimiser les performances';
END $$;
