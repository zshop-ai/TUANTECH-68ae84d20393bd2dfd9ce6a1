import React from 'react';
import { Box, Text, Icon } from 'zmp-ui';
import { useNavigate } from 'zmp-ui';
import { useCategories } from '../../hooks/useCategories';

interface CategoryGridProps {
  className?: string;
  onCategoryClick?: (categoryId: string) => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ 
  className = '', 
  onCategoryClick 
}) => {
  const navigate = useNavigate();
  const { categories, loading, error } = useCategories();

  const handleViewAll = () => {
    navigate('/products');
  };

  // Generate gradient colors for categories
  const getGradientColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'red': 'from-red-400 to-red-600',
      'blue': 'from-blue-400 to-blue-600',
      'green': 'from-green-400 to-green-600',
      'purple': 'from-purple-400 to-purple-600',
      'pink': 'from-pink-400 to-pink-600',
      'yellow': 'from-yellow-400 to-yellow-600',
      'indigo': 'from-indigo-400 to-indigo-600',
      'orange': 'from-orange-400 to-orange-600',
    };
    return colorMap[color.toLowerCase()] || 'from-gray-400 to-gray-600';
  };

  return (
    <Box className={`space-y-4 py-4 ${className}`}>
      <Box className="flex items-center justify-between">
        <Text className="text-lg font-bold text-gray-900">🔥 Trending Now</Text>
        <Text 
          className="text-primary-600 text-sm font-medium cursor-pointer hover:text-primary-700"
          onClick={handleViewAll}
        >
          Xem tất cả
        </Text>
      </Box>
      
      <Box className="flex space-x-3 overflow-x-auto scrollbar-hide px-1 pb-2">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, index) => (
            <Box key={index} className="flex-shrink-0">
              <Box className="bg-gray-200 rounded-2xl p-4 w-32 h-32 flex flex-col justify-between animate-pulse">
                <Box className="text-white">
                  <Box className="h-4 bg-gray-300 rounded mb-2"></Box>
                  <Box className="h-3 bg-gray-300 rounded w-16"></Box>
                </Box>
                <Box className="w-8 h-8 bg-gray-300 rounded-full"></Box>
              </Box>
            </Box>
          ))
        ) : error ? (
          <Box className="flex-1 text-center py-8">
            <Text className="text-red-500">Không thể tải danh mục</Text>
          </Box>
        ) : categories.length === 0 ? (
          <Box className="flex-1 text-center py-8">
            <Text className="text-gray-500">Không có danh mục nào</Text>
          </Box>
        ) : (
          categories.map((category) => (
            <Box key={category.id} className="flex-shrink-0">
              <Box 
                className={`bg-gradient-to-br ${getGradientColor(category.color)} rounded-2xl p-4 w-32 h-32 flex flex-col justify-between cursor-pointer hover:scale-105 transition-transform`}
                onClick={() => onCategoryClick?.(category.id)}
              >
                <Box className="text-white">
                  <Text className="font-bold text-lg">{category.name}</Text>
                  <Text className="text-white/80 text-sm">Category</Text>
                </Box>
                <Box className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Icon icon="zi-star" className="w-4 h-4 text-white" />
                </Box>
              </Box>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default CategoryGrid;
