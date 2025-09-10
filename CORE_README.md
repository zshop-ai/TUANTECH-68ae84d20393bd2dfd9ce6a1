# Core Template System

Hệ thống template core cho phép dễ dàng chuyển đổi giữa các template khác nhau chỉ bằng cách thay đổi theme và config.

## Cấu trúc

```
src/core/
├── theme/
│   ├── types.ts          # Định nghĩa types cho theme
│   ├── templates.ts      # Các template có sẵn
│   └── context.tsx       # React context cho theme
├── components/
│   ├── Header.tsx        # Header component
│   ├── Banner.tsx        # Banner component
│   ├── CategoryGrid.tsx  # Category grid
│   ├── ProductCard.tsx   # Product card
│   ├── BottomNavigation.tsx # Bottom navigation
│   ├── CoreLayout.tsx    # Main layout wrapper
│   └── TemplateSelector.tsx # Template selector (dev)
├── hooks/
│   └── useProducts.ts    # Hook để quản lý products
├── data/
│   └── products.ts       # Product data cho các template
├── layout/
│   └── CoreApp.tsx       # Main app wrapper
└── index.ts              # Export tất cả
```

## Cách sử dụng

### 1. Sử dụng CoreApp

```tsx
import CoreApp from '@/core/layout/CoreApp';

// Trong app.ts
root.render(React.createElement(CoreApp, { defaultTemplateId: 'cosmetic' }));
```

### 2. Sử dụng CoreLayout trong pages

```tsx
import CoreLayout from '../core/components/CoreLayout';
import { useProducts } from '../core/hooks/useProducts';

function HomePage() {
  const { featuredProducts } = useProducts();

  return (
    <CoreLayout
      featuredProducts={featuredProducts}
      onAddToCart={handleAddToCart}
      onViewDetail={handleViewDetail}
      onCategoryClick={handleCategoryClick}
    >
      {/* Custom content */}
    </CoreLayout>
  );
}
```

### 3. Switch template

```tsx
import { useCoreTheme } from '../core/theme/context';

function MyComponent() {
  const { switchTemplate, availableTemplates } = useCoreTheme();

  return (
    <div>
      {availableTemplates.map(template => (
        <button onClick={() => switchTemplate(template.id)}>
          {template.name}
        </button>
      ))}
    </div>
  );
}
```

## Templates có sẵn

### 1. Cosmetic Template
- **ID**: `cosmetic`
- **Theme**: Green colors
- **Brand**: Veridian Bloom
- **Products**: Mỹ phẩm, skincare, makeup

### 2. Fashion Template
- **ID**: `fashion`
- **Theme**: Red colors
- **Brand**: Style Hub
- **Products**: Quần áo, phụ kiện

### 3. Electronics Template
- **ID**: `electronics`
- **Theme**: Blue colors
- **Brand**: TechZone
- **Products**: Điện thoại, laptop, phụ kiện

## Tạo template mới

### 1. Thêm template config

```tsx
// Trong src/core/theme/templates.ts
export const myNewTemplate: TemplateConfig = {
  id: 'my-template',
  name: 'My Template',
  theme: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      // ... các màu khác
    }
  },
  brand: {
    name: 'My Brand',
    tagline: 'My Tagline',
    logo: '/path/to/logo.png',
    description: 'My description'
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
        id: 'category1',
        name: 'Category 1',
        icon: 'zi-star-solid',
        gradient: 'from-blue-400 to-blue-600'
      }
    ],
    banners: [
      {
        id: '1',
        image: 'https://example.com/banner.jpg',
        title: 'BANNER TITLE',
        subtitle: 'Banner Subtitle'
      }
    ]
  }
};
```

### 2. Thêm products

```tsx
// Trong src/core/data/products.ts
export const myTemplateProducts: Product[] = [
  {
    id: "1",
    name: "Product Name",
    brand: "Brand Name",
    category: "Category",
    price: 100000,
    // ... các field khác
  }
];

// Thêm vào templateProducts
export const templateProducts = {
  cosmetic: cosmeticProducts,
  fashion: fashionProducts,
  electronics: electronicsProducts,
  'my-template': myTemplateProducts, // Thêm dòng này
};
```

### 3. Thêm vào availableTemplates

```tsx
// Trong src/core/theme/templates.ts
export const availableTemplates: TemplateConfig[] = [
  cosmeticTemplate,
  fashionTemplate,
  electronicsTemplate,
  myNewTemplate, // Thêm dòng này
];
```

## Customization

### 1. Thay đổi theme colors

Template system sử dụng CSS custom properties, có thể override trong CSS:

```css
:root {
  --color-primary-500: #your-color;
  --color-primary-600: #your-color;
}
```

### 2. Custom components

Có thể tạo custom components và sử dụng trong CoreLayout:

```tsx
<CoreLayout>
  <MyCustomComponent />
</CoreLayout>
```

### 3. Custom hooks

Tạo custom hooks để extend functionality:

```tsx
export const useMyCustomFeature = () => {
  const { currentTemplate } = useCoreTheme();
  // Custom logic
  return { /* custom data */ };
};
```

## Development

### Test template switching

Truy cập `/test` để test template switching và xem thông tin template hiện tại.

### Debug

Sử dụng `useCoreTheme` hook để debug:

```tsx
const { currentTemplate, availableTemplates } = useCoreTheme();
console.log('Current template:', currentTemplate);
console.log('Available templates:', availableTemplates);
```
