import React, { useState } from 'react';
import { 
  Page, 
  Box, 
  Text, 
  Button, 
  Header, 
  useSnackbar
} from 'zmp-ui';
import { useNavigate, useLocation } from 'zmp-ui';
import { Star, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { Product } from '../data/products';

function ProductDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { openSnackbar } = useSnackbar();
  const product = location.state?.product as Product;
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    navigate('/');
    return null;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    openSnackbar({
      type: 'success',
      text: `Đã thêm ${quantity} ${product.name} vào giỏ hàng`,
      duration: 2000,
    });
  };

  const handleBuyNow = () => {
    navigate('/checkout', { state: { products: [{ ...product, quantity }] } });
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
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

      {/* Product Images */}
      <Box className="relative h-80 bg-gray-100">
        <img
          src={product.images[selectedImage]}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {discount > 0 && (
          <Box className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-md text-sm font-semibold">
            -{discount}%
          </Box>
        )}
        {!product.inStock && (
          <Box className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Text className="text-white font-semibold text-lg">Hết hàng</Text>
          </Box>
        )}
      </Box>

      {/* Image Thumbnails */}
      {product.images.length > 1 && (
        <Box className="p-4 bg-gray-50">
          <Box className="flex space-x-2 overflow-x-auto">
            {product.images.map((image, index) => (
              <Box
                key={index}
                className={`w-16 h-16 rounded-lg overflow-hidden cursor-pointer border-2 ${
                  selectedImage === index ? 'border-primary-600' : 'border-gray-200'
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </Box>
            ))}
          </Box>
        </Box>
      )}

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
                className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
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

        {/* Features */}
        <Box>
          <Text.Title size="large" className="mb-2">
            Đặc điểm nổi bật
          </Text.Title>
          <Box className="space-y-2">
            {product.features.map((feature, index) => (
              <Box key={index} className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-primary-600 fill-current" />
                <Text>{feature}</Text>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Tags */}
        <Box>
          <Text.Title size="large" className="mb-2">
            Tags
          </Text.Title>
          <Box className="flex flex-wrap gap-2">
            {product.tags.map((tag, index) => (
              <Box
                key={index}
                className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Divider */}
        <Box className="border-t border-gray-200 my-4" />

        {/* Quantity Selector */}
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
      </Box>

      {/* Bottom Action Buttons */}
      <Box className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <Box className="flex space-x-3">
          <Button
            variant="secondary"
            fullWidth
            disabled={!product.inStock}
            onClick={handleAddToCart}
            className="border-primary-600 text-primary-600 hover:bg-primary-50"
          >
            <ShoppingCart className="mr-2" />
            Thêm vào giỏ
          </Button>
          <Button
            variant="primary"
            fullWidth
            disabled={!product.inStock}
            onClick={handleBuyNow}
            className="bg-primary-600 hover:bg-primary-700"
          >
            Mua ngay
          </Button>
        </Box>
      </Box>

      {/* Bottom Spacing */}
      <Box className="h-24" />
    </Page>
  );
}

export default ProductDetailPage;
