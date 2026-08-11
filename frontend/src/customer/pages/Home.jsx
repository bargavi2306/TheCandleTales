import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import { useToast } from '../../context/ToastContext';
import { BUSINESS_CONFIG } from '../../config/businessConfig';
import { Sparkles, ArrowRight, BookOpen, MessageCircle, Heart } from 'lucide-react';
import { getImageUrl } from '../../utils/imageUtil';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [catsRes, prodsRes] = await Promise.all([
          getCategories(),
          getProducts()
        ]);
        setCategories(catsRes.data || []);
        setProducts(prodsRes.data || []);
      } catch (err) {
        console.error(err);
        addToast("Unable to load home page content.", "error");
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, [addToast]);

  const featuredProducts = products.filter(p => p.featured).slice(0, 4);
  const bestsellerProducts = products.filter(p => p.bestSeller).slice(0, 4);

  return (
    <div className="pb-12 sm:pb-20 font-sans bg-[#FAF8F5] text-[#3D2E1F]">
      
      {/* 1. Main Hero Banner */}
      <section className="relative bg-[#FAF6F0] text-[#3D2E1F] overflow-hidden min-h-[350px] sm:min-h-[450px] lg:min-h-[610px] flex items-center px-4 sm:px-6 lg:px-8">
        {/* Full-bleed background image for desktop (lg and up) - taking ~58% width */}
        <div className="absolute inset-y-0 right-0 w-[58%] bg-cover bg-no-repeat bg-center hidden lg:block" style={{ backgroundImage: "url('/hero_candle_tray.jpg')" }}></div>
        
        {/* Soft fade overlay to blend text and background on desktop */}
        <div className="absolute inset-y-0 right-[58%] w-[15%] bg-gradient-to-r from-[#FAF6F0] to-transparent hidden lg:block"></div>
        
        {/* Soft color overlay over the entire image background on mobile */}
        <div className="absolute inset-0 bg-[#FAF6F0] lg:hidden block"></div>
        
        <div className="relative max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-8 lg:py-0">
          {/* Left Column: Text Content (~40% width) */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start max-w-xl mx-auto lg:mx-0">
            <span className="font-serif italic text-lg sm:text-xl lg:text-2xl text-[#806747] block">
              Timeless Scents,
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-[68px] lg:leading-[1.0] font-serif font-bold text-[#3D2E1F] leading-[1.1]">
              Made Just<br className="hidden lg:block"/> For You
            </h1>
            
            {/* Elegant Separator */}
            <div className="flex items-center gap-3 py-1 w-full justify-center lg:justify-start">
              <span className="h-[1px] w-12 bg-[#B08A4A]/40"></span>
              <span className="text-[#B08A4A] text-xs">✦</span>
              <span className="h-[1px] w-12 bg-[#B08A4A]/40"></span>
            </div>

            <p className="text-sm sm:text-[15px] lg:text-[22px] lg:leading-[1.5] text-[#5A4634] max-w-md leading-relaxed font-light">
              Luxury candles crafted to bring warmth, calm, and beauty to your space.
            </p>

            <div className="pt-2 flex flex-col items-center lg:items-start gap-3.5 w-full max-w-[280px]">
              <Link
                to="/products"
                className="bg-[#5A4634] hover:bg-[#4A3728] text-white w-full h-[54px] rounded-[28px] font-bold transition-all text-base sm:text-[17px] flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#5A4634]/15 hover:scale-105 duration-300"
              >
                Shop Now <ArrowRight className="h-4 w-4" />
              </Link>
              
              <a
                href={`https://wa.me/${BUSINESS_CONFIG.whatsAppNumber}?text=${encodeURIComponent('Hello The Candle Tales, I have a question about your candles!')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-gray-50 text-[#5A4634] border-2 border-[#5A4634] w-full h-[54px] rounded-[28px] font-bold transition-all text-base sm:text-[17px] flex items-center justify-center gap-2"
              >
                {/* WhatsApp brand green icon */}
                <svg className="h-5 w-5 fill-green-500 text-green-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.114-2.905-6.99C16.557 1.875 14.079.843 11.45.843 6.015.843 1.59 5.263 1.587 10.702c-.001 1.674.452 3.303 1.311 4.747L1.87 20.06l4.777-1.253.001.001.001-.002z"/>
                </svg>
                Chat on WhatsApp
              </a>
              
              <span className="text-[12px] sm:text-[14px] text-gray-500 mt-1 font-medium tracking-wide text-center">
                *Only for customization and bulk orders
              </span>
            </div>
          </div>

          {/* Right Column: Image (Visible on mobile/tablet below lg to keep layout compact) */}
          <div className="lg:hidden col-span-1 flex justify-center w-full mt-4">
            <div className="relative w-full max-w-md aspect-[16/10] rounded-[24px] overflow-hidden shadow-md border border-white">
              <img 
                src="/hero_candle_tray.jpg" 
                alt="Luxury burning candles in textured glass jars" 
                className="h-full w-full object-cover" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trust/Benefits Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-14 relative z-10 w-[95%]">
        <div className="bg-white rounded-[28px] sm:rounded-[32px] border border-[#E9DFD0] shadow-md p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 items-center">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3">
            <div className="p-2.5 bg-[#FAF6F0] rounded-2xl text-[#5A4634] flex-shrink-0">
              <Sparkles className="h-5.5 w-5.5 sm:h-6 sm:w-6" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs sm:text-sm font-bold text-[#3D2E1F] uppercase tracking-wide">Natural Wax</h4>
              <p className="text-[10px] sm:text-xs text-[#806747] font-light leading-snug">Made with<br/>pure soy wax</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 border-l-0 md:border-l border-[#E9DFD0] pl-0 md:pl-6">
            <div className="p-2.5 bg-[#FAF6F0] rounded-2xl text-[#5A4634] flex-shrink-0">
              {/* Truck Icon */}
              <svg className="h-5.5 w-5.5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs sm:text-sm font-bold text-[#3D2E1F] uppercase tracking-wide">Free Shipping</h4>
              <p className="text-[10px] sm:text-xs text-[#806747] font-light leading-snug">On all orders<br/>above ₹999</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 border-l-0 md:border-l border-[#E9DFD0] pl-0 md:pl-6">
            <div className="p-2.5 bg-[#FAF6F0] rounded-2xl text-[#5A4634] flex-shrink-0">
              {/* Shield Icon */}
              <svg className="h-5.5 w-5.5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs sm:text-sm font-bold text-[#3D2E1F] uppercase tracking-wide">Secure Payment</h4>
              <p className="text-[10px] sm:text-xs text-[#806747] font-light leading-snug">100% safe &<br/>trusted</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 border-l-0 md:border-l border-[#E9DFD0] pl-0 md:pl-6">
            <div className="p-2.5 bg-[#FAF6F0] rounded-2xl text-[#5A4634] flex-shrink-0">
              {/* Refresh Icon */}
              <svg className="h-5.5 w-5.5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3 3L22 4" />
              </svg>
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs sm:text-sm font-bold text-[#3D2E1F] uppercase tracking-wide">Easy Returns</h4>
              <p className="text-[10px] sm:text-xs text-[#806747] font-light leading-snug">30 days return<br/>policy</p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Featured Creations Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-[45px] lg:mt-[55px]">
        {/* Eyebrow */}
        <div className="text-center">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#806747] flex items-center justify-center gap-1.5">
            Selected Pieces ♡
          </span>
        </div>

        {/* Heading */}
        <div className="text-center mt-3 sm:mt-4">
          <h2 className="text-[28px] sm:text-4xl lg:text-[48px] font-serif text-[#3D2E1F] font-bold tracking-tight">
            Featured Creations
          </h2>
        </div>

        {/* Product Grid */}
        <div className="mt-[30px] lg:mt-[40px]">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {[1, 2, 3, 4].map(n => <SkeletonCard key={n} />)}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="bg-white border border-[#E9DFD0] p-8 rounded-[24px] text-center text-gray-500 shadow-xs">
              No featured items found.
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {featuredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="text-center pt-2">
                <Link 
                  to="/products" 
                  className="inline-flex items-center gap-1.5 text-[#806747] hover:text-[#5A4634] text-xs sm:text-sm font-bold cursor-pointer group transition-colors"
                >
                  View All Products <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. Shop By Category row connected with dashed lines */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-[35px] lg:mt-[45px] text-center space-y-6 sm:space-y-8">
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-3">
            <span className="text-[#B08A4A] text-sm">✦</span>
            <h2 className="text-[28px] sm:text-4xl lg:text-[48px] font-serif text-[#3D2E1F] font-bold uppercase tracking-wide">
              Shop By Category
            </h2>
            <span className="text-[#B08A4A] text-sm">✦</span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center gap-6 overflow-x-auto pb-4">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-28 w-28 bg-gray-200 rounded-full animate-pulse"></div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <p className="text-sm text-gray-500">No categories found.</p>
        ) : (
          <div className="flex overflow-x-auto md:flex-wrap md:justify-center gap-6 pb-6 scrollbar-none snap-x flex-nowrap justify-start pl-4 md:pl-0">
            {categories.map((cat, idx) => (
              <React.Fragment key={cat.id}>
                <button
                  onClick={() => navigate(`/products?category=${encodeURIComponent(cat.name)}`)}
                  className="group flex flex-col items-center gap-3.5 cursor-pointer focus:outline-none flex-shrink-0 snap-center"
                >
                  <div className="h-24 w-24 rounded-full border border-[#E9DFD0] bg-white flex items-center justify-center shadow-xs group-hover:shadow-sm transition-all group-hover:scale-105 duration-300 relative">
                    <div className="h-20 w-20 rounded-full overflow-hidden">
                      <img 
                        src={getImageUrl(cat.image, 'https://via.placeholder.com/150')} 
                        alt={cat.name} 
                        className="h-full w-full object-cover" 
                      />
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-[#806747] uppercase tracking-wider group-hover:text-primary transition-colors text-center max-w-[110px]">
                    {cat.name}
                  </span>
                </button>
              </React.Fragment>
            ))}
          </div>
        )}
      </section>

      {/* 5. Best Selling Candles Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-[35px] lg:mt-[45px] space-y-6">
        <div className="text-center space-y-2.5">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-10 sm:w-20 bg-[#B08A4A]/30"></span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#806747] flex items-center gap-1.5">
              Store Favorites <Heart className="h-3.5 w-3.5 text-rose-400 fill-rose-100" />
            </span>
            <span className="h-px w-10 sm:w-20 bg-[#B08A4A]/30"></span>
          </div>
          <h2 className="text-[28px] sm:text-4xl lg:text-[48px] font-serif text-[#3D2E1F] font-bold tracking-tight text-center">
            Best Selling Scents
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map(n => <SkeletonCard key={n} />)}
          </div>
        ) : bestsellerProducts.length === 0 ? (
          <div className="p-8 text-center text-gray-500 bg-white border border-[#E9DFD0] rounded-[24px] shadow-xs">
            No best-sellers found.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestsellerProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 6. Brand Narrative/Handmade with Love Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-[40px]">
        <div className="bg-[#FAF5EE] border border-[#E9DFD0] rounded-[28px] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs text-left">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 bg-white rounded-2xl border border-[#E9DFD0] flex items-center justify-center text-[#5A4634] flex-shrink-0 shadow-inner">
              {/* Gift Outline Icon */}
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-[#3D2E1F]">Handmade with love</h3>
              <p className="text-xs sm:text-sm text-[#5A4634] font-light leading-relaxed max-w-xl">
                Every candle is carefully handcrafted for a unique and premium experience.
              </p>
            </div>
          </div>
          <Link
            to="/about"
            className="w-full sm:w-auto bg-[#5A4634] hover:bg-[#4A3728] text-white px-6 py-3 rounded-full font-bold text-xs transition-all shadow-md shadow-[#5A4634]/10 text-center flex items-center justify-center gap-1.5 cursor-pointer"
          >
            Explore Collections <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;
