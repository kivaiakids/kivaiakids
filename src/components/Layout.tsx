import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, BookOpen, Crown, Menu, X, Home, GraduationCap, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, profile, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    closeMenu();
  };

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 shadow-lg relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div 
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <div className="bg-white p-2 rounded-xl shadow-md">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">KivaïaKids</h1>
                <p className="text-green-100 text-sm">Apprendre en s'amusant</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Navigation Links */}
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => navigate('/')}
                  className="text-white hover:text-green-200 transition-colors font-medium"
                >
                  Accueil
                </button>
                <button
                  onClick={() => navigate('/courses')}
                  className="text-white hover:text-green-200 transition-colors font-medium"
                >
                  Cours
                </button>
              </div>

              {/* User Section */}
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-white">
                    {isAdmin && (
                      <Crown className="h-4 w-4 text-yellow-300" />
                    )}
                    <User className="h-4 w-4" />
                    <span className="hidden sm:block text-sm">
                      {profile?.first_name || 'Utilisateur'}
                    </span>
                  </div>
                  
                  {isAdmin && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate('/admin')}
                      className="bg-white/20 text-white hover:bg-white/30 text-xs px-2 py-1"
                    >
                      Admin
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={signOut}
                    className="bg-white/10 text-white border-white/30 hover:bg-white/20 text-xs px-2 py-1 h-7"
                  >
                    <LogOut className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => navigate('/auth')}
                  className="bg-white text-green-700 hover:bg-green-50 text-sm px-3 py-1"
                >
                  Se connecter
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="lg"
                onClick={toggleMenu}
                className="text-white hover:bg-white/10 p-3 transition-transform duration-200 active:scale-95"
              >
                {menuOpen ? (
                  <X className="h-8 w-8 transition-transform duration-200 rotate-180" />
                ) : (
                  <Menu className="h-8 w-8 transition-transform duration-200" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay and Drawer */}
        {menuOpen && (
          <>
            {/* Overlay */}
            <div 
              className="md:hidden fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
              onClick={closeMenu}
            />
            
            {/* Drawer */}
            <div className={`md:hidden fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
              menuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}>
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-white p-2 rounded-xl shadow-md">
                        <BookOpen className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Menu</h2>
                        <p className="text-green-100 text-sm">Navigation</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={closeMenu}
                      className="text-white hover:bg-white/10 p-2"
                    >
                      <X className="h-6 w-6" />
                    </Button>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="flex-1 px-6 py-6 space-y-4">
                  <div 
                    className="flex items-center space-x-4 p-4 rounded-xl hover:bg-green-50 cursor-pointer transition-all hover:scale-105 border border-transparent hover:border-green-200"
                    onClick={() => handleNavigation('/')}
                  >
                    <div className="bg-gradient-to-br from-blue-400 to-sky-500 p-3 rounded-lg">
                      <Home className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-medium text-gray-800">Accueil</span>
                  </div>
                  
                  <div 
                    className="flex items-center space-x-4 p-4 rounded-xl hover:bg-green-50 cursor-pointer transition-all hover:scale-105 border border-transparent hover:border-green-200"
                    onClick={() => handleNavigation('/courses')}
                  >
                    <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-3 rounded-lg">
                      <GraduationCap className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-medium text-gray-800">Cours</span>
                  </div>

                  {user ? (
                    <>
                      <div className="border-t border-gray-200 pt-4 mt-6">
                        <div className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50">
                          <div className="bg-gradient-to-br from-purple-400 to-violet-500 p-3 rounded-lg">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {profile?.first_name || 'Utilisateur'}
                            </p>
                            {isAdmin && (
                              <p className="text-sm text-yellow-600 flex items-center">
                                <Crown className="h-3 w-3 mr-1" />
                                Administrateur
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {isAdmin && (
                          <div 
                            className="flex items-center space-x-4 p-4 rounded-xl hover:bg-yellow-50 cursor-pointer transition-all hover:scale-105 border border-transparent hover:border-yellow-200 mt-4"
                            onClick={() => handleNavigation('/admin')}
                          >
                            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-3 rounded-lg">
                              <Crown className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-medium text-gray-800">Administration</span>
                          </div>
                        )}
                        
                        <div 
                          className="flex items-center space-x-4 p-4 rounded-xl hover:bg-red-50 cursor-pointer transition-all hover:scale-105 border border-transparent hover:border-red-200 mt-4"
                          onClick={signOut}
                        >
                          <div className="bg-gradient-to-br from-red-400 to-pink-500 p-3 rounded-lg">
                            <LogOut className="h-5 w-5 text-white" />
                          </div>
                          <span className="font-medium text-red-600">Se déconnecter</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div 
                      className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 cursor-pointer transition-all hover:scale-105 border border-green-200 hover:border-green-300 mt-6"
                      onClick={() => handleNavigation('/auth')}
                    >
                      <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-3 rounded-lg">
                        <LogIn className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-medium text-green-700">Se connecter / S'inscrire</span>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500 text-center">
                    © 2025 KivaïaKids
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </header>

      {/* Main content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-muted mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2025 KivaïaKids. Une plateforme éducative sécurisée pour les children.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;