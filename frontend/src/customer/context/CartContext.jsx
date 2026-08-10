import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { getStoredCart, storeCart, clearStoredCart } from '../services/cartStorage';
import { useToast } from '../../context/ToastContext';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { addToast } = useToast();
  const [cartItems, setCartItems] = useState(() => getStoredCart());

  // Automatically sync to local storage on mutation
  useEffect(() => {
    storeCart(cartItems);
  }, [cartItems]);

  // addToCart(product, quantityToAdd = 1)
  const addToCart = useCallback((product, quantityToAdd = 1) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === product.id);
      const currentQty = existingIndex > -1 ? prevItems[existingIndex].quantity : 0;
      const targetQty = currentQty + quantityToAdd;

      // Stock Enforcement Check
      if (targetQty > product.stock) {
        addToast(`Cannot add. Requested quantity (${targetQty}) exceeds stock limit of ${product.stock} units.`, "error");
        console.warn(`Stock limit check failed for product ID ${product.id}. Requested: ${targetQty}, Available: ${product.stock}`);
        return prevItems;
      }

      const updated = [...prevItems];
      if (existingIndex > -1) {
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: targetQty
        };
      } else {
        const firstImg = product.images?.[0]?.imageUrl || 'https://via.placeholder.com/350';
        updated.push({
          id: product.id,
          name: product.name,
          image: firstImg,
          price: product.price,
          quantity: quantityToAdd,
          stock: product.stock
        });
      }

      return updated;
    });
  }, []);

  // updateQuantity(productId, newQuantity)
  const updateQuantity = useCallback((productId, newQuantity) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === productId);
      if (!existing) return prevItems;

      if (newQuantity <= 0) {
        return prevItems.filter((item) => item.id !== productId);
      }

      // Stock Enforcement Check
      if (newQuantity > existing.stock) {
        addToast(`Cannot exceed available stock limit of ${existing.stock} units.`, "error");
        return prevItems.map((item) =>
          item.id === productId ? { ...item, quantity: existing.stock } : item
        );
      }

      return prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
    });
  }, [addToast]);

  // removeFromCart(productId)
  const removeFromCart = useCallback((productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  }, []);

  // clearCart()
  const clearCart = useCallback(() => {
    setCartItems([]);
    clearStoredCart();
  }, []);

  // Calculated Derived State (Memoized via useMemo)
  const totalItems = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const grandTotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      grandTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};
