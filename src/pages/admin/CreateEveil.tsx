import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Save, 
  Eye,
  Upload,
  FileText,
  Image,
  Headphones,
  Video
} from 'lucide-react';
import { upsertEveilItem, getEveilItemById } from '@/integrations/supabase/eveil-helpers';
import { EveilItem, MediaItem, EVEIL_SECTIONS } from '@/integrations/supabase/types-eveil';
import { useToast } from '@/hooks/use-toast';

const CreateEveil = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const isEditing = id && id !== 'new';

  const [formData, setFormData] = useState({
    section: '',
    title: '',
    subtitle: '',
    slug: '',
    media: [] as MediaItem[],
    tags: [] as string[],
    is_premium: false,
    is_published: false,
    order_index: 0
  });

  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingItem, setLoadingItem] = useState(false);

  // Redirection si pas admin
  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/');
      return;
    }
  }, [user, isAdmin, navigate]);

  // Chargement de l'item si édition
  useEffect(() => {
    if (isEditing && id) {
      const loadItem = async () => {
        try {
          setLoadingItem(true);
          const item = await getEveilItemById(id);
          if (item) {
            setFormData({
              section: item.section,
              title: item.title,
              subtitle: item.subtitle || '',
              slug: item.slug,
              media: item.media,
              tags: item.tags || [],
              is_premium: item.is_premium,
              is_published: item.is_published,
              order_index: item.order_index
            });
          }
        } catch (error) {
          console.error('Erreur lors du chargement:', error);
          toast({
            title: "Erreur",
            description: "Impossible de charger l'item",
            variant: "destructive"
          });
        } finally {
          setLoadingItem(false);
        }
      };

      loadItem();
    }
  }, [isEditing, id, toast]);

  // Génération automatique du slug
  useEffect(() => {
    if (formData.title && !isEditing) {
      const slug = formData.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, isEditing]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addMediaItem = () => {
    const newMedia: MediaItem = {
      type: 'image',
      url: '',
      caption: ''
    };
    setFormData(prev => ({
      ...prev,
      media: [...prev.media, newMedia]
    }));
  };

  const updateMediaItem = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeMediaItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSubmit = async (publish: boolean = false) => {
    if (!formData.section || !formData.title) {
      toast({
        title: "Erreur",
        description: "La section et le titre sont requis",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const itemData = {
        ...formData,
        is_published: publish || formData.is_published
      };

      await upsertEveilItem(itemData as any);
      
      toast({
        title: "Succès",
        description: `Item ${isEditing ? 'modifié' : 'créé'} avec succès`
      });
      
      navigate('/admin/eveil');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'item",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'image': return Image;
      case 'audio': return Headphones;
      case 'video': return Video;
      case 'pdf': return FileText;
      default: return FileText;
    }
  };

  if (!user || !isAdmin) {
    return null;
  }

  if (loadingItem) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p>Chargement...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/admin/eveil')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la gestion
            </Button>
            
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Modifier l\'item d\'éveil' : 'Nouvel item d\'éveil'}
            </h1>
          </div>

          <div className="space-y-6">
            {/* Informations de base */}
            <Card>
              <CardHeader>
                <CardTitle>Informations de base</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="section">Section *</Label>
                    <Select 
                      value={formData.section} 
                      onValueChange={(value) => handleInputChange('section', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une section" />
                      </SelectTrigger>
                      <SelectContent>
                        {EVEIL_SECTIONS.map(section => (
                          <SelectItem key={section.section} value={section.section}>
                            {section.icon} {section.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="order_index">Ordre d'affichage</Label>
                    <Input
                      id="order_index"
                      type="number"
                      value={formData.order_index}
                      onChange={(e) => handleInputChange('order_index', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="title">Titre *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Titre de l'activité"
                  />
                </div>

                <div>
                  <Label htmlFor="subtitle">Sous-titre</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => handleInputChange('subtitle', e.target.value)}
                    placeholder="Description courte"
                  />
                </div>

                <div>
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="url-de-l-activite"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Médias */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Médias</CardTitle>
                  <Button onClick={addMediaItem} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un média
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {formData.media.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    Aucun média ajouté
                  </p>
                ) : (
                  <div className="space-y-4">
                    {formData.media.map((media, index) => {
                      const IconComponent = getMediaIcon(media.type);
                      return (
                        <div key={index} className="border rounded-lg p-4 bg-gray-50">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <IconComponent className="w-4 h-4" />
                              <span className="font-medium">Média {index + 1}</span>
                            </div>
                            <Button
                              onClick={() => removeMediaItem(index)}
                              variant="outline"
                              size="sm"
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label>Type</Label>
                              <Select
                                value={media.type}
                                onValueChange={(value) => updateMediaItem(index, 'type', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="image">Image</SelectItem>
                                  <SelectItem value="audio">Audio</SelectItem>
                                  <SelectItem value="video">Vidéo</SelectItem>
                                  <SelectItem value="pdf">PDF</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label>URL du fichier</Label>
                              <Input
                                value={media.url}
                                onChange={(e) => updateMediaItem(index, 'url', e.target.value)}
                                placeholder="/media/mon-fichier.jpg"
                              />
                            </div>

                            <div>
                              <Label>Légende</Label>
                              <Input
                                value={media.caption || ''}
                                onChange={(e) => updateMediaItem(index, 'caption', e.target.value)}
                                placeholder="Description du média"
                              />
                            </div>
                          </div>

                          {media.type === 'video' && (
                            <div className="mt-4">
                              <Label>Poster (image de couverture)</Label>
                              <Input
                                value={media.poster || ''}
                                onChange={(e) => updateMediaItem(index, 'poster', e.target.value)}
                                placeholder="/media/poster.jpg"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Ajouter un tag"
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button onClick={addTag} variant="outline">
                      Ajouter
                    </Button>
                  </div>

                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="cursor-pointer">
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Options */}
            <Card>
              <CardHeader>
                <CardTitle>Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="is_premium">Contenu Premium</Label>
                      <p className="text-sm text-gray-500">
                        Réservé aux utilisateurs premium
                      </p>
                    </div>
                    <Switch
                      id="is_premium"
                      checked={formData.is_premium}
                      onCheckedChange={(checked) => handleInputChange('is_premium', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="is_published">Publié</Label>
                      <p className="text-sm text-gray-500">
                        Visible par les utilisateurs
                      </p>
                    </div>
                    <Switch
                      id="is_published"
                      checked={formData.is_published}
                      onCheckedChange={(checked) => handleInputChange('is_published', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button
                variant="outline"
                onClick={() => navigate('/admin/eveil')}
                disabled={loading}
              >
                Annuler
              </Button>
              
              <Button
                onClick={() => handleSubmit(false)}
                disabled={loading}
                variant="outline"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Sauvegarde...' : 'Enregistrer'}
              </Button>
              
              <Button
                onClick={() => handleSubmit(true)}
                disabled={loading}
              >
                <Eye className="w-4 h-4 mr-2" />
                {loading ? 'Publication...' : 'Enregistrer et publier'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateEveil;
