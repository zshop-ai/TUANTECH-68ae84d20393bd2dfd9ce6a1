export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  tags: string[];
  features: string[];
}

export const products: Product[] = [
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
  },
  {
    id: "4",
    name: "Phấn phủ kiềm dầu",
    brand: "Matte Pro",
    category: "Makeup",
    price: 280000,
    description: "Phấn phủ kiềm dầu hiệu quả, giúp da mịn màng suốt ngày",
    images: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop"
    ],
    rating: 4.5,
    reviewCount: 756,
    inStock: true,
    tags: ["Kiềm dầu", "Mịn màng", "Bền lâu"],
    features: ["Kiềm dầu hiệu quả", "Kết cấu mịn", "Không gây bít tắc"]
  },
  {
    id: "5",
    name: "Tẩy trang nước hoa hồng",
    brand: "Rose Garden",
    category: "Skincare",
    price: 220000,
    description: "Nước tẩy trang hoa hồng dịu nhẹ, làm sạch sâu và cân bằng độ pH",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop"
    ],
    rating: 4.9,
    reviewCount: 1680,
    inStock: true,
    tags: ["Tẩy trang", "Hoa hồng", "Cân bằng pH"],
    features: ["Chiết xuất hoa hồng", "Cân bằng độ pH", "Không gây kích ứng"]
  },
  {
    id: "6",
    name: "Mascara cong mi tự nhiên",
    brand: "Lash Queen",
    category: "Makeup",
    price: 250000,
    originalPrice: 300000,
    description: "Mascara giúp cong mi tự nhiên, không lem, không vón cục",
    images: [
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop"
    ],
    rating: 4.4,
    reviewCount: 945,
    inStock: false,
    tags: ["Cong mi", "Không lem", "Tự nhiên"],
    features: ["Cong mi tự nhiên", "Không lem nước", "Dễ tẩy trang"]
  }
];

export const categories = [
  { id: "all", name: "Tất cả", icon: "zi-grid" },
  { id: "skincare", name: "Chăm sóc da", icon: "zi-heart" },
  { id: "makeup", name: "Trang điểm", icon: "zi-star" },
  { id: "haircare", name: "Chăm sóc tóc", icon: "zi-user" },
  { id: "fragrance", name: "Nước hoa", icon: "zi-flower" }
];

export const banners = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=400&fit=crop",
    title: "Ưu đãi mùa hè",
    subtitle: "Giảm đến 50% cho sản phẩm chăm sóc da"
  },
  {
    id: "2", 
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=400&fit=crop",
    title: "Bộ sưu tập mới",
    subtitle: "Khám phá các sản phẩm trang điểm mới nhất"
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&h=400&fit=crop", 
    title: "Thành phần tự nhiên",
    subtitle: "100% chiết xuất từ thiên nhiên"
  }
];
