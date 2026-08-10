import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import { useToast } from '../../context/ToastContext';
import { useLoading } from '../context/LoadingContext';
import { Search, Filter, X, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToast } = useToast();
  const { showLoader, hideLoader } = useLoading();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Consolidated Search & Sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const sortLabels = {
    newest: 'Newest Additions',
    priceAsc: 'Price: Low to High',
    priceDesc: 'Price: High to Low',
    nameAsc: 'Name: A to Z',
    nameDesc: 'Name: Z to A'
  };

  // Load products and categories on mount
  useEffect(() => {
    const loadProductsAndCategories = async () => {
      showLoader();
      setLoading(true);
      try {
        const [prodsRes, catsRes] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        setProducts(prodsRes.data || []);
        setCategories(catsRes.data || []);
      } catch (err) {
        console.error(err);
        addToast("Failed to fetch product catalog.", "error");
      } finally {
        hideLoader();
        setLoading(false);
      }
    };
    loadProductsAndCategories();
  }, [showLoader, hideLoader, addToast]);

  // Client-side filtering logic matching name, category name, or fragrance notes
  const categoryParam = searchParams.get('category')?.toLowerCase().trim();
  const filteredProducts = products.filter(product => {
    if (categoryParam && (!product.category?.name || product.category.name.toLowerCase().trim() !== categoryParam)) {
      return false;
    }
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      product.name.toLowerCase().includes(query) ||
      (product.category?.name && product.category.name.toLowerCase().includes(query)) ||
      (product.fragrance && product.fragrance.toLowerCase().includes(query))
    );
  });

  // Sort Logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case 'priceAsc':
        return a.price - b.price;
      case 'priceDesc':
        return b.price - a.price;
      case 'nameAsc':
        return a.name.localeCompare(b.name);
      case 'nameDesc':
        return b.name.localeCompare(a.name);
      case 'newest':
      default:
        return b.id - a.id;
    }
  });

  // Pagination Calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  const handleClearAll = () => {
    setSearchQuery('');
    setSearchParams({});
    setSortOption('newest');
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans bg-[#FAF8F5] min-h-screen space-y-6">
      
      {/* Header and Intro */}
      <div className="border-b border-[#8B6B4A]/15 pb-4 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-serif text-[#3D2E1F] font-bold">The Candle Collection</h1>
        <p className="text-xs sm:text-sm text-[#8B7B6B] mt-1">Browse our sustainable soy candles, hand-poured with natural botanical oils.</p>
      </div>

      {/* Unified Search & Sort Bar (Single Horizontal Row) */}
      <div className="bg-white border border-[#E5D9C8]/45 p-4 rounded-2xl flex flex-col md:flex-row items-center gap-4 shadow-2xs">
        {/* Search input */}
        <div className="relative flex-grow w-full">
          <Search className="absolute inset-y-0 left-3.5 my-auto h-4.5 w-4.5 text-[#B89B78]" />
          <input
            type="text"
            placeholder="Search by candle name, collection, or fragrance note..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-9 py-2.5 border border-[#E5D9C8] focus:outline-none focus:ring-2 focus:ring-[#8B6B4A]/10 focus:border-[#8B6B4A] rounded-xl text-xs bg-[#FAF6F0]/25 text-[#5A4A3A]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-3.5 my-auto text-[#8B7B6B] hover:text-[#3D2E1F]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Custom Sort option */}
        <div className="relative w-full md:w-auto flex items-center justify-between md:justify-end gap-2.5 flex-shrink-0">
          <label className="text-xs text-[#8B7B6B] font-bold uppercase tracking-wider whitespace-nowrap">Sort By:</label>
          <div className="relative w-48">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="w-full border border-[#E5D9C8] rounded-xl px-3 py-2 text-[#5A4A3A] text-xs font-bold bg-white flex items-center justify-between cursor-pointer focus:ring-2 focus:ring-[#8B6B4A]/10 transition-all"
            >
              <span>{sortLabels[sortOption]}</span>
              <ChevronDown className="h-3.5 w-3.5 text-[#8B7B6B]" />
            </button>
            {isSortOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setIsSortOpen(false)} />
                <div className="absolute right-0 mt-1.5 w-full bg-white border border-[#E5D9C8]/60 rounded-xl shadow-lg z-30 py-1 divide-y divide-[#E5D9C8]/10 animate-fadeIn">
                  {Object.keys(sortLabels).map((key) => (
                    <button
                      key={key}
                      onClick={() => {
                        setSortOption(key);
                        setIsSortOpen(false);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 text-xs font-bold transition-colors cursor-pointer ${
                        sortOption === key
                          ? 'bg-[#8B6B4A]/10 text-[#8B6B4A]'
                          : 'text-[#5A4A3A] hover:bg-[#FAF6F0]'
                      }`}
                    >
                      {sortLabels[key]}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Category Bubble Filters (Pills) */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none flex-nowrap">
        <button
          onClick={() => {
            setSearchParams({});
            setCurrentPage(1);
          }}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex-shrink-0 cursor-pointer border ${
            !categoryParam
              ? 'bg-[#8B6B4A] text-white border-[#8B6B4A] shadow-xs'
              : 'bg-white text-[#5A4A3A] border-[#E5D9C8] hover:border-[#8B6B4A]'
          }`}
        >
          All
        </button>
        {categories.map((cat) => {
          const isActive = categoryParam === cat.name.toLowerCase().trim();
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSearchParams({ category: cat.name });
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex-shrink-0 cursor-pointer border ${
                isActive
                  ? 'bg-[#8B6B4A] text-white border-[#8B6B4A] shadow-xs'
                  : 'bg-white text-[#5A4A3A] border-[#E5D9C8] hover:border-[#8B6B4A]'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Result Indicator Sub-row */}
      <div className="flex items-center justify-between text-xs text-[#8B7B6B] font-semibold px-1">
        <span>
          Showing <strong className="text-[#3D2E1F]">{sortedProducts.length}</strong> luxurious candles
        </span>
        {(categoryParam || searchQuery) && (
          <button
            onClick={handleClearAll}
            className="text-[#8B6B4A] hover:underline font-bold flex items-center gap-1 cursor-pointer"
          >
            Clear Filters <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Product Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <SkeletonCard key={n} />)}
        </div>
      ) : currentItems.length === 0 ? (
        <div className="bg-white border border-[#E5D9C8]/35 p-16 text-center text-gray-500 rounded-2xl shadow-xs">
          <Filter className="h-16 w-16 text-[#CBB59B]/55 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#3D2E1F] font-serif">No candles match search query</h3>
          <p className="text-xs text-gray-400 mt-1">Try searching for other collections or fragrance terms.</p>
          <button
            onClick={handleClearAll}
            className="mt-5 bg-[#8B6B4A] hover:bg-[#6E4E37] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Numbered Pagination Nav */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white px-6 py-4 border border-gray-100 rounded-2xl shadow-sm">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center p-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setCurrentPage(n)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      currentPage === n
                        ? 'bg-[#8B6B4A] text-white shadow-md shadow-[#8B6B4A]/10'
                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center p-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default Products;
