import React from "react";
import { Link } from "react-router-dom";
import { PageRoute } from "../types";
import { Icons } from "../components/Icons";
import { CodeMeLogo } from "../components/CodeMeLogo";
import { HeyMeLogo } from "../components/HeyMeLogo";

interface LandingPageProps {
  onOpenLogin?: () => void;
  onOpenSignup?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({
  onOpenLogin,
  onOpenSignup,
}) => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#0a0118] rounded-[2.5rem] overflow-hidden relative shadow-2xl min-h-[500px] flex flex-col items-center justify-center text-center p-8 sm:p-12">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#1a0a3e] via-[#2d1654] to-[#0a0118] z-0"></div>
            <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[150%] bg-purple-600/20 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-[-50%] right-[-20%] w-[80%] h-[150%] bg-pink-600/20 blur-[100px] rounded-full"></div>

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-purple-600/40 text-white text-xs font-semibold mb-6 shadow-lg border border-purple-500/30">
                <Icons.Zap size={12} className="mr-2" />{" "}
                AI-Powered Personal Agent Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight whitespace-nowrap">
                당신을 대신하는 차세대 AI 플랫폼
              </h1>

              <div className="flex items-center gap-6 my-8">
                <div className="text-center">
                  <CodeMeLogo
                    size="xl"
                    showCursor={true}
                    theme="dark"
                  />
                  <p className="text-purple-300 text-xs mt-1">
                    AI Automation Platform
                  </p>
                </div>
                <Icons.ArrowRight className="text-white/50 w-8 h-8" />
                <div className="text-center">
                  <HeyMeLogo
                    size="md"
                    showCursor={true}
                    showIcon={true}
                    theme="dark"
                  />
                  <p className="text-purple-300 text-xs mt-1">
                    Personal AI Chatbot
                  </p>
                </div>
              </div>

