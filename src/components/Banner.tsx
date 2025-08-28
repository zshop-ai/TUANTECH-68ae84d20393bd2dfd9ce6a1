import React, { useState, useEffect } from 'react';
import { Box, Text, Icon } from 'zmp-ui';

interface Banner {
  id: string;
  image: string;
  title: string;
  subtitle: string;
}

interface BannerProps {
  banners: Banner[];
}

const Banner: React.FC<BannerProps> = ({ banners }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === banners.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <Box className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
      {/* Banner Image */}
      <img
        src={banners[currentIndex]?.image}
        alt={banners[currentIndex]?.title}
        className="w-full h-full object-cover"
      />

      {/* Banner Content */}
      <Box className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center">
        <Box className="p-4 text-white">
          <Text className="text-xl font-bold mb-1">
            {banners[currentIndex]?.title}
          </Text>
          <Text className="text-sm opacity-90">
            {banners[currentIndex]?.subtitle}
          </Text>
        </Box>
      </Box>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
          >
            <Icon icon="zi-chevron-left" className="text-white w-4 h-4" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
          >
            <Icon icon="zi-chevron-right" className="text-white w-4 h-4" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <Box className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Banner;
