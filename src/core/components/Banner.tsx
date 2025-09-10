import React from 'react';
import { Box, Text, Button } from 'zmp-ui';
import { useNavigate } from 'zmp-ui';
import { useCoreTheme } from '../theme/context';

interface BannerProps {
  className?: string;
}

const Banner: React.FC<BannerProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const { currentTemplate } = useCoreTheme();
  const { content } = currentTemplate;
  
  // Get the first banner or use a default
  const banner = content.banners[0] || {
    id: '1',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=500&fit=crop&crop=center',
    title: 'DEFAULT TITLE',
    subtitle: 'DEFAULT SUBTITLE'
  };

  return (
    <Box className={`relative overflow-hidden h-56 -mx-4 ${className}`}>
      <img 
        src={banner.image}
        alt={banner.title}
        className="w-full h-full object-cover"
      />
      <Box className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20 flex items-center justify-between p-6">
        <Box className="text-white">
          <Text className="text-2xl font-bold mb-1">{banner.title}</Text>
          <Text className="text-lg opacity-90">{banner.subtitle}</Text>
          <Text className="text-sm opacity-80 mt-2">Khám phá ngay hôm nay</Text>
        </Box>
        <Button 
          variant="primary" 
          className="bg-white text-primary-600 hover:bg-gray-100 font-semibold"
          onClick={() => navigate('/products')}
        >
          XEM NGAY
        </Button>
      </Box>
    </Box>
  );
};

export default Banner;
