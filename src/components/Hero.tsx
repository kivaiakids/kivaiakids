import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Users, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface HeroProps {
  title: string;
  subtitle: string;
  ctaLabel: string;
}

const Hero: React.FC<HeroProps> = ({ title, subtitle, ctaLabel }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handlePrimaryAction = () => {
    if (!user) {
      navigate('/auth');
    } else {
      navigate('/courses');
    }
  };

  const getPrimaryButton = () => {
    if (!user) {
      return (
        <Button
          onClick={handlePrimaryAction}
          className="inline-flex items-center gap-3 rounded-2xl px-8 md:px-12 py-4 md:py-6 text-lg md:text-xl font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:from-emerald-700 active:to-teal-700 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400 focus-visible:ring-offset-4"
        >
          <Users className="h-5 w-5 md:h-6 md:w-6 opacity-90" />
          {ctaLabel}
        </Button>
      );
    }

    return (
      <Button
        onClick={handlePrimaryAction}
        className="inline-flex items-center gap-3 rounded-2xl px-8 md:px-12 py-4 md:py-6 text-lg md:text-xl font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:from-emerald-700 active:to-teal-700 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400 focus-visible:ring-offset-4"
      >
        <Play className="h-5 w-5 md:h-6 md:w-6 opacity-90" />
        Continuer l'apprentissage
      </Button>
    );
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 py-20 md:py-28 lg:py-36">
      {/* Clean background with subtle elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/30 to-teal-100/30"></div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-teal-200/20 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center space-y-8">
          {/* Clean title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight max-w-4xl mx-auto">
            {title}
          </h1>
          
          {/* Slogan highlighted */}
          <div className="max-w-4xl mx-auto">
            <p className="text-xl md:text-2xl font-medium text-emerald-700 mb-6">
              Kivaia Kids – Éveil aux langues et apprentissage des langues pour enfants
            </p>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-emerald-200">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                Kivaia Kids est une plateforme éducative qui initie les enfants à l'éveil aux langues et à l'apprentissage des langues. Jeux, cultures et activités ludiques pour favoriser le plurilinguisme et l'ouverture au monde dès l'enfance.
              </p>
            </div>
          </div>
          
          {/* Clean CTA */}
          <div className="pt-4">
            {getPrimaryButton()}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
