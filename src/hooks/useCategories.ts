import { useState, useEffect, useCallback } from "react";
import { categoryService, Category } from "../services/category";

export interface UICategory {
  id: string;
  name: string;
  description: string;
  color: string;
  isActive: boolean;
  icon: string;
}

interface UseCategoriesReturn {
  categories: UICategory[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCategories(): UseCategoriesReturn {
  const [categories, setCategories] = useState<UICategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const apiCategories = await categoryService.getAllCategories();
      const transformedCategories = apiCategories.map((category) =>
        categoryService.transformCategoryForUI(category)
      );

      setCategories(transformedCategories);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch categories"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
}

interface UseCategoryDetailReturn {
  category: UICategory | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCategoryDetail(categoryId: string): UseCategoryDetailReturn {
  const [category, setCategory] = useState<UICategory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategory = useCallback(async () => {
    if (!categoryId) return;

    try {
      setLoading(true);
      setError(null);

      const apiCategory = await categoryService.getCategoryById(categoryId);
      const transformedCategory =
        categoryService.transformCategoryForUI(apiCategory);

      setCategory(transformedCategory);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch category");
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchCategory();
  }, [fetchCategory]);

  return {
    category,
    loading,
    error,
    refetch: fetchCategory,
  };
}
