import React, { useState } from "react";
import { Page, Box, Text, Button, Header, useSnackbar, Spinner } from "zmp-ui";
import { useNavigate, useLocation } from "zmp-ui";
import { Star, ChevronLeft, ChevronRight, ShoppingCart, X } from "lucide-react";
import { Product } from "../core/types/product";
import { useProductDetail } from "../hooks/useProducts";
import VariantSelector from "../components/VariantSelector";
import type { ProductVariant } from "../core/types/product";
import { cartService } from "../services/cart";
import { Toast } from "../components/Toast";
import ProductMediaViewer from "../components/ProductMediaViewer";

function ProductDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { openSnackbar } = useSnackbar();
  const productFromState = location.state?.product as Product;
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [showImageModal, setShowImageModal] = useState(false);

  // Try to get product ID from state or URL params
  const productId = productFromState?.id || location.pathname.split("/").pop();

  // Use the product detail hook if we have a product ID
  const {
    product: apiProduct,
    loading,
    error,
  } = useProductDetail(productId || "");

  // Use API product if available, otherwise fall back to state product
  const product = apiProduct || productFromState;

  if (!productId && !productFromState) {
    navigate("/");
    return null;
  }

  if (loading) {
    return (
      <Page className="bg-white">
        <Header title="Chi tiết sản phẩm" />
        <Box className="flex items-center justify-center h-64">
          <Spinner />
          <Text className="ml-2">Đang tải...</Text>
        </Box>
      </Page>
    );
  }

  if (error) {
    return (
      <Page className="bg-white">
        <Header title="Chi tiết sản phẩm" />
        <Box className="text-center py-12">
          <Text className="text-red-500 text-lg mb-2">Lỗi tải sản phẩm</Text>
          <Text className="text-red-400 text-sm">{error}</Text>
        </Box>
      </Page>
    );
  }

  if (!product) {
    navigate("/");
    return null;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

 const handleAddToCart = async (variant: ProductVariant, quantity: number) => {
  try {
    if (product.variants && product.variants.length > 0 && !variant) {
      Toast.error(
        "Vui lòng chọn đầy đủ biến thể trước khi thêm vào giỏ",
        3000
      );
      return;
    }

    const attributesMap = variant?.attributes?.length
      ? variant.attributes.reduce((acc: Record<string, string>, attr) => {
          acc[attr.name] = attr.value;
          return acc;
        }, {})
      : undefined;

    // ✅ Lấy trực tiếp từ variant nếu có, nếu không fallback sang product
    const price = variant?.price ?? product.price;
    const discount = variant?.discount ?? 0;
    const discountedPrice = variant?.discountedPrice ?? price;

    await cartService.addItem({
      productId: product.id,
      quantity,
      discount,
      discountedPrice,
      attributes: {
        ...(attributesMap || {}),
        ...(variant?.sku ? { sku: variant.sku } : {}),
      },
    });

    Toast.success(
      `Đã thêm ${quantity} ${product.name}${
        variant?.sku ? ` (${variant.sku})` : ""
      } vào giỏ hàng`,
      2000
    );
  } catch (e: any) {
    Toast.error(e?.message || "Không thể thêm vào giỏ hàng", 3000);
  }
};


  const handleBuyNow = (variant: ProductVariant, quantity: number) => {
    navigate("/checkout", {
      state: {
        products: [
          {
            ...product,
            quantity,
            selectedVariant: variant,
            variantSku: variant.sku,
            variantPrice: variant.price,
          },
        ],
        mode: "buy_now",
      },
    });
  };

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <Page className="bg-white">
      {/* Header */}
      <Header
        title="Chi tiết sản phẩm"
        className="bg-primary-600 text-white"
        showBackIcon
      />

      {/* Product Media Viewer */}
      <Box className="p-4 pt-[100px]">
        <ProductMediaViewer
          images={product.images}
          videoUrl={product.video_url}
          selectedImage={selectedImage}
          onImageChange={setSelectedImage}
          onImageClick={() => setShowImageModal(true)}
        />

        {/* Discount Badge */}
        {discount > 0 && (
          <Box className="absolute top-6 left-6 bg-red-500 text-white px-3 py-1 rounded-md text-sm font-semibold z-10">
            -{discount}%
          </Box>
        )}

        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <Box className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
            <Text className="text-white font-semibold text-lg">Hết hàng</Text>
          </Box>
        )}
      </Box>

      {/* Product Info */}
      <Box className="p-4 space-y-4">
        {/* Brand & Name */}
        <Box>
          <Text className="text-sm text-gray-500 mb-1">{product.brand}</Text>
          <Text.Title size="large" className="mb-2">
            {product.name}
          </Text.Title>
        </Box>

        {/* Rating */}
        <Box className="flex items-center">
          <Box className="flex items-center mr-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </Box>
          <Text className="text-sm text-gray-600">
            {product.rating} ({product.reviewCount} đánh giá)
          </Text>
        </Box>

        {/* Price */}
        <Box className="flex items-center">
          <Text className="text-2xl font-bold text-primary-600">
            {formatPrice(product.price)}
          </Text>
          {product.originalPrice && (
            <Text className="text-lg text-gray-500 line-through ml-3">
              {formatPrice(product.originalPrice)}
            </Text>
          )}
        </Box>

        {/* Description */}
        <Box>
          <Text.Title size="large" className="mb-2">
            Mô tả sản phẩm
          </Text.Title>
          <Text className="text-gray-600 leading-relaxed">
            {product.description}
          </Text>
        </Box>
      

        {/* Divider */}
        <Box className="border-t border-gray-200 my-4" />

        {/* Variant Selector or Simple Quantity Selector */}
        {product.variants && product.variants.length > 0 ? (
          <VariantSelector
            variants={product.variants}
            selectedVariant={selectedVariant}
            onVariantChange={handleVariantChange}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        ) : (
          <Box>
            <Text.Title size="large" className="mb-3">
              Số lượng
            </Text.Title>
            <Box className="flex items-center space-x-4">
              <Button
                variant="secondary"
                size="small"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className="w-10 h-10 rounded-full"
              >
                <ChevronLeft />
              </Button>
              <Text className="text-lg font-semibold min-w-8 text-center">
                {quantity}
              </Text>
              <Button
                variant="secondary"
                size="small"
                onClick={increaseQuantity}
                className="w-10 h-10 rounded-full"
              >
                <ChevronRight />
              </Button>
            </Box>
          </Box>
        )}
      </Box>

      {/* Bottom Action Buttons - Only show if no variants */}
      {(!product.variants || product.variants.length === 0) && (
        <Box className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <Box className="flex space-x-3">
            <Button
              variant="secondary"
              fullWidth
              disabled={!product.inStock}
              onClick={() => handleAddToCart({} as ProductVariant, quantity)}
              className="border-primary-600 text-primary-600 hover:bg-primary-50"
            >
              <ShoppingCart className="mr-2" />
              Thêm vào giỏ
            </Button>
            <Button
              variant="primary"
              fullWidth
              disabled={!product.inStock}
              onClick={() => handleBuyNow({} as ProductVariant, quantity)}
              className="bg-primary-600 hover:bg-primary-700"
            >
              Mua ngay
            </Button>
          </Box>
        </Box>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <Box 
          className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center p-4"
          style={{ zIndex: 9999 }}
          onTouchStart={(e) => {
            const startX = e.touches[0].clientX;
            const startY = e.touches[0].clientY;
            
            const handleTouchMove = (moveEvent: TouchEvent) => {
              const currentX = moveEvent.touches[0].clientX;
              const currentY = moveEvent.touches[0].clientY;
              const diffX = startX - currentX;
              const diffY = startY - currentY;
              
              // Swipe left (next image)
              if (Math.abs(diffX) > Math.abs(diffY) && diffX > 50) {
                setSelectedImage(selectedImage === product.images.length - 1 ? 0 : selectedImage + 1);
                document.removeEventListener('touchmove', handleTouchMove);
                document.removeEventListener('touchend', handleTouchEnd);
              }
              // Swipe right (previous image)
              else if (Math.abs(diffX) > Math.abs(diffY) && diffX < -50) {
                setSelectedImage(selectedImage === 0 ? product.images.length - 1 : selectedImage - 1);
                document.removeEventListener('touchmove', handleTouchMove);
                document.removeEventListener('touchend', handleTouchEnd);
              }
            };
            
            const handleTouchEnd = () => {
              document.removeEventListener('touchmove', handleTouchMove);
              document.removeEventListener('touchend', handleTouchEnd);
            };
            
            document.addEventListener('touchmove', handleTouchMove);
            document.addEventListener('touchend', handleTouchEnd);
          }}
        >
          <Box className="relative max-w-4xl max-h-full w-full h-full flex flex-col">
            {/* Top Bar with Close Button and Counter */}
            <Box className="flex items-center justify-between p-4 pt-[36px]">
              {/* Close Button */}
              <Button
                variant="secondary"
                size="small"
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white"
                onClick={() => setShowImageModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>

              {/* Image Counter - Centered */}
              <Box className="bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
                {selectedImage + 1} / {product.images.length}
              </Box>

              {/* Empty space for balance */}
              <Box className="w-8" />
            </Box>

            {/* Main Image Container */}
            <Box className="flex-1 flex items-center justify-center p-4">
              <img
                src={product.images[selectedImage]}
                alt={`Product image ${selectedImage + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            </Box>

            {/* Thumbnail Navigation */}
            {product.images.length > 1 && (
              <Box className="p-4">
                <Box className="flex space-x-2 overflow-x-auto scrollbar-hide justify-center">
                  {product.images.map((image, index) => (
                    <Box
                      key={index}
                      className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                        selectedImage === index
                          ? "border-white scale-110 shadow-lg"
                          : "border-gray-500 opacity-50 hover:opacity-75"
                      }`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className={`w-full h-full object-cover transition-all duration-200 ${
                          selectedImage === index
                            ? "brightness-100"
                            : "brightness-75"
                        }`}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      )}

      {/* Bottom Spacing */}
      <Box className="h-24" />
    </Page>
  );
}

export default ProductDetailPage;
