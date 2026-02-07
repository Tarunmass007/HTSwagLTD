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
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmitted(true);
    setTimeout(() => onClose(), 2000);
  };

  if (submitted) {
    return (
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="newsletter-success-title"
      >
        <div className="rounded-store-xl shadow-store-xl max-w-md w-full p-8 text-center border border-[var(--border-subtle)] bg-[rgb(var(--color-background))] animate-slide-up">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Gift className="text-primary" size={28} />
          </div>
          <h3 id="newsletter-success-title" className="font-display text-xl font-semibold text-[rgb(var(--color-foreground))] mb-2">
            You&apos;re on the list
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Check your inbox for your first exclusive offer.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="newsletter-popup-title"
    >
      <div className="rounded-store-xl shadow-store-xl max-w-md w-full overflow-hidden border border-[var(--border-subtle)] bg-[rgb(var(--color-background))] animate-slide-up">
        <div className="relative p-6 sm:p-8">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-store text-gray-500 hover:text-[rgb(var(--color-foreground))] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800/50 flex items-center justify-center mx-auto mb-4">
              <Gift className="text-primary" size={28} />
            </div>
            <h2 id="newsletter-popup-title" className="font-display text-2xl font-semibold text-[rgb(var(--color-foreground))] mb-1">
              Get 15% off your first order
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Subscribe for exclusive deals and early access to new drops.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                autoComplete="email"
                className="input-store pl-11"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-store-accent w-full py-3 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Subscribing…' : 'Get my discount'}
            </button>
          </form>

          <p className="text-gray-500 dark:text-gray-400 text-xs text-center mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800/30 px-6 py-4 flex flex-wrap items-center justify-center gap-4 text-gray-600 dark:text-gray-400 text-xs">
          <span>Early access</span>
          <span className="text-gray-400 dark:text-gray-500">·</span>
          <span>Exclusive deals</span>
        </div>
      </div>
    </div>
  );
};
