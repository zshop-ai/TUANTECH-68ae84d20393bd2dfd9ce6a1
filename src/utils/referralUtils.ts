import { ZALO_CONFIG } from '../config/zalo';

export interface ShareData {
  title: string;
  description: string;
  thumbnail: string;
  url?: string;
  path?: string;
}

/**
 * Tạo share data với referral code cho Zalo Mini App
 * @param baseShareData - Dữ liệu share gốc
 * @param referralCode - Mã referral của user
 * @returns Share data đã được cập nhật với referral code
 */
export const createReferralShareData = (
  baseShareData: ShareData,
  referralCode: string
): ShareData => {
  // Validate referralCode
  if (!referralCode || typeof referralCode !== 'string') {
    throw new Error('ReferralCode must be a valid string');
  }

  const referralShareData = {
    ...baseShareData,
    description: `${baseShareData.description}\n\n🎁 Tham gia qua link này để nhận ưu đãi đặc biệt!`,
    // Zalo Mini App sẽ truyền referral code qua route params
    path: `/?ref=${referralCode}`,
  };

  return referralShareData;
};

export const getShareDataForPage = (page: keyof typeof ZALO_CONFIG.PAGE_SHARE_INFO): ShareData => {
  return ZALO_CONFIG.PAGE_SHARE_INFO[page];
};

export const getDefaultShareData = (): ShareData => {
  return ZALO_CONFIG.SHARE_INFO;
};
