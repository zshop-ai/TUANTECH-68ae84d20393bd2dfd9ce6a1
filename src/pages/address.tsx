import React, { useState, useEffect } from "react";
import { Page, Box, Text, Button, Header } from "zmp-ui";
import { useNavigate } from "zmp-ui";
import {
  MapPin,
  Edit,
  Trash2,
  Plus,
  Check,
  Phone,
  Building,
} from "lucide-react";

function AddressPage() {
  const navigate = useNavigate();
  // Mock addresses data for different users
  const mockAddressesData = [
    // User 1: Nguyễn Thị Anh
    [
      {
        id: "1",
        name: "Nguyễn Thị Anh",
        phone: "0123456789",
        address: "123 Đường ABC, Phường XYZ, Quận 1",
        city: "TP. Hồ Chí Minh",
        isDefault: true,
      },
      {
        id: "2",
        name: "Nguyễn Thị Anh",
        phone: "0123456789",
        address: "456 Đường DEF, Phường GHI, Quận 3",
        city: "TP. Hồ Chí Minh",
        isDefault: false,
      },
    ],
    // User 2: Trần Văn Minh
    [
      {
        id: "3",
        name: "Trần Văn Minh",
        phone: "0987654321",
        address: "789 Đường HIJ, Phường KLM, Quận 7",
        city: "TP. Hồ Chí Minh",
        isDefault: true,
      },
    ],
    // User 3: Lê Thị Hương
    [
      {
        id: "4",
        name: "Lê Thị Hương",
        phone: "0369852147",
        address: "321 Đường NOP, Phường QRS, Quận 2",
        city: "TP. Hồ Chí Minh",
        isDefault: true,
      },
      {
        id: "5",
        name: "Lê Thị Hương",
        phone: "0369852147",
        address: "654 Đường TUV, Phường WXY, Quận 9",
        city: "TP. Hồ Chí Minh",
        isDefault: false,
      },
      {
        id: "6",
        name: "Lê Thị Hương",
        phone: "0369852147",
        address: "987 Đường ZAB, Phường CDE, Quận Bình Thạnh",
        city: "TP. Hồ Chí Minh",
        isDefault: false,
      },
    ],
    // User 4: Phạm Hoàng Nam
    [
      {
        id: "7",
        name: "Phạm Hoàng Nam",
        phone: "0521478963",
        address: "147 Đường FGH, Phường IJK, Quận 10",
        city: "TP. Hồ Chí Minh",
        isDefault: true,
      },
    ],
  ];

  // For demo, we'll use a simple counter to cycle through users
  const [userIndex, setUserIndex] = useState(0);
  const [addresses, setAddresses] = useState(mockAddressesData[0]);

  // Simulate user change (in real app, this would come from context/state management)
  useEffect(() => {
    const interval = setInterval(() => {
      setUserIndex((prev) => (prev + 1) % mockAddressesData.length);
      setAddresses(
        mockAddressesData[(userIndex + 1) % mockAddressesData.length]
      );
    }, 10000); // Change user every 10 seconds for demo
    return () => clearInterval(interval);
  }, [userIndex]);

  const handleSetDefault = (addressId: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === addressId,
      }))
    );
  };

  const handleDeleteAddress = (addressId: string) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== addressId));
  };

  const handleEditAddress = (address: any) => {
    // Mock edit address
  };

  const handleAddAddress = () => {
    // Mock add new address
  };

  return (
    <Page className="bg-gray-50">
      <Header
        title="Địa chỉ giao hàng"
        className="bg-primary-600"
        showBackIcon
      />

      <Box className="p-4 space-y-4 mt-[100px]">
        {addresses.length === 0 ? (
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
        ) : (
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
        )}
      </Box>
    </Page>
  );
}

export default AddressPage;
