import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const scrollToTop = useScrollToTop();

  useEffect(() => {
    // Faire défiler vers le haut de la page à chaque changement de route
    // avec un délai pour s'assurer que la page est chargée
    scrollToTop({ delay: 100 });
  }, [pathname, scrollToTop]);

  return null; // Ce composant ne rend rien visuellement
};

export default ScrollToTop;
