import { supabase } from '@/integrations/supabase/client';

// Types pour les événements Stripe
interface StripeCustomer {
  id: string;
  email: string;
  metadata?: {
    user_id?: string;
  };
}

interface StripeSubscription {
  id: string;
  customer: string;
  status: string;
  current_period_start: number;
  current_period_end: number;
  items: {
    data: Array<{
      price: {
        id: string;
        metadata?: {
          plan?: string;
        };
      };
    }>;
  };
}

interface StripeEvent {
  type: string;
  data: {
    object: StripeSubscription | StripeCustomer;
  };
}

// Fonction pour traiter les webhooks Stripe
export const handleStripeWebhook = async (event: StripeEvent) => {
  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object as StripeSubscription);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionCancellation(event.data.object as StripeSubscription);
        break;
      
      case 'customer.created':
        await handleCustomerCreated(event.data.object as StripeCustomer);
        break;
      
      default:
        console.log(`Événement Stripe non géré: ${event.type}`);
    }
  } catch (error) {
    console.error('Erreur lors du traitement du webhook Stripe:', error);
    throw error;
  }
};

// Gérer la création/mise à jour d'un abonnement
const handleSubscriptionChange = async (subscription: StripeSubscription) => {
  try {
    // Déterminer le plan basé sur le prix
    const plan = determinePlan(subscription.items.data[0]?.price?.id);
    
    // Convertir les timestamps Stripe en dates
    const currentPeriodStart = new Date(subscription.current_period_start * 1000);
    const currentPeriodEnd = new Date(subscription.current_period_end * 1000);
    
    // Récupérer l'user_id depuis le customer
    const { data: customerData, error: customerError } = await supabase
      .from('profiles')
      .select('id')
      .eq('stripe_customer_id', subscription.customer)
      .single();

    if (customerError || !customerData) {
      console.error('Customer non trouvé pour l\'abonnement:', subscription.customer);
      return;
    }

    const userId = customerData.id;
    
    // Vérifier si l'abonnement existe déjà
    const { data: existingSubscription, error: checkError } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('stripe_subscription_id', subscription.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Erreur lors de la vérification de l\'abonnement existant:', checkError);
      return;
    }

    if (existingSubscription) {
      // Mettre à jour l'abonnement existant
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({
          status: subscription.status,
          current_period_start: currentPeriodStart.toISOString(),
          current_period_end: currentPeriodEnd.toISOString(),
          plan: plan,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingSubscription.id);

      if (updateError) {
        console.error('Erreur lors de la mise à jour de l\'abonnement:', updateError);
      } else {
        console.log('Abonnement mis à jour avec succès:', subscription.id);
      }
    } else {
      // Créer un nouvel abonnement
      const { error: insertError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          stripe_customer_id: subscription.customer,
          stripe_subscription_id: subscription.id,
          plan: plan,
          status: subscription.status,
          current_period_start: currentPeriodStart.toISOString(),
          current_period_end: currentPeriodEnd.toISOString()
        });

      if (insertError) {
        console.error('Erreur lors de la création de l\'abonnement:', insertError);
      } else {
        console.log('Nouvel abonnement créé avec succès:', subscription.id);
      }
    }
  } catch (error) {
    console.error('Erreur lors du traitement de l\'abonnement:', error);
    throw error;
  }
};

// Gérer l'annulation d'un abonnement
const handleSubscriptionCancellation = async (subscription: StripeSubscription) => {
  try {
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: 'canceled',
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscription.id);

    if (error) {
      console.error('Erreur lors de l\'annulation de l\'abonnement:', error);
    } else {
      console.log('Abonnement annulé avec succès:', subscription.id);
    }
  } catch (error) {
    console.error('Erreur lors du traitement de l\'annulation:', error);
    throw error;
  }
};

// Gérer la création d'un customer
const handleCustomerCreated = async (customer: StripeCustomer) => {
  try {
    if (customer.metadata?.user_id) {
      const { error } = await supabase
        .from('profiles')
        .update({
          stripe_customer_id: customer.id
        })
        .eq('id', customer.metadata.user_id);

      if (error) {
        console.error('Erreur lors de la mise à jour du profil avec stripe_customer_id:', error);
      } else {
        console.log('Profil mis à jour avec stripe_customer_id:', customer.id);
      }
    }
  } catch (error) {
    console.error('Erreur lors du traitement de la création du customer:', error);
    throw error;
  }
};

// Déterminer le plan basé sur l'ID du prix Stripe
const determinePlan = (priceId: string): 'monthly' | 'annual' => {
  // Ces IDs doivent correspondre à vos prix Stripe
  // À adapter selon vos configurations Stripe
  if (priceId.includes('monthly') || priceId.includes('9.90')) {
    return 'monthly';
  } else if (priceId.includes('annual') || priceId.includes('99')) {
    return 'annual';
  }
  
  // Par défaut, considérer comme annuel
  return 'annual';
};

// Fonction utilitaire pour vérifier la signature du webhook
export const verifyStripeWebhook = (payload: string, signature: string, secret: string) => {
  // Cette fonction devrait utiliser la bibliothèque Stripe pour vérifier la signature
  // Pour l'instant, on retourne true (à implémenter avec Stripe)
  return true;
};
