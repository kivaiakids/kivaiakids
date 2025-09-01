import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  Shield, 
  Users, 
  Star,
  Crown,
  Zap,
  Clock,
  BookOpen
} from 'lucide-react';

const Pricing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('premium');

  const handleCTAClick = (planType: string, url?: string) => {
    if (planType === 'free') {
      if (!user) {
        navigate('/auth?tab=signup');
      } else {
        navigate('/courses');
      }
    } else if (url) {
      window.location.href = url;
    } else {
      navigate('/premium');
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Nos Offres — Kivaia</title>
        <meta 
          name="description" 
          content="Choisissez l'offre Kivaia la plus adaptée : Découverte, Premium mensuel ou Annuel. Sans engagement, paiement sécurisé, contenus pédagogiques." 
        />
      </Helmet>

      <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        {/* Hero Section */}
        <section className="px-4 sm:px-6 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Choisissez l'offre qui vous correspond
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto mb-12 leading-relaxed">
              Sans engagement, accès immédiat, pensé pour les familles et les enfants.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="px-4 sm:px-6 pb-6">
          <div className="max-w-6xl mx-auto">
            {/* Mobile-first: Stack vertical */}
            <div className="flex flex-col gap-4 sm:gap-6 md:grid md:grid-cols-3 md:gap-6">
              
              {/* Découverte - Gratuit */}
              <Card className="relative bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 w-full">
                <CardContent className="p-6 sm:p-8">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                      <BookOpen className="h-6 w-6 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Kivaia Découverte</h3>
                    <div className="text-3xl font-bold text-gray-900 mb-1">0 €</div>
                    <div className="text-gray-600">/ mois</div>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">Accès à une sélection d'activités gratuites</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">Découvrez l'univers Kivaia sans engagement</span>
                    </li>
                  </ul>
                  
                  <Button
                    onClick={() => handleCTAClick('free')}
                    className="w-full h-11 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold transition-colors"
                  >
                    Commencer gratuitement
                  </Button>
                </CardContent>
              </Card>

              {/* Premium - Mensuel (Mise en avant) */}
              <Card className="relative bg-gradient-to-br from-emerald-50 to-teal-50 shadow-xl border-2 border-emerald-300 hover:shadow-2xl transition-all duration-300 w-full order-first md:order-none">
                {/* Badge Populaire */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-emerald-600 text-white font-bold px-4 py-1.5 shadow-lg">
                    <Star className="h-3 w-3 mr-1" />
                    Populaire
                  </Badge>
                </div>
                
                <CardContent className="p-6 sm:p-8 pt-8">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mb-4">
                      <Crown className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Kivaia Premium</h3>
                    <div className="text-3xl font-bold text-emerald-600 mb-1">9,90 €</div>
                    <div className="text-gray-600">/ mois</div>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">Accès illimité à toutes les activités, jeux, vidéos, comptines, fiches pédagogiques…</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">Paiement mensuel, sans engagement</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">Idéal pour les familles actives</span>
                    </li>
                  </ul>
                  
                  <Button
                    onClick={() => handleCTAClick('premium', 'https://buy.stripe.com/cNi7sL3D97Px25kfDA4Rq00')}
                    className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors"
                  >
                    Démarrer Premium
                  </Button>
                </CardContent>
              </Card>

              {/* Annuel */}
              <Card className="relative bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 w-full">
                <CardContent className="p-6 sm:p-8">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                      <Zap className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Kivaia Annuel</h3>
                    <div className="text-3xl font-bold text-gray-900 mb-1">99 €</div>
                    <div className="text-gray-600">/ an</div>
                    <div className="mt-2">
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                        ≈ 2 mois offerts
                      </Badge>
                    </div>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">Accès illimité pendant 12 mois</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">≈ 2 mois offerts vs mensuel</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">Tranquillité d'un seul paiement</span>
                    </li>
                  </ul>
                  
                  <Button
                    onClick={() => handleCTAClick('annual', 'https://buy.stripe.com/14A00jgpV1r9bFUezw4Rq01')}
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
                  >
                    Choisir l'offre annuelle
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Réassurances */}
        <section className="px-4 sm:px-6 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Mobile: Stack vertical, Desktop: Horizontal */}
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6 sm:justify-center">
              <div className="flex items-center space-x-3 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-full flex-shrink-0">
                  <Shield className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                </div>
                <span className="text-sm font-medium text-gray-900">Sans engagement</span>
              </div>
              
              <div className="flex items-center space-x-3 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full flex-shrink-0">
                  <Shield className="h-5 w-5 text-blue-600" aria-hidden="true" />
                </div>
                <span className="text-sm font-medium text-gray-900">Paiement sécurisé</span>
              </div>
              
              <div className="flex items-center space-x-3 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full flex-shrink-0">
                  <Users className="h-5 w-5 text-purple-600" aria-hidden="true" />
                </div>
                <span className="text-sm font-medium text-gray-900">Contenus validés par des pédagogues</span>
              </div>
            </div>
            
            {/* Bandeau annulation */}
            <div className="text-center mt-6">
              <p className="text-xs text-gray-500">
                Annulation en un clic depuis votre espace
              </p>
            </div>
          </div>
        </section>

        {/* CTA Sticky Mobile */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 shadow-lg backdrop-blur-sm sm:hidden">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-900">Démarrer Premium</div>
              <div className="text-xs text-gray-600">9,90 € / mois</div>
            </div>
            <Button
              onClick={() => handleCTAClick('premium', 'https://buy.stripe.com/cNi7sL3D97Px25kfDA4Rq00')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2"
            >
              Choisir
            </Button>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Pricing;
