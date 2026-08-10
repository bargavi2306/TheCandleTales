import React, { useState } from 'react';
import { getImageUrl } from '../../utils/imageUtil';

const ImageGallery = ({ images = [] }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const currentImageUrl = getImageUrl(images[activeImageIndex]?.imageUrl, 'https://via.placeholder.com/600');

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="space-y-4">
      {/* Main Image Viewer with Hover Zoom */}
      <div 
        className="relative overflow-hidden bg-gray-50 rounded-2xl border border-gray-150/70 pt-[100%] cursor-zoom-in"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={currentImageUrl}
          alt="Main product visual"
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-200 ${
            isZoomed ? 'scale-150' : 'scale-100'
          }`}
          style={isZoomed ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` } : undefined}
        />
      </div>

      {/* Thumbnails Carousel Bar */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((img, index) => {
            const isActive = index === activeImageIndex;
            return (
              <button
                key={img.id || index}
                onClick={() => setActiveImageIndex(index)}
                className={`flex-shrink-0 h-16 w-16 rounded-xl overflow-hidden border-2 bg-gray-50 transition-all ${
                  isActive ? 'border-primary shadow-md' : 'border-transparent hover:border-gray-300'
                }`}
              >
                <img 
                  src={getImageUrl(img.imageUrl)} 
                  alt={`Thumbnail preview ${index + 1}`} 
                  className="h-full w-full object-cover" 
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
