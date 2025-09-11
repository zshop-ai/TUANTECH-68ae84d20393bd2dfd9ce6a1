import React from 'react';
import { useReferralHandler } from '../hooks/useReferralHandler';

const ReferralHandler: React.FC = () => {
  // Sử dụng useReferralHandler trong Router context
  useReferralHandler();
  
  return null; // Component này không render gì cả
};

export default ReferralHandler;
