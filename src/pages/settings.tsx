import React, { useState } from 'react';
import { 
  Page, 
  Box, 
  Text, 
  Button, 
  Header
} from 'zmp-ui';
import { useNavigate } from 'zmp-ui';
import { 
  Bell, 
  Shield, 
  Globe, 
  Moon, 
  Smartphone, 
  ChevronRight,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

function SettingsPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    language: 'Tiếng Việt',
    autoUpdate: true
  });

  const settingsItems = [
    {
      id: 'notifications',
      title: 'Thông báo',
      subtitle: 'Nhận thông báo về đơn hàng và khuyến mãi',
      icon: Bell,
      type: 'toggle',
      value: settings.notifications,
      action: () => setSettings(prev => ({ ...prev, notifications: !prev.notifications }))
    },
    {
      id: 'darkMode',
      title: 'Chế độ tối',
      subtitle: 'Giao diện tối cho mắt dễ chịu hơn',
      icon: Moon,
      type: 'toggle',
      value: settings.darkMode,
      action: () => setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }))
    },
    {
      id: 'language',
      title: 'Ngôn ngữ',
      subtitle: settings.language,
      icon: Globe,
      type: 'select',
      action: () => console.log('Change language')
    },
    {
      id: 'autoUpdate',
      title: 'Tự động cập nhật',
      subtitle: 'Tự động cập nhật ứng dụng khi có phiên bản mới',
      icon: Smartphone,
      type: 'toggle',
      value: settings.autoUpdate,
      action: () => setSettings(prev => ({ ...prev, autoUpdate: !prev.autoUpdate }))
    }
  ];

  const securityItems = [
    {
      id: 'privacy',
      title: 'Chính sách bảo mật',
      subtitle: 'Xem thông tin về bảo mật dữ liệu',
      icon: Shield,
      type: 'link',
      action: () => console.log('Privacy policy')
    },
    {
      id: 'terms',
      title: 'Điều khoản sử dụng',
      subtitle: 'Xem điều khoản và điều kiện sử dụng',
      icon: Shield,
      type: 'link',
      action: () => console.log('Terms of service')
    }
  ];

  const renderToggle = (value: boolean) => {
    return value ? (
      <ToggleRight className="w-6 h-6 text-primary-600" />
    ) : (
      <ToggleLeft className="w-6 h-6 text-gray-400" />
    );
  };

  return (
    <Page className="bg-gray-50">
      <Header 
        title="Cài đặt"
        className="bg-primary-600"
        showBackIcon
      />

      <Box className="p-4 space-y-6 mt-[100px]">
        {/* General Settings */}
        <Box>
          <Text.Title size="large" className="mb-3 text-gray-900">
            Cài đặt chung
          </Text.Title>
          <Box className="bg-white rounded-lg shadow-sm">
            {settingsItems.map((item, index) => (
              <Box
                key={item.id}
                onClick={item.action}
                className={`flex items-center justify-between p-4 cursor-pointer ${
                  index === settingsItems.length - 1 ? '' : 'border-b border-gray-100'
                }`}
              >
                <Box className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5 text-primary-600" />
                  <Box>
                    <Text className="font-medium text-gray-900">
                      {item.title}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {item.subtitle}
                    </Text>
                  </Box>
                </Box>
                {item.type === 'toggle' ? (
                  renderToggle(item.value)
                ) : (
                  <ChevronRight className="text-gray-400" />
                )}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Security & Privacy */}
        <Box>
          <Text.Title size="large" className="mb-3 text-gray-900">
            Bảo mật & Quyền riêng tư
          </Text.Title>
          <Box className="bg-white rounded-lg shadow-sm">
            {securityItems.map((item, index) => (
              <Box
                key={item.id}
                onClick={item.action}
                className={`flex items-center justify-between p-4 cursor-pointer ${
                  index === securityItems.length - 1 ? '' : 'border-b border-gray-100'
                }`}
              >
                <Box className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5 text-primary-600" />
                  <Box>
                    <Text className="font-medium text-gray-900">
                      {item.title}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {item.subtitle}
                    </Text>
                  </Box>
                </Box>
                <ChevronRight className="text-gray-400" />
              </Box>
            ))}
          </Box>
        </Box>

        {/* App Info */}
        <Box className="bg-white rounded-lg p-4 shadow-sm">
          <Box className="text-center">
            <Text className="text-sm text-gray-500 mb-1">
              Veridian Bloom v1.0.0
            </Text>
            <Text className="text-xs text-gray-400">
              © 2024 Veridian Bloom. All rights reserved.
            </Text>
          </Box>
        </Box>
      </Box>
    </Page>
  );
}

export default SettingsPage;
