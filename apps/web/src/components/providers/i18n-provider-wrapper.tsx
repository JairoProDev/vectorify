'use client';

import { I18nProvider } from '@/i18n/hooks';

export function I18nProviderWrapper({ children }: { children: React.ReactNode }) {
  return <I18nProvider>{children}</I18nProvider>;
}





