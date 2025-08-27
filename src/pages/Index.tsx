import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import CourseModal from '@/components/ui/course-modal';
import { 
  BookOpen, 
  Play, 
  Clock, 
  Users, 
  Trophy, 
  Star,
  Calculator,
  Microscope,
  Globe,
  Palette,
  Music,
  Computer
} from 'lucide-react';

const categoryIcons = {
  mathematiques: Calculator,
  sciences: Microscope,
  langues: Globe,
  histoire: BookOpen,
  geographie: Globe,
  arts: Palette,
  sport: Trophy,
  informatique: Computer
};

const categoryColors = {
  mathematiques: 'bg-blue-100 text-blue-800',
  sciences: 'bg-green-100 text-green-800',
  langues: 'bg-purple-100 text-purple-800',
  histoire: 'bg-orange-100 text-orange-800',
  geographie: 'bg-teal-100 text-teal-800',
  arts: 'bg-pink-100 text-pink-800',
  sport: 'bg-red-100 text-red-800',
  informatique: 'bg-indigo-100 text-indigo-800'
};

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
      <section className="bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 py-16 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-200 rounded-full opacity-30 animate-float"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-pink-200 rounded-full opacity-40 animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-20 w-12 h-12 bg-blue-200 rounded-full opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-purple-200 rounded-full opacity-25 animate-float" style={{ animationDelay: '0.5s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-bounce-soft drop-shadow-lg">
              Bienvenue sur KivaïaKids ! 🎉
            </h1>
            <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto drop-shadow-md">
              Une plateforme éducative simple et efficace pour apprendre les langues.
              Découvre des cours dans toutes les matières !
            </p>
            
            {!user ? (
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
                <Button
                  size="lg"
                  onClick={() => navigate('/auth')}
                  className="bg-white text-green-700 hover:bg-green-50 font-semibold px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Users className="mr-2 h-5 w-5" />
                  Rejoindre maintenant
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/courses')}
                  className="bg-white/20 text-white border-white/40 hover:bg-white/30 backdrop-blur-sm px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Voir les cours
                </Button>
              </div>
            ) : (
              <Button
                size="lg"
                onClick={() => navigate('/courses')}
                className="bg-white text-green-700 hover:bg-green-50 font-semibold px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Play className="mr-2 h-5 w-5" />
                Continuer l'apprentissage
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-emerald-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-green-800 mb-4">
              Pourquoi choisir KivaïaKids ? 🌟
            </h2>
            <p className="text-green-600 text-lg max-w-2xl mx-auto">
              Notre plateforme offre une expérience d'apprentissage unique, adaptée aux besoins des jeunes apprenants
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow animate-float bg-white/80 backdrop-blur-sm border-green-200">
              <CardHeader>
                <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-green-800">Contenu Éducatif</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-600">
                  Des cours conçus par des experts pédagogiques, adaptés à chaque tranche d'âge
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow animate-float bg-white/80 backdrop-blur-sm border-pink-200" style={{ animationDelay: '0.5s' }}>
              <CardHeader>
                <div className="bg-gradient-to-br from-pink-400 to-rose-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-pink-800">Méthode Simple</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-pink-600">
                  Une approche claire et directe pour progresser efficacement dans ton apprentissage
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow animate-float bg-white/80 backdrop-blur-sm border-blue-200" style={{ animationDelay: '1s' }}>
              <CardHeader>
                <div className="bg-gradient-to-br from-blue-400 to-sky-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-blue-800">Environnement Sûr</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-600">
                  Un espace sécurisé et contrôlé, spécialement conçu pour la sécurité des enfants
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Courses Preview Section */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Nos 3 derniers cours ! 📚
            </h2>
            <p className="text-muted-foreground text-lg">
              Découvre nos contenus les plus récents
            </p>
          </div>

          {coursesLoading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => {
                const IconComponent = categoryIcons[course.category as keyof typeof categoryIcons] || BookOpen;
                const colorClass = categoryColors[course.category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800';
                
                return (
                  <Card key={course.id} className="hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <IconComponent className="h-5 w-5 text-primary" />
                          <Badge className={colorClass}>
                            {course.category}
                          </Badge>
                        </div>
                        {course.is_premium && (
                          <Badge variant="secondary">
                            <Star className="h-3 w-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      {course.description && (
                        <CardDescription className="line-clamp-2">
                          {course.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        {course.duration_minutes && (
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{course.duration_minutes} min</span>
                          </div>
                        )}
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedCourse(course);
                            setIsModalOpen(true);
                          }}
                          className="ml-auto"
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
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
            <div className="text-center mt-8">
              <Button
                onClick={() => navigate('/courses')}
                size="lg"
                className="bg-gradient-primary"
              >
                Voir tous les cours
              </Button>
            </div>
          )}
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
