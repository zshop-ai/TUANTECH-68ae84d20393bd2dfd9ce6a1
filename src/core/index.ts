// Theme exports
export { CoreThemeProvider, useCoreTheme } from './theme/context';
export type { TemplateConfig, ThemeColors, BrandConfig, CoreThemeContextType } from './theme/types';
export { availableTemplates, cosmeticTemplate, fashionTemplate, electronicsTemplate } from './theme/templates';

// Component exports
export { default as Header } from './components/Header';
export { default as Banner } from './components/Banner';
export { default as CategoryGrid } from './components/CategoryGrid';
export { default as ProductCard } from './components/ProductCard';
export { default as BottomNavigation } from './components/BottomNavigation';
export { default as CoreLayout } from './components/CoreLayout';
export { default as TemplateSelector } from './components/TemplateSelector';
export type { Product } from './types/product';

// Hook exports
export { useProducts } from './hooks/useProducts';

// Data exports
export { 
  getProductsForTemplate, 
  templateProducts,
  cosmeticProducts,
  fashionProducts,
  electronicsProducts 
} from './data/products';

// Layout exports
export { default as CoreApp } from './layout/CoreApp';
