
import { useState, useEffect } from 'react';

export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isSmallScreen = window.innerWidth <= 768;
      
      const mobileResult = isMobileDevice || isSmallScreen;
      setIsMobile(prevIsMobile => {
        // Only update if the value actually changed to prevent unnecessary re-renders
        if (prevIsMobile !== mobileResult) {
          return mobileResult;
        }
        return prevIsMobile;
      });
    };

    // Check immediately
    checkIfMobile();
    
    // Debounce resize events to prevent excessive re-renders
    let timeoutId: NodeJS.Timeout;
    const debouncedCheckIfMobile = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkIfMobile, 100);
    };

    window.addEventListener('resize', debouncedCheckIfMobile);

    return () => {
      window.removeEventListener('resize', debouncedCheckIfMobile);
      clearTimeout(timeoutId);
    };
  }, []);

  return isMobile;
};
