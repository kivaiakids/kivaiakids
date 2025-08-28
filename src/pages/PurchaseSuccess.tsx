import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePremium } from '@/hooks/use-premium';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import { 
  CheckCircle, 
  Crown, 
  BookOpen, 
  ArrowRight, 
  Star,
  Zap,
  Users,
  Shield,
  Clock
} from 'lucide-react';

const PurchaseSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading } = useAuth();
  const { isPremium, subscription, refreshPremiumStatus } = usePremium();
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  // Récupérer les paramètres de l'URL Stripe
  const sessionId = searchParams.get('session_id');
  const customerId = searchParams.get('customer_id');

  useEffect(() => {
    if (user && sessionId) {
      // Vérifier le statut premium après un délai pour laisser le webhook Stripe traiter
      const checkStatus = async () => {
        setTimeout(async () => {
          await refreshPremiumStatus();
          setIsCheckingStatus(false);
        }, 3000); // Attendre 3 secondes pour le webhook
      };
      
      checkStatus();
    }
  }, [user, sessionId, refreshPremiumStatus]);

  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header de succès */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            
            <h1 className="text-4xl font-bold text-green-800 mb-4">
              Félicitations ! 🎉
            </h1>
            
            <p className="text-xl text-green-600 max-w-2xl mx-auto">
              Votre abonnement Premium a été activé avec succès. 
              Vous avez maintenant accès à tous nos cours premium !
            </p>
          </div>

          {/* Statut de l'abonnement */}
          <Card className="bg-white/80 backdrop-blur-sm border-green-200 mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-green-800 flex items-center justify-center">
                <Crown className="h-8 w-8 mr-3 text-yellow-500" />
                Statut de votre abonnement
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isCheckingStatus ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
                  <p className="text-green-600">Vérification de votre statut Premium...</p>
                </div>
              ) : isPremium ? (
                <div className="text-center space-y-4">
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 text-lg px-6 py-3">
                    <Star className="h-5 w-5 mr-2" />
                    Premium Actif
                  </Badge>
                  
                  {subscription && (
                    <div className="space-y-2 text-green-700">
                      <p className="text-lg">
                        <strong>Plan :</strong> {subscription.plan === 'monthly' ? 'Mensuel (9,90€/mois)' : 'Annuel (99€/an)'}
                      </p>
                      <p>
                        <strong>Actif jusqu'au :</strong> {new Date(subscription.current_period_end).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-orange-600">
                    Votre statut Premium est en cours d'activation. 
                    Cela peut prendre quelques minutes.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Avantages Premium */}
          <Card className="bg-white/80 backdrop-blur-sm border-green-200 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-green-800 text-center">
                Ce que vous débloquez maintenant
              </CardTitle>
              <CardDescription className="text-center text-lg">
                Profitez de tous les avantages Premium
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Cours Premium</h4>
                    <p className="text-gray-600">Accès à tous nos cours exclusifs</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Support Prioritaire</h4>
                    <p className="text-gray-600">Aide personnalisée et rapide</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Contenu Sécurisé</h4>
                    <p className="text-gray-600">Ressources protégées et exclusives</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-orange-100 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Apprentissage Flexible</h4>
                    <p className="text-gray-600">À votre rythme, 24h/24</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="text-center space-y-4">
            <Button
              onClick={() => navigate('/courses')}
              size="lg"
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Découvrir les cours Premium
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="border-green-300 text-green-700 hover:bg-green-50 px-6 py-3"
              >
                Retour à l'accueil
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate('/profile')}
                className="border-blue-300 text-blue-700 hover:bg-blue-50 px-6 py-3"
              >
                Mon profil
              </Button>
            </div>
          </div>

          {/* Informations techniques */}
          {sessionId && (
            <div className="mt-12 text-center text-sm text-gray-500">
              <p>Session ID: {sessionId}</p>
              {customerId && <p>Customer ID: {customerId}</p>}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PurchaseSuccess;
