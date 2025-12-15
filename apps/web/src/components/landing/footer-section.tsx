'use client';

import { useTranslations } from '@/i18n/hooks';
import Link from 'next/link';
import { Zap, Twitter, Linkedin, Github, MessageCircle } from 'lucide-react';
import { LanguageSelector } from '@/components/language/language-selector';

const footerLinks = {
  product: ['features', 'pricing', 'integrations', 'roadmap', 'changelog'],
  company: ['about', 'careers', 'press', 'contact'],
  resources: ['blog', 'guides', 'docs', 'community', 'support'],
  legal: ['privacy', 'terms', 'security', 'gdpr'],
};

const socialLinks = [
  { icon: Twitter, href: 'https://twitter.com/vectorifyHQ', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com/company/vectorify', label: 'LinkedIn' },
  { icon: Github, href: 'https://github.com/vectorify', label: 'GitHub' },
  { icon: MessageCircle, href: 'https://discord.gg/vectorify', label: 'Discord' },
];

export function FooterSection() {
  const t = useTranslations('landing');

  return (
    <footer className="relative border-t border-white/5">
      {/* Background */}
      <div className="absolute inset-0 bg-card/50" />
      
      <div className="container relative px-4">
        {/* Main Footer */}
        <div className="py-16">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
            {/* Brand Column */}
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Vectorify</span>
              </Link>
              <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                {t('footer.description')}
              </p>
              
              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      w-10 h-10 rounded-lg
                      bg-white/5 border border-white/10
                      flex items-center justify-center
                      hover:bg-primary/20 hover:border-primary/30
                      transition-all duration-300
                    "
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4 text-muted-foreground" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
                  {t(`footer.${category}.title`)}
                </h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <Link 
                        href={`/${link}`}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {t(`footer.${category}.${link}`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>© {new Date().getFullYear()} Vectorify.</span>
              <span>{t('footer.madeWith')}</span>
            </div>
            
            <div className="flex items-center gap-4">
              <LanguageSelector />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}





