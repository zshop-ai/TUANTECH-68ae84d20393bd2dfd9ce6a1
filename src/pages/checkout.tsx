import React, { useEffect, useRef, useState } from "react";
import {
  Page,
  Box,
  Text,
  Button,
  Header,
  useSnackbar,
  Input,
  Spinner,
  Modal,
} from "zmp-ui";
import { useNavigate, useLocation } from "zmp-ui";
import {
  CreditCard,
  Building2,
  Wallet,
  MapPin,
  Phone,
  Building,
  Plus,
  Check,
  ChevronDown,
} from "lucide-react";
import { cartService } from "../services/cart";
import { authService } from "../services/auth";
import { useAddresses } from "../hooks/useAddresses";
import { Address } from "../services/address";

function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { openSnackbar } = useSnackbar();
  const products = location.state?.products || [];
  const mode = location.state?.mode || "from_cart"; // 'buy_now' or 'from_cart'

  // Address management
  const {
    addresses,
    loading: addressesLoading,
    error: addressesError,
    refreshAddresses,
  } = useAddresses();

  // Redirect if no products
  if (products.length === 0) {
    navigate("/");
    return null;
  }

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
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
  const addressWrapRef = useRef<HTMLDivElement>(null!);
  const suppressNextFetchRef = useRef<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  // Auto-select default address when addresses are loaded
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddress =
        addresses.find((addr) => addr.isDefault) || addresses[0];
      setSelectedAddress(defaultAddress);
      setFormData((prev) => ({
        ...prev,
        fullName: defaultAddress.name,
        phone: defaultAddress.phone,
        address: defaultAddress.address,
        city: defaultAddress.city,
      }));
    }
  }, [addresses, selectedAddress]);

  // Keep addressQuery in sync with formData.address
  useEffect(() => {
    setAddressQuery(formData.address || "");
  }, [formData.address]);

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
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
    setFormData((prev) => ({
      ...prev,
      fullName: address.name,
      phone: address.phone,
      address: address.address,
      city: address.city,
    }));
    // Clear any address-related errors
    setErrors((prev) => ({
      ...prev,
      fullName: "",
      phone: "",
      address: "",
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    // Field validations
    const phoneRegex = /^(0|\+84)(\d){9}$/; // VN: 10 digits starting 0 or +84
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const newErrors: { [k: string]: string } = {};

    // Check if address is selected
    if (!selectedAddress) {
      newErrors.address = "Vui lòng chọn địa chỉ giao hàng";
    } else {
      // Validate selected address data
      if (!formData.fullName.trim())
        newErrors.fullName = "Vui lòng nhập họ và tên";
      if (!formData.phone.trim())
        newErrors.phone = "Vui lòng nhập số điện thoại";
      if (!formData.address.trim()) newErrors.address = "Vui lòng nhập địa chỉ";
      if (!newErrors.phone && !phoneRegex.test(formData.phone.trim())) {
        newErrors.phone = "Số điện thoại không hợp lệ";
      }
    }

    if (formData.email && !emailRegex.test(formData.email.trim())) {
      newErrors.email = "Email không hợp lệ";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstField = Object.keys(newErrors)[0];
      const idMap: Record<string, string> = {
        fullName: "input-fullName",
        phone: "input-phone",
        email: "input-email",
        address: "input-address",
      };
      const firstId = idMap[firstField];
      setTimeout(() => document.getElementById(firstId)?.focus(), 0);
      openSnackbar({
        type: "error",
        text: newErrors[firstField] || "Vui lòng kiểm tra thông tin",
        duration: 3000,
      });
      return;
    }

    // Check login state (after field validation so user sees errors first)
    if (!authService.isLoggedIn()) {
      openSnackbar({
        type: "warning",
        text: "Bạn cần đăng nhập để đặt hàng",
        duration: 3000,
      });
      // Delay a bit so the message is visible before navigating
      setTimeout(() => navigate("/profile"), 600);
      return;
    }

    try {
      setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
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

      <Box className="p-4 space-y-6 mt-[65px]">
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

        {/* Address Selection */}
        <Box className="bg-white rounded-lg p-4">
          <Text.Title size="large" className="mb-3">
            Địa chỉ giao hàng
          </Text.Title>

          {addressesLoading && (
            <Box className="flex justify-center py-8">
              <Spinner />
            </Box>
          )}

          {addressesError && (
            <Box className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <Text className="text-red-600 text-center">{addressesError}</Text>
              <Button
                variant="secondary"
                size="small"
                onClick={refreshAddresses}
                className="mt-2 w-full"
              >
                Thử lại
              </Button>
            </Box>
          )}

          {!addressesLoading && !addressesError && addresses.length === 0 ? (
            <Box className="text-center py-8">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <Text className="text-gray-500 mb-4">
                Chưa có địa chỉ giao hàng
              </Text>
              <Button
                variant="secondary"
                onClick={() => navigate("/address")}
                className="border-primary-600 text-primary-600"
              >
                <div className="flex items-center justify-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm địa chỉ
                </div>
              </Button>
            </Box>
          ) : !addressesLoading &&
            !addressesError &&
            addresses.length > 0 &&
            selectedAddress ? (
            <Box className="space-y-3">
              {/* Display selected address */}
              <Box className="p-3 border border-primary-600 bg-primary-50 rounded-lg">
                <Box className="flex items-start justify-between">
                  <Box className="flex-1">
                    <Box className="flex items-center space-x-2 mb-2">
                      <Text className="font-semibold text-gray-900">
                        {selectedAddress.name}
                      </Text>
                      {selectedAddress.isDefault && (
                        <Box className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                          <Text className="text-xs font-medium">Mặc định</Text>
                        </Box>
                      )}
                    </Box>

                    <Box className="space-y-1">
                      <Box className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <Text className="text-gray-600">
                          {selectedAddress.phone}
                        </Text>
                      </Box>
                      <Box className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <Text className="text-gray-900 line-clamp-2 w-full  ">
                          {selectedAddress.address}
                        </Text>
                      </Box>
                      <Box className="flex items-center space-x-2">
                        <Building className="w-4 h-4 text-gray-500" />
                        <Text className="text-gray-600">
                          {selectedAddress.city}
                        </Text>
                      </Box>
                    </Box>
                  </Box>

                  {/* Select different address button */}
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => setShowAddressModal(true)}
                    className="border-primary-600 text-primary-600"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </Box>
              </Box>

              {/* Add new address button */}
              <Button
                variant="secondary"
                fullWidth
                onClick={() => navigate("/address")}
                className="border-primary-600 text-primary-600 border-dashed"
              >
                <div className="flex items-center justify-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm địa chỉ mới
                </div>
              </Button>
            </Box>
          ) : null}

          {/* Additional Information */}
          <Box className="mt-4 space-y-3">
            <Input
              id="input-email"
              label="Email"
              placeholder="Nhập email (không bắt buộc)"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
            {errors.email && (
              <Text className="text-xs text-red-600">{errors.email}</Text>
            )}

            <Input
              label="Ghi chú"
              placeholder="Ghi chú cho đơn hàng (không bắt buộc)"
              value={formData.note}
              onChange={(e) => handleInputChange("note", e.target.value)}
            />
          </Box>

          {errors.address && (
            <Text className="text-xs text-red-600 mt-2">{errors.address}</Text>
          )}
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
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Đang xử lý..."
            : `Đặt hàng - ${formatPrice(calculateTotal())}`}
        </Button>
      </Box>

      {/* Bottom Spacing */}
      <Box className="h-24" />

      {/* Address Selection Modal */}
      <Modal
        visible={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        title="Chọn địa chỉ giao hàng"
        actions={[
          {
            key: "cancel",
            text: "Hủy",
            onClick: () => setShowAddressModal(false),
          },
        ]}
      >
        <Box className="space-y-3">
          {addresses.map((address) => (
            <Box
              key={address.id}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedAddress?.id === address.id
                  ? "border-primary-600 bg-primary-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => {
                handleAddressSelect(address);
                setShowAddressModal(false);
              }}
            >
              <Box className="flex items-start justify-between">
                <Box className="flex-1">
                  <Box className="flex items-center space-x-2 mb-2">
                    <Text className="font-semibold text-gray-900">
                      {address.name}
                    </Text>
                    {address.isDefault && (
                      <Box className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                        <Text className="text-xs font-medium">Mặc định</Text>
                      </Box>
                    )}
                    {selectedAddress?.id === address.id && (
                      <Check className="w-4 h-4 text-primary-600" />
                    )}
                  </Box>

                  <Box className="space-y-1">
                    <Box className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <Text className="text-gray-600">{address.phone}</Text>
                    </Box>
                    <Box className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <Text className="text-gray-900 line-clamp-2 w-full">
                        {address.address}
                      </Text>
                    </Box>
                    <Box className="flex items-center space-x-2">
                      <Building className="w-4 h-4 text-gray-500" />
                      <Text className="text-gray-600">{address.city}</Text>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}

          <Button
            variant="secondary"
            fullWidth
            onClick={() => {
              setShowAddressModal(false);
              navigate("/address");
            }}
            className="border-primary-600 text-primary-600 border-dashed"
          >
            <div className="flex items-center justify-center">
              <Plus className="w-4 h-4 mr-2" />
              Thêm địa chỉ mới
            </div>
          </Button>
        </Box>
      </Modal>
    </Page>
  );
}

export default CheckoutPage;
