import React, { useEffect, useState } from "react";
import { Page, Box, Text, Button, Header, useSnackbar, List } from "zmp-ui";
import { useNavigate } from "zmp-ui";
import { ChevronLeft, ChevronRight, Trash2, ShoppingCart } from "lucide-react";
import BottomNavigation from "../components/BottomNavigation";
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
    } catch (e) {
      console.error(e);
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
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }
    try {
      await cartService.updateQuantity({
        productId: itemId,
        quantity: newQuantity,
      });
      await fetchCart();
    } catch (e) {
      console.error(e);
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
      return total + item.product.price * item.quantity;
    }, 0);
  };

  const calculateDiscount = () => {
    return cartItems.reduce((total, item) => {
      if (item.product.originalPrice) {
        return (
          total +
          (item.product.originalPrice - item.product.price) * item.quantity
        );
      }
      return total;
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + 30000; // Shipping fee
  };

  const handleCheckout = () => {
    navigate("/checkout", { state: { products: cartItems } });
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

      {/* Cart Items */}
      <Box className="p-4 space-y-4 mt-[100px]">
        {cartItems.map((item) => (
          <Box key={item.id} className="bg-white rounded-lg p-4 shadow-sm">
            <Box className="flex space-x-3">
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
                <Box className="flex items-center justify-between">
                  <Box className="flex items-center space-x-3">
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full"
                    >
                      <ChevronLeft className="w-3 h-3" />
                    </Button>
                    <Text className="font-semibold min-w-8 text-center">
                      {item.quantity}
                    </Text>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full"
                    >
                      <ChevronRight className="w-3 h-3" />
                    </Button>
                  </Box>

                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Order Summary */}
      <Box className="bg-white border-t border-gray-200 p-4 space-y-3">
        <Text.Title size="large">Tóm tắt đơn hàng</Text.Title>

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
          className="bg-primary-600 hover:bg-primary-700"
        >
          Tiến hành thanh toán
        </Button>
      </Box>

      {/* Bottom Spacing */}
      <Box className="h-20" />

      {/* Bottom Navigation */}
      <BottomNavigation currentPage="cart" />
    </Page>
  );
}

export default CartPage;
