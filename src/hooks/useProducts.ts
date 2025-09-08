import { useState, useEffect, useCallback, useMemo } from "react";
import { productService, Product, ProductQuery } from "../services/product";
import { Product as UIProduct } from "../data/products";

interface UseProductsReturn {
  products: UIProduct[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseProductsOptions {
  query?: ProductQuery;
  autoFetch?: boolean;
}

export function useProducts(
  options: UseProductsOptions = {}
): UseProductsReturn {
  const { query, autoFetch = true } = options;
  const [products, setProducts] = useState<UIProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryKey = useMemo(() => JSON.stringify(query ?? {}), [query]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const apiProducts = await productService.getAllProducts(query);
      const transformedProducts = apiProducts.map((product) =>
        productService.transformProductForUI(product)
      );

      setProducts(transformedProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch products");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }, [queryKey]);

  useEffect(() => {
    if (autoFetch) {
      fetchProducts();
    }
  }, [fetchProducts, autoFetch]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
  };
}

interface UseFeaturedProductsReturn {
  products: UIProduct[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useFeaturedProducts(): UseFeaturedProductsReturn {
  const [products, setProducts] = useState<UIProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const apiProducts = await productService.getFeaturedProducts();
      const transformedProducts = apiProducts.map((product) =>
        productService.transformProductForUI(product)
      );

      setProducts(transformedProducts);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch featured products"
      );
      console.error("Error fetching featured products:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
  };
}

interface UseNewProductsReturn {
  products: UIProduct[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useNewProducts(): UseNewProductsReturn {
  const [products, setProducts] = useState<UIProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const apiProducts = await productService.getNewProducts();
      const transformedProducts = apiProducts.map((product) =>
        productService.transformProductForUI(product)
      );

      setProducts(transformedProducts);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch new products"
      );
      console.error("Error fetching new products:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
  };
}

interface UseBestSellersReturn {
  products: UIProduct[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useBestSellers(): UseBestSellersReturn {
  const [products, setProducts] = useState<UIProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const apiProducts = await productService.getBestSellers();
      const transformedProducts = apiProducts.map((product) =>
        productService.transformProductForUI(product)
      );

      setProducts(transformedProducts);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch best sellers"
      );
      console.error("Error fetching best sellers:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
  };
}

interface UseProductDetailReturn {
  product: UIProduct | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProductDetail(productId: string): UseProductDetailReturn {
  const [product, setProduct] = useState<UIProduct | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!productId) return;

    try {
      setLoading(true);
      setError(null);

      const apiProduct = await productService.getProductById(productId);
      const transformedProduct =
        productService.transformProductForUI(apiProduct);

      setProduct(transformedProduct);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch product");
      console.error("Error fetching product:", err);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
  };
}
