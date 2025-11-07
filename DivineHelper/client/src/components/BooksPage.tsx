import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Book as BookIcon } from 'lucide-react';
import type { Book } from '@shared/schema';

interface BooksPageProps {
  language: 'en' | 'hi';
}

const translations = {
  en: {
    title: 'Holy Scriptures',
    subtitle: 'Ancient Wisdom for Modern Times',
    close: 'Close',
    read: 'Read'
  },
  hi: {
    title: 'पवित्र ग्रंथ',
    subtitle: 'आधुनिक समय के लिए प्राचीन ज्ञान',
    close: 'बंद करें',
    read: 'पढ़ें'
  }
};

export default function BooksPage({ language }: BooksPageProps) {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const t = translations[language];

  // Fetch books from API
  const { data: books = [], isLoading } = useQuery<Book[]>({
    queryKey: ['/api/books'],
  });

  return (
    <div className="min-h-screen py-8 px-4 animate-fade-in">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-3" data-testid="text-page-title">
            {t.title}
          </h1>
          <p className="text-lg text-muted-foreground italic">
            {t.subtitle}
          </p>
        </div>

        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading books...</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
            <Card
              key={book.id}
              className="hover-elevate active-elevate-2 cursor-pointer transition-all duration-300 hover:scale-105"
              onClick={() => setSelectedBook(book)}
              data-testid={`card-book-${book.id}`}
            >
              <CardHeader className="gap-3">
                <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center">
                  <BookIcon className="w-8 h-8 text-secondary" />
                </div>
                <CardTitle className="text-2xl font-serif">
                  {language === 'en' ? book.title : book.titleHi}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {language === 'en' ? book.description : book.descriptionHi}
                </CardDescription>
                <Button
                  variant="outline"
                  className="mt-4 w-full hover-elevate active-elevate-2"
                  data-testid={`button-read-${book.id}`}
                >
                  {t.read}
                </Button>
              </CardContent>
            </Card>
            ))}
          </div>
        )}

        {/* Book Reading Modal */}
        <Dialog open={!!selectedBook} onOpenChange={() => setSelectedBook(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="text-3xl font-serif text-primary">
                {selectedBook && (language === 'en' ? selectedBook.title : selectedBook.titleHi)}
              </DialogTitle>
              <DialogDescription>
                {selectedBook && (language === 'en' ? selectedBook.description : selectedBook.descriptionHi)}
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[50vh] pr-4">
              <div className="prose prose-sm max-w-none">
                <p className="text-base leading-relaxed whitespace-pre-line text-foreground">
                  {selectedBook?.content}
                </p>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
