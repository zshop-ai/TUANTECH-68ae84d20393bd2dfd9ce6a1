import { useState, useEffect, useCallback } from "react";
import { Page, Box, Text, Button, Header } from "zmp-ui";
import { useNavigate } from "zmp-ui";
import { Package, Filter, Eye } from "lucide-react";

import BottomNavigation from "../core/components/BottomNavigation";
import Pagination, { PaginationMeta } from "../components/Pagination";
import { ordersService, OrderDto } from "../services/orders";
import type { OrderPaginationQuery, PaginatedResponse } from "../types/pagination";
import { DEFAULT_PAGINATION } from "../types/pagination";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "text-green-600 bg-green-100";
    case "confirmed":
      return "text-blue-600 bg-blue-100";
    case "cancelled":
      return "text-red-600 bg-red-100";
    default:
      return "text-yellow-600 bg-yellow-100";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "delivered":
      return "Đã giao hàng";
    case "confirmed":
      return "Đã xác nhận";
    case "cancelled":
      return "Đã hủy";
    default:
      return "Chờ xác nhận";
  }
};

function OrdersPage() {
  const navigate = useNavigate();

  // Pagination state
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    page: DEFAULT_PAGINATION.page,
    limit: DEFAULT_PAGINATION.limit,
    total: 0,
    totalPages: 0,
    hasPrevious: false,
    hasNext: false,
  });

  // Filter and search state
  const [query, setQuery] = useState<OrderPaginationQuery>({
    page: DEFAULT_PAGINATION.page,
    limit: DEFAULT_PAGINATION.limit,
    sortOrder: DEFAULT_PAGINATION.sortOrder,
  });

  // UI state
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [detailOpen, setDetailOpen] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDto | null>(null);

  // Load orders with pagination
  const loadOrders = useCallback(async (newQuery: OrderPaginationQuery) => {
    try {
      setLoading(true);
      setError(null);
      
      const response: PaginatedResponse<OrderDto> = await ordersService.getMyOrdersWithPagination(newQuery);
      setOrders(response.data);
      setPaginationMeta(response.meta);
    } catch (e) {
      setError("Không thể tải đơn hàng.");
      setOrders([]);
      setPaginationMeta({
        page: 1,
        limit: DEFAULT_PAGINATION.limit,
        total: 0,
        totalPages: 0,
        hasPrevious: false,
        hasNext: false,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadOrders(query);
  }, [loadOrders]);

  // Reload orders when query changes
  useEffect(() => {
    loadOrders(query);
  }, [query, loadOrders]);

  // Handle pagination
  const handlePageChange = (page: number) => {
    setQuery(prev => ({ ...prev, page }));
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLimitChange = (limit: number) => {
    setQuery(prev => ({ ...prev, limit, page: 1 }));
  };

  // Handle status filter
  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    setQuery(prev => ({
      ...prev,
      status: status !== "all" ? (status as "pending" | "confirmed" | "delivered" | "cancelled") : undefined,
      page: 1,
    }));
    setShowFilters(false);
  };

  // Handle order detail
  const handleViewDetail = (order: OrderDto) => {
    setSelectedOrder(order);
    setDetailOpen(true);
  };

  const statusOptions = [
    { value: "all", label: "Tất cả" },
    { value: "pending", label: "Chờ xác nhận" },
    { value: "confirmed", label: "Đã xác nhận" },
    { value: "delivered", label: "Đã giao hàng" },
    { value: "cancelled", label: "Đã hủy" },
  ];

  return (
    <Page className="bg-gray-50">
      {/* Header */}
      <Header title="Đơn hàng của tôi" className="bg-primary-600" showBackIcon />

      {/* Filters */}
      <Box className="bg-white p-4 shadow-sm">
        <Box className="flex items-center justify-between">
          <Text className="font-medium text-gray-900">
            Tổng: {paginationMeta.total} đơn hàng
          </Text>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="secondary"
            size="small"
            className="flex items-center space-x-1"
          >
            <Filter className="w-4 h-4" />
            <span>Lọc</span>
          </Button>
        </Box>

        {/* Status filters (when expanded) */}
        {showFilters && (
          <Box className="mt-4 pt-4 border-t border-gray-200">
            <Text className="text-sm font-medium text-gray-700 mb-2">Trạng thái:</Text>
            <Box className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <Button
                  key={option.value}
                  onClick={() => handleStatusFilter(option.value)}
                  variant={selectedStatus === option.value ? "primary" : "secondary"}
                  size="small"
                >
                  {option.label}
                </Button>
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {/* Orders Display */}
      <Box className="p-4 space-y-4 mt-[100px]">
        {loading ? (
          <Box className="text-center py-20">
            <Text className="text-gray-500">Đang tải đơn hàng...</Text>
          </Box>
        ) : error ? (
          <Box className="text-center py-20">
            <Text className="text-red-600">{error}</Text>
            <Button
              onClick={() => loadOrders(query)}
              className="mt-4"
              variant="primary"
            >
              Thử lại
            </Button>
          </Box>
        ) : orders.length === 0 ? (
          <Box className="text-center py-20">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <Text className="text-gray-500 text-lg mb-2">
              {query.status ? "Không có đơn hàng nào với trạng thái này" : "Chưa có đơn hàng nào"}
            </Text>
            <Text className="text-gray-400 mb-6">
              {query.status ? "Thử thay đổi bộ lọc" : "Hãy mua sắm để có đơn hàng đầu tiên"}
            </Text>
            {!query.status && (
              <Button
                variant="primary"
                onClick={() => navigate("/products")}
                className="bg-primary-600 hover:bg-primary-700"
              >
                Mua sắm ngay
              </Button>
            )}
          </Box>
        ) : (
          <>
            {orders.map((order) => (
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
                      className={`text-sm font-medium px-2 py-1 rounded-full ${getStatusColor(order.status)}`}
                    >
                      {getStatusLabel(order.status)}
                    </Text>
                    <Button
                      onClick={() => handleViewDetail(order)}
                      size="small"
                      variant="secondary"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
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
                <Box className="border-t pt-3 flex justify-between items-center">
                  <Text className="font-medium text-gray-900">Tổng tiền:</Text>
                  <Text className="text-lg font-bold text-primary-600">
                    {formatPrice(order.totalAmount)}
                  </Text>
                </Box>
              </Box>
            ))}

            {/* Pagination */}
            <Pagination
              meta={paginationMeta}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
              showLimitSelector={true}
            />
          </>
        )}
      </Box>

      {/* Order Detail Modal */}
      {detailOpen && selectedOrder && (
        <Box className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Box className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <Box className="p-4">
              <Box className="flex items-center justify-between mb-4">
                <Text className="text-lg font-semibold">
                  Chi tiết đơn hàng #{selectedOrder.id.slice(-8)}
                </Text>
                <Button
                  onClick={() => setDetailOpen(false)}
                  variant="secondary"
                  size="small"
                >
                  Đóng
                </Button>
              </Box>

              {/* Order info */}
              <Box className="space-y-3">
                <Box>
                  <Text className="text-sm font-medium text-gray-700">Trạng thái:</Text>
                  <Text className={`text-sm px-2 py-1 rounded-full inline-block mt-1 ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusLabel(selectedOrder.status)}
                  </Text>
                </Box>

                <Box>
                  <Text className="text-sm font-medium text-gray-700">Ngày đặt:</Text>
                  <Text className="text-sm text-gray-600">
                    {new Date(selectedOrder.createdAt).toLocaleDateString("vi-VN")}
                  </Text>
                </Box>

                <Box>
                  <Text className="text-sm font-medium text-gray-700">Sản phẩm:</Text>
                  <Box className="space-y-2 mt-1">
                    {selectedOrder.products.map((item, index) => (
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
                </Box>

                <Box className="border-t pt-3">
                  <Box className="flex justify-between">
                    <Text className="font-medium text-gray-900">Tổng tiền:</Text>
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

      {/* Bottom Spacing */}
      <Box className="h-20" />

      {/* Bottom Navigation */}
      <BottomNavigation />
    </Page>
  );
}

export default OrdersPage;
