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
import { Search, Star, Filter } from 'lucide-react';

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
      <Box className="bg-white p-4 shadow-sm mt-[100px]">
        {/* Search bar */}
      <Box className="relative mb-4">
        <Input
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          className="w-full pr-10" // chừa khoảng trống bên phải cho icon
          clearable
        />
        <button
          onClick={handleSearch}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-600 text-white rounded-md px-3 py-1 flex items-center space-x-1 hover:bg-primary-700 transition"
        >
          <Search className="w-4 h-4" />
          <span className="text-sm">Tìm</span>
        </button>
      </Box>


        {/* Filter buttons */}
        <Box className="space-y-4">
          {/* Main filter row */}
          <Box className="flex items-center justify-between">
            <Box className="flex items-center space-x-3">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="secondary"
                size="small"
                className={`!flex !items-center !space-x-3 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  showFilters 
                    ? 'bg-primary-600 text-white border-primary-600' 
                    : 'border-2 border-primary-200 text-primary-700 hover:bg-primary-50 hover:border-primary-300'
                }`}
              >
                <Filter className="w-4 h-4 !inline-block !mr-2" />
                <span className="!inline-block">Bộ lọc</span>
              </Button>
              
              {/* Sort buttons */}
              <Button
                onClick={() => handleSort('price', query.sortOrder === 'asc' ? 'desc' : 'asc')}
                variant="secondary"
                size="small"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  query.sortBy === 'price'
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'border-2 border-primary-200 text-primary-700 hover:bg-primary-50 hover:border-primary-300'
                }`}
              >
                Giá {query.sortBy === 'price' && (query.sortOrder === 'asc' ? '↑' : '↓')}
              </Button>
              
              <Button
                onClick={() => handleSort('createdAt', query.sortOrder === 'asc' ? 'desc' : 'asc')}
                variant="secondary"
                size="small"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  query.sortBy === 'createdAt'
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'border-2 border-primary-200 text-primary-700 hover:bg-primary-50 hover:border-primary-300'
                }`}
              >
                Mới nhất {query.sortBy === 'createdAt' && (query.sortOrder === 'asc' ? '↑' : '↓')}
              </Button>
            </Box>

          </Box>
        </Box>

        {/* Category filters (when expanded) */}
        {showFilters && (
          <Box className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <Text className="text-sm font-semibold text-gray-800 mb-4 flex items-center">
              <Filter className="w-4 h-4 mr-2 text-primary-600" />
              Bộ lọc danh mục
            </Text>
            <Box className="flex flex-wrap gap-3">
              <Button
                onClick={() => handleCategoryFilter("")}
                variant={!query.categoryId ? "primary" : "secondary"}
                size="small"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  !query.categoryId 
                    ? 'bg-primary-600 text-white' 
                    : 'border-2 border-primary-200 text-primary-700 hover:bg-primary-50 hover:border-primary-300'
                }`}
              >
                Tất cả
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  onClick={() => handleCategoryFilter(category.id)}
                  variant={query.categoryId === category.id ? "primary" : "secondary"}
                  size="small"
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    query.categoryId === category.id 
                      ? 'bg-primary-600 text-white' 
                      : 'border-2 border-primary-200 text-primary-700 hover:bg-primary-50 hover:border-primary-300'
                  }`}
                >
                  {category.name}
                </Button>
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {/* Results info */}
      <Box className="bg-white px-4 py-3 border-b border-gray-200">
        <Text className="text-sm text-gray-600 font-medium">
          {loading ? "Đang tải..." : `Hiển thị ${products.length} trong tổng số ${paginationMeta.total} sản phẩm`}
        </Text>
      </Box>

      {/* Products Display */}
      <Box className="p-4 space-y-4">
        {loading ? (
          <Box className="text-center py-20">
            <Text className="text-gray-500">Đang tải sản phẩm...</Text>
          </Box>
        ) : error ? (
          <Box className="text-center py-20">
            <Text className="text-red-600">{error}</Text>
            <Button
              onClick={() => loadProducts(query)}
              className="mt-4 bg-primary-600 hover:bg-primary-700"
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
        )}

        {/* Pagination */}
        <Pagination
          meta={paginationMeta}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          showLimitSelector={true}
        />
      </Box>

      {/* Bottom Spacing */}
      <Box className="h-20" />

      {/* Bottom Navigation */}
      <BottomNavigation />
    </Page>
  );
};

export default ProductsPage;
