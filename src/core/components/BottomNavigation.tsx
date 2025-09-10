import React from 'react';
import { Box, Text } from 'zmp-ui';
import { useNavigate, useLocation } from 'zmp-ui';
import { Home, Package, ShoppingCart, User } from 'lucide-react';
import { useCoreTheme } from '../theme/context';

interface BottomNavigationProps {
  className?: string;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentTemplate } = useCoreTheme();

  const tabs = [
    {
      id: 'home',
      label: 'Trang chủ',
      icon: Home,
      path: '/'
    },
    {
      id: 'products',
      label: 'Sản phẩm',
      icon: Package,
      path: '/products'
    },
    {
      id: 'cart',
      label: 'Giỏ hàng',
      icon: ShoppingCart,
      path: '/cart'
    },
    {
      id: 'profile',
      label: 'Cá nhân',
      icon: User,
      path: '/profile'
    }
  ];

  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path.startsWith('/products')) return 'products';
    if (path.startsWith('/cart')) return 'cart';
    if (path.startsWith('/profile')) return 'profile';
    return 'home';
  };

  const currentPage = getCurrentPage();

  return (
    <Box className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 ${className}`}>
      <Box className="flex items-center justify-around py-2">
        {tabs.map((tab) => (
          <Box
            key={tab.id}
            className="flex flex-col items-center py-2 px-3 cursor-pointer"
            onClick={() => navigate(tab.path)}
          >
            <tab.icon
              className={`w-6 h-6 mb-1 ${
                currentPage === tab.id
                  ? 'text-primary-600'
                  : 'text-gray-400'
              }`}
            />
            <Text
              className={`text-xs ${
                currentPage === tab.id
                  ? 'text-primary-600 font-medium'
                  : 'text-gray-500'
              }`}
            >
              {tab.label}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default BottomNavigation;
