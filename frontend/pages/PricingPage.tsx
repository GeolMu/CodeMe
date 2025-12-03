import React from 'react';
import { Icons } from '../components/Icons';

interface PricingPageProps {
  onOpenLogin?: () => void;
  onOpenSignup?: () => void;
  onOpenContact?: () => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ onOpenLogin, onOpenSignup, onOpenContact }) => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
        
        {/* Header */}
        <div className="bg-[#1a0b2e] py-20 px-4 text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-900/50 to-[#1a0b2e]"></div>
             <div className="relative z-10">
                 <div className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold mb-6">
                     🚀 AI 에이전트로 시작하세요
                 </div>
                 <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">당신에게 맞는 플랜을 선택하세요</h1>
                 <p className="text-purple-200">Code:Me_의 Hey Me로 당신의 시간을 절약하고, AI가 24시간 당신을 대신해 응답합니다</p>
             </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                
                {/* Free */}
                <div className="bg-white rounded-2xl p-8 shadow-xl flex flex-col h-full hover:-translate-y-2 transition-transform duration-300">
                    <h3 className="text-xl font-bold text-gray-900">Free</h3>
                    <p className="text-xs text-gray-500 mb-6">개인 사용자를 위한 무료 플랜</p>
                    <div className="flex items-baseline mb-6">
                        <span className="text-4xl font-bold text-gray-900">₩0</span>
                        <span className="text-gray-500 ml-2">/월</span>
                    </div>
                    <button 
                        onClick={onOpenSignup || onOpenLogin}
                        className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors mb-8"
                    >
                        무료로 시작하기
                    </button>
                    
                    <div className="space-y-4 flex-1">
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">포함된 기능</div>
                        {[
                            '월 100회 대화', '기본 AI 응답', '1개 AI 에이전트', '커뮤니티 지원', '기본 대시보드'
                        ].map((feat, i) => (
                             <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                                 <Icons.Check size={16} className="text-purple-300" /> {feat}
                             </div>
                        ))}
                        {[
                            '고급 분석 없음', '우선 지원 없음'
                        ].map((feat, i) => (
                             <div key={i} className="flex items-center gap-3 text-sm text-gray-300 line-through">
                                 <Icons.Close size={16} /> {feat}
                             </div>
                        ))}
                    </div>
                </div>

                {/* Pro */}
                <div className="bg-white rounded-2xl p-0 shadow-2xl border-2 border-purple-500 flex flex-col h-full relative overflow-hidden hover:-translate-y-2 transition-transform duration-300">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center py-2 text-xs font-bold uppercase tracking-wider">Most Popular</div>
                    <div className="p-8 flex flex-col h-full">
                        <h3 className="text-xl font-bold text-gray-900">Pro</h3>
                        <p className="text-xs text-gray-500 mb-6">전문가를 위한 프로 플랜</p>
                        <div className="flex items-baseline mb-6">
                            <span className="text-4xl font-bold text-purple-600">₩29,000</span>
                            <span className="text-gray-500 ml-2">/월</span>
                        </div>
                        <button 
                            onClick={onOpenSignup || onOpenLogin}
                            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-200 transition-all mb-8"
                        >
                            Pro 시작하기
                        </button>
                        
                        <div className="space-y-4 flex-1">
                             <div className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-2">포함된 기능</div>
                            {[
                                '무제한 대화', '고급 AI 응답 (GPT-4)', '최대 5개 AI 에이전트', '우선 이메일 지원', '고급 대시보드 & 분석', '워드클라우드 인사이트', '응답 실패 분석', '맞춤형 학습 데이터'
                            ].map((feat, i) => (
                                 <div key={i} className="flex items-center gap-3 text-sm text-gray-800">
                                     <div className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                                        <Icons.Check size={10} />
                                     </div>
                                     {feat}
                                 </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Enterprise */}
                <div className="bg-white rounded-2xl p-8 shadow-xl flex flex-col h-full hover:-translate-y-2 transition-transform duration-300">
                    <h3 className="text-xl font-bold text-gray-900">Enterprise</h3>
                    <p className="text-xs text-gray-500 mb-6">기업을 위한 맞춤형 솔루션</p>
                    <div className="flex items-baseline mb-6">
                        <span className="text-4xl font-bold text-gray-900">문의</span>
                    </div>
                    <button 
                        onClick={onOpenContact}
                        className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors mb-8"
                    >
                        영업팀 문의
                    </button>
                    
                    <div className="space-y-4 flex-1">
                         <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">포함된 기능</div>
                        {[
                            'Pro의 모든 기능', '무제한 AI 에이전트', '전담 계정 매니저', '24/7 전화 지원', 'API 접근', '커스텀 통합', '고급 보안 & 규정 준수', 'SLA 보장', '온프레미스 배포 옵션'
                        ].map((feat, i) => (
                             <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                                 <Icons.Check size={16} className="text-gray-300" /> {feat}
                             </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>

        {/* FAQ */}
        <div className="max-w-4xl mx-auto px-4 py-16">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-12">자주 묻는 질문</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">💳 결제 방법은 무엇인가요?</h4>
                    <p className="text-sm text-gray-500">신용카드, 체크카드, 계좌이체를 지원합니다. 모든 결제는 안전하게 암호화되어 처리됩니다.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">🔄 플랜을 변경할 수 있나요?</h4>
                    <p className="text-sm text-gray-500">언제든지 플랜을 업그레이드하거나 다운그레이드할 수 있습니다. 변경 사항은 즉시 적용됩니다.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">🚫 환불 정책은 어떻게 되나요?</h4>
                    <p className="text-sm text-gray-500">7일 이내 100% 환불이 가능합니다. 사용 기간에 대한 비례 환불도 지원합니다.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">🤝 기업용 맞춤 플랜이 있나요?</h4>
                    <p className="text-sm text-gray-500">Enterprise 플랜으로 맞춤형 솔루션을 제공합니다. 영업팀에 문의해주세요.</p>
                </div>
            </div>
        </div>
        
    </div>
  );
};

export default PricingPage;