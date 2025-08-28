-- Migration: Ajout du statut premium dans la table profiles
-- Date: 2025-01-27
-- Description: Ajoute une colonne is_premium dans profiles et un trigger pour la maintenir à jour

-- 1. Ajouter la colonne is_premium à la table profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN NOT NULL DEFAULT false;

-- 2. Ajouter un commentaire pour la colonne
COMMENT ON COLUMN public.profiles.is_premium IS 'Indique si l''utilisateur a un abonnement premium actif';

-- 3. Créer une fonction pour mettre à jour le statut premium
CREATE OR REPLACE FUNCTION public.update_user_premium_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Mettre à jour le statut premium de l'utilisateur
  UPDATE public.profiles 
  SET is_premium = (
    EXISTS (
      SELECT 1 FROM public.subscriptions 
      WHERE user_id = NEW.user_id 
      AND status = 'active' 
      AND current_period_end > now()
    )
  )
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Créer un trigger pour maintenir le statut premium à jour
DROP TRIGGER IF EXISTS trigger_update_premium_status ON public.subscriptions;
CREATE TRIGGER trigger_update_premium_status
  AFTER INSERT OR UPDATE OR DELETE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_premium_status();

-- 5. Mettre à jour tous les utilisateurs existants avec leur statut premium actuel
UPDATE public.profiles 
SET is_premium = (
  EXISTS (
    SELECT 1 FROM public.subscriptions 
    WHERE user_id = profiles.id 
    AND status = 'active' 
    AND current_period_end > now()
  )
);

-- 6. Créer un index pour optimiser les requêtes sur is_premium
CREATE INDEX IF NOT EXISTS idx_profiles_is_premium ON public.profiles(is_premium);

-- 7. Créer un index composite pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_profiles_role_premium ON public.profiles(role, is_premium);

-- 8. Vérification de la création
DO $$
BEGIN
  RAISE NOTICE 'Colonne is_premium ajoutée avec succès à la table profiles';
  RAISE NOTICE 'Trigger de mise à jour automatique créé';
  RAISE NOTICE 'Statuts premium mis à jour pour tous les utilisateurs existants';
END $$;
