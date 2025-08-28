import React, { useState, useEffect } from 'react';
import { Box, Text } from 'zmp-ui';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  text: string;
  duration?: number;
  onClose?: () => void;
}

interface ToastItem extends ToastProps {
  id: string;
  visible: boolean;
}

class ToastService {
  private static instance: ToastService;
  private toasts: ToastItem[] = [];
  private listeners: ((toasts: ToastItem[]) => void)[] = [];

  static getInstance(): ToastService {
    if (!ToastService.instance) {
      ToastService.instance = new ToastService();
    }
    return ToastService.instance;
  }

  show(props: ToastProps) {
    const toast: ToastItem = {
      ...props,
      id: Date.now().toString(),
      visible: true,
    };

    this.toasts.push(toast);
    this.notifyListeners();

    // Auto hide after duration
    setTimeout(() => {
      this.hide(toast.id);
    }, props.duration || 3000);
  }

  hide(id: string) {
    const toast = this.toasts.find(t => t.id === id);
    if (toast) {
      toast.visible = false;
      this.notifyListeners();

      // Remove from array after animation
      setTimeout(() => {
        this.toasts = this.toasts.filter(t => t.id !== id);
        this.notifyListeners();
      }, 300);
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.toasts]));
  }

  subscribe(listener: (toasts: ToastItem[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
}

export const toastService = ToastService.getInstance();

// Static methods for easy use
export const Toast = {
  show: (props: ToastProps) => toastService.show(props),
  success: (text: string, duration?: number) => toastService.show({ type: 'success', text, duration }),
  error: (text: string, duration?: number) => toastService.show({ type: 'error', text, duration }),
  warning: (text: string, duration?: number) => toastService.show({ type: 'warning', text, duration }),
  info: (text: string, duration?: number) => toastService.show({ type: 'info', text, duration }),
};

// Toast Container Component
export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const unsubscribe = toastService.subscribe(setToasts);
    return unsubscribe;
  }, []);

  const getIcon = (type: ToastProps['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  const getBgColor = (type: ToastProps['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-green-50 border-green-200';
    }
  };

  const getTextColor = (type: ToastProps['type']) => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
        return 'text-blue-800';
      default:
        return 'text-green-800';
    }
  };

  if (toasts.length === 0) return null;

  return (
    <Box className="fixed top-20 left-0 right-0 z-50 p-4 space-y-2">
      {toasts.map((toast) => (
        <Box
          key={toast.id}
          className={`${getBgColor(toast.type)} border rounded-lg p-3 shadow-lg transition-all duration-300 ${
            toast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
          }`}
        >
          <Box className="flex items-center space-x-3">
            {getIcon(toast.type)}
            <Text className={`flex-1 ${getTextColor(toast.type)}`}>
              {toast.text}
            </Text>
            <button
              onClick={() => toastService.hide(toast.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default Toast;
