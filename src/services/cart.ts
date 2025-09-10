import { API_CONFIG } from "../config/api";
import { apiDelete, apiGet, apiPost } from "../utils/api";
import { authService } from "./auth";

const GUEST_USER_ID = "68b00ed59cf44607992bf4c7";

function getEffectiveUserId(): string {
  const user = authService.getCurrentUser?.();
  return user?.id || GUEST_USER_ID;
}

function withUserId(url: string): string {
  const userId = getEffectiveUserId();
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}userId=${encodeURIComponent(userId)}`;
}

export type CartItemAttributes = Record<string, any>;

export interface AddToCartPayload {
  productId: string;
  quantity: number;
  attributes?: CartItemAttributes;
}

export interface UpdateQuantityPayload {
  productId: string;
  quantity: number;
}

export interface CheckoutItem {
  productId: string;
  variant: {
    sku: string;
    name: string;
    price: number;
    stock: number;
  };
  quantity: number;
}

export interface CheckoutPayload {
  mode: "buy_now" | "from_cart";
  shopId: string;
  items: CheckoutItem[];
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address?: string;
  paymentMethod?: string;
  shippingFee?: number;
  notes?: string;
}

export const cartService = {
  async getCart() {
    const url = withUserId(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CART_BASE}`
    );
    return apiGet(url);
  },

  async addItem(payload: AddToCartPayload) {
    const url = withUserId(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CART_ITEMS}`
    );
    return apiPost(url, payload);
  },

  async updateQuantity(payload: UpdateQuantityPayload) {
    const base = `${
      API_CONFIG.BASE_URL
    }${API_CONFIG.ENDPOINTS.CART_ITEM.replace(
      ":productId",
      payload.productId
    )}`;
    const url = withUserId(base);
    return apiPost(url, { quantity: payload.quantity, _method: "PATCH" });
  },

  async removeItem(productId: string) {
    const base = `${
      API_CONFIG.BASE_URL
    }${API_CONFIG.ENDPOINTS.CART_ITEM.replace(":productId", productId)}`;
    const url = withUserId(base);
    return apiDelete(url);
  },

  async clear() {
    const url = withUserId(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CART_CLEAR}`
    );
    return apiDelete(url);
  },

  async checkout(payload: CheckoutPayload) {
    const url = withUserId(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CART_CHECKOUT}`
    );
    return apiPost(url, payload);
  },

  // Helper function to create checkout payload for buy now
  createBuyNowPayload(
    product: any,
    variant: any,
    quantity: number,
    customerInfo: {
      customerName: string;
      customerPhone: string;
      customerEmail?: string;
      address?: string;
      paymentMethod?: string;
      shippingFee?: number;
      notes?: string;
    }
  ): CheckoutPayload {
    return {
      mode: "buy_now",
      shopId: API_CONFIG.SHOP_ID,
      items: [
        {
          productId: product.id,
          variant: {
            sku: variant?.sku || variant?.id || "default",
            name: variant?.name || product.name,
            price: variant?.price || product.price,
            stock: variant?.stock || 999, // Will be validated by backend
          },
          quantity,
        },
      ],
      ...customerInfo,
    };
  },

  // Helper function to create checkout payload from cart
  createFromCartPayload(
    cartItems: any[],
    customerInfo: {
      customerName: string;
      customerPhone: string;
      customerEmail?: string;
      address?: string;
      paymentMethod?: string;
      shippingFee?: number;
      notes?: string;
    }
  ): CheckoutPayload {
    const items: CheckoutItem[] = cartItems.map((item) => ({
      productId: item.product.id,
      variant: {
        sku: item.attributes?.sku || item.attributes?.variantId || "default",
        name: item.attributes?.variantName || item.product.name,
        price: item.product.price,
        stock: 999, // Will be validated by backend
      },
      quantity: item.quantity,
    }));

    return {
      mode: "from_cart",
      shopId: API_CONFIG.SHOP_ID,
      items,
      ...customerInfo,
    };
  },
};
