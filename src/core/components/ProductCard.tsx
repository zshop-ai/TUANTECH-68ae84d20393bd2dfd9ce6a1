import React from 'react';
import { Box, Text, Icon, Button } from 'zmp-ui';
import { useCoreTheme } from '../theme/context';
import { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onViewDetail?: (product: Product) => void;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  onViewDetail,
  className = ''
}) => {
  const { currentTemplate } = useCoreTheme();
  const { layout } = currentTemplate;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const getCardClasses = () => {
    const baseClasses = 'bg-white shadow-sm border border-gray-100 overflow-hidden';
    
    switch (layout.cardStyle) {
      case 'modern':
        return `${baseClasses} rounded-lg hover:shadow-lg transition-shadow`;
      case 'classic':
        return `${baseClasses} rounded-none border-2`;
      case 'minimal':
        return `${baseClasses} rounded-none shadow-none border-0`;
      default:
        return `${baseClasses} rounded-lg hover:shadow-lg transition-shadow`;
    }
  };

  return (
    <Box className={`${getCardClasses()} ${className}`}>
      {/* Product Image */}
      <Box 
        className="relative h-48 bg-gray-100 cursor-pointer"
        onClick={() => onViewDetail?.(product)}
      >
        <img 
          src={product.images[0]} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {discount > 0 && (
          <Box className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
            -{discount}%
          </Box>
        )}
        {!product.inStock && (
          <Box className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Text className="text-white font-semibold">Hết hàng</Text>
          </Box>
        )}
      </Box>

      {/* Product Info */}
      <Box className="p-3">
        <Text className="text-xs text-gray-500 mb-1">{product.brand}</Text>
        <Text 
          className="font-medium text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-primary-600"
          onClick={() => onViewDetail?.(product)}
        >
          {product.name}
        </Text>

        {/* Rating */}
        <Box className="flex items-center mb-2">
          <Icon 
            icon="zi-star-solid"
            className="w-4 h-4 text-yellow-400 mr-1 mb-2"
          />
          <Text className="text-xs text-gray-500 ml-3">
            {product.rating.toFixed(1)} ({product.reviewCount})
          </Text>
        </Box>

        {/* Price */}
        <Box className="flex items-center mb-3">
          <Text className="text-lg font-bold text-primary-600">
            {formatPrice(product.price)}
          </Text>
          {product.originalPrice && (
            <Text className="text-sm text-gray-500 line-through ml-2">
              {formatPrice(product.originalPrice)}
            </Text>
          )}
        </Box>

        {/* Add to Cart Button */}
        <Button
          variant="primary"
          size="small"
          fullWidth
          disabled={!product.inStock}
          onClick={() => onAddToCart?.(product)}
          className="bg-primary-600 hover:bg-primary-700"
        >
          {product.inStock ? 'Thêm vào giỏ' : 'Hết hàng'}
        </Button>
      </Box>
    </Box>
  );
};

export default ProductCard;
