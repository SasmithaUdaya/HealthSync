import { BellDot } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center">

      <div>
        <Link to="/" className="text-xl font-bold">LOGO</Link>
      </div>

      <div className="flex space-x-4">
        <Link to="/" className="hover:text-orange-500">HOME</Link>
        <Link to="/about" className="hover:text-orange-500">ABOUT US</Link>
        <Link to="/blog" className="hover:text-orange-500">BLOG</Link>
      </div>

      <div>
        <Link to="/notifications" className="relative">
            <BellDot className='text-white' />
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
            3
          </span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;