'use client';

import { useTranslations } from '@/i18n/hooks';

const logos = [
  { name: 'Y Combinator', abbr: 'YC' },
  { name: 'Platanus', abbr: 'PLT' },
  { name: '500 Startups', abbr: '500' },
  { name: 'Techstars', abbr: 'TS' },
  { name: 'Stanford', abbr: 'SU' },
  { name: 'MIT', abbr: 'MIT' },
];

export function TrustBar() {
  const t = useTranslations('landing');

  return (
    <section className="relative py-16 border-y border-white/5">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
      
      <div className="container relative px-4">
        <p className="text-center text-sm text-muted-foreground mb-8 uppercase tracking-wider">
          {t('trust.title')}
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {logos.map((logo, index) => (
            <div
              key={logo.name}
              className="
                flex items-center justify-center
                px-6 py-3 rounded-lg
                bg-white/5 border border-white/10
                hover:bg-white/10 hover:border-primary/30
                transition-all duration-300
                group cursor-default
              "
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <span className="text-lg font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                {logo.abbr}
              </span>
            </div>
          ))}
        </div>

        {/* Featured In Section */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <p className="text-center text-sm text-muted-foreground mb-6">
            {t('trust.featured')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {['Product Hunt', 'TechCrunch', 'Indie Hackers', 'Hacker News'].map((pub) => (
              <span 
                key={pub} 
                className="text-sm font-medium text-muted-foreground/60 hover:text-muted-foreground transition-colors"
              >
                {pub}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}





