import React, { useEffect, useRef, useState } from "react";
import { Page, Box, Text, Button, Header, useSnackbar, Input } from "zmp-ui";
import { useNavigate, useLocation } from "zmp-ui";
import { CreditCard, Building2, Wallet } from "lucide-react";
import { cartService } from "../services/cart";
import { locationService, type LocationPrediction } from "../services/location";

function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { openSnackbar } = useSnackbar();
  const products = location.state?.products || [];
  const mode = location.state?.mode || "from_cart"; // 'buy_now' or 'from_cart'

  // Redirect if no products
  if (products.length === 0) {
    navigate("/");
    return null;
  }

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    district: "",
    paymentMethod: "cod",
    note: "",
  });

  // Location autocomplete states
  const [addressQuery, setAddressQuery] = useState("");
  const [suggestions, setSuggestions] = useState<LocationPrediction[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const addressWrapRef = useRef<HTMLDivElement>(null!);
  const suppressNextFetchRef = useRef<boolean>(false);

  // Keep addressQuery in sync with formData.address
  useEffect(() => {
    setAddressQuery(formData.address || "");
  }, [formData.address]);

  // Debounced fetch for address suggestions
  useEffect(() => {
    const controller = new AbortController();

    if (suppressNextFetchRef.current) {
      suppressNextFetchRef.current = false;
      return;
    }

    if (!addressQuery || addressQuery.trim().length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsLoadingSuggestions(true);
        const res = await locationService.autocomplete(addressQuery.trim());
        setSuggestions(res.predictions || []);
        setShowSuggestions(true);
      } catch (_) {
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [addressQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        addressWrapRef.current &&
        !addressWrapRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const calculateSubtotal = () => {
    return products.reduce((total: number, item: any) => {
      const product = item.product || item;
      const productPrice = item.variantPrice || product.price;
      return total + productPrice * item.quantity;
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + 30000; // Shipping fee
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    // Validate form
    if (!formData.fullName || !formData.phone || !formData.address) {
      openSnackbar({
        type: "error",
        text: "Vui lòng điền đầy đủ thông tin bắt buộc",
        duration: 3000,
      });
      return;
    }

    try {
      const customerInfo = {
        customerName: formData.fullName,
        customerPhone: formData.phone,
        customerEmail: formData.email || undefined,
        address: formData.address,
        paymentMethod: formData.paymentMethod || "cod",
        shippingFee: 30000, // Fixed shipping fee as per your backend
        notes: formData.note,
      };

      let checkoutPayload;

      if (mode === "buy_now") {
        // For buy now, we expect a single product with variant info
        const product = products[0];
        const variant = product.selectedVariant || {};
        checkoutPayload = cartService.createBuyNowPayload(
          product,
          variant,
          product.quantity || 1,
          customerInfo
        );
      } else {
        // For from_cart, use all products
        checkoutPayload = cartService.createFromCartPayload(
          products,
          customerInfo
        );
      }

      const response = await cartService.checkout(checkoutPayload);
      const order = response.order;

      openSnackbar({
        type: "success",
        text: "Đặt hàng thành công! Chúng tôi sẽ liên hệ sớm nhất",
        duration: 3000,
      });

      // Navigate to order success page with order details
      navigate("/order-success", {
        state: {
          order: order,
          orderId: order?.id || order?._id,
        },
      });
    } catch (e: any) {
      console.error("Checkout error:", e);
      openSnackbar({
        type: "error",
        text: e?.message || "Đặt hàng thất bại. Vui lòng thử lại.",
        duration: 3000,
      });
    }
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

          {products.map((item: any, index: number) => {
            // Handle different product structures (with/without variants)
            const product = item.product || item;
            const productImages = product.images || [];
            const productPrice = item.variantPrice || product.price;
            const variantInfo = item.selectedVariant
              ? ` (${item.variantSku || item.selectedVariant.sku})`
              : "";

            return (
              <Box key={index} className="flex items-center space-x-3 mb-3">
                <Box className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={productImages[0] || "/placeholder-image.png"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </Box>
                <Box className="flex-1 min-w-0">
                  <Text className="font-medium text-gray-900 line-clamp-1">
                    {product.name}
                    {variantInfo}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    Số lượng: {item.quantity}
                  </Text>
                  {item.selectedVariant && (
                    <Text className="text-xs text-gray-400">
                      SKU: {item.variantSku || item.selectedVariant.sku}
                    </Text>
                  )}
                </Box>
                <Text className="font-semibold text-primary-600">
                  {formatPrice(productPrice * item.quantity)}
                </Text>
              </Box>
            );
          })}

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
              onChange={(e) => handleInputChange("fullName", e.target.value)}
            />

            <Input
              label="Số điện thoại *"
              placeholder="Nhập số điện thoại"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />

            <Input
              label="Email"
              placeholder="Nhập email (không bắt buộc)"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />

            <Box className="relative" ref={addressWrapRef}>
              <Input
                label="Địa chỉ *"
                placeholder="Nhập địa chỉ giao hàng"
                value={formData.address}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                onChange={(e) => handleInputChange("address", e.target.value)}
              />

              {showSuggestions &&
                (suggestions.length > 0 || isLoadingSuggestions) && (
                  <Box className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-md max-h-64 overflow-auto">
                    {isLoadingSuggestions && (
                      <Box className="p-3 text-sm text-gray-500">
                        Đang tải gợi ý...
                      </Box>
                    )}

                    {!isLoadingSuggestions &&
                      suggestions.map((s) => {
                        const main =
                          s.structured_formatting?.main_text || s.description;
                        const secondary =
                          s.structured_formatting?.secondary_text || "";
                        return (
                          <Box
                            key={s.place_id}
                            className="px-3 py-2 cursor-pointer hover:bg-gray-50"
                            // Prevent input from losing focus while selecting
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              suppressNextFetchRef.current = true;
                              handleInputChange("address", s.description);
                              setShowSuggestions(false);
                              setSuggestions([]);
                              const inputEl =
                                addressWrapRef.current?.querySelector(
                                  "input"
                                ) as HTMLInputElement | null;
                              inputEl?.blur();
                            }}
                          >
                            <Text className="text-gray-900 text-sm">
                              {main}
                            </Text>
                            {secondary && (
                              <Text className="text-gray-500 text-xs">
                                {secondary}
                              </Text>
                            )}
                          </Box>
                        );
                      })}
                  </Box>
                )}
            </Box>
            <Input
              label="Ghi chú"
              placeholder="Ghi chú cho đơn hàng (không bắt buộc)"
              value={formData.note}
              onChange={(e) => handleInputChange("note", e.target.value)}
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
                formData.paymentMethod === "cod"
                  ? "border-primary-600 bg-primary-50"
                  : "border-gray-200"
              }`}
              onClick={() => handleInputChange("paymentMethod", "cod")}
            >
              <Box className="flex items-center space-x-3">
                <Wallet className="w-5 h-5 text-primary-600" />
                <Box>
                  <Text className="font-medium">
                    Thanh toán khi nhận hàng (COD)
                  </Text>
                  <Text className="text-sm text-gray-500">
                    Thanh toán bằng tiền mặt khi nhận hàng
                  </Text>
                </Box>
              </Box>
            </Box>

            <Box
              className={`p-3 border rounded-lg cursor-pointer ${
                formData.paymentMethod === "bank"
                  ? "border-primary-600 bg-primary-50"
                  : "border-gray-200"
              }`}
              onClick={() => handleInputChange("paymentMethod", "bank")}
            >
              <Box className="flex items-center space-x-3">
                <Building2 className="w-5 h-5 text-primary-600" />
                <Box>
                  <Text className="font-medium">Chuyển khoản ngân hàng</Text>
                  <Text className="text-sm text-gray-500">
                    Chuyển khoản qua tài khoản ngân hàng
                  </Text>
                </Box>
              </Box>
            </Box>

            <Box
              className={`p-3 border rounded-lg cursor-pointer ${
                formData.paymentMethod === "momo"
                  ? "border-primary-600 bg-primary-50"
                  : "border-gray-200"
              }`}
              onClick={() => handleInputChange("paymentMethod", "momo")}
            >
              <Box className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-primary-600" />
                <Box>
                  <Text className="font-medium">Ví MoMo</Text>
                  <Text className="text-sm text-gray-500">
                    Thanh toán qua ví MoMo
                  </Text>
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
