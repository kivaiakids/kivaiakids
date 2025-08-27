-- Migration pour ajouter la colonne role à la table profiles
-- Cette migration ajoute la colonne role avec une valeur par défaut 'student'

-- Vérifier si la colonne role existe déjà
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'role'
    ) THEN
        -- Ajouter la colonne role
        ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'student';
        
        -- Ajouter un commentaire
        COMMENT ON COLUMN public.profiles.role IS 'Rôle de l''utilisateur: admin ou student';
        
        -- Créer un index pour améliorer les performances des requêtes par rôle
        CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
        
        -- Mettre à jour les utilisateurs existants pour qu'ils aient le rôle 'student' par défaut
        UPDATE public.profiles SET role = 'student' WHERE role IS NULL;
        
        -- Ajouter une contrainte pour limiter les valeurs possibles
        ALTER TABLE public.profiles ADD CONSTRAINT check_role_values 
        CHECK (role IN ('admin', 'student'));
        
        RAISE NOTICE 'Colonne role ajoutée avec succès à la table profiles';
    ELSE
        RAISE NOTICE 'La colonne role existe déjà dans la table profiles';
    END IF;
END $$;

-- Migration pour ajouter les colonnes d'objectifs d'apprentissage à la table courses
-- Cette migration ajoute les colonnes learning_objective_1, learning_objective_2, learning_objective_3

-- Vérifier si les colonnes existent déjà
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'courses' AND column_name = 'learning_objective_1'
    ) THEN
        -- Ajouter les colonnes d'objectifs d'apprentissage
        ALTER TABLE public.courses ADD COLUMN learning_objective_1 TEXT;
        ALTER TABLE public.courses ADD COLUMN learning_objective_2 TEXT;
        ALTER TABLE public.courses ADD COLUMN learning_objective_3 TEXT;
        
        -- Ajouter des commentaires
        COMMENT ON COLUMN public.courses.learning_objective_1 IS 'Premier objectif d''apprentissage du cours';
        COMMENT ON COLUMN public.courses.learning_objective_2 IS 'Deuxième objectif d''apprentissage du cours';
        COMMENT ON COLUMN public.courses.learning_objective_3 IS 'Troisième objectif d''apprentissage du cours';
        
        RAISE NOTICE 'Colonnes d''objectifs d''apprentissage ajoutées avec succès à la table courses';
    ELSE
        RAISE NOTICE 'Les colonnes d''objectifs d''apprentissage existent déjà dans la table courses';
    END IF;
END $$;
