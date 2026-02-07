import React, { useState } from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
  onShowNewsletter: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onShowNewsletter }) => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    onShowNewsletter();
  };

  return (
    <footer className="bg-[rgb(var(--color-foreground))] text-[rgb(var(--color-background))] border-t border-white/10">
      {/* Newsletter */}
      <div className="border-b border-white/10 py-12">
        <div className="section-store">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="font-display text-xl md:text-2xl font-semibold mb-2">
                Join our mailing list
              </h3>
              <p className="text-white/70 text-sm md:text-base">
                Get exclusive deals, early access & special offers delivered to your inbox.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="w-full md:w-auto flex gap-2 max-w-md">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-store bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 text-sm"
              />
              <button
                type="submit"
                className="btn-store px-6 py-3 bg-white text-[rgb(var(--color-foreground))] font-semibold hover:bg-white/90 whitespace-nowrap text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="section-store py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">
              HTS <span className="text-primary">SWAG</span>
            </h3>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Your premium destination for quality merchandise, custom designs, and exclusive gift cards. Screen printing, embroidery, signs & more!
            </p>
            <div className="space-y-3">
              <a href="mailto:support@htswag.com" className="flex items-center gap-3 text-white/70 hover:text-white text-sm transition-colors">
                <Mail size={16} className="text-primary flex-shrink-0" />
                support@htswag.com
              </a>
              <a href="tel:1-800-9101-4356" className="flex items-center gap-3 text-white/70 hover:text-white text-sm transition-colors">
                <Phone size={16} className="text-primary flex-shrink-0" />
                1-800-9101-4356
              </a>
              <div className="flex items-start gap-3 text-white/70 text-sm">
                <MapPin size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <span>123 Commerce Street<br />Business City, ST 12345<br />United States</span>
              </div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider mb-4 text-white/90">
              Shop
            </h4>
            <ul className="space-y-2.5">
              {[
                { page: 'products', label: 'All Products' },
                { page: 'gift-cards', label: 'Gift Cards' },
                { page: 'deals', label: 'Hot Deals' },
                { page: 'products', label: 'Custom Orders' },
              ].map(({ page, label }) => (
                <li key={label}>
                  <button
                    onClick={() => onNavigate(page)}
                    className="text-white/70 hover:text-white text-sm transition-colors"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider mb-4 text-white/90">
              Support
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => onNavigate('tracking')} className="text-white/70 hover:text-white text-sm transition-colors">
                  Track Order
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="text-white/70 hover:text-white text-sm transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="text-white/70 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home')} className="text-white/70 hover:text-white text-sm transition-colors">
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider mb-4 text-white/90">
              Connect
            </h4>
            <div className="mb-6">
              <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Customer Service Hours</p>
              <p className="text-white/70 text-sm">M–F: 9am–5pm EST</p>
              <p className="text-white/70 text-sm">Sat: 9am–2pm EST</p>
              <p className="text-white/70 text-sm">Sun: Closed</p>
            </div>
            <div className="flex gap-2">
              {[
                { icon: Facebook, label: 'Facebook' },
                { icon: Instagram, label: 'Instagram' },
                { icon: Twitter, label: 'Twitter' },
                { icon: Youtube, label: 'YouTube' },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="w-10 h-10 rounded-store bg-white/10 flex items-center justify-center text-white/80 hover:bg-white/20 hover:text-white transition-colors"
                  aria-label={label}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Payment & Copyright */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center justify-center">
              <div className="inline-flex items-center justify-center rounded-store border border-white/20 bg-white px-4 py-2.5">
                <img
                  src="https://cdn.shopify.com/s/files/1/1140/8418/t/2/assets/payments.png?12188859156103486521"
                  alt="We accept Visa, Mastercard, Discover, American Express, PayPal"
                  className="h-6 w-auto max-w-full object-contain opacity-90"
                />
              </div>
            </div>
            <p className="text-white/60 text-sm text-center md:text-right">
              © {new Date().getFullYear()} <span className="font-semibold text-white">HTS SWAG</span> by <span className="text-primary font-semibold">HTS LLC</span> — All Rights Reserved
            </p>
          </div>
          <p className="text-white/40 text-xs text-center mt-4">
            All designs & images are copyrighted by HTS LLC, HTS SWAG® All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
