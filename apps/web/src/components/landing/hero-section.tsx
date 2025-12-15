'use client';

import { useTranslations } from '@/i18n/hooks';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

export function HeroSection() {
  const t = useTranslations('landing');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute inset-0 pattern-grid opacity-50" />
      
      {/* Animated Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float-slow opacity-30" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-float opacity-20" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/10 to-transparent rounded-full" />
      
      <div className="container relative z-10 px-4 py-20 md:py-32">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div 
            className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-full 
              bg-primary/10 border border-primary/20 backdrop-blur-sm
              mb-8 transition-all duration-700
              ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}
          >
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">
              {t('hero.badge')}
            </span>
          </div>

          {/* Main Headline */}
          <h1 
            className={`
              text-hero-mobile md:text-hero font-display font-bold 
              mb-6 transition-all duration-700 delay-100
              ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
          >
            <span className="block text-foreground mb-2">
              {t('hero.title.line1')}
            </span>
            <span className="gradient-hero-text text-glow">
              {t('hero.title.line2')}
            </span>
          </h1>

          {/* Subheadline */}
          <p 
            className={`
              text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10
              transition-all duration-700 delay-200
              ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
          >
            {t('hero.subtitle')}
          </p>

          {/* CTA Buttons */}
          <div 
            className={`
              flex flex-col sm:flex-row gap-4 mb-12
              transition-all duration-700 delay-300
              ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
          >
            <Link href="/workspace">
              <Button 
                size="lg" 
                className="
                  h-14 px-8 text-base font-semibold
                  bg-gradient-to-r from-primary via-primary to-accent
                  hover:opacity-90 transition-all duration-300
                  shadow-glow hover:shadow-glow-lg
                  animate-pulse-glow
                "
              >
                {t('hero.cta.primary')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="
                h-14 px-8 text-base font-semibold
                border-white/10 bg-white/5 backdrop-blur-sm
                hover:bg-white/10 hover:border-primary/50
                transition-all duration-300
              "
            >
              <Play className="mr-2 h-5 w-5" />
              {t('hero.cta.secondary')}
            </Button>
          </div>

          {/* Trust Indicators */}
          <div 
            className={`
              flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground
              transition-all duration-700 delay-400
              ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div 
                    key={i} 
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-background"
                    style={{ 
                      opacity: 1 - (i * 0.1),
                      transform: `translateX(${i * 2}px)`
                    }}
                  />
                ))}
              </div>
              <span>{t('hero.trust.users')}</span>
            </div>
            <div className="h-4 w-px bg-border hidden sm:block" />
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-1">{t('hero.trust.rating')}</span>
            </div>
            <div className="h-4 w-px bg-border hidden sm:block" />
            <span>{t('hero.trust.noCard')}</span>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div 
          className={`
            absolute bottom-8 left-1/2 -translate-x-1/2
            transition-all duration-700 delay-500
            ${mounted ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <span className="text-xs uppercase tracking-wider">{t('hero.scroll')}</span>
            <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}





