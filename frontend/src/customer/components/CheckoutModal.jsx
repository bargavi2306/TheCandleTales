import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, MessageCircle, User, Phone, MapPin, ShoppingBag, AlertCircle } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useToast } from '../../context/ToastContext';
import { BUSINESS_CONFIG } from '../../config/businessConfig';
import { buildWhatsAppUrl } from '../utils/whatsappFormatter';

const CheckoutModal = ({ isOpen, onClose }) => {
  const { cartItems, totalItems, grandTotal } = useCart();
  const { addToast } = useToast();
  const modalRef = useRef(null);
  const firstInputRef = useRef(null);
  const lastFocusableRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const [errors, setErrors] = useState({});
  const [fallbackUrl, setFallbackUrl] = useState(null);

  // Focus trap: focus the first input when modal opens
  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [isOpen]);

  // ESC key to dismiss
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Focus trap: Tab cycling
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'input, textarea, button, [tabindex]:not([tabindex="-1"])'
        );
        const firstEl = focusableElements[0];
        const lastEl = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const validate = useCallback(() => {
    const newErrors = {};

    // Name: Required, minimum 3 characters
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters.';
    }

    // Phone: Required, exactly 10 numerical digits starting with 6-9
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Enter a valid 10-digit Indian phone number.';
    }

    // Address: Required, minimum 10 characters
    if (!formData.address.trim()) {
      newErrors.address = 'Delivery address is required.';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Address must be at least 10 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear individual field error on edit
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFallbackUrl(null);

    if (!validate()) return;

    const whatsappUrl = buildWhatsAppUrl({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      cartItems,
      grandTotal
    });

    try {
      const popup = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        // Popup was blocked — show fallback link
        setFallbackUrl(whatsappUrl);
        addToast("Popup blocked. Please use the manual link below.", "error");
      } else {
        addToast("WhatsApp opened! Complete your order there.", "success");
        // Cart is NOT cleared — safe cart preservation policy
      }
    } catch {
      setFallbackUrl(whatsappUrl);
      addToast("Could not open WhatsApp. Please use the manual link below.", "error");
    }
  };

  const handleClose = () => {
    setErrors({});
    setFallbackUrl(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-modal-title"
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-50 overflow-hidden transform transition-all animate-scaleUp"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div>
            <h2 id="checkout-modal-title" className="text-lg font-serif font-semibold text-accent-dark">
              Complete Your Order
            </h2>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Order via WhatsApp — no payment required here.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer text-gray-400 hover:text-gray-700"
            aria-label="Close checkout modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Summary Header (non-editable) */}
        <div className="mx-6 mt-4 px-4 py-3 bg-[#8B6B4A]/5 border border-[#8B6B4A]/10 rounded-xl flex items-center justify-between text-xs font-semibold text-accent-dark">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-primary" />
            <span>Items: {totalItems}</span>
          </div>
          <span>Total: {BUSINESS_CONFIG.currencySymbol}{grandTotal.toFixed(2)}</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pt-5 pb-6 space-y-4">

          {/* Full Name */}
          <div>
            <label htmlFor="checkout-name" className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5">
              <User className="h-3.5 w-3.5 text-gray-400" /> Full Name
            </label>
            <input
              ref={firstInputRef}
              id="checkout-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={`w-full px-4 py-2.5 border rounded-xl text-sm bg-gray-50/30 focus:outline-none focus:ring-2 transition-colors ${
                errors.name
                  ? 'border-rose-300 focus:ring-rose-200'
                  : 'border-gray-200 focus:ring-primary/20 focus:border-primary'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-[11px] text-rose-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.name}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="checkout-phone" className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5">
              <Phone className="h-3.5 w-3.5 text-gray-400" /> Phone Number
            </label>
            <input
              id="checkout-phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              maxLength={10}
              className={`w-full px-4 py-2.5 border rounded-xl text-sm bg-gray-50/30 focus:outline-none focus:ring-2 transition-colors ${
                errors.phone
                  ? 'border-rose-300 focus:ring-rose-200'
                  : 'border-gray-200 focus:ring-primary/20 focus:border-primary'
              }`}
            />
            {errors.phone && (
              <p className="mt-1 text-[11px] text-rose-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.phone}
              </p>
            )}
          </div>

          {/* Delivery Address */}
          <div>
            <label htmlFor="checkout-address" className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5">
              <MapPin className="h-3.5 w-3.5 text-gray-400" /> Delivery Address
            </label>
            <textarea
              id="checkout-address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              placeholder="Full street address, city, state, pincode"
              className={`w-full px-4 py-2.5 border rounded-xl text-sm bg-gray-50/30 focus:outline-none focus:ring-2 transition-colors resize-none ${
                errors.address
                  ? 'border-rose-300 focus:ring-rose-200'
                  : 'border-gray-200 focus:ring-primary/20 focus:border-primary'
              }`}
            />
            {errors.address && (
              <p className="mt-1 text-[11px] text-rose-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.address}
              </p>
            )}
          </div>

          {/* Fallback Link (shown when popup is blocked) */}
          {fallbackUrl && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-1.5">
              <p className="font-semibold">Popup was blocked by your browser.</p>
              <a
                href={fallbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary font-bold underline underline-offset-2"
              >
                <MessageCircle className="h-3.5 w-3.5" /> Click here to open WhatsApp manually
              </a>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              ref={lastFocusableRef}
              type="submit"
              className="flex-1 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-xs font-bold transition-colors shadow-md shadow-[#25D366]/20 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="h-4 w-4" /> Place Order on WhatsApp
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;
