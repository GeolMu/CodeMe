import React from 'react';

interface PricingPageProps {
  onOpenLogin?: () => void;
  onOpenSignup?: () => void;
  onOpenContact?: () => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ onOpenLogin, onOpenSignup, onOpenContact }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">가격 안내</h1>
        <p className="text-gray-600">가격 페이지는 준비 중입니다.</p>
      </div>
    </div>
  );
};

export default PricingPage;
