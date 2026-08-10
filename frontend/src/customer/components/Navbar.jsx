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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-150/70 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 relative">
          
          {/* Mobile Menu Button - Left-aligned on mobile only */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 hover:bg-[#CBB59B]/10 rounded-full transition-colors cursor-pointer text-[#3D2E1F]"
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Logo - Centered on mobile, Left-aligned on desktop */}
          <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 flex-shrink-0">
            <Link to="/" className="flex items-center gap-2 sm:gap-2.5 font-serif text-[#6E4E37]">
              <div className="h-8.5 w-8.5 sm:h-9 sm:w-9 bg-[#8B6B4A] rounded-full flex items-center justify-center text-white shadow-sm flex-shrink-0">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-semibold text-base sm:text-lg tracking-wider">The Candle Tales</span>
            </Link>
          </div>

          {/* Desktop Navigation Links - Centered */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-700">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`hover:text-primary transition-colors py-2 relative ${
                    isActive ? 'text-primary' : ''
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Cart Badge - Right-aligned (both mobile and desktop) */}
          <div className="flex items-center">
            <CartBadge />
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-4 space-y-1 shadow-md animate-slideDown">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                  isActive ? 'bg-bg-cream text-primary' : 'text-gray-600 hover:bg-gray-50'
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
