import { useEffect, useState } from 'react';
import { useLocation } from 'zmp-ui';

export const useReferralHandler = () => {
  const location = useLocation();
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    // Lấy referral code từ URL parameters
    const urlParams = new URLSearchParams(location.search);
    const refCode = urlParams.get('ref');
    
    if (refCode) {
      setReferralCode(refCode);
      
      // Lưu referral code vào localStorage để sử dụng khi đăng nhập
      localStorage.setItem('referral_code', refCode);
    }
  }, [location.search]);

  const clearReferralCode = () => {
    setReferralCode(null);
    localStorage.removeItem('referral_code');
  };

  const getStoredReferralCode = (): string | null => {
    return localStorage.getItem('referral_code');
  };

  return {
    referralCode,
    clearReferralCode,
    getStoredReferralCode,
  };
};
