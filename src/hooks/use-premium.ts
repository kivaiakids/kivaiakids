import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  plan: 'monthly' | 'annual';
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing';
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  updated_at: string;
}

export const usePremium = () => {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsPremium(false);
      setSubscription(null);
      setLoading(false);
      return;
    }

    checkPremiumStatus();
  }, [user]);

  const checkPremiumStatus = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Erreur lors de la vérification du statut premium:', error);
        setIsPremium(false);
        setSubscription(null);
        return;
      }

      if (data) {
        // Vérifier si l'abonnement n'est pas expiré
        const now = new Date();
        const periodEnd = new Date(data.current_period_end);
        
        if (periodEnd > now) {
          setIsPremium(true);
          setSubscription(data);
        } else {
          // Abonnement expiré, le mettre à jour
          await updateExpiredSubscription(data.id);
          setIsPremium(false);
          setSubscription(null);
        }
      } else {
        setIsPremium(false);
        setSubscription(null);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du statut premium:', error);
      setIsPremium(false);
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  const updateExpiredSubscription = async (subscriptionId: string) => {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ status: 'canceled' })
        .eq('id', subscriptionId);

      if (error) {
        console.error('Erreur lors de la mise à jour du statut expiré:', error);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut expiré:', error);
    }
  };

  const refreshPremiumStatus = () => {
    checkPremiumStatus();
  };

  return {
    isPremium,
    subscription,
    loading,
    refreshPremiumStatus
  };
};
