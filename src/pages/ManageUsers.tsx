import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { 
  ArrowLeft,
  Search,
  Users,
  Shield,
  User,
  Calendar,
  Mail,
  Crown,
  UserCheck,
  UserX
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: 'admin' | 'student';
  created_at: string;
  avatar_url: string | null;
}

const ManageUsers = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

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

    fetchUsers();
  }, [user, loading, isAdmin, navigate]);

  useEffect(() => {
    filterAndSortUsers();
  }, [users, searchTerm, roleFilter, sortBy, sortOrder]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les utilisateurs."
      });
    } finally {
      setUsersLoading(false);
    }
  };

  const filterAndSortUsers = () => {
    let filtered = users;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.first_name && user.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.last_name && user.last_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by role
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Sort users
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof UserProfile];
      let bValue: any = b[sortBy as keyof UserProfile];

      if (sortBy === 'created_at') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredUsers(filtered);
  };

  const toggleUserRole = async (userId: string, currentRole: string) => {
    // Empêcher qu'un utilisateur change son propre rôle
    if (userId === user?.id) {
      toast({
        variant: "destructive",
        title: "Action non autorisée",
        description: "Vous ne pouvez pas modifier votre propre rôle."
      });
      return;
    }

    try {
      const newRole = currentRole === 'admin' ? 'student' : 'admin';
      
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, role: newRole as 'admin' | 'student' } : user
        )
      );

      toast({
        title: "Rôle mis à jour",
        description: `L'utilisateur est maintenant ${newRole === 'admin' ? 'administrateur' : 'étudiant'}.`
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rôle:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le rôle."
      });
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
            
            <div className="flex items-center space-x-3 mb-4">
              <Users className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-800">Gestion des utilisateurs</h1>
            </div>
            
            <p className="text-gray-600">
              Gérez les comptes utilisateurs, leurs rôles et accès à la plateforme
            </p>
          </div>

          {/* Stats Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200 mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{users.length}</div>
                  <div className="text-sm text-gray-600">Total utilisateurs</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {users.filter(u => u.role === 'admin').length}
                  </div>
                  <div className="text-sm text-gray-600">Administrateurs</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {users.filter(u => u.role === 'student').length}
                  </div>
                  <div className="text-sm text-gray-600">Étudiants</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters and Search */}
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200 mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher par nom ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Role Filter */}
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrer par rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les rôles</SelectItem>
                    <SelectItem value="admin">Administrateurs</SelectItem>
                    <SelectItem value="student">Étudiants</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sort By */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at">Date de création</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="first_name">Prénom</SelectItem>
                    <SelectItem value="last_name">Nom</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sort Order */}
                <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ordre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Décroissant</SelectItem>
                    <SelectItem value="asc">Croissant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Users List */}
          {usersLoading ? (
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
              <CardContent className="p-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-blue-600">Chargement des utilisateurs...</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((userProfile) => (
                <Card key={userProfile.id} className="bg-white/80 backdrop-blur-sm border-blue-200 hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {/* Avatar */}
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {userProfile.avatar_url ? (
                            <img 
                              src={userProfile.avatar_url} 
                              alt="Avatar" 
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-lg">
                              {userProfile.first_name?.[0] || userProfile.email[0].toUpperCase()}
                            </span>
                          )}
                        </div>

                        {/* User Info */}
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-800">
                              {userProfile.first_name && userProfile.last_name 
                                ? `${userProfile.first_name} ${userProfile.last_name}`
                                : userProfile.email
                              }
                            </h3>
                            <Badge variant={userProfile.role === 'admin' ? 'default' : 'secondary'}>
                              {userProfile.role === 'admin' ? (
                                <>
                                  <Crown className="h-3 w-3 mr-1" />
                                  Admin
                                </>
                              ) : (
                                <>
                                  <User className="h-3 w-3 mr-1" />
                                  Étudiant
                                </>
                              )}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Mail className="h-4 w-4" />
                              <span>{userProfile.email}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>Créé le {formatDate(userProfile.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        {userProfile.id === user?.id ? (
                          <Badge variant="outline" className="border-gray-300 text-gray-500">
                            <User className="h-3 w-3 mr-1" />
                            Vous
                          </Badge>
                        ) : (
                          <Button
                            variant={userProfile.role === 'admin' ? 'outline' : 'default'}
                            size="sm"
                            onClick={() => toggleUserRole(userProfile.id, userProfile.role)}
                            className={userProfile.role === 'admin' 
                              ? 'border-red-300 text-red-700 hover:bg-red-50' 
                              : 'bg-blue-600 hover:bg-blue-700'
                            }
                          >
                            {userProfile.role === 'admin' ? (
                              <>
                                <UserX className="h-4 w-4 mr-1" />
                                Rétrograder
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-4 w-4 mr-1" />
                                Promouvoir Admin
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredUsers.length === 0 && (
                <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
                  <CardContent className="p-12 text-center">
                    <Users className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-blue-800 mb-2">Aucun utilisateur trouvé</h3>
                    <p className="text-blue-600">
                      {searchTerm || roleFilter !== 'all' 
                        ? 'Aucun utilisateur ne correspond aux critères de recherche'
                        : 'Aucun utilisateur dans la base de données'
                      }
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ManageUsers;
