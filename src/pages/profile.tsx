import React, { useState, useEffect } from "react";
import { Page, Box, Text, Button, List, Header } from "zmp-ui";
import { useNavigate } from "zmp-ui";
import {
  MapPin,
  Settings,
  Headphones,
  Info,
  ChevronRight,
  User,
  Edit,
  LogOut,
  Share2,
  Heart,
  Users,
} from "lucide-react";
import BottomNavigation from "../core/components/BottomNavigation";
import ZaloLogin from "../components/ZaloLogin";
import { authService, User as UserType } from "../services/auth";
import { Toast, ToastContainer } from "../components/Toast";
import { useZaloActions } from "../hooks/useZaloActions";
import { ZALO_CONFIG } from "../config/zalo";
import { getShareDataForPage } from "../utils/referralUtils";
import { useAuth } from "../contexts/AuthContext";

function ProfilePage() {
  const navigate = useNavigate();
  const {
    userInfo,
    isLoggedIn,
    isLoading: authLoading,
    login,
    logout,
  } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const {
    handleFollowOA,
    handleShare,
    isLoading: isZaloLoading,
  } = useZaloActions();

  // Sử dụng userInfo từ AuthContext thay vì state local
  const currentUser = userInfo;

  // Sử dụng loading state từ AuthContext
  useEffect(() => {
    setIsLoading(authLoading);
  }, [authLoading]);

  const handleLoginSuccess = (user: UserType) => {
    // Cập nhật AuthContext với user mới
    login(user);
    Toast.show({
      type: "success",
      text: "Đăng nhập thành công!",
    });
  };

  const handleLoginError = (error: string) => {
    Toast.show({
      type: "error",
      text: error,
    });
  };

  const handleLogout = () => {
    logout(); // Sử dụng logout từ AuthContext
    Toast.show({
      type: "success",
      text: "Đã đăng xuất thành công!",
    });
  };

  const handleShareApp = async () => {
    const shareData = getShareDataForPage("profile");
    const result = await handleShare(shareData);

    if (result.success) {
      Toast.show({
        type: "success",
        text: "Chia sẻ thành công!",
      });
    } else {
      Toast.show({
        type: "error",
        text: result.message || "Có lỗi xảy ra khi chia sẻ",
      });
    }
  };

  const handleFollowOAClick = async () => {
    const result = await handleFollowOA(ZALO_CONFIG.OA_ID);

    if (result.success) {
      Toast.show({
        type: "success",
        text: result.message,
      });
    } else {
      Toast.show({
        type: "error",
        text: result.message,
      });
    }
  };

  const menuItems = [
    {
      id: "orders",
      title: "Đơn hàng của tôi",
      icon: ChevronRight,
      action: () => navigate("/orders"),
    },
    {
      id: "favorites",
      title: "Sản phẩm yêu thích",
      icon: ChevronRight,
      action: () => navigate("/favorites"),
    },
    {
      id: "address",
      title: "Địa chỉ giao hàng",
      icon: MapPin,
      action: () => navigate("/address"),
    },
    {
      id: "settings",
      title: "Cài đặt",
      icon: Settings,
      action: () => navigate("/settings"),
    },
    {
      id: "support",
      title: "Hỗ trợ khách hàng",
      icon: Headphones,
      action: () => navigate("/support"),
    },
    {
      id: "about",
      title: "Về chúng tôi",
      icon: Info,
      action: () => navigate("/about"),
    },
  ];

  const actionButtons = [
    {
      id: "share",
      title: "Chia sẻ ứng dụng",
      icon: Share2,
      action: handleShareApp,
      variant: "primary" as const,
      loading: isZaloLoading,
    },
    {
      id: "follow",
      title: "Quan tâm OA",
      icon: Heart,
      action: handleFollowOAClick,
      variant: "secondary" as const,
      loading: isZaloLoading,
    },
  ];

  if (isLoading) {
    return (
      <Page className="bg-gray-50">
        <Header title="Tài khoản" className="bg-primary-600" showBackIcon />
        <Box className="flex items-center justify-center h-64">
          <Text>Đang tải...</Text>
        </Box>
      </Page>
    );
  }

  return (
    <Page className="bg-gray-50">
      {/* Header */}
      <Header title="Tài khoản" className="bg-primary-600" showBackIcon />

      {/* User Info */}
      <Box className="bg-white p-6 mb-6 mt-[100px] rounded-lg shadow-sm">
        {isLoggedIn && currentUser ? (
          // Logged in state
          <Box className="flex items-center space-x-4">
            <Box className="w-20 h-20 rounded-full overflow-hidden relative">
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Box className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </Box>
              )}
            </Box>
            <Box className="flex-1">
              <Text.Title size="large" className="mb-2 text-gray-800">
                {currentUser.fullName}
              </Text.Title>
              {currentUser.isFollower && (
                <Box className="inline-block bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">
                  ✓ Đang hoạt động
                </Box>
              )}
            </Box>
            <Button
              variant="secondary"
              size="small"
              onClick={handleLogout}
              className="border-red-500 text-red-500 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </Box>
        ) : (
          // Not logged in state - Improved design
          <Box className="text-center py-8">
            <Box className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-12 h-12 text-gray-400" />
            </Box>

            <Text.Title size="large" className="mb-3 text-gray-800">
              Chào mừng bạn!
            </Text.Title>

            <Text className="text-gray-600 mb-6 leading-relaxed">
              Đăng nhập để xem thông tin cá nhân,
              <br />
              theo dõi đơn hàng và quản lý tài khoản
            </Text>

            <Box className="max-w-xs mx-auto">
              <ZaloLogin
                onLoginSuccess={handleLoginSuccess}
                onLoginError={handleLoginError}
              />
            </Box>

            <Text className="text-xs text-gray-400 mt-4">
              Bảo mật thông tin cá nhân của bạn
            </Text>
          </Box>
        )}
      </Box>

      {/* Stats */}
      {isLoggedIn && currentUser && (
        <Box className="bg-white p-4 mb-4">
          <Box className="grid grid-cols-3 gap-4">
            <Box className="text-center">
              <Text className="text-2xl font-bold text-primary-600 mb-1">
                {currentUser.stats?.orders || 0}
              </Text>
              <Text className="text-sm text-gray-600">Đơn hàng</Text>
            </Box>
            <Box className="text-center">
              <Text className="text-2xl font-bold text-primary-600 mb-1">
                {currentUser.stats?.favorites || 0}
              </Text>
              <Text className="text-sm text-gray-600">Yêu thích</Text>
            </Box>
            <Box className="text-center">
              <Text className="text-2xl font-bold text-primary-600 mb-1">
                {currentUser.stats?.spent || "0đ"}
              </Text>
              <Text className="text-sm text-gray-600">Đã chi tiêu</Text>
            </Box>
          </Box>
        </Box>
      )}

      {/* Action Buttons */}
      <Box className="bg-white p-4 mb-4">
        <Text className="text-lg font-semibold mb-4 text-gray-800">
          Hành động
        </Text>
        <Box className="grid grid-cols-2 gap-3">
          {actionButtons.map((button) => (
            <Button
              key={button.id}
              variant={button.variant}
              onClick={button.action}
              disabled={button.loading}
              className={`flex items-center justify-center space-x-2 py-3 ${
                button.variant === "primary"
                  ? "bg-primary-600 hover:bg-primary-700 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                {button.loading ? (
                  <Box className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <button.icon className="w-4 h-4" />
                )}
                <Text className="text-sm font-medium">{button.title}</Text>
              </div>
            </Button>
          ))}
        </Box>
      </Box>

      {/* Menu Items */}
      {isLoggedIn && (
        <Box className="bg-white">
          <List>
            {menuItems.map((item, index) => (
              <Box
                key={item.id}
                onClick={item.action}
                className={`flex items-center justify-between p-4 cursor-pointer ${
                  index === menuItems.length - 1
                    ? ""
                    : "border-b border-gray-100"
                }`}
              >
                <Box className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5 text-primary-600" />
                  <Text>{item.title}</Text>
                </Box>
                <ChevronRight className="text-gray-400" />
              </Box>
            ))}
          </List>
        </Box>
      )}

      {/* App Info */}
      <Box className="p-4 text-center pb-20">
        <Text className="text-sm text-gray-500 mb-1">
          Veridian Bloom v1.0.0
        </Text>
        <Text className="text-xs text-gray-400">
          © 2024 Veridian Bloom. All rights reserved.
        </Text>
      </Box>

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Toast Container */}
      <ToastContainer />
    </Page>
  );
}

export default ProfilePage;
