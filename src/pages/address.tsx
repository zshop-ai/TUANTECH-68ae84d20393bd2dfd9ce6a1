import { useState } from "react";
import { Page, Box, Text, Button, Header, Spinner, Input, Modal } from "zmp-ui";
import {
  MapPin,
  Edit,
  Trash2,
  Plus,
  Check,
  Phone,
  Building,
} from "lucide-react";
import { useAddresses } from "../hooks/useAddresses";
import { Address, CreateAddressRequest } from "../services/address";
import { API_CONFIG } from "../config/api";

function AddressPage() {
  const {
    addresses,
    loading,
    error,
    refreshAddresses,
    createAddress,
    setDefaultAddress,
    updateAddress,
    deleteAddress,
  } = useAddresses();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const [formData, setFormData] = useState<CreateAddressRequest>({
    name: "",
    phone: "",
    address: "",
    city: "",
    isDefault: false,
    shopId: API_CONFIG.SHOP_ID,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleSetDefault = async (addressId: string) => {
    try {
      await setDefaultAddress(addressId);
    } catch (error) {
      console.error("Failed to set default address:", error);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await deleteAddress(addressId);
    } catch (error) {
      console.error("Failed to delete address:", error);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Tên không được để trống";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Số điện thoại không được để trống";
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ""))) {
      errors.phone = "Số điện thoại không hợp lệ";
    }

    if (!formData.address.trim()) {
      errors.address = "Địa chỉ không được để trống";
    }

    if (!formData.city.trim()) {
      errors.city = "Thành phố không được để trống";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      address: "",
      city: "",
      isDefault: false,
      shopId: API_CONFIG.SHOP_ID,
    });
    setFormErrors({});
  };

  const handleInputChange = (
    field: keyof CreateAddressRequest,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleAddAddress = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEditAddress = (address: Address) => {
    setFormData({
      name: address.name,
      phone: address.phone,
      address: address.address,
      city: address.city,
      isDefault: address.isDefault,
      shopId: address.shopId,
    });
    setEditingAddress(address);
    setShowEditModal(true);
  };

  const handleSubmitAdd = async () => {
    if (!validateForm()) return;

    try {
      await createAddress(formData);
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error("Failed to create address:", error);
    }
  };

  const handleSubmitEdit = async () => {
    if (!validateForm() || !editingAddress) return;

    try {
      await updateAddress(editingAddress.id, formData);
      setShowEditModal(false);
      setEditingAddress(null);
      resetForm();
    } catch (error) {
      console.error("Failed to update address:", error);
    }
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingAddress(null);
    resetForm();
  };

  return (
    <Page className="bg-gray-50">
      <Header
        title="Địa chỉ giao hàng"
        className="bg-primary-600"
        showBackIcon
      />

      <Box className="p-4 space-y-4 mt-[100px]">
        {loading && (
          <Box className="flex justify-center py-8">
            <Spinner />
          </Box>
        )}

        {error && (
          <Box className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <Text className="text-red-600 text-center">{error}</Text>
            <Button
              variant="secondary"
              size="small"
              onClick={refreshAddresses}
              className="mt-2 w-full"
            >
              Thử lại
            </Button>
          </Box>
        )}

        {!loading && !error && addresses.length === 0 ? (
          <Box className="text-center py-20">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <Text className="text-gray-500 text-lg mb-2">
              Chưa có địa chỉ giao hàng
            </Text>
            <Text className="text-gray-400 mb-6">
              Hãy thêm địa chỉ để thuận tiện cho việc giao hàng
            </Text>
            <Button
              variant="primary"
              onClick={handleAddAddress}
              className="bg-primary-600 hover:bg-primary-700"
            >
              Thêm địa chỉ
            </Button>
          </Box>
        ) : !loading && !error && addresses.length > 0 ? (
          <>
            {addresses.map((address) => (
              <Box
                key={address.id}
                className="bg-white rounded-lg p-4 shadow-sm"
              >
                {/* Address Header */}
                {address.isDefault && (
                  <Box className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full w-fit">
                    <Text className="text-xs font-medium">Mặc định</Text>
                  </Box>
                )}
                <Box className="flex items-center justify-between mb-3">
                  <Box className="flex items-center space-x-2">
                    <Text className="font-semibold text-gray-900">
                      {address.name}
                    </Text>
                  </Box>
                  <Box className="flex items-center space-x-1">
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleEditAddress(address)}
                      className="border-gray-300 text-gray-600"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleDeleteAddress(address.id)}
                      className="border-red-500 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </Box>
                </Box>

                {/* Address Details */}
                <Box className="space-y-1 mb-3">
                  <Box className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <Text className="text-gray-600">{address.phone}</Text>
                  </Box>
                  <Box className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <Text className="text-gray-900">{address.address}</Text>
                  </Box>
                  <Box className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-gray-500" />
                    <Text className="text-gray-600">{address.city}</Text>
                  </Box>
                </Box>

                {/* Action Buttons */}
                <Box className="flex space-x-2">
                  {!address.isDefault && (
                    <Button
                      variant="secondary"
                      size="small"
                      fullWidth
                      onClick={() => handleSetDefault(address.id)}
                      className="border-primary-600 text-primary-600"
                    >
                      <div className="flex items-center justify-center">
                        <Check className="w-4 h-4 mr-1" />
                        Đặt làm mặc định
                      </div>
                    </Button>
                  )}
                  {address.isDefault && (
                    <Button
                      variant="secondary"
                      size="small"
                      fullWidth
                      disabled
                      className="border-gray-300 text-gray-400"
                    >
                      <div className="flex items-center justify-center">
                        <Check className="w-4 h-4 mr-1" />
                        Địa chỉ mặc định
                      </div>
                    </Button>
                  )}
                </Box>
              </Box>
            ))}

            {/* Add New Address Button */}
            <Button
              variant="secondary"
              fullWidth
              onClick={handleAddAddress}
              className="border-primary-600 text-primary-600 border-dashed"
            >
              <div className="flex items-center justify-center">
                <Plus className="w-5 h-5 mr-2" />
                Thêm địa chỉ mới
              </div>
            </Button>
          </>
        ) : null}
      </Box>

      {/* Add Address Modal */}
      <Modal
        visible={showAddModal}
        onClose={closeModals}
        title="Thêm địa chỉ mới"
        actions={[
          {
            key: "cancel",
            text: "Hủy",
            onClick: closeModals,
          },
          {
            key: "add",
            text: "Thêm",
            onClick: handleSubmitAdd,
            disabled: loading,
          },
        ]}
      >
        <Box className="space-y-4">
          <Box>
            <Input
              label="Tên người nhận *"
              placeholder="Nhập tên người nhận"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
            {formErrors.name && (
              <Text className="text-xs text-red-600 mt-1">
                {formErrors.name}
              </Text>
            )}
          </Box>

          <Box>
            <Input
              label="Số điện thoại *"
              placeholder="Nhập số điện thoại"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
            {formErrors.phone && (
              <Text className="text-xs text-red-600 mt-1">
                {formErrors.phone}
              </Text>
            )}
          </Box>

          <Box>
            <Input
              label="Địa chỉ *"
              placeholder="Nhập địa chỉ chi tiết"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
            />
            {formErrors.address && (
              <Text className="text-xs text-red-600 mt-1">
                {formErrors.address}
              </Text>
            )}
          </Box>

          <Box>
            <Input
              label="Thành phố *"
              placeholder="Nhập thành phố"
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
            />
            {formErrors.city && (
              <Text className="text-xs text-red-600 mt-1">
                {formErrors.city}
              </Text>
            )}
          </Box>

          <Box className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault}
              onChange={(e) => handleInputChange("isDefault", e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="isDefault" className="text-sm text-gray-700">
              Đặt làm địa chỉ mặc định
            </label>
          </Box>
        </Box>
      </Modal>

      {/* Edit Address Modal */}
      <Modal
        visible={showEditModal}
        onClose={closeModals}
        title="Chỉnh sửa địa chỉ"
        actions={[
          {
            key: "cancel",
            text: "Hủy",
            onClick: closeModals,
          },
          {
            key: "update",
            text: "Cập nhật",
            onClick: handleSubmitEdit,
            disabled: loading,
          },
        ]}
      >
        <Box className="space-y-4">
          <Box>
            <Input
              label="Tên người nhận *"
              placeholder="Nhập tên người nhận"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
            {formErrors.name && (
              <Text className="text-xs text-red-600 mt-1">
                {formErrors.name}
              </Text>
            )}
          </Box>

          <Box>
            <Input
              label="Số điện thoại *"
              placeholder="Nhập số điện thoại"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
            {formErrors.phone && (
              <Text className="text-xs text-red-600 mt-1">
                {formErrors.phone}
              </Text>
            )}
          </Box>

          <Box>
            <Input
              label="Địa chỉ *"
              placeholder="Nhập địa chỉ chi tiết"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
            />
            {formErrors.address && (
              <Text className="text-xs text-red-600 mt-1">
                {formErrors.address}
              </Text>
            )}
          </Box>

          <Box>
            <Input
              label="Thành phố *"
              placeholder="Nhập thành phố"
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
            />
            {formErrors.city && (
              <Text className="text-xs text-red-600 mt-1">
                {formErrors.city}
              </Text>
            )}
          </Box>

          <Box className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isDefaultEdit"
              checked={formData.isDefault}
              onChange={(e) => handleInputChange("isDefault", e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="isDefaultEdit" className="text-sm text-gray-700">
              Đặt làm địa chỉ mặc định
            </label>
          </Box>
        </Box>
      </Modal>
    </Page>
  );
}

export default AddressPage;
