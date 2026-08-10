import React from 'react';
import { Sparkles, Heart, Compass, Shield } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans bg-bg-cream space-y-12">
      {/* Header */}
      <div className="text-center space-y-2 border-b border-[#8B6B4A]/10 pb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-[#8B6B4A]">Our Story</span>
        <h1 className="text-3xl sm:text-4xl font-serif text-accent-dark font-semibold">Behind The Candle Tales</h1>
        <p className="text-sm text-gray-500 max-w-xl mx-auto mt-2">
          Handcrafting light, comfort, and sustainable fragrance profiles designed to speak to your senses.
        </p>
      </div>

      {/* Narrative Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="rounded-2xl overflow-hidden shadow-md max-h-80 border border-gray-100">
          <img 
            src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=600" 
            alt="Hand-poured candle setting" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-serif text-accent-dark font-semibold">The Beginning of a Cozy Tale</h3>
          <p className="text-sm text-gray-600 leading-relaxed font-light">
            Founded in 2025 with a passion for cozy atmospheres and sustainable living, The Candle Tales began in a small home kitchen. Our goal was simple: to create clean, highly fragrant candles that tell a stories without releasing soot or synthetic toxins.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed font-light">
            Each batch is hand-blended and hand-poured with precision, ensuring that the scent throw is balanced and the burn time is extended. We believe that light is an experience, and a candle should soothe the mind.
          </p>
        </div>
      </section>

      {/* Values Grid */}
      <section className="space-y-6 pt-6 border-t border-[#8B6B4A]/10">
        <h3 className="text-lg font-serif text-accent-dark font-semibold text-center">Our Core Values</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-150 p-6 rounded-2xl text-center space-y-3 shadow-sm">
            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto">
              <Compass className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-semibold text-gray-800">100% Eco-Friendly</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              We exclusively use renewable soy wax, lead-free cotton wicks, and recyclable glass jars.
            </p>
          </div>

          <div className="bg-white border border-gray-150 p-6 rounded-2xl text-center space-y-3 shadow-sm">
            <div className="h-10 w-10 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-600 mx-auto">
              <Sparkles className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-semibold text-gray-800">Small Batch Quality</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Our candles are hand-poured in custom small series to preserve the ultimate level of details.
            </p>
          </div>

          <div className="bg-white border border-gray-150 p-6 rounded-2xl text-center space-y-3 shadow-sm">
            <div className="h-10 w-10 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-600 mx-auto">
              <Heart className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-semibold text-gray-800">Clean Fragrances</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Our botanical essential scents contain no phthalates, cruelty ingredients, or toxic additives.
            </p>
          </div>
        </div>
      </section>

      {/* Quote Banner */}
      <section className="bg-white border border-gray-150 p-8 rounded-2xl text-center font-serif text-[#6E4E37] max-w-2xl mx-auto shadow-inner leading-relaxed">
        "A candle is more than just wax and thread. It is a moment of pause, a scent that travels back in time, and a warm glow that invites you to breathe deeply."
      </section>
    </div>
  );
};

export default About;
