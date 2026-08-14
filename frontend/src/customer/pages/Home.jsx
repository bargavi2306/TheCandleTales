import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import { useToast } from '../../context/ToastContext';
import { BUSINESS_CONFIG } from '../../config/businessConfig';
import { Sparkles, ArrowRight, Heart } from 'lucide-react';
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
      
      {/* 1. Main Hero Banner - Merged Background Layout */}
      <section 
        className="relative bg-[#FAF6F0] text-[#3D2E1F] overflow-hidden h-[380px] sm:h-[450px] min-[800px]:h-[460px] flex items-center px-6 min-[800px]:px-12 bg-cover bg-no-repeat bg-[position:right_20%_center] sm:bg-[position:right_10%_center] min-[800px]:bg-right"
        style={{ backgroundImage: "url('/hero_candle_tray.jpg')" }}
      >
        {/* Blending overlay: Solid cream background on the left fading into transparent on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6F0] via-[#FAF6F0]/95 via-35% sm:via-[#FAF6F0]/85 sm:via-45% to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto w-full z-10">
          {/* Text Content Area - Left aligned, taking up left half */}
          <div className="w-[60%] sm:w-[50%] min-[800px]:max-w-[380px] space-y-3 sm:space-y-4 text-left flex flex-col items-start">
            <span className="font-serif italic text-xs sm:text-sm min-[800px]:text-base text-[#806747] block">
              Timeless Scents,
            </span>
            <h1 className="text-2xl sm:text-3xl min-[800px]:text-[52px] min-[800px]:leading-[1.0] font-serif font-bold text-[#3D2E1F] leading-tight">
              Made Just<br /> For You
            </h1>
            
            {/* Elegant Separator */}
            <div className="flex items-center gap-2 py-0.5 w-[100px] sm:w-[140px] justify-start">
              <span className="h-[1px] flex-grow bg-[#B08A4A]/40"></span>
              <span className="text-[#B08A4A] text-xs">✦</span>
              <span className="h-[1px] flex-grow bg-[#B08A4A]/40"></span>
            </div>

            <p className="text-[11px] sm:text-xs min-[800px]:text-[16px] min-[800px]:leading-[1.45] text-[#5A4634] max-w-xs leading-relaxed font-light">
              Luxury candles crafted to bring warmth, calm, and beauty to your space.
            </p>

            <div className="pt-1 flex flex-col items-start gap-2 w-full max-w-[150px] sm:max-w-[180px]">
              <Link
                to="/products"
                className="bg-[#5A4634] hover:bg-[#4A3728] text-white w-full h-9 sm:h-[46px] rounded-[24px] font-bold transition-all text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer border border-[#B08A4A] shadow-[0_0_15px_rgba(176,138,74,0.65)] hover:shadow-[0_0_25px_rgba(176,138,74,0.95)] hover:scale-105 duration-300"
              >
                Shop Now <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              
              <a
                href={`https://wa.me/${BUSINESS_CONFIG.whatsAppNumber}?text=${encodeURIComponent('Hello The Candle Tales, I have a question about your candles!')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-gray-50 text-[#5A4634] border border-[#5A4634] w-full h-9 sm:h-[46px] rounded-[24px] font-bold transition-all text-xs sm:text-sm flex items-center justify-center gap-1"
              >
                {/* WhatsApp brand green icon */}
                <svg className="h-3.5 w-3.5 fill-green-500 text-green-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.114-2.905-6.99C16.557 1.875 14.079.843 11.45.843 6.015.843 1.59 5.263 1.587 10.702c-.001 1.674.452 3.303 1.311 4.747L1.87 20.06l4.777-1.253.001.001.001-.002z"/>
                </svg>
                WhatsApp
              </a>
              
              <span className="text-[10px] text-gray-500 font-medium tracking-wide">
                *Custom/bulk orders
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Creations Section */}
      <section className="max-w-7xl mx-auto px-6 min-[800px]:px-12 mt-[35px] min-[800px]:mt-[45px]">
        {/* Eyebrow */}
        <div className="text-center">
          <span className="text-[11px] min-[800px]:text-[13px] font-bold uppercase tracking-widest text-[#806747]">
            Selected Pieces ♡
          </span>
        </div>

        {/* Heading */}
        <div className="text-center mt-2.5 min-[800px]:mt-3.5">
          <h2 className="text-[28px] min-[800px]:text-[40px] font-serif text-[#3D2E1F] font-bold tracking-tight">
            Featured Creations
          </h2>
        </div>

        {/* Product Grid */}
        <div className="mt-[25px] min-[800px]:mt-[30px]">
          {loading ? (
            <div className="grid grid-cols-2 min-[600px]:grid-cols-3 min-[800px]:grid-cols-4 gap-3 sm:gap-4">
              {[1, 2, 3, 4].map(n => <SkeletonCard key={n} />)}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="bg-white border border-[#E9DFD0] p-8 rounded-[24px] text-center text-gray-500 shadow-xs">
              No featured items found.
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 min-[600px]:grid-cols-3 min-[800px]:grid-cols-4 gap-3 sm:gap-4">
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

      {/* 3. Shop By Category */}
      <section className="max-w-7xl mx-auto px-6 min-[800px]:px-12 mt-[35px] min-[800px]:mt-[45px] text-center space-y-6">
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
            {categories.map((cat) => (
              <button
                key={cat.id}
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
            ))}
          </div>
        )}
      </section>

      {/* 4. Best Selling Candles Section */}
      <section className="max-w-7xl mx-auto px-6 min-[800px]:px-12 mt-[35px] min-[800px]:mt-[45px] space-y-6">
        <div className="text-center space-y-2.5">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-10 sm:w-20 bg-[#B08A4A]/30"></span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#806747] flex items-center gap-1.5">
              Store Favorites <Heart className="h-3.5 w-3.5 text-rose-400 fill-rose-100" />
            </span>
            <span className="h-px w-10 sm:w-20 bg-[#B08A4A]/30"></span>
          </div>
          <h2 className="text-[28px] min-[800px]:text-[40px] font-serif text-[#3D2E1F] font-bold tracking-tight text-center">
            Best Selling Scents
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 min-[600px]:grid-cols-3 min-[800px]:grid-cols-4 gap-3 sm:gap-4">
            {[1, 2, 3, 4].map(n => <SkeletonCard key={n} />)}
          </div>
        ) : bestsellerProducts.length === 0 ? (
          <div className="p-8 text-center text-gray-500 bg-white border border-[#E9DFD0] rounded-[24px] shadow-xs">
            No best-sellers found.
          </div>
        ) : (
          <div className="grid grid-cols-2 min-[600px]:grid-cols-3 min-[800px]:grid-cols-4 gap-3 sm:gap-4">
            {bestsellerProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 5. Brand Narrative/Handmade with Love Banner */}
      <section className="max-w-7xl mx-auto px-6 min-[800px]:px-12 mt-[40px]">
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
            to="/products"
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
