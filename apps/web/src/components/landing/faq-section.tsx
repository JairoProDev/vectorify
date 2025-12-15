'use client';

import { useTranslations } from '@/i18n/hooks';
import { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

const faqCategories = ['product', 'pricing', 'security'];

const faqItems = {
  product: ['chatbot', 'existing', 'unique', 'chatgpt'],
  pricing: ['free', 'cancel', 'refund', 'student'],
  security: ['data', 'secure', 'export'],
};

export function FAQSection() {
  const t = useTranslations('landing');
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('product');

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <section className="relative py-24 md:py-32 overflow-hidden" id="faq">
      {/* Background */}
      <div className="absolute inset-0 bg-card/30" />
      
      <div className="container relative px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <HelpCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              {t('faq.badge')}
            </span>
          </div>
          
          <h2 className="text-display-mobile md:text-display font-display font-bold mb-6">
            <span className="text-foreground">{t('faq.title.line1')}</span>
            <br />
            <span className="gradient-hero-text">{t('faq.title.line2')}</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('faq.subtitle')}
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {faqCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`
                px-5 py-2 rounded-full text-sm font-medium
                transition-all duration-300
                ${activeCategory === category 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-card border border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20'
                }
              `}
            >
              {t(`faq.categories.${category}`)}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqItems[activeCategory as keyof typeof faqItems].map((item) => {
            const id = `${activeCategory}-${item}`;
            const isOpen = openItems.includes(id);
            
            return (
              <div
                key={id}
                className={`
                  rounded-2xl border transition-all duration-300
                  ${isOpen 
                    ? 'bg-card border-primary/30' 
                    : 'bg-card/50 border-white/10 hover:border-white/20'
                  }
                `}
              >
                <button
                  onClick={() => toggleItem(id)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <h3 className="text-lg font-semibold pr-4">
                    {t(`faq.items.${activeCategory}.${item}.q`)}
                  </h3>
                  <ChevronDown 
                    className={`
                      w-5 h-5 text-muted-foreground flex-shrink-0
                      transition-transform duration-300
                      ${isOpen ? 'rotate-180' : ''}
                    `}
                  />
                </button>
                
                <div 
                  className={`
                    overflow-hidden transition-all duration-300
                    ${isOpen ? 'max-h-96 pb-6' : 'max-h-0'}
                  `}
                >
                  <div className="px-6 text-muted-foreground leading-relaxed">
                    {t(`faq.items.${activeCategory}.${item}.a`)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            {t('faq.moreQuestions')}
          </p>
          <a 
            href="mailto:support@vectorify.io" 
            className="text-primary hover:underline font-medium"
          >
            {t('faq.contactUs')}
          </a>
        </div>
      </div>
    </section>
  );
}





