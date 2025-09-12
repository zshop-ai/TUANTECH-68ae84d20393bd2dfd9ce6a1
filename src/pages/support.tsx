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
      title: "Chat trực tuyến",
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

  const faqItems = [
    {
      question: "Làm thế nào để đặt hàng?",
      answer:
        "Bạn có thể đặt hàng bằng cách chọn sản phẩm, thêm vào giỏ hàng và tiến hành thanh toán.",
    },
    {
      question: "Thời gian giao hàng là bao lâu?",
      answer:
        "Thời gian giao hàng từ 2-5 ngày làm việc tùy thuộc vào địa chỉ giao hàng.",
    },
    {
      question: "Có thể đổi trả sản phẩm không?",
      answer:
        "Có, bạn có thể đổi trả sản phẩm trong vòng 30 ngày kể từ ngày nhận hàng.",
    },
    {
      question: "Các phương thức thanh toán nào được chấp nhận?",
      answer:
        "Chúng tôi chấp nhận thanh toán bằng tiền mặt, chuyển khoản ngân hàng và ví MoMo.",
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

        {/* Business Hours */}
        <Box className="bg-white rounded-lg p-4 shadow-sm">
          <Box className="flex items-center space-x-3 mb-3">
            <Clock className="w-5 h-5 text-primary-600" />
            <Text className="font-medium text-gray-900">Giờ làm việc</Text>
          </Box>
          <Box className="space-y-1">
            <Text className="text-sm text-gray-600">
              Thứ 2 - Thứ 6: 8:00 - 18:00
            </Text>
            <Text className="text-sm text-gray-600">Thứ 7: 8:00 - 12:00</Text>
            <Text className="text-sm text-gray-600">Chủ nhật: Nghỉ</Text>
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

        {/* FAQ */}
        <Box>
          <Text.Title size="large" className="mb-3 text-gray-900">
            Câu hỏi thường gặp
          </Text.Title>
          <Box className="bg-white rounded-lg shadow-sm">
            {faqItems.map((faq, index) => (
              <Box
                key={index}
                className={`p-4 ${
                  index === faqItems.length - 1
                    ? ""
                    : "border-b border-gray-100"
                }`}
              >
                <Text className="font-medium text-gray-900 mb-2">
                  {faq.question}
                </Text>
                <Text className="text-sm text-gray-600">{faq.answer}</Text>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Contact Button */}
        <Button
          variant="primary"
          fullWidth
          onClick={() => console.log("Contact support")}
          className="bg-primary-600 hover:bg-primary-700"
        >
          <div className="flex items-center justify-center">
            <Headphones className="w-5 h-5 mr-2" />
            Liên hệ ngay
          </div>
        </Button>
      </Box>
    </Page>
  );
}

export default SupportPage;
