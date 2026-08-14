import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { BUSINESS_CONFIG } from '../../config/businessConfig';

const CartItemRow = React.memo(({ item, onUpdateQuantity, onDeleteClick }) => {
  const itemSubtotal = item.price * item.quantity;

  const handleIncrement = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    onUpdateQuantity(item.id, item.quantity - 1);
  };

  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="py-6 px-4">
        <div className="flex items-center gap-4">
          <img 
            src={item.image} 
            alt={item.name} 
            className="h-16 w-16 object-cover rounded-xl border border-gray-100 shadow-sm flex-shrink-0"
          />
          <div>
            <h4 className="text-sm font-semibold text-gray-800">{item.name}</h4>
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider block mt-0.5">
              Stock: {item.stock} left
            </span>
          </div>
        </div>
      </td>
      
      <td className="py-6 px-4 text-sm font-medium text-gray-600">
        {BUSINESS_CONFIG.currencySymbol}{item.price.toFixed(2)}
      </td>
      
      <td className="py-6 px-4">
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-8 bg-white shadow-inner max-w-[5.5rem]">
          <button
            onClick={handleDecrement}
            className="px-2 py-1 text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="flex-grow text-xs font-bold text-gray-700 text-center">
            {item.quantity}
          </span>
          <button
            onClick={handleIncrement}
            disabled={item.quantity >= item.stock}
            className="px-2 py-1 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
      
      <td className="py-6 px-4 text-sm font-bold text-gray-800">
        {BUSINESS_CONFIG.currencySymbol}{itemSubtotal.toFixed(2)}
      </td>
      
      <td className="py-6 px-4 text-right">
        <button
          onClick={() => onDeleteClick(item)}
          className="text-gray-400 hover:text-rose-600 transition-colors p-2 rounded-lg hover:bg-rose-50 cursor-pointer"
          aria-label={`Remove ${item.name}`}
        >
          <Trash2 className="h-4.5 w-4.5" />
        </button>
      </td>
    </tr>
  );
});

CartItemRow.displayName = 'CartItemRow';

export default CartItemRow;
