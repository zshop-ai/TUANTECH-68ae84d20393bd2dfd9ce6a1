import React from 'react';
import { Page, Box, Text, Icon } from 'zmp-ui';
import { useCoreTheme } from '../theme/context';
import Header from './Header';
import Banner from './Banner';
import CategoryGrid from './CategoryGrid';
import ProductCard from './ProductCard';
import type { Product } from '../types/product';
import BottomNavigation from './BottomNavigation';

interface CoreLayoutProps {
  children?: React.ReactNode;
  showHeader?: boolean;
  showBanner?: boolean;
  showCategories?: boolean;
  showFeaturedProducts?: boolean;
  showBottomNavigation?: boolean;
  featuredProducts?: Product[];
  onAddToCart?: (product: Product) => void;
  onViewDetail?: (product: Product) => void;
  onCategoryClick?: (categoryId: string) => void;
  loading?: boolean;
  error?: string | null;
  className?: string;
}

const CoreLayout: React.FC<CoreLayoutProps> = ({
  children,
  showHeader = true,
  showBanner = true,
  showCategories = true,
  showFeaturedProducts = true,
  showBottomNavigation = true,
  featuredProducts = [],
  onAddToCart,
  onViewDetail,
  onCategoryClick,
  loading = false,
  error = null,
  className = ''
}) => {
  const { currentTemplate } = useCoreTheme();
  const { features } = currentTemplate;

  return (
    <Page className={`bg-gray-50 ${className}`}>
      {/* Header */}
      {showHeader && features.showCategories && <Header />}

      {/* Content */}
      <Box className="px-4 space-y-6 pt-4">
        {/* Categories */}
        {showCategories && features.showTrending && (
          <CategoryGrid onCategoryClick={onCategoryClick} />
        )}

        {/* Banner */}
        {showBanner && features.showBanner && <Banner />}

        {/* Featured Products Section */}
        {showFeaturedProducts && features.showFeaturedProducts && (
          <Box className="bg-gradient-to-b from-primary-100 to-primary-600 p-6 -mx-4 px-2">
            <Box className="mb-4 px-4">
              <Text className="text-primary-600 font-semibold text-sm opacity-90">
                SẢN PHẨM HÀNG ĐẦU
              </Text>
              <Text.Title size="large" className="text-primary-700">
                Sản phẩm nổi bật
              </Text.Title>
            </Box>

            {loading ? (
              <Box className="text-center py-8">
                <Text className="text-primary-600 mt-2">
                  Đang tải sản phẩm...
                </Text>
              </Box>
            ) : error ? (
              <Box className="text-center py-8">
                <Icon
                  icon="zi-close-circle"
                  className="w-12 h-12 text-red-400 mx-auto mb-2"
                />
                <Text className="text-red-600 mb-2">Lỗi tải sản phẩm</Text>
                <Text className="text-red-500 text-sm">{error}</Text>
              </Box>
            ) : featuredProducts.length === 0 ? (
              <Box className="text-center py-8">
                <Icon icon="zi-search" className="w-12 h-12 text-primary-400 mx-auto mb-2" />
                <Text className="text-primary-600">
                  Không tìm thấy sản phẩm phù hợp
                </Text>
              </Box>
            ) : (
              <Box className="flex space-x-4 overflow-x-auto px-2 scrollbar-hide">
                {featuredProducts.map((product) => (
                  <Box key={product.id} className="flex-shrink-0 w-64">
                    <Box className="border-4 border-white overflow-hidden">
                      <ProductCard
                        product={product}
                        onAddToCart={onAddToCart}
                        onViewDetail={onViewDetail}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )}

        {/* Custom Content */}
        {children}

        {/* Bottom Spacing */}
        <Box className="h-20" />
      </Box>

      {/* Bottom Navigation */}
      {showBottomNavigation && <BottomNavigation />}
    </Page>
  );
};

export default CoreLayout;
