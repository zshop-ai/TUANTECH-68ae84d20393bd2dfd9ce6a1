import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User as UserType } from '../services/auth';

interface AuthContextType {
  userInfo: UserType | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (user: UserType) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<UserType | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập khi component mount
    const checkAuthStatus = () => {
      const loggedIn = authService.isLoggedIn();
      const user = authService.getCurrentUser();
      
      
      setIsLoggedIn(loggedIn);
      setUserInfo(user);
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = (user: UserType) => {
    setUserInfo(user);
    setIsLoggedIn(true);
  };

  const logout = () => {
    authService.logout();
    setUserInfo(null);
    setIsLoggedIn(false);
  };

  const value: AuthContextType = {
    userInfo,
    isLoggedIn,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
