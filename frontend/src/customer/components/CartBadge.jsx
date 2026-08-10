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
      className="relative p-1.5 hover:bg-[#CBB59B]/10 rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer group"
      aria-label="Shopping Cart Summary"
    >
      <ShoppingBag className="h-5.5 w-5.5 text-[#3D2E1F] group-hover:text-primary transition-colors" />
      {totalItems > 0 && (
        <span
          className={`absolute -top-1 -right-1 h-4.5 w-4.5 bg-[#8B6B4A] text-white text-[9px] font-extrabold rounded-full flex items-center justify-center shadow-xs transition-transform duration-300 ${
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
