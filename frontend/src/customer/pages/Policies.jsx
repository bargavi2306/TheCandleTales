import React from 'react';
import { Truck, RotateCcw, ShieldCheck, HeartHandshake } from 'lucide-react';

const Policies = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans bg-bg-cream space-y-12">
      {/* Header */}
      <div className="text-center space-y-2 border-b border-[#8B6B4A]/10 pb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-[#8B6B4A]">Guidelines</span>
        <h1 className="text-3xl font-serif text-accent-dark font-semibold">Store Policies</h1>
        <p className="text-sm text-gray-500 max-w-xl mx-auto mt-2">
          Read about our shipping schedules, handcrafted returns, and ordering expectations.
        </p>
      </div>

      {/* Policies Grid */}
      <div className="space-y-6">
        
        {/* Shipping policy */}
        <div className="flex gap-4 p-6 bg-white border border-gray-150 rounded-2xl shadow-sm">
          <div className="p-3 bg-primary/10 text-primary rounded-xl flex-shrink-0 h-11 w-11 flex items-center justify-center">
            <Truck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800">Shipping & Delivery</h3>
            <p className="text-xs text-gray-500 leading-relaxed font-light mt-1.5">
              Since all our premium soy candles are hand-poured in small batches, please allow **2-4 business days** for order processing before shipment. We offer flat-rate carbon-neutral ground shipping. You will receive a tracking link via email once your candle box departs our Portland batch house.
            </p>
          </div>
        </div>

        {/* Returns policy */}
        <div className="flex gap-4 p-6 bg-white border border-gray-150 rounded-2xl shadow-sm">
          <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl flex-shrink-0 h-11 w-11 flex items-center justify-center">
            <RotateCcw className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800">Refunds & Fragrance Exchange</h3>
            <p className="text-xs text-gray-500 leading-relaxed font-light mt-1.5">
              Your satisfaction is our primary story. If you are not completely satisfied with your fragrance blend, you may return your **unused and unlit** candle within **14 days** of delivery for a replacement or store credit. Return shipping fees are the responsibility of the customer.
            </p>
          </div>
        </div>

        {/* Privacy policy */}
        <div className="flex gap-4 p-6 bg-white border border-gray-150 rounded-2xl shadow-sm">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl flex-shrink-0 h-11 w-11 flex items-center justify-center">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800">Privacy & Secure Ordering</h3>
            <p className="text-xs text-gray-500 leading-relaxed font-light mt-1.5">
              We respect your data privacy. Your contact details and ordering statistics are encrypted and never shared. Ordering through our portal uses local storage to maintain session states and your active cart list.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Policies;
