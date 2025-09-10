import React from 'react';
import { Box, Text, Button } from 'zmp-ui';
import { useCoreTheme } from '../theme/context';

interface TemplateSelectorProps {
  className?: string;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ className = '' }) => {
  const { currentTemplate, switchTemplate, availableTemplates } = useCoreTheme();

  return (
    <Box className={`p-4 bg-white border-b border-gray-200 ${className}`}>
      <Text className="text-lg font-bold mb-4">Chọn Template</Text>
      
      <Box className="flex flex-wrap gap-2">
        {availableTemplates.map((template) => (
          <Button
            key={template.id}
            variant={currentTemplate.id === template.id ? 'primary' : 'secondary'}
            size="small"
            onClick={() => switchTemplate(template.id)}
            className={`mr-2 mb-2 ${
              currentTemplate.id === template.id 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {template.name}
          </Button>
        ))}
      </Box>
      
      <Box className="mt-4 p-3 bg-gray-50 rounded-lg">
        <Text className="text-sm text-gray-600">
          <strong>Template hiện tại:</strong> {currentTemplate.name}
        </Text>
        <Text className="text-sm text-gray-600">
          <strong>Brand:</strong> {currentTemplate.brand.name}
        </Text>
        <Text className="text-sm text-gray-600">
          <strong>Tagline:</strong> {currentTemplate.brand.tagline}
        </Text>
      </Box>
    </Box>
  );
};

export default TemplateSelector;
