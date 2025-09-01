import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
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
  Trophy
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
        subtitle={"« Le plaisir de découvrir, le pouvoir de parler »\n\nKivaia Kids ouvre la porte des langues et des cultures aux enfants, accompagnés avec\nconfiance par les parents et les professionnels.\n\nApprendre devient un voyage : on joue, on chante, on rit… et on parle autrement."}
        ctaLabel="Inscrivez-vous et lancez l’aventure"
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

      {/* À qui ça s’adresse ? */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
                À qui ça s’adresse ?
              </h2>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Pour les enfants… et pour ceux qui les accompagnent.
              </h3>
              <div className="space-y-3 text-gray-700 text-lg leading-relaxed">
                <p>
                  <span className="font-semibold">Pour les enfants</span> : un monde de jeux, chansons, histoires et découvertes.
                </p>
                <p>
                  <span className="font-semibold">Pour les parents, enseignants, animateurs et assistants maternels</span> : des ressources simples, ludiques et prêtes à l’emploi.
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="aspect-video rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-emerald-100 via-teal-100 to-green-100 flex items-center justify-center">
                <img
                  src="/children1.jpg"
                  alt="Enfants apprenant les langues"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages et valeurs sociales */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Témoignages et valeurs sociales</h2>
          <div className="bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-2xl p-8 shadow-lg">
            <p className="text-gray-800 text-xl leading-relaxed">
              Chez Kivaia Kids, nous croyons que parler plusieurs langues, c’est un trésor. Ensemble, parents, enseignants et animateurs accompagnent les enfants dans cette aventure.
            </p>
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


      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              FAQ – Foire aux questions
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 mx-auto rounded-full"></div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-b border-gray-100">
                <AccordionTrigger className="text-left px-8 py-6 text-lg font-semibold text-gray-900 hover:text-emerald-600 transition-colors">
                  Mon enfant ne parle qu'une seule langue, est-ce adapté ?
                </AccordionTrigger>
                <AccordionContent className="px-8 pb-6 text-gray-700 leading-relaxed">
                  Oui, tout à fait. Kivaia Kids est pensé pour initier les enfants à d'autres langues dès le plus jeune âge, de façon intuitive, ludique et naturelle — sans pression, et à leur rythme.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border-b border-gray-100">
                <AccordionTrigger className="text-left px-8 py-6 text-lg font-semibold text-gray-900 hover:text-emerald-600 transition-colors">
                  Faut-il que je parle plusieurs langues pour utiliser Kivaia Kids avec mon enfant ?
                </AccordionTrigger>
                <AccordionContent className="px-8 pb-6 text-gray-700 leading-relaxed">
                  Non ! Les contenus sont accessibles à tous, même sans connaissance linguistique particulière. Les jeux, sons, images et vidéos sont conçus pour être autoportants et faciles à suivre.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border-b border-gray-100">
                <AccordionTrigger className="text-left px-8 py-6 text-lg font-semibold text-gray-900 hover:text-emerald-600 transition-colors">
                  Kivaia Kids est-il un site gratuit ?
                </AccordionTrigger>
                <AccordionContent className="px-8 pb-6 text-gray-700 leading-relaxed">
                  Kivaya propose des contenus gratuits pour vous permettre de découvrir l'univers. L'accès complet à la plateforme est réservé aux abonnés, afin de garantir des contenus de qualité, sans publicité, et sécurisés pour les enfants.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border-b border-gray-100">
                <AccordionTrigger className="text-left px-8 py-6 text-lg font-semibold text-gray-900 hover:text-emerald-600 transition-colors">
                  Quelles langues trouve-t-on sur Kivaia Kids ?
                </AccordionTrigger>
                <AccordionContent className="px-8 pb-6 text-gray-700 leading-relaxed">
                  Nous proposons une initiation à plusieurs langues du monde : français, anglais, espagnol, japonais, allemand, italien, arabe, portugais, Chinois, danois, néerlandais, wolof, Russe, turque, Coréen, et d'autres à venir. Chaque langue est introduite avec douceur, sonorité et immersion culturelle.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border-b border-gray-100">
                <AccordionTrigger className="text-left px-8 py-6 text-lg font-semibold text-gray-900 hover:text-emerald-600 transition-colors">
                  Combien de temps faut-il pour voir des résultats ?
                </AccordionTrigger>
                <AccordionContent className="px-8 pb-6 text-gray-700 leading-relaxed">
                  Chaque enfant apprend à son rythme. L'essentiel, c'est de créer un rendez-vous régulier, joyeux et interactif. Les résultats ne se mesurent pas seulement en mots, mais aussi en ouverture, attention, écoute, et curiosité.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger className="text-left px-8 py-6 text-lg font-semibold text-gray-900 hover:text-emerald-600 transition-colors">
                  Peut-on utiliser Kivaia Kids à la maison ou en centre d'animation ?
                </AccordionTrigger>
                <AccordionContent className="px-8 pb-6 text-gray-700 leading-relaxed">
                  Kivaia Kids est une ressource idéale pour les parents, les enseignants, les animateurs, les médiathèques, les centres éducatifs, les crèches, etc.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
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
