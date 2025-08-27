import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePremium } from '@/hooks/use-premium';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Layout from '@/components/Layout';
import { 
  ArrowLeft,
  Star,
  Check,
  Zap,
  Crown,
  BookOpen,
  Users,
  Shield,
  Clock
} from 'lucide-react';

const Premium = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isPremium, subscription, loading } = usePremium();

  const handlePayment = (stripeUrl: string) => {
    if (user) {
      window.open(stripeUrl, '_blank');
    } else {
      navigate('/auth');
    }
  };

  const features = [
    { icon: BookOpen, text: "Accès à tous les cours premium" },
    { icon: Users, text: "Support prioritaire" },
    { icon: Shield, text: "Contenu exclusif et sécurisé" },
    { icon: Clock, text: "Apprentissage à ton rythme" },
    { icon: Zap, text: "Mises à jour régulières" }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Button>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6">
                <Crown className="h-10 w-10 text-white" />
              </div>
              
              {/* Statut Premium */}
              {user && !loading && (
                <div className="mb-6">
                  {isPremium ? (
                    <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-3 rounded-full shadow-lg">
                      <Crown className="h-5 w-5" />
                      <span className="font-semibold">
                        Vous êtes déjà Premium ! 🎉
                      </span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-full">
                      <Star className="h-5 w-5" />
                      <span className="font-medium">
                        Passez au niveau supérieur
                      </span>
                    </div>
                  )}
                </div>
              )}
              
              <h1 className="text-4xl md:text-5xl font-bold text-orange-800 mb-4">
                {isPremium ? 'Bienvenue Premium ! 👑' : 'Passe au Premium ! ⭐'}
              </h1>
              <p className="text-xl text-orange-600 max-w-3xl mx-auto">
                {isPremium 
                  ? 'Profitez de tous vos avantages premium et continuez votre apprentissage'
                  : 'Débloque tout le potentiel de KivaïaKids et accélère ton apprentissage des langues'
                }
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-orange-200">
                <feature.icon className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Monthly Plan */}
            <Card className="relative bg-white/80 backdrop-blur-sm border-orange-200 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center pb-6">
                <Badge variant="secondary" className="w-fit mx-auto mb-4 bg-orange-100 text-orange-700 border-orange-200">
                  <Clock className="h-3 w-3 mr-1" />
                  Mensuel
                </Badge>
                <CardTitle className="text-3xl font-bold text-orange-800 mb-2">
                  9,90€
                </CardTitle>
                <CardDescription className="text-orange-600 text-lg">
                  par mois
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Accès complet aux cours premium</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Support prioritaire</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Contenu exclusif</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Annulation à tout moment</span>
                  </div>
                </div>
                
                <Button
                  onClick={() => handlePayment('https://buy.stripe.com/cNi7sL3D97Px25kfDA4Rq00')}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={isPremium}
                >
                  <Star className="h-5 w-5 mr-2" />
                  {isPremium ? 'Déjà Premium' : 'Commencer maintenant'}
                </Button>
                
                <p className="text-xs text-center text-gray-500">
                  Paiement sécurisé via Stripe • Annulation gratuite
                </p>
              </CardContent>
            </Card>

            {/* Annual Plan - Featured */}
            <Card className="relative bg-gradient-to-br from-yellow-400 to-orange-500 text-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
              {/* Popular Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-white text-orange-600 font-bold px-4 py-2 border-0 shadow-lg">
                  <Star className="h-3 w-3 mr-1" />
                  POPULAIRE
                </Badge>
              </div>
              
              <CardHeader className="text-center pb-6 pt-8">
                <CardTitle className="text-3xl font-bold text-white mb-2">
                  99€
                </CardTitle>
                <CardDescription className="text-yellow-100 text-lg">
                  par an
                </CardDescription>
                <div className="bg-white/20 rounded-lg p-3 mt-4">
                  <p className="text-yellow-100 text-sm font-medium">
                    Économisez 19,80€ par an !
                  </p>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-yellow-200" />
                    <span className="text-white">Tout du plan mensuel</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-yellow-200" />
                    <span className="text-white">2 mois gratuits</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-yellow-200" />
                    <span className="text-white">Accès prioritaire aux nouveautés</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-yellow-200" />
                    <span className="text-white">Support VIP</span>
                  </div>
                </div>
                
                <Button
                  onClick={() => handlePayment('https://buy.stripe.com/14A00jgpV1r9bFUezw4Rq01')}
                  className="w-full bg-white text-orange-600 hover:bg-gray-100 font-bold py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={isPremium}
                >
                  <Crown className="h-5 w-5 mr-2" />
                  {isPremium ? 'Déjà Premium' : 'Choisir l\'offre annuelle'}
                </Button>
                
                <p className="text-xs text-center text-yellow-100">
                  Paiement sécurisé via Stripe • Économies garanties
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-orange-800 mb-8">
              Pourquoi nos utilisateurs nous font confiance
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="bg-white/60 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-orange-600" />
                </div>
                <h4 className="font-semibold text-orange-800 mb-2">Paiement sécurisé</h4>
                <p className="text-orange-600 text-sm">
                  Stripe garantit la sécurité de vos données
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-white/60 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
                <h4 className="font-semibold text-orange-800 mb-2">Support dédié</h4>
                <p className="text-orange-600 text-sm">
                  Une équipe à l'écoute de vos besoins
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-white/60 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-orange-600" />
                </div>
                <h4 className="font-semibold text-orange-800 mb-2">Contenu frais</h4>
                <p className="text-orange-600 text-sm">
                  Nouveaux cours ajoutés régulièrement
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-orange-800 text-center mb-8">
              Questions fréquentes
            </h3>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="bg-white/60 backdrop-blur-sm border-orange-200 rounded-lg mb-4">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <span className="font-semibold text-orange-800 text-left">
                    Puis-je annuler mon abonnement à tout moment ?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-gray-700">
                    Oui ! Vous pouvez annuler votre abonnement mensuel à tout moment. L'accès premium reste actif jusqu'à la fin de la période payée.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="bg-white/60 backdrop-blur-sm border-orange-200 rounded-lg mb-4">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <span className="font-semibold text-orange-800 text-left">
                    L'abonnement annuel est-il vraiment avantageux ?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-gray-700">
                    Absolument ! Avec l'abonnement annuel à 99€, vous économisez 19,80€ par an par rapport au plan mensuel (9,90€ × 12 = 118,80€).
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3" className="bg-white/60 backdrop-blur-sm border-orange-200 rounded-lg mb-4">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <span className="text-left">
                    <span className="font-semibold text-orange-800">
                      Comment fonctionne le support prioritaire ?
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-gray-700">
                    Les abonnés premium bénéficient d'un support prioritaire avec des réponses plus rapides et un accès direct à notre équipe.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4" className="bg-white/60 backdrop-blur-sm border-orange-200 rounded-lg mb-4">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <span className="font-semibold text-orange-800 text-left">
                    Que se passe-t-il après le paiement ?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-gray-700">
                    Immédiatement après votre paiement, vous recevez un email de confirmation et votre compte est automatiquement mis à jour avec l'accès premium. Vous pouvez commencer à utiliser toutes les fonctionnalités premium dès votre retour sur la plateforme.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5" className="bg-white/60 backdrop-blur-sm border-orange-200 rounded-lg mb-4">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <span className="font-semibold text-orange-800 text-left">
                    Les cours premium sont-ils différents des cours gratuits ?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-gray-700">
                    Oui ! Les cours premium offrent du contenu exclusif, des exercices avancés, des ressources supplémentaires et un suivi personnalisé de votre progression. Ils sont conçus pour accélérer votre apprentissage.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* CTA Final */}
          <div className="text-center mt-16">
            {isPremium ? (
              <>
                <h3 className="text-2xl font-bold text-green-800 mb-4">
                  Profitez de votre accès Premium ! 🎉
                </h3>
                <p className="text-green-600 mb-6">
                  Votre abonnement est actif jusqu'au {subscription?.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString('fr-FR') : 'prochain renouvellement'}
                </p>
                <Button
                  onClick={() => navigate('/courses')}
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  Accéder aux cours Premium
                </Button>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-orange-800 mb-4">
                  Prêt à accélérer ton apprentissage ?
                </h3>
                <p className="text-orange-600 mb-6">
                  Rejoins des milliers d'apprenants qui ont déjà fait le choix du Premium
                </p>
                <Button
                  onClick={() => handlePayment('https://buy.stripe.com/14A00jgpV1r9bFUezw4Rq01')}
                  size="lg"
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Crown className="h-5 w-5 mr-2" />
                  Commencer maintenant - 99€/an
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Premium;
