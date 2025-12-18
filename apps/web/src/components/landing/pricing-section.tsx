'use client';

import { useTranslations } from '@/i18n/hooks';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Check, Sparkles, Zap, Users, Building2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    id: 'free',
    icon: Sparkles,
    popular: false,
    gradient: 'from-slate-500 to-zinc-600',
  },
  {
    id: 'pro',
    icon: Zap,
    popular: true,
    gradient: 'from-primary to-accent',
  },
  {
    id: 'team',
    icon: Users,
    popular: false,
    gradient: 'from-accent to-blue-600',
  },
  {
    id: 'enterprise',
    icon: Building2,
    popular: false,
    gradient: 'from-slate-700 to-slate-900',
  },
];

export function PricingSection() {
  const t = useTranslations('landing');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  return (
    <section className="relative py-24 md:py-32 overflow-hidden" id="pricing">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-card/30 via-background to-card/30" />
      <div className="absolute inset-0 pattern-grid opacity-20" />

      <div className="container relative px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="text-sm font-medium text-primary">
              {t('pricing.badge')}
            </span>
          </div>

          <h2 className="text-display-mobile md:text-display font-display font-bold mb-6">
            <span className="text-foreground">{t('pricing.title.line1')}</span>
            <br />
            <span className="gradient-hero-text">{t('pricing.title.line2')}</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {t('pricing.subtitle')}
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 p-2 rounded-full bg-card border border-white/10">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${billingCycle === 'monthly'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              {t('pricing.monthly')}
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${billingCycle === 'annual'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              {t('pricing.annual')}
              <span className="ml-2 text-xs text-green-400">{t('pricing.save20')}</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className={`
                relative p-6 rounded-2xl transition-all duration-300
                ${plan.popular
                  ? 'bg-card border-2 border-primary shadow-glow scale-105 z-10'
                  : 'bg-card/50 border border-white/10 hover:border-white/20'
                }
              `}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  {t('pricing.mostPopular')}
                </div>
              )}

              {/* Icon */}
              <div className={`
                w-12 h-12 rounded-xl mb-4
                bg-gradient-to-br ${plan.gradient}
                flex items-center justify-center
              `}>
                <plan.icon className="w-6 h-6 text-white" />
              </div>

              {/* Plan Name */}
              <h3 className="text-xl font-bold mb-2">
                {t(`pricing.plans.${plan.id}.name`)}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t(`pricing.plans.${plan.id}.desc`)}
              </p>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold">
                  {plan.id === 'enterprise'
                    ? t('pricing.custom')
                    : billingCycle === 'annual'
                      ? t(`pricing.plans.${plan.id}.priceAnnual`)
                      : t(`pricing.plans.${plan.id}.priceMonthly`)
                  }
                </span>
                {plan.id !== 'enterprise' && plan.id !== 'free' && (
                  <span className="text-muted-foreground">/{t('pricing.perMonth')}</span>
                )}
              </div>

              {/* CTA */}
              <Link href={plan.id === 'enterprise' ? '/contact' : '/workspace'}>
                <Button
                  className={`w-full mb-6 ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {t(`pricing.plans.${plan.id}.cta`)}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>

              {/* Features */}
              <ul className="space-y-3">
                {['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((item) => {
                  const feature = t(`pricing.plans.${plan.id}.features.${item}`);
                  if (!feature || feature.includes('pricing.plans')) return null;
                  return (
                    <li key={item} className="flex items-start gap-3 text-sm">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Money-back guarantee */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            {t('pricing.guarantee')}
          </p>
        </div>

        {/* FAQ Link */}
        <div className="mt-8 text-center">
          <a href="#faq" className="text-primary hover:underline text-sm">
            {t('pricing.faqLink')}
          </a>
        </div>
      </div>
    </section>
  );
}





