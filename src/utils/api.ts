import { authService } from "../services/auth";
const GUEST_USER_ID = "68b00ed59cf44607992bf4c7";

/**
 * Utility function để gọi API với automatic token refresh
 * @param url - API endpoint
 * @param options - Fetch options
 * @returns Promise với response data
 */
export async function apiCall<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    // Lấy headers với token mới nhất
    let authHeaders: Record<string, string> = {};
    try {
      authHeaders = await authService.getAuthHeadersWithRefresh();
    } catch (_) {
      // Fallback to guest user header when not authenticated
      authHeaders = { "x-user-id": GUEST_USER_ID } as Record<string, string>;
    }

    // Merge headers
    const headers = {
      "Content-Type": "application/json",
      ...authHeaders,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      // Nếu response là 401, có thể token đã hết hạn
      if (response.status === 401) {
        // Thử refresh token một lần nữa
        const refreshed = await authService.refreshToken();
        if (refreshed) {
          // Retry request với token mới
          const newAuthHeaders = await authService.getAuthHeadersWithRefresh();
          const newHeaders = {
            "Content-Type": "application/json",
            ...newAuthHeaders,
            ...options.headers,
          };

          const retryResponse = await fetch(url, {
            ...options,
            headers: newHeaders,
          });

          if (!retryResponse.ok) {
            throw new Error(`API call failed: ${retryResponse.status}`);
          }

          return await retryResponse.json();
        } else {
          // Refresh token thất bại, redirect về login
          authService.logout();
          throw new Error("Authentication failed");
        }
      }

      throw new Error(`API call failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
}

/**
 * Public API call without authentication
 */
export async function apiCallPublic<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    } as Record<string, string>;

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Public API call error:", error);
    throw error;
  }
}

/**
 * Utility function để gọi API GET
 */
export async function apiGet<T = any>(url: string): Promise<T> {
  return apiCall<T>(url, { method: "GET" });
}

/**
 * Public GET without auth
 */
export async function apiGetPublic<T = any>(url: string): Promise<T> {
  return apiCallPublic<T>(url, { method: "GET" });
}

/**
 * Utility function để gọi API POST
 */
export async function apiPost<T = any>(url: string, data?: any): Promise<T> {
  return apiCall<T>(url, {
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * Utility function để gọi API PUT
 */
export async function apiPut<T = any>(url: string, data?: any): Promise<T> {
  return apiCall<T>(url, {
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * Utility function để gọi API DELETE
 */
export async function apiDelete<T = any>(url: string): Promise<T> {
  return apiCall<T>(url, { method: "DELETE" });
}

/**
 * Utility function để gọi API PATCH
 */
export async function apiPatch<T = any>(url: string, data?: any): Promise<T> {
  return apiCall<T>(url, {
    method: "PATCH",
    body: data ? JSON.stringify(data) : undefined,
  });
}
