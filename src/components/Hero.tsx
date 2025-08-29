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
          className="inline-flex items-center gap-2 rounded-xl px-6 md:px-8 py-3 md:py-4 text-sm md:text-base font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:from-emerald-700 active:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2"
        >
          <Users className="h-4 w-4 md:h-5 md:w-5 opacity-90" />
          {ctaLabel}
        </Button>
      );
    }

    return (
      <Button
        onClick={handlePrimaryAction}
        className="inline-flex items-center gap-2 rounded-xl px-6 md:px-8 py-3 md:py-4 text-sm md:text-base font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:from-emerald-700 active:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2"
      >
        <Play className="h-4 w-4 md:h-5 md:w-5 opacity-90" />
        Continuer l'apprentissage
      </Button>
    );
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-20 md:py-24 lg:py-28">
      {/* Modern geometric background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle mesh gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 via-transparent to-teal-400/20"></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-emerald-300/30 to-teal-300/30 rounded-3xl rotate-12 blur-xl"></div>
        <div className="absolute top-32 right-20 w-24 h-24 bg-gradient-to-br from-green-300/40 to-emerald-300/40 rounded-2xl -rotate-12 blur-lg"></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-gradient-to-br from-teal-300/30 to-green-300/30 rounded-full blur-lg"></div>
        <div className="absolute bottom-32 right-1/3 w-28 h-28 bg-gradient-to-br from-emerald-200/40 to-green-200/40 rounded-3xl rotate-45 blur-xl"></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Content container */}
      <div className="max-w-[1200px] mx-auto px-4 lg:px-6 relative z-10">
        <div className="text-center">
          {/* Modern title with enhanced typography */}
          <h1 className="text-gray-900 text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-center max-w-[900px] mx-auto leading-tight bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
            {title}
          </h1>
          
          {/* Enhanced subtitle */}
          <p className="mt-6 text-gray-700 text-base md:text-lg lg:text-xl leading-relaxed text-center max-w-[780px] mx-auto font-medium">
            {subtitle}
          </p>
          
          {/* Modern CTA section */}
          <div className="mt-10 flex justify-center">
            <div className="relative group">
              {getPrimaryButton()}
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-500 -z-10"></div>
            </div>
          </div>
          
          {/* Decorative accent line */}
          <div className="mt-12 flex justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
