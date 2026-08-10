import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, getProducts } from '../services/productService';
import ImageGallery from '../components/ImageGallery';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import { useCart } from '../hooks/useCart';
import { useToast } from '../../context/ToastContext';
import { useLoading } from '../context/LoadingContext';
import { ShoppingCart, Plus, Minus, Flame, Clock, ShieldAlert, Sparkles, ChevronRight } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const { showLoader, hideLoader } = useLoading();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadProductDetails = async () => {
      showLoader();
      setLoading(true);
      try {
        const prodData = await getProductById(id);
        setProduct(prodData.data);
        setQuantity(1); // Reset quantity

        // Load related products of same category
        if (prodData.data && prodData.data.category?.id) {
          const allProds = await getProducts();
          const related = (allProds.data || [])
            .filter((p) => p.category?.id === prodData.data.category.id && p.id !== prodData.data.id)
            .slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (err) {
        console.error(err);
        addToast("Failed to fetch product details.", "error");
      } finally {
        hideLoader();
        setLoading(false);
      }
    };

    loadProductDetails();
  }, [id, showLoader, hideLoader, addToast]);

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    } else {
      addToast(`Only ${product.stock} units available in stock.`, "info");
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (product.stock === 0) {
      addToast("This item is currently out of stock.", "error");
      return;
    }
    addToCart(product, quantity);
    addToast(`${quantity}x ${product.name} added to cart!`, "success");
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse space-y-8 bg-bg-cream">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-200 aspect-square rounded-2xl"></div>
          <div className="space-y-6">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
            <div className="h-5 w-1/4 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-10 w-48 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4 bg-bg-cream">
        <ShieldAlert className="h-16 w-16 text-rose-500 mx-auto" />
        <h2 className="text-xl font-semibold text-gray-800">Product Not Found</h2>
        <p className="text-sm text-gray-500">The candle you are searching for does not exist in our system.</p>
        <Link to="/products" className="inline-block mt-4 bg-primary text-white px-5 py-2.5 rounded-xl text-xs font-semibold">
          Return to Shop
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;

  return (
    <div className="bg-bg-cream min-h-screen pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold mb-8">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/products" className="hover:text-primary transition-colors">Candles</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-600 truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Product Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          
          {/* Left Column: Zoomable Image Gallery */}
          <div>
            <ImageGallery images={product.images} />
          </div>

          {/* Right Column: Metadata */}
          <div className="space-y-6">
            
            {/* Category and Title */}
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#8B6B4A]">
                {product.category?.name} Collection
              </span>
              <h1 className="text-3xl font-serif text-accent-dark font-semibold mt-1">
                {product.name}
              </h1>
            </div>

            {/* Price & Stock Badge */}
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-gray-800">{BUSINESS_CONFIG.currencySymbol}{product.price.toFixed(2)}</span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                isOutOfStock 
                  ? 'bg-rose-50 text-rose-700 border border-rose-100' 
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
              }`}>
                {isOutOfStock ? 'Sold Out' : `${product.stock} units available`}
              </span>
            </div>

            {/* Description */}
            <div className="border-t border-gray-150 pt-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">The Story</h3>
              <p className="text-sm text-gray-600 leading-relaxed font-light">
                {product.description}
              </p>
            </div>

            {/* Candle Properties Box */}
            <div className="bg-white border border-gray-150/70 rounded-2xl p-5 grid grid-cols-2 gap-4 shadow-sm">
              <div className="flex items-start gap-3">
                <Flame className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Fragrance profile</span>
                  <span className="text-sm font-semibold text-gray-700">{product.fragrance || 'Unscented'}</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-[#8B6B4A] mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Approx. burn time</span>
                  <span className="text-sm font-semibold text-gray-700">{product.burnTime || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Quantity Selector & Action Button */}
            {!isOutOfStock && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 border-t border-gray-150">
                <div className="flex items-center justify-between border border-gray-200 rounded-xl overflow-hidden h-12 bg-white px-3 shadow-inner">
                  <span className="text-xs text-gray-400 font-semibold mr-4">QTY</span>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleDecrement}
                      disabled={quantity <= 1}
                      className="p-1 text-gray-500 hover:bg-gray-50 disabled:opacity-30"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-bold text-gray-800 min-w-[1.5rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={handleIncrement}
                      className="p-1 text-gray-500 hover:bg-gray-50"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-grow bg-[#8B6B4A] hover:bg-[#6E4E37] text-white py-3 px-6 rounded-xl font-bold shadow-md shadow-[#8B6B4A]/10 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <ShoppingCart className="h-5 w-5" /> Add to Shopping Cart
                </button>
              </div>
            )}

            {isOutOfStock && (
              <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 text-center text-sm font-medium text-rose-700">
                This candle is currently sold out. Check back later or ask for a custom restock via WhatsApp.
              </div>
            )}

          </div>
        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 border-t border-[#8B6B4A]/10 pt-12 space-y-8">
            <div className="text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[#8B6B4A]">Complete the Mood</span>
              <h2 className="text-2xl font-serif text-accent-dark font-semibold mt-1">Related Soy Candles</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetail;
