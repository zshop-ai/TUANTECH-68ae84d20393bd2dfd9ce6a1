import { API_CONFIG } from "../config/api";
import { apiGet } from "../utils/api";

export interface OrderItemDto {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  sku?: string;
  variantName?: string;
}

export interface OrderDto {
  id: string;
  shopId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress?: string;
  totalAmount: number;
  status: "pending" | "confirmed" | "delivered" | "cancelled";
  paymentMethod?: string;
  paymentStatus?: string;
  shippingMethod?: string;
  shippingFee?: number;
  discount?: number;
  notes?: string;
  products: OrderItemDto[];
  createdAt: string;
  updatedAt: string;
}

export const ordersService = {
  async getMyOrders(status?: string) {
    const base = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CUSTOMER_MY_ORDERS}`;
    const url = status ? `${base}?status=${encodeURIComponent(status)}` : base;
    return apiGet<OrderDto[]>(url);
  },

  async getOrdersByPhone(phone: string, status?: string) {
    const base = `${API_CONFIG.BASE_URL}${
      API_CONFIG.ENDPOINTS.CUSTOMER_ORDERS
    }?phone=${encodeURIComponent(phone)}`;
    const url = status ? `${base}&status=${encodeURIComponent(status)}` : base;
    return apiGet<OrderDto[]>(url);
  },

  async getOrderDetail(id: string, phone?: string) {
    let base = `${
      API_CONFIG.BASE_URL
    }${API_CONFIG.ENDPOINTS.CUSTOMER_ORDER_DETAIL.replace(":id", id)}`;
    if (phone) {
      base += `?phone=${encodeURIComponent(phone)}`;
    }
    return apiGet<OrderDto>(base);
  },
};
