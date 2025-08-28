import React, { useState, useEffect } from 'react';
import { 
  Page, 
  Box, 
  Text, 
  Button, 
  Header
} from 'zmp-ui';
import { useNavigate } from 'zmp-ui';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';

function OrdersPage() {
  const navigate = useNavigate();

  // Mock orders data for different users
  const mockOrdersData = [
    // User 1: Nguyễn Thị Anh
    [
      {
        id: 'VB2024001',
        date: '15/01/2024',
        status: 'delivered',
        statusText: 'Đã giao hàng',
        total: 1250000,
        items: [
          { name: 'Kem dưỡng ẩm chống lão hóa', quantity: 2, price: 450000 },
          { name: 'Son môi lì bền màu', quantity: 1, price: 320000 }
        ]
      },
      {
        id: 'VB2024002',
        date: '10/01/2024',
        status: 'processing',
        statusText: 'Đang xử lý',
        total: 850000,
        items: [
          { name: 'Sữa rửa mặt dịu nhẹ', quantity: 1, price: 280000 },
          { name: 'Toner cân bằng da', quantity: 1, price: 320000 },
          { name: 'Kem chống nắng SPF 50+', quantity: 1, price: 250000 }
        ]
      },
      {
        id: 'VB2024003',
        date: '05/01/2024',
        status: 'cancelled',
        statusText: 'Đã hủy',
        total: 650000,
        items: [
          { name: 'Mascara volumizing', quantity: 1, price: 350000 },
          { name: 'Phấn phủ mịn', quantity: 1, price: 300000 }
        ]
      }
    ],
    // User 2: Trần Văn Minh
    [
      {
        id: 'VB2024004',
        date: '20/03/2024',
        status: 'delivered',
        statusText: 'Đã giao hàng',
        total: 750000,
        items: [
          { name: 'Kem chống nắng SPF 50+', quantity: 1, price: 250000 },
          { name: 'Sữa rửa mặt dịu nhẹ', quantity: 1, price: 280000 },
          { name: 'Serum vitamin C', quantity: 1, price: 220000 }
        ]
      },
      {
        id: 'VB2024005',
        date: '15/03/2024',
        status: 'processing',
        statusText: 'Đang xử lý',
        total: 450000,
        items: [
          { name: 'Son môi lì bền màu', quantity: 1, price: 320000 },
          { name: 'Phấn phủ mịn', quantity: 1, price: 300000 }
        ]
      }
    ],
    // User 3: Lê Thị Hương
    [
      {
        id: 'VB2024006',
        date: '25/12/2023',
        status: 'delivered',
        statusText: 'Đã giao hàng',
        total: 2100000,
        items: [
          { name: 'Bộ chăm sóc da cao cấp', quantity: 1, price: 1200000 },
          { name: 'Kem dưỡng ẩm chống lão hóa', quantity: 2, price: 450000 }
        ]
      },
      {
        id: 'VB2024007',
        date: '20/12/2023',
        status: 'delivered',
        statusText: 'Đã giao hàng',
        total: 1800000,
        items: [
          { name: 'Bộ trang điểm chuyên nghiệp', quantity: 1, price: 1800000 }
        ]
      },
      {
        id: 'VB2024008',
        date: '15/12/2023',
        status: 'delivered',
        statusText: 'Đã giao hàng',
        total: 900000,
        items: [
          { name: 'Serum vitamin C', quantity: 1, price: 220000 },
          { name: 'Kem chống nắng SPF 50+', quantity: 1, price: 250000 },
          { name: 'Toner cân bằng da', quantity: 1, price: 320000 },
          { name: 'Sữa rửa mặt dịu nhẹ', quantity: 1, price: 280000 }
        ]
      }
    ],
    // User 4: Phạm Hoàng Nam
    [
      {
        id: 'VB2024009',
        date: '30/06/2024',
        status: 'processing',
        statusText: 'Đang xử lý',
        total: 850000,
        items: [
          { name: 'Kem dưỡng ẩm chống lão hóa', quantity: 1, price: 450000 },
          { name: 'Son môi lì bền màu', quantity: 1, price: 320000 },
          { name: 'Sữa rửa mặt dịu nhẹ', quantity: 1, price: 280000 }
        ]
      }
    ]
  ];

  // For demo, we'll use a simple counter to cycle through users
  const [userIndex, setUserIndex] = useState(0);
  const orders = mockOrdersData[userIndex];

  // Simulate user change (in real app, this would come from context/state management)
  useEffect(() => {
    const interval = setInterval(() => {
      setUserIndex((prev) => (prev + 1) % mockOrdersData.length);
    }, 10000); // Change user every 10 seconds for demo
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <Page className="bg-gray-50">
      <Header 
        title="Đơn hàng của tôi"
        className="bg-primary-600"
        showBackIcon
      />

      <Box className="p-4 space-y-4 mt-[100px]">
        {orders.length === 0 ? (
          <Box className="text-center py-20">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <Text className="text-gray-500 text-lg mb-2">Chưa có đơn hàng nào</Text>
            <Text className="text-gray-400 mb-6">Hãy mua sắm để có đơn hàng đầu tiên</Text>
            <Button
              variant="primary"
              onClick={() => navigate('/products')}
              className="bg-primary-600 hover:bg-primary-700"
            >
              Mua sắm ngay
            </Button>
          </Box>
        ) : (
          orders.map((order) => (
            <Box key={order.id} className="bg-white rounded-lg p-4 shadow-sm">
              {/* Order Header */}
              <Box className="flex items-center justify-between mb-3">
                <Box className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-primary-600" />
                  <Text className="font-semibold text-gray-900">
                    #{order.id}
                  </Text>
                </Box>
                <Box className="flex items-center space-x-2">
                  {getStatusIcon(order.status)}
                  <Text className={`text-sm font-medium ${
                    order.status === 'delivered' ? 'text-green-600' :
                    order.status === 'processing' ? 'text-blue-600' :
                    'text-red-600'
                  }`}>
                    {order.statusText}
                  </Text>
                </Box>
              </Box>

              {/* Order Date */}
              <Text className="text-sm text-gray-500 mb-3">
                Ngày đặt: {order.date}
              </Text>

              {/* Order Items */}
              <Box className="space-y-2 mb-3">
                {order.items.map((item, index) => (
                  <Box key={index} className="flex justify-between text-sm">
                    <Text className="text-gray-600">
                      {item.name} x{item.quantity}
                    </Text>
                    <Text className="text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </Text>
                  </Box>
                ))}
              </Box>

              {/* Order Total */}
              <Box className="border-t border-gray-200 pt-3">
                <Box className="flex justify-between items-center">
                  <Text className="font-semibold text-gray-900">
                    Tổng cộng:
                  </Text>
                  <Text className="text-lg font-bold text-primary-600">
                    {formatPrice(order.total)}
                  </Text>
                </Box>
              </Box>

              {/* Action Buttons */}
              <Box className="flex space-x-2 mt-3">
                <Button
                  variant="secondary"
                  size="small"
                  fullWidth
                  onClick={() => navigate('/order-detail', { state: { order } })}
                  className="border-primary-600 text-primary-600"
                >
                  Chi tiết
                </Button>
                {order.status === 'delivered' && (
                  <Button
                    variant="secondary"
                    size="small"
                    fullWidth
                    className="border-green-600 text-green-600"
                  >
                    Đánh giá
                  </Button>
                )}
              </Box>
            </Box>
          ))
        )}
      </Box>
    </Page>
  );
}

export default OrdersPage;
