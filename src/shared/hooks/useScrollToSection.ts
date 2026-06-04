import { useNavigate } from 'react-router-dom';
import { scrollToElement } from '@/shared/utils/scrollToElement';

export const useScrollToSection = () => {
  const navigate = useNavigate();

  return (sectionId: string) => {
    if (window.location.pathname === '/') {
      scrollToElement(sectionId, 100);
    } else {
      navigate('/');
      setTimeout(() => scrollToElement(sectionId, 100), 100);
    }
  };
};
