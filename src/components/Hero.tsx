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
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-32 md:py-40 lg:py-48 xl:py-56">
      {/* Enhanced geometric background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Enhanced mesh gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/25 via-transparent to-teal-400/25"></div>
        
        {/* Larger floating geometric shapes */}
        <div className="absolute top-16 left-16 w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br from-emerald-300/40 to-teal-300/40 rounded-3xl rotate-12 blur-2xl"></div>
        <div className="absolute top-40 right-24 w-36 h-36 md:w-48 md:h-48 bg-gradient-to-br from-green-300/50 to-emerald-300/50 rounded-2xl -rotate-12 blur-xl"></div>
        <div className="absolute bottom-24 left-1/4 w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-teal-300/40 to-green-300/40 rounded-full blur-xl"></div>
        <div className="absolute bottom-40 right-1/3 w-40 h-40 md:w-56 md:h-56 bg-gradient-to-br from-emerald-200/50 to-green-200/50 rounded-3xl rotate-45 blur-2xl"></div>
        
        {/* Additional large decorative elements */}
        <div className="absolute top-1/2 left-16 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-green-200/30 to-emerald-200/30 rounded-full blur-lg"></div>
        <div className="absolute top-1/3 right-16 w-20 h-20 md:w-28 md:h-28 bg-gradient-to-br from-teal-200/35 to-green-200/35 rounded-2xl -rotate-45 blur-lg"></div>
        
        {/* Enhanced subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.04)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>

      {/* Content container with enhanced spacing */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center">
          {/* Enhanced title with larger typography */}
          <h1 className="text-gray-900 text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-black tracking-tight text-center max-w-[1100px] mx-auto leading-tight bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
            {title}
          </h1>
          
          {/* Enhanced subtitle with larger text */}
          <p className="mt-8 md:mt-12 text-gray-700 text-lg md:text-xl lg:text-2xl xl:text-3xl leading-relaxed text-center max-w-[900px] mx-auto font-semibold">
            {subtitle}
          </p>
          
          {/* Enhanced CTA section with more spacing */}
          <div className="mt-16 md:mt-20 flex justify-center">
            <div className="relative group">
              {getPrimaryButton()}
              {/* Enhanced glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 to-teal-400/30 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500 -z-10"></div>
            </div>
          </div>
          
          {/* Enhanced decorative accent line */}
          <div className="mt-20 md:mt-24 flex justify-center">
            <div className="w-32 h-1.5 md:w-40 md:h-2 bg-gradient-to-r from-transparent via-emerald-400 to-transparent rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
