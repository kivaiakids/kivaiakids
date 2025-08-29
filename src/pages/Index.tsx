import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import CourseModal from '@/components/ui/course-modal';
import CourseCard from '@/components/ui/course-card';
import CourseCardSkeleton from '@/components/ui/course-card-skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Users, 
  Trophy, 
  Crown,
  Check,
  Shield,
  Zap,
  Clock,
  Star
} from 'lucide-react';



const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des cours:', error);
    } finally {
      setCoursesLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <Hero 
        title="Bienvenue sur KivaïaKids !"
        subtitle="Une plateforme éducative simple et efficace pour apprendre les langues"
        ctaLabel="Rejoindre maintenant"
      />

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 relative overflow-hidden">
        {/* Subtle background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-purple-100/30 to-pink-100/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-br from-orange-100/20 to-yellow-100/20 rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 mb-8 leading-tight">
              Pourquoi choisir KivaïaKids ?
            </h2>
            <p className="text-gray-700 text-2xl max-w-4xl mx-auto leading-relaxed font-medium">
              Notre plateforme offre une expérience d'apprentissage unique, adaptée aux besoins des jeunes apprenants
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <Card className="text-center group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 hover:scale-105 bg-white/95 backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden">
              <div className="bg-gradient-to-br from-purple-400 to-pink-500 p-2">
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 rounded-2xl w-24 h-24 mx-auto mb-6 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="h-12 w-12 text-white" />
                </div>
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-3xl font-black text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                  Contenu Éducatif
                </CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <p className="text-gray-600 text-lg leading-relaxed font-medium">
                  Des cours conçus par des experts pédagogiques, adaptés à chaque tranche d'âge
                </p>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 hover:scale-105 bg-white/95 backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden" style={{ animationDelay: '0.2s' }}>
              <div className="bg-gradient-to-br from-orange-400 to-yellow-500 p-2">
                <div className="bg-gradient-to-br from-orange-500 to-yellow-600 p-6 rounded-2xl w-24 h-24 mx-auto mb-6 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <Trophy className="h-12 w-12 text-white" />
                </div>
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-3xl font-black text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
                  Méthode Simple
                </CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <p className="text-gray-600 text-lg leading-relaxed font-medium">
                  Une approche claire et directe pour progresser efficacement dans ton apprentissage
                </p>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 hover:scale-105 bg-white/95 backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden" style={{ animationDelay: '0.4s' }}>
              <div className="bg-gradient-to-br from-blue-400 to-cyan-500 p-2">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-6 rounded-2xl w-24 h-24 mx-auto mb-6 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-10 w-10 text-white" />
                </div>
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-3xl font-black text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                  Environnement Sûr
                </CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <p className="text-gray-600 text-lg leading-relaxed font-medium">
                  Un espace sécurisé et contrôlé, spécialement conçu pour la sécurité des enfants
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Courses Preview Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 relative overflow-hidden">
        {/* Subtle background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-48 h-48 bg-gradient-to-br from-indigo-100/30 to-purple-100/30 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-br from-teal-100/25 to-emerald-100/25 rounded-full blur-xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-8 leading-tight">
              Nos 3 derniers cours !
            </h2>
            <p className="text-gray-700 text-2xl max-w-4xl mx-auto leading-relaxed font-medium">
              Découvre nos contenus les plus récents et passionnants
            </p>
          </div>

          {coursesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <CourseCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onClick={() => {
                    setSelectedCourse(course);
                    setIsModalOpen(true);
                  }}
                />
              ))}
            </div>
          )}

          {courses.length === 0 && !coursesLoading && (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Aucun cours disponible</h3>
              <p className="text-muted-foreground">
                Les premiers cours seront bientôt ajoutés par notre équipe !
              </p>
            </div>
          )}

          {courses.length > 0 && (
            <div className="text-center mt-8 space-y-4">
              <Button
                onClick={() => navigate('/courses')}
                size="lg"
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-black px-10 py-5 text-xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1 hover:scale-105"
              >
                🚀 Voir tous les cours
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Section Premium Attractive */}
      <section className="py-20 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-red-200 to-pink-300 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-orange-200 to-yellow-300 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-8 shadow-2xl">
              <Crown className="h-12 w-12 text-white" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-orange-800 mb-6">
              Débloque tout le contenu Premium ! 🚀
            </h2>
            
            <p className="text-xl text-orange-600 max-w-4xl mx-auto mb-8">
              Accède à tous nos cours exclusifs, exercices avancés et support prioritaire pour accélérer ton apprentissage des langues
            </p>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
              {/* Plan Mensuel */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border-2 border-orange-200 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="text-center mb-6">
                  <Badge className="bg-orange-100 text-orange-700 border-orange-200 mb-4">
                    <Clock className="h-3 w-3 mr-1" />
                    Mensuel
                  </Badge>
                  <div className="text-4xl font-bold text-orange-800 mb-2">
                    9,90€
                  </div>
                  <div className="text-orange-600">par mois</div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Accès à tous les cours premium</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Support prioritaire</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Contenu exclusif</span>
                  </li>
                </ul>
                
                <Button
                  onClick={() => navigate('/premium')}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Star className="h-5 w-5 mr-2" />
                  Commencer maintenant
                </Button>
              </div>

              {/* Plan Annuel - Featured */}
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-2xl p-8 shadow-2xl border-0 relative hover:shadow-3xl transition-all duration-300 hover:scale-105">
                {/* Popular Badge */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-white text-orange-600 font-bold px-4 py-2 border-0 shadow-lg">
                    <Star className="h-3 w-3 mr-1" />
                    POPULAIRE
                  </Badge>
                </div>
                
                <div className="text-center mb-6 pt-4">
                  <div className="text-4xl font-bold text-white mb-2">
                    99€
                  </div>
                  <div className="text-yellow-100 text-lg">par an</div>
                  <div className="bg-white/20 rounded-lg p-3 mt-4">
                    <p className="text-yellow-100 text-sm font-medium">
                      Économisez 19,80€ par an !
                    </p>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-yellow-200" />
                    <span className="text-white">Tout du plan mensuel</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-yellow-200" />
                    <span className="text-white">2 mois gratuits</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-yellow-200" />
                    <span className="text-white">Support VIP</span>
                  </li>
                </ul>
                
                <Button
                  onClick={() => navigate('/premium')}
                  className="w-full bg-white text-orange-600 hover:bg-gray-100 font-bold py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Crown className="h-5 w-5 mr-2" />
                  Choisir l'offre annuelle
                </Button>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="bg-white/60 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-orange-600" />
                </div>
                <h4 className="font-semibold text-orange-800 mb-2">Paiement sécurisé</h4>
                <p className="text-orange-600 text-sm">
                  Stripe garantit la sécurité
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-white/60 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
                <h4 className="font-semibold text-orange-800 mb-2">Support dédié</h4>
                <p className="text-orange-600 text-sm">
                  Une équipe à l'écoute
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-white/60 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-orange-600" />
                </div>
                <h4 className="font-semibold text-orange-800 mb-2">Contenu frais</h4>
                <p className="text-orange-600 text-sm">
                  Nouveaux cours régulièrement
                </p>
              </div>
            </div>

            {/* CTA Final */}
            <div className="mt-12">
              <Button
                onClick={() => navigate('/premium')}
                size="lg"
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold px-12 py-6 text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
              >
                <Crown className="h-6 w-6 mr-3" />
                Débloquer Premium maintenant !
              </Button>
              
              <p className="text-orange-600 mt-4 text-sm">
                Rejoins des milliers d'apprenants qui ont déjà fait le choix du Premium
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Course Modal */}
      <CourseModal
        course={selectedCourse}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCourse(null);
        }}
      />
    </Layout>
  );
};

export default Index;
