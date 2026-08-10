import { BUSINESS_CONFIG } from '../../config/businessConfig';

/**
 * Sanitizes user input to prevent string injection.
 * Strips characters that could break the URL or message structure.
 */
const sanitize = (str) => {
  if (!str) return '';
  return str
    .replace(/[<>{}]/g, '')
    .trim();
};

/**
 * Formats cart items and customer details into a structured WhatsApp message
 * and returns the fully encoded URL string ready for wa.me redirection.
 *
 * @param {Object} params
 * @param {string} params.name - Customer full name
 * @param {string} params.phone - Customer phone number (10 digits)
 * @param {string} params.address - Customer delivery address
 * @param {Array} params.cartItems - Array of cart item objects { id, name, price, quantity, ... }
 * @param {number} params.grandTotal - Pre-computed grand total from CartContext
 * @returns {string} Complete https://wa.me/... URL with encoded text parameter
 */
export const buildWhatsAppUrl = ({ name, phone, address, cartItems, grandTotal }) => {
  const { currencySymbol } = BUSINESS_CONFIG;

  const sanitizedName = sanitize(name);
  const sanitizedPhone = sanitize(phone);
  const sanitizedAddress = sanitize(address);

  // Build sequential order line items
  const orderLines = cartItems.map((item, index) => {
    const lineAmount = item.price * item.quantity;
    return `${index + 1}. ${sanitize(item.name)} × ${item.quantity} - ${currencySymbol}${lineAmount.toFixed(2)}`;
  }).join('\n');

  const message = [
    `Hello ${BUSINESS_CONFIG.name},`,
    ``,
    `I'd like to place an order.`,
    ``,
    `Name: ${sanitizedName}`,
    `Phone: ${sanitizedPhone}`,
    ``,
    `Order Details:`,
    orderLines,
    ``,
    `Total: ${currencySymbol}${grandTotal.toFixed(2)}`,
    ``,
    `Delivery Address:`,
    sanitizedAddress
  ].join('\n');

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${BUSINESS_CONFIG.whatsAppNumber}?text=${encodedMessage}`;
};
