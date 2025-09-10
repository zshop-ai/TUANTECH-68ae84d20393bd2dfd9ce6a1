import React from 'react';
import { Box, Text } from 'zmp-ui';
import { useCoreTheme } from '../theme/context';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const { currentTemplate } = useCoreTheme();
  const { brand, layout } = currentTemplate;

  const getHeaderClasses = () => {
    const baseClasses = 'text-white pt-12 pb-8 px-4 relative overflow-hidden';
    
    switch (layout.headerStyle) {
      case 'gradient':
        return `bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 ${baseClasses}`;
      case 'solid':
        return `bg-primary-600 ${baseClasses}`;
      case 'transparent':
        return `bg-transparent ${baseClasses}`;
      default:
        return `bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 ${baseClasses}`;
    }
  };

  return (
    <Box className={`${getHeaderClasses()} ${className}`}>
      {/* Background Pattern */}
      <Box className="absolute inset-0 opacity-10">
        <Box className="absolute top-4 right-4 w-20 h-20 bg-white rounded-full"></Box>
        <Box className="absolute bottom-8 left-8 w-16 h-16 bg-white rounded-full"></Box>
        <Box className="absolute top-1/2 right-1/4 w-12 h-12 bg-white rounded-full"></Box>
      </Box>
      
      <Box className="relative z-10">
        <Box className="flex items-center justify-between mb-6">
          <Box className="flex items-center">
            <img 
              src={brand.logo} 
              alt={brand.name} 
              className="w-14 h-14 mr-4 rounded-full shadow-lg" 
            />
            <Box>
              <Text.Title size="large" className="text-white font-bold">
                {brand.name}
              </Text.Title>
              <Text className="text-white/80 text-sm">{brand.tagline}</Text>
            </Box>
          </Box>
        </Box>
        
        {/* Welcome Message */}
        <Box className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
          <Text className="text-white font-semibold mb-1">Chào mừng bạn trở lại! 👋</Text>
          <Text className="text-white/80 text-sm">Khám phá bộ sưu tập mới nhất của chúng tôi</Text>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
