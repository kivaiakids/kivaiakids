import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UseStripePortalReturn {
  openPortal: () => Promise<void>;
  isLoading: boolean;
}

export const useStripePortal = (): UseStripePortalReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const openPortal = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour gérer votre abonnement.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Récupérer le token d'authentification
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('Token d\'authentification manquant');
      }

      // Appeler la fonction Edge Supabase
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-portal-link`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erreur lors de l\'ouverture du portail');
      }

      const { url } = await response.json();

      if (!url) {
        throw new Error('URL du portail non reçue');
      }

      // Rediriger vers le portail Stripe
      window.location.href = url;

    } catch (error) {
      console.error('Erreur lors de l\'ouverture du portail Stripe:', error);
      
      let errorMessage = 'Impossible d\'ouvrir le portail de facturation.';
      
      if (error instanceof Error) {
        if (error.message.includes('Token d\'authentification manquant')) {
          errorMessage = 'Session expirée. Veuillez vous reconnecter.';
        } else if (error.message.includes('portail de facturation')) {
          errorMessage = 'Erreur technique. Veuillez réessayer plus tard.';
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    openPortal,
    isLoading,
  };
};
