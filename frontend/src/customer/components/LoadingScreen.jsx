import React, { useEffect, useState } from 'react';
import { useLoading } from '../context/LoadingContext';
import { Sparkles } from 'lucide-react';

const LoadingScreen = () => {
  const { isLoading } = useLoading();
  const [shouldRender, setShouldRender] = useState(false);
  const [fadeProp, setFadeProp] = useState('opacity-0 pointer-events-none');

  useEffect(() => {
    if (isLoading) {
      setShouldRender(true);
      const t = setTimeout(() => {
        setFadeProp('opacity-100');
      }, 10);
      return () => clearTimeout(t);
    } else {
      setFadeProp('opacity-0');
      const t = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [isLoading]);

  if (!shouldRender) return null;

  return (
    <div className={`fixed inset-0 z-50 bg-[#F8F5F0] flex flex-col items-center justify-center transition-all duration-300 ${fadeProp}`}>
      <div className="text-center space-y-6 max-w-xs px-4">
        {/* Animated Brand Logo */}
        <div className="h-16 w-16 bg-[#8B6B4A] rounded-full mx-auto flex items-center justify-center text-[#D9C7A2] shadow-lg animate-bounce">
          <Sparkles className="h-8 w-8 text-[#D9C7A2]" />
        </div>
        
        {/* Brand Name */}
        <h2 className="text-2xl font-serif text-[#6E4E37] tracking-widest font-semibold">
          The Candle Tales
        </h2>

        {/* Mandatory Message */}
        <p className="text-xs font-semibold text-[#3F3125]/80 uppercase tracking-widest leading-relaxed border-t border-b border-[#8B6B4A]/20 py-3">
          Click to place order on WhatsApp.
        </p>

        {/* Loader Spinner */}
        <div className="h-1 w-24 bg-gray-200 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-[#8B6B4A] rounded-full animate-pulse w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
