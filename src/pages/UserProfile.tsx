import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { 
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Crown,
  Edit,
  Save,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserProfileData {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: 'admin' | 'student';
  avatar_url: string | null;
  created_at: string;
}

const UserProfile = () => {
  const { user, profile, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    first_name: '',
    last_name: ''
  });
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      navigate('/auth');
      return;
    }

    fetchUserProfile();
  }, [user, loading, navigate]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      
      setProfileData(data);
      setEditData({
        first_name: data.first_name || '',
        last_name: data.last_name || ''
      });
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger votre profil."
      });
    }
  };

  const handleSaveProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: editData.first_name || null,
          last_name: editData.last_name || null
        })
        .eq('id', user?.id);

      if (error) throw error;

      // Update local state
      setProfileData(prev => prev ? {
        ...prev,
        first_name: editData.first_name || null,
        last_name: editData.last_name || null
      } : null);

      setIsEditing(false);

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées avec succès."
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour votre profil."
      });
    }
  };

  const getAvatarEmoji = (avatarUrl: string): string => {
    if (avatarUrl.includes('avatar1')) return '😊';
    if (avatarUrl.includes('avatar2')) return '🎨';
    if (avatarUrl.includes('avatar3')) return '⭐';
    if (avatarUrl.includes('avatar4')) return '🚀';
    return '👤';
  };

  const handleAvatarSelect = async (avatarNumber: string) => {
    try {
      setUploadingAvatar(true);
      
      const avatarUrl = `/avatars/avatar${avatarNumber}.png`;

      // Update profile with selected avatar URL
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', user?.id);

      if (error) throw error;

      // Update local state
      setProfileData(prev => prev ? { ...prev, avatar_url: avatarUrl } : null);

      toast({
        title: "Avatar mis à jour",
        description: "Votre avatar a été changé avec succès."
      });
    } catch (error) {
      console.error('Erreur lors du changement d\'avatar:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de changer votre avatar."
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Button>
            
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-400 to-indigo-500 p-3 rounded-full shadow-lg">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-blue-800">Mon Profil</h1>
                <p className="text-blue-600">Gérez vos informations personnelles</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-2">
              <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-blue-800">Informations personnelles</CardTitle>
                      <CardDescription>Vos données de base et paramètres</CardDescription>
                    </div>
                    {!isEditing && (
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                        className="border-blue-300 text-blue-700 hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="first_name">Prénom</Label>
                          <Input
                            id="first_name"
                            value={editData.first_name}
                            onChange={(e) => setEditData({ ...editData, first_name: e.target.value })}
                            placeholder="Votre prénom"
                          />
                        </div>
                        <div>
                          <Label htmlFor="last_name">Nom</Label>
                          <Input
                            id="last_name"
                            value={editData.last_name}
                            onChange={(e) => setEditData({ ...editData, last_name: e.target.value })}
                            placeholder="Votre nom"
                          />
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          onClick={handleSaveProfile}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Sauvegarder
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false);
                            setEditData({
                              first_name: profileData?.first_name || '',
                              last_name: profileData?.last_name || ''
                            });
                          }}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Annuler
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Prénom</Label>
                          <p className="text-gray-900">
                            {profileData?.first_name || 'Non renseigné'}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Nom</Label>
                          <p className="text-gray-900">
                            {profileData?.last_name || 'Non renseigné'}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Email</Label>
                        <p className="text-gray-900">{profileData?.email}</p>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Date d'inscription</Label>
                        <p className="text-gray-900">
                          {profileData?.created_at ? formatDate(profileData.created_at) : 'Non disponible'}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Avatar Card */}
              <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-800">Photo de profil</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-4xl font-semibold mx-auto">
                      {profileData?.avatar_url ? (
                        getAvatarEmoji(profileData.avatar_url)
                      ) : (
                        <span>
                          {profileData?.first_name?.[0] || profileData?.email[0].toUpperCase()}
                        </span>
                      )}
                    </div>
                    
                    {/* Role Badge */}
                    {profileData?.role === 'admin' && (
                      <div className="absolute -top-2 -right-2">
                        <Badge className="bg-yellow-500 text-white border-2 border-white">
                          <Crown className="h-4 w-4 mr-1" />
                          Admin
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">Choisissez votre avatar :</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleAvatarSelect('1')}
                        className={`w-16 h-16 rounded-full border-2 transition-all ${
                          profileData?.avatar_url === '/avatars/avatar1.png' 
                            ? 'border-blue-500 scale-110' 
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          😊
                        </div>
                      </button>
                      <button
                        onClick={() => handleAvatarSelect('2')}
                        className={`w-16 h-16 rounded-full border-2 transition-all ${
                          profileData?.avatar_url === '/avatars/avatar2.png' 
                            ? 'border-blue-500 scale-110' 
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="w-full h-full bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          🎨
                        </div>
                      </button>
                      <button
                        onClick={() => handleAvatarSelect('3')}
                        className={`w-16 h-16 rounded-full border-2 transition-all ${
                          profileData?.avatar_url === '/avatars/avatar3.png' 
                            ? 'border-blue-500 scale-110' 
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="w-full h-full bg-gradient-to-br from-purple-400 to-violet-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          ⭐
                        </div>
                      </button>
                      <button
                        onClick={() => handleAvatarSelect('4')}
                        className={`w-16 h-16 rounded-full border-2 transition-all ${
                          profileData?.avatar_url === '/avatars/avatar4.png' 
                            ? 'border-blue-500 scale-110' 
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          🚀
                        </div>
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Role Card */}
              <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-800">Rôle</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="flex items-center justify-center space-x-2">
                    {profileData?.role === 'admin' ? (
                      <>
                        <Crown className="h-8 w-8 text-yellow-500" />
                        <div>
                          <p className="text-lg font-semibold text-yellow-600">Administrateur</p>
                          <p className="text-sm text-gray-600">Accès complet à la plateforme</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <User className="h-8 w-8 text-blue-500" />
                        <div>
                          <p className="text-lg font-semibold text-blue-600">Étudiant</p>
                          <p className="text-sm text-gray-600">Accès aux cours et ressources</p>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>


            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
