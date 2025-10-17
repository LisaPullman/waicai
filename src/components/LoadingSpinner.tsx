'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  text = '加载中...', 
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-purple-200 border-t-purple-600`}></div>
        <div className="absolute inset-0 flex items-center justify-center text-lg">
          🤖
        </div>
      </div>
      {text && (
        <p className={`mt-2 text-purple-600 font-medium ${textSizeClasses[size]}`}>
          {text}
        </p>
      )}
    </div>
  );
}

// AI 猜测专用的加载组件
export function AIGuessLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`text-center ${className}`}>
      <div className="relative mb-4">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
        <div className="absolute inset-0 flex items-center justify-center text-2xl">🤖</div>
      </div>
      <p className="text-purple-600 text-base font-medium mb-2">AI正在分析你的画作...</p>
      <p className="text-gray-500 text-sm">这可能需要几秒钟时间</p>
      
      {/* 进度指示器 */}
      <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
        <div className="bg-purple-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
      </div>
    </div>
  );
}
