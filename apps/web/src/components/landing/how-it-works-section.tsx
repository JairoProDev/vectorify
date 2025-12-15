'use client';

import { useTranslations } from '@/i18n/hooks';
import { MessageSquare, Sparkles, Rocket, RefreshCcw } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: MessageSquare,
    key: 'tell',
    gradient: 'from-blue-500 to-cyan-500',
    time: '10s',
  },
  {
    number: '02',
    icon: Sparkles,
    key: 'generate',
    gradient: 'from-primary to-accent',
    time: '2min',
  },
  {
    number: '03',
    icon: Rocket,
    key: 'execute',
    gradient: 'from-green-500 to-emerald-500',
    time: 'ongoing',
  },
  {
    number: '04',
    icon: RefreshCcw,
    key: 'iterate',
    gradient: 'from-orange-500 to-yellow-500',
    time: 'always',
  },
];

export function HowItWorksSection() {
  const t = useTranslations('landing');

  return (
    <section className="relative py-24 md:py-32 overflow-hidden" id="how-it-works">
      {/* Background */}
      <div className="absolute inset-0 bg-card/50" />
      <div className="absolute inset-0 gradient-mesh opacity-30" />
      
      <div className="container relative px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Rocket className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              {t('howItWorks.badge')}
            </span>
          </div>
          
          <h2 className="text-display-mobile md:text-display font-display font-bold mb-6">
            <span className="text-foreground">{t('howItWorks.title.line1')}</span>
            <br />
            <span className="gradient-hero-text">{t('howItWorks.title.line2')}</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        {/* Steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={step.key}
                className="relative group"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Step Card */}
                <div className="
                  relative p-6 rounded-2xl
                  bg-background border border-white/10
                  hover:border-primary/30 hover-lift
                  transition-all duration-300
                ">
                  {/* Step Number */}
                  <div className={`
                    absolute -top-4 -right-4 w-10 h-10 rounded-full
                    bg-gradient-to-br ${step.gradient}
                    flex items-center justify-center
                    text-sm font-bold text-white
                    shadow-glow-sm
                  `}>
                    {step.number}
                  </div>

                  {/* Time Badge */}
                  <div className="inline-flex items-center px-2 py-1 rounded text-xs font-mono bg-primary/10 text-primary mb-4">
                    {step.time}
                  </div>

                  {/* Icon */}
                  <div className={`
                    w-14 h-14 rounded-xl mb-4
                    bg-gradient-to-br ${step.gradient}
                    flex items-center justify-center
                    group-hover:scale-110 transition-transform duration-300
                  `}>
                    <step.icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold mb-2">
                    {t(`howItWorks.steps.${step.key}.title`)}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t(`howItWorks.steps.${step.key}.desc`)}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-2">
                    {['a', 'b', 'c'].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="w-1 h-1 rounded-full bg-primary" />
                        {t(`howItWorks.steps.${step.key}.features.${item}`)}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Arrow (mobile/tablet) */}
                {index < steps.length - 1 && (
                  <div className="flex lg:hidden justify-center py-4">
                    <svg className="w-6 h-6 text-primary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Quote */}
        <div className="mt-16 max-w-3xl mx-auto text-center">
          <blockquote className="text-lg md:text-xl italic text-muted-foreground">
            &ldquo;{t('howItWorks.quote')}&rdquo;
          </blockquote>
        </div>
      </div>
    </section>
  );
}





