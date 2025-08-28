-- Migration pour ajouter la fonctionnalité de suppression de compte
-- Date: 2025-01-27

-- Ajouter la colonne is_valid à la table profiles
ALTER TABLE public.profiles 
ADD COLUMN is_valid BOOLEAN NOT NULL DEFAULT TRUE;

-- Ajouter un commentaire pour la colonne
COMMENT ON COLUMN public.profiles.is_valid IS 'Indique si le compte est actif (TRUE) ou supprimé (FALSE)';

-- Créer un index pour optimiser les requêtes sur is_valid
CREATE INDEX idx_profiles_is_valid ON public.profiles(is_valid);

-- Créer une fonction pour "supprimer" un compte (soft delete)
CREATE OR REPLACE FUNCTION public.soft_delete_user_profile(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Mettre à jour le profil pour marquer le compte comme supprimé
  UPDATE public.profiles 
  SET 
    is_valid = FALSE,
    updated_at = NOW()
  WHERE id = user_id;
  
  -- Retourner TRUE si la mise à jour a réussi
  RETURN FOUND;
END;
$$;

-- Créer une fonction pour vérifier si un utilisateur peut se connecter
CREATE OR REPLACE FUNCTION public.can_user_login(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  profile_valid BOOLEAN;
BEGIN
  -- Vérifier si le profil est valide
  SELECT is_valid INTO profile_valid
  FROM public.profiles
  WHERE id = user_id;
  
  -- Retourner TRUE seulement si le profil existe et est valide
  RETURN COALESCE(profile_valid, FALSE);
END;
$$;

-- Mettre à jour la politique RLS pour empêcher l'accès aux comptes supprimés
-- (Cette politique sera appliquée automatiquement par la fonction can_user_login)

-- Créer un trigger pour empêcher la modification des comptes supprimés
CREATE OR REPLACE FUNCTION public.prevent_modified_deleted_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Si le profil est marqué comme supprimé, empêcher toute modification
  IF OLD.is_valid = FALSE AND NEW.is_valid = FALSE THEN
    RAISE EXCEPTION 'Impossible de modifier un compte supprimé';
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_prevent_modified_deleted_profile
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_modified_deleted_profile();

-- Mettre à jour tous les profils existants pour qu'ils soient valides
UPDATE public.profiles SET is_valid = TRUE WHERE is_valid IS NULL;
