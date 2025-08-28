import { getSystemInfo } from "zmp-sdk";
import {
  AnimationRoutes,
  App,
  Route,
  ZMPRouter,
} from "zmp-ui";
import { AppProps } from "zmp-ui/app";
import { ToastContainer } from "./Toast";

import HomePage from "../pages/index";
import ProductsPage from "../pages/products";
import ProductDetailPage from "../pages/product-detail";
import CartPage from "../pages/cart";
import CheckoutPage from "../pages/checkout";
import OrderSuccessPage from "../pages/order-success";
import ProfilePage from "../pages/profile";
import OrdersPage from "../pages/orders";
import FavoritesPage from "../pages/favorites";
import AddressPage from "../pages/address";
import SettingsPage from "../pages/settings";
import SupportPage from "../pages/support";
import AboutPage from "../pages/about";
import TestPage from "../pages/test";

const Layout = () => {
  return (
    <App theme={getSystemInfo().zaloTheme as AppProps["theme"]}>
      <ZMPRouter>
        <AnimationRoutes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/test" element={<TestPage />} />
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
  );
};
export default Layout;
