import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, Trophy, Menu, X, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  language: 'en' | 'hi';
  onLanguageToggle: () => void;
  streakCount: number;
}

const translations = {
  en: {
    home: 'Home',
    divyaDrishti: 'Divya Drishti',
    chat: 'DHRM Chat',
    dhyan: 'Dhyan',
    karm: 'Karm',
    books: 'Books',
    about: 'About Us'
  },
  hi: {
    home: 'होम',
    divyaDrishti: 'दिव्य दृष्टि',
    chat: 'डीएचआरएम चैट',
    dhyan: 'ध्यान',
    karm: 'कर्म',
    books: 'पुस्तकें',
    about: 'हमारे बारे में'
  }
};

export default function Header({ currentPage, onNavigate, language, onLanguageToggle, streakCount }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[language];

  const navItems = [
    { id: 'home', label: t.home },
    { id: 'divya-drishti', label: t.divyaDrishti },
    { id: 'chat', label: t.chat },
    { id: 'dhyan', label: t.dhyan },
    { id: 'karm', label: t.karm },
    { id: 'books', label: t.books },
    { id: 'about', label: t.about }
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-serif font-bold text-primary flex items-center gap-2">
              <Sparkles className="w-7 h-7 text-primary" />
              <span data-testid="text-app-name">DHRM</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onNavigate(item.id)}
                data-testid={`button-nav-${item.id}`}
                className="transition-all duration-200"
              >
                {item.label}
              </Button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {streakCount > 0 && (
              <Badge variant="secondary" className="gap-1 px-3" data-testid="badge-streak">
                <Trophy className="w-3 h-3 text-secondary animate-pulse-slow" />
                <span>{streakCount}</span>
              </Badge>
            )}
            
            <Button
              variant="outline"
              size="icon"
              onClick={onLanguageToggle}
              data-testid="button-language-toggle"
              className="hover-elevate active-elevate-2"
            >
              <Globe className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden mt-4 pb-2 flex flex-col gap-2 animate-fade-in">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? 'default' : 'ghost'}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                data-testid={`button-mobile-nav-${item.id}`}
                className="justify-start"
              >
                {item.label}
              </Button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
