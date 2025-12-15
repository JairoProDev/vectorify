'use client';

import { useTranslations } from '@/i18n/hooks';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 'camila',
    avatar: 'C',
    gradient: 'from-pink-500 to-rose-600',
  },
  {
    id: 'diego',
    avatar: 'D',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'sofia',
    avatar: 'S',
    gradient: 'from-emerald-500 to-green-600',
  },
];

const miniTestimonials = [
  { id: 'luis', avatar: 'L' },
  { id: 'ana', avatar: 'A' },
  { id: 'roberto', avatar: 'R' },
  { id: 'maria', avatar: 'M' },
  { id: 'juan', avatar: 'J' },
  { id: 'claudia', avatar: 'C' },
];

export function TestimonialsSection() {
  const t = useTranslations('landing');

  return (
    <section className="relative py-24 md:py-32 overflow-hidden" id="testimonials">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
      
      <div className="container relative px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Star className="w-4 h-4 text-primary fill-primary" />
            <span className="text-sm font-medium text-primary">
              {t('testimonials.badge')}
            </span>
          </div>
          
          <h2 className="text-display-mobile md:text-display font-display font-bold mb-6">
            <span className="text-foreground">{t('testimonials.title.line1')}</span>
            <br />
            <span className="gradient-hero-text">{t('testimonials.title.line2')}</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </div>

        {/* Featured Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="
                relative p-6 md:p-8 rounded-2xl
                bg-card border border-white/10
                hover:border-primary/30 hover-lift
                transition-all duration-300
              "
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Quote Icon */}
              <Quote className="w-10 h-10 text-primary/20 absolute top-6 right-6" />
              
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                ))}
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold mb-4">
                {t(`testimonials.featured.${testimonial.id}.title`)}
              </h3>

              {/* Quote */}
              <p className="text-muted-foreground mb-6 leading-relaxed">
                &ldquo;{t(`testimonials.featured.${testimonial.id}.quote`)}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className={`
                  w-12 h-12 rounded-full
                  bg-gradient-to-br ${testimonial.gradient}
                  flex items-center justify-center
                  text-white font-bold
                `}>
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold">
                    {t(`testimonials.featured.${testimonial.id}.name`)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t(`testimonials.featured.${testimonial.id}.role`)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mini Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {miniTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="
                flex items-start gap-4 p-4 rounded-xl
                bg-card/50 border border-white/5
                hover:border-white/10
                transition-all duration-300
              "
            >
              <div className="
                w-10 h-10 rounded-full
                bg-primary/20
                flex items-center justify-center
                text-primary font-bold text-sm
                flex-shrink-0
              ">
                {testimonial.avatar}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  &ldquo;{t(`testimonials.mini.${testimonial.id}.quote`)}&rdquo;
                </p>
                <span className="text-xs font-medium text-foreground">
                  — {t(`testimonials.mini.${testimonial.id}.name`)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
          <div>
            <div className="text-4xl font-bold gradient-hero-text mb-2">10K+</div>
            <div className="text-sm text-muted-foreground">{t('testimonials.stats.founders')}</div>
          </div>
          <div>
            <div className="text-4xl font-bold gradient-hero-text mb-2">4.9</div>
            <div className="text-sm text-muted-foreground">{t('testimonials.stats.rating')}</div>
          </div>
          <div>
            <div className="text-4xl font-bold gradient-hero-text mb-2">$50M+</div>
            <div className="text-sm text-muted-foreground">{t('testimonials.stats.raised')}</div>
          </div>
          <div>
            <div className="text-4xl font-bold gradient-hero-text mb-2">94%</div>
            <div className="text-sm text-muted-foreground">{t('testimonials.stats.recommend')}</div>
          </div>
        </div>
      </div>
    </section>
  );
}





