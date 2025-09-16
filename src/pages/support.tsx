import React from "react";
import { Page, Box, Text, Button, Header } from "zmp-ui";
import { useNavigate } from "zmp-ui";
import {
  Headphones,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  MapPin,
  ChevronRight,
} from "lucide-react";

function SupportPage() {
  const navigate = useNavigate();

  const supportMethods = [
    {
      id: "chat",
      title: "Chat trực tuyến với OA",
      subtitle: "Trò chuyện với nhân viên hỗ trợ",
      icon: MessageCircle,
      action: () => console.log("Open chat"),
    },
    {
      id: "phone",
      title: "Gọi điện thoại",
      subtitle: "1900-1234 (Miễn phí)",
      icon: Phone,
      action: () => console.log("Call support"),
    },
    {
      id: "email",
      title: "Gửi email",
      subtitle: "support@veridianbloom.com",
      icon: Mail,
      action: () => console.log("Send email"),
    },
  ];

  return (
    <Page className="bg-gray-50">
      <Header
        title="Hỗ trợ khách hàng"
        className="bg-primary-600"
        showBackIcon
      />

      <Box className="p-4 space-y-6 mt-[100px]">
        {/* Contact Methods */}
        <Box>
          <Text.Title size="large" className="mb-3 text-gray-900">
            Liên hệ với chúng tôi
          </Text.Title>
          <Box className="bg-white rounded-lg shadow-sm">
            {supportMethods.map((method, index) => (
              <Box
                key={method.id}
                onClick={method.action}
                className={`flex items-center justify-between p-4 cursor-pointer ${
                  index === supportMethods.length - 1
                    ? ""
                    : "border-b border-gray-100"
                }`}
              >
                <Box className="flex items-center space-x-3">
                  <method.icon className="w-5 h-5 text-primary-600" />
                  <Box>
                    <Text className="font-medium text-gray-900">
                      {method.title}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {method.subtitle}
                    </Text>
                  </Box>
                </Box>
                <ChevronRight className="text-gray-400" />
              </Box>
            ))}
          </Box>
        </Box>

        {/* Office Address */}
        <Box className="bg-white rounded-lg p-4 shadow-sm">
          <Box className="flex items-center space-x-3 mb-3">
            <MapPin className="w-5 h-5 text-primary-600" />
            <Text className="font-medium text-gray-900">Văn phòng chính</Text>
          </Box>
          <Text className="text-sm text-gray-600">
            123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh
          </Text>
        </Box>
      </Box>
    </Page>
  );
}

export default SupportPage;
