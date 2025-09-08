import React, { useState, useMemo, useMemo as useReactMemo } from "react";
import { Page, Box, Text, Button, Header, useSnackbar, Spinner } from "zmp-ui";
import { useNavigate } from "zmp-ui";
import { Search, Star } from "lucide-react";

import ProductCard from "../components/ProductCard";
import BottomNavigation from "../components/BottomNavigation";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Get categories from API
  const { categories: apiCategories, loading: categoriesLoading } =
    useCategories();

  // Create categories list with "All" option
  const categories = [
    { id: "all", name: "Tất cả", icon: "zi-grid" },
    ...apiCategories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
    })),
  ];

  // Use the products hook with API integration
  const query = useReactMemo(
    () => ({
      search: searchQuery || undefined,
      categoryId: selectedCategory !== "all" ? selectedCategory : undefined,
      isActive: true,
    }),
    [searchQuery, selectedCategory]
  );

  const { products, loading, error } = useProducts({ query });

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [products, selectedCategory, searchQuery]);

  const handleAddToCart = (product: any, variant?: any, quantity?: number) => {
    const message = variant
      ? `Đã thêm ${quantity || 1} ${product.name} (${variant.sku}) vào giỏ hàng`
      : `Đã thêm ${product.name} vào giỏ hàng`;

    openSnackbar({
      text: message,
      type: "success",
    });
  };

  const handleViewDetail = (product: any) => {
    navigate("/product-detail", { state: { product } });
  };

  return (
    <Page className="bg-gray-50">
      {/* Header */}
      <Header title="Sản phẩm" className="bg-primary-600" showBackIcon />

      {/* Content */}
      <Box className="px-4 space-y-4 pt-4 pb-20 mt-[100px]">
        {/* Search Bar */}
        <Box className="bg-white rounded-lg p-3 shadow-sm">
          <Box className="flex items-center">
            <Search className="w-5 h-5 text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-gray-900 placeholder-gray-400 outline-none"
            />
          </Box>
        </Box>

        {/* Category Filter */}
        <Box className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((category) => (
            <Box
              key={category.id}
              className={`flex-shrink-0 px-4 py-2 rounded-full cursor-pointer transition-colors ${
                selectedCategory === category.id
                  ? "bg-primary-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200"
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <Text className="text-sm font-medium whitespace-nowrap">
                {category.name}
              </Text>
            </Box>
          ))}
        </Box>

        {/* Products Grid */}
        {loading ? (
          <Box className="text-center py-12">
            <Spinner />
            <Text className="text-gray-500 text-lg mt-4">
              Đang tải sản phẩm...
            </Text>
          </Box>
        ) : error ? (
          <Box className="text-center py-12">
            <Search className="w-16 h-16 text-red-300 mx-auto mb-4" />
            <Text className="text-red-500 text-lg mb-2">Lỗi tải sản phẩm</Text>
            <Text className="text-red-400 text-sm">{error}</Text>
          </Box>
        ) : filteredProducts.length === 0 ? (
          <Box className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <Text className="text-gray-500 text-lg mb-2">
              Không tìm thấy sản phẩm
            </Text>
            <Text className="text-gray-400">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </Text>
          </Box>
        ) : (
          <Box className="grid grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onViewDetail={handleViewDetail}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Bottom Spacing */}
      <Box className="h-20" />

      {/* Bottom Navigation */}
      <BottomNavigation currentPage="products" />
    </Page>
  );
};

export default ProductsPage;
