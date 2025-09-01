import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseModal from '@/components/ui/course-modal';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import CourseCard from '@/components/ui/course-card';
import CourseCardSkeleton from '@/components/ui/course-card-skeleton';
import { 
  BookOpen, 
  Search,
  Filter
} from 'lucide-react';



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
              Apprendre une langue
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvre notre collection de contenus pour progresser pas à pas.
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
                    {category} ({courseCount})
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-700">
              {filteredCourses.length} cours trouvé{filteredCourses.length > 1 ? 's' : ''}
              {selectedCategory !== 'all' && ` dans ${selectedCategory}`}
            </p>
          </div>

          {/* Courses Grid */}
          {coursesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <CourseCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
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
