import { useState } from 'react';
import { followOA, openShareSheet } from 'zmp-sdk/apis';
import { useAuth } from '../contexts/AuthContext';
import { createReferralShareData, ShareData } from '../utils/referralUtils';
import { User } from '../services/auth';

interface AppError {
  code: number;
  message: string;
}

export const useZaloActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { userInfo } = useAuth();

  const handleFollowOA = async (oaId: string) => {
    setIsLoading(true);
    try {
      await followOA({
        id: oaId,
        showDialogConfirm: true,
      });
      console.log('Theo dõi thành công');
      return { success: true, message: 'Theo dõi thành công' };
    } catch (error) {
      const code = (error as AppError).code;
      if (code === -201) {
        console.log('Người dùng đã từ chối theo dõi');
        return { success: false, message: 'Người dùng đã từ chối theo dõi' };
      } else {
        console.log('Lỗi khác', error);
        return { success: false, message: 'Có lỗi xảy ra khi theo dõi' };
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async (shareData: ShareData) => {
    setIsLoading(true);
    try {
      let finalShareData = shareData;

      // Sử dụng referalCode theo BE
      const referralCode = userInfo?.referalCode;

      // Nếu user đã đăng nhập và có referral code, tạo referral share data
      if (referralCode && typeof referralCode === 'string') {
        finalShareData = createReferralShareData(
          shareData,
          referralCode
        );
      }

      const data = await openShareSheet({
        type: 'zmp',
        data: finalShareData,
      });
      return { success: true, data };
    } catch (error) {
      return { success: false, message: 'Có lỗi xảy ra khi chia sẻ' };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleFollowOA,
    handleShare,
  };
};
