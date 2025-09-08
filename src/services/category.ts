import { API_CONFIG } from "../config/api";
import { apiGetPublic } from "../utils/api";

// Category types based on backend response
export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

class CategoryService {
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

  async getAllCategories(): Promise<Category[]> {
    const shopId = this.getShopId();
    const url = this.buildUrl(API_CONFIG.ENDPOINTS.CATEGORIES, { shopId });
    return apiGetPublic<Category[]>(url);
  }

  async getCategoryById(id: string): Promise<Category> {
    const shopId = this.getShopId();
    const url = this.buildUrl(API_CONFIG.ENDPOINTS.CATEGORY_DETAIL, {
      shopId,
      id,
    });
    return apiGetPublic<Category>(url);
  }

  // Helper method to transform backend category to frontend format
  transformCategoryForUI(category: Category) {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      color: category.color,
      isActive: category.isActive,
      // Add icon mapping based on category name or color
      icon: this.getCategoryIcon(category.name, category.color),
    };
  }

  private getCategoryIcon(name: string, color: string): string {
    const nameLower = name.toLowerCase();

    if (nameLower.includes("skincare") || nameLower.includes("chăm sóc da")) {
      return "zi-heart";
    } else if (
      nameLower.includes("makeup") ||
      nameLower.includes("trang điểm")
    ) {
      return "zi-star";
    } else if (
      nameLower.includes("haircare") ||
      nameLower.includes("chăm sóc tóc")
    ) {
      return "zi-user";
    } else if (
      nameLower.includes("fragrance") ||
      nameLower.includes("nước hoa")
    ) {
      return "zi-flower";
    } else if (
      nameLower.includes("fashion") ||
      nameLower.includes("thời trang")
    ) {
      return "zi-grid";
    } else {
      return "zi-star"; // Default icon
    }
  }
}

export const categoryService = new CategoryService();
