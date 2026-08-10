import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { loginAdmin } from '../services/authService';
import { Eye, EyeOff, Mail, Lock, Heart, AlertCircle } from 'lucide-react';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [errors, setErrors] = useState({});

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const tempErrors = {};
    if (!email) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      tempErrors.password = 'Password is required';
    } else if (password.length < 4) {
      tempErrors.password = 'Password must be at least 4 characters';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const data = await loginAdmin(email, password);
      login(data, rememberMe);
      addToast(`Welcome back, ${data.admin.name}!`, 'success');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setErrorMsg(msg);
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden font-sans flex flex-col justify-center items-center py-8" style={{ backgroundColor: '#E8D5C0' }}>
      
      {/* Decorative Organic Vector Background Blobs */}
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 left-0 w-80 h-80 -translate-x-12 -translate-y-12 text-[#6E4E37]/15 fill-current pointer-events-none">
        <path d="M45,-60.2C58.8,-52.1,70.9,-39.2,74.5,-24.1C78.1,-9.1,73.2,8.2,65.8,24.1C58.4,40,48.5,54.6,35,62.3C21.6,70,4.6,70.8,-11.7,66.8C-28,62.8,-43.5,54,-54.6,41.2C-65.7,28.4,-72.3,11.5,-71,-4.8C-69.7,-21.1,-60.5,-36.8,-48.2,-45.1C-36,-53.4,-20.7,-54.4,-4.1,-48.7C12.5,-43.1,25,-44,45,-60.2Z" transform="translate(100 100)" />
      </svg>
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 right-0 w-96 h-96 translate-x-16 -translate-y-16 text-[#8B6B4A]/15 fill-current pointer-events-none">
        <path d="M52.3,-58.5C67.3,-46.8,78.5,-30.1,81.1,-11.9C83.7,6.3,77.7,26.1,66.2,41C54.7,56,37.6,66,19.3,71.2C1.1,76.4,-18.2,76.8,-35.1,69.7C-51.9,62.6,-66.2,47.9,-71.4,30.6C-76.6,13.2,-72.7,-6.8,-63.9,-23.4C-55.2,-40.1,-41.6,-53.5,-26.2,-64.8C-10.7,-76.1,6.5,-85.4,22.9,-81.9C39.2,-78.4,54.7,-62.1,52.3,-58.5Z" transform="translate(100 100)" />
      </svg>
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 left-0 w-80 h-80 -translate-x-16 translate-y-16 text-[#8B6B4A]/20 fill-current pointer-events-none">
        <path d="M42.1,-55.8C54.2,-45.5,63.4,-32.1,68,-16.8C72.5,-1.5,72.4,15.7,65.7,29.9C59,44.2,45.8,55.5,30.6,62.7C15.4,69.9,-1.8,73,-18,69.7C-34.1,66.4,-49.2,56.7,-58.2,42.8C-67.2,28.9,-70.2,10.8,-67.7,-6.1C-65.3,-22.9,-57.4,-38.4,-45.4,-48.7C-33.3,-59,-16.6,-64,0.1,-64.2C16.8,-64.4,30,-59.7,42.1,-55.8Z" transform="translate(100 100)" />
      </svg>
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 right-0 w-72 h-72 translate-x-12 translate-y-12 text-[#F5E6D3]/40 fill-current pointer-events-none">
        <path d="M38.7,-49.3C49.9,-38.4,58.7,-25.4,60.8,-11.2C63,3.1,58.6,18.7,50.1,30.7C41.7,42.7,29.2,51,15.2,55.9C1.1,60.8,-14.4,62.3,-27.6,57C-40.8,51.8,-51.7,39.7,-57.2,25.7C-62.7,11.8,-62.8,-4.1,-57.4,-17.8C-52,-31.6,-41.2,-43.3,-28.4,-53.4C-15.6,-63.5,-0.7,-72.1,12.5,-69.7C25.8,-67.4,37.4,-54.1,38.7,-49.3Z" transform="translate(100 100)" />
      </svg>

      {/* Botanical Silhouette Overlay */}
      <svg width="120" height="240" viewBox="0 0 120 240" fill="none" className="absolute left-6 bottom-12 opacity-15 pointer-events-none text-[#8B6B4A] stroke-current">
        <path d="M20 220 C40 180 50 120 40 20" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M40 20 C25 25 15 40 22 55 C35 55 42 35 40 20 Z" fill="currentColor" opacity="0.6"/>
        <path d="M42 50 C60 52 70 42 65 28 C50 30 45 42 42 50 Z" fill="currentColor" opacity="0.6"/>
        <path d="M45 80 C28 85 18 100 28 115 C42 112 47 95 45 80 Z" fill="currentColor" opacity="0.6"/>
        <path d="M45 110 C65 112 75 102 70 88 C55 90 50 102 45 110 Z" fill="currentColor" opacity="0.6"/>
        <path d="M43 140 C28 148 20 165 32 178 C45 172 48 155 43 140 Z" fill="currentColor" opacity="0.6"/>
        <path d="M42 170 C60 172 70 162 65 148 C50 150 45 162 42 170 Z" fill="currentColor" opacity="0.6"/>
      </svg>

      {/* Main Card Container — Smaller max-width for more elegant layout */}
      <div className="relative z-10 flex items-center justify-center px-4 sm:px-6 w-full">
        <div className="w-full max-w-4xl bg-white/90 backdrop-blur-md rounded-[32px] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 border border-white/60">
          
          {/* Left Side — Login Form */}
          <div className="px-6 sm:px-10 py-8 lg:py-10 flex flex-col justify-center relative">
            
            {/* Decorative leaf illustration (bottom-left) */}
            <div className="absolute bottom-4 left-4 opacity-10 pointer-events-none">
              <svg width="80" height="120" viewBox="0 0 80 120" fill="none">
                <path d="M10 110 C10 60 40 20 70 10 C50 30 35 70 40 110 Z" fill="#8B6B4A"/>
                <path d="M5 105 C15 75 30 45 55 25" stroke="#8B6B4A" strokeWidth="1.5" fill="none"/>
              </svg>
            </div>

            {/* Brand Logo */}
            <div className="text-center mb-6">
              {/* Candle Icon */}
              <div className="mx-auto mb-2">
                <svg width="52" height="52" viewBox="0 0 64 64" fill="none" className="mx-auto">
                  {/* Leaf decorations */}
                  <path d="M18 22 C14 18 16 10 22 8 C20 14 18 18 20 22 Z" fill="#C4A882" opacity="0.7"/>
                  <path d="M46 22 C50 18 48 10 42 8 C44 14 46 18 44 22 Z" fill="#C4A882" opacity="0.7"/>
                  {/* Flame */}
                  <ellipse cx="32" cy="18" rx="5" ry="8" fill="#D4A060" opacity="0.8"/>
                  <ellipse cx="32" cy="20" rx="3" ry="5" fill="#E8C888"/>
                  {/* Candle body */}
                  <rect x="24" y="26" width="16" height="22" rx="3" fill="#F5E6D3" stroke="#C4A882" strokeWidth="1.5"/>
                  {/* Candle base/holder */}
                  <rect x="20" y="48" width="24" height="6" rx="2" fill="#E8D5C0" stroke="#C4A882" strokeWidth="1"/>
                  {/* Label lines on candle */}
                  <line x1="28" y1="34" x2="36" y2="34" stroke="#C4A882" strokeWidth="0.8"/>
                  <line x1="29" y1="37" x2="35" y2="37" stroke="#C4A882" strokeWidth="0.6"/>
                </svg>
              </div>
              <h1 className="text-xl font-serif tracking-wider font-semibold" style={{ color: '#6E4E37' }}>
                The Candle Tales
              </h1>
              <p className="text-[9px] tracking-[0.25em] uppercase mt-0.5 font-semibold" style={{ color: '#B89B78' }}>
                Light • Love • Story
              </p>
            </div>

            {/* Welcome Text */}
            <div className="mb-5">
              <h2 className="text-xl font-serif font-bold" style={{ color: '#3D2E1F' }}>
                Welcome Back
              </h2>
              <p className="text-xs mt-1 flex items-center gap-1.5" style={{ color: '#8B7B6B' }}>
                Sign in to continue your candle journey <Heart className="h-3.5 w-3.5 text-[#C4A882]" fill="#C4A882" />
              </p>
            </div>

            {/* Error Banner */}
            {errorMsg && (
              <div className="mb-4 p-3 bg-rose-50 border-l-4 border-rose-500 rounded-lg flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs font-medium text-rose-800">{errorMsg}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold mb-1" style={{ color: '#3D2E1F' }}>
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#B89B78' }} />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="youremail@gmail.com"
                    className={`w-full pl-11 pr-4 py-2.5 border rounded-xl text-xs focus:outline-none focus:ring-2 transition-all ${
                      errors.email
                        ? 'border-rose-300 bg-rose-50/50 focus:ring-rose-200'
                        : 'border-[#E0D0C0] bg-[#FBF8F4] focus:ring-[#C4A882]/30 focus:border-[#C4A882]'
                    }`}
                    style={{ color: '#5A4A3A' }}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-[10px] text-rose-500 font-medium">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-xs font-semibold mb-1" style={{ color: '#3D2E1F' }}>
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#B89B78' }} />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    className={`w-full pl-11 pr-12 py-2.5 border rounded-xl text-xs focus:outline-none focus:ring-2 transition-all ${
                      errors.password
                        ? 'border-rose-300 bg-rose-50/50 focus:ring-rose-200'
                        : 'border-[#E0D0C0] bg-[#FBF8F4] focus:ring-[#C4A882]/30 focus:border-[#C4A882]'
                    }`}
                    style={{ color: '#5A4A3A' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer transition-colors"
                    style={{ color: '#B89B78' }}
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-[10px] text-rose-500 font-medium">{errors.password}</p>
                )}
              </div>

              {/* Remember Me + Forgot Password row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-gray-300 cursor-pointer accent-[#8B6B4A]"
                  />
                  <label htmlFor="remember-me" className="text-[11px] font-medium cursor-pointer" style={{ color: '#8B7B6B' }}>
                    Remember Me
                  </label>
                </div>
                <span className="text-[11px] font-semibold cursor-pointer hover:underline" style={{ color: '#8B6B4A' }}>
                  Forgot Password?
                </span>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                style={{ 
                  backgroundColor: '#8B6B4A',
                  boxShadow: '0 4px 14px rgba(139, 107, 74, 0.3)'
                }}
                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#6E4E37'; }}
                onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#8B6B4A'; }}
              >
                {loading ? (
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <>
                    {/* Small candle icon inside button */}
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                      <ellipse cx="10" cy="4" rx="2.5" ry="3.5" fill="#F5E6D3" opacity="0.9"/>
                      <rect x="7.5" y="7" width="5" height="8" rx="1.5" fill="#F5E6D3" opacity="0.7"/>
                      <rect x="6" y="15" width="8" height="2.5" rx="1" fill="#F5E6D3" opacity="0.5"/>
                    </svg>
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px" style={{ backgroundColor: '#E0D0C0' }} />
              <span className="text-[11px] font-medium" style={{ color: '#B89B78' }}>or</span>
              <div className="flex-1 h-px" style={{ backgroundColor: '#E0D0C0' }} />
            </div>

            {/* Create Account Link */}
            <p className="text-center text-xs" style={{ color: '#8B7B6B' }}>
              New here?{' '}
              <span className="font-semibold cursor-pointer hover:underline" style={{ color: '#8B6B4A' }}>
                Create an account
              </span>
            </p>
          </div>

          {/* Right Side — Hero Candle Image with Embedded Navigation */}
          <div className="hidden lg:block relative">
            <img
              src="/candle-login-hero.jpg"
              alt="The Candle Tales handpoured soy candle on a wooden board"
              className="w-full h-full object-cover"
              style={{ minHeight: '520px' }}
            />
            
            {/* Embedded Card Navigation Overlay (Upper Right Corner of Card Image) */}
            <nav className="absolute top-6 right-8 flex items-center gap-5 text-xs font-semibold z-20">
              <Link to="/" className="text-[#6E4E37] hover:text-[#3D2E1F] border-b-2 border-[#6E4E37] pb-0.5 transition-colors">Home</Link>
              <Link to="/products" className="text-[#8B6B4A] hover:text-[#6E4E37] transition-colors">Shop</Link>
              <Link to="/about" className="text-[#8B6B4A] hover:text-[#6E4E37] transition-colors">Our Story</Link>
              <Link to="/contact" className="text-[#8B6B4A] hover:text-[#6E4E37] transition-colors">Contact</Link>
            </nav>

            {/* Help badge bottom-right */}
            <span className="absolute bottom-6 right-6 text-xs font-semibold text-white/80 bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-lg cursor-pointer hover:bg-black/30 transition-colors">
              Help
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
