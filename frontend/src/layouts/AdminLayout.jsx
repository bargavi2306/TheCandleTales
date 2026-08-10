import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  LayoutDashboard, 
  Layers, 
  Package, 
  LogOut, 
  Menu, 
  ChevronLeft, 
  ChevronDown,
  User,
  Sparkles,
  X
} from 'lucide-react';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  // Handle auto-collapse sidebar on resize
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on mobile navigation
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  // axios interceptor session expiry event listener
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
      addToast("Session expired. Please log in again.", "error");
      navigate('/login', { replace: true });
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [logout, addToast, navigate]);

  const handleLogout = () => {
    logout();
    addToast("Logged out successfully.", "success");
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Categories', path: '/admin/categories', icon: Layers },
    { name: 'Products', path: '/admin/products', icon: Package },
  ];

  return (
    <div className="min-h-screen flex bg-[#EDE6DC]/40 font-sans relative overflow-x-hidden">
      {/* Mobile Drawer Backdrop */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black/40 z-45 transition-opacity duration-300"
        />
      )}

      {/* Sidebar — Custom Taupe/Beige Color Scheme */}
      <aside 
        className={`bg-[#E6DCCF] text-[#5A4A3A] border-r border-[#D8C8B5]/40 flex flex-col justify-between transition-all duration-300 shadow-lg 
          fixed inset-y-0 left-0 z-50 md:relative md:translate-x-0
          ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 w-20'}
        `}
      >
        <div>
          {/* Brand Header */}
          <div className="py-6 flex flex-col items-center justify-center border-b border-[#D8C8B5]/40 px-4 relative">
            {/* Mobile Close Button */}
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden absolute top-4 right-4 p-1 rounded-full hover:bg-[#CBB59B]/20 text-[#5A4A3A]"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            <div className={`flex flex-col items-center justify-center text-center ${!isSidebarOpen && 'hidden'}`}>
              {/* Candle Icon with Leaf decorations */}
              <svg width="44" height="44" viewBox="0 0 64 64" fill="none" className="mb-2">
                {/* Leaf decorations */}
                <path d="M18 22 C14 18 16 10 22 8 C20 14 18 18 20 22 Z" fill="#C4A882" opacity="0.7"/>
                <path d="M46 22 C50 18 48 10 42 8 C44 14 46 18 44 22 Z" fill="#C4A882" opacity="0.7"/>
                {/* Flame */}
                <ellipse cx="32" cy="18" rx="5" ry="8" fill="#D4A060" opacity="0.8"/>
                <ellipse cx="32" cy="20" rx="3" ry="5" fill="#E8C888"/>
                {/* Candle body */}
                <rect x="24" y="26" width="16" height="22" rx="3" fill="#F5E6D3" stroke="#C4A882" strokeWidth="1.5"/>
                {/* Candle base */}
                <rect x="20" y="48" width="24" height="6" rx="2" fill="#E8D5C0" stroke="#C4A882" strokeWidth="1"/>
                <line x1="28" y1="34" x2="36" y2="34" stroke="#C4A882" strokeWidth="0.8"/>
              </svg>
              <span className="font-serif tracking-wider font-semibold text-base text-[#6E4E37]">The Candle Tales</span>
              <span className="text-[9px] tracking-[0.2em] text-[#B89B78] uppercase mt-0.5 font-bold">LIGHT • LOVE • STORY</span>
            </div>
            {!isSidebarOpen && (
              <div className="text-[#6E4E37]">
                <Sparkles className="h-6 w-6" />
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 px-3 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-[#CBB59B]/50 text-[#3D2E1F] font-semibold shadow-sm' 
                      : 'text-[#5A4A3A]/75 hover:text-[#3D2E1F] hover:bg-[#CBB59B]/20'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <Icon className="h-4.5 w-4.5 flex-shrink-0" />
                    <span className={`${!isSidebarOpen && 'hidden'} transition-opacity duration-300`}>
                      {item.name}
                    </span>
                  </div>
                  {isActive && isSidebarOpen && (
                    <span className="text-[#C4A882] font-semibold text-xs ml-auto">♡</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer with Logout & Quote Card */}
        <div className="p-3 border-t border-[#D8C8B5]/40 space-y-3">
          {/* Quote Card from the mockup */}
          {isSidebarOpen && (
            <div className="relative bg-[#F3ECE3]/80 border border-[#E0D5C5] rounded-2xl p-4 overflow-hidden shadow-xs">
              {/* Botanical Leaf Art silhouette */}
              <div className="absolute bottom-1 left-1 opacity-10 pointer-events-none text-[#8B6B4A]">
                <svg width="40" height="50" viewBox="0 0 80 120" fill="none">
                  <path d="M10 110 C10 60 40 20 70 10 C50 30 35 70 40 110 Z" fill="currentColor"/>
                </svg>
              </div>
              <p className="text-[11px] text-[#6E4E37] leading-relaxed relative z-10 font-medium">
                Every candle has a story. Add yours beautifully. <span className="text-[#C4A882] text-xs">♡</span>
              </p>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-700 hover:text-rose-900 hover:bg-rose-100/20 transition-all duration-200"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            <span className={`${!isSidebarOpen && 'hidden'}`}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header/TopNav */}
        <header className="h-16 bg-[#FBF8F4]/80 backdrop-blur-md border-b border-[#D8C8B5]/20 flex items-center justify-between px-4 sm:px-6 shadow-xs relative">
          {/* Left Section: Mobile Menu Trigger or Desktop Page Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-1.5 text-[#5A4A3A] hover:bg-[#CBB59B]/25 rounded-xl transition-colors cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="hidden md:flex text-lg font-serif tracking-wide text-[#3D2E1F] font-semibold items-center gap-1">
              {navItems.find(item => location.pathname === item.path)?.name || 'Admin Panel'}
              <span className="text-[#C4A882]/80 font-medium">♡</span>
            </h2>
          </div>

          {/* Mobile Centered Title */}
          <h2 className="md:hidden text-base font-serif font-bold text-[#3D2E1F] absolute left-1/2 -translate-x-1/2 flex items-center gap-1">
            {navItems.find(item => location.pathname === item.path)?.name || 'Admin'}
            <span className="text-[#C4A882]/80 font-medium text-xs">♡</span>
          </h2>

          {/* Right Section: User Badge */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 cursor-pointer group">
              <Sparkles className="h-4.5 w-4.5 text-[#C4A882]/40 hidden sm:block mr-0.5" />
              <div className="text-right hidden sm:block">
                <p className="text-[10px] text-[#8B7B6B] font-medium leading-none">Hello,</p>
                <p className="text-xs font-bold text-[#3D2E1F] mt-0.5">{user?.name || 'Admin'}</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-[#E5D9C8] text-[#5A4A3A] border border-[#CBB59B]/30 flex items-center justify-center font-bold text-xs shadow-inner">
                {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'A'}
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-[#5A4A3A]/70 group-hover:text-[#3D2E1F] transition-colors hidden sm:block" />
            </div>
          </div>
        </header>

        {/* Page Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
