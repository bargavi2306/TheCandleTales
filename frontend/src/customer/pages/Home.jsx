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
    <div className="space-y-12 pb-12 font-sans bg-[#FAF8F5]">
      
      {/* 1. Compact Hero Banner */}
      <section className="relative bg-[#5C4533] text-white overflow-hidden py-10 md:py-16 px-4 sm:px-6 lg:px-8 flex items-center shadow-md">
        {/* Soft Background Gradients */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-[#5C4533] to-black"></div>
        
        <div className="relative max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-[#CBB59B]/35 rounded-full text-[9px] sm:text-xs font-semibold tracking-wider text-[#CBB59B]">
            <Sparkles className="h-3 w-3 text-[#CBB59B]" /> Handcrafted Soy Wax Candles
          </div>
          
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif tracking-tight text-white leading-tight">
            Every candle tells a <span className="font-serif italic text-[#CBB59B]">story.</span>
          </h1>
          
          <p className="text-[11px] sm:text-sm text-[#F5E6D3]/90 max-w-2xl mx-auto leading-relaxed font-light font-sans">
            Luxury hand-poured candle collections formulated with sustainable soy wax and clean fragrance oils to invoke warmth, nostalgia, and calm into your home.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row justify-center items-center gap-3.5 max-w-xs sm:max-w-none mx-auto w-full sm:w-auto">
            <Link
              to="/products"
              className="bg-[#957C63] hover:bg-[#856C53] text-white px-6 py-2.5 rounded-xl font-bold transition-all text-sm w-full sm:w-auto block text-center cursor-pointer animate-pulse-glow hover:scale-105 active:scale-95 duration-300"
            >
              Shop Now
            </Link>
            <div className="flex flex-col items-center w-full sm:w-auto">
              <a
                href={`https://wa.me/${BUSINESS_CONFIG.whatsAppNumber}?text=${encodeURIComponent('Hello The Candle Tales, I have a question about your candles!')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 bg-[#65C466] hover:bg-[#52B254] text-white px-4 py-1.5 rounded-full font-bold transition-all text-xs text-center cursor-pointer shadow-xs"
              >
                <MessageCircle className="h-3.5 w-3.5 fill-current" /> Chat on WhatsApp
              </a>
              <span className="text-[10px] text-[#F5E6D3]/70 mt-1.5 font-medium tracking-wide">
                *Only for customization and bulk orders
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Products Grid (Placed on the first fold right under the Hero Banner) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2.5">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 sm:w-16 bg-[#8B6B4A]/30"></span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#8B6B4A] flex items-center gap-1">
              Selected Pieces <Heart className="h-3 w-3 text-rose-400 fill-rose-100" />
            </span>
            <span className="h-px w-8 sm:w-16 bg-[#8B6B4A]/30"></span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#3D2E1F] font-semibold">Featured Creations</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => <SkeletonCard key={n} />)}
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="bg-white border border-gray-100 p-8 rounded-2xl text-center text-gray-500">
            No featured items found.
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center pt-2">
              <Link to="/products" className="inline-flex items-center gap-1 text-primary hover:text-accent-dark text-xs font-bold cursor-pointer">
                See all candles <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* 3. Dynamic Categories Circular/Grid Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#8B6B4A]">Categorized Comfort</span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#3D2E1F] font-semibold mt-1">Explore by Collection</h2>
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto justify-center">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigate(`/products?category=${encodeURIComponent(cat.name)}`)}
                className="group flex flex-col items-center gap-3 cursor-pointer"
              >
                <div className="h-24 w-24 rounded-full overflow-hidden border border-gray-150 shadow-sm group-hover:shadow-md transition-all group-hover:scale-105 duration-300 bg-white">
                  <img 
                    src={getImageUrl(cat.image, 'https://via.placeholder.com/150')} 
                    alt={cat.name} 
                    className="h-full w-full object-cover" 
                  />
                </div>
                <span className="text-xs font-bold text-gray-700 uppercase tracking-widest group-hover:text-primary transition-colors">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* 4. Best Selling Candles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2.5">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 sm:w-16 bg-[#8B6B4A]/30"></span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#8B6B4A] flex items-center gap-1">
              Store Favorites <Heart className="h-3 w-3 text-rose-400 fill-rose-100" />
            </span>
            <span className="h-px w-8 sm:w-16 bg-[#8B6B4A]/30"></span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#3D2E1F] font-semibold">Best Selling Scents</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => <SkeletonCard key={n} />)}
          </div>
        ) : bestsellerProducts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No best-sellers found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellerProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 5. Brand Narrative & Preview */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#8B6B4A]/5 border border-[#8B6B4A]/10 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center gap-8 shadow-sm">
          <div className="h-48 w-48 md:h-64 md:w-64 flex-shrink-0 rounded-2xl overflow-hidden shadow-md">
            <img 
              src="https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=600" 
              alt="Artisanal pouring process" 
              className="h-full w-full object-cover" 
            />
          </div>
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8B6B4A]">Our Heritage</span>
            <h3 className="text-xl sm:text-2xl font-serif text-[#3D2E1F] font-semibold">Sustainable & Hand-Poured</h3>
            <p className="text-sm text-gray-600 leading-relaxed font-light">
              We handcraft every single candle here at The Candle Tales using clean-burning, renewable soy wax, organic cotton wicks, and botanical fragrance extracts. Free of phthalates, parabens, and toxins, our products guarantee a soothing glow that respects your air quality.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-[#8B6B4A] hover:text-[#6E4E37] text-xs font-bold pt-2 transition-colors cursor-pointer"
            >
              <BookOpen className="h-4 w-4" /> Learn about our process
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
