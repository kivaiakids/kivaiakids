import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, BookOpen, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, profile, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div 
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <div className="bg-white p-2 rounded-xl shadow-md">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">KivaïaKids</h1>
                <p className="text-blue-100 text-sm">Apprendre en s'amusant</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="flex items-center space-x-2 text-white">
                    {isAdmin && (
                      <Crown className="h-4 w-4 text-yellow-300" />
                    )}
                    <User className="h-4 w-4" />
                    <span className="hidden sm:block">
                      {profile?.first_name || 'Utilisateur'}
                    </span>
                  </div>
                  
                  {isAdmin && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate('/admin')}
                      className="bg-white/20 text-white hover:bg-white/30"
                    >
                      Admin
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={signOut}
                    className="bg-white/10 text-white border-white/30 hover:bg-white/20"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Se déconnecter
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => navigate('/auth')}
                  className="bg-white text-primary hover:bg-blue-50"
                >
                  Se connecter
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-muted mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 KivaïaKids. Une plateforme éducative sécurisée pour les enfants.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;