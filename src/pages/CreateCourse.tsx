import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { 
  ArrowLeft,
  Plus,
  Upload,
  Eye,
  EyeOff,
  Save,
  X
} from 'lucide-react';
import RichTextEditor from '@/components/ui/rich-text-editor';

const durationOptions = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

const CreateCourse = () => {
  const [existingCategories, setExistingCategories] = useState<string[]>([]);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const categoryOptions = [
    ...existingCategories.map(cat => ({ value: cat, label: cat })),
    { value: 'new', label: '+ Créer une nouvelle catégorie' }
  ];
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    is_premium: false,
    file_url: '',
    video_url: '',
    audio_url: '',
    thumbnail_url: '',
    duration_minutes: 30,
    published: false,
    content: '',
    learning_objective_1: '',
    learning_objective_2: '',
    learning_objective_3: ''
  });

  // Load existing categories
  useEffect(() => {
    const fetchCategories = async () => {
      const { data: courses } = await supabase
        .from('courses')
        .select('category');
      
      if (courses) {
        const categories = [...new Set(courses.map(course => course.category).filter(Boolean))];
        setExistingCategories(categories);
      }
    };

    fetchCategories();
  }, []);

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
  }, [user, loading, isAdmin, navigate]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCategoryChange = (value: string) => {
    if (value === 'new') {
      setShowNewCategoryInput(true);
      handleInputChange('category', '');
    } else {
      setShowNewCategoryInput(false);
      setNewCategoryName('');
      handleInputChange('category', value);
    }
  };

  const handleNewCategorySubmit = () => {
    if (newCategoryName.trim()) {
      const categoryName = newCategoryName.trim();
      handleInputChange('category', categoryName);
      setExistingCategories(prev => [...prev, categoryName]);
      setShowNewCategoryInput(false);
      setNewCategoryName('');
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file) {
      console.log('❌ Aucun fichier sélectionné');
      return;
    }

    console.log('🚀 Début de l\'upload:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    setUploadingImage(true);
    let buckets: any[] = []; // Déclarer buckets au niveau de la fonction
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `course-thumbnails/${fileName}`;
      
      console.log('📁 Informations du fichier:', {
        extension: fileExt,
        fileName: fileName,
        filePath: filePath
      });

      // Check if bucket exists
      console.log('🔍 Vérification des buckets disponibles...');
      console.log('🔧 Client Supabase configuré:', !!supabase);
      console.log('🔧 URL Supabase:', supabase.supabaseUrl);
      
      try {
        const { data: bucketsData, error: bucketsError } = await supabase.storage.listBuckets();
        
        console.log('📊 Réponse complète de listBuckets:', { data: bucketsData, error: bucketsError });
        
        if (bucketsError) {
          console.error('❌ Erreur lors de la récupération des buckets:', bucketsError);
          throw bucketsError;
        }
        
        buckets = bucketsData || []; // Assigner à la variable de niveau fonction
        
        console.log('📦 Buckets trouvés:', buckets);
        console.log('📦 Type de buckets:', typeof buckets);
        console.log('📦 Est-ce un array?', Array.isArray(buckets));
        console.log('📦 Longueur:', buckets?.length);
        
        if (buckets && buckets.length > 0) {
          console.log('📋 Détail de chaque bucket:');
          buckets.forEach((bucket, index) => {
            console.log(`  ${index + 1}. ID: "${bucket.id}", Name: "${bucket.name}", Public: ${bucket.public}`);
          });
        }
        
        const bucketExists = buckets?.some(bucket => {
          console.log(`🔍 Vérification bucket: "${bucket.name}" === "course-files" ? ${bucket.name === 'course-files'}`);
          return bucket.name === 'course-files';
        });
        
        console.log('✅ Bucket course-files existe:', bucketExists);
        
        if (!bucketExists) {
          console.error('❌ Bucket course-files non trouvé');
          console.log('📋 Buckets disponibles:', buckets?.map(b => b.name));
          console.log('📋 Recherche exacte:');
          buckets?.forEach(bucket => {
            console.log(`  - "${bucket.name}" (longueur: ${bucket.name.length})`);
            console.log(`  - Comparaison avec "course-files" (longueur: ${'course-files'.length}): ${bucket.name === 'course-files'}`);
          });
          
          toast({
            variant: "destructive",
            title: "Bucket manquant",
            description: "Le bucket 'course-files' doit être créé dans Supabase Storage."
          });
          return;
        }
      } catch (error) {
        console.error('💥 Erreur lors de la vérification des buckets:', error);
        throw error;
      }

      // Vérifier la configuration du bucket
      console.log('🔧 Configuration du bucket course-files...');
      const bucketConfig = buckets?.find(b => b.name === 'course-files');
      console.log('📋 Détails du bucket:', bucketConfig);

      console.log('📤 Tentative d\'upload vers:', filePath);
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('course-files')
        .upload(filePath, file);

      if (uploadError) {
        console.error('❌ Erreur lors de l\'upload:', uploadError);
        throw uploadError;
      }

      console.log('✅ Upload réussi:', uploadData);

      console.log('🔗 Génération de l\'URL publique...');
      const { data: { publicUrl } } = supabase.storage
        .from('course-files')
        .getPublicUrl(filePath);
      
      console.log('🌐 URL publique générée:', publicUrl);

      handleInputChange('thumbnail_url', publicUrl);
      console.log('💾 FormData mis à jour avec la nouvelle URL');
      
      toast({
        title: "Image uploadée !",
        description: "L'image a été uploadée avec succès."
      });
    } catch (error) {
      console.error('💥 Erreur complète lors de l\'upload:', error);
      console.error('📋 Détails de l\'erreur:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        stack: error.stack
      });
      
      toast({
        variant: "destructive",
        title: "Erreur d'upload",
        description: "Impossible d'uploader l'image. Vérifiez que le bucket 'course-files' existe."
      });
    } finally {
      setUploadingImage(false);
      console.log('🏁 Upload terminé (succès ou échec)');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le titre et la catégorie sont obligatoires."
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('courses')
        .insert({
          ...formData,
          created_by: user?.id
        });

      if (error) throw error;

      toast({
        title: "Cours créé !",
        description: "Le cours a été créé avec succès."
      });
      
      navigate('/admin');
    } catch (error) {
      console.error('Erreur création cours:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer le cours."
      });
    } finally {
      setIsSaving(false);
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

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/admin')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'administration
            </Button>
            
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-3 rounded-full shadow-lg">
                <Plus className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-green-800">Créer un nouveau cours</h1>
                <p className="text-green-600">Ajouter un cours à la plateforme</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card className="bg-white/80 backdrop-blur-sm border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">Informations de base</CardTitle>
                <CardDescription>Informations principales du cours</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre du cours *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Ex: Introduction aux mathématiques"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Catégorie *</Label>
                    <Select value={formData.category} onValueChange={handleCategoryChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {showNewCategoryInput && (
                      <div className="flex gap-2 mt-2">
                        <Input
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="Nom de la nouvelle catégorie"
                          onKeyPress={(e) => e.key === 'Enter' && handleNewCategorySubmit()}
                        />
                        <Button
                          type="button"
                          onClick={handleNewCategorySubmit}
                          className="px-4"
                        >
                          Créer
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Description courte du cours..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Durée (minutes)</Label>
                    <Select value={formData.duration_minutes.toString()} onValueChange={(value) => handleInputChange('duration_minutes', parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {durationOptions.map((duration) => (
                          <SelectItem key={duration} value={duration.toString()}>
                            {duration} minutes
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between space-x-4">
                    <div className="space-y-2">
                      <Label>Cours premium</Label>
                      <div className="text-sm text-gray-600">Ce cours nécessite un abonnement</div>
                    </div>
                    <Switch
                      checked={formData.is_premium}
                      onCheckedChange={(checked) => handleInputChange('is_premium', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Media URLs */}
            <Card className="bg-white/80 backdrop-blur-sm border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">Ressources média</CardTitle>
                <CardDescription>Liens vers les ressources du cours</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="video_url">URL Vidéo</Label>
                    <Input
                      id="video_url"
                      value={formData.video_url}
                      onChange={(e) => handleInputChange('video_url', e.target.value)}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="audio_url">URL Audio</Label>
                    <Input
                      id="audio_url"
                      value={formData.audio_url}
                      onChange={(e) => handleInputChange('audio_url', e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file_url">URL Document</Label>
                  <Input
                    id="file_url"
                    value={formData.file_url}
                    onChange={(e) => handleInputChange('file_url', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Thumbnail Upload */}
            <Card className="bg-white/80 backdrop-blur-sm border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">Image de couverture</CardTitle>
                <CardDescription>Uploader une image pour le cours</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="image-upload">Uploader une image</Label>
                  <div className="flex items-center space-x-4">
                    <Input
                      id="image-upload"
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
                </div>

                {formData.thumbnail_url && (
                  <div className="space-y-2">
                    <Label>Image actuelle</Label>
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
                        onClick={() => handleInputChange('thumbnail_url', '')}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Content Editor */}
            <Card className="bg-white/80 backdrop-blur-sm border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">Contenu du cours</CardTitle>
                <CardDescription>Utilisez les boutons pour formater le contenu comme dans Word</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="content">Contenu</Label>
                  <RichTextEditor
                    value={formData.content}
                    onChange={(value) => handleInputChange('content', value)}
                    placeholder="Écrivez le contenu de votre cours..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Learning Objectives */}
            <Card className="bg-white/80 backdrop-blur-sm border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">Ce que tu vas apprendre</CardTitle>
                <CardDescription>Ajoutez jusqu'à 3 objectifs d'apprentissage pour ce cours</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="learning_objective_1">Objectif 1</Label>
                  <Input
                    id="learning_objective_1"
                    value={formData.learning_objective_1}
                    onChange={(e) => handleInputChange('learning_objective_1', e.target.value)}
                    placeholder="Ex: Comprendre les bases de..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="learning_objective_2">Objectif 2</Label>
                  <Input
                    id="learning_objective_2"
                    value={formData.learning_objective_2}
                    onChange={(e) => handleInputChange('learning_objective_2', e.target.value)}
                    placeholder="Ex: Pratiquer avec..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="learning_objective_3">Objectif 3</Label>
                  <Input
                    id="learning_objective_3"
                    value={formData.learning_objective_3}
                    onChange={(e) => handleInputChange('learning_objective_3', e.target.value)}
                    placeholder="Ex: Valider tes connaissances..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Publish Settings */}
            <Card className="bg-white/80 backdrop-blur-sm border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">Publication</CardTitle>
                <CardDescription>Paramètres de publication du cours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Label>Publier immédiatement</Label>
                    <div className="text-sm text-gray-600">Rendre le cours visible aux utilisateurs</div>
                  </div>
                  <Switch
                    checked={formData.published}
                    onCheckedChange={(checked) => handleInputChange('published', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin')}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Création...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Créer le cours
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCourse;
