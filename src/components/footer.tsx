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
    <footer className="bg-black dark:bg-gray-950 text-white border-t-4 border-red-600">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-3xl font-black mb-2 uppercase">
                Join Our Mailing List!
              </h3>
              <p className="text-lg font-medium opacity-90">
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
                  className="flex-1 px-6 py-3 rounded-lg bg-white text-black font-medium focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button
                  onClick={handleSubscribe}
                  className="bg-black text-white px-8 py-3 rounded-lg font-black hover:bg-gray-900 transition-colors uppercase whitespace-nowrap"
                >
                  Join Now
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
            <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">
              HTS <span className="text-red-600">SWAG</span>
            </h3>
            <p className="text-gray-300 mb-6 font-medium leading-relaxed">
              Your premium destination for quality merchandise, custom designs, and exclusive gift cards. 
              Screen printing, embroidery, signs & more!
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300">
                <Mail size={18} className="text-red-600" />
                <a href="mailto:support@htswag.com" className="hover:text-white transition-colors font-medium">
                  support@htswag.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Phone size={18} className="text-red-600" />
                <a href="tel:1-800-9101-4356" className="hover:text-white transition-colors font-medium">
                  1-800-9101-4356
                </a>
              </div>
              <div className="flex items-start gap-3 text-gray-300">
                <MapPin size={18} className="text-red-600 mt-1 flex-shrink-0" />
                <span className="font-medium">
                  123 Commerce Street<br />
                  Business City, ST 12345<br />
                  United States
                </span>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-lg font-black mb-4 uppercase border-b-2 border-red-600 pb-2">
              Shop
            </h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => onNavigate('products')}
                  className="text-gray-300 hover:text-white transition-colors font-medium hover:translate-x-1 inline-block"
                >
                  All Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gift-cards')}
                  className="text-gray-300 hover:text-white transition-colors font-medium hover:translate-x-1 inline-block"
                >
                  Gift Cards
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('deals')}
                  className="text-gray-300 hover:text-white transition-colors font-medium hover:translate-x-1 inline-block"
                >
                  Hot Deals 🔥
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products')}
                  className="text-gray-300 hover:text-white transition-colors font-medium hover:translate-x-1 inline-block"
                >
                  Custom Orders
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-black mb-4 uppercase border-b-2 border-red-600 pb-2">
              Support
            </h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => onNavigate('tracking')}
                  className="text-gray-300 hover:text-white transition-colors font-medium hover:translate-x-1 inline-block"
                >
                  Track Order
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('terms')}
                  className="text-gray-300 hover:text-white transition-colors font-medium hover:translate-x-1 inline-block"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="text-gray-300 hover:text-white transition-colors font-medium hover:translate-x-1 inline-block"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="text-gray-300 hover:text-white transition-colors font-medium hover:translate-x-1 inline-block"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Business Hours & Social */}
          <div>
            <h4 className="text-lg font-black mb-4 uppercase border-b-2 border-red-600 pb-2">
              Connect
            </h4>
            <div className="mb-6">
              <p className="text-sm font-bold text-gray-400 uppercase mb-2">Customer Service Hours</p>
              <p className="text-gray-300 font-medium text-sm mb-1">M-F: 9am - 5pm EST</p>
              <p className="text-gray-300 font-medium text-sm mb-1">Sat: 9am - 2pm EST</p>
              <p className="text-gray-300 font-medium text-sm">Sun: Closed</p>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase mb-3">Follow Us</p>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 hover:bg-red-600 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 hover:bg-red-600 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 hover:bg-red-600 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                >
                  <Twitter size={20} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 hover:bg-red-600 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                >
                  <Youtube size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <p className="text-center text-sm font-bold text-gray-400 uppercase mb-4">
            We Accept
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4">
            {['Visa', 'Mastercard', 'Discover', 'American Express', 'PayPal', 'Apple Pay'].map((payment) => (
              <div
                key={payment}
                className="bg-white px-4 py-2 rounded text-black font-black text-sm"
              >
                {payment}
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400 font-medium mb-2">
            COPYRIGHT © {new Date().getFullYear()} <span className="font-black text-white">HTS SWAG</span> BY <span className="font-black text-red-600">HTS LLC</span> - ALL RIGHTS RESERVED
          </p>
          <p className="text-gray-500 text-sm font-medium">
            ©ALL DESIGNS & IMAGES ARE COPYRIGHTED BY HTS LLC, HTS SWAG® ALL RIGHTS RESERVED.
          </p>
          <p className="text-gray-600 text-xs mt-4 font-medium">
            Made with ❤️ for awesome customers
          </p>
        </div>
      </div>
    </footer>
  );
};