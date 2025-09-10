import { Product } from '../types/product';

// Cosmetic products
export const cosmeticProducts: Product[] = [
  {
    id: "1",
    name: "Kem dưỡng ẩm chống lão hóa",
    brand: "Green Beauty",
    category: "Skincare",
    price: 450000,
    originalPrice: 550000,
    description: "Kem dưỡng ẩm chống lão hóa với thành phần tự nhiên, giúp làn da mịn màng và tươi trẻ",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop"
    ],
    rating: 4.8,
    reviewCount: 1250,
    inStock: true,
    tags: ["Chống lão hóa", "Dưỡng ẩm", "Tự nhiên"],
    features: ["Chứa vitamin C", "Chống oxy hóa", "Phù hợp mọi loại da"]
  },
  {
    id: "2",
    name: "Sữa rửa mặt dịu nhẹ",
    brand: "Nature Fresh",
    category: "Skincare",
    price: 180000,
    description: "Sữa rửa mặt dịu nhẹ với chiết xuất trà xanh, làm sạch sâu không gây khô da",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop"
    ],
    rating: 4.6,
    reviewCount: 890,
    inStock: true,
    tags: ["Làm sạch", "Dịu nhẹ", "Trà xanh"],
    features: ["Chiết xuất trà xanh", "Không chứa paraben", "Phù hợp da nhạy cảm"]
  },
  {
    id: "3",
    name: "Son môi lì bền màu",
    brand: "Luxe Beauty",
    category: "Makeup",
    price: 320000,
    originalPrice: 380000,
    description: "Son môi lì bền màu với 12 giờ giữ màu, không khô môi",
    images: [
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop"
    ],
    rating: 4.7,
    reviewCount: 2100,
    inStock: true,
    tags: ["Bền màu", "Không khô", "12 giờ"],
    features: ["Bền màu 12 giờ", "Chứa vitamin E", "Nhiều màu sắc"]
  }
];

// Fashion products
export const fashionProducts: Product[] = [
  {
    id: "1",
    name: "Áo thun cotton cao cấp",
    brand: "Style Hub",
    category: "Clothing",
    price: 350000,
    originalPrice: 450000,
    description: "Áo thun cotton 100% cao cấp, thoáng mát và bền đẹp",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop"
    ],
    rating: 4.5,
    reviewCount: 890,
    inStock: true,
    tags: ["Cotton", "Thoáng mát", "Cao cấp"],
    features: ["Cotton 100%", "Không co rút", "Nhiều màu sắc"]
  },
  {
    id: "2",
    name: "Quần jean slim fit",
    brand: "Denim Co",
    category: "Clothing",
    price: 650000,
    description: "Quần jean slim fit với chất liệu denim cao cấp",
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1506629905607-4b2b0b0b0b0b?w=400&h=400&fit=crop"
    ],
    rating: 4.3,
    reviewCount: 567,
    inStock: true,
    tags: ["Denim", "Slim fit", "Cao cấp"],
    features: ["Chất liệu denim", "Kiểu dáng slim", "Bền đẹp"]
  }
];

// Electronics products
export const electronicsProducts: Product[] = [
  {
    id: "1",
    name: "iPhone 15 Pro Max",
    brand: "Apple",
    category: "Smartphone",
    price: 35000000,
    originalPrice: 38000000,
    description: "iPhone 15 Pro Max với chip A17 Pro mạnh mẽ và camera 48MP",
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop"
    ],
    rating: 4.9,
    reviewCount: 2340,
    inStock: true,
    tags: ["iPhone", "Pro Max", "A17 Pro"],
    features: ["Chip A17 Pro", "Camera 48MP", "Titanium"]
  },
  {
    id: "2",
    name: "MacBook Pro M3",
    brand: "Apple",
    category: "Laptop",
    price: 45000000,
    description: "MacBook Pro với chip M3 mạnh mẽ cho công việc chuyên nghiệp",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop"
    ],
    rating: 4.8,
    reviewCount: 1234,
    inStock: true,
    tags: ["MacBook", "M3", "Pro"],
    features: ["Chip M3", "Retina Display", "Touch Bar"]
  }
];

// Template-specific product mapping
export const templateProducts = {
  cosmetic: cosmeticProducts,
  fashion: fashionProducts,
  electronics: electronicsProducts,
};

// Get products for a specific template
export const getProductsForTemplate = (templateId: string): Product[] => {
  return templateProducts[templateId as keyof typeof templateProducts] || cosmeticProducts;
};
