import { API_CONFIG } from "../config/api";
import { apiPost } from "../utils/api";

export interface ZaloCodOrderRequest {
  paymentMethod: string;
  amount: number;
  description: string;
  userId?: string;
  extraData?: Record<string, any>;
}

export interface ZaloCodOrderResponse {
  success: boolean;
  orderId?: string;
  amount?: number;
  description?: string;
  paymentMethod?: string;
  message?: string;
}

export interface ZaloPaymentResult {
  success: boolean;
  orderId?: string;
  message?: string;
  error?: string;
}

export const paymentService = {
  /**
   * Create Zalo COD order using backend API
   */
  async createZaloCodOrder(request: ZaloCodOrderRequest): Promise<ZaloCodOrderResponse> {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ZALO_COD_ORDER}`;
    return apiPost(url, request);
  },

  /**
   * Checkout with Zalo COD payment method
   * For COD payments, we only need to create the order in backend
   * No Zalo SDK payment processing is required for COD
   */
  async checkoutZaloCOD(params: {
    amount: number;
    description: string;
    userId?: string;
  }): Promise<ZaloPaymentResult> {
    try {
      console.log("🚀 Starting COD checkout process...", params);

      // Step 1: Call backend API to create COD order
      const backendRequest: ZaloCodOrderRequest = {
        paymentMethod: "COD",
        amount: params.amount,
        description: params.description,
        userId: params.userId,
      };

      console.log("📡 Calling backend API:", API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.ZALO_COD_ORDER);
      const backendResponse = await this.createZaloCodOrder(backendRequest);
      console.log("✅ Backend API response:", backendResponse);

      // Step 2: Check if backend response is successful
      if (!backendResponse.success) {
        console.error("❌ Backend API failed:", backendResponse.message);
        return {
          success: false,
          error: backendResponse.message || "Failed to create COD order on backend",
        };
      }

      // For COD payments, we don't need Zalo SDK payment processing
      // The order is created and will be paid on delivery
      console.log("✅ COD order created successfully, no payment processing needed");

      return {
        success: true,
        orderId: backendResponse.orderId,
        message: "Đơn hàng COD đã được tạo thành công",
      };
    } catch (error: any) {
      console.error("💥 COD checkout failed:", error);
      return {
        success: false,
        error: error?.message || "COD checkout failed",
      };
    }
  },

  /**
   * Simulate zmp.payment.createOrder for COD payments
   * This mimics the Zalo Mini App SDK behavior for COD payments
   */
  async createZaloPayment(params: {
    paymentMethod: string;
    amount: number;
    description: string;
    userId?: string;
  }): Promise<ZaloPaymentResult> {
    try {
      // For COD payments, we call our backend API instead of actual Zalo payment
      if (params.paymentMethod === "COD") {
        const response = await this.createZaloCodOrder({
          paymentMethod: params.paymentMethod,
          amount: params.amount,
          description: params.description,
          userId: params.userId,
        });

        if (response.success) {
          return {
            success: true,
            orderId: response.orderId,
            message: response.message || "COD payment created successfully",
          };
        } else {
          return {
            success: false,
            error: response.message || "Failed to create COD payment",
          };
        }
      }

      // For other payment methods, you could integrate with actual Zalo payment SDK
      // For now, we'll return an error for non-COD payments
      return {
        success: false,
        error: "Only COD payment method is supported",
      };
    } catch (error: any) {
      console.error("Payment creation failed:", error);
      return {
        success: false,
        error: error?.message || "Payment creation failed",
      };
    }
  },
};
