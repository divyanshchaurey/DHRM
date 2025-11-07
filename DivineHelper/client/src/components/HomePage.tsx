import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Sparkles, MessageCircle, Clock, CheckSquare, Book, Mail } from 'lucide-react';

interface HomePageProps {
  language: 'en' | 'hi';
  onNavigate: (page: string) => void;
}

const translations = {
  en: {
    welcome: 'Welcome to',
    subtitle: 'Divine Helper, Reclaiming Moksha',
    greeting: 'नमस्ते',
    greetingMeaning: 'Greetings, Seeker of Truth',
    description: 'Embark on a journey of spiritual wellness, guided by ancient wisdom and modern technology. Let the divine light illuminate your path to inner peace and enlightenment.',
    features: 'Spiritual Features',
    divyaDrishti: 'Divya Drishti',
    divyaDrishtiDesc: 'Receive divine insights and wisdom from ancient scriptures',
    chat: 'Vedic Coaching',
    chatDesc: 'Chat with AI-powered Vedic philosophical coach for spiritual guidance',
    dhyan: 'Meditation',
    dhyanDesc: 'Practice mindfulness with guided meditation timers and soothing music',
    karm: 'Daily Karm',
    karmDesc: 'Track daily spiritual tasks and build your dharmic streak',
    books: 'Holy Scriptures',
    booksDesc: 'Read and explore ancient Hindu texts and wisdom',
    contact: 'Connect With Us',
    contactDesc: 'Share your thoughts and join our spiritual community',
    getStarted: 'Begin Your Journey'
  },
  hi: {
    welcome: 'स्वागत है',
    subtitle: 'दिव्य सहायक, मोक्ष की पुनः प्राप्ति',
    greeting: 'नमस्ते',
    greetingMeaning: 'सत्य के साधक, नमस्कार',
    description: 'प्राचीन ज्ञान और आधुनिक तकनीक द्वारा निर्देशित आध्यात्मिक कल्याण की यात्रा पर निकलें। दिव्य प्रकाश आपके आंतरिक शांति और ज्ञान के मार्ग को प्रकाशित करे।',
    features: 'आध्यात्मिक सुविधाएँ',
    divyaDrishti: 'दिव्य दृष्टि',
    divyaDrishtiDesc: 'प्राचीन शास्त्रों से दिव्य अंतर्दृष्टि और ज्ञान प्राप्त करें',
    chat: 'वैदिक मार्गदर्शन',
    chatDesc: 'आध्यात्मिक मार्गदर्शन के लिए एआई-संचालित वैदिक दार्शनिक कोच से बात करें',
    dhyan: 'ध्यान',
    dhyanDesc: 'निर्देशित ध्यान टाइमर और सुखदायक संगीत के साथ सावधानी का अभ्यास करें',
    karm: 'दैनिक कर्म',
    karmDesc: 'दैनिक आध्यात्मिक कार्यों को ट्रैक करें और अपनी धार्मिक धारा बनाएँ',
    books: 'पवित्र ग्रंथ',
    booksDesc: 'प्राचीन हिंदू ग्रंथों और ज्ञान को पढ़ें और अन्वेषण करें',
    contact: 'हमसे जुड़ें',
    contactDesc: 'अपने विचार साझा करें और हमारे आध्यात्मिक समुदाय में शामिल हों',
    getStarted: 'अपनी यात्रा शुरू करें'
  }
};

export default function HomePage({ language, onNavigate }: HomePageProps) {
  const t = translations[language];

  const features = [
    { icon: Sparkles, title: t.divyaDrishti, desc: t.divyaDrishtiDesc, page: 'divya-drishti', color: 'text-secondary' },
    { icon: MessageCircle, title: t.chat, desc: t.chatDesc, page: 'chat', color: 'text-primary' },
    { icon: Clock, title: t.dhyan, desc: t.dhyanDesc, page: 'dhyan', color: 'text-accent' },
    { icon: CheckSquare, title: t.karm, desc: t.karmDesc, page: 'karm', color: 'text-primary' },
    { icon: Book, title: t.books, desc: t.booksDesc, page: 'books', color: 'text-secondary' },
    { icon: Mail, title: t.contact, desc: t.contactDesc, page: 'about', color: 'text-accent' }
  ];

  return (
    <div className="min-h-screen animate-fade-in">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-background via-card to-muted py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="mb-6">
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-primary mb-2" data-testid="text-hero-greeting">
              {t.greeting}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground italic">
              {t.greetingMeaning}
            </p>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            {t.welcome} <span className="font-serif text-primary">DHRM</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-2 italic">
            {t.subtitle}
          </p>
          
          <p className="text-base md:text-lg text-foreground/80 max-w-2xl mx-auto mt-6 mb-8 leading-relaxed">
            {t.description}
          </p>

          <Button
            size="lg"
            onClick={() => onNavigate('divya-drishti')}
            data-testid="button-get-started"
            className="text-lg px-8 hover-elevate active-elevate-2"
          >
            {t.getStarted}
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <h3 className="text-3xl font-serif font-bold text-center mb-12" data-testid="text-features-title">
          {t.features}
        </h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <Card
              key={idx}
              className="hover-elevate active-elevate-2 cursor-pointer transition-all duration-300 hover:scale-105"
              onClick={() => onNavigate(feature.page)}
              data-testid={`card-feature-${feature.page}`}
            >
              <CardHeader className="gap-2">
                <div className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.desc}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
