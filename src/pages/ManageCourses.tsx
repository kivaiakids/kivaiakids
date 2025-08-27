import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import RichTextEditor from '@/components/ui/rich-text-editor';
import { 
  ArrowLeft,
  Search,
  BookOpen,
  Edit,
  Eye,
  Plus,
  Calendar,
  Clock,
  Star,
  Lock,
  FileText,
  Video,
  Music,
  Image,
  Trash2,
  Save,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

interface Course {
  id: string;
  title: string;
  description: string | null;
  category: string;
  is_premium: boolean;
  file_url: string | null;
  video_url: string | null;
  audio_url: string | null;
  thumbnail_url: string | null;
  duration_minutes: number | null;
  published: boolean;
  created_at: string;
  updated_at: string;
  content: string | null;
  learning_objective_1: string | null;
  learning_objective_2: string | null;
  learning_objective_3: string | null;
}

const ManageCourses = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!isAdmin) {
      navigate('/');
      return;
    }

    fetchCourses();
  }, [user, loading, isAdmin, navigate]);

  useEffect(() => {
    filterCourses();
  }, [courses, searchTerm, categoryFilter, statusFilter]);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
      
      // Extract unique categories
      const categories = [...new Set(data?.map(course => course.category) || [])];
      setAvailableCategories(categories);
    } catch (error) {
      console.error('Erreur lors du chargement des cours:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les cours."
      });
    } finally {
      setCoursesLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(course => course.category === categoryFilter);
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(course => 
        statusFilter === 'published' ? course.published : !course.published
      );
    }

    setFilteredCourses(filtered);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setIsEditModalOpen(true);
  };

  const handleSaveCourse = async (updatedCourse: Course) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update(updatedCourse)
        .eq('id', updatedCourse.id);

      if (error) throw error;

      // Update local state
      setCourses(prevCourses => 
        prevCourses.map(course => 
          course.id === updatedCourse.id ? updatedCourse : course
        )
      );

      setIsEditModalOpen(false);
      setEditingCourse(null);

      toast({
        title: "Cours mis à jour",
        description: "Le cours a été modifié avec succès."
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du cours:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le cours."
      });
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) return;

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;

      // Update local state
      setCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));

      toast({
        title: "Cours supprimé",
        description: "Le cours a été supprimé avec succès."
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du cours:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le cours."
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: any } = {
      mathematiques: '🧮',
      sciences: '🔬',
      langues: '🌍',
      histoire: '📚',
      geographie: '🗺️',
      arts: '🎨',
      sport: '⚽',
      informatique: '💻'
    };
    return icons[category] || '📖';
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
          <div className="mb-8">
            <Button
              variant="outline"
              onClick={() => navigate('/admin')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'administration
            </Button>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <BookOpen className="h-8 w-8 text-green-600" />
                <h1 className="text-3xl font-bold text-gray-800">Gestion des cours</h1>
              </div>
              
              <Button
                onClick={() => navigate('/admin/create-course')}
                className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Créer un cours
              </Button>
            </div>
            
            <p className="text-gray-600">
              Modifiez et gérez tous les cours de la plateforme
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border-green-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{courses.length}</div>
                <div className="text-sm text-green-600">Total cours</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {courses.filter(c => c.published).length}
                </div>
                <div className="text-sm text-blue-600">Publiés</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-yellow-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {courses.filter(c => !c.published).length}
                </div>
                <div className="text-sm text-yellow-600">Brouillons</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {courses.filter(c => c.is_premium).length}
                </div>
                <div className="text-sm text-purple-600">Premium</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="bg-white/80 backdrop-blur-sm border-green-200 mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher un cours..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    {availableCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="published">Publiés</SelectItem>
                    <SelectItem value="draft">Brouillons</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('all');
                    setStatusFilter('all');
                  }}
                  className="w-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Réinitialiser
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Courses List */}
          {coursesLoading ? (
            <Card className="bg-white/80 backdrop-blur-sm border-green-200">
              <CardContent className="p-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
                <p className="text-green-600">Chargement des cours...</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="bg-white/80 backdrop-blur-sm border-green-200 hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start space-x-4 mb-4">
                          {/* Thumbnail */}
                          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center text-white text-2xl">
                            {course.thumbnail_url ? (
                              <img 
                                src={course.thumbnail_url} 
                                alt="Thumbnail" 
                                className="w-20 h-20 rounded-lg object-cover"
                              />
                            ) : (
                              <span>{getCategoryIcon(course.category)}</span>
                            )}
                          </div>

                          {/* Course Info */}
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center space-x-2">
                              <h3 className="text-lg font-semibold text-gray-800">{course.title}</h3>
                              <Badge variant={course.published ? 'default' : 'secondary'}>
                                {course.published ? 'Publié' : 'Brouillon'}
                              </Badge>
                              {course.is_premium && (
                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                  <Star className="h-3 w-3 mr-1" />
                                  Premium
                                </Badge>
                              )}
                            </div>
                            
                            {course.description && (
                              <p className="text-gray-600 line-clamp-2">{course.description}</p>
                            )}

                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <span className="text-lg">{getCategoryIcon(course.category)}</span>
                                <span>{course.category}</span>
                              </div>
                              {course.duration_minutes && (
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{course.duration_minutes} min</span>
                                </div>
                              )}
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(course.created_at)}</span>
                              </div>
                            </div>

                            {/* Resources */}
                            <div className="flex items-center space-x-2">
                              {course.video_url && (
                                <Badge variant="outline" className="text-blue-600 border-blue-300">
                                  <Video className="h-3 w-3 mr-1" />
                                  Vidéo
                                </Badge>
                              )}
                              {course.audio_url && (
                                <Badge variant="outline" className="text-purple-600 border-purple-300">
                                  <Music className="h-3 w-3 mr-1" />
                                  Audio
                                </Badge>
                              )}
                              {course.file_url && (
                                <Badge variant="outline" className="text-green-600 border-green-300">
                                  <FileText className="h-3 w-3 mr-1" />
                                  Document
                                </Badge>
                              )}
                              {course.thumbnail_url && (
                                <Badge variant="outline" className="text-orange-600 border-orange-300">
                                  <Image className="h-3 w-3 mr-1" />
                                  Image
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditCourse(course)}
                          className="border-blue-300 text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                        
                        {!course.published ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              try {
                                const { error } = await supabase
                                  .from('courses')
                                  .update({ published: true })
                                  .eq('id', course.id);

                                if (error) throw error;

                                // Update local state
                                setCourses(prevCourses => 
                                  prevCourses.map(c => 
                                    c.id === course.id ? { ...c, published: true } : c
                                  )
                                );

                                toast({
                                  title: "Cours publié",
                                  description: "Le cours est maintenant visible pour les utilisateurs."
                                });
                              } catch (error) {
                                console.error('Erreur lors de la publication:', error);
                                toast({
                                  variant: "destructive",
                                  title: "Erreur",
                                  description: "Impossible de publier le cours."
                                });
                              }
                            }}
                            className="border-green-300 text-green-700 hover:bg-green-50"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Publier
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              try {
                                const { error } = await supabase
                                  .from('courses')
                                  .update({ published: false })
                                  .eq('id', course.id);

                                if (error) throw error;

                                // Update local state
                                setCourses(prevCourses => 
                                  prevCourses.map(c => 
                                    c.id === course.id ? { ...c, published: false } : c
                                  )
                                );

                                toast({
                                  title: "Cours dépublier",
                                  description: "Le cours n'est plus visible pour les utilisateurs."
                                });
                              } catch (error) {
                                console.error('Erreur lors de la dépublication:', error);
                                toast({
                                  variant: "destructive",
                                  title: "Erreur",
                                  description: "Impossible de dépublier le cours."
                                });
                              }
                            }}
                            className="border-orange-300 text-orange-700 hover:bg-orange-50"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Dépublier
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCourse(course.id)}
                          className="border-red-300 text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredCourses.length === 0 && (
                <Card className="bg-white/80 backdrop-blur-sm border-green-200">
                  <CardContent className="p-12 text-center">
                    <BookOpen className="h-16 w-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-green-800 mb-2">Aucun cours trouvé</h3>
                    <p className="text-green-600">
                      {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                        ? 'Aucun cours ne correspond aux critères de recherche'
                        : 'Aucun cours dans la base de données'
                      }
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editingCourse && (
        <EditCourseModal
          course={editingCourse}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingCourse(null);
          }}
          onSave={handleSaveCourse}
        />
      )}
    </Layout>
  );
};

