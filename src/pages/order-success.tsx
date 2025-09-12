import { Page, Box, Text, Button, Header } from "zmp-ui";
import { useNavigate, useLocation } from "zmp-ui";
import { CheckCircle } from "lucide-react";

function OrderSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;
  const orderId = location.state?.orderId;

  const formatCurrency = (n?: number) =>
    typeof n === "number"
      ? new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(n)
      : "Đang cập nhật";

  const getStatusText = (status?: string) => {
    switch (status) {
      case "delivered":
        return "Đã giao hàng";
      case "confirmed":
        return "Đang xử lý";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Chờ xác nhận";
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "delivered":
        return "text-green-600";
      case "confirmed":
        return "text-blue-600";
      case "cancelled":
        return "text-red-600";
      default:
        return "text-amber-600";
    }
  };

  return (
    <Page className="bg-gray-50">
      <Header title="Đặt hàng thành công" className="bg-white shadow-sm" />

      <Box
        className="px-4 pt-6 mt-[60px]"
        style={{
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 112px)",
        }}
      >
        <Box className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <Box className="flex items-center gap-4 mb-4">
            <Box className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-green-600" />
            </Box>
            <Box>
              <Text.Title size="large" className="text-gray-900">
                Đặt hàng thành công
              </Text.Title>
              <Text className="text-gray-500">
                Cảm ơn bạn đã mua sắm tại Veridian Bloom
              </Text>
            </Box>
          </Box>

          <Box className="grid grid-cols-2 gap-3 mb-4">
            <Box className="bg-gray-50 rounded-lg p-3">
              <Text className="text-xs text-gray-500">Mã đơn hàng</Text>
              <Text className="font-semibold">
                #{orderId || "Đang cập nhật"}
              </Text>
            </Box>
            <Box className="bg-gray-50 rounded-lg p-3">
              <Text className="text-xs text-gray-500">Ngày đặt</Text>
              <Text className="font-semibold">
                {order?.createdAt
                  ? new Date(order.createdAt).toLocaleDateString("vi-VN")
                  : new Date().toLocaleDateString("vi-VN")}
              </Text>
            </Box>
            <Box className="bg-gray-50 rounded-lg p-3">
              <Text className="text-xs text-gray-500">Trạng thái</Text>
              <Text
                className={`font-semibold ${getStatusColor(order?.status)}`}
              >
                {getStatusText(order?.status)}
              </Text>
            </Box>
            <Box className="bg-gray-50 rounded-lg p-3">
              <Text className="text-xs text-gray-500">Tổng tiền</Text>
              <Text className="font-semibold text-primary-600">
                {formatCurrency(order?.totalAmount)}
              </Text>
            </Box>
          </Box>

          <Box className="mt-4">
            <Text className="text-sm text-gray-600 mb-2">
              Thông tin người nhận
            </Text>
            <Box className="rounded-lg border border-gray-100 p-3">
              <Text className="font-medium text-gray-900">
                {order?.customerName || "Khách hàng"}
              </Text>
              <Text className="text-gray-600">
                {order?.customerPhone || "Số điện thoại"}
              </Text>
              <Text className="text-gray-600">
                {order?.customerAddress || "Địa chỉ"}
              </Text>
            </Box>
          </Box>
        </Box>

        <Box
          className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-50"
          style={{
            paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 8px)",
          }}
        >
          <Box className="grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => navigate("/orders")}
              className="border-gray-300 text-gray-900"
            >
              Đơn hàng của tôi
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={() => navigate("/")}
              className="bg-primary-600 hover:bg-primary-700"
            >
              Tiếp tục mua sắm
            </Button>
          </Box>
        </Box>
      </Box>
    </Page>
  );
}

export default OrderSuccessPage;
