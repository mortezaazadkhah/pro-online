
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-indigo-600">
      <div className="w-6 h-6 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