// Composant modal d'édition (simplifié pour cet exemple)
const EditCourseModal = ({ 
  course, 
  isOpen, 
  onClose, 
  onSave 
}: { 
  course: Course; 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (course: Course) => void; 
}) => {
  const [formData, setFormData] = useState<Course>(course);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `course-thumbnails/${fileName}`;

      // Check if bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === 'course-files');
      
      if (!bucketExists) {
        toast({
          variant: "destructive",
          title: "Bucket manquant",
          description: "Le bucket 'course-files' doit être créé dans Supabase Storage."
        });
        return;
      }

      const { error: uploadError } = await supabase.storage
        .from('course-files')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('course-files')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, thumbnail_url: publicUrl }));
      toast({
        title: "Image uploadée !",
        description: "L'image a été uploadée avec succès."
      });
    } catch (error) {
      console.error('Erreur upload image:', error);
      toast({
        variant: "destructive",
        title: "Erreur upload",
        description: "Impossible d'uploader l'image. Veuillez réessayer."
      });
    } finally {
      setUploadingImage(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Modifier le cours</h2>
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <Textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Durée (minutes)</label>
                <Input
                  type="number"
                  value={formData.duration_minutes || ''}
                  onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || null })}
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.is_premium}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_premium: checked })}
                  />
                  <label className="text-sm font-medium text-gray-700">Premium</label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.published}
                    onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                  />
                  <label className="text-sm font-medium text-gray-700">Publié</label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL Vidéo</label>
                <Input
                  value={formData.video_url || ''}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL Audio</label>
                <Input
                  value={formData.audio_url || ''}
                  onChange={(e) => setFormData({ ...formData, audio_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL Document</label>
                <Input
                  value={formData.file_url || ''}
                  onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Image de couverture</label>
                <div className="space-y-4">
                  {/* Upload d'image */}
                  <div className="flex items-center space-x-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                      disabled={uploadingImage}
                    />
                    {uploadingImage && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                    )}
                  </div>

                  {/* Affichage de l'image actuelle */}
                  {formData.thumbnail_url && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Image actuelle</label>
                      <div className="relative inline-block">
                        <img
                          src={formData.thumbnail_url}
                          alt="Thumbnail"
                          className="w-32 h-32 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                          onClick={() => setFormData(prev => ({ ...prev, thumbnail_url: '' }))}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

                             <div className="md:col-span-2">
                 <label className="block text-sm font-medium text-gray-700 mb-2">Contenu</label>
                 <RichTextEditor
                   value={formData.content || ''}
                   onChange={(value) => setFormData({ ...formData, content: value })}
                   placeholder="Écrivez le contenu de votre cours..."
                 />
               </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Objectif 1</label>
                <Input
                  value={formData.learning_objective_1 || ''}
                  onChange={(e) => setFormData({ ...formData, learning_objective_1: e.target.value })}
                  placeholder="Premier objectif..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Objectif 2</label>
                <Input
                  value={formData.learning_objective_2 || ''}
                  onChange={(e) => setFormData({ ...formData, learning_objective_2: e.target.value })}
                  placeholder="Deuxième objectif..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Objectif 3</label>
                <Input
                  value={formData.learning_objective_3 || ''}
                  onChange={(e) => setFormData({ ...formData, learning_objective_3: e.target.value })}
                  placeholder="Troisième objectif..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManageCourses;
