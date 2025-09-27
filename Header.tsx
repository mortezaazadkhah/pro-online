
import React from 'react';
import { OutfitIcon } from './IconComponents';

const Header: React.FC = () => {
  return (
    <header className="py-4 px-8 bg-black/20 backdrop-blur-sm z-20 w-full shadow-lg">
      <div className="container mx-auto flex items-center justify-center">
        <OutfitIcon className="w-10 h-10 text-indigo-400" />
        <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-rose-400 ml-4">
          اتاق پرو آنلاین
        </h1>
      </div>
    </header>
  );
};

export default Header;
