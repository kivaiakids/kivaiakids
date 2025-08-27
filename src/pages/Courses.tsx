import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseModal from '@/components/ui/course-modal';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { 
  BookOpen, 
  Play, 
  Clock, 
  Star,
  Calculator,
  Microscope,
  Globe,
  Palette,
  Music,
  Computer,
  Search,
  Filter
} from 'lucide-react';

const categoryIcons = {
  mathematiques: Calculator,
  sciences: Microscope,
  langues: Globe,
  histoire: BookOpen,
  geographie: Globe,
  arts: Palette,
  sport: Music,
  informatique: Computer
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

const Courses = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, searchTerm, selectedCategory]);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
      
      // Extract unique categories from courses
      const categories = [...new Set(data?.map(course => course.category) || [])];
      setAvailableCategories(categories);
    } catch (error) {
      console.error('Erreur lors du chargement des cours:', error);
    } finally {
      setCoursesLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCourses(filtered);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
                      <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Nos Cours 📚
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Découvre notre collection de cours interactifs et amusants pour apprendre en t'amusant !
              </p>
            </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl p-6 mb-8 shadow-lg border border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher un cours..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-300 focus:border-blue-500"
                />
              </div>


            </div>

            {/* Category Pills */}
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge
                variant={selectedCategory === 'all' ? 'default' : 'secondary'}
                className={`cursor-pointer transition-all ${
                  selectedCategory === 'all' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-700'
                }`}
                onClick={() => setSelectedCategory('all')}
              >
                Tous ({courses.length})
              </Badge>
              {availableCategories.map((category) => {
                const courseCount = courses.filter(course => course.category === category).length;
                return (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'secondary'}
                    className={`cursor-pointer transition-all ${
                      selectedCategory === category 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-700'
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {categoryNames[category as keyof typeof categoryNames]} ({courseCount})
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-700">
              {filteredCourses.length} cours trouvé{filteredCourses.length > 1 ? 's' : ''}
              {selectedCategory !== 'all' && ` dans ${categoryNames[selectedCategory as keyof typeof categoryNames]}`}
            </p>
          </div>

          {/* Courses Grid */}
          {coursesLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
              <p className="text-green-600 mt-4">Chargement des cours...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => {
                const IconComponent = categoryIcons[course.category as keyof typeof categoryIcons] || BookOpen;
                const colorClass = categoryColors[course.category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800';
                
                return (
                                     <Card key={course.id} className="bg-white hover:shadow-lg transition-all hover:scale-105 border border-gray-200">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <IconComponent className="h-5 w-5 text-gray-600" />
                          <Badge className={`${colorClass} border`}>
                            {categoryNames[course.category as keyof typeof categoryNames]}
                          </Badge>
                        </div>
                        {course.is_premium && (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                            <Star className="h-3 w-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg text-gray-800">{course.title}</CardTitle>
                      {course.description && (
                        <CardDescription className="line-clamp-2 text-gray-600">
                          {course.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        {course.duration_minutes && (
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{course.duration_minutes} min</span>
                          </div>
                        )}
                      </div>
                      
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedCourse(course);
                          setIsModalOpen(true);
                        }}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Voir le cours
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {filteredCourses.length === 0 && !coursesLoading && (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-800 mb-2">Aucun cours trouvé</h3>
              <p className="text-green-600 mb-4">
                {searchTerm ? `Aucun cours ne correspond à "${searchTerm}"` : 'Aucun cours disponible dans cette catégorie'}
              </p>
              {searchTerm && (
                <Button
                  onClick={() => setSearchTerm('')}
                  variant="outline"
                  className="border-green-300 text-green-700 hover:bg-green-50"
                >
                  Effacer la recherche
                </Button>
              )}
            </div>
          )}

          {/* Course Modal */}
          <CourseModal
            course={selectedCourse}
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedCourse(null);
            }}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Courses;
