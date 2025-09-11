import React, { useEffect, useState } from "react";
import { Page, Box, Text, Button, Header, useSnackbar, List } from "zmp-ui";
import { useNavigate } from "zmp-ui";
import { ChevronLeft, ChevronRight, Trash2, ShoppingCart } from "lucide-react";
import BottomNavigation from "../core/components/BottomNavigation";
import CustomCheckbox from "../components/CustomCheckbox";
import { cartService } from "../services/cart";

type BackendCartItem = {
  productId:
    | {
        _id: string;
        name: string;
        images?: string[];
        minPrice?: number;
        brand?: string;
      }
    | string;
  quantity: number;
  price?: number;
  attributes?: Record<string, string>;
};

type CartUIItem = {
  id: string;
  product: {
    id: string;
    name: string;
    brand?: string;
    price: number;
    originalPrice?: number;
    images: string[];
  };
  quantity: number;
  attributes?: Record<string, string>;
};

function CartPage() {
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const [cartItems, setCartItems] = useState<CartUIItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const normalizeItem = (item: BackendCartItem): CartUIItem => {
    const product: any =
      typeof item.productId === "string"
        ? { _id: item.productId }
        : item.productId;
    return {
      id: product._id,
      product: {
        id: product._id,
        name: product.name,
        brand: product.brand,
        price: item.price ?? product.minPrice ?? 0,
        originalPrice: undefined,
        images: product.images || [],
      },
      quantity: item.quantity,
      // pass through attributes into a display-friendly field
      attributes: item.attributes || {},
    };
  };

  const fetchCart = async () => {
    try {
      const data: any = await cartService.getCart();
      const items: CartUIItem[] = (data?.items || []).map(normalizeItem);
      setCartItems(items);
      // Tự động chọn tất cả sản phẩm khi load giỏ hàng
      setSelectedItems(new Set(items.map((item) => item.id)));
    } catch (e) {
      console.error(e);
    }
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === cartItems.length) {
      // Bỏ chọn tất cả
      setSelectedItems(new Set());
    } else {
      // Chọn tất cả
      setSelectedItems(new Set(cartItems.map((item) => item.id)));
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    // Đảm bảo số lượng tối thiểu là 1
    if (newQuantity < 1) {
      newQuantity = 1;
    }

    console.log(`Updating quantity for item ${itemId} to ${newQuantity}`);

    // Cập nhật local state trước để có UX tốt hơn
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );

    try {
      const result = await cartService.updateQuantity({
        productId: itemId,
        quantity: newQuantity,
      });
      console.log("Update quantity result:", result);

      // Không cần refresh cart nếu API thành công
      // Local state đã được cập nhật và API đã confirm
    } catch (e) {
      console.error("Error updating quantity:", e);

      // Chỉ revert local state nếu API call thất bại
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? { ...item, quantity: Math.max(1, item.quantity) } // Revert về giá trị hợp lệ
            : item
        )
      );

      openSnackbar({
        type: "error",
        text: "Có lỗi xảy ra khi cập nhật số lượng",
        duration: 2000,
      });
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await cartService.removeItem(itemId);
      await fetchCart();
      openSnackbar({
        type: "success",
        text: "Đã xóa sản phẩm khỏi giỏ hàng",
        duration: 2000,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      if (selectedItems.has(item.id)) {
        return total + item.product.price * item.quantity;
      }
      return total;
    }, 0);
  };

  const calculateDiscount = () => {
    return cartItems.reduce((total, item) => {
      if (selectedItems.has(item.id) && item.product.originalPrice) {
        return (
          total +
          (item.product.originalPrice - item.product.price) * item.quantity
        );
      }
      return total;
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 0 ? subtotal + 30000 : 0; // Shipping fee chỉ tính khi có sản phẩm được chọn
  };

  const getSelectedItems = () => {
    return cartItems.filter((item) => selectedItems.has(item.id));
  };

  const handleCheckout = () => {
    const selectedProducts = getSelectedItems();
    if (selectedProducts.length === 0) {
      openSnackbar({
        type: "error",
        text: "Vui lòng chọn ít nhất một sản phẩm để thanh toán",
        duration: 2000,
      });
      return;
    }

    navigate("/checkout", {
      state: {
        products: selectedProducts,
        mode: "from_cart",
      },
    });
  };

  if (cartItems.length === 0) {
    return (
      <Page className="bg-gray-50">
        {/* Header */}
        <Header title="Giỏ hàng" className="bg-primary-600" showBackIcon />

        {/* Empty Cart */}
        <Box className="flex flex-col items-center justify-center py-20 px-4">
          <ShoppingCart className="w-20 h-20 text-gray-300 mb-4" />
          <Text.Title size="large" className="mb-2 text-gray-600">
            Giỏ hàng trống
          </Text.Title>
          <Text className="text-gray-500 text-center mb-6">
            Bạn chưa có sản phẩm nào trong giỏ hàng
          </Text>
          <Button
            variant="primary"
            onClick={() => navigate("/")}
            className="bg-primary-600 hover:bg-primary-700"
          >
            Mua sắm ngay
          </Button>
        </Box>
      </Page>
    );
  }

  return (
    <Page className="bg-gray-50">
      {/* Header */}
      <Header
        title={`Giỏ hàng (${cartItems.length})`}
        className="bg-primary-600"
        showBackIcon
      />

      {/* Select All */}
      <Box className="bg-white border-b border-gray-200 p-4 mt-[100px]">
        <Box className="flex items-center justify-between">
          <Box className="flex items-center space-x-3">
            <CustomCheckbox
              checked={
                selectedItems.size === cartItems.length && cartItems.length > 0
              }
              onChange={toggleSelectAll}
              size="medium"
            />
            <Text className="font-medium text-gray-900">
              Chọn tất cả ({selectedItems.size}/{cartItems.length})
            </Text>
          </Box>
        </Box>
      </Box>

      {/* Cart Items */}
      <Box className="p-4 space-y-4">
        {cartItems.map((item) => (
          <Box key={item.id} className="bg-white rounded-lg p-4 shadow-sm">
            <Box className="flex space-x-3">
              {/* Checkbox */}
              <Box className="flex items-start pt-2">
                <CustomCheckbox
                  checked={selectedItems.has(item.id)}
                  onChange={() => toggleItemSelection(item.id)}
                  size="medium"
                />
              </Box>

              {/* Product Image */}
              <Box className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </Box>

              {/* Product Info */}
              <Box className="flex-1 min-w-0">
                <Text className="text-sm text-gray-500 mb-1">
                  {item.product.brand}
                </Text>
                <Text className="font-medium text-gray-900 mb-2 line-clamp-2">
                  {item.product.name}
                </Text>

                {/* Variant Attributes */}
                {item.attributes && Object.keys(item.attributes).length > 0 && (
                  <Box className="mb-2">
                    <Text className="text-xs text-gray-500">
                      {Object.entries(item.attributes)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(" • ")}
                    </Text>
                  </Box>
                )}

                {/* Price */}
                <Box className="flex items-center mb-3">
                  <Text className="text-lg font-bold text-primary-600">
                    {formatPrice(item.product.price)}
                  </Text>
                  {item.product.originalPrice && (
                    <Text className="text-sm text-gray-500 line-through ml-2">
                      {formatPrice(item.product.originalPrice)}
                    </Text>
                  )}
                </Box>

                {/* Quantity Controls */}
                <Box className="flex items-center justify-between mt-3">
                  <Box className="flex items-center bg-gray-100 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className={`w-8 h-8 flex items-center justify-center rounded-l-lg transition-colors ${
                        item.quantity <= 1
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-200"
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>
                    <Text className="font-semibold px-3 py-2 min-w-12 text-center text-gray-900">
                      {item.quantity}
                    </Text>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-r-lg transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    </button>
                  </Box>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Order Summary */}
      <Box className="bg-white border-t border-gray-200 p-4 space-y-3">
        <Text.Title size="large">
          Tóm tắt đơn hàng ({selectedItems.size} sản phẩm)
        </Text.Title>

        <Box className="space-y-2">
          <Box className="flex justify-between">
            <Text className="text-gray-600">Tạm tính:</Text>
            <Text>{formatPrice(calculateSubtotal())}</Text>
          </Box>
          <Box className="flex justify-between">
            <Text className="text-gray-600">Giảm giá:</Text>
            <Text className="text-green-600">
              -{formatPrice(calculateDiscount())}
            </Text>
          </Box>
          <Box className="flex justify-between">
            <Text className="text-gray-600">Phí vận chuyển:</Text>
            <Text>{formatPrice(30000)}</Text>
          </Box>
        </Box>

        {/* Divider */}
        <Box className="border-t border-gray-200 my-4" />

        <Box className="flex justify-between">
          <Text.Title size="large">Tổng cộng:</Text.Title>
          <Text.Title size="large" className="text-primary-600">
            {formatPrice(calculateTotal())}
          </Text.Title>
        </Box>

        <Button
          variant="primary"
          fullWidth
          onClick={handleCheckout}
          disabled={selectedItems.size === 0}
          className={`${
            selectedItems.size === 0
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-primary-600 hover:bg-primary-700"
          }`}
        >
          {selectedItems.size === 0
            ? "Chọn sản phẩm để thanh toán"
            : `Tiến hành thanh toán (${selectedItems.size} sản phẩm)`}
        </Button>
      </Box>

      {/* Bottom Spacing */}
      <Box className="h-20" />

      {/* Bottom Navigation */}
      <BottomNavigation />
    </Page>
  );
}

export default CartPage;
