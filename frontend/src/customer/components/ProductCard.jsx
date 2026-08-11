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
    <div className="bg-white border border-[#E9DFD0] rounded-[18px] sm:rounded-[22px] overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group h-full">
      {/* Product Image Area */}
      <div className="relative overflow-hidden bg-gray-50 aspect-square w-full">
        <img
          src={firstImg}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        
        {/* Attribute Badges */}
        <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 z-10">
          {isOutOfStock ? (
            <span className="h-8 px-3.5 flex items-center justify-center bg-rose-600 text-white text-[10px] sm:text-xs font-bold uppercase rounded-lg shadow-xs">
              Sold Out
            </span>
          ) : (
            <>
              {product.bestSeller && (
                <span className="h-8 px-3.5 flex items-center justify-center bg-[#5A4634] text-white text-[10px] sm:text-xs font-bold uppercase rounded-lg shadow-xs">
                  Best Seller
                </span>
              )}
              {product.featured && (
                <span className="h-8 px-3.5 flex items-center justify-center bg-[#B08A4A] text-white text-[10px] sm:text-xs font-bold uppercase rounded-lg shadow-xs">
                  Featured
                </span>
              )}
            </>
          )}
        </div>

        {/* Hover Quick View Link */}
        <div className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link
            to={`/products/${product.id}`}
            className="bg-white/95 text-[#3D2E1F] px-4 py-2 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 hover:bg-white transition-all cursor-pointer"
          >
            <Eye className="h-4 w-4 text-[#806747]" /> View Details
          </Link>
        </div>
      </div>

      {/* Details Box */}
      <div className="p-4 sm:p-5 flex-grow flex flex-col justify-between space-y-3.5">
        <div className="space-y-1">
          {/* Category Tag (small grey) */}
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#806747] block truncate">
            {product.category?.name || 'Candle'}
          </span>
          {/* Title */}
          <Link to={`/products/${product.id}`} className="block">
            <h3 className="text-base sm:text-lg lg:text-xl font-serif font-bold text-[#3D2E1F] hover:text-[#806747] transition-colors block truncate">
              {product.name}
            </h3>
          </Link>

          {/* Fragrance / Burn Details */}
          {(product.fragrance || product.burnTime) && (
            <div className="flex items-center gap-1.5 text-xs sm:text-[14px] text-[#806747] font-medium pt-0.5 truncate">
              <Flame className="h-3.5 w-3.5 fill-current text-amber-500/80 flex-shrink-0" />
              <span className="truncate">
                {product.fragrance ? product.fragrance.split('&')[0].trim() : 'Scented'}
                {product.burnTime ? ` • ${product.burnTime.replace(' hours', 'h').replace(' Hours', 'h')}` : ''}
              </span>
            </div>
          )}
        </div>

        {/* Price & Add to Cart Action */}
        <div className="space-y-3 pt-1">
          <div className="text-left">
            <span className="text-lg sm:text-[20px] font-bold text-[#3D2E1F]">
              {BUSINESS_CONFIG.currencySymbol}{product.price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full h-11 sm:h-12 px-3 sm:px-4 rounded-xl sm:rounded-[14px] font-bold text-xs sm:text-sm shadow-xs transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 border border-gray-200 shadow-none cursor-not-allowed'
                : 'bg-[#5A4634] hover:bg-[#4A3728] text-white shadow-sm'
            }`}
          >
            <span className="truncate">{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
            <ShoppingBag className="h-4 w-4 sm:h-4.5 sm:w-4.5 flex-shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
