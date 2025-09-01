import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Search,
  ArrowLeft,
  Crown,
  Loader2
} from 'lucide-react';
import { getAllEveilItems, deleteEveilItem, toggleEveilItemPublish } from '@/integrations/supabase/eveil-helpers';
import { EveilItem, EVEIL_SECTIONS } from '@/integrations/supabase/types-eveil';
import MediaBadge from '@/components/Eveil/MediaBadge';
import { useToast } from '@/hooks/use-toast';

const ManageEveil = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [items, setItems] = useState<EveilItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<EveilItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sectionFilter, setSectionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [premiumFilter, setPremiumFilter] = useState<string>('all');

  // Redirection si pas admin
  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/');
      return;
    }
  }, [user, isAdmin, navigate]);

  // Chargement des items
  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        const data = await getAllEveilItems();
        setItems(data);
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les items d'éveil",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [toast]);

  // Filtrage
  useEffect(() => {
    let filtered = items;

    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sectionFilter !== 'all') {
      filtered = filtered.filter(item => item.section === sectionFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => 
        statusFilter === 'published' ? item.is_published : !item.is_published
      );
    }

    if (premiumFilter !== 'all') {
      filtered = filtered.filter(item => 
        premiumFilter === 'premium' ? item.is_premium : !item.is_premium
      );
    }

    setFilteredItems(filtered);
  }, [items, searchTerm, sectionFilter, statusFilter, premiumFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet item ?')) {
      return;
    }

    try {
      await deleteEveilItem(id);
      setItems(items.filter(item => item.id !== id));
      toast({
        title: "Succès",
        description: "Item supprimé avec succès"
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'item",
        variant: "destructive"
      });
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await toggleEveilItemPublish(id, !currentStatus);
      setItems(items.map(item => 
        item.id === id ? { ...item, is_published: !currentStatus } : item
      ));
      toast({
        title: "Succès",
        description: `Item ${!currentStatus ? 'publié' : 'dépublié'} avec succès`
      });
    } catch (error) {
      console.error('Erreur lors de la publication:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut de publication",
        variant: "destructive"
      });
    }
  };

  const getSectionLabel = (section: string) => {
    const sectionInfo = EVEIL_SECTIONS.find(s => s.section === section);
    return sectionInfo?.title || section;
  };

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/admin')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au panneau admin
            </Button>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Gestion des items d'éveil
                </h1>
                <p className="text-gray-600 mt-2">
                  {items.length} item{items.length > 1 ? 's' : ''} au total
                </p>
              </div>
              
              <Button 
                onClick={() => navigate('/admin/eveil/new')}
                className="mt-4 sm:mt-0"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvel item d'éveil
              </Button>
            </div>
          </div>

          {/* Filtres */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filtres</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Recherche</label>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Titre ou sous-titre..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Section</label>
                  <Select value={sectionFilter} onValueChange={setSectionFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les sections" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les sections</SelectItem>
                      {EVEIL_SECTIONS.map(section => (
                        <SelectItem key={section.section} value={section.section}>
                          {section.icon} {section.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Statut</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="published">Publié</SelectItem>
                      <SelectItem value="draft">Brouillon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Premium</label>
                  <Select value={premiumFilter} onValueChange={setPremiumFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="free">Gratuit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liste des items */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
              <span className="ml-2 text-gray-600">Chargement...</span>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredItems.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.title}
                          </h3>
                          
                          {/* Badges */}
                          <div className="flex gap-2">
                            {item.is_premium && (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                <Crown className="w-3 h-3 mr-1" />
                                Premium
                              </Badge>
                            )}
                            
                            <Badge variant={item.is_published ? "default" : "secondary"}>
                              {item.is_published ? 'Publié' : 'Brouillon'}
                            </Badge>
                          </div>
                        </div>

                        <p className="text-gray-600 mb-3">{item.subtitle}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{getSectionLabel(item.section)}</span>
                          <span>•</span>
                          <span>Ordre: {item.order_index}</span>
                          <span>•</span>
                          <span>{new Date(item.created_at).toLocaleDateString()}</span>
                        </div>

                        {/* Media badges */}
                        <div className="flex gap-2 mt-3">
                          {item.media.map((media, index) => (
                            <MediaBadge key={index} type={media.type} />
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTogglePublish(item.id, item.is_published)}
                        >
                          {item.is_published ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/admin/eveil/${item.id}/edit`)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredItems.length === 0 && !loading && (
                <div className="text-center py-12">
                  <p className="text-gray-500">Aucun item trouvé.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ManageEveil;
