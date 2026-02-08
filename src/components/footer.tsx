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
    <footer className="bg-[rgb(var(--footer-bg))] text-[rgb(var(--footer-text))] border-t border-white/10">
      {/* Newsletter */}
      <div className="border-b border-white/10 py-12">
        <div className="section-store">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="font-display text-xl md:text-2xl font-semibold mb-2 text-[rgb(var(--footer-text))]">
                Join our mailing list
              </h3>
              <p className="text-[rgb(var(--footer-text-muted))] text-sm md:text-base">
                Get exclusive deals, early access & special offers delivered to your inbox.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="w-full md:w-auto flex gap-2 max-w-md">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-store bg-white/10 border border-white/20 text-[rgb(var(--footer-text))] placeholder:text-[rgb(var(--footer-text-muted))] focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 text-sm"
              />
              <button
                type="submit"
                className="btn-store px-6 py-3 bg-white text-[rgb(var(--footer-bg))] font-semibold hover:bg-gray-100 whitespace-nowrap text-sm"
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
            <h3 className="font-display text-lg font-semibold mb-4 text-[rgb(var(--footer-text))]">
              <span className="text-[rgb(var(--footer-text))]">HTS</span> <span className="text-primary">SWAG</span>
            </h3>
            <p className="text-[rgb(var(--footer-text-muted))] text-sm leading-relaxed mb-6">
              Your premium destination for quality merchandise, custom designs, and exclusive gift cards. Screen printing, embroidery, signs & more!
            </p>
            <div className="space-y-3">
              <a href="mailto:support@htswag.com" className="flex items-center gap-3 text-[rgb(var(--footer-text-muted))] hover:text-[rgb(var(--footer-text))] text-sm transition-colors">
                <Mail size={16} className="text-primary flex-shrink-0" />
                support@htswag.com
              </a>
              <a href="tel:1-800-9101-4356" className="flex items-center gap-3 text-[rgb(var(--footer-text-muted))] hover:text-[rgb(var(--footer-text))] text-sm transition-colors">
                <Phone size={16} className="text-primary flex-shrink-0" />
                1-800-9101-4356
              </a>
              <div className="flex items-start gap-3 text-[rgb(var(--footer-text-muted))] text-sm">
                <MapPin size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <span>123 Commerce Street<br />Business City, ST 12345<br />United States</span>
              </div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider mb-4 text-[rgb(var(--footer-text))]">
              Shop
            </h4>
            <ul className="space-y-2.5">
              {[
                { page: 'products', label: 'All Products' },
                { page: 'products', category: 'gift-cards', label: 'Gift Cards' },
                { page: 'products', category: 'deals', label: 'Hot Deals' },
              ].map(({ page, label, category }) => (
                <li key={label}>
                  <button
                    onClick={() => onNavigate(page, category)}
                    className="text-[rgb(var(--footer-text-muted))] hover:text-[rgb(var(--footer-text))] text-sm transition-colors"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider mb-4 text-[rgb(var(--footer-text))]">
              Support
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => onNavigate('tracking')} className="text-[rgb(var(--footer-text-muted))] hover:text-[rgb(var(--footer-text))] text-sm transition-colors">
                  Track Order
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="text-[rgb(var(--footer-text-muted))] hover:text-[rgb(var(--footer-text))] text-sm transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="text-[rgb(var(--footer-text-muted))] hover:text-[rgb(var(--footer-text))] text-sm transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home')} className="text-[rgb(var(--footer-text-muted))] hover:text-[rgb(var(--footer-text))] text-sm transition-colors">
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider mb-4 text-[rgb(var(--footer-text))]">
              Connect
            </h4>
            <div className="mb-6">
              <p className="text-xs font-semibold text-[rgb(var(--footer-text-muted))] uppercase tracking-wider mb-2">Customer Service Hours</p>
              <p className="text-[rgb(var(--footer-text-muted))] text-sm">M–F: 9am–5pm EST</p>
              <p className="text-[rgb(var(--footer-text-muted))] text-sm">Sat: 9am–2pm EST</p>
              <p className="text-[rgb(var(--footer-text-muted))] text-sm">Sun: Closed</p>
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
                  className="w-10 h-10 rounded-store bg-white/10 flex items-center justify-center text-[rgb(var(--footer-text-muted))] hover:bg-white/20 hover:text-[rgb(var(--footer-text))] transition-colors"
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
            <div className="flex items-center justify-center w-full md:w-auto min-w-0">
              <div className="inline-flex items-center justify-center rounded-store border border-white/20 bg-white px-6 py-3 w-full min-w-[200px] sm:min-w-[280px] max-w-[360px]">
                <img
                  src="https://cdn.shopify.com/s/files/1/1140/8418/t/2/assets/payments.png?12188859156103486521"
                  alt="We accept Visa, Mastercard, Discover, American Express, PayPal"
                  className="h-8 w-full min-w-[180px] object-contain object-center opacity-90"
                />
              </div>
            </div>
            <p className="text-[rgb(var(--footer-text-muted))] text-sm text-center md:text-right">
              © {new Date().getFullYear()} <span className="font-semibold text-[rgb(var(--footer-text))]">HTS SWAG</span> by <span className="text-primary font-semibold">HTS LLC</span> — All Rights Reserved
            </p>
          </div>
          <p className="text-[rgb(var(--footer-text-muted))] text-xs text-center mt-4 opacity-90">
            All designs & images are copyrighted by HTS LLC, HTS SWAG® All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
