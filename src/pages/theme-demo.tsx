import React from 'react';
import { Page, Box, Text, Button } from 'zmp-ui';
import { loadThemeFromEnv } from '../core/config/env-theme-loader';

const ThemeDemoPage: React.FC = () => {
  const theme = loadThemeFromEnv();

  const updateTheme = () => {
    // Demo: Hiển thị hướng dẫn cập nhật .env
    alert('Để thay đổi theme, hãy cập nhật file .env với các biến VITE_* và restart app!');
  };

  return (
    <Page className="bg-gray-50">
      <Box className="p-4">
        <Text.Title size="large" className="mb-4">Theme Configuration Demo</Text.Title>
        
        <Box className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <Text className="font-semibold mb-2">Current Theme:</Text>
          <Box className="space-y-2">
            <Text>Project Name: {theme.projectName}</Text>
            <Text>Primary Color: {theme.primaryColor}</Text>
            <Text>Background Color: {theme.backgroundColor}</Text>
            <Text>Text Color: {theme.textColor}</Text>
            <Text>Font Family: {theme.fontFamily}</Text>
            <Text>Logo URL: {theme.logoUrl}</Text>
            <Text>Banner URL: {theme.bannerUrl}</Text>
          </Box>
        </Box>

        <Box className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <Text className="font-semibold mb-2">Theme Preview:</Text>
          <Box 
            className="p-4 rounded-lg mb-2"
            style={{ 
              backgroundColor: theme.backgroundColor,
              color: theme.textColor,
              fontFamily: theme.fontFamily
            }}
          >
            <Text className="text-lg font-bold" style={{ color: theme.primaryColor }}>
              {theme.projectName}
            </Text>
            <Text>This is how your theme looks!</Text>
          </Box>
        </Box>

        <Button 
          variant="primary" 
          fullWidth 
          onClick={updateTheme}
          className="mb-4"
        >
          Update Theme (Demo)
        </Button>

        <Box className="bg-blue-50 rounded-lg p-4">
          <Text className="text-blue-800 font-semibold mb-2">How to customize:</Text>
          <Text className="text-blue-700 text-sm">
            1. Edit .env file with VITE_* variables<br/>
            2. Restart the app to see changes<br/>
            3. All theme configs are loaded from .env only
          </Text>
        </Box>
      </Box>
    </Page>
  );
};

export default ThemeDemoPage;
