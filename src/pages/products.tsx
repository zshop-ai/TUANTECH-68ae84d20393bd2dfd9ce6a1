import React, { useState, useEffect, useCallback } from 'react';
import { 
  Page, 
  Box, 
  Text, 
  Button, 
  Header, 
  useSnackbar,
  Input
} from 'zmp-ui';
import { useNavigate } from 'zmp-ui';
import { Search, Star, Filter, Grid, List } from 'lucide-react';

import ProductCard from '../core/components/ProductCard';
import BottomNavigation from '../core/components/BottomNavigation';
import Pagination, { PaginationMeta } from '../components/Pagination';
import { productService } from '../services/product';
import type { Product as ServiceProduct } from '../services/product';
import type { Product as UIProduct } from '../core/types/product';
import type { ProductPaginationQuery, PaginatedResponse } from '../types/pagination';
import { DEFAULT_PAGINATION } from '../types/pagination';

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();

  // Pagination state
  const [products, setProducts] = useState<ServiceProduct[]>([]);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    page: DEFAULT_PAGINATION.page,
    limit: DEFAULT_PAGINATION.limit,
    total: 0,
    totalPages: 0,
    hasPrevious: false,
    hasNext: false,
  });

  // Filter and search state
  const [query, setQuery] = useState<ProductPaginationQuery>({
    page: DEFAULT_PAGINATION.page,
    limit: DEFAULT_PAGINATION.limit,
    sortOrder: DEFAULT_PAGINATION.sortOrder,
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Categories for filtering
  const [categories] = useState([
    { id: "skincare", name: "Chăm sóc da" },
    { id: "makeup", name: "Trang điểm" },
    { id: "fragrance", name: "Nước hoa" },
    { id: "haircare", name: "Chăm sóc tóc" },
  ]);

  // Convert ServiceProduct to UIProduct
  const convertToUIProduct = (serviceProduct: ServiceProduct): UIProduct => {
    return {
      id: serviceProduct.id,
      name: serviceProduct.name,
      brand: serviceProduct.brand_name || 'Unknown',
      category: serviceProduct.categoryIds?.[0] || 'general',
      price: serviceProduct.minPrice || 0,
      originalPrice: serviceProduct.maxPrice !== serviceProduct.minPrice ? serviceProduct.maxPrice : undefined,
      description: serviceProduct.description_short || serviceProduct.description,
      images: serviceProduct.variants?.[0]?.images || [],
      rating: 4.5, // Default rating since not available in service
      reviewCount: 0, // Default review count
      inStock: serviceProduct.totalStock > 0,
      tags: [], // Default empty tags
      features: [], // Default empty features
      variants: serviceProduct.variants,
      totalStock: serviceProduct.totalStock,
      isActive: serviceProduct.isActive,
      isNew: serviceProduct.is_new,
      isBestSeller: serviceProduct.is_best_seller,
      isFeatured: serviceProduct.is_featured,
      video_url: serviceProduct.video_url,
    };
  };

  // Load products with pagination
  const loadProducts = useCallback(async (newQuery: ProductPaginationQuery) => {
    try {
      setLoading(true);
      setError(null);

      const response: PaginatedResponse<ServiceProduct> = await productService.getAllProductsWithPagination(newQuery);
      setProducts(response.data);
      setPaginationMeta(response.meta);
    } catch (err) {
      setError("Không thể tải sản phẩm. Vui lòng thử lại.");
      setProducts([]);
      setPaginationMeta({
        page: 1,
        limit: DEFAULT_PAGINATION.limit,
        total: 0,
        totalPages: 0,
        hasPrevious: false,
        hasNext: false,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadProducts(query);
  }, [loadProducts]);

  // Reload products when query changes
  useEffect(() => {
    loadProducts(query);
  }, [query, loadProducts]);

  // Handle pagination
  const handlePageChange = (page: number) => {
    setQuery(prev => ({ ...prev, page }));
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLimitChange = (limit: number) => {
    setQuery(prev => ({ ...prev, limit, page: 1 }));
  };

  // Handle search
  const handleSearch = () => {
    setQuery(prev => ({
      ...prev,
      search: searchTerm.trim() || undefined,
      page: 1,
    }));
  };

  // Handle category filter
  const handleCategoryFilter = (categoryId: string) => {
    setQuery(prev => ({
      ...prev,
      categoryId: categoryId || undefined,
      page: 1,
    }));
  };

  // Handle sort
  const handleSort = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    setQuery(prev => ({
      ...prev,
      sortBy,
      sortOrder,
      page: 1,
    }));
  };

  // Handle product actions
  const handleAddToCart = (product: UIProduct, variant?: any, quantity?: number) => {
    const message = variant
      ? `Đã thêm ${quantity || 1} ${product.name} (${variant.sku}) vào giỏ hàng`
      : `Đã thêm ${product.name} vào giỏ hàng`;

    openSnackbar({
      text: message,
      type: "success",
    });
  };

  const handleViewDetail = (product: UIProduct) => {
    navigate("/product-detail", { state: { product } });
  };

  return (
    <Page className="bg-gray-50">
      {/* Header */}
      <Header title="Sản phẩm" className="bg-primary-600" showBackIcon />

      {/* Search and Filters */}
      <Box className="bg-white p-4 shadow-sm">
        {/* Search bar */}
        <Box className="relative mb-4">
          <Input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Button
            onClick={handleSearch}
            size="small"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            Tìm
          </Button>
        </Box>

        {/* Filter buttons */}
        <Box className="flex items-center justify-between">
          <Box className="flex items-center space-x-2">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="secondary"
              size="small"
              className="flex items-center space-x-1"
            >
              <Filter className="w-4 h-4" />
              <span>Bộ lọc</span>
            </Button>
            
            {/* Sort buttons */}
            <Button
              onClick={() => handleSort('price', query.sortOrder === 'asc' ? 'desc' : 'asc')}
              variant="secondary"
              size="small"
            >
              Giá {query.sortBy === 'price' && (query.sortOrder === 'asc' ? '↑' : '↓')}
            </Button>
            
            <Button
              onClick={() => handleSort('createdAt', query.sortOrder === 'asc' ? 'desc' : 'asc')}
              variant="secondary"
              size="small"
            >
              Mới nhất {query.sortBy === 'createdAt' && (query.sortOrder === 'asc' ? '↑' : '↓')}
            </Button>
          </Box>

          {/* View mode toggle */}
          <Box className="flex border border-gray-300 rounded">
            <Button
              onClick={() => setViewMode("grid")}
              variant={viewMode === "grid" ? "primary" : "secondary"}
              size="small"
              className="rounded-r-none"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => setViewMode("list")}
              variant={viewMode === "list" ? "primary" : "secondary"}
              size="small"
              className="rounded-l-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </Box>
        </Box>

        {/* Category filters (when expanded) */}
        {showFilters && (
          <Box className="mt-4 pt-4 border-t border-gray-200">
            <Text className="text-sm font-medium text-gray-700 mb-2">Danh mục:</Text>
            <Box className="flex flex-wrap gap-2">
              <Button
                onClick={() => handleCategoryFilter("")}
                variant={!query.categoryId ? "primary" : "secondary"}
                size="small"
              >
                Tất cả
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  onClick={() => handleCategoryFilter(category.id)}
                  variant={query.categoryId === category.id ? "primary" : "secondary"}
                  size="small"
                >
                  {category.name}
                </Button>
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {/* Results info */}
      <Box className="bg-white px-4 py-2 border-b border-gray-200">
        <Text className="text-sm text-gray-600">
          {loading ? "Đang tải..." : `Hiển thị ${products.length} trong tổng số ${paginationMeta.total} sản phẩm`}
        </Text>
      </Box>

      {/* Products Display */}
      <Box className="p-4 space-y-4 mt-[100px]">
        {loading ? (
          <Box className="text-center py-20">
            <Text className="text-gray-500">Đang tải sản phẩm...</Text>
          </Box>
        ) : error ? (
          <Box className="text-center py-20">
            <Text className="text-red-600">{error}</Text>
            <Button
              onClick={() => loadProducts(query)}
              className="mt-4"
              variant="primary"
            >
              Thử lại
            </Button>
          </Box>
        ) : products.length === 0 ? (
          <Box className="text-center py-20">
            <Text className="text-gray-500 text-lg mb-2">
              {query.search ? "Không tìm thấy sản phẩm phù hợp" : "Chưa có sản phẩm nào"}
            </Text>
            <Text className="text-gray-400">
              {query.search ? "Thử tìm kiếm với từ khóa khác" : "Sản phẩm sẽ được cập nhật sớm"}
            </Text>
          </Box>
        ) : (
          <>
            {viewMode === "grid" ? (
              <Box className="grid grid-cols-2 gap-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={convertToUIProduct(product)}
                    onAddToCart={handleAddToCart}
                    onViewDetail={handleViewDetail}
                  />
                ))}
              </Box>
            ) : (
              <Box className="space-y-4">
                {products.map((product) => (
                  <Box
                    key={product.id}
                    className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                  >
                    <Box className="flex space-x-4">
                      {/* Product image */}
                      <Box className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0">
                        {product.variants?.[0]?.images?.[0] && (
                          <img
                            src={product.variants[0].images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        )}
                      </Box>
                      
                      {/* Product info */}
                      <Box className="flex-1 min-w-0">
                        <Text className="font-medium text-gray-900 truncate">
                          {product.name}
                        </Text>
                        <Text className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {product.description_short || product.description}
                        </Text>
                        <Box className="flex items-center justify-between mt-2">
                          <Text className="text-lg font-bold text-primary-600">
                            ₫{product.minPrice?.toLocaleString('vi-VN')}
                          </Text>
                          <Button
                            onClick={() => handleAddToCart(convertToUIProduct(product))}
                            size="small"
                            variant="primary"
                          >
                            Thêm
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}

            {/* Pagination */}
            <Pagination
              meta={paginationMeta}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
              showLimitSelector={true}
            />
          </>
        )}
      </Box>

      {/* Bottom Spacing */}
      <Box className="h-20" />

      {/* Bottom Navigation */}
      <BottomNavigation />
    </Page>
  );
};

export default ProductsPage;
