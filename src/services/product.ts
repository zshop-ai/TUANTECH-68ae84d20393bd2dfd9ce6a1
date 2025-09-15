import { API_CONFIG } from "../config/api";
import { apiGetPublic } from "../utils/api";
import type {
  PaginatedResponse,
  ProductPaginationQuery
} from "../types/pagination";
import { buildProductPaginationQuery } from "../types/pagination";

// Product types based on backend response
export interface ProductVariant {
  sku: string;
  price: number;
  stock: number;
  attributes: Array<{
    name: string;
    value: string;
    displayName: string;
    price: number;
  }>;
  images: string[];
  isActive: boolean;
  sold: number;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  shopId: string;
  name: string;
  description: string;
  code: string;
  slug: string;
  brand_name: string;
  unit_name: string;
  weight: number;
  description_short: string;
  description_full: string;
  video_url: string;
  variants: ProductVariant[];
  categoryIds: string[];
  isActive: boolean;
  isAvailable: boolean;
  isVisible: boolean;
  is_new: boolean;
  is_best_seller: boolean;
  is_featured: boolean;
  can_add_to_cart: boolean;
  can_choose_quantity: boolean;
  can_favorite: boolean;
  allow_custom_note: boolean;
  totalStock: number;
  minPrice: number;
  maxPrice: number;
  image: string;
  image_urls: string[];
  images: string[];
  attributes: any[];
  status: string;
  rating_avg: number;
  rating_count: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductQuery {
  categoryId?: string;
  isActive?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "name" | "price" | "createdAt" | "stock" | "weight" | "rating";
  sortOrder?: "asc" | "desc";
  brand?: string;
  status?: string;
  minWeight?: number;
  maxWeight?: number;
}

export interface ProductMetadata {
  categories: any[];
  brands: string[];
  units: string[];
  commonAttributes: Array<{
    name: string;
    displayName: string;
    values: string[];
  }>;
  success: boolean;
}

class ProductService {
  private getShopId(): string {
    return API_CONFIG.SHOP_ID;
  }

  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    let url = `${API_CONFIG.BASE_URL}${endpoint}`;

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url = url.replace(`:${key}`, value);
      });
    }

    return url;
  }

  async getAllProductsWithPagination(query?: ProductPaginationQuery): Promise<PaginatedResponse<Product>> {
    const shopId = this.getShopId();
    const url = this.buildUrl(API_CONFIG.ENDPOINTS.PRODUCTS, { shopId });

    const queryParams = buildProductPaginationQuery(query || {});
    const fullUrl = queryParams.toString()
      ? `${url}?${queryParams.toString()}`
      : url;

    return apiGetPublic<PaginatedResponse<Product>>(fullUrl);
  }

  async getAllProducts(query?: ProductQuery): Promise<Product[]> {
    const shopId = this.getShopId();
    const url = this.buildUrl(API_CONFIG.ENDPOINTS.PRODUCTS, { shopId });

    const queryParams = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const fullUrl = queryParams.toString()
      ? `${url}/all?${queryParams.toString()}`
      : `${url}/all`;
    return apiGetPublic<Product[]>(fullUrl);
  }

  async getProductById(id: string): Promise<Product> {
    const shopId = this.getShopId();
    const url = this.buildUrl(API_CONFIG.ENDPOINTS.PRODUCT_DETAIL, {
      shopId,
      id,
    });
    return apiGetPublic<Product>(url);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    const shopId = this.getShopId();
    const url = this.buildUrl(API_CONFIG.ENDPOINTS.PRODUCT_FEATURED, {
      shopId,
    });
    return apiGetPublic<Product[]>(url);
  }

  async getNewProducts(): Promise<Product[]> {
    const shopId = this.getShopId();
    const url = this.buildUrl(API_CONFIG.ENDPOINTS.PRODUCT_NEW, { shopId });
    return apiGetPublic<Product[]>(url);
  }

  async getBestSellers(): Promise<Product[]> {
    const shopId = this.getShopId();
    const url = this.buildUrl(API_CONFIG.ENDPOINTS.PRODUCT_BEST_SELLERS, {
      shopId,
    });
    return apiGetPublic<Product[]>(url);
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    const shopId = this.getShopId();
    const url = this.buildUrl(API_CONFIG.ENDPOINTS.PRODUCT_CATEGORY, {
      shopId,
      categoryId,
    });
    return apiGetPublic<Product[]>(url);
  }

  async getProductMetadata(): Promise<ProductMetadata> {
    const shopId = this.getShopId();
    const url = this.buildUrl(API_CONFIG.ENDPOINTS.PRODUCT_METADATA, {
      shopId,
    });
    return apiGetPublic<ProductMetadata>(url);
  }

  // Helper method to transform backend product to frontend format
  transformProductForUI(product: Product) {
    return {
      id: product.id,
      name: product.name,
      brand: product.brand_name,
      category: product.categoryIds[0] || "uncategorized", // Use first category or default
      price: product.minPrice,
      originalPrice:
        product.maxPrice > product.minPrice ? product.maxPrice : undefined,
      description: product.description_short || product.description,
      images:
        product.images.length > 0
          ? product.images
          : product.image
          ? [product.image]
          : [],
      rating: product.rating_avg || 0,
      reviewCount: product.rating_count || 0,
      inStock:
        product.isAvailable &&
        (product.totalStock > 0 ||
          (product.variants && product.variants.some((v) => v.stock > 0))),
      tags: product.attributes?.map((attr) => attr.name) || [],
      features:
        product.attributes?.map((attr) => `${attr.name}: ${attr.value}`) || [],
      // Additional backend fields
      variants: product.variants,
      totalStock: product.totalStock,
      isActive: product.isActive,
      isFeatured: product.is_featured,
      isNew: product.is_new,
      isBestSeller: product.is_best_seller,
      video_url: product.video_url,
    };
  }
}

export const productService = new ProductService();
