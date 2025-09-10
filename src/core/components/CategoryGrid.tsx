import React from 'react';
import { Box, Text, Icon } from 'zmp-ui';
import { useCoreTheme } from '../theme/context';

interface CategoryGridProps {
  className?: string;
  onCategoryClick?: (categoryId: string) => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ 
  className = '', 
  onCategoryClick 
}) => {
  const { currentTemplate } = useCoreTheme();
  const { content } = currentTemplate;

  return (
    <Box className={`space-y-4 py-4 ${className}`}>
      <Box className="flex items-center justify-between">
        <Text className="text-lg font-bold text-gray-900">🔥 Trending Now</Text>
        <Text className="text-primary-600 text-sm font-medium">Xem tất cả</Text>
      </Box>
      
      <Box className="flex space-x-3 overflow-x-auto scrollbar-hide px-1 pb-2">
        {content.categories.map((category) => (
          <Box key={category.id} className="flex-shrink-0">
            <Box 
              className={`bg-gradient-to-br ${category.gradient} rounded-2xl p-4 w-32 h-32 flex flex-col justify-between cursor-pointer hover:scale-105 transition-transform`}
              onClick={() => onCategoryClick?.(category.id)}
            >
              <Box className="text-white">
                <Text className="font-bold text-lg">{category.name}</Text>
                <Text className="text-white/80 text-sm">Category</Text>
              </Box>
              <Box className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Icon icon={category.icon} className="w-4 h-4 text-white" />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CategoryGrid;
