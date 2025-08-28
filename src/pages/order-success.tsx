import React from 'react';
import { 
  Page, 
  Box, 
  Text, 
  Button, 
  Header
} from 'zmp-ui';
import { useNavigate } from 'zmp-ui';
import { CheckCircle, Home, Package, List } from 'lucide-react';

function OrderSuccessPage() {
  const navigate = useNavigate();

  return (
    <Page className="bg-gray-50">
      {/* Header */}
      <Header 
        title="Đặt hàng thành công"
        className="bg-primary-600 text-white"
      />

      {/* Success Content */}
      <Box className="flex flex-col items-center justify-center py-20 px-4">
        {/* Success Icon */}
        <Box className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </Box>

        {/* Success Message */}
        <Text.Title size="xLarge" className="mb-2 text-center text-gray-900">
          Đặt hàng thành công!
        </Text.Title>
        
        <Text className="text-gray-600 text-center mb-8 max-w-md">
          Cảm ơn bạn đã mua sắm tại Veridian Bloom. Chúng tôi sẽ xử lý đơn hàng và liên hệ với bạn trong thời gian sớm nhất.
        </Text>

        {/* Order Info */}
        <Box className="bg-white rounded-lg p-6 w-full max-w-md mb-8">
          <Text.Title size="large" className="mb-4 text-center">
            Thông tin đơn hàng
          </Text.Title>
          
          <Box className="space-y-3">
            <Box className="flex justify-between">
              <Text className="text-gray-600">Mã đơn hàng:</Text>
              <Text className="font-semibold">#VB2024001</Text>
            </Box>
            <Box className="flex justify-between">
              <Text className="text-gray-600">Ngày đặt:</Text>
              <Text>{new Date().toLocaleDateString('vi-VN')}</Text>
            </Box>
            <Box className="flex justify-between">
              <Text className="text-gray-600">Trạng thái:</Text>
              <Text className="text-green-600 font-semibold">Đã xác nhận</Text>
            </Box>
            <Box className="flex justify-between">
              <Text className="text-gray-600">Dự kiến giao:</Text>
              <Text>2-3 ngày làm việc</Text>
            </Box>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box className="space-y-3 w-full max-w-md">
          <Button
            variant="primary"
            fullWidth
            onClick={() => navigate('/')}
            className="bg-primary-600 hover:bg-primary-700"
          >
            <Home className="mr-2" />
            Tiếp tục mua sắm
          </Button>
          
          <Button
            variant="secondary"
            fullWidth
            onClick={() => navigate('/orders')}
            className="border-primary-600 text-primary-600 hover:bg-primary-50"
          >
            <List className="mr-2" />
            Xem đơn hàng của tôi
          </Button>
        </Box>

        {/* Contact Info */}
        <Box className="mt-8 text-center">
          <Text className="text-sm text-gray-500 mb-2">
            Cần hỗ trợ? Liên hệ với chúng tôi:
          </Text>
          <Text className="text-sm text-primary-600 font-medium">
            Hotline: 1900-1234
          </Text>
        </Box>
      </Box>
    </Page>
  );
}

export default OrderSuccessPage;
