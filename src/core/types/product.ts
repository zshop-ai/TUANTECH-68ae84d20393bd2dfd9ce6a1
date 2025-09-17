export interface ProductVariant {
  sku: string;
  price: number;
  stock: number;
  discount: number;
  discountedPrice: number;
  attributes: Array<{
    name: string;
    value: string;
    displayName: string;
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
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  tags: string[];
  features: string[];
  // Additional fields from API
  variants?: ProductVariant[];
  totalStock?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  video_url?: string;
}
