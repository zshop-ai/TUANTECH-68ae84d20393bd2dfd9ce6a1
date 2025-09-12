import React, { useState, useEffect } from "react";
import { Page, Box, Text, Button, Header } from "zmp-ui";
import { useNavigate } from "zmp-ui";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  X,
  Phone,
  MapPin,
  Mail,
  CreditCard,
  Truck,
} from "lucide-react";
import { ordersService, type OrderDto } from "../services/orders";

function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDto | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await ordersService.getMyOrders();
        if (mounted) setOrders(data);
      } catch (e) {
        if (mounted) setError("Không thể tải đơn hàng.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "confirmed":
        return <Clock className="w-5 h-5 text-blue-600" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
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
        {loading ? (
          <Box className="text-center py-20">
            <Text className="text-gray-500">Đang tải đơn hàng...</Text>
          </Box>
        ) : error ? (
          <Box className="text-center py-20">
            <Text className="text-red-600">{error}</Text>
          </Box>
        ) : orders.length === 0 ? (
          <Box className="text-center py-20">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <Text className="text-gray-500 text-lg mb-2">
              Chưa có đơn hàng nào
            </Text>
            <Text className="text-gray-400 mb-6">
              Hãy mua sắm để có đơn hàng đầu tiên
            </Text>
            <Button
              variant="primary"
              onClick={() => navigate("/products")}
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
                    #{order.id.slice(0, 4)}...{order.id.slice(-4)}
                  </Text>
                </Box>
                <Box className="flex items-center space-x-2">
                  <Text
                    className={`text-sm font-medium ${
                      order.status === "delivered"
                        ? "text-green-600"
                        : order.status === "confirmed"
                        ? "text-blue-600"
                        : "text-red-600"
                    }`}
                  >
                    {order.status === "delivered"
                      ? "Đã giao hàng"
                      : order.status === "confirmed"
                      ? "Đã xác nhận"
                      : order.status === "cancelled"
                      ? "Đã hủy"
                      : "Chờ xác nhận"}
                  </Text>
                </Box>
              </Box>

              {/* Order Date */}
              <Text className="text-sm text-gray-500 mb-3">
                Ngày đặt:{" "}
                {new Date(order.createdAt).toLocaleDateString("vi-VN")}
              </Text>

              {/* Order Items */}
              <Box className="space-y-2 mb-3">
                {order.products.map((item, index) => (
                  <Box key={index} className="flex justify-between text-sm">
                    <Text className="text-gray-600">
                      {item.productName} x{item.quantity}
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
                    {formatPrice(order.totalAmount)}
                  </Text>
                </Box>
              </Box>

              {/* Action Buttons */}
              <Box className="flex space-x-2 mt-3">
                <Button
                  variant="secondary"
                  size="small"
                  fullWidth
                  onClick={() => {
                    setSelectedOrder(order);
                    setDetailOpen(true);
                  }}
                  className="border-primary-600 text-primary-600"
                >
                  Chi tiết
                </Button>
                {order.status === "delivered" && (
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

      {detailOpen && selectedOrder && (
        <Box className="fixed inset-0 z-50">
          {/* Backdrop */}
          <Box
            className="absolute inset-0 bg-black/40"
            onClick={() => setDetailOpen(false)}
          />
          {/* Modal Panel */}
          <Box className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-xl max-h-[85vh] overflow-hidden">
            <Box className="flex items-center justify-between p-4 border-b border-gray-100">
              <Text className="font-semibold text-gray-900">
                Chi tiết đơn hàng #{selectedOrder.id}
              </Text>
              <Button
                size="small"
                variant="secondary"
                onClick={() => setDetailOpen(false)}
                className="border-gray-300 text-gray-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </Box>
            <Box
              className="p-4 overflow-y-auto"
              style={{ maxHeight: "calc(85vh - 56px)" }}
            >
              {/* Status & Date */}
              <Box className="bg-gray-50 rounded-lg p-3 mb-4">
                <Box className="flex items-center justify-between">
                  <Box className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary-600" />
                    <Text className="text-sm text-gray-700">Trạng thái</Text>
                  </Box>
                  <Text
                    className={`text-sm font-medium ${
                      selectedOrder.status === "delivered"
                        ? "text-green-600"
                        : selectedOrder.status === "confirmed"
                        ? "text-blue-600"
                        : selectedOrder.status === "cancelled"
                        ? "text-red-600"
                        : "text-amber-600"
                    }`}
                  >
                    {selectedOrder.status === "delivered"
                      ? "Đã giao hàng"
                      : selectedOrder.status === "confirmed"
                      ? "Đã xác nhận"
                      : selectedOrder.status === "cancelled"
                      ? "Đã hủy"
                      : "Chờ xác nhận"}
                  </Text>
                </Box>
                <Text className="text-xs text-gray-500 mt-2">
                  Ngày đặt:{" "}
                  {new Date(selectedOrder.createdAt).toLocaleString("vi-VN")}
                </Text>
              </Box>

              {/* Recipient */}
              <Box className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-4">
                <Text className="font-semibold text-gray-900 mb-2">
                  Người nhận
                </Text>
                <Box className="space-y-2 text-sm">
                  <Box className="flex items-center gap-2 text-gray-700">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <Text>{selectedOrder.customerName}</Text>
                  </Box>
                  <Box className="flex items-center gap-2 text-gray-700">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <Text>{selectedOrder.customerPhone}</Text>
                  </Box>
                  {selectedOrder.customerEmail && (
                    <Box className="flex items-center gap-2 text-gray-700">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <Text>{selectedOrder.customerEmail}</Text>
                    </Box>
                  )}
                  {selectedOrder.customerAddress && (
                    <Box className="flex items-center gap-2 text-gray-700">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <Text className="line-clamp-2 w-full">
                        {selectedOrder.customerAddress}
                      </Text>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Items */}
              <Box className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-4">
                <Text className="font-semibold text-gray-900 mb-2">
                  Sản phẩm
                </Text>
                <Box className="divide-y divide-gray-100">
                  {selectedOrder.products.map((item, idx) => (
                    <Box
                      key={idx}
                      className="py-3 flex items-start justify-between gap-4"
                    >
                      <Box>
                        <Text className="font-medium text-gray-900">
                          {item.productName}
                        </Text>
                        {item.variantName && (
                          <Text className="text-xs text-gray-500 mt-0.5">
                            {item.variantName}
                          </Text>
                        )}
                        <Text className="text-sm text-gray-600 mt-0.5">
                          Số lượng: {item.quantity}
                        </Text>
                      </Box>
                      <Text className="font-semibold text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </Text>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Payment & Shipping */}
              <Box className="grid grid-cols-2 gap-3 mb-4">
                <Box className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                  <Text className="text-sm font-semibold text-gray-900">
                    Thanh toán
                  </Text>
                  <Box className="flex items-center gap-2 mt-2">
                    <CreditCard className="w-4 h-4 text-gray-500" />
                    <Text className="text-sm text-gray-700">
                      {selectedOrder.paymentMethod?.toUpperCase() || "-"}
                    </Text>
                  </Box>
                  <Text className="text-xs text-gray-500 mt-1">
                    Trạng thái: {selectedOrder.paymentStatus || "-"}
                  </Text>
                </Box>
                <Box className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                  <Text className="text-sm font-semibold text-gray-900">
                    Vận chuyển
                  </Text>
                  <Box className="flex items-center gap-2 mt-2">
                    <Truck className="w-4 h-4 text-gray-500" />
                    <Text className="text-sm text-gray-700">
                      {selectedOrder.shippingMethod || "-"}
                    </Text>
                  </Box>
                  <Text className="text-xs text-gray-500 mt-1">
                    Phí: {formatPrice(selectedOrder.shippingFee || 0)}
                  </Text>
                </Box>
              </Box>

              {/* Totals */}
              <Box className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <Text className="font-semibold text-gray-900 mb-2">
                  Tổng kết
                </Text>
                <Box className="space-y-2 text-sm">
                  <Box className="flex justify-between">
                    <Text className="text-gray-600">Tạm tính</Text>
                    <Text className="text-gray-900">
                      {formatPrice(
                        selectedOrder.products.reduce(
                          (s, i) => s + i.price * i.quantity,
                          0
                        )
                      )}
                    </Text>
                  </Box>
                  <Box className="flex justify-between">
                    <Text className="text-gray-600">Phí vận chuyển</Text>
                    <Text className="text-gray-900">
                      {formatPrice(selectedOrder.shippingFee || 0)}
                    </Text>
                  </Box>
                  {typeof (selectedOrder as any).discount === "number" &&
                    (selectedOrder as any).discount > 0 && (
                      <Box className="flex justify-between">
                        <Text className="text-gray-600">Giảm giá</Text>
                        <Text className="text-gray-900">
                          -{formatPrice((selectedOrder as any).discount)}
                        </Text>
                      </Box>
                    )}
                  <Box className="border-t border-gray-200 pt-2 flex justify-between items-center">
                    <Text className="font-semibold text-gray-900">
                      Tổng cộng
                    </Text>
                    <Text className="text-lg font-bold text-primary-600">
                      {formatPrice(selectedOrder.totalAmount)}
                    </Text>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Page>
  );
}

export default OrdersPage;
