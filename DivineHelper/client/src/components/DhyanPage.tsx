import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface DhyanPageProps {
  language: 'en' | 'hi';
}

const translations = {
  en: {
    title: 'Dhyan',
    subtitle: 'Meditation & Mindfulness',
    selectDuration: 'Select Duration',
    start: 'Start',
    pause: 'Pause',
    resume: 'Resume',
    reset: 'Reset',
    motivation: [
      'Breathe deeply. You are exactly where you need to be.',
      'Each moment of stillness brings you closer to your true self.',
      'Let go of thoughts like clouds passing in the sky.',
      'In silence, wisdom speaks.',
      'Your breath is the bridge between body and soul.'
    ]
  },
  hi: {
    title: 'ध्यान',
    subtitle: 'ध्यान और सावधानी',
    selectDuration: 'अवधि चुनें',
    start: 'शुरू करें',
    pause: 'रोकें',
    resume: 'जारी रखें',
    reset: 'रीसेट',
    motivation: [
      'गहरी सांस लें। आप ठीक वहीं हैं जहां आपको होना चाहिए।',
      'स्थिरता का प्रत्येक क्षण आपको अपने सच्चे स्व के करीब लाता है।',
      'विचारों को आकाश में बादलों की तरह जाने दें।',
      'मौन में, ज्ञान बोलता है।',
      'आपकी सांस शरीर और आत्मा के बीच का पुल है।'
    ]
  }
};

const durations = [
  { minutes: 5, label: '5 min' },
  { minutes: 10, label: '10 min' },
  { minutes: 15, label: '15 min' },
  { minutes: 30, label: '30 min' },
  { minutes: 45, label: '45 min' },
  { minutes: 60, label: '1 hr' }
];

export default function DhyanPage({ language }: DhyanPageProps) {
  const [selectedDuration, setSelectedDuration] = useState(10);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [motivation, setMotivation] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);
  const t = translations[language];

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      audioRef.current?.pause();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (isActive) {
      const randomMotivation = t.motivation[Math.floor(Math.random() * t.motivation.length)];
      setMotivation(randomMotivation);
      const motivationInterval = setInterval(() => {
        const randomMotivation = t.motivation[Math.floor(Math.random() * t.motivation.length)];
        setMotivation(randomMotivation);
      }, 30000); // Change every 30 seconds

      audioRef.current?.play();

      return () => clearInterval(motivationInterval);
    } else {
      audioRef.current?.pause();
    }
  }, [isActive, t.motivation]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(selectedDuration * 60);
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
  };

  const handleDurationChange = (minutes: number) => {
    setSelectedDuration(minutes);
    setTimeLeft(minutes * 60);
    setIsActive(false);
    audioRef.current?.pause();
  };

  const progress = ((selectedDuration * 60 - timeLeft) / (selectedDuration * 60)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/10 via-background to-accent/5 py-8 px-4 animate-fade-in">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-3" data-testid="text-page-title">
            {t.title}
          </h1>
          <p className="text-lg text-muted-foreground italic">
            {t.subtitle}
          </p>
        </div>

        {/* Duration Selection */}
        {!isActive && timeLeft === selectedDuration * 60 && (
          <div className="mb-8">
            <p className="text-center text-sm font-medium text-muted-foreground mb-4">
              {t.selectDuration}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {durations.map((duration) => (
                <Button
                  key={duration.minutes}
                  variant={selectedDuration === duration.minutes ? 'default' : 'outline'}
                  onClick={() => handleDurationChange(duration.minutes)}
                  data-testid={`button-duration-${duration.minutes}`}
                  className="hover-elevate active-elevate-2"
                >
                  {duration.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Timer Display */}
        <Card className="mb-8 border-2 border-accent/30 bg-gradient-to-br from-card to-accent/5">
          <CardContent className="p-12">
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <svg className="transform -rotate-90 w-48 h-48 md:w-64 md:h-64">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 45} ${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                    className="text-accent transition-all duration-1000"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl md:text-6xl font-bold font-mono" data-testid="text-timer">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
            </div>

            {isActive && motivation && (
              <p className="text-center text-lg text-muted-foreground italic max-w-md mx-auto animate-fade-in" data-testid="text-motivation">
                {motivation}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {!isActive ? (
            <Button
              size="lg"
              onClick={handleStart}
              data-testid="button-start"
              className="gap-2 hover-elevate active-elevate-2"
            >
              <Play className="w-5 h-5" />
              {timeLeft === selectedDuration * 60 ? t.start : t.resume}
            </Button>
          ) : (
            <Button
              size="lg"
              variant="secondary"
              onClick={handlePause}
              data-testid="button-pause"
              className="gap-2 hover-elevate active-elevate-2"
            >
              <Pause className="w-5 h-5" />
              {t.pause}
            </Button>
          )}
          
          <Button
            size="lg"
            variant="outline"
            onClick={handleReset}
            data-testid="button-reset"
            className="gap-2 hover-elevate active-elevate-2"
          >
            <RotateCcw className="w-5 h-5" />
            {t.reset}
          </Button>
        </div>

        {/* Meditation music audio - todo: Add calm, soothing meditation music file */}
        {/* Recommended: Tibetan singing bowls, nature sounds (rain, ocean waves), 
            soft flute music, or traditional Hindu meditation music */}
        <audio
          ref={audioRef}
          loop
          // Replace with your meditation music file path
          // Example: src="/meditation-music.mp3"
          // For now, using a calm nature sound placeholder
          src="https://assets.mixkit.co/music/preview/mixkit-meditation-song-2197.mp3"
        />
      </div>
    </div>
  );
}
