'use client';

import { useTranslations } from '@/i18n/hooks';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Play, Sparkles, CheckCircle2 } from 'lucide-react';

export function FinalCTASection() {
  const t = useTranslations('landing');

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-background to-background" />
      <div className="absolute inset-0 gradient-mesh opacity-50" />
      
      {/* Animated Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float-slow opacity-30" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-float opacity-20" style={{ animationDelay: '2s' }} />
      
      <div className="container relative px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">
              {t('finalCta.badge')}
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-display-mobile md:text-display font-display font-bold mb-6">
            <span className="text-foreground">{t('finalCta.title.line1')}</span>
            <br />
            <span className="gradient-hero-text">{t('finalCta.title.line2')}</span>
          </h2>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('finalCta.subtitle')}
          </p>

          {/* Value Props */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {['free', 'noCard', 'instant'].map((prop) => (
              <div key={prop} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">{t(`finalCta.props.${prop}`)}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
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
                {t('finalCta.cta.primary')}
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
              {t('finalCta.cta.secondary')}
            </Button>
          </div>

          {/* Trust Bar Mini */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i} 
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-background"
                  />
                ))}
              </div>
              <span>{t('finalCta.trust.users')}</span>
            </div>
            <div className="hidden sm:block h-4 w-px bg-border" />
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-1">{t('finalCta.trust.rating')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}





