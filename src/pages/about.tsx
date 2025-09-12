import React from "react";
import { Page, Box, Text, Button, Header } from "zmp-ui";
import { useNavigate } from "zmp-ui";
import {
  Heart,
  Leaf,
  Users,
  Award,
  Globe,
  Star,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
} from "lucide-react";

function AboutPage() {
  const navigate = useNavigate();

  const stats = [
    {
      number: "50K+",
      label: "Khách hàng tin tưởng",
      icon: Users,
    },
    {
      number: "100%",
      label: "Thành phần tự nhiên",
      icon: Leaf,
    },
    {
      number: "4.8",
      label: "Đánh giá trung bình",
      icon: Star,
    },
    {
      number: "5+",
      label: "Năm kinh nghiệm",
      icon: Award,
    },
  ];

  const values = [
    {
      title: "Thành phần tự nhiên",
      description:
        "Chúng tôi cam kết sử dụng 100% thành phần tự nhiên, an toàn cho mọi loại da.",
      icon: Leaf,
    },
    {
      title: "Chất lượng cao",
      description:
        "Mỗi sản phẩm đều được kiểm định nghiêm ngặt để đảm bảo chất lượng tốt nhất.",
      icon: Award,
    },
    {
      title: "Bảo vệ môi trường",
      description:
        "Chúng tôi nỗ lực bảo vệ môi trường thông qua bao bì thân thiện và quy trình sản xuất xanh.",
      icon: Globe,
    },
  ];

  return (
    <Page className="bg-gray-50">
      <Header title="Về chúng tôi" className="bg-primary-600" showBackIcon />

      <Box className="p-4 space-y-6 mt-[100px]">
        {/* Hero Section */}
        <Box className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg p-6 text-white text-center">
          <Heart className="w-16 h-16 mx-auto mb-4 text-white" />
          <Text.Title size="xLarge" className="mb-2">
            Veridian Bloom
          </Text.Title>
          <Text className="text-lg opacity-90 mb-2">Nature's Embrace</Text>
          <Text className="opacity-80">
            Khám phá vẻ đẹp tự nhiên với các sản phẩm mỹ phẩm chất lượng cao
          </Text>
        </Box>

        {/* Stats */}
        <Box className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <Box
              key={index}
              className="bg-white rounded-lg p-4 text-center shadow-sm"
            >
              <stat.icon className="w-8 h-8 text-primary-600 mx-auto mb-2" />
              <Text className="text-2xl font-bold text-gray-900 mb-1">
                {stat.number}
              </Text>
              <Text className="text-sm text-gray-600">{stat.label}</Text>
            </Box>
          ))}
        </Box>

        {/* Story */}
        <Box className="bg-white rounded-lg p-6 shadow-sm">
          <Text.Title size="large" className="mb-4 text-gray-900">
            Câu chuyện của chúng tôi
          </Text.Title>
          <Text className="text-gray-600 leading-relaxed mb-4">
            Veridian Bloom được thành lập với tình yêu dành cho thiên nhiên và
            mong muốn mang đến những sản phẩm mỹ phẩm chất lượng cao, an toàn
            cho người sử dụng.
          </Text>
          <Text className="text-gray-600 leading-relaxed">
            Chúng tôi tin rằng vẻ đẹp thực sự đến từ sự hài hòa với thiên nhiên.
            Mỗi sản phẩm của chúng tôi đều được nghiên cứu và phát triển cẩn
            thận, sử dụng những thành phần tự nhiên tốt nhất để mang lại hiệu
            quả tối ưu cho làn da của bạn.
          </Text>
        </Box>

        {/* Values */}
        <Box>
          <Text.Title size="large" className="mb-4 text-gray-900">
            Giá trị cốt lõi
          </Text.Title>
          <Box className="space-y-4">
            {values.map((value, index) => (
              <Box key={index} className="bg-white rounded-lg p-4 shadow-sm">
                <Box className="flex items-start space-x-3">
                  <value.icon className="w-6 h-6 text-primary-600 mt-1 flex-shrink-0" />
                  <Box>
                    <Text className="font-semibold text-gray-900 mb-2">
                      {value.title}
                    </Text>
                    <Text className="text-gray-600 leading-relaxed">
                      {value.description}
                    </Text>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Mission */}
        <Box className="bg-primary-50 rounded-lg p-6">
          <Text.Title size="large" className="mb-3 text-primary-700">
            Sứ mệnh
          </Text.Title>
          <Text className="text-primary-600 leading-relaxed">
            Chúng tôi cam kết mang đến những sản phẩm mỹ phẩm chất lượng cao, an
            toàn và hiệu quả, giúp bạn khám phá và thể hiện vẻ đẹp tự nhiên của
            mình một cách tự tin nhất.
          </Text>
        </Box>

        {/* Contact Info */}
        <Box className="bg-white rounded-lg p-6 shadow-sm">
          <Text.Title size="large" className="mb-4 text-gray-900">
            Thông tin liên hệ
          </Text.Title>
          <Box className="space-y-2">
            <Box className="flex items-center space-x-2 mb-2">
              <Mail className="w-4 h-4 text-primary-600" />
              <Text className="text-gray-600">
                Email: info@veridianbloom.com
              </Text>
            </Box>
            <Box className="flex items-center space-x-2 mb-2">
              <Phone className="w-4 h-4 text-primary-600" />
              <Text className="text-gray-600">Hotline: 1900-1234</Text>
            </Box>
            <Box className="flex items-center space-x-2 mb-2">
              <MapPin className="w-6 h-4 text-primary-600" />
              <Text className="text-gray-600">
                Địa chỉ: 123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh
              </Text>
            </Box>
            <Box className="flex items-center space-x-2 mb-2">
              <ExternalLink className="w-4 h-4 text-primary-600" />
              <Text className="text-gray-600">
                Website: www.veridianbloom.com
              </Text>
            </Box>
          </Box>
        </Box>

        {/* App Version */}
        <Box className="text-center">
          <Text className="text-sm text-gray-500 mb-1">
            Veridian Bloom v1.0.0
          </Text>
          <Text className="text-xs text-gray-400">
            © 2024 Veridian Bloom. All rights reserved.
          </Text>
        </Box>
      </Box>
    </Page>
  );
}

export default AboutPage;
