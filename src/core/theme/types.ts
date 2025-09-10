export interface ThemeColors {
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  secondary?: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  accent?: {
    light: string;
    main: string;
    dark: string;
    accent: string;
  };
}

export interface BrandConfig {
  name: string;
  tagline: string;
  logo: string;
  description: string;
}

export interface TemplateConfig {
  id: string;
  name: string;
  theme: ThemeColors;
  brand: BrandConfig;
  features: {
    showCategories: boolean;
    showBanner: boolean;
    showFeaturedProducts: boolean;
    showSearch: boolean;
    showTrending: boolean;
  };
  layout: {
    headerStyle: 'gradient' | 'solid' | 'transparent';
    cardStyle: 'modern' | 'classic' | 'minimal';
    navigationStyle: 'bottom' | 'top' | 'sidebar';
  };
  content: {
    categories: Array<{
      id: string;
      name: string;
      icon: string;
      gradient: string;
    }>;
    banners: Array<{
      id: string;
      image: string;
      title: string;
      subtitle: string;
    }>;
  };
}

export interface CoreThemeContextType {
  currentTemplate: TemplateConfig;
  switchTemplate: (templateId: string) => void;
  availableTemplates: TemplateConfig[];
}
