import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CartBadge from './CartBadge';
import { Menu, X, Sparkles } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Candles', path: '/products' },
    { name: 'Our Story', path: '/about' },
    { name: 'Get in Touch', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5] border-b border-[#E9DFD0] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 min-[800px]:px-12">
        <div className="flex items-center justify-between h-20 min-[800px]:h-[90px] relative">
          
          {/* Hamburger Menu Button - Left-aligned */}
          <div className="flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-10 h-10 min-[800px]:w-12 min-[800px]:h-12 flex items-center justify-center hover:bg-[#E9DFD0]/30 rounded-full transition-colors cursor-pointer text-[#3D2E1F]"
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? <X className="h-6 w-6 min-[800px]:h-7 min-[800px]:w-7" /> : <Menu className="h-6 w-6 min-[800px]:h-7 min-[800px]:w-7" />}
            </button>
          </div>

          {/* Logo & Brand Name - Centered */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3.5 select-none">
            <Link to="/" className="flex items-center gap-2 sm:gap-3">
              <div className="h-10 w-10 min-[800px]:h-15 min-[800px]:w-15 bg-[#5A4634] rounded-full flex items-center justify-center text-white shadow-sm flex-shrink-0">
                <Sparkles className="h-5 w-5 min-[800px]:h-7 min-[800px]:w-7 text-[#B08A4A] fill-[#B08A4A]" />
              </div>
              <span className="font-serif font-bold text-lg min-[800px]:text-[32px] tracking-wide text-[#3D2E1F] whitespace-nowrap">
                The Candle Tales
              </span>
            </Link>
          </div>

          {/* Cart Badge - Right-aligned */}
          <div className="flex items-center">
            <CartBadge />
          </div>
        </div>
      </div>

      {/* Mobile/Desktop Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#FAF8F5] border-b border-[#E9DFD0] px-6 pt-2 pb-6 space-y-1 shadow-md animate-slideDown z-50">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-bold transition-all ${
                  isActive ? 'bg-[#E9DFD0] text-[#5A4634]' : 'text-gray-700 hover:bg-gray-100/50'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};

export default Navbar;
