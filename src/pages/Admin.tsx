import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { 
  BookOpen, 
  Users, 
  Trophy, 
  Star,
  Crown,
  Plus,
  BarChart3,
  Shield,
  Activity
} from 'lucide-react';

const Admin = () => {
  const { user, profile, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    activeSubscriptions: 0
  });

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

    fetchStats();
  }, [user, loading, isAdmin, navigate]);

  const fetchStats = async () => {
    try {
      const [usersResponse, coursesResponse, subscriptionsResponse] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('courses').select('id', { count: 'exact' }).eq('published', true),
        supabase.from('subscriptions').select('id', { count: 'exact' }).eq('status', 'active')
      ]);

      setStats({
        totalUsers: usersResponse.count || 0,
        totalCourses: coursesResponse.count || 0,
        activeSubscriptions: subscriptionsResponse.count || 0
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-3 rounded-full shadow-lg">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-green-800">Administration</h1>
                <p className="text-green-600">Gestion de la plateforme KivaïaKids</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="bg-gradient-to-br from-blue-400 to-sky-500 p-2 rounded-lg">
                    <Users className="h-5 w-5 text-white" />
                  </div>

                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-800">{stats.totalUsers}</p>
                <p className="text-sm text-blue-600">Utilisateurs totaux</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-pink-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="bg-gradient-to-br from-pink-400 to-rose-500 p-2 rounded-lg">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>

                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-pink-800">{stats.totalCourses}</p>
                <p className="text-sm text-pink-600">Cours disponibles</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-purple-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="bg-gradient-to-br from-purple-400 to-violet-500 p-2 rounded-lg">
                    <Star className="h-5 w-5 text-white" />
                  </div>

                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-purple-800">{stats.activeSubscriptions}</p>
                <p className="text-sm text-purple-600">Abonnements actifs</p>
              </CardContent>
            </Card>


          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border-green-200 hover:shadow-lg transition-all hover:scale-105 cursor-pointer" onClick={() => navigate('/admin/create-course')}>
              <CardHeader>
                <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-3">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg text-green-800">Créer un cours</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-600 text-sm mb-4">
                  Ajouter un nouveau cours à la plateforme
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white"
                  onClick={() => navigate('/admin/create-course')}
                >
                  Créer
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-orange-200 hover:shadow-lg transition-all hover:scale-105 cursor-pointer" onClick={() => navigate('/admin/eveil/new')}>
              <CardHeader>
                <div className="bg-gradient-to-br from-orange-400 to-red-500 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-3">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg text-orange-800">Nouvel item d'éveil</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-orange-600 text-sm mb-4">
                  Ajouter une activité d'éveil aux langues
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white"
                  onClick={() => navigate('/admin/eveil/new')}
                >
                  Créer
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-blue-200 hover:shadow-lg transition-all hover:scale-105 cursor-pointer" onClick={() => navigate('/admin/manage-users')}>
              <CardHeader>
                <div className="bg-gradient-to-br from-blue-400 to-sky-500 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg text-blue-800">Liste des utilisateurs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-600 text-sm mb-4">
                  Consulter la liste de tous les utilisateurs
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-400 to-sky-500 hover:from-blue-500 hover:to-sky-600 text-white"
                  onClick={() => navigate('/admin/manage-users')}
                >
                  Voir
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-purple-200 hover:shadow-lg transition-all hover:scale-105 cursor-pointer" onClick={() => navigate('/admin/manage-courses')}>
              <CardHeader>
                <div className="bg-gradient-to-br from-purple-400 to-violet-500 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-3">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg text-purple-800">Gérer les cours</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-600 text-sm mb-4">
                  Modifier et gérer tous les cours
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-purple-400 to-violet-500 hover:from-purple-500 hover:to-violet-600 text-white"
                  onClick={() => navigate('/admin/manage-courses')}
                >
                  Gérer
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-yellow-200 hover:shadow-lg transition-all hover:scale-105 cursor-pointer" onClick={() => navigate('/admin/eveil')}>
              <CardHeader>
                <div className="bg-gradient-to-br from-yellow-400 to-amber-500 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-3">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg text-yellow-800">Gérer l'éveil aux langues</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-yellow-600 text-sm mb-4">
                  Modifier et gérer les activités d'éveil
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white"
                  onClick={() => navigate('/admin/eveil')}
                >
                  Gérer
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
