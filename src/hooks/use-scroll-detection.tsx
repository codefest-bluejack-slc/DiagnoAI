import { useEffect } from 'react';

export const useScrollDetection = (callback: () => void, threshold: number = 100) => {
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      
      if (scrollTop + clientHeight >= scrollHeight - threshold) {
        callback();
      }
    };

    const throttledHandleScroll = (() => {
      let ticking = false;
      return () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
          });
          ticking = true;
        }
      };
    })();

    window.addEventListener('scroll', throttledHandleScroll);
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, [callback, threshold]);
};
