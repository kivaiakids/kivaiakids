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
import { AgeRange } from '@/integrations/supabase/types';
import { 
  BookOpen, 
  Search,
  Filter,
  Baby,
  Users,
  GraduationCap
} from 'lucide-react';

const Courses = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAgeRanges, setSelectedAgeRanges] = useState<AgeRange[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Options de tranches d'âge avec icônes mignonnes
  const ageRangeOptions: { value: AgeRange; label: string; icon: React.ReactNode; emoji: string }[] = [
    { value: '12-18_months', label: '12-18 mois', icon: <Baby className="w-4 h-4" />, emoji: '👶' },
    { value: '2_years', label: '2 ans', icon: <Baby className="w-4 h-4" />, emoji: '🧸' },
    { value: '3_years', label: '3 ans', icon: <GraduationCap className="w-4 h-4" />, emoji: '🎨' },
    { value: 'up_to_12_years', label: 'Jusqu\'à 12 ans', icon: <Users className="w-4 h-4" />, emoji: '🌟' }
  ];

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, searchTerm, selectedCategory, selectedAgeRanges]);

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

    // Filter by age ranges
    if (selectedAgeRanges.length > 0) {
      filtered = filtered.filter(course => 
        selectedAgeRanges.includes(course.age_range)
      );
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

  const handleAgeRangeToggle = (ageRange: AgeRange) => {
    setSelectedAgeRanges(prev => 
      prev.includes(ageRange)
        ? prev.filter(ar => ar !== ageRange)
        : [...prev, ageRange]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedAgeRanges([]);
    setSearchTerm('');
  };

  const hasActiveFilters = selectedCategory !== 'all' || selectedAgeRanges.length > 0 || searchTerm;

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

              {/* Clear filters button */}
              {hasActiveFilters && (
                <Button
                  onClick={clearAllFilters}
                  variant="outline"
                  size="sm"
                  className="text-gray-600 border-gray-300 hover:bg-gray-50"
                >
                  Effacer les filtres
                </Button>
              )}
            </div>

            {/* Age Range Filter - Design mignon et intuitif */}
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">Filtrer par âge</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {ageRangeOptions.map((option) => {
                  const isSelected = selectedAgeRanges.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleAgeRangeToggle(option.value)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        isSelected
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md scale-105'
                          : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-700 hover:scale-105'
                      }`}
                    >
                      <span className="text-base">{option.emoji}</span>
                      <span>{option.label}</span>
                      {isSelected && (
                        <span className="ml-1 text-blue-100">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category Pills */}
            <div className="mt-6 flex flex-wrap gap-2">
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
              {selectedAgeRanges.length > 0 && (
                <span className="text-blue-600 font-medium">
                  {' '}pour les âges sélectionnés
                </span>
              )}
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
                {searchTerm ? `Aucun cours ne correspond à "${searchTerm}"` : 
                 selectedAgeRanges.length > 0 ? 'Aucun cours ne correspond aux âges sélectionnés' :
                 'Aucun cours disponible dans cette catégorie'}
              </p>
              {hasActiveFilters && (
                <Button
                  onClick={clearAllFilters}
                  variant="outline"
                  className="border-green-300 text-green-700 hover:bg-green-50"
                >
                  Effacer tous les filtres
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
