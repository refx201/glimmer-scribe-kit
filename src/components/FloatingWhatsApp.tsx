import { useState, useEffect, memo } from 'react';
import { Button } from './ui/button';
import { MessageCircle } from 'lucide-react';

const FloatingWhatsAppButton = memo(() => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('مرحباً، أحتاج مساعدة في اختيار منتج مناسب 📱');
    window.open(`https://wa.me/972598366822?text=${message}`, '_blank');
  };

  return (
    <Button
      onClick={handleWhatsAppClick}
      className={`
        fixed bottom-4 left-4 z-50 w-14 h-14 rounded-full
        bg-green-500 hover:bg-green-600 text-white shadow-lg
        transition-all duration-300 hover:scale-105
        ${isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
      `}
      aria-label="تواصل عبر واتساب"
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  );
});

FloatingWhatsAppButton.displayName = 'FloatingWhatsAppButton';

export { FloatingWhatsAppButton };