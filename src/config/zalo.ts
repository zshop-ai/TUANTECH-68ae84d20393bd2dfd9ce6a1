// Cấu hình Zalo Official Account
export const ZALO_CONFIG = {
  // Thay thế bằng OA ID thực tế của bạn
  OA_ID: '4525435302021790108',

  // Thông tin chia sẻ mặc định
  SHARE_INFO: {
    title: 'Veridian Bloom - Ứng dụng mỹ phẩm',
    description:
      'Khám phá các sản phẩm mỹ phẩm chất lượng cao với Veridian Bloom. Tìm kiếm, so sánh và chọn lựa sản phẩm phù hợp nhất cho bạn.',
    thumbnail: 'https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=VB',
    path: '/',
  },

  // Thông tin chia sẻ cho từng trang cụ thể
  PAGE_SHARE_INFO: {
    home: {
      title: 'Veridian Bloom - Trang chủ',
      description: 'Khám phá các sản phẩm mỹ phẩm nổi bật và xu hướng làm đẹp mới nhất',
      thumbnail: 'https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=VB',
      path: '/',
    },
    products: {
      title: 'Veridian Bloom - Danh sách sản phẩm',
      description: 'Xem danh sách các sản phẩm mỹ phẩm chất lượng cao',
      thumbnail: 'https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=VB',
      path: '/products',
    },
    profile: {
      title: 'Veridian Bloom - Tài khoản',
      description: 'Quản lý tài khoản và khám phá các tính năng độc quyền',
      thumbnail: 'https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=VB',
      path: '/profile',
    },
  },
};
