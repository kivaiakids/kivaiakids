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
          className="inline-flex items-center gap-2 rounded-lg px-5 md:px-6 py-3 md:py-3.5 text-sm md:text-base font-semibold text-white bg-[linear-gradient(135deg,#22c55e,#16a34a)] hover:brightness-105 active:brightness-95 shadow-[0_6px_20px_rgba(22,163,74,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <Users className="h-4 w-4 md:h-5 md:w-5 opacity-90" />
          {ctaLabel}
        </Button>
      );
    }

    return (
      <Button
        onClick={handlePrimaryAction}
        className="inline-flex items-center gap-2 rounded-lg px-5 md:px-6 py-3 md:py-3.5 text-sm md:text-base font-semibold text-white bg-[linear-gradient(135deg,#22c55e,#16a34a)] hover:brightness-105 active:brightness-95 shadow-[0_6px_20px_rgba(22,163,74,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
      >
        <Play className="h-4 w-4 md:h-5 md:w-5 opacity-90" />
        Continuer l'apprentissage
      </Button>
    );
  };

  return (
    <section className="bg-[linear-gradient(135deg,#22c55e_0%,#16a34a_60%,#0ea15a_100%)] py-20 md:py-24 lg:py-28 relative overflow-hidden">
      {/* Subtle background circles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 -left-20 w-52 h-52 bg-white/10 rounded-full blur-sm opacity-10"></div>
        <div className="absolute bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-sm opacity-10"></div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 lg:px-6 relative z-10">
        <div className="text-center">
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-center max-w-[900px] mx-auto leading-tight">
            {title}
          </h1>
          
          <p className="mt-4 text-white/85 text-base md:text-lg lg:text-xl leading-relaxed text-center max-w-[780px] mx-auto">
            {subtitle}
          </p>
          
          <div className="mt-8 flex justify-center">
            {getPrimaryButton()}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
