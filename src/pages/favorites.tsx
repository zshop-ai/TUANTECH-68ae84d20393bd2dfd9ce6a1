import React, { useState, useEffect } from 'react';
import { 
  Page, 
  Box, 
  Text, 
  Button, 
  Header
} from 'zmp-ui';
import { useNavigate } from 'zmp-ui';
import { Heart, Star, ShoppingCart, Trash2 } from 'lucide-react';

function FavoritesPage() {
  const navigate = useNavigate();

  // Mock favorites data for different users
  const mockFavoritesData = [
    // User 1: Nguyễn Thị Anh
    [
      {
        id: '1',
        name: 'Kem dưỡng ẩm chống lão hóa',
        brand: 'Green Beauty',
        price: 450000,
        originalPrice: 550000,
        rating: 4.8,
        reviewCount: 1250,
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
        inStock: true
      },
      {
        id: '2',
        name: 'Son môi lì bền màu',
        brand: 'Luxe Beauty',
        price: 320000,
        originalPrice: 380000,
        rating: 4.6,
        reviewCount: 890,
        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop',
        inStock: true
      },
      {
        id: '3',
        name: 'Sữa rửa mặt dịu nhẹ',
        brand: 'Nature',
        price: 280000,
        rating: 4.7,
        reviewCount: 650,
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
        inStock: false
      }
    ],
    // User 2: Trần Văn Minh
    [
      {
        id: '4',
        name: 'Kem chống nắng SPF 50+',
        brand: 'SunSafe',
        price: 250000,
        rating: 4.9,
        reviewCount: 2100,
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
        inStock: true
      },
      {
        id: '5',
        name: 'Serum vitamin C',
        brand: 'Bright Skin',
        price: 220000,
        originalPrice: 280000,
        rating: 4.5,
        reviewCount: 750,
        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop',
        inStock: true
      }
    ],
    // User 3: Lê Thị Hương
    [
      {
        id: '6',
        name: 'Bộ chăm sóc da cao cấp',
        brand: 'Luxe Beauty',
        price: 1200000,
        originalPrice: 1500000,
        rating: 4.9,
        reviewCount: 3200,
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
        inStock: true
      },
      {
        id: '7',
        name: 'Bộ trang điểm chuyên nghiệp',
        brand: 'Pro Makeup',
        price: 1800000,
        rating: 4.7,
        reviewCount: 1800,
        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop',
        inStock: true
      },
      {
        id: '8',
        name: 'Kem dưỡng ẩm chống lão hóa',
        brand: 'Green Beauty',
        price: 450000,
        originalPrice: 550000,
        rating: 4.8,
        reviewCount: 1250,
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
        inStock: true
      },
      {
        id: '9',
        name: 'Serum vitamin C',
        brand: 'Bright Skin',
        price: 220000,
        originalPrice: 280000,
        rating: 4.5,
        reviewCount: 750,
        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop',
        inStock: true
      },
      {
        id: '10',
        name: 'Kem chống nắng SPF 50+',
        brand: 'SunSafe',
        price: 250000,
        rating: 4.9,
        reviewCount: 2100,
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
        inStock: true
      }
    ],
    // User 4: Phạm Hoàng Nam
    [
      {
        id: '11',
        name: 'Kem dưỡng ẩm chống lão hóa',
        brand: 'Green Beauty',
        price: 450000,
        originalPrice: 550000,
        rating: 4.8,
        reviewCount: 1250,
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
        inStock: true
      },
      {
        id: '12',
        name: 'Son môi lì bền màu',
        brand: 'Luxe Beauty',
        price: 320000,
        originalPrice: 380000,
        rating: 4.6,
        reviewCount: 890,
        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop',
        inStock: true
      }
    ]
  ];

  // For demo, we'll use a simple counter to cycle through users
  const [userIndex, setUserIndex] = useState(0);
  const favorites = mockFavoritesData[userIndex];

  // Simulate user change (in real app, this would come from context/state management)
  useEffect(() => {
    const interval = setInterval(() => {
      setUserIndex((prev) => (prev + 1) % mockFavoritesData.length);
    }, 10000); // Change user every 10 seconds for demo
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleAddToCart = (product: any) => {
    // Mock add to cart
    console.log('Added to cart:', product.name);
  };

  const handleRemoveFavorite = (productId: string) => {
    // Mock remove from favorites
    console.log('Removed from favorites:', productId);
  };

  const handleViewDetail = (product: any) => {
    navigate('/product-detail', { state: { product } });
  };

  return (
    <Page className="bg-gray-50">
      <Header 
        title="Sản phẩm yêu thích"
        className="bg-primary-600"
        showBackIcon
      />

      <Box className="p-4 space-y-4 mt-[100px]">
        {favorites.length === 0 ? (
          <Box className="text-center py-20">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <Text className="text-gray-500 text-lg mb-2">Chưa có sản phẩm yêu thích</Text>
            <Text className="text-gray-400 mb-6">Hãy thêm sản phẩm vào danh sách yêu thích</Text>
            <Button
              variant="primary"
              onClick={() => navigate('/products')}
              className="bg-primary-600 hover:bg-primary-700"
            >
              Khám phá sản phẩm
            </Button>
          </Box>
        ) : (
          favorites.map((product) => (
            <Box key={product.id} className="bg-white rounded-lg p-4 shadow-sm">
              <Box className="flex space-x-3">
                {/* Product Image */}
                <Box 
                  className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                  onClick={() => handleViewDetail(product)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </Box>

                {/* Product Info */}
                <Box className="flex-1 min-w-0">
                  <Text className="text-sm text-gray-500 mb-1">
                    {product.brand}
                  </Text>
                  <Text 
                    className="font-medium text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-primary-600"
                    onClick={() => handleViewDetail(product)}
                  >
                    {product.name}
                  </Text>

                  {/* Rating */}
                  <Box className="flex items-center mb-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <Text className="text-xs text-gray-500">
                      {product.rating} ({product.reviewCount})
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

                  {/* Action Buttons */}
                  <Box className="flex space-x-2">
                    <Button
                      variant="secondary"
                      size="small"
                      disabled={!product.inStock}
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 border-primary-600 text-primary-600"
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      {product.inStock ? 'Thêm vào giỏ' : 'Hết hàng'}
                    </Button>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleRemoveFavorite(product.id)}
                      className="border-red-500 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))
        )}
      </Box>
    </Page>
  );
}

export default FavoritesPage;
