import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories } from '../services/categoryService';
import { getProducts } from '../services/productService';
import { useToast } from '../context/ToastContext';
import { BUSINESS_CONFIG } from '../config/businessConfig';
import { 
  Package, 
  Layers, 
  AlertTriangle, 
  Award,
  ArrowRight,
  Heart,
  Sparkles,
  Star,
  Leaf,
  LayoutGrid
} from 'lucide-react';

const Dashboard = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, prodsRes] = await Promise.all([
          getCategories(),
          getProducts()
        ]);
        setCategories(catsRes.data || []);
        setProducts(prodsRes.data || []);
      } catch (err) {
        console.error(err);
        addToast("Failed to load dashboard data.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [addToast]);

  // Calculations
  const totalProducts = products.length;
  const totalCategories = categories.length;
  const outOfStock = products.filter(p => p.stock === 0).length;
  const featured = products.filter(p => p.featured).length;

  const recentProducts = [...products]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading Skeletons */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="bg-white border border-gray-100 p-6 rounded-2xl animate-pulse flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-8 w-16 bg-gray-200 rounded"></div>
              </div>
              <div className="h-12 w-12 bg-gray-200 rounded-xl"></div>
            </div>
          ))}
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 animate-pulse space-y-4">
          <div className="h-6 w-48 bg-gray-200 rounded"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(n => (
              <div key={n} className="h-10 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative bg-[#FAF6F0] border border-[#E5D9C8]/50 rounded-[28px] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 overflow-hidden shadow-xs text-center sm:text-left">
        {/* Mobile Candle Icon - Shown only on mobile */}
        <div className="sm:hidden flex justify-center mb-1">
          <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
            {/* Leaf decorations */}
            <path d="M18 22 C14 18 16 10 22 8 C20 14 18 18 20 22 Z" fill="#C4A882" opacity="0.6"/>
            <path d="M46 22 C50 18 48 10 42 8 C44 14 46 18 44 22 Z" fill="#C4A882" opacity="0.6"/>
            {/* Flame */}
            <ellipse cx="32" cy="18" rx="5" ry="8" fill="#D4A060" opacity="0.8"/>
            <ellipse cx="32" cy="20" rx="3" ry="5" fill="#E8C888"/>
            {/* Candle body */}
            <rect x="24" y="26" width="16" height="22" rx="3" fill="#F5E6D3" stroke="#C4A882" strokeWidth="1.5"/>
            {/* Heart detail on candle */}
            <path d="M32 39 C32 39 30.5 37.5 29 36 C28 35 28 34 29 33 C30 32 31 33 32 34.5 C33 33 34 32 35 33 C36 34 36 35 35 36 C33.5 37.5 32 39 32 39 Z" fill="#C4A882" opacity="0.8"/>
            {/* Sound/Signal Waves */}
            <path d="M14 26 C16 20 20 16 25 14" stroke="#C4A882" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
            <path d="M50 26 C48 20 44 16 39 14" stroke="#C4A882" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
          </svg>
        </div>

        <div className="relative z-10 flex-1">
          <h1 className="text-xl sm:text-2xl font-serif text-[#3D2E1F] font-bold">Welcome to your Dashboard</h1>
          <p className="text-[#8B7B6B] text-xs sm:text-sm mt-1.5 flex items-center justify-center sm:justify-start gap-1.5">
            Here is a quick breakdown of your catalog and inventory levels. <Heart className="h-3.5 w-3.5 text-rose-400 fill-rose-100 opacity-80" />
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto relative z-10">
          <button 
            onClick={() => navigate('/admin/categories')}
            className="w-full sm:w-auto px-5 py-2.5 border border-[#E5D9C8] hover:border-[#8B6B4A] hover:bg-[#FAF6F0] text-[#5A4A3A] font-bold text-xs rounded-full flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-white"
          >
            <LayoutGrid className="h-4 w-4 text-[#8B6B4A]" /> Manage Categories
          </button>
          <button 
            onClick={() => navigate('/admin/products')}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#6E4E37] text-white hover:bg-[#3D2E1F] font-bold text-xs rounded-full shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            + Add Products <Sparkles className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Stat Cards Grid (2x2 on mobile, 4 columns on desktop) */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Metric 1: Total Products */}
        <div className="bg-white border border-[#E5D9C8]/40 rounded-[24px] p-4 sm:p-5 flex items-center justify-between shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
          <div>
            <p className="text-[10px] sm:text-xs font-semibold text-[#8B7B6B] tracking-wide">Total Products</p>
            <div className="flex items-center gap-1.5 mt-1">
              <p className="text-2xl sm:text-3xl font-bold text-[#3D2E1F]">{totalProducts}</p>
              {/* Droplet outline icon next to count on mobile */}
              <span className="text-[#8B7B6B]/20 inline-block">
                <svg width="8" height="11" viewBox="0 0 10 14" fill="currentColor">
                  <path d="M5 0C5 0 10 5.83333 10 9.33333C10 11.9107 7.76142 14 5 14C2.23858 14 0 11.9107 0 9.33333C0 5.83333 5 0 5 0Z" />
                </svg>
              </span>
            </div>
          </div>
          <div className="p-3 sm:p-3.5 rounded-2xl bg-[#E5E0FA]/50 text-[#5B4F96] border border-[#D5CFF2]/40 z-10 flex-shrink-0">
            <Package className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
          </div>
        </div>

        {/* Metric 2: Total Categories */}
        <div className="bg-white border border-[#E5D9C8]/40 rounded-[24px] p-4 sm:p-5 flex items-center justify-between shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
          <div>
            <p className="text-[10px] sm:text-xs font-semibold text-[#8B7B6B] tracking-wide">Total Categories</p>
            <div className="flex items-center gap-1.5 mt-1">
              <p className="text-2xl sm:text-3xl font-bold text-[#3D2E1F]">{totalCategories}</p>
              {/* Sparkle icon next to count on mobile */}
              <span className="text-[#C4A882]/30 inline-block">
                <Sparkles className="h-3 w-3" />
              </span>
            </div>
          </div>
          <div className="p-3 sm:p-3.5 rounded-2xl bg-[#FAF0DF]/60 text-[#A07D5A] border border-[#EBE0CD]/40 z-10 flex-shrink-0">
            <Layers className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
          </div>
        </div>

        {/* Metric 3: Out of Stock */}
        <div className="bg-white border border-[#E5D9C8]/40 rounded-[24px] p-4 sm:p-5 flex items-center justify-between shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
          <div>
            <p className="text-[10px] sm:text-xs font-semibold text-[#8B7B6B] tracking-wide">Out of Stock</p>
            <div className="flex items-center gap-1.5 mt-1">
              <p className="text-2xl sm:text-3xl font-bold text-[#3D2E1F]">{outOfStock}</p>
              {/* Heart icon next to count on mobile */}
              <span className="text-rose-300/35 inline-block">
                <Heart className="h-3 w-3 fill-currentColor" />
              </span>
            </div>
          </div>
          <div className={`p-3 sm:p-3.5 rounded-2xl border z-10 flex-shrink-0 ${
            outOfStock > 0 
              ? 'bg-rose-50/70 text-rose-600 border-rose-100 animate-pulse' 
              : 'bg-[#FAF0F0]/60 text-rose-500/70 border-rose-100/50'
          }`}>
            <AlertTriangle className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
          </div>
        </div>

        {/* Metric 4: Featured Items */}
        <div className="bg-white border border-[#E5D9C8]/40 rounded-[24px] p-4 sm:p-5 flex items-center justify-between shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
          <div>
            <p className="text-[10px] sm:text-xs font-semibold text-[#8B7B6B] tracking-wide">Featured Items</p>
            <div className="flex items-center gap-1.5 mt-1">
              <p className="text-2xl sm:text-3xl font-bold text-[#3D2E1F]">{featured}</p>
              {/* Ribbon icon next to count on mobile */}
              <span className="text-[#4CA670]/20 inline-block">
                <Award className="h-3 w-3" />
              </span>
            </div>
          </div>
          <div className="p-3 sm:p-3.5 rounded-2xl bg-[#EDFAF0]/60 text-[#4CA670] border border-[#DAF2E3]/40 z-10 flex-shrink-0">
            <Award className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
          </div>
        </div>
      </div>

      {/* Recent Products Card */}
      <div className="bg-white border border-[#E5D9C8]/40 rounded-[28px] shadow-xs overflow-hidden">
        <div className="px-6 py-5 border-b border-[#D8C8B5]/20 flex items-center justify-between">
          <h3 className="text-base font-serif text-[#3D2E1F] font-bold flex items-center gap-1.5">
            Recent Products <Heart className="h-4 w-4 text-[#C4A882]/70" />
          </h3>
          <button 
            onClick={() => navigate('/admin/products')}
            className="text-[#8B6B4A] hover:text-[#6E4E37] font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
          >
            View all products <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
        
        {recentProducts.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Package className="h-12 w-12 mx-auto text-[#CBB59B] mb-3" />
            <p className="font-medium">No products seeded yet.</p>
            <button 
              onClick={() => navigate('/admin/products')}
              className="mt-3 text-[#8B6B4A] hover:underline text-sm font-semibold"
            >
              Seed/Create your first product
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-[#E5D9C8]/40">
                <thead className="bg-[#FAF6F0]/40">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-[10px] font-bold text-[#8B7B6B] uppercase tracking-wider">Preview</th>
                    <th className="px-6 py-3.5 text-left text-[10px] font-bold text-[#8B7B6B] uppercase tracking-wider">Product Name</th>
                    <th className="px-6 py-3.5 text-left text-[10px] font-bold text-[#8B7B6B] uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3.5 text-left text-[10px] font-bold text-[#8B7B6B] uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3.5 text-left text-[10px] font-bold text-[#8B7B6B] uppercase tracking-wider">Stock Status</th>
                    <th className="px-6 py-3.5 text-left text-[10px] font-bold text-[#8B7B6B] uppercase tracking-wider">Attributes</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#E5D9C8]/20 text-xs text-[#5A4A3A]">
                  {recentProducts.map((product) => {
                    const firstImg = product.images?.[0]?.imageUrl || 'https://via.placeholder.com/150';
                    return (
                      <tr key={product.id} className="hover:bg-[#FAF6F0]/20 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img 
                            src={firstImg} 
                            alt={product.name} 
                            className="h-11 w-11 object-cover rounded-xl border border-[#D8C8B5]/30 shadow-inner"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-[#3D2E1F]">
                          {product.name} <span className="text-[#C4A882]/75 font-medium ml-1">♡</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-[#8B7B6B] font-medium">{product.category?.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-bold text-[#3D2E1F]">{BUSINESS_CONFIG.currencySymbol}{product.price.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 w-max ${
                            product.stock === 0 
                              ? 'bg-rose-50 text-rose-700 border border-rose-100' 
                              : 'bg-[#EDFAF0] text-[#4CA670] border border-[#DAF2E3]'
                          }`}>
                            {product.stock === 0 ? 'Out of Stock ⚠️' : `${product.stock} in stock`}
                            {product.stock > 0 && <Leaf className="h-3 w-3 text-[#4CA670] fill-current opacity-70" />}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            {product.featured && (
                              <span className="px-2 py-1 rounded-lg bg-[#FAF0DF]/60 text-[#A07D5A] border border-[#EBE0CD]/40 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                                Featured <Star className="h-2.5 w-2.5 fill-current" />
                              </span>
                            )}
                            {product.bestSeller && (
                              <span className="px-2 py-1 rounded-lg bg-[#E5E0FA]/60 text-[#5B4F96] border border-[#D5CFF2]/40 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                                Best Seller <Star className="h-2.5 w-2.5 fill-current" />
                              </span>
                            )}
                            {!product.featured && !product.bestSeller && (
                              <span className="text-gray-400 text-xs">-</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile List View */}
            <div className="md:hidden space-y-3.5 p-4 bg-[#FAF6F0]/30">
              {recentProducts.map((product) => {
                const firstImg = product.images?.[0]?.imageUrl || 'https://via.placeholder.com/150';
                return (
                  <div key={product.id} className="bg-white border border-[#E5D9C8]/30 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-3.5">
                      <img 
                        src={firstImg} 
                        alt={product.name} 
                        className="h-16 w-16 object-cover rounded-2xl border border-[#D8C8B5]/30 shadow-inner flex-shrink-0"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-[#3D2E1F] flex items-center gap-1">
                          {product.name} <span className="text-[#C4A882]/75 font-medium text-xs">♡</span>
                        </h4>
                        <p className="text-[11px] text-[#8B7B6B] mt-0.5 font-medium">{product.category?.name}</p>
                        <p className="text-sm font-extrabold text-[#3D2E1F] mt-1.5">{BUSINESS_CONFIG.currencySymbol}{product.price.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 items-end flex-shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                        product.stock === 0 
                          ? 'bg-rose-50 text-rose-700 border border-rose-100' 
                          : 'bg-[#EDFAF0] text-[#4CA670] border border-[#DAF2E3]'
                      }`}>
                        {product.stock === 0 ? 'Out of Stock ⚠️' : `${product.stock} in stock`}
                        {product.stock > 0 && <Leaf className="h-3 w-3 text-[#4CA670] fill-current opacity-70" />}
                      </span>
                      
                      {product.featured && (
                        <span className="px-2.5 py-1 rounded-full bg-[#FAF0DF] text-[#A07D5A] border border-[#EBE0CD]/50 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                          Featured <Star className="h-2.5 w-2.5 fill-current" />
                        </span>
                      )}
                      {product.bestSeller && (
                        <span className="px-2.5 py-1 rounded-full bg-[#E5E0FA] text-[#5B4F96] border border-[#D5CFF2]/50 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                          Best Seller <Star className="h-2.5 w-2.5 fill-current" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
