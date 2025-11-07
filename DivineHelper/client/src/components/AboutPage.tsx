import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Send, Sparkles } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface AboutPageProps {
  language: 'en' | 'hi';
}

const translations = {
  en: {
    title: 'About DHRM',
    subtitle: 'Divine Helper, Reclaiming Moksha',
    mission: 'Our Mission',
    missionText: 'DHRM is dedicated to helping seekers on their spiritual journey by combining ancient Vedic wisdom with modern technology. We believe that the timeless teachings of the Bhagavad Gita, Upanishads, and other sacred texts can guide us toward inner peace, dharma, and ultimately, moksha (liberation).',
    vision: 'Our Vision',
    visionText: 'To create a global community where spiritual wellness is accessible to all, where ancient wisdom illuminates modern challenges, and where technology serves as a bridge to divine knowledge.',
    contact: 'Contact Us',
    contactText: 'Have questions or feedback? We\'d love to hear from you.',
    name: 'Name',
    email: 'Email',
    message: 'Message',
    send: 'Send Message',
    successTitle: 'Message Sent',
    successDesc: 'Thank you for reaching out. We will respond soon.',
    namePlaceholder: 'Your name',
    emailPlaceholder: 'your.email@example.com',
    messagePlaceholder: 'Share your thoughts, questions, or feedback...'
  },
  hi: {
    title: 'डीएचआरएम के बारे में',
    subtitle: 'दिव्य सहायक, मोक्ष की पुनः प्राप्ति',
    mission: 'हमारा मिशन',
    missionText: 'डीएचआरएम प्राचीन वैदिक ज्ञान को आधुनिक तकनीक के साथ जोड़कर साधकों की आध्यात्मिक यात्रा में मदद करने के लिए समर्पित है। हम मानते हैं कि भगवद गीता, उपनिषद और अन्य पवित्र ग्रंथों की कालातीत शिक्षाएं हमें आंतरिक शांति, धर्म और अंततः मोक्ष की ओर मार्गदर्शन कर सकती हैं।',
    vision: 'हमारी दृष्टि',
    visionText: 'एक वैश्विक समुदाय बनाना जहां आध्यात्मिक कल्याण सभी के लिए सुलभ हो, जहां प्राचीन ज्ञान आधुनिक चुनौतियों को प्रकाशित करे, और जहां तकनीक दिव्य ज्ञान के लिए एक पुल के रूप में कार्य करे।',
    contact: 'हमसे संपर्क करें',
    contactText: 'प्रश्न या प्रतिक्रिया है? हम आपसे सुनना पसंद करेंगे।',
    name: 'नाम',
    email: 'ईमेल',
    message: 'संदेश',
    send: 'संदेश भेजें',
    successTitle: 'संदेश भेजा गया',
    successDesc: 'संपर्क करने के लिए धन्यवाद। हम जल्द ही जवाब देंगे।',
    namePlaceholder: 'आपका नाम',
    emailPlaceholder: 'your.email@example.com',
    messagePlaceholder: 'अपने विचार, प्रश्न या प्रतिक्रिया साझा करें...'
  }
};

export default function AboutPage({ language }: AboutPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { toast } = useToast();
  const t = translations[language];

  // Contact form mutation
  const contactMutation = useMutation({
    mutationFn: async (data: { name: string; email: string; message: string }) => {
      const res = await apiRequest('POST', '/api/contact', data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: t.successTitle,
        description: t.successDesc
      });
      setName('');
      setEmail('');
      setMessage('');
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive'
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    contactMutation.mutate({ name, email, message });
  };

  const loading = contactMutation.isPending;

  return (
    <div className="min-h-screen py-8 px-4 animate-fade-in">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-3" data-testid="text-page-title">
            {t.title}
          </h1>
          <p className="text-lg text-muted-foreground italic">
            {t.subtitle}
          </p>
        </div>

        {/* Mission */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-serif text-primary flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              {t.mission}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base leading-relaxed text-foreground/90">
              {t.missionText}
            </p>
          </CardContent>
        </Card>

        {/* Vision */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-serif text-primary flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              {t.vision}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base leading-relaxed text-foreground/90">
              {t.visionText}
            </p>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-serif text-primary">
              {t.contact}
            </CardTitle>
            <p className="text-muted-foreground">{t.contactText}</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">{t.name}</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.namePlaceholder}
                  required
                  data-testid="input-name"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">{t.email}</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  required
                  data-testid="input-email"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">{t.message}</label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t.messagePlaceholder}
                  required
                  rows={5}
                  data-testid="input-message"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full gap-2 hover-elevate active-elevate-2"
                data-testid="button-submit"
              >
                <Send className="w-4 h-4" />
                {t.send}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
