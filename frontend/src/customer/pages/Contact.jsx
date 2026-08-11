import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { Mail, MessageCircle, Phone, MapPin, Send } from 'lucide-react';
import { BUSINESS_CONFIG } from '../../config/businessConfig';

const Contact = () => {
  const { addToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      addToast("Please fill in all form fields.", "error");
      return;
    }
    setSubmitting(true);

    // Format message
    const formattedText = `Hello The Candle Tales,

I have a contact inquiry:

Name: ${name}
Email: ${email}

Message:
${message}`;

    const whatsappUrl = `https://wa.me/${BUSINESS_CONFIG.whatsAppNumber}?text=${encodeURIComponent(formattedText)}`;
    
    // Open in a new tab
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    addToast("Redirecting to WhatsApp to send your inquiry...", "success");
    setName('');
    setEmail('');
    setMessage('');
    setSubmitting(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans bg-bg-cream space-y-12 min-h-screen">
      {/* Header */}
      <div className="text-center space-y-2 border-b border-[#8B6B4A]/10 pb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-[#8B6B4A]">Connect</span>
        <h1 className="text-3xl font-serif text-accent-dark font-semibold">Get in Touch</h1>
        <p className="text-sm text-gray-500 max-w-xl mx-auto mt-2">
          Have an inquiry about bulk custom candle favors, custom scents, or corporate gifts? Drop us a line.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        
        {/* Contact Coordinates */}
        <div className="space-y-6">
          <h3 className="text-lg font-serif text-accent-dark font-semibold">Contact Information</h3>
          <p className="text-sm text-gray-500 leading-relaxed font-light">
            We pour and blend our candles in our studio batch house. For quick questions, custom restock consultations, or favor orders, we encourage messaging us directly on WhatsApp!
          </p>

          <div className="space-y-4">
            <div className="flex gap-4 items-start p-4 bg-white border border-gray-150 rounded-2xl shadow-sm">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-400 block uppercase tracking-wider">WhatsApp Support</span>
                <a 
                  href={`https://wa.me/${BUSINESS_CONFIG.whatsAppNumber}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-gray-800 hover:text-emerald-600 transition-colors"
                >
                  Message us on WhatsApp
                </a>
              </div>
            </div>

            <div className="flex gap-4 items-start p-4 bg-white border border-gray-150 rounded-2xl shadow-sm">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-400 block uppercase tracking-wider">Phone</span>
                <a 
                  href={`tel:${BUSINESS_CONFIG.phone}`}
                  className="text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors"
                >
                  {BUSINESS_CONFIG.phone}
                </a>
              </div>
            </div>

            <div className="flex gap-4 items-start p-4 bg-white border border-gray-150 rounded-2xl shadow-sm">
              <div className="p-2 bg-primary/10 text-primary rounded-xl">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-400 block uppercase tracking-wider">Email Inquiry</span>
                <a 
                  href={`mailto:${BUSINESS_CONFIG.email}`}
                  className="text-sm font-semibold text-gray-800 hover:text-primary transition-colors"
                >
                  {BUSINESS_CONFIG.email}
                </a>
              </div>
            </div>

            <div className="flex gap-4 items-start p-4 bg-white border border-gray-150 rounded-2xl shadow-sm">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-400 block uppercase tracking-wider">Studio Location</span>
                <span className="text-sm font-semibold text-gray-700">Chennai, Tamil Nadu, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-serif text-accent-dark font-semibold mb-4">Send a Message</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:ring-primary focus:border-primary rounded-xl text-sm"
                placeholder="e.g. Eleanor Vance"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:ring-primary focus:border-primary rounded-xl text-sm"
                placeholder="e.g. eleanor@site.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="4"
                className="mt-1 block w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:ring-primary focus:border-primary rounded-xl text-sm"
                placeholder="Details of your request..."
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-[#8B6B4A] hover:bg-[#6E4E37] text-white py-3 rounded-xl font-bold text-xs shadow-md shadow-[#8B6B4A]/10 transition-colors disabled:opacity-50"
            >
              <Send className="h-4 w-4" /> {submitting ? "Sending..." : "Submit Inquiry"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Contact;
