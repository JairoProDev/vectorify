'use client';

import { useTranslations } from '@/i18n/hooks';
import { Zap, GitBranch, Brain, Layout, Users, CheckCircle2 } from 'lucide-react';

const pillars = [
  {
    icon: Layout,
    key: 'graph',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Brain,
    key: 'copilot',
    gradient: 'from-primary to-accent',
  },
  {
    icon: GitBranch,
    key: 'strategy',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Zap,
    key: 'stacks',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Users,
    key: 'multiplayer',
    gradient: 'from-pink-500 to-rose-500',
  },
];

export function SolutionSection() {
  const t = useTranslations('landing');

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute inset-0 gradient-mesh opacity-50" />
      
      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/10 to-transparent rounded-full blur-3xl" />
      
      <div className="container relative px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              {t('solution.badge')}
            </span>
          </div>
          
          <h2 className="text-display-mobile md:text-display font-display font-bold mb-6">
            <span className="text-foreground">{t('solution.title.line1')}</span>
            <br />
            <span className="gradient-hero-text">{t('solution.title.line2')}</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('solution.subtitle')}
          </p>
        </div>

        {/* What Vector is NOT vs IS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
          {/* NOT */}
          <div className="p-6 md:p-8 rounded-2xl bg-card/50 border border-destructive/20">
            <h3 className="text-lg font-semibold text-destructive mb-6">
              {t('solution.not.title')}
            </h3>
            <ul className="space-y-4">
              {['notion', 'chatbot', 'productivity', 'course', 'tasks'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-muted-foreground">
                  <span className="text-destructive">✕</span>
                  {t(`solution.not.${item}`)}
                </li>
              ))}
            </ul>
          </div>

          {/* IS */}
          <div className="p-6 md:p-8 rounded-2xl bg-card/50 border border-primary/20 gradient-border">
            <h3 className="text-lg font-semibold text-primary mb-6">
              {t('solution.is.title')}
            </h3>
            <ul className="space-y-4">
              {['copilot', 'translator', 'living', 'coach', 'truth'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-foreground">
                  <span className="text-primary">✓</span>
                  {t(`solution.is.${item}`)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 5 Pillars */}
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-display font-bold">
            {t('solution.pillars.title')}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {pillars.map((pillar, index) => (
            <div
              key={pillar.key}
              className="
                relative group p-6 rounded-2xl
                bg-card/50 border border-white/5
                hover:border-primary/30 hover:bg-card
                hover-lift transition-all duration-300
              "
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`
                w-12 h-12 rounded-xl mb-4
                bg-gradient-to-br ${pillar.gradient}
                flex items-center justify-center
                group-hover:scale-110 transition-transform duration-300
              `}>
                <pillar.icon className="w-6 h-6 text-white" />
              </div>
              
              <h4 className="text-base font-semibold mb-2">
                {t(`solution.pillars.${pillar.key}.title`)}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t(`solution.pillars.${pillar.key}.desc`)}
              </p>
            </div>
          ))}
        </div>

        {/* Analogy */}
        <div className="mt-16 max-w-3xl mx-auto text-center">
          <div className="p-8 rounded-2xl bg-card/50 border border-primary/10 backdrop-blur-sm">
            <p className="text-xl md:text-2xl font-medium text-muted-foreground">
              {t('solution.analogy.prefix')}{' '}
              <span className="text-primary font-semibold">VS Code</span>{' '}
              {t('solution.analogy.middle')}{' '}
              <span className="text-accent font-semibold">Vectorify</span>{' '}
              {t('solution.analogy.suffix')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}





