import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TemplateConfig, CoreThemeContextType } from './types';
import { availableTemplates, cosmeticTemplate } from './templates';
import { loadThemeFromEnv, updateCSSVariablesFromEnv } from '../config/env-theme-loader';

const CoreThemeContext = createContext<CoreThemeContextType | undefined>(undefined);

interface CoreThemeProviderProps {
  children: ReactNode;
  defaultTemplateId?: string;
}

export const CoreThemeProvider: React.FC<CoreThemeProviderProps> = ({ 
  children, 
  defaultTemplateId = 'cosmetic' 
}) => {
  const [currentTemplate, setCurrentTemplate] = useState<TemplateConfig>(() => {
    const template = availableTemplates.find(t => t.id === defaultTemplateId);
    return template || cosmeticTemplate;
  });

  const switchTemplate = (templateId: string) => {
    const template = availableTemplates.find(t => t.id === templateId);
    if (template) {
      setCurrentTemplate(template);
      // Update CSS custom properties for theme colors
      updateCSSVariables(template);
    }
  };

  const updateCSSVariables = (template: TemplateConfig) => {
    
    // Cập nhật CSS variables từ environment theme
    const envTheme = loadThemeFromEnv();
    updateCSSVariablesFromEnv(envTheme);
    
    // Cũng cập nhật từ template theme (fallback)
    const root = document.documentElement;
    const { primary, accent } = template.theme;
    
    
    // Update primary colors (only if env theme doesn't have them)
    Object.entries(primary).forEach(([key, value]) => {
      const envKey = `--color-primary-${key}`;
      const currentValue = root.style.getPropertyValue(envKey);
      if (!currentValue) {
        root.style.setProperty(envKey, value);
      }
    });
    
    // Update accent colors if available
    if (accent) {
      Object.entries(accent).forEach(([key, value]) => {
        root.style.setProperty(`--color-accent-${key}`, value);
      });
    }
    
  };

  useEffect(() => {
    updateCSSVariables(currentTemplate);
  }, [currentTemplate]);

  const value: CoreThemeContextType = {
    currentTemplate,
    switchTemplate,
    availableTemplates,
  };

  return (
    <CoreThemeContext.Provider value={value}>
      {children}
    </CoreThemeContext.Provider>
  );
};

export const useCoreTheme = (): CoreThemeContextType => {
  const context = useContext(CoreThemeContext);
  if (context === undefined) {
    throw new Error('useCoreTheme must be used within a CoreThemeProvider');
  }
  return context;
};
