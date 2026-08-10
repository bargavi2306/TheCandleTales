import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import CartItemRow from '../components/CartItemRow';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import CheckoutModal from '../components/CheckoutModal';
import { useToast } from '../../context/ToastContext';
import { BUSINESS_CONFIG } from '../../config/businessConfig';
import { 
  ShoppingBag, 
  Trash2, 
  ArrowLeft, 
  MessageCircle, 
  Tag, 
  Truck 
} from 'lucide-react';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, totalItems, grandTotal, clearCart } = useCart();
  const { addToast } = useToast();

  // Deletion Modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Checkout Modal state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Promo Code State (Mock)
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      removeFromCart(itemToDelete.id);
      addToast(`"${itemToDelete.name}" removed from cart.`, "info");
    }
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const handleUpdateQuantity = (id, newQty) => {
    const targetItem = cartItems.find(item => item.id === id);
    if (!targetItem) return;

    if (newQty === 0) {
      // Prompt item removal confirmation if quantity hits 0
      handleDeleteClick(targetItem);
    } else {
      updateQuantity(id, newQty);
    }
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    if (promoCode.toUpperCase() === 'WELCOME10') {
      setDiscount(0.1); // 10% discount
      addToast("10% promo discount applied!", "success");
    } else {
      addToast("Invalid promo code. Try WELCOME10.", "error");
    }
  };

  const handleOpenCheckout = () => {
    if (cartItems.length === 0) {
      addToast("Your cart is empty. Add items before placing an order.", "error");
      return;
    }
    setIsCheckoutOpen(true);
  };

  // Calculations
  const shippingFee = grandTotal > 75 ? 0 : 7.99;
  const discountAmount = grandTotal * discount;
  const finalTotal = grandTotal - discountAmount + shippingFee;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-5 bg-bg-cream">
        <div className="h-20 w-20 bg-white border border-gray-150 rounded-full flex items-center justify-center text-gray-300 mx-auto shadow-sm">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-serif text-accent-dark font-semibold">Your Shopping Cart is Empty</h2>
        <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
          It looks like you haven't added any of our handcrafted soy candles to your cart yet.
        </p>
        <div className="pt-2">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-[#8B6B4A] hover:bg-[#6E4E37] text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-md shadow-[#8B6B4A]/10 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans bg-bg-cream min-h-screen">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#8B6B4A]/15 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-serif text-accent-dark font-semibold">Shopping Cart</h1>
          <p className="text-xs text-gray-500 mt-1">Review your selections before completing order details.</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 cursor-pointer"
        >
          <Trash2 className="h-4 w-4" /> Clear All Items
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Items List Table/Cards */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white border border-gray-150 rounded-2xl shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="py-4 px-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Product</th>
                  <th className="py-4 px-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Price</th>
                  <th className="py-4 px-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Quantity</th>
                  <th className="py-4 px-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Subtotal</th>
                  <th className="py-4 px-4 text-right text-xs font-bold uppercase tracking-wider text-gray-400"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {cartItems.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onDeleteClick={handleDeleteClick}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden space-y-3">
            {cartItems.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onDeleteClick={handleDeleteClick}
              />
            ))}
          </div>

          {/* Back to Products */}
          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-accent-dark transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Continue browsing products
            </Link>
          </div>
        </div>

        {/* Right Side: Order Summary Panel */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-accent-dark border-b border-gray-50 pb-3">
              Order Summary
            </h3>

            {/* Subtotal and items count */}
            <div className="space-y-3 text-xs text-gray-600 font-medium">
              <div className="flex justify-between">
                <span>Items Subtotal ({totalItems})</span>
                <span className="font-semibold text-gray-800">{BUSINESS_CONFIG.currencySymbol}{grandTotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>WELCOME10 Promo (10%)</span>
                  <span>-{BUSINESS_CONFIG.currencySymbol}{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-gray-800">
                  {shippingFee === 0 ? 'FREE' : `${BUSINESS_CONFIG.currencySymbol}${shippingFee.toFixed(2)}`}
                </span>
              </div>

              {/* Shipping Promo Hook */}
              {shippingFee > 0 && (
                <p className="text-[10px] text-primary leading-relaxed bg-[#8B6B4A]/5 border border-[#8B6B4A]/10 rounded-lg p-2 flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5" /> Add {BUSINESS_CONFIG.currencySymbol}{(75 - grandTotal).toFixed(2)} more to qualify for Free Shipping!
                </p>
              )}
            </div>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <div className="relative flex-grow">
                <Tag className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="WELCOME10"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 focus:outline-none focus:ring-primary focus:border-primary rounded-xl text-xs bg-gray-50/20 text-gray-800 uppercase"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Apply
              </button>
            </form>

            {/* Final Total */}
            <div className="flex justify-between border-t border-gray-100 pt-4 text-sm font-bold text-gray-800">
              <span>Estimated Total</span>
              <span className="text-lg text-primary">{BUSINESS_CONFIG.currencySymbol}{finalTotal.toFixed(2)}</span>
            </div>

            {/* Checkout WhatsApp Trigger */}
            <button
              onClick={handleOpenCheckout}
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 rounded-xl font-bold shadow-md shadow-[#25D366]/20 transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="h-5 w-5" /> Place Order via WhatsApp
            </button>
          </div>
        </div>

      </div>

      {/* Item Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.name}
      />

      {/* WhatsApp Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

    </div>
  );
};

export default Cart;
