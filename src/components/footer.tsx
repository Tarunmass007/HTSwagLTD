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
    <footer className="bg-gray-900 dark:bg-gray-950 text-white border-t border-gray-800 dark:border-gray-800">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-900 dark:to-gray-950 py-12 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">
                Join Our Mailing List
              </h3>
              <p className="text-gray-300 text-base">
                Get exclusive deals, early access & special offers!
              </p>
            </div>
            <div className="w-full md:w-auto">
              <div className="flex gap-2 max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-white text-sm"
                />
                <button
                  onClick={handleSubscribe}
                  className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap text-sm"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              HTS <span className="text-red-500">SWAG</span>
            </h3>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              Your premium destination for quality merchandise, custom designs, and exclusive gift cards. 
              Screen printing, embroidery, signs & more!
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <Mail size={16} className="text-red-500 flex-shrink-0" />
                <a href="mailto:support@htswag.com" className="text-sm">
                  support@htswag.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <Phone size={16} className="text-red-500 flex-shrink-0" />
                <a href="tel:1-800-9101-4356" className="text-sm">
                  1-800-9101-4356
                </a>
              </div>
              <div className="flex items-start gap-3 text-gray-400">
                <MapPin size={16} className="text-red-500 mt-1 flex-shrink-0" />
                <span className="text-sm">
                  123 Commerce Street<br />
                  Business City, ST 12345<br />
                  United States
                </span>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-base font-bold mb-4 text-white">
              Shop
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => onNavigate('products')}
                  className="text-gray-400 hover:text-white transition-colors text-sm hover:translate-x-1 inline-block"
                >
                  All Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gift-cards')}
                  className="text-gray-400 hover:text-white transition-colors text-sm hover:translate-x-1 inline-block"
                >
                  Gift Cards
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('deals')}
                  className="text-gray-400 hover:text-white transition-colors text-sm hover:translate-x-1 inline-block"
                >
                  Hot Deals
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products')}
                  className="text-gray-400 hover:text-white transition-colors text-sm hover:translate-x-1 inline-block"
                >
                  Custom Orders
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-base font-bold mb-4 text-white">
              Support
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => onNavigate('tracking')}
                  className="text-gray-400 hover:text-white transition-colors text-sm hover:translate-x-1 inline-block"
                >
                  Track Order
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('terms')}
                  className="text-gray-400 hover:text-white transition-colors text-sm hover:translate-x-1 inline-block"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="text-gray-400 hover:text-white transition-colors text-sm hover:translate-x-1 inline-block"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="text-gray-400 hover:text-white transition-colors text-sm hover:translate-x-1 inline-block"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Business Hours & Social */}
          <div>
            <h4 className="text-base font-bold mb-4 text-white">
              Connect
            </h4>
            <div className="mb-6">
              <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Customer Service Hours</p>
              <p className="text-gray-400 text-sm mb-1">M-F: 9am - 5pm EST</p>
              <p className="text-gray-400 text-sm mb-1">Sat: 9am - 2pm EST</p>
              <p className="text-gray-400 text-sm">Sun: Closed</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Follow Us</p>
              <div className="flex gap-2">
                <a
                  href="#"
                  className="w-9 h-9 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  aria-label="Facebook"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  aria-label="Instagram"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  aria-label="Twitter"
                >
                  <Twitter size={18} />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  aria-label="YouTube"
                >
                  <Youtube size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <p className="text-center text-xs font-semibold text-gray-400 uppercase mb-4">
            We Accept
          </p>
          <div className="flex flex-wrap justify-center items-center gap-3">
            {['Visa', 'Mastercard', 'Discover', 'American Express', 'PayPal', 'Apple Pay'].map((payment) => (
              <div
                key={payment}
                className="bg-gray-800 px-3 py-1.5 rounded text-white font-semibold text-xs border border-gray-700"
              >
                {payment}
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400 text-sm mb-2">
            © {new Date().getFullYear()} <span className="font-semibold text-white">HTS SWAG</span> by <span className="font-semibold text-red-500">HTS LLC</span> - All Rights Reserved
          </p>
          <p className="text-gray-500 text-xs">
            All designs & images are copyrighted by HTS LLC, HTS SWAG® All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};