import { useState } from 'react';
import { paymentService, ZaloPaymentResult } from '../services/payment';
import { authService } from '../services/auth';

export interface ZaloPaymentParams {
  paymentMethod: string;
  amount: number;
  description: string;
}

export const useZaloPayment = () => {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Create Zalo payment order - mimics zmp.payment.createOrder behavior
   * For COD payments, this will call our backend API
   * For other payment methods, this could be extended to call actual Zalo SDK
   */
  const createOrder = async (params: ZaloPaymentParams): Promise<ZaloPaymentResult> => {
    setIsLoading(true);
    try {
      const user = authService.getCurrentUser?.();
      const userId = user?.id;

      const result = await paymentService.createZaloPayment({
        ...params,
        userId,
      });

      return result;
    } catch (error: any) {
      console.error('Zalo payment creation failed:', error);
      return {
        success: false,
        error: error?.message || 'Payment creation failed',
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createOrder,
    isLoading,
  };
};

/**
 * Global zmp object mock for COD payments
 * This provides a similar interface to the actual Zalo Mini App SDK
 */
export const zmp = {
  payment: {
    createOrder: async (params: ZaloPaymentParams): Promise<ZaloPaymentResult> => {
      const user = authService.getCurrentUser?.();
      const userId = user?.id;

      return paymentService.createZaloPayment({
        ...params,
        userId,
      });
    },
  },
};
