-- Migration: Ajout de la table subscriptions
-- Date: 2025-01-27
-- Description: Table pour gérer les abonnements premium des utilisateurs

-- Création du type enum pour le statut des abonnements
CREATE TYPE subscription_status AS ENUM (
  'active',
  'canceled',
  'past_due',
  'unpaid',
  'trialing'
);

-- Création de la table subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT NOT NULL UNIQUE,
  plan TEXT NOT NULL CHECK (plan IN ('monthly', 'annual')),
  status subscription_status NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ajout des commentaires
COMMENT ON TABLE public.subscriptions IS 'Table des abonnements premium des utilisateurs';
COMMENT ON COLUMN public.subscriptions.user_id IS 'ID de l''utilisateur abonné';
COMMENT ON COLUMN public.subscriptions.stripe_customer_id IS 'ID du client Stripe';
COMMENT ON COLUMN public.subscriptions.stripe_subscription_id IS 'ID de l''abonnement Stripe';
COMMENT ON COLUMN public.subscriptions.plan IS 'Type d''abonnement (monthly ou annual)';
COMMENT ON COLUMN public.subscriptions.status IS 'Statut actuel de l''abonnement';
COMMENT ON COLUMN public.subscriptions.current_period_start IS 'Début de la période de facturation actuelle';
COMMENT ON COLUMN public.subscriptions.current_period_end IS 'Fin de la période de facturation actuelle';

-- Création des index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON public.subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan ON public.subscriptions(plan);

-- Création d'un index composite pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status ON public.subscriptions(user_id, status);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour automatiquement updated_at
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Politique RLS pour la sécurité
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Politique : les utilisateurs ne peuvent voir que leurs propres abonnements
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Politique : seuls les admins peuvent modifier les abonnements
CREATE POLICY "Only admins can modify subscriptions" ON public.subscriptions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Insertion d'un exemple (optionnel, pour les tests)
-- INSERT INTO public.subscriptions (
--   user_id,
--   stripe_customer_id,
--   stripe_subscription_id,
--   plan,
--   status,
--   current_period_start,
--   current_period_end
-- ) VALUES (
--   '00000000-0000-0000-0000-000000000000', -- Remplacer par un vrai user_id
--   'cus_example123',
--   'sub_example456',
--   'annual',
--   'active',
--   NOW(),
--   NOW() + INTERVAL '1 year'
-- );

-- Vérification de la création
DO $$
BEGIN
  RAISE NOTICE 'Table subscriptions créée avec succès';
  RAISE NOTICE 'Index et politiques RLS configurés';
  RAISE NOTICE 'Trigger pour updated_at configuré';
END $$;
