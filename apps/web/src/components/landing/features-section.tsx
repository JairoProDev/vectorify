'use client';

import { useTranslations } from '@/i18n/hooks';
import { 
  GitBranch, 
  Brain, 
  Zap, 
  Users, 
  RefreshCcw,
  Layers,
  Target,
  Shield
} from 'lucide-react';

const features = [
  {
    icon: GitBranch,
    key: 'strategyCode',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
  },
  {
    icon: Brain,
    key: 'aiCopilot',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/20',
  },
  {
    icon: Layers,
    key: 'projectGraph',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
  },
  {
    icon: Zap,
    key: 'smartStacks',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
  },
  {
    icon: Users,
    key: 'multiplayer',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/20',
  },
  {
    icon: RefreshCcw,
    key: 'versionControl',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/20',
  },
  {
    icon: Target,
    key: 'validation',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
  },
  {
    icon: Shield,
    key: 'security',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
  },
];

export function FeaturesSection() {
  const t = useTranslations('landing');

  return (
    <section className="relative py-24 md:py-32 overflow-hidden" id="features">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-card/30" />
      <div className="absolute inset-0 pattern-grid opacity-30" />
      
      <div className="container relative px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              {t('features.badge')}
            </span>
          </div>
          
          <h2 className="text-display-mobile md:text-display font-display font-bold mb-6">
            <span className="text-foreground">{t('features.title.line1')}</span>
            <br />
            <span className="gradient-hero-text">{t('features.title.line2')}</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.key}
              className={`
                relative group p-6 rounded-2xl
                bg-card/50 border ${feature.borderColor}
                hover:bg-card hover-lift
                transition-all duration-300
              `}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Icon */}
              <div className={`
                w-12 h-12 rounded-xl mb-4
                ${feature.bgColor}
                flex items-center justify-center
                group-hover:scale-110 transition-transform duration-300
              `}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              
              {/* Content */}
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                {t(`features.items.${feature.key}.title`)}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t(`features.items.${feature.key}.desc`)}
              </p>
              
              {/* Hover Indicator */}
              <div className={`
                absolute bottom-4 right-4 w-8 h-8 rounded-full
                ${feature.bgColor} ${feature.color}
                flex items-center justify-center
                opacity-0 group-hover:opacity-100
                transform translate-x-2 group-hover:translate-x-0
                transition-all duration-300
              `}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h3 className="text-2xl font-display font-bold text-center mb-8">
            {t('features.comparison.title')}
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-4 px-4 text-sm font-medium text-muted-foreground">
                    {t('features.comparison.feature')}
                  </th>
                  <th className="py-4 px-4 text-sm font-medium text-muted-foreground text-center">Notion</th>
                  <th className="py-4 px-4 text-sm font-medium text-muted-foreground text-center">ClickUp</th>
                  <th className="py-4 px-4 text-sm font-medium text-muted-foreground text-center">ChatGPT</th>
                  <th className="py-4 px-4 text-sm font-medium text-center text-primary">Vectorify</th>
                </tr>
              </thead>
              <tbody>
                {['strategy', 'execution', 'aiContext', 'connectedData', 'versionControl', 'stacks'].map((row) => (
                  <tr key={row} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 text-sm">
                      {t(`features.comparison.rows.${row}.name`)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <ComparisonIcon value={t(`features.comparison.rows.${row}.notion`)} />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <ComparisonIcon value={t(`features.comparison.rows.${row}.clickup`)} />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <ComparisonIcon value={t(`features.comparison.rows.${row}.chatgpt`)} />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <ComparisonIcon value={t(`features.comparison.rows.${row}.vectorify`)} highlight />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

function ComparisonIcon({ value, highlight = false }: { value: string; highlight?: boolean }) {
  if (value === 'yes') {
    return (
      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${highlight ? 'bg-primary/20 text-primary' : 'bg-green-500/20 text-green-400'}`}>
        ✓
      </span>
    );
  }
  if (value === 'partial') {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-400">
        ~
      </span>
    );
  }
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500/20 text-red-400">
      ✕
    </span>
  );
}





