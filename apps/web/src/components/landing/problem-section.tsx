'use client';

import { useTranslations } from '@/i18n/hooks';
import { AlertTriangle, Clock, Puzzle, Brain, TrendingDown } from 'lucide-react';

const problems = [
  {
    icon: Puzzle,
    titleKey: 'fragmentation.title',
    descKey: 'fragmentation.desc',
    stats: '5+',
    statsLabel: 'tools',
  },
  {
    icon: Clock,
    titleKey: 'paralysis.title',
    descKey: 'paralysis.desc',
    stats: '4',
    statsLabel: 'months',
  },
  {
    icon: Brain,
    titleKey: 'context.title',
    descKey: 'context.desc',
    stats: '0',
    statsLabel: 'memory',
  },
  {
    icon: TrendingDown,
    titleKey: 'failure.title',
    descKey: 'failure.desc',
    stats: '90%',
    statsLabel: 'fail',
  },
];

export function ProblemSection() {
  const t = useTranslations('landing');

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-destructive/5 to-background" />
      <div className="absolute inset-0 pattern-dots opacity-30" />
      
      <div className="container relative px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/20 mb-6">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <span className="text-sm font-medium text-destructive">
              {t('problem.badge')}
            </span>
          </div>
          
          <h2 className="text-display-mobile md:text-display font-display font-bold mb-6">
            <span className="text-foreground">{t('problem.title.line1')}</span>
            <br />
            <span className="text-destructive">{t('problem.title.line2')}</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('problem.subtitle')}
          </p>
        </div>

        {/* The Cycle Visualization */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="relative p-8 rounded-2xl bg-card/50 border border-destructive/20 backdrop-blur-sm overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-transparent" />
            
            <div className="relative grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              {['day1', 'day7', 'day30', 'day90'].map((day, index) => (
                <div key={day} className="relative">
                  {index > 0 && (
                    <div className="hidden md:block absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-px bg-destructive/30" />
                  )}
                  <div className="p-4 rounded-xl bg-background/50 border border-destructive/10">
                    <span className="block text-xs font-mono text-destructive/80 mb-1">
                      {t(`problem.cycle.${day}.day`)}
                    </span>
                    <p className="text-sm text-muted-foreground">
                      {t(`problem.cycle.${day}.text`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => (
            <div
              key={problem.titleKey}
              className="
                relative group p-6 rounded-2xl
                bg-card/50 border border-white/5
                hover:border-destructive/30 hover:bg-card
                transition-all duration-300
              "
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-destructive/10">
                  <problem.icon className="w-5 h-5 text-destructive" />
                </div>
                <div className="text-right">
                  <span className="block text-2xl font-bold text-destructive">
                    {problem.stats}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {t(`problem.${problem.statsLabel}`)}
                  </span>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mb-2 group-hover:text-destructive transition-colors">
                {t(`problem.${problem.titleKey}`)}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t(`problem.${problem.descKey}`)}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Statement */}
        <div className="mt-16 text-center">
          <p className="text-xl md:text-2xl font-medium text-muted-foreground">
            {t('problem.statement.prefix')}{' '}
            <span className="text-foreground font-semibold">
              {t('problem.statement.highlight')}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}





