import { TemplateConfig } from './types';

export const cosmeticTemplate: TemplateConfig = {
  id: 'cosmetic',
  name: 'Cosmetic Store',
  theme: {
    primary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    accent: {
      light: '#f0fdf4',
      main: '#22c55e',
      dark: '#15803d',
      accent: '#fbbf24',
    }
  },
  brand: {
    name: 'Veridian Bloom',
    tagline: "Nature's Embrace",
    logo: '/src/static/cosmetic.png',
    description: 'Mỹ phẩm tự nhiên cao cấp'
  },
  features: {
    showCategories: true,
    showBanner: true,
    showFeaturedProducts: true,
    showSearch: true,
    showTrending: true,
  },
  layout: {
    headerStyle: 'gradient',
    cardStyle: 'modern',
    navigationStyle: 'bottom',
  },
  content: {
    categories: [
      {
        id: 'glow',
        name: 'Glow',
        icon: 'zi-star-solid',
        gradient: 'from-pink-400 to-pink-600'
      },
      {
        id: 'beauty',
        name: 'Beauty',
        icon: 'zi-star-solid',
        gradient: 'from-purple-400 to-purple-600'
      },
      {
        id: 'fresh',
        name: 'Fresh',
        icon: 'zi-star-solid',
        gradient: 'from-blue-400 to-blue-600'
      },
      {
        id: 'vital',
        name: 'Vital',
        icon: 'zi-star-solid',
        gradient: 'from-orange-400 to-orange-600'
      }
    ],
    banners: [
      {
        id: '1',
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=500&fit=crop&crop=center',
        title: 'VERIDIAN BLOOM',
        subtitle: 'NATURE\'S EMBRACE'
      }
    ]
  }
};

export const fashionTemplate: TemplateConfig = {
  id: 'fashion',
  name: 'Fashion Store',
  theme: {
    primary: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
    accent: {
      light: '#fef2f2',
      main: '#ef4444',
      dark: '#b91c1c',
      accent: '#f59e0b',
    }
  },
  brand: {
    name: 'Style Hub',
    tagline: 'Fashion Forward',
    logo: '/src/static/fashion.png',
    description: 'Thời trang hiện đại và phong cách'
  },
  features: {
    showCategories: true,
    showBanner: true,
    showFeaturedProducts: true,
    showSearch: true,
    showTrending: true,
  },
  layout: {
    headerStyle: 'gradient',
    cardStyle: 'modern',
    navigationStyle: 'bottom',
  },
  content: {
    categories: [
      {
        id: 'women',
        name: 'Women',
        icon: 'zi-star-solid',
        gradient: 'from-rose-400 to-rose-600'
      },
      {
        id: 'men',
        name: 'Men',
        icon: 'zi-star-solid',
        gradient: 'from-blue-400 to-blue-600'
      },
      {
        id: 'accessories',
        name: 'Accessories',
        icon: 'zi-star-solid',
        gradient: 'from-purple-400 to-purple-600'
      },
      {
        id: 'shoes',
        name: 'Shoes',
        icon: 'zi-star-solid',
        gradient: 'from-orange-400 to-orange-600'
      }
    ],
    banners: [
      {
        id: '1',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=500&fit=crop&crop=center',
        title: 'STYLE HUB',
        subtitle: 'FASHION FORWARD'
      }
    ]
  }
};

export const electronicsTemplate: TemplateConfig = {
  id: 'electronics',
  name: 'Electronics Store',
  theme: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    accent: {
      light: '#eff6ff',
      main: '#3b82f6',
      dark: '#1d4ed8',
      accent: '#10b981',
    }
  },
  brand: {
    name: 'TechZone',
    tagline: 'Innovation First',
    logo: '/src/static/electronics.png',
    description: 'Công nghệ tiên tiến và hiện đại'
  },
  features: {
    showCategories: true,
    showBanner: true,
    showFeaturedProducts: true,
    showSearch: true,
    showTrending: true,
  },
  layout: {
    headerStyle: 'gradient',
    cardStyle: 'modern',
    navigationStyle: 'bottom',
  },
  content: {
    categories: [
      {
        id: 'phones',
        name: 'Phones',
        icon: 'zi-star-solid',
        gradient: 'from-blue-400 to-blue-600'
      },
      {
        id: 'laptops',
        name: 'Laptops',
        icon: 'zi-star-solid',
        gradient: 'from-indigo-400 to-indigo-600'
      },
      {
        id: 'accessories',
        name: 'Accessories',
        icon: 'zi-star-solid',
        gradient: 'from-purple-400 to-purple-600'
      },
      {
        id: 'gaming',
        name: 'Gaming',
        icon: 'zi-star-solid',
        gradient: 'from-green-400 to-green-600'
      }
    ],
    banners: [
      {
        id: '1',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=500&fit=crop&crop=center',
        title: 'TECHZONE',
        subtitle: 'INNOVATION FIRST'
      }
    ]
  }
};

export const availableTemplates: TemplateConfig[] = [
  cosmeticTemplate,
  fashionTemplate,
  electronicsTemplate,
];
