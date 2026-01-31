import React, { useState } from 'react';
import { X, Mail, Gift } from 'lucide-react';

interface NewsletterPopupProps {
  onClose: () => void;
}

export const NewsletterPopup: React.FC<NewsletterPopupProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  if (submitted) {
    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="newsletter-success-title"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-8 text-center border border-gray-200 dark:border-gray-700">
          <div className="w-14 h-14 bg-red-50 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="text-red-600 dark:text-red-400" size={28} />
          </div>
          <h3
            id="newsletter-success-title"
            className="text-xl font-bold text-gray-900 dark:text-white mb-2"
          >
            You're on the list
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Check your inbox for your first exclusive offer.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="newsletter-popup-title"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="relative p-6 sm:p-8">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="text-red-500 dark:text-red-400" size={28} />
            </div>
            <h2
              id="newsletter-popup-title"
              className="text-2xl font-bold text-gray-900 dark:text-white mb-1"
            >
              Get 15% off your first order
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Subscribe for exclusive deals and early access to new drops.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                autoComplete="email"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            >
              {isSubmitting ? 'Subscribing…' : 'Get my discount'}
            </button>
          </form>

          <p className="text-gray-500 dark:text-gray-400 text-xs text-center mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 flex flex-wrap items-center justify-center gap-4 text-gray-600 dark:text-gray-300 text-xs">
          <span className="flex items-center gap-1.5">Early access</span>
          <span className="text-gray-300 dark:text-gray-500">·</span>
          <span className="flex items-center gap-1.5">Exclusive deals</span>
        </div>
      </div>
    </div>
  );
};
