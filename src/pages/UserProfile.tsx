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
  X,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DeleteAccountModal from '@/components/ui/delete-account-modal';
import { useStripePortal } from '@/hooks/use-stripe-portal';

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Hook pour le portail Stripe
  const { openPortal, isLoading: isPortalLoading } = useStripePortal();

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

          {/* Main Content Grid - Desktop Optimized */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Left Column - Profile Info & Avatar */}
            <div className="xl:col-span-4 space-y-6">
              
              {/* Profile Information Card */}
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
                        className="border-blue-300 text-blue-700 hover:bg-blue-50 px-6"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isEditing ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="first_name" className="text-sm font-medium">Prénom</Label>
                          <Input
                            id="first_name"
                            value={editData.first_name}
                            onChange={(e) => setEditData({ ...editData, first_name: e.target.value })}
                            placeholder="Votre prénom"
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last_name" className="text-sm font-medium">Nom</Label>
                          <Input
                            id="last_name"
                            value={editData.last_name}
                            onChange={(e) => setEditData({ ...editData, last_name: e.target.value })}
                            placeholder="Votre nom"
                            className="h-11"
                          />
                        </div>
                      </div>
                      
                      <div className="flex space-x-3 pt-2">
                        <Button
                          onClick={handleSaveProfile}
                          className="bg-blue-600 hover:bg-blue-700 px-6 py-2"
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
                          className="px-6 py-2"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Annuler
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-500">Prénom</Label>
                        <p className="text-gray-900 text-lg">
                          {profileData?.first_name || 'Non renseigné'}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-500">Nom</Label>
                        <p className="text-gray-900 text-lg">
                          {profileData?.last_name || 'Non renseigné'}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-500">Email</Label>
                        <p className="text-gray-900 text-lg">{profileData?.email}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-500">Date d'inscription</Label>
                        <p className="text-gray-900 text-lg">
                          {profileData?.created_at ? formatDate(profileData.created_at) : 'Non disponible'}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Avatar & Role Card */}
              <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
                <CardHeader className="text-center">
                  <CardTitle className="text-blue-800">Photo de profil</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Display */}
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

                  {/* Role Information */}
                  <div className="text-center">
                    {profileData?.role === 'admin' ? (
                      <div className="flex items-center justify-center space-x-2">
                        <Crown className="h-6 w-6 text-yellow-500" />
                        <div>
                          <p className="font-semibold text-yellow-600">Administrateur</p>
                          <p className="text-sm text-gray-600">Accès complet à la plateforme</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <User className="h-6 w-6 text-blue-500" />
                        <div>
                          <p className="font-semibold text-blue-600">Étudiant</p>
                          <p className="text-sm text-gray-600">Accès aux cours et ressources</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Avatar Selection */}
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 font-medium">Choisissez votre avatar :</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: '1', emoji: '😊', color: 'from-blue-400 to-indigo-500' },
                        { id: '2', emoji: '🎨', color: 'from-green-400 to-emerald-500' },
                        { id: '3', emoji: '⭐', color: 'from-purple-400 to-violet-500' },
                        { id: '4', emoji: '🚀', color: 'from-orange-400 to-red-500' }
                      ].map((avatar) => (
                        <button
                          key={avatar.id}
                          onClick={() => handleAvatarSelect(avatar.id)}
                          className={`w-16 h-16 rounded-full border-2 transition-all hover:scale-105 ${
                            profileData?.avatar_url === `/avatars/avatar${avatar.id}.png` 
                              ? 'border-blue-500 scale-110' 
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <div className={`w-full h-full bg-gradient-to-br ${avatar.color} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                            {avatar.emoji}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Subscription & Actions */}
            <div className="xl:col-span-8 space-y-6">




              {/* Subscription Management Card */}
              <Card className="bg-white/80 backdrop-blur-sm border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800">Gestion de l'abonnement</CardTitle>
                  <CardDescription className="text-green-600">
                    Gérez votre abonnement Premium et vos informations de facturation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                      <span className="text-lg">💳</span>
                      Gérer mon abonnement
                    </h4>
                    <p className="text-sm text-green-700 mb-3">
                      Accédez à votre portail de facturation Stripe pour gérer votre abonnement, 
                      modifier votre méthode de paiement ou annuler votre abonnement.
                    </p>
                    <Button
                      onClick={openPortal}
                      disabled={isPortalLoading}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      {isPortalLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Ouverture du portail...
                        </>
                      ) : (
                        <>
                          <span className="text-lg mr-2">🔗</span>
                          Gérer mon abonnement
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Information Card */}
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
                        className="border-blue-300 text-blue-700 hover:bg-blue-50 px-6"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isEditing ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="first_name" className="text-sm font-medium">Prénom</Label>
                          <Input
                            id="first_name"
                            value={editData.first_name}
                            onChange={(e) => setEditData({ ...editData, first_name: e.target.value })}
                            placeholder="Votre prénom"
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last_name" className="text-sm font-medium">Nom</Label>
                          <Input
                            id="last_name"
                            value={editData.last_name}
                            onChange={(e) => setEditData({ ...editData, last_name: e.target.value })}
                            placeholder="Votre nom"
                            className="h-11"
                          />
                        </div>
                      </div>
                      
                      <div className="flex space-x-3 pt-2">
                        <Button
                          onClick={handleSaveProfile}
                          className="bg-blue-600 hover:bg-blue-700 px-6 py-2"
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
                          className="px-6 py-2"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Annuler
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-500">Prénom</Label>
                        <p className="text-gray-900 text-lg">
                          {profileData?.first_name || 'Non renseigné'}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-500">Nom</Label>
                        <p className="text-gray-900 text-lg">
                          {profileData?.last_name || 'Non renseigné'}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-500">Email</Label>
                        <p className="text-gray-900 text-lg">{profileData?.email}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-500">Date d'inscription</Label>
                        <p className="text-gray-900 text-lg">
                          {profileData?.created_at ? formatDate(profileData.created_at) : 'Non disponible'}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Account Actions Card */}
              <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-800">Actions du compte</CardTitle>
                  <CardDescription className="text-orange-600">
                    Gestion avancée de votre compte
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Delete Account Section */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      <div className="flex-1 space-y-3">
                        <h4 className="font-semibold text-red-800 text-lg flex items-center gap-2">
                          <span className="text-xl">⚠️</span>
                          Supprimer mon compte
                        </h4>
                        <p className="text-red-700 leading-relaxed">
                          Cette action supprimera définitivement votre compte et toutes vos données. 
                          Cette opération est irréversible et ne peut pas être annulée.
                        </p>
                        <div className="text-sm text-red-600 space-y-1">
                          <p>• Toutes vos données seront perdues</p>
                          <p>• Votre abonnement Premium sera annulé</p>
                          <p>• Vous ne pourrez plus vous reconnecter</p>
                        </div>
                      </div>
                      <div className="lg:flex-shrink-0">
                        <Button
                          variant="destructive"
                          onClick={() => setShowDeleteModal(true)}
                          className="w-full lg:w-auto lg:px-8 lg:py-3 lg:text-base font-semibold hover:bg-red-700 active:bg-red-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          <Trash2 className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
                          Supprimer mon compte
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      />
    </Layout>
  );
};

export default UserProfile;
