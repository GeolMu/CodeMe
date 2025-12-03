import React from 'react';
import { CodeMeLogo } from './CodeMeLogo';
import { HeyMeLogo } from './HeyMeLogo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1a0b2e] text-white py-12 border-t border-purple-900 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-purple-900/20 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center gap-3">
             <CodeMeLogo size="md" showCursor={true} theme="dark" />
             <span className="text-gray-400 mx-2">×</span>
             <HeyMeLogo size="xs" showCursor={true} showIcon={true} theme="dark" />
          </div>
          
          <p className="text-gray-400 text-sm">당신을 대신하는 AI 플랫폼</p>
          
          <div className="w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-purple-800 to-transparent" style={{ marginTop: '10px', marginBottom: '10px' }} />
          
          <div className="text-center">
            <p className="text-gray-500 text-xs">
              © 2025 <CodeMeLogo size="xs" showCursor={true} theme="dark" showBrackets={false} className="inline-flex" />. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;