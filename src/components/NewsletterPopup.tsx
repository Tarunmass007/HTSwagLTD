import React, { useState } from 'react';
import { X, Mail, Gift, Sparkles } from 'lucide-react';

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
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-slide-up">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="text-green-600 dark:text-green-400" size={32} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome Aboard! 🎉
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Check your inbox for exclusive deals!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-slide-up">
        <div className="relative p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="text-white" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Get 15% OFF 🎁
            </h2>
            <p className="text-white/90 text-lg">
              Subscribe for exclusive deals & early access!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white text-purple-600 font-bold py-3 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Subscribing...' : 'Get My Discount'}
            </button>
          </form>

          <p className="text-white/70 text-xs text-center mt-4">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm px-8 py-4 flex items-center justify-center gap-6 text-white/90 text-sm">
          <div className="flex items-center gap-2">
            <Sparkles size={16} />
            <span>Early Access</span>
          </div>
          <div className="flex items-center gap-2">
            <Gift size={16} />
            <span>Exclusive Deals</span>
          </div>
        </div>
      </div>
    </div>
  );
};