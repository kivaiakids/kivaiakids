import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, BookOpen, Crown, Menu, X, Home, GraduationCap, LogIn } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, profile, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  // Prevent scrolling when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // ESC key closes the drawer
  useEffect(() => {
    function onKey(e: KeyboardEvent) { 
      if (e.key === "Escape") setOpen(false); 
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[linear-gradient(180deg,rgba(7,65,40,0.85)_0%,rgba(6,78,59,0.80)_100%)] backdrop-blur-md border-b border-white/15 shadow-[0_2px_16px_rgba(0,0,0,0.15)]">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6 h-16 lg:h-20 flex items-center justify-between">
          {/* Logo (left) */}
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img 
              src="/logoWithTitle_page-0001.png" 
              alt="KivaïaKids" 
              className="h-7 w-auto lg:h-10"
            />
            <span className="sr-only">KivaïaKids</span>
          </div>

          {/* Nav links (center) */}
          <nav className="hidden md:flex gap-6 lg:gap-8">
            <button
              onClick={() => navigate('/')}
              className={cn(
                "text-sm lg:text-base font-medium text-white/90 hover:text-white transition-colors",
                location.pathname === '/' && "underline decoration-white/70 underline-offset-8"
              )}
            >
              Accueil
            </button>
            <button
              onClick={() => navigate('/courses')}
              className={cn(
                "text-sm lg:text-base font-medium text-white/90 hover:text-white transition-colors",
                location.pathname === '/courses' && "underline decoration-white/70 underline-offset-8"
              )}
            >
              Cours
            </button>
          </nav>

          {/* Actions (right) */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* User name chip */}
                <div className="hidden md:inline-flex items-center gap-2 rounded-md bg-white/10 hover:bg-white/15 text-white px-3 py-1.5 text-sm backdrop-blur transition-colors cursor-pointer"
                     onClick={() => navigate('/profile')}>
                  {isAdmin && (
                    <Crown className="h-4 w-4 text-yellow-300" />
                  )}
                  <User className="h-4 w-4" />
                  <span>{profile?.first_name || 'Utilisateur'}</span>
                </div>
                
                {/* Admin button */}
                {isAdmin && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="hidden md:inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white px-3 py-1.5 rounded-md text-sm transition-colors cursor-pointer"
                  >
                    <Crown className="h-4 w-4 text-yellow-300" />
                    <span>Admin</span>
                  </button>
                )}
                
                {/* Logout icon button */}
                <button
                  onClick={signOut}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/10 hover:bg-white/15 text-white transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <Button
                onClick={() => navigate('/auth')}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/10 hover:bg-white/15 text-white transition-colors"
              >
                <User className="h-4 w-4" />
              </Button>
            )}

            {/* Mobile Menu Button */}
            <button
              className="inline-flex md:hidden h-10 w-10 items-center justify-center rounded-md text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              onClick={() => setOpen(true)}
              aria-expanded={open}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay and Drawer */}
        {open && (
          <>
            {/* Overlay - covers entire site with dark filter */}
            <div 
              className="md:hidden fixed inset-0 bg-black/60 z-[60] transition-opacity duration-300"
              onClick={() => setOpen(false)}
            />
            
            {/* Drawer - right side, full screen height, white background */}
            <div className="md:hidden fixed top-0 right-0 h-screen w-[88%] max-w-[360px] bg-white text-gray-800 shadow-2xl z-[70] transform transition-transform duration-300 translate-x-0 border-l border-gray-200">
              <div className="flex flex-col h-screen bg-white">
                {/* Header */}
                <div className="bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 p-6 shadow-sm flex-shrink-0">
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
                    <button
                      onClick={() => setOpen(false)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-md text-white hover:bg-white/10 p-2 transition-colors"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Menu Items - clean, large, tappable */}
                <div className="flex-1 p-6 bg-white overflow-y-auto">
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => handleNavigation('/')}
                      className="text-lg font-semibold px-4 py-4 rounded-lg hover:bg-green-50 text-left text-gray-800 transition-all duration-200 border border-gray-100 hover:border-green-300 hover:shadow-sm bg-white"
                    >
                      Accueil
                    </button>
                    
                    <button
                      onClick={() => handleNavigation('/courses')}
                      className="text-lg font-semibold px-4 py-4 rounded-lg hover:bg-green-50 text-left text-gray-800 transition-all duration-200 border border-gray-100 hover:border-green-300 hover:shadow-sm bg-white"
                    >
                      Cours
                    </button>

                    {user ? (
                      <>
                        <div className="border-t border-gray-200 pt-6 mt-6">
                          <button
                            onClick={() => handleNavigation('/profile')}
                            className="w-full text-lg font-semibold px-4 py-4 rounded-lg hover:bg-green-50 text-left text-gray-800 transition-all duration-200 border border-gray-100 hover:border-green-300 hover:shadow-sm bg-white"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="bg-gradient-to-br from-purple-400 to-violet-500 p-2 rounded-lg">
                                <User className="h-5 w-5 text-white" />
                              </div>
                              <span>{profile?.first_name || 'Utilisateur'}</span>
                              {isAdmin && (
                                <Crown className="h-4 w-4 text-yellow-600 ml-2" />
                              )}
                            </div>
                          </button>
                          
                          {isAdmin && (
                            <button
                              onClick={() => handleNavigation('/admin')}
                              className="w-full text-lg font-semibold px-4 py-4 rounded-lg hover:bg-green-50 text-left text-gray-800 mt-3 transition-all duration-200 border border-gray-100 hover:border-green-300 hover:shadow-sm bg-white"
                            >
                              Administration
                            </button>
                          )}
                          
                          <button
                            onClick={signOut}
                            className="w-full text-lg font-semibold px-4 py-4 rounded-lg hover:bg-red-50 text-left text-red-600 mt-3 transition-all duration-200 border border-gray-100 hover:border-red-300 hover:shadow-sm bg-white"
                          >
                            Se déconnecter
                          </button>
                        </div>
                      </>
                    ) : (
                      <button
                        onClick={() => handleNavigation('/auth')}
                        className="w-full text-lg font-semibold px-4 py-4 rounded-lg hover:bg-green-50 text-left text-gray-800 mt-6 transition-all duration-200 border border-gray-100 hover:border-green-300 hover:shadow-sm bg-white"
                      >
                        Se connecter / S'inscrire
                      </button>
                    )}
                  </div>
                </div>

                {/* Footer - always at bottom */}
                <div className="p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                  <p className="text-sm text-gray-600 text-center font-medium">
                    © 2025 KivaïaKids
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </header>

      {/* Main content */}
      <main className="pt-0">{children}</main>

      {/* Footer */}
      <footer className="bg-muted mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="border-t border-gray-200 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-muted-foreground">
                <p>&copy; 2025 KivaïaKids. Apprendre les langues facilement.</p>
              </div>
              
              <div className="flex space-x-6">
                <button
                  onClick={() => navigate('/terms')}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Conditions d'utilisation
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;