
import React from 'react';
import { InfoIcon } from './IconComponents';

interface PreviewProps {
  isVisible: boolean;
  onClose: () => void;
}

const Preview: React.FC<PreviewProps> = ({ isVisible, onClose }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="w-full max-w-6xl bg-indigo-900/50 border border-indigo-700 rounded-lg p-4 md:p-6 mb-8 backdrop-blur-sm shadow-2xl transition-all duration-500 animate-fade-in-down">
      <div className="flex flex-col md:flex-row items-center">
        <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
          <InfoIcon className="w-12 h-12 text-indigo-300" />
        </div>
        <div className="flex-grow text-center md:text-right">
          <h2 className="text-xl font-bold mb-2">چگونه کار می‌کند؟</h2>
          <p className="text-gray-300">
            ۱. یک عکس تمام قد از خودتان بارگذاری کنید. ۲. عکس لباس مورد نظر را بارگذاری کنید. ۳. دکمه "پرو مجازی" را بزنید و نتیجه شگفت‌انگیز را ببینید!
          </p>
        </div>
        <div className="mt-4 md:mt-0 md:ml-6">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-rose-600 text-white font-semibold rounded-md hover:bg-rose-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            متوجه شدم
          </button>
        </div>
      </div>
    </div>
  );
};

export default Preview;
