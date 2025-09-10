import React from 'react';
import { useSnackbar } from 'zmp-ui';
import { useNavigate } from 'zmp-ui';
import CoreLayout from '../core/components/CoreLayout';
import { useProducts } from '../core/hooks/useProducts';
import TemplateSelector from '../core/components/TemplateSelector';

function HomePage() {
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const { featuredProducts, loading, error } = useProducts();

  const handleAddToCart = (product: any, variant?: any, quantity?: number) => {
    const message = variant
      ? `Đã thêm ${quantity || 1} ${product.name} (${variant.sku}) vào giỏ hàng`
      : `Đã thêm ${product.name} vào giỏ hàng`;

    openSnackbar({
      type: "success",
      text: message,
      duration: 2000,
    });
  };

  const handleViewDetail = (product: any) => {
    navigate("/product-detail", { state: { product } });
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate('/products', { state: { category: categoryId } });
  };

  return (
    <CoreLayout
      featuredProducts={featuredProducts}
      onAddToCart={handleAddToCart}
      onViewDetail={handleViewDetail}
      onCategoryClick={handleCategoryClick}
      loading={loading}
      error={error}
    >
      {/* Template Selector for development */}
      <TemplateSelector />
    </CoreLayout>
  );
}

export default HomePage;
