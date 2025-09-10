// Environment theme loader
// Đọc các biến theme từ app-config.json hoặc .env file

export interface EnvThemeConfig {
  projectName: string;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  logoUrl: string;
  bannerUrl: string;
}

// Đọc theme configuration từ environment variables
export function loadThemeFromEnv(): EnvThemeConfig {
  const theme = {
    projectName: import.meta.env.VITE_PROJECT_NAME || 'Veridian Bloom',
    primaryColor: import.meta.env.VITE_PRIMARY_COLOR || '#22c55e',
    backgroundColor: import.meta.env.VITE_BACKGROUND_COLOR || '#f9fafb',
    textColor: import.meta.env.VITE_TEXT_COLOR || '#111827',
    fontFamily: import.meta.env.VITE_FONT_FAMILY || 'Inter, system-ui, sans-serif',
    logoUrl: import.meta.env.VITE_LOGO_URL || '/src/static/cosmetic.png',
    bannerUrl: import.meta.env.VITE_BANNER_URL || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=500&fit=crop&crop=center',
  };
  
  return theme;
}

// Cập nhật CSS variables từ env theme
export function updateCSSVariablesFromEnv(theme: EnvThemeConfig) {
  
  const root = document.documentElement;
  
  // Cập nhật màu chủ đạo
  root.style.setProperty('--color-primary', theme.primaryColor);
  root.style.setProperty('--color-primary-500', theme.primaryColor);
  root.style.setProperty('--color-primary-600', adjustColor(theme.primaryColor, -20));
  
  
  // Cập nhật màu nền
  root.style.setProperty('--color-background', theme.backgroundColor);
  root.style.setProperty('--color-background-primary', theme.backgroundColor);
  
  
  // Cập nhật màu chữ
  root.style.setProperty('--color-text', theme.textColor);
  root.style.setProperty('--color-text-primary', theme.textColor);
  
  
  // Cập nhật font
  root.style.setProperty('--font-family', theme.fontFamily);
  root.style.setProperty('--font-family-primary', theme.fontFamily);
  
}

// Hàm helper để điều chỉnh độ sáng của màu
function adjustColor(color: string, amount: number): string {
  // Chuyển đổi hex sang RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Điều chỉnh độ sáng
  const newR = Math.max(0, Math.min(255, r + amount));
  const newG = Math.max(0, Math.min(255, g + amount));
  const newB = Math.max(0, Math.min(255, b + amount));
  
  // Chuyển đổi lại sang hex
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}
