import React, { useState } from 'react';
import { Box, Button, Text } from 'zmp-ui';
import { getAccessToken } from 'zmp-sdk';
import { authService, User } from '../services/auth';

interface ZaloLoginProps {
  onLoginSuccess: (user: User) => void;
  onLoginError: (error: string) => void;
}

const ZaloLogin: React.FC<ZaloLoginProps> = ({ onLoginSuccess, onLoginError }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleZaloLogin = async () => {
    setIsLoading(true);
    try {
      // Sử dụng getAccessToken từ zmp-sdk để lấy Zalo access token
      const zaloAccessToken = await getAccessToken();
      
      if (!zaloAccessToken) {
        throw new Error('Không thể lấy access token từ Zalo');
      }

      // Gọi API backend để đăng nhập
      const user = await authService.loginWithZalo(zaloAccessToken);
      
      onLoginSuccess(user);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Đăng nhập thất bại';
      onLoginError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="primary"
      size="medium"
      onClick={handleZaloLogin}
      disabled={isLoading}
      className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
    >
      <Box className="flex items-center justify-center space-x-2">
        {isLoading ? (
          <Box className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></Box>
        ) : (
          <Box className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
            <Text className="text-primary-600 text-xs font-bold">Z</Text>
          </Box>
        )}
        <Text>{isLoading ? 'Đang đăng nhập...' : 'Đăng nhập với Zalo'}</Text>
      </Box>
    </Button>
  );
};

export default ZaloLogin;
