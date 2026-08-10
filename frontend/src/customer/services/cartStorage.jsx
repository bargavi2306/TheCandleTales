const CART_KEY = 'candle_tales_cart';

export const getStoredCart = () => {
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Error parsing corrupted localStorage cart data. Clearing key.', err);
    try {
      localStorage.removeItem(CART_KEY);
    } catch (e) {
      console.error('Failed to clear key', e);
    }
    return [];
  }
};

export const storeCart = (cartItems) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  } catch (err) {
    console.error('Error serializing cart items to localStorage', err);
  }
};

export const clearStoredCart = () => {
  try {
    localStorage.removeItem(CART_KEY);
  } catch (err) {
    console.error('Error removing cart key from localStorage', err);
  }
};
