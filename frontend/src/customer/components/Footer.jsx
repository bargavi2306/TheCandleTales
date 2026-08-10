import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MessageCircle, Mail } from 'lucide-react';
import { BUSINESS_CONFIG } from '../../config/businessConfig';

const Footer = () => {
  return (
    <footer className="bg-accent-dark text-white border-t border-[#8B6B4A]/10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & Narrative */}
          <div className="space-y-4 col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 font-serif text-secondary tracking-widest">
              <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-secondary shadow-sm">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-semibold text-base">The Candle Tales</span>
            </Link>
            <p className="text-sm text-white/60 max-w-sm leading-relaxed">
              Premium handmade, eco-friendly soy wax candles curated to fill your home with warmth and luxury fragrance notes. Each story is hand-poured in small batches.
            </p>
          </div>

          {/* Site Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-secondary uppercase tracking-widest mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/products" className="hover:text-white transition-colors">Shop Collection</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Get in Touch</Link></li>
              <li><Link to="/policies" className="hover:text-white transition-colors">Store Policies</Link></li>
            </ul>
          </div>

          {/* Contact Coordinates */}
          <div>
            <h4 className="text-sm font-semibold text-secondary uppercase tracking-widest mb-4">Connect with us</h4>
            <div className="flex gap-4">
              {/* WhatsApp Link Placeholder */}
              <a 
                href={`https://wa.me/${BUSINESS_CONFIG.whatsAppNumber}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-white/80 hover:text-white"
                aria-label="WhatsApp Chat"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              {/* Instagram */}
              <a 
                href={BUSINESS_CONFIG.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-white/80 hover:text-white"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              {/* Email */}
              <a 
                href={`mailto:${BUSINESS_CONFIG.email}`}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-white/80 hover:text-white"
                aria-label="Email support"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
            <div className="mt-4 text-xs text-white/50 space-y-1">
              <p>Email: {BUSINESS_CONFIG.email}</p>
              <p>Phone: {BUSINESS_CONFIG.phone}</p>
            </div>
          </div>
          
        </div>

        {/* Bottom Line */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 gap-4">
          <p>© {new Date().getFullYear()} The Candle Tales. Handcrafted with love.</p>
          <div className="flex gap-4">
            <Link to="/policies" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/policies" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
