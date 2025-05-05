import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-primary-dark text-white p-4 flex justify-between items-center">
      {/* Logo */}
      <div>
        <Link to="/" className="text-2xl font-bold">LOGO</Link>
      </div>

      {/* Navigation Links */}
      <nav className="hidden md:block space-x-4">
        <Link to="/" className="hover:text-secondary-orange">HOME</Link>
        <Link to="/about" className="hover:text-secondary-orange">ABOUT US</Link>
        <Link to="/schedule" className="hover:text-secondary-orange">SCHEDULE</Link>
        <Link to="/blog" className="hover:text-secondary-orange">BLOG</Link>
        <Link to="/contacts" className="hover:text-secondary-orange">CONTACTS</Link>
      </nav>

      {/* Search Bar (Desktop Only) */}
      <div className="md:block hidden">
        <input
          type="text"
          placeholder="Search here ..."
          className="px-4 py-2 rounded-lg border border-secondary-orange focus:outline-none"
        />
      </div>

      {/* Social Icons (Desktop Only) */}
      <div className="md:block hidden space-x-2">
        <a href="#" className="text-secondary-orange hover:text-white">
          <i className="fab fa-facebook"></i>
        </a>
        <a href="#" className="text-secondary-orange hover:text-white">
          <i className="fab fa-instagram"></i>
        </a>
      </div>
    </header>
  );
};

export default Header;