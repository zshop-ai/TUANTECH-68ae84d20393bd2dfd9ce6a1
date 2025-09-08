import React, { useState, useMemo, useMemo as useReactMemo } from "react";
import { Page, Box, Text, Button, Icon, useSnackbar, Spinner } from "zmp-ui";
import { useNavigate } from "zmp-ui";

import ProductCard from "../components/ProductCard";
import BottomNavigation from "../components/BottomNavigation";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import logo from "../static/cosmetic.png";

function HomePage() {
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

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
  const { categories, loading: categoriesLoading } = useCategories();

  // Filter products based on category and search (client-side filtering as fallback)
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by category (if not already filtered by API)
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category.toLowerCase() === selectedCategory
      );
    }

    // Filter by search query (if not already filtered by API)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [products, selectedCategory, searchQuery]);

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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Page className="bg-gray-50">
      {/* Custom Header */}
      <Box className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 text-white pt-12 pb-8 px-4 relative overflow-hidden">
        {/* Background Pattern */}
        <Box className="absolute inset-0 opacity-10">
          <Box className="absolute top-4 right-4 w-20 h-20 bg-white rounded-full"></Box>
          <Box className="absolute bottom-8 left-8 w-16 h-16 bg-white rounded-full"></Box>
          <Box className="absolute top-1/2 right-1/4 w-12 h-12 bg-white rounded-full"></Box>
        </Box>

        <Box className="relative z-10">
          <Box className="flex items-center justify-between mb-6">
            <Box className="flex items-center">
              <img
                src={logo}
                alt="Veridian Bloom"
                className="w-14 h-14 mr-4 rounded-full shadow-lg"
              />
              <Box>
                <Text.Title size="large" className="text-white font-bold">
                  Veridian Bloom
                </Text.Title>
                <Text className="text-white/80 text-sm">Nature's Embrace</Text>
              </Box>
            </Box>
          </Box>

          {/* Welcome Message */}
          <Box className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <Text className="text-white font-semibold mb-1">
              Chào mừng bạn trở lại! 👋
            </Text>
            <Text className="text-white/80 text-sm">
              Khám phá bộ sưu tập mới nhất của chúng tôi
            </Text>
          </Box>
        </Box>
      </Box>

      {/* Content */}
      <Box className="px-4 space-y-6 pt-4">
        {/* Trending Categories */}
        <Box className="space-y-4 py-4">
          <Box className="flex items-center justify-between">
            <Text className="text-lg font-bold text-gray-900">
              🔥 Trending Now
            </Text>
            <Text className="text-primary-600 text-sm font-medium">
              Xem tất cả
            </Text>
          </Box>

          <Box className="flex space-x-3 overflow-x-auto scrollbar-hide px-1 pb-2">
            <Box className="flex-shrink-0">
              <Box className="bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl p-4 w-32 h-32 flex flex-col justify-between cursor-pointer">
                <Box className="text-white">
                  <Text className="font-bold text-lg">Glow</Text>
                  <Text className="text-white/80 text-sm">Skincare</Text>
                </Box>
                <Box className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Icon icon="zi-star-solid" className="w-4 h-4 text-white" />
                </Box>
              </Box>
            </Box>

            <Box className="flex-shrink-0">
              <Box className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl p-4 w-32 h-32 flex flex-col justify-between cursor-pointer">
                <Box className="text-white">
                  <Text className="font-bold text-lg">Beauty</Text>
                  <Text className="text-white/80 text-sm">Makeup</Text>
                </Box>
                <Box className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Icon icon="zi-star-solid" className="w-4 h-4 text-white" />
                </Box>
              </Box>
            </Box>

            <Box className="flex-shrink-0">
              <Box className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-4 w-32 h-32 flex flex-col justify-between cursor-pointer">
                <Box className="text-white">
                  <Text className="font-bold text-lg">Fresh</Text>
                  <Text className="text-white/80 text-sm">Natural</Text>
                </Box>
                <Box className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Icon icon="zi-star-solid" className="w-4 h-4 text-white" />
                </Box>
              </Box>
            </Box>

            <Box className="flex-shrink-0">
              <Box className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl p-4 w-32 h-32 flex flex-col justify-between cursor-pointer">
                <Box className="text-white">
                  <Text className="font-bold text-lg">Vital</Text>
                  <Text className="text-white/80 text-sm">Wellness</Text>
                </Box>
                <Box className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Icon icon="zi-star-solid" className="w-4 h-4 text-white" />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Promotional Banner */}
        <Box className="relative overflow-hidden h-56 -mx-4">
          <img
            src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=500&fit=crop&crop=center"
            alt="Veridian Bloom Banner"
            className="w-full h-full object-cover"
          />
          <Box className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20 flex items-center justify-between p-6">
            <Box className="text-white">
              <Text className="text-2xl font-bold mb-1">VERIDIAN BLOOM</Text>
              <Text className="text-lg opacity-90">NATURE'S EMBRACE</Text>
              <Text className="text-sm opacity-80 mt-2">
                Thành phần tự nhiên 100%
              </Text>
            </Box>
            <Button
              variant="primary"
              className="bg-white text-primary-600 hover:bg-gray-100 font-semibold"
              onClick={() => navigate("/home")}
            >
              SHOP NOW
            </Button>
          </Box>
        </Box>

        {/* Featured Products Section */}
        <Box className="bg-gradient-to-b from-primary-100 to-primary-600 p-6 -mx-4 px-2">
          <Box className="mb-4 px-4">
            <Text className="text-primary-600 font-semibold text-sm opacity-90">
              MỸ PHẨM HÀNG ĐẦU
            </Text>
            <Text.Title size="large" className="text-primary-700">
              Sản phẩm nổi bật
            </Text.Title>
          </Box>

          {loading ? (
            <Box className="text-center py-8">
              <Spinner />
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
          ) : filteredProducts.length === 0 ? (
            <Box className="text-center py-8">
              <Icon
                icon="zi-search"
                className="w-12 h-12 text-primary-400 mx-auto mb-2"
              />
              <Text className="text-primary-600">
                Không tìm thấy sản phẩm phù hợp
              </Text>
            </Box>
          ) : (
            <Box className="flex space-x-4 overflow-x-auto px-2 scrollbar-hide">
              {filteredProducts.map((product) => (
                <Box key={product.id} className="flex-shrink-0 w-64">
                  <Box className="border-4 border-white overflow-hidden">
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                      onViewDetail={handleViewDetail}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Bottom Spacing */}
        <Box className="h-20" />
      </Box>

      {/* Bottom Navigation */}
      <BottomNavigation currentPage="home" />
    </Page>
  );
}

export default HomePage;
