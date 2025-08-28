import React, { useState } from 'react';
import { 
  Page, 
  Box, 
  Text, 
  Button, 
  Header, 
  useSnackbar,
  Input
} from 'zmp-ui';
import { useNavigate, useLocation } from 'zmp-ui';
import { CreditCard, Building2, Wallet } from 'lucide-react';

function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { openSnackbar } = useSnackbar();
  const products = location.state?.products || [];

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    district: '',
    paymentMethod: 'cod',
    note: ''
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const calculateSubtotal = () => {
    return products.reduce((total: number, item: any) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + 30000; // Shipping fee
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Validate form
    if (!formData.fullName || !formData.phone || !formData.address) {
      openSnackbar({
        type: 'error',
        text: 'Vui lòng điền đầy đủ thông tin bắt buộc',
        duration: 3000,
      });
      return;
    }

    // Mock order placement
    openSnackbar({
      type: 'success',
      text: 'Đặt hàng thành công! Chúng tôi sẽ liên hệ sớm nhất',
      duration: 3000,
    });

    // Navigate to order confirmation
    setTimeout(() => {
      navigate('/order-success');
    }, 2000);
  };

  return (
    <Page className="bg-gray-50">
      {/* Header */}
      <Header 
        title="Thanh toán"
        className="bg-primary-600 text-white"
        showBackIcon
      />

      <Box className="p-4 space-y-6">
        {/* Order Summary */}
        <Box className="bg-white rounded-lg p-4">
          <Text.Title size="large" className="mb-3">
            Tóm tắt đơn hàng
          </Text.Title>
          
          {products.map((item: any, index: number) => (
            <Box key={index} className="flex items-center space-x-3 mb-3">
              <Box className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </Box>
              <Box className="flex-1 min-w-0">
                <Text className="font-medium text-gray-900 line-clamp-1">
                  {item.product.name}
                </Text>
                <Text className="text-sm text-gray-500">
                  Số lượng: {item.quantity}
                </Text>
              </Box>
              <Text className="font-semibold text-primary-600">
                {formatPrice(item.product.price * item.quantity)}
              </Text>
            </Box>
          ))}

          {/* Divider */}
          <Box className="border-t border-gray-200 my-4" />

          <Box className="space-y-2">
            <Box className="flex justify-between">
              <Text className="text-gray-600">Tạm tính:</Text>
              <Text>{formatPrice(calculateSubtotal())}</Text>
            </Box>
            <Box className="flex justify-between">
              <Text className="text-gray-600">Phí vận chuyển:</Text>
              <Text>{formatPrice(30000)}</Text>
            </Box>
            {/* Divider */}
            <Box className="border-t border-gray-200 my-4" />
            <Box className="flex justify-between">
              <Text.Title size="large">Tổng cộng:</Text.Title>
              <Text.Title size="large" className="text-primary-600">
                {formatPrice(calculateTotal())}
              </Text.Title>
            </Box>
          </Box>
        </Box>

        {/* Shipping Information */}
        <Box className="bg-white rounded-lg p-4">
          <Text.Title size="large" className="mb-3">
            Thông tin giao hàng
          </Text.Title>
          
          <Box className="space-y-3">
            <Input
              label="Họ và tên *"
              placeholder="Nhập họ và tên"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
            />
            
            <Input
              label="Số điện thoại *"
              placeholder="Nhập số điện thoại"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
            
            <Input
              label="Email"
              placeholder="Nhập email (không bắt buộc)"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
            
            <Input
              label="Địa chỉ *"
              placeholder="Nhập địa chỉ giao hàng"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
            />
            
            <Box className="grid grid-cols-2 gap-3">
              <Input
                label="Tỉnh/Thành phố"
                placeholder="Chọn tỉnh/thành phố"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
              />
              
              <Input
                label="Quận/Huyện"
                placeholder="Chọn quận/huyện"
                value={formData.district}
                onChange={(e) => handleInputChange('district', e.target.value)}
              />
            </Box>
            
            <Input
              label="Ghi chú"
              placeholder="Ghi chú cho đơn hàng (không bắt buộc)"
              value={formData.note}
              onChange={(e) => handleInputChange('note', e.target.value)}
            />
          </Box>
        </Box>

        {/* Payment Method */}
        <Box className="bg-white rounded-lg p-4">
          <Text.Title size="large" className="mb-3">
            Phương thức thanh toán
          </Text.Title>
          
          <Box className="space-y-3">
            <Box
              className={`p-3 border rounded-lg cursor-pointer ${
                formData.paymentMethod === 'cod' ? 'border-primary-600 bg-primary-50' : 'border-gray-200'
              }`}
              onClick={() => handleInputChange('paymentMethod', 'cod')}
            >
              <Box className="flex items-center space-x-3">
                <Wallet className="w-5 h-5 text-primary-600" />
                <Box>
                  <Text className="font-medium">Thanh toán khi nhận hàng (COD)</Text>
                  <Text className="text-sm text-gray-500">Thanh toán bằng tiền mặt khi nhận hàng</Text>
                </Box>
              </Box>
            </Box>
            
            <Box
              className={`p-3 border rounded-lg cursor-pointer ${
                formData.paymentMethod === 'bank' ? 'border-primary-600 bg-primary-50' : 'border-gray-200'
              }`}
              onClick={() => handleInputChange('paymentMethod', 'bank')}
            >
              <Box className="flex items-center space-x-3">
                <Building2 className="w-5 h-5 text-primary-600" />
                <Box>
                  <Text className="font-medium">Chuyển khoản ngân hàng</Text>
                  <Text className="text-sm text-gray-500">Chuyển khoản qua tài khoản ngân hàng</Text>
                </Box>
              </Box>
            </Box>
            
            <Box
              className={`p-3 border rounded-lg cursor-pointer ${
                formData.paymentMethod === 'momo' ? 'border-primary-600 bg-primary-50' : 'border-gray-200'
              }`}
              onClick={() => handleInputChange('paymentMethod', 'momo')}
            >
              <Box className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-primary-600" />
                <Box>
                  <Text className="font-medium">Ví MoMo</Text>
                  <Text className="text-sm text-gray-500">Thanh toán qua ví MoMo</Text>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Bottom Action */}
      <Box className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <Button
          variant="primary"
          fullWidth
          onClick={handleSubmit}
          className="bg-primary-600 hover:bg-primary-700"
        >
          Đặt hàng - {formatPrice(calculateTotal())}
        </Button>
      </Box>

      {/* Bottom Spacing */}
      <Box className="h-24" />
    </Page>
  );
}

export default CheckoutPage;
