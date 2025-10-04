import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const FoodImageGallery = ({ images, foodName }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? images?.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => 
      prev === images?.length - 1 ? 0 : prev + 1
    );
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-soft">
      {/* Main Image Display */}
      <div className="relative aspect-video bg-muted">
        <Image
          src={images?.[currentImageIndex]}
          alt={`${foodName} - Image ${currentImageIndex + 1}`}
          className={`w-full h-full object-cover cursor-pointer transition-transform duration-200 ${
            isZoomed ? 'scale-110' : 'scale-100'
          }`}
          onClick={toggleZoom}
        />
        
        {/* Navigation Arrows */}
        {images?.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
            >
              <Icon name="ChevronLeft" size={20} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
            >
              <Icon name="ChevronRight" size={20} />
            </button>
          </>
        )}

        {/* Zoom Indicator */}
        <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
          <Icon name={isZoomed ? "ZoomOut" : "ZoomIn"} size={14} className="inline mr-1" />
          {isZoomed ? "Zoom Out" : "Zoom In"}
        </div>

        {/* Image Counter */}
        {images?.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs font-mono">
            {currentImageIndex + 1} / {images?.length}
          </div>
        )}
      </div>
      {/* Thumbnail Strip */}
      {images?.length > 1 && (
        <div className="p-4 bg-muted/50">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
            {images?.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                  index === currentImageIndex
                    ? 'border-primary' :'border-transparent hover:border-border'
                }`}
              >
                <Image
                  src={image}
                  alt={`${foodName} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodImageGallery;