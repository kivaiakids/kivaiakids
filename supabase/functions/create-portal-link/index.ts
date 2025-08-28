import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Vérifier la méthode HTTP
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Méthode non autorisée' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Récupérer l'en-tête d'autorisation
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Token d\'autorisation manquant' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Initialiser le client Supabase avec la clé de service
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Variables d\'environnement Supabase manquantes')
      return new Response(
        JSON.stringify({ error: 'Configuration serveur invalide' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Vérifier le token JWT et récupérer l'utilisateur
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Token d\'autorisation invalide' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Récupérer le profil utilisateur
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email, stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ error: 'Profil utilisateur non trouvé' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Initialiser Stripe
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeSecretKey) {
      console.error('Clé secrète Stripe manquante')
      return new Response(
        JSON.stringify({ error: 'Configuration Stripe invalide' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    })

    let customerId = profile.stripe_customer_id

    // Créer un client Stripe si il n'existe pas
    if (!customerId) {
      try {
        const customer = await stripe.customers.create({
          email: profile.email,
          metadata: {
            supabase_user_id: user.id,
            created_via: 'customer_portal'
          }
        })

        customerId = customer.id

        // Sauvegarder l'ID du client dans le profil
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ stripe_customer_id: customerId })
          .eq('id', user.id)

        if (updateError) {
          console.error('Erreur lors de la sauvegarde du stripe_customer_id:', updateError)
          // On continue quand même car le client Stripe a été créé
        }
      } catch (stripeError) {
        console.error('Erreur lors de la création du client Stripe:', stripeError)
        return new Response(
          JSON.stringify({ error: 'Impossible de créer le client de facturation' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    }

    // Créer la session du portail de facturation
    try {
      const origin = req.headers.get('origin') || 'http://localhost:3000'
      const returnUrl = `${origin}/account`

      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      })

      return new Response(
        JSON.stringify({ url: session.url }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )

    } catch (portalError) {
      console.error('Erreur lors de la création de la session du portail:', portalError)
      return new Response(
        JSON.stringify({ error: 'Impossible d\'ouvrir le portail de facturation' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

  } catch (error) {
    console.error('Erreur générale:', error)
    return new Response(
      JSON.stringify({ error: 'Erreur interne du serveur' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
