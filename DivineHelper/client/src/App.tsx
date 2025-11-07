import { useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import HomePage from "@/components/HomePage";
import DivyaDrishtiPage from "@/components/DivyaDrishtiPage";
import ChatPage from "@/components/ChatPage";
import DhyanPage from "@/components/DhyanPage";
import KarmPage from "@/components/KarmPage";
import BooksPage from "@/components/BooksPage";
import AboutPage from "@/components/AboutPage";

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [streakCount, setStreakCount] = useState(7);

  const handleLanguageToggle = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage language={language} onNavigate={setCurrentPage} />;
      case 'divya-drishti':
        return <DivyaDrishtiPage language={language} />;
      case 'chat':
        return <ChatPage language={language} />;
      case 'dhyan':
        return <DhyanPage language={language} />;
      case 'karm':
        return <KarmPage language={language} onStreakChange={setStreakCount} />;
      case 'books':
        return <BooksPage language={language} />;
      case 'about':
        return <AboutPage language={language} />;
      default:
        return <HomePage language={language} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Header
            currentPage={currentPage}
            onNavigate={setCurrentPage}
            language={language}
            onLanguageToggle={handleLanguageToggle}
            streakCount={streakCount}
          />
          <main>
            {renderPage()}
          </main>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
