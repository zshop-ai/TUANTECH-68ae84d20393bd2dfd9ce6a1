import React from 'react';
import { Page, Box, Text, Button } from 'zmp-ui';
import { useCoreTheme } from '../core/theme/context';
import TemplateSelector from '../core/components/TemplateSelector';
import { useProducts } from '../core/hooks/useProducts';

function TestPage() {
  const { currentTemplate, switchTemplate, availableTemplates } = useCoreTheme();
  const { allProducts, featuredProducts } = useProducts();

  return (
    <Page>
      <Box className="p-4 space-y-6">
        <Text.Title>Template Testing Page</Text.Title>
        
        {/* Template Selector */}
        <TemplateSelector />
        
        {/* Current Template Info */}
        <Box className="p-4 bg-gray-100 rounded-lg">
          <Text className="font-bold mb-2">Current Template Info:</Text>
          <Text className="text-sm">ID: {currentTemplate.id}</Text>
          <Text className="text-sm">Name: {currentTemplate.name}</Text>
          <Text className="text-sm">Brand: {currentTemplate.brand.name}</Text>
          <Text className="text-sm">Tagline: {currentTemplate.brand.tagline}</Text>
          <Text className="text-sm">Products Count: {allProducts.length}</Text>
          <Text className="text-sm">Featured Products: {featuredProducts.length}</Text>
        </Box>

        {/* Available Templates */}
        <Box className="p-4 bg-blue-50 rounded-lg">
          <Text className="font-bold mb-2">Available Templates:</Text>
          {availableTemplates.map((template) => (
            <Box key={template.id} className="mb-2 p-2 bg-white rounded border">
              <Text className="font-medium">{template.name}</Text>
              <Text className="text-sm text-gray-600">{template.brand.name} - {template.brand.tagline}</Text>
              <Button 
                size="small" 
                variant="primary"
                onClick={() => switchTemplate(template.id)}
                className="mt-1"
              >
                Switch to {template.name}
              </Button>
            </Box>
          ))}
        </Box>

        {/* Theme Colors Preview */}
        <Box className="p-4 bg-green-50 rounded-lg">
          <Text className="font-bold mb-2">Theme Colors:</Text>
          <Box className="flex space-x-2">
            <Box className="w-8 h-8 bg-primary-500 rounded"></Box>
            <Box className="w-8 h-8 bg-primary-600 rounded"></Box>
            <Box className="w-8 h-8 bg-primary-700 rounded"></Box>
            <Box className="w-8 h-8 bg-accent-main rounded"></Box>
          </Box>
        </Box>
      </Box>
    </Page>
  );
}

export default TestPage;
