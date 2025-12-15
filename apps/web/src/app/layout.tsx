import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { I18nProviderWrapper } from '@/components/providers/i18n-provider-wrapper';

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a12' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: 'Vectorify - The Innovation Operating System | AI Copilot for Founders',
    template: '%s | Vectorify',
  },
  description: 'Vectorify is the strategic AI copilot that transforms your chaos of ideas into an executable roadmap. From paralysis to action in 10 minutes. Used by 10,000+ founders.',
  keywords: [
    'startup tool',
    'AI copilot',
    'project management',
    'lean canvas',
    'founder productivity',
    'business strategy',
    'startup operating system',
    'strategic planning software',
    'Y Combinator',
    'MVP development',
  ],
  authors: [{ name: 'Vectorify', url: 'https://vectorify.io' }],
  creator: 'Vectorify',
  publisher: 'Vectorify',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://vectorify.io'),
  alternates: {
    canonical: '/',
    languages: {
      'en': '/en',
      'es': '/es',
      'pt': '/pt',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['es_ES', 'pt_BR'],
    url: 'https://vectorify.io',
    siteName: 'Vectorify',
    title: 'Vectorify - From Paralysis to Action in 10 Minutes',
    description: 'The strategic AI copilot that transforms your chaos of ideas into an executable roadmap. Join 10,000+ founders who stopped overthinking and started building.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Vectorify - The Innovation Operating System',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vectorify - AI Copilot for Founders',
    description: 'From paralysis to action in 10 minutes. Transform your chaos of ideas into an executable roadmap.',
    creator: '@vectorifyHQ',
    images: ['/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  category: 'technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Vectorify',
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Web',
              description: 'The strategic AI copilot that transforms your chaos of ideas into an executable roadmap. From paralysis to action in 10 minutes.',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
                priceValidUntil: '2025-12-31',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.9',
                ratingCount: '10000',
              },
            }),
          }}
        />
      </head>
      <body 
        className={cn(
          spaceGrotesk.variable,
          jetbrainsMono.variable,
          'font-sans antialiased bg-background text-foreground'
        )}
      >
        <I18nProviderWrapper>
          <ThemeProvider 
            attribute="class"
            defaultTheme="dark" 
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </I18nProviderWrapper>
      </body>
    </html>
  );
}
