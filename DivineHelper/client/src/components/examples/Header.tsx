import { useState } from 'react';
import Header from '../Header';

export default function HeaderExample() {
  const [currentPage, setCurrentPage] = useState('home');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  return (
    <Header
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      language={language}
      onLanguageToggle={() => setLanguage(language === 'en' ? 'hi' : 'en')}
      streakCount={7}
    />
  );
}
