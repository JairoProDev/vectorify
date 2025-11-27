'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale, locales, defaultLocale } from './config';

type Messages = Record<string, any>;

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  messages: Messages;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((current, key) => current?.[key], obj) || path;
}

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return params[key]?.toString() || '';
  });
}

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [messages, setMessages] = useState<Messages>({});

  useEffect(() => {
    // Load messages for current locale
    const loadMessages = async () => {
      try {
        const module = await import(`./messages/${locale}.json`);
        setMessages(module.default || module);
      } catch {
        try {
          // Fallback to default locale if current locale fails
          const fallbackModule = await import(`./messages/${defaultLocale}.json`);
          setMessages(fallbackModule.default || fallbackModule);
        } catch {
          setMessages({});
        }
      }
    };
    loadMessages();
  }, [locale]);

  useEffect(() => {
    // Load saved locale from localStorage
    const savedLocale = localStorage.getItem('vectorify-locale') as Locale;
    if (savedLocale && locales.includes(savedLocale)) {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('vectorify-locale', newLocale);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const message = getNestedValue(messages, key);
    if (typeof message === 'string') {
      return interpolate(message, params);
    }
    return key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, messages }}>
      {children}
    </I18nContext.Provider>
  );
}
