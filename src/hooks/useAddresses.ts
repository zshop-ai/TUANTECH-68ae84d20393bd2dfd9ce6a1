import { useState, useEffect, useCallback } from "react";
import {
  addressService,
  Address,
  CreateAddressRequest,
} from "../services/address";
import { API_CONFIG } from "../config/api";

export interface UseAddressesReturn {
  addresses: Address[];
  loading: boolean;
  error: string | null;
  refreshAddresses: () => Promise<void>;
  createAddress: (addressData: CreateAddressRequest) => Promise<Address>;
  setDefaultAddress: (addressId: string) => Promise<void>;
  updateAddress: (
    addressId: string,
    addressData: Partial<CreateAddressRequest>
  ) => Promise<Address>;
  deleteAddress: (addressId: string) => Promise<void>;
}

export function useAddresses(): UseAddressesReturn {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shopId = API_CONFIG.SHOP_ID;

  const refreshAddresses = useCallback(async () => {
    if (!shopId) {
      setError("Shop ID is not configured");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const addresses = await addressService.getAddresses(shopId);
      setAddresses(addresses || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch addresses"
      );
      console.error("Error fetching addresses:", err);
    } finally {
      setLoading(false);
    }
  }, [shopId]);

  const createAddress = useCallback(
    async (addressData: CreateAddressRequest): Promise<Address> => {
      setLoading(true);
      setError(null);

      try {
        const newAddress = await addressService.createAddress(addressData);
        setAddresses((prev) => [...prev, newAddress]);
        return newAddress;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create address";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const setDefaultAddress = useCallback(
    async (addressId: string): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        await addressService.setDefaultAddress(addressId);
        setAddresses((prev) =>
          prev.map((addr) => ({
            ...addr,
            isDefault: addr.id === addressId,
          }))
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to set default address";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateAddress = useCallback(
    async (
      addressId: string,
      addressData: Partial<CreateAddressRequest>
    ): Promise<Address> => {
      setLoading(true);
      setError(null);

      try {
        const updatedAddress = await addressService.updateAddress(
          addressId,
          addressData
        );
        setAddresses((prev) =>
          prev.map((addr) => (addr.id === addressId ? updatedAddress : addr))
        );
        return updatedAddress;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update address";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteAddress = useCallback(
    async (addressId: string): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        await addressService.deleteAddress(addressId);
        setAddresses((prev) => prev.filter((addr) => addr.id !== addressId));
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete address";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Load addresses on mount
  useEffect(() => {
    refreshAddresses();
  }, [refreshAddresses]);

  return {
    addresses,
    loading,
    error,
    refreshAddresses,
    createAddress,
    setDefaultAddress,
    updateAddress,
    deleteAddress,
  };
}
