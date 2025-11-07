import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Quote } from '@shared/schema';

interface DivyaDrishtiPageProps {
  language: 'en' | 'hi';
}

const translations = {
  en: {
    title: 'Divya Drishti',
    subtitle: 'Divine Insights from Ancient Wisdom',
    newDrishti: 'New Drishti',
    loading: 'Receiving divine wisdom...'
  },
  hi: {
    title: 'दिव्य दृष्टि',
    subtitle: 'प्राचीन ज्ञान से दिव्य अंतर्दृष्टि',
    newDrishti: 'नई दृष्टि',
    loading: 'दिव्य ज्ञान प्राप्त कर रहे हैं...'
  }
};

export default function DivyaDrishtiPage({ language }: DivyaDrishtiPageProps) {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const t = translations[language];

  // Fetch initial quote
  const { data: initialQuote } = useQuery<Quote>({
    queryKey: ['/api/quotes/random'],
    enabled: !currentQuote,
  });

  // Set initial quote when loaded (using useEffect to avoid render loop)
  useEffect(() => {
    if (!currentQuote && initialQuote) {
      setCurrentQuote(initialQuote);
    }
  }, [initialQuote, currentQuote]);

  // Mutation to fetch new quote
  const fetchQuoteMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('GET', '/api/quotes/random');
      return res.json() as Promise<Quote>;
    },
    onSuccess: (data) => {
      setCurrentQuote(data);
    },
  });

  const fetchNewQuote = () => {
    fetchQuoteMutation.mutate();
  };

  const loading = fetchQuoteMutation.isPending;

  return (
    <div className="min-h-screen py-8 px-4 animate-fade-in">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-3" data-testid="text-page-title">
            {t.title}
          </h1>
          <p className="text-lg text-muted-foreground italic">
            {t.subtitle}
          </p>
        </div>

        <Card className="mb-8 border-2 border-secondary/30 bg-gradient-to-br from-card to-muted/30 shadow-lg">
          <CardContent className="p-8 md:p-12">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-pulse-slow text-4xl mb-4">
                  <Sparkles className="w-12 h-12 mx-auto text-secondary" />
                </div>
                <p className="text-muted-foreground italic">{t.loading}</p>
              </div>
            ) : currentQuote ? (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center">
                  <p className="font-serif text-2xl md:text-3xl leading-relaxed mb-4 text-foreground" data-testid="text-quote-sanskrit">
                    {currentQuote.sanskrit}
                  </p>
                  <p className="text-lg md:text-xl leading-relaxed text-muted-foreground italic" data-testid="text-quote-english">
                    {currentQuote.english}
                  </p>
                </div>
                <div className="text-center pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground font-medium" data-testid="text-quote-source">
                    — {currentQuote.source}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading quote...</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <Button
            size="lg"
            onClick={fetchNewQuote}
            disabled={loading}
            data-testid="button-new-drishti"
            className="gap-2 hover-elevate active-elevate-2"
          >
            <Sparkles className="w-5 h-5" />
            {t.newDrishti}
          </Button>
        </div>
      </div>
    </div>
  );
}
