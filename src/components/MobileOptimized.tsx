'use client';

import { useEffect, useState } from 'react';

interface MobileOptimizedProps {
  children: React.ReactNode;
}

export default function MobileOptimized({ children }: MobileOptimizedProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth <= 768;
      const landscape = window.innerWidth > window.innerHeight;
      setIsMobile(mobile);
      setIsLandscape(landscape);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    window.addEventListener('orientationchange', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
    };
  }, []);

  return (
    <div className={`
      ${isMobile ? 'mobile-optimized' : ''}
      ${isLandscape && isMobile ? 'mobile-landscape' : ''}
    `}>
      {children}
      
      {/* 移动端横屏提示 */}
      {isMobile && !isLandscape && (
        <div className="fixed bottom-4 left-4 right-4 z-50 sm:hidden">
          <div className="bg-blue-600/90 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg text-center">
            💡 横屏使用体验更佳
          </div>
        </div>
      )}
    </div>
  );
}
