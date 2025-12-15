'use client';

import { useTranslations } from '@/i18n/hooks';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Zap, Menu, X } from 'lucide-react';
import { LanguageSelector } from '@/components/language/language-selector';
import { ThemeToggle } from '@/components/theme/theme-toggle';

const navLinks = [
  { key: 'features', href: '#features' },
  { key: 'howItWorks', href: '#how-it-works' },
  { key: 'pricing', href: '#pricing' },
  { key: 'testimonials', href: '#testimonials' },
  { key: 'faq', href: '#faq' },
];

export function Navbar() {
  const t = useTranslations('landing');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header 
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-300
          ${isScrolled 
            ? 'py-3 bg-background/80 backdrop-blur-xl border-b border-white/5' 
            : 'py-5 bg-transparent'
          }
        `}
      >
        <div className="container px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className={`
                w-9 h-9 rounded-lg
                bg-gradient-to-br from-primary to-accent
                flex items-center justify-center
                transition-all duration-300
                ${isScrolled ? 'shadow-glow-sm' : ''}
              `}>
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold">Vectorify</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  className="
                    px-4 py-2 text-sm font-medium
                    text-muted-foreground hover:text-foreground
                    transition-colors duration-200
                  "
                >
                  {t(`nav.${link.key}`)}
                </a>
              ))}
            </nav>

            {/* Right Side */}
            <div className="hidden md:flex items-center gap-3">
              <LanguageSelector />
              <ThemeToggle />
              <Link href="/workspace">
                <Button 
                  size="sm"
                  className="
                    bg-gradient-to-r from-primary to-accent
                    hover:opacity-90 transition-opacity
                  "
                >
                  {t('nav.cta')}
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div 
        className={`
          fixed inset-0 z-40 md:hidden
          bg-background/95 backdrop-blur-xl
          transition-all duration-300
          ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      >
        <div className="container px-4 pt-24 pb-8">
          <nav className="flex flex-col gap-2 mb-8">
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="
                  px-4 py-3 text-lg font-medium
                  text-muted-foreground hover:text-foreground
                  hover:bg-white/5 rounded-lg
                  transition-all duration-200
                "
              >
                {t(`nav.${link.key}`)}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4 mb-6">
            <LanguageSelector />
            <ThemeToggle />
          </div>

          <Link href="/workspace" onClick={() => setIsMobileMenuOpen(false)}>
            <Button 
              size="lg"
              className="
                w-full
                bg-gradient-to-r from-primary to-accent
                hover:opacity-90 transition-opacity
              "
            >
              {t('nav.cta')}
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}