              <p className="text-purple-200/80 text-sm sm:text-base max-w-2xl mb-12 leading-relaxed">
                <span className="whitespace-nowrap">
                  <CodeMeLogo
                    size="sm"
                    showCursor={true}
                    theme="dark"
                    className="inline-flex"
                  />{" "}
                  가 제공하는{" "}
                  <span className="text-purple-400">●</span>{" "}
                  <HeyMeLogo
                    size="xs"
                    showCursor={true}
                    theme="dark"
                    className="inline-flex"
                  />{" "}
                  는 당신을 대신해 24시간 응답합니다.
                </span>
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 sm:gap-16 w-full max-w-3xl border-t border-white/10 pt-8">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-purple-300 mb-1">
                    3분
                  </div>
                  <div className="text-xs text-purple-400">
                    AI 학습 완료
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-purple-300 mb-1">
                    24/7
                  </div>
                  <div className="text-xs text-purple-400">
                    무중단 서비스
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-[#d946ef] mb-1">
                    99%
                  </div>
                  <div className="text-xs text-purple-400">
                    AI 정확도
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold mb-4">
            🚀 간편한 이용
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            어떻게{" "}
            <span className="text-purple-600">작동하나요?</span>
          </h2>
          <p className="text-gray-500 text-sm">
            손쉽게 당신만의 AI 에이전트를 만들어보세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "정보 업로드",
              desc: "FAQ, 소개서, 대화 히스토리 등 당신의 정보를 클라우드에 업로드하세요",
              icon: (
                <Icons.Upload className="w-8 h-8 text-blue-500" />
              ),
            },
            {
              step: "02",
              title: "AI 학습",
              desc: "Hey Me가 당신의 자료를 3분 안에 학습합니다",
              icon: <span className="text-3xl">🧠</span>,
            },
            {
              step: "03",
              title: "자동 응답 시작",
              desc: "이제 AI가 당신을 대신해 24시간 자동으로 응답합니다",
              icon: (
                <Icons.Chat className="w-8 h-8 text-gray-400" />
              ),
            },
            {
              step: "04",
              title: "지속적인 개선",
              desc: "대시보드에서 분석하고, 피드백으로 AI를 더욱 똑똑하게 만드세요",
              icon: (
                <Icons.TrendingUp className="w-8 h-8 text-red-500" />
              ),
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative group hover:-translate-y-1 transition-transform duration-300"
            >
              <div
                className={`absolute -top-3 left-6 w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-lg ${
                  i === 0
                    ? "bg-purple-600"
                    : i === 1
                      ? "bg-purple-600"
                      : i === 2
                        ? "bg-purple-600"
                        : "bg-purple-600"
                }`}
              >
                {item.step}
              </div>
              <div className="mt-4 mb-4 flex justify-center">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Code:Me */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white/50">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold mb-4">
            ✨ 핵심 기능
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            왜{" "}
            <CodeMeLogo
              size="md"
              showCursor={true}
              theme="light"
              showBrackets={false}
              className="inline-flex"
            />{" "}
            인가요?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex gap-6 items-start hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center shrink-0 text-purple-600">
              <Icons.Chat size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                자연스러운 대화
              </h3>
              <p className="text-gray-500 text-sm">
                마치 당신이 직접 답하는 것처럼 자연스러운 대화를
                생성합니다
              </p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex gap-6 items-start hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center shrink-0 text-purple-600">
              <Icons.Shield size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                안전한 데이터 보호
              </h3>
              <p className="text-gray-500 text-sm">
                엔터프라이즈급 암호화로 당신의 데이터를 안전하게
                보호합니다
              </p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex gap-6 items-start hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center shrink-0 text-purple-600">
              <Icons.Clock size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                24시간 무중단
              </h3>
              <p className="text-gray-500 text-sm">
                당신이 자는 동안에도 AI가 쉬지 않고 응답합니다
              </p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex gap-6 items-start hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center shrink-0 text-purple-600">
              <Icons.Layers size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                지속적인 학습
              </h3>
              <p className="text-gray-500 text-sm">
                매 대화마다 학습하며 더 정확하고
                자연스러워집니다
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold mb-6 shadow-lg shadow-purple-200">
            <div className="flex items-center gap-2 text-sm">
              <Icons.Chat size={16} fill="currentColor" />{" "}
              사용자 후기
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            실제 사용자들의{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              생생한 경험
            </span>
          </h2>
          <p className="text-gray-600 text-lg">
            <CodeMeLogo
              size="sm"
              showCursor={true}
              theme="light"
              showBrackets={false}
              className="inline-flex"
            />
            가 어떻게 업무를 변화시켰는지 들어보세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col justify-between hover:-translate-y-2 transition-transform duration-300">
            <div>
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Icons.Zap
                    key={i}
                    size={16}
                    className="text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                "개발자로서 24시간 질문에 답변하기 힘들었는데,
                Hey Me가 제 기술 스택과 프로젝트 경험을 학습해서
                자동으로 답변해줍니다. 정말 놀라워요!"
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xl">
                김
              </div>
              <div>
                <div className="font-bold text-gray-900">
                  김민준
                </div>
                <div className="text-xs text-gray-500">
                  프리랜서 개발자
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col justify-between hover:-translate-y-2 transition-transform duration-300">
            <div>
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Icons.Zap
                    key={i}
                    size={16}
                    className="text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                "스타트업 운영하면서 고객 문의가 너무 많아
                힘들었어요. Code:Me 덕분에 FAQ를 학습시켜서 80%
                이상의 문의를 자동으로 처리하고 있습니다!"
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-xl">
                박
              </div>
              <div>
                <div className="font-bold text-gray-900">
                  박서연
                </div>
                <div className="text-xs text-gray-500">
                  스타트업 CEO
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col justify-between hover:-translate-y-2 transition-transform duration-300">
            <div>
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Icons.Zap
                    key={i}
                    size={16}
                    className="text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                "디자이너로서 클라이언트 질문이 항상 비슷한데,
                Hey Me가 제 포트폴리오와 작업 방식을 학습해서
                정확하게 답변해줍니다. 시간을 엄청 절약했어요!"
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-fuchsia-100 flex items-center justify-center text-fuchsia-600 font-bold text-xl">
                이
              </div>
              <div>
                <div className="font-bold text-gray-900">
                  이지우
                </div>
                <div className="text-xs text-gray-500">
                  UI/UX 디자이너
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto rounded-[2rem] bg-gradient-to-r from-purple-600 to-pink-600 p-12 sm:p-20 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              지금 바로 시작하세요 🚀
            </h2>
            <p className="text-purple-100 mb-8 text-lg">
              3분이면 당신만의 AI 에이전트가 준비됩니다
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={onOpenSignup || onOpenLogin}
                className="px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg"
              >
                무료로 시작하기
              </button>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white border border-white/40 rounded-lg font-semibold hover:bg-white/30 transition-colors flex items-center"
              >
                데모 보기
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;