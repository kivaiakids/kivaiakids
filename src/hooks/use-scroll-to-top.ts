import { useCallback } from 'react';

interface ScrollToTopOptions {
  behavior?: 'auto' | 'smooth';
  delay?: number;
}

export const useScrollToTop = () => {
  const scrollToTop = useCallback((options: ScrollToTopOptions = {}) => {
    const { behavior = 'smooth', delay = 0 } = options;

    const scroll = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior
      });
    };

    if (delay > 0) {
      setTimeout(scroll, delay);
    } else {
      scroll();
    }
  }, []);

  return scrollToTop;
};
