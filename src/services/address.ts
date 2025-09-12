import { API_CONFIG } from "../config/api";
import { apiGet, apiPost, apiPut, apiDelete } from "../utils/api";

export interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  isDefault: boolean;
  shopId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAddressRequest {
  name: string;
  phone: string;
  address: string;
  city: string;
  isDefault: boolean;
  shopId: string;
}

// Backend returns Address[] directly, not wrapped in an object
export type AddressResponse = Address[];

class AddressService {
  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    let url = `${API_CONFIG.BASE_URL}${endpoint}`;

    // Replace path parameters
    if (params) {
      Object.keys(params).forEach((key) => {
        url = url.replace(`:${key}`, params[key]);
      });
    }

    return url;
  }

  private buildQueryUrl(
    endpoint: string,
    queryParams?: Record<string, string>
  ): string {
    let url = `${API_CONFIG.BASE_URL}${endpoint}`;

    if (queryParams) {
      const params = new URLSearchParams(queryParams);
      url += `?${params.toString()}`;
    }

    return url;
  }

  /**
   * Get all addresses for a shop
   * GET /address?shopId=shop_id_here
   */
  async getAddresses(shopId: string): Promise<Address[]> {
    const url = this.buildQueryUrl(API_CONFIG.ENDPOINTS.ADDRESS, { shopId });
    console.log("Address API URL:", url);
    const result = await apiGet<Address[]>(url);
    console.log("Address API Response:", result);
    return result;
  }

  /**
   * Create a new address
   * POST /address
   */
  async createAddress(addressData: CreateAddressRequest): Promise<Address> {
    const url = this.buildUrl(API_CONFIG.ENDPOINTS.ADDRESS);
    return apiPost<Address>(url, addressData);
  }

  /**
   * Set an address as default
   * PATCH /address/address_id/set-default
   */
  async setDefaultAddress(addressId: string): Promise<Address> {
    const url = this.buildUrl(API_CONFIG.ENDPOINTS.ADDRESS_SET_DEFAULT, {
      addressId,
    });
    return apiPut<Address>(url);
  }

  /**
   * Update an existing address
   * PUT /address/address_id
   */
  async updateAddress(
    addressId: string,
    addressData: Partial<CreateAddressRequest>
  ): Promise<Address> {
    const url = this.buildUrl(`${API_CONFIG.ENDPOINTS.ADDRESS}/:addressId`, {
      addressId,
    });
    return apiPut<Address>(url, addressData);
  }

  /**
   * Delete an address
   * DELETE /address/address_id
   */
  async deleteAddress(addressId: string): Promise<void> {
    const url = this.buildUrl(`${API_CONFIG.ENDPOINTS.ADDRESS}/:addressId`, {
      addressId,
    });
    return apiDelete<void>(url);
  }
}

export const addressService = new AddressService();
