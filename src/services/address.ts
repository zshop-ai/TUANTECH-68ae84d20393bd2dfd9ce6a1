import { API_CONFIG } from "../config/api";
import { apiGet, apiPost, apiPut, apiDelete, apiPatch } from "../utils/api";

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
    const result = await apiGet<any[]>(url);

    // Transform _id to id for frontend compatibility
    const transformedAddresses = result.map((address: any) => ({
      ...address,
      id: address._id || address.id,
    }));

    return transformedAddresses;
  }

  /**
   * Create a new address
   * POST /address
   */
  async createAddress(addressData: CreateAddressRequest): Promise<Address> {
    const url = this.buildUrl(API_CONFIG.ENDPOINTS.ADDRESS);
    const result = await apiPost<any>(url, addressData);
    return {
      ...result,
      id: result._id || result.id,
    };
  }

  /**
   * Set an address as default
   * PATCH /address/address_id/set-default
   */
  async setDefaultAddress(addressId: string): Promise<Address> {
    if (!addressId) {
      throw new Error("Address ID is required");
    }

    const url = this.buildUrl(API_CONFIG.ENDPOINTS.ADDRESS_SET_DEFAULT, {
      addressId,
    });
    const result = await apiPatch<any>(url);
    return {
      ...result,
      id: result._id || result.id,
    };
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
    const result = await apiPut<any>(url, addressData);
    return {
      ...result,
      id: result._id || result.id,
    };
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
