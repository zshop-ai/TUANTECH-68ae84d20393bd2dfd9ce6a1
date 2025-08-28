import React from 'react';
import { Box, Text, Icon } from 'zmp-ui';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <Box className="flex space-x-4 overflow-x-auto pb-2">
      {categories.map((category) => (
        <Box
          key={category.id}
          className={`flex flex-col items-center min-w-16 cursor-pointer transition-colors ${
            selectedCategory === category.id
              ? 'text-primary-600'
              : 'text-gray-600'
          }`}
          onClick={() => onCategoryChange(category.id)}
        >
          <Box
            className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
              selectedCategory === category.id
                ? 'bg-primary-100'
                : 'bg-gray-100'
            }`}
          >
            <Icon
              icon={category.icon}
              className={`w-6 h-6 ${
                selectedCategory === category.id
                  ? 'text-primary-600'
                  : 'text-gray-500'
              }`}
            />
          </Box>
          <Text
            className={`text-xs text-center ${
              selectedCategory === category.id
                ? 'font-semibold'
                : 'font-medium'
            }`}
          >
            {category.name}
          </Text>
        </Box>
      ))}
    </Box>
  );
};

export default CategoryFilter;
