'use client';

import { useTranslations } from '@/i18n/hooks';
import { useState } from 'react';
import { User, Building2, GraduationCap, ArrowRight, Star } from 'lucide-react';

const useCases = [
  {
    id: 'firstTime',
    icon: User,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    gradient: 'from-primary to-accent',
  },
  {
    id: 'serial',
    icon: Building2,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    gradient: 'from-emerald-500 to-green-600',
  },
  {
    id: 'student',
    icon: GraduationCap,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    gradient: 'from-blue-500 to-cyan-600',
  },
];

export function UseCasesSection() {
  const t = useTranslations('landing');
  const [activeCase, setActiveCase] = useState(useCases[0].id);

  const currentCase = useCases.find(c => c.id === activeCase) || useCases[0];

  return (
    <section className="relative py-24 md:py-32 overflow-hidden" id="use-cases">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
      
      <div className="container relative px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Star className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              {t('useCases.badge')}
            </span>
          </div>
          
          <h2 className="text-display-mobile md:text-display font-display font-bold mb-6">
            <span className="text-foreground">{t('useCases.title.line1')}</span>
            <br />
            <span className="gradient-hero-text">{t('useCases.title.line2')}</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('useCases.subtitle')}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {useCases.map((useCase) => (
            <button
              key={useCase.id}
              onClick={() => setActiveCase(useCase.id)}
              className={`
                flex items-center gap-3 px-6 py-3 rounded-full
                transition-all duration-300
                ${activeCase === useCase.id 
                  ? `bg-gradient-to-r ${useCase.gradient} text-white shadow-glow-sm` 
                  : 'bg-card border border-white/10 hover:border-white/20'
                }
              `}
            >
              <useCase.icon className="w-5 h-5" />
              <span className="font-medium">{t(`useCases.tabs.${useCase.id}`)}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Before */}
            <div className="p-6 md:p-8 rounded-2xl bg-card/50 border border-destructive/20">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm mb-6">
                {t('useCases.before')}
              </div>
              
              <h3 className="text-xl font-bold mb-6">
                {t(`useCases.cases.${currentCase.id}.before.title`)}
              </h3>
              
              <ul className="space-y-4">
                {['a', 'b', 'c', 'd', 'e', 'f'].map((item) => {
                  const text = t(`useCases.cases.${currentCase.id}.before.items.${item}`);
                  if (!text || text.includes('useCases')) return null;
                  return (
                    <li key={item} className="flex items-start gap-3 text-muted-foreground">
                      <span className="text-destructive mt-0.5">✕</span>
                      <span>{text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* After */}
            <div className="p-6 md:p-8 rounded-2xl bg-card/50 border border-primary/20 gradient-border">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${currentCase.bgColor} ${currentCase.color} text-sm mb-6`}>
                {t('useCases.after')}
              </div>
              
              <h3 className="text-xl font-bold mb-6">
                {t(`useCases.cases.${currentCase.id}.after.title`)}
              </h3>
              
              <ul className="space-y-4">
                {['a', 'b', 'c', 'd', 'e', 'f'].map((item) => {
                  const text = t(`useCases.cases.${currentCase.id}.after.items.${item}`);
                  if (!text || text.includes('useCases')) return null;
                  return (
                    <li key={item} className="flex items-start gap-3">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>{text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Quote */}
          <div className="mt-12 p-6 md:p-8 rounded-2xl bg-card border border-white/10">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className={`
                w-16 h-16 rounded-full flex-shrink-0
                bg-gradient-to-br ${currentCase.gradient}
                flex items-center justify-center
              `}>
                <currentCase.icon className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <blockquote className="text-lg italic text-muted-foreground mb-4">
                  &ldquo;{t(`useCases.cases.${currentCase.id}.quote.text`)}&rdquo;
                </blockquote>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{t(`useCases.cases.${currentCase.id}.quote.author`)}</span>
                  <span className="text-muted-foreground">—</span>
                  <span className="text-sm text-muted-foreground">{t(`useCases.cases.${currentCase.id}.quote.role`)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            {['timeToMvp', 'mvpRate', 'satisfaction', 'recommendation'].map((stat) => (
              <div key={stat} className="text-center p-6 rounded-xl bg-card/50 border border-white/5">
                <div className="text-3xl md:text-4xl font-bold gradient-hero-text mb-2">
                  {t(`useCases.stats.${stat}.value`)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t(`useCases.stats.${stat}.label`)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}





