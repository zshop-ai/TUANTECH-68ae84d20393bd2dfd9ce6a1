import React, { useState, useEffect } from "react";
import { Box, Text, Button } from "zmp-ui";
import { ProductVariant } from "../data/products";

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onVariantChange: (variant: ProductVariant) => void;
  onAddToCart: (variant: ProductVariant, quantity: number) => void;
  onBuyNow: (variant: ProductVariant, quantity: number) => void;
}

const VariantSelector: React.FC<VariantSelectorProps> = ({
  variants,
  selectedVariant,
  onVariantChange,
  onAddToCart,
  onBuyNow,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});

  // Group variants by attributes and filter by stock
  const attributeGroups = React.useMemo(() => {
    const groups: Record<string, string[]> = {};
    const availableVariants = variants.filter((variant) => variant.stock > 0);

    availableVariants.forEach((variant) => {
      variant.attributes.forEach((attr) => {
        if (!groups[attr.name]) {
          groups[attr.name] = [];
        }
        if (!groups[attr.name].includes(attr.value)) {
          groups[attr.name].push(attr.value);
        }
      });
    });
    return groups;
  }, [variants]);

  // Get available variants (stock > 0)
  const availableVariants = React.useMemo(() => {
    return variants.filter((variant) => variant.stock > 0);
  }, [variants]);

  // Require explicit user selection of variant; do not auto-select any variant

  // Ensure quantity doesn't exceed selected variant stock
  useEffect(() => {
    if (selectedVariant && quantity > selectedVariant.stock) {
      setQuantity(selectedVariant.stock);
    }
  }, [selectedVariant, quantity]);

  // Update selected variant when attributes change
  useEffect(() => {
    if (Object.keys(selectedAttributes).length > 0) {
      const matchingVariant = availableVariants.find((variant) =>
        variant.attributes.every(
          (attr) => selectedAttributes[attr.name] === attr.value
        )
      );
      if (matchingVariant && matchingVariant !== selectedVariant) {
        onVariantChange(matchingVariant);
        // Reset quantity to 1 when variant changes
        setQuantity(1);
      }
    }
  }, [selectedAttributes, availableVariants, selectedVariant, onVariantChange]);

  const handleAttributeChange = (attributeName: string, value: string) => {
    console.log("handleAttributeChange called:", { attributeName, value });
    console.log("Current selectedAttributes:", selectedAttributes);
    console.log("Available variants:", availableVariants);

    // Always update the selected attribute, even if the combination might not be complete
    const newAttributes = {
      ...selectedAttributes,
      [attributeName]: value,
    };

    console.log("New attributes:", newAttributes);
    setSelectedAttributes(newAttributes);

    // Find matching variant with the new attributes
    const matchingVariant = availableVariants.find((variant) =>
      variant.attributes.every(
        (attr) => newAttributes[attr.name] === attr.value
      )
    );

    console.log("Matching variant:", matchingVariant);

    if (matchingVariant) {
      onVariantChange(matchingVariant);
    }
  };

  // Check if a specific attribute value is available
  const isAttributeValueAvailable = (attributeName: string, value: string) => {
    // Check if this specific attribute value exists in any available variant
    const isAvailable = availableVariants.some((variant) =>
      variant.attributes.some(
        (attr) => attr.name === attributeName && attr.value === value
      )
    );
    console.log(
      `isAttributeValueAvailable(${attributeName}, ${value}):`,
      isAvailable
    );
    return isAvailable;
  };

  const increaseQuantity = () => {
    if (selectedVariant && quantity < selectedVariant.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (variants.length === 0) {
    return null;
  }

  // Show out of stock message if no variants are available
  if (availableVariants.length === 0) {
    return (
      <Box className="space-y-4">
        <Box className="text-center py-8">
          <Text className="text-red-500 font-medium text-lg">
            Sản phẩm đã hết hàng
          </Text>
          <Text className="text-gray-500 text-sm mt-2">
            Tất cả các biến thể đều không còn hàng
          </Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="space-y-4">
      {/* Variant Selection */}
      {Object.entries(attributeGroups).map(([attributeName, values]) => (
        <Box key={attributeName} className="space-y-2">
          <Text className="font-medium text-gray-900">{attributeName}:</Text>
          <Box className="flex flex-wrap gap-2">
            {values.map((value) => {
              const isSelected = selectedAttributes[attributeName] === value;
              const isAvailable = isAttributeValueAvailable(
                attributeName,
                value
              );

              return (
                <Button
                  key={value}
                  variant={isSelected ? "primary" : "secondary"}
                  size="small"
                  disabled={!isAvailable}
                  className={`px-3 py-1 text-sm ${
                    isSelected
                      ? "bg-primary-600 text-white"
                      : isAvailable
                      ? "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                      : "bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed opacity-50"
                  }`}
                  onClick={() => handleAttributeChange(attributeName, value)}
                >
                  {value}
                  {!isAvailable && " (Hết hàng)"}
                </Button>
              );
            })}
          </Box>
        </Box>
      ))}

      {/* Selected Variant Info */}
      {selectedVariant ? (
        <Box className="bg-gray-50 p-3 rounded-lg">
          <Box className="flex justify-between items-center mb-2">
            <Text className="font-medium text-gray-900">
              SKU: {selectedVariant.sku}
            </Text>
            <Text className="text-lg font-bold text-primary-600">
              {formatPrice(selectedVariant.price)}
            </Text>
          </Box>
          <Text className="text-sm text-gray-600">
            Còn lại: {selectedVariant.stock} sản phẩm
          </Text>
        </Box>
      ) : (
        <Box className="bg-gray-50 p-3 rounded-lg">
          <Text className="text-sm text-gray-600">
            Vui lòng chọn biến thể để tiếp tục
          </Text>
        </Box>
      )}

      {/* Quantity Selector (always visible, disabled until variant selected) */}
      <Box className="space-y-2">
        <Text className="font-medium text-gray-900">Số lượng:</Text>
        <Box className="flex items-center space-x-3">
          <Button
            variant="secondary"
            size="small"
            className="w-8 h-8 rounded-full flex items-center justify-center"
            onClick={decreaseQuantity}
            disabled={quantity <= 1}
          >
            -
          </Button>
          <Text className="text-lg font-medium w-8 text-center">
            {quantity}
          </Text>
          <Button
            variant="secondary"
            size="small"
            className="w-8 h-8 rounded-full flex items-center justify-center"
            onClick={increaseQuantity}
            disabled={!selectedVariant || quantity >= selectedVariant.stock}
          >
            +
          </Button>
        </Box>
        {!selectedVariant && (
          <Text className="text-xs text-gray-500">
            Chọn biến thể để chỉnh số lượng
          </Text>
        )}
      </Box>

      {/* Action Buttons (always visible, disabled until variant selected) */}
      <Box className="flex space-x-3 pt-4">
        <Button
          variant="secondary"
          className="flex-1"
          onClick={() =>
            selectedVariant && onAddToCart(selectedVariant, quantity)
          }
          disabled={!selectedVariant || selectedVariant.stock === 0}
        >
          Thêm vào giỏ
        </Button>
        <Button
          variant="primary"
          className="flex-1"
          onClick={() => selectedVariant && onBuyNow(selectedVariant, quantity)}
          disabled={!selectedVariant || selectedVariant.stock === 0}
        >
          Mua ngay
        </Button>
      </Box>

      {/* Out of Stock Message */}
      {selectedVariant && selectedVariant.stock === 0 && (
        <Box className="text-center py-2">
          <Text className="text-red-500 font-medium">Sản phẩm đã hết hàng</Text>
        </Box>
      )}
    </Box>
  );
};

export default VariantSelector;
