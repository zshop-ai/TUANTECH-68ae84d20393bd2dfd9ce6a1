import React from 'react';
import { getSystemInfo } from "zmp-sdk";
import {
  AnimationRoutes,
  App,
  Route,
  ZMPRouter,
} from "zmp-ui";
import { AppProps } from "zmp-ui/app";
import { CoreThemeProvider } from '../theme/context';
import { ToastContainer } from '../../components/Toast';
import ReferralHandler from '../../components/ReferralHandler';

// Import pages
import HomePage from '../../pages/index';
import ProductsPage from '../../pages/products';
import ProductDetailPage from '../../pages/product-detail';
import CartPage from '../../pages/cart';
import CheckoutPage from '../../pages/checkout';
import OrderSuccessPage from '../../pages/order-success';
import ProfilePage from '../../pages/profile';
import OrdersPage from '../../pages/orders';
import FavoritesPage from '../../pages/favorites';
import AddressPage from '../../pages/address';
import SettingsPage from '../../pages/settings';
import SupportPage from '../../pages/support';
import AboutPage from '../../pages/about';
import TestPage from '../../pages/test';
import ThemeDemoPage from '../../pages/theme-demo';

interface CoreAppProps {
  defaultTemplateId?: string;
}

const CoreApp: React.FC<CoreAppProps> = ({ defaultTemplateId = 'cosmetic' }) => {
  return (
    <CoreThemeProvider defaultTemplateId={defaultTemplateId}>
      <App theme={getSystemInfo().zaloTheme as AppProps["theme"]}>
        <ZMPRouter>
          {/* Xử lý referral code từ URL */}
          <ReferralHandler />
          <AnimationRoutes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/theme-demo" element={<ThemeDemoPage />} />
            <Route path="/product-detail" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/address" element={<AddressPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/about" element={<AboutPage />} />
          </AnimationRoutes>
          
          {/* Global Toast Container */}
          <ToastContainer />
        </ZMPRouter>
      </App>
    </CoreThemeProvider>
  );
};

export default CoreApp;
