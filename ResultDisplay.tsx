
import React from 'react';
import { ImageIcon, AlertTriangleIcon, SparklesIcon } from './IconComponents';

interface ResultDisplayProps {
  image: string | null;
  isLoading: boolean;
  error: string | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ image, isLoading, error }) => {
  const AnimatedSparkles = () => (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(5)].map((_, i) => (
        <SparklesIcon key={i} className="absolute w-8 h-8 text-indigo-400/70 animate-pulse" style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 2}s`,
        }} />
      ))}
    </div>
  );

  return (
    <div className="relative w-full h-80 bg-gray-800/50 border-2 border-gray-600 rounded-xl p-4 flex items-center justify-center text-center overflow-hidden">
      {isLoading && (
        <div className="flex flex-col items-center text-gray-300">
          <AnimatedSparkles />
          <svg className="animate-spin h-12 w-12 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-lg font-semibold">در حال پردازش...</p>
        </div>
      )}
      {!isLoading && error && (
        <div className="flex flex-col items-center text-rose-400">
          <AlertTriangleIcon className="w-12 h-12 mb-4" />
          <h3 className="text-lg font-semibold">خطا</h3>
          <p className="text-sm">{error}</p>
        </div>
      )}
      {!isLoading && !error && image && (
        <img src={`data:image/png;base64,${image}`} alt="Result" className="max-h-full max-w-full object-contain rounded-md animate-fade-in" />
      )}
      {!isLoading && !error && !image && (
        <div className="flex flex-col items-center text-gray-500">
          <ImageIcon className="w-12 h-12 mb-4" />
          <h3 className="text-lg font-semibold">۳. نتیجه نهایی</h3>
          <p>نتیجه پرو مجازی اینجا نمایش داده می‌شود</p>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;
