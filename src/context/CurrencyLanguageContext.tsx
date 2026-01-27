// src/context/CurrencyLanguageContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { translations, Language, TranslationKey } from '../lib/translations';

interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
}

interface CurrencyOption {
  code: string;
  symbol: string;
  rate: number;
  name: string;
}

interface CurrencyLanguageContextType {
  language: LanguageOption;
  setLanguage: (lang: LanguageOption) => void;
  currency: CurrencyOption;
  setCurrency: (curr: CurrencyOption) => void;
  formatPrice: (price: number) => string;
  convertPrice: (price: number) => number;
  t: (key: TranslationKey) => string;
}

export const languages: LanguageOption[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export const currencies: CurrencyOption[] = [
  { code: 'USD', symbol: '$', rate: 1, name: 'US Dollar' },
  { code: 'EUR', symbol: '€', rate: 0.92, name: 'Euro' },
  { code: 'GBP', symbol: '£', rate: 0.79, name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', rate: 1.36, name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', rate: 1.53, name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', rate: 149.50, name: 'Japanese Yen' },
];

const CurrencyLanguageContext = createContext<CurrencyLanguageContextType | undefined>(undefined);

export const CurrencyLanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageOption>(languages[0]);
  const [currency, setCurrency] = useState<CurrencyOption>(currencies[0]);

  const convertPrice = (price: number): number => {
    return price * currency.rate;
  };

  const formatPrice = (price: number): string => {
    const converted = convertPrice(price);
    
    if (currency.code === 'JPY') {
      return `${currency.symbol}${Math.round(converted).toLocaleString()}`;
    }
    
    return `${currency.symbol}${converted.toFixed(2)}`;
  };

  const t = (key: TranslationKey): string => {
    return translations[language.code][key] || translations.en[key] || key;
  };

  return (
    <CurrencyLanguageContext.Provider
      value={{
        language,
        setLanguage,
        currency,
        setCurrency,
        formatPrice,
        convertPrice,
        t,
      }}
    >
      {children}
    </CurrencyLanguageContext.Provider>
  );
};

export const useCurrencyLanguage = () => {
  const context = useContext(CurrencyLanguageContext);
  if (context === undefined) {
    throw new Error('useCurrencyLanguage must be used within a CurrencyLanguageProvider');
  }
  return context;
};