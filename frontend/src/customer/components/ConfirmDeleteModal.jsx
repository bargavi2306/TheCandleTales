import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-gray-50 overflow-hidden transform transition-all p-6 text-center space-y-4 animate-scaleUp">
        
        {/* Warning Icon Banner */}
        <div className="mx-auto h-12 w-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
          <AlertTriangle className="h-6 w-6" />
        </div>

        {/* Modal Info */}
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-gray-800">Remove Item?</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Are you sure you want to remove <strong className="text-gray-700">"{itemName}"</strong> from your shopping cart?
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-md shadow-rose-150 cursor-pointer"
          >
            Remove
          </button>
        </div>

      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
