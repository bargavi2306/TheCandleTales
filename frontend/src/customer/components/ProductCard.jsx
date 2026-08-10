import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useToast } from '../../context/ToastContext';
import { ShoppingCart, ShoppingBag, Plus, Minus, Flame, Eye, Star } from 'lucide-react';
import { BUSINESS_CONFIG } from '../../config/businessConfig';
import { getImageUrl } from '../../utils/imageUtil';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const firstImg = getImageUrl(product.images?.[0]?.imageUrl, 'https://via.placeholder.com/350');
  const isOutOfStock = product.stock === 0;

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    } else {
      addToast(`Only ${product.stock} units available in stock.`, "info");
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) {
      addToast("This item is currently out of stock.", "error");
      return;
    }
    addToCart(product, quantity);
    addToast(`${quantity}x ${product.name} added to cart!`, "success");
    setQuantity(1); // reset
  };

  return (
    <>
      {/* Desktop Card (hidden on mobile) */}
      <div className="hidden md:flex bg-white border border-gray-150/70 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex-col justify-between group h-full">
        {/* Product Image Area */}
        <div className="relative overflow-hidden bg-gray-50 pt-[100%]">
          <img
            src={firstImg}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
          
          {/* Attribute Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {isOutOfStock ? (
              <span className="px-2.5 py-1 bg-rose-600 text-white text-[10px] font-bold uppercase rounded-lg shadow-sm">
                Sold Out
              </span>
            ) : (
              <>
                {product.featured && (
                  <span className="px-2.5 py-1 bg-amber-500 text-white text-[10px] font-bold uppercase rounded-lg shadow-sm">
                    Featured
                  </span>
                )}
                {product.bestSeller && (
                  <span className="px-2.5 py-1 bg-indigo-600 text-white text-[10px] font-bold uppercase rounded-lg shadow-sm">
                    Best Seller
                  </span>
                )}
              </>
            )}
          </div>

          {/* Hover Quick View Link */}
          <div className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Link
              to={`/products/${product.id}`}
              className="bg-white/90 backdrop-blur-xs text-accent-dark px-4 py-2 rounded-xl text-xs font-semibold shadow-md flex items-center gap-1.5 hover:bg-white transition-colors"
            >
              <Eye className="h-4 w-4" /> View Details
            </Link>
          </div>
        </div>

        {/* Details Box */}
        <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
          <div>
            {/* Category Tag */}
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B6B4A]/80">
              {product.category?.name || 'Candle'}
            </span>
            {/* Title */}
            <Link to={`/products/${product.id}`} className="block mt-1">
              <h3 className="text-base font-semibold text-gray-800 hover:text-primary transition-colors line-clamp-1">
                {product.name}
              </h3>
            </Link>
            {/* Description snippet */}
            <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
              {product.description}
            </p>

            {/* Fragrance / Burn Details */}
            {(product.fragrance || product.burnTime) && (
              <div className="flex items-center gap-3 mt-3 text-[11px] text-gray-400 font-medium border-t border-gray-50 pt-2.5">
                {product.fragrance && (
                  <span className="flex items-center gap-1">
                    <Flame className="h-3 w-3 text-amber-500/70" /> {product.fragrance.split('&')[0].trim()}
                  </span>
                )}
                {product.burnTime && (
                  <span>• {product.burnTime}</span>
                )}
              </div>
            )}
          </div>

          {/* Pricing, Quantity Selector & Add To Cart */}
          <div className="space-y-3 pt-3 border-t border-gray-50">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-800">{BUSINESS_CONFIG.currencySymbol}{product.price.toFixed(2)}</span>
              
              {/* Quantity Selector */}
              {!isOutOfStock && (
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-8 bg-white shadow-inner">
                  <button
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    className="px-2 py-1 text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="px-2 text-xs font-bold text-gray-700 min-w-[1.25rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    className="px-2 py-1 text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Add to Cart button */}
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-xs shadow-md transition-all duration-200 ${
                isOutOfStock
                  ? 'bg-gray-100 text-gray-400 border border-gray-200 shadow-none cursor-not-allowed'
                  : 'bg-[#5C4533] hover:bg-[#3D2E1F] text-white shadow-sm'
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Card (hidden on desktop) */}
      <div className="md:hidden flex flex-row bg-white border border-[#E5D9C8]/40 rounded-2xl p-3 gap-3.5 shadow-2xs relative w-full">
        {/* Left Image Column */}
        <div className="w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 rounded-xl overflow-hidden relative border border-[#D8C8B5]/25 shadow-inner">
          <img
            src={firstImg}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />

          {/* Absolute badge on image */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
            {isOutOfStock ? (
              <span className="bg-rose-600 text-white text-[7px] font-extrabold uppercase px-1.5 py-0.5 rounded-sm tracking-wider">
                Sold Out
              </span>
            ) : (
              <>
                {product.bestSeller && (
                  <span className="bg-[#4F46E5] text-white text-[7px] font-extrabold uppercase px-1.5 py-0.5 rounded-sm tracking-wider">
                    BEST SELLER
                  </span>
                )}
                {!product.bestSeller && product.featured && (
                  <span className="bg-amber-500 text-white text-[7px] font-extrabold uppercase px-1.5 py-0.5 rounded-sm tracking-wider">
                    FEATURED
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Details Column */}
        <div className="flex-grow min-w-0 flex flex-col justify-between py-0.5">
          <div>
            {/* Category Tag */}
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#A07D5A]">
              {product.category?.name || 'CANDLE'}
            </span>
            {/* Title */}
            <Link to={`/products/${product.id}`} className="block">
              <h3 className="text-sm font-serif font-bold text-[#3D2E1F] mt-0.5 truncate hover:text-primary transition-colors">
                {product.name}
              </h3>
            </Link>
            {/* Category Description */}
            <p className="text-[10px] text-[#8B7B6B]/80 font-medium leading-none mt-0.5">
              {product.category?.name || 'Urli'}
            </p>

            {/* Fragrance / Burn Line */}
            {(product.fragrance || product.burnTime) && (
              <div className="flex items-center gap-2 mt-2 text-[9px] text-[#8B7B6B] font-semibold">
                {product.fragrance && (
                  <span className="flex items-center gap-0.5">
                    <Flame className="h-2.5 w-2.5 text-amber-500 fill-current" /> {product.fragrance.split('&')[0].trim()}
                  </span>
                )}
                {product.burnTime && (
                  <span>• {product.burnTime}</span>
                )}
              </div>
            )}

            {/* Price */}
            <p className="text-sm font-extrabold text-[#3D2E1F] mt-2">
              {BUSINESS_CONFIG.currencySymbol}{product.price.toFixed(2)}
            </p>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-2.5 mt-2.5 pt-2 border-t border-[#E5D9C8]/25">
            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className="flex items-center border border-[#E5D9C8]/75 rounded-full overflow-hidden h-7 px-1.5 bg-white shadow-2xs flex-shrink-0">
                <button
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  className="px-1 text-gray-500 hover:text-[#3D2E1F] disabled:opacity-30 cursor-pointer"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="px-2 text-xs font-bold text-[#3D2E1F] min-w-[1rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrement}
                  className="px-1 text-gray-500 hover:text-[#3D2E1F] cursor-pointer"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            )}

            {/* Add to Cart button */}
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex-grow flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg font-bold text-[10px] transition-all cursor-pointer ${
                isOutOfStock
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none border border-gray-200'
                  : 'bg-[#5C4533] hover:bg-[#3D2E1F] text-white shadow-sm'
              }`}
            >
              {!isOutOfStock && <ShoppingBag className="h-3.5 w-3.5" />} 
              {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
