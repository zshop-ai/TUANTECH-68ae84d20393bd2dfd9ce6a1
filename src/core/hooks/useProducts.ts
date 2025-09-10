import { useState, useMemo, useEffect, useCallback } from 'react';
import { useCoreTheme } from '../theme/context';
import { productService, Product as APIProduct, ProductQuery } from '../../services/product';
import { categoryService, Category as APICategory } from '../../services/category';
import { Product as UIProduct } from '../types/product';

export const useProducts = () => {
  const { currentTemplate } = useCoreTheme();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [allProducts, setAllProducts] = useState<UIProduct[]>([]);
  const [categories, setCategories] = useState<Array<{id: string, name: string, icon: string}>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const query: ProductQuery = {
        search: searchQuery || undefined,
        categoryId: selectedCategory !== 'all' ? selectedCategory : undefined,
        isActive: true,
      };

      const apiProducts = await productService.getAllProducts(query);
      const transformedProducts = apiProducts.map((product) =>
        productService.transformProductForUI(product)
      );

      setAllProducts(transformedProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    try {
      const apiCategories = await categoryService.getAllCategories();
      const transformedCategories = apiCategories.map((category) => {
        const transformed = categoryService.transformCategoryForUI(category);
        return {
          id: transformed.id,
          name: transformed.name,
          icon: transformed.icon
        };
      });
      setCategories(transformedCategories);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }, []);

  // Fetch featured products
  const fetchFeaturedProducts = useCallback(async () => {
    try {
      const apiProducts = await productService.getFeaturedProducts();
      const transformedProducts = apiProducts.map((product) =>
        productService.transformProductForUI(product)
      );
      return transformedProducts;
    } catch (err) {
      console.error('Failed to fetch featured products:', err);
      return [];
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Filter products based on category and search (client-side filtering as fallback)
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    // Filter by category (if not already filtered by API)
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search query (if not already filtered by API)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [allProducts, selectedCategory, searchQuery]);

  // Get featured products
  const featuredProducts = useMemo(() => {
    return allProducts.slice(0, 6);
  }, [allProducts]);

  return {
    allProducts,
    filteredProducts,
    featuredProducts,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    loading,
    error,
    refetch: fetchProducts,
  };
};
