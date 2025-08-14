import { useEffect } from 'react';
import { useLocation } from 'react-router';

const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    window.gtag('config', 'G-QZ4EFNV649', {
      page_path: location.pathname,
    });
  }, [location]);
};

export default usePageTracking;
