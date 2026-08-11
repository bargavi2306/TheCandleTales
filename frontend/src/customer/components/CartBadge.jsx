import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { ShoppingBag } from 'lucide-react';

const CartBadge = () => {
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);

  // Trigger scale-115 pulse animation when totalItems updates
  useEffect(() => {
    if (totalItems === 0) return;
    setAnimate(true);
    const t = setTimeout(() => setAnimate(false), 300);
    return () => clearTimeout(t);
  }, [totalItems]);

  return (
    <button
      onClick={() => navigate('/cart')}
      className="relative w-10 h-10 sm:w-12 sm:h-12 hover:bg-[#FAF6F0] rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer group"
      aria-label="Shopping Cart Summary"
    >
      <ShoppingBag className="h-6 w-6 sm:h-7 sm:w-7 text-[#3D2E1F] group-hover:text-primary-brown transition-colors" />
      {totalItems > 0 && (
        <span
          className={`absolute -top-0.5 -right-0.5 h-5 w-5 sm:h-7 sm:w-7 bg-[#5A4634] text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center shadow-xs transition-transform duration-300 ${
            animate ? 'scale-115' : 'scale-100'
          }`}
        >
          {totalItems}
        </span>
      )}
    </button>
  );
};

export default CartBadge;
