import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { 
  BookOpen, 
  Play, 
  Clock, 
  Star,
  ArrowLeft,
  Users,
  Calendar,
  CheckCircle,
  Lock,
  ExternalLink,
  Video,
  Music,
  FileText
} from 'lucide-react';

const categoryIcons = {
  mathematiques: '🧮',
  sciences: '🔬',
  langues: '🌍',
  histoire: '📚',
  geographie: '🗺️',
  arts: '🎨',
  sport: '⚽',
  informatique: '💻'
};

const categoryColors = {
  mathematiques: 'bg-blue-100 text-blue-800 border-blue-200',
  sciences: 'bg-green-100 text-green-800 border-green-200',
  langues: 'bg-purple-100 text-purple-800 border-purple-200',
  histoire: 'bg-orange-100 text-orange-800 border-orange-200',
  geographie: 'bg-teal-100 text-teal-800 border-teal-200',
  arts: 'bg-pink-100 text-pink-800 border-pink-200',
  sport: 'bg-red-100 text-red-800 border-red-200',
  informatique: 'bg-indigo-100 text-indigo-800 border-indigo-200'
};

const categoryNames = {
  mathematiques: 'Mathématiques',
  sciences: 'Sciences',
  langues: 'Langues',
  histoire: 'Histoire',
  geographie: 'Géographie',
  arts: 'Arts',
  sport: 'Sport',
  informatique: 'Informatique'
};

const Course = () => {
  const { courseId } = useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [courseLoading, setCourseLoading] = useState(true);
  const [relatedCourses, setRelatedCourses] = useState<any[]>([]);

  useEffect(() => {
    if (courseId) {
      fetchCourse();
      fetchRelatedCourses();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .eq('published', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Course not found
          navigate('/courses');
          return;
        }
        throw error;
      }

      setCourse(data);
    } catch (error) {
      console.error('Erreur lors du chargement du cours:', error);
      navigate('/courses');
    } finally {
      setCourseLoading(false);
    }
  };

  const fetchRelatedCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('published', true)
        .neq('id', courseId)
        .limit(3);

      if (error) throw error;
      setRelatedCourses(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des cours connexes:', error);
    }
  };

  const handleStartCourse = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (course?.is_premium && !user) {
      // Handle premium course access
      navigate('/auth');
      return;
    }

    // Start the course logic here
    console.log('Starting course:', course?.title);
  };

  if (loading || courseLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Cours non trouvé</h1>
            <Button onClick={() => navigate('/courses')}>
              Retour aux cours
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 py-12 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-200 rounded-full opacity-30 animate-float"></div>
            <div className="absolute bottom-10 right-10 w-16 h-16 bg-pink-200 rounded-full opacity-40 animate-float" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => navigate('/courses')}
                className="text-white hover:bg-white/10 mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux cours
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              {/* Course Info */}
              <div className="lg:col-span-2">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-3xl">{categoryIcons[course.category as keyof typeof categoryIcons]}</span>
                  <Badge className={`${categoryColors[course.category as keyof typeof categoryColors]} border`}>
                    {categoryNames[course.category as keyof typeof categoryNames]}
                  </Badge>
                  {course.is_premium && (
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                      <Star className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {course.title}
                </h1>
                
                {course.description && (
                  <p className="text-xl text-green-100 mb-6 max-w-3xl">
                    {course.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-4 text-green-100">
                  {course.duration_minutes && (
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5" />
                      <span>{course.duration_minutes} minutes</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Publié le {new Date(course.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Course Content */}
              {course.content && (
                <Card className="bg-white/80 backdrop-blur-sm border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-800 flex items-center">
                      <BookOpen className="h-5 w-5 mr-2" />
                      Contenu du cours
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className="course-content"
                      dangerouslySetInnerHTML={{ __html: course.content }}
                    />
                  </CardContent>
                </Card>
              )}

              {/* What you'll learn */}
              {(course.learning_objective_1 || course.learning_objective_2 || course.learning_objective_3) && (
                <Card className="bg-white/80 backdrop-blur-sm border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-800 flex items-center">
                      <BookOpen className="h-5 w-5 mr-2" />
                      Ce que tu vas apprendre
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {course.learning_objective_1 && (
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{course.learning_objective_1}</span>
                        </div>
                      )}
                      {course.learning_objective_2 && (
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{course.learning_objective_2}</span>
                        </div>
                      )}
                      {course.learning_objective_3 && (
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{course.learning_objective_3}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Course resources */}
              {(course.video_url || course.audio_url || course.file_url) && (
                <Card className="bg-white/80 backdrop-blur-sm border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-800">Ressources du cours</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {course.video_url && (
                        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Video className="h-6 w-6 text-blue-600" />
                            <div>
                              <p className="font-medium text-blue-800">Vidéo</p>
                              <p className="text-sm text-blue-600">Explication détaillée</p>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-blue-300 text-blue-700"
                            onClick={() => window.open(course.video_url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Voir
                          </Button>
                        </div>
                      )}
                      
                      {course.audio_url && (
                        <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Music className="h-6 w-6 text-purple-600" />
                            <div>
                              <p className="font-medium text-purple-800">Podcast</p>
                              <p className="text-sm text-purple-600">Version audio</p>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-purple-300 text-purple-700"
                            onClick={() => window.open(course.audio_url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Écouter
                          </Button>
                        </div>
                      )}
                      
                      {course.file_url && (
                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-6 w-6 text-green-600" />
                            <div>
                              <p className="font-medium text-green-800">Document</p>
                              <p className="text-sm text-green-600">Support écrit</p>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-green-300 text-green-700"
                            onClick={() => window.open(course.file_url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Télécharger
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>


          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Course;
