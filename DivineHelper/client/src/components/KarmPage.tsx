import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Plus, Flame, Trophy } from 'lucide-react';
import { queryClient, apiRequest } from '@/lib/queryClient';
import type { Task, UserSettings } from '@shared/schema';

interface KarmPageProps {
  language: 'en' | 'hi';
  onStreakChange: (streak: number) => void;
}

const translations = {
  en: {
    title: 'Karm',
    subtitle: 'Daily Spiritual Tasks',
    streak: 'Day Streak',
    todayTasks: 'Today\'s Tasks',
    addTask: 'Add a new task...',
    add: 'Add',
    noTasks: 'No tasks yet. Add a task to begin your spiritual journey.',
    progress: 'Progress'
  },
  hi: {
    title: 'कर्म',
    subtitle: 'दैनिक आध्यात्मिक कार्य',
    streak: 'दिन की धारा',
    todayTasks: 'आज के कार्य',
    addTask: 'नया कार्य जोड़ें...',
    add: 'जोड़ें',
    noTasks: 'अभी तक कोई कार्य नहीं। अपनी आध्यात्मिक यात्रा शुरू करने के लिए एक कार्य जोड़ें।',
    progress: 'प्रगति'
  }
};

export default function KarmPage({ language, onStreakChange }: KarmPageProps) {
  const [newTaskText, setNewTaskText] = useState('');
  const t = translations[language];

  // Fetch tasks
  const { data: tasks = [], isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ['/api/tasks'],
  });

  // Fetch user settings (streak)
  const { data: settings } = useQuery<UserSettings>({
    queryKey: ['/api/settings'],
  });

  const streak = settings?.streak || 0;

  // Update streak count in parent component
  useEffect(() => {
    onStreakChange(streak);
  }, [streak, onStreakChange]);

  const completedCount = tasks.filter(task => task.completed).length;
  const progressPercentage = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  // Mutation to update streak
  const updateStreakMutation = useMutation({
    mutationFn: async () => {
      if (!settings) return { streak: 0 };
      
      // Calculate new streak based on backend data
      const today = new Date();
      const lastDate = settings.lastCompletedDate ? new Date(settings.lastCompletedDate) : null;
      
      let newStreak = 1;
      if (lastDate) {
        const daysDiff = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff === 1) {
          // Consecutive day
          newStreak = settings.streak + 1;
        } else if (daysDiff === 0) {
          // Same day, don't update
          return settings;
        }
        // If more than 1 day, reset to 1
      }
      
      const res = await apiRequest('PATCH', '/api/settings', { 
        streak: newStreak,
        lastCompletedDate: today.toISOString()
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
    },
  });

  // When all tasks are completed, update streak
  useEffect(() => {
    if (tasks.length > 0 && completedCount === tasks.length && completedCount > 0 && settings) {
      const today = new Date().toDateString();
      const lastDate = settings.lastCompletedDate ? new Date(settings.lastCompletedDate).toDateString() : null;
      
      // Only update if we haven't completed today yet
      if (lastDate !== today && !updateStreakMutation.isPending) {
        updateStreakMutation.mutate();
      }
    }
  }, [completedCount, tasks.length, settings]);

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: async (text: string) => {
      const res = await apiRequest('POST', '/api/tasks', { text, completed: false });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      setNewTaskText('');
    },
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const res = await apiRequest('PATCH', `/api/tasks/${id}`, { completed });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
    },
  });

  const toggleTask = (id: string, currentCompleted: boolean) => {
    updateTaskMutation.mutate({ id, completed: !currentCompleted });
  };

  const addTask = () => {
    if (!newTaskText.trim()) return;
    createTaskMutation.mutate(newTaskText);
  };

  return (
    <div className="min-h-screen py-8 px-4 animate-fade-in">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-3" data-testid="text-page-title">
            {t.title}
          </h1>
          <p className="text-lg text-muted-foreground italic">
            {t.subtitle}
          </p>
        </div>

        {/* Streak Display */}
        <Card className="mb-6 border-2 border-secondary/30 bg-gradient-to-r from-card to-secondary/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Flame className="w-10 h-10 text-secondary animate-flicker" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.streak}</p>
                  <p className="text-3xl font-bold" data-testid="text-streak-count">{streak}</p>
                </div>
              </div>
              {streak >= 7 && (
                <div className="flex items-center gap-2 bg-secondary/20 px-4 py-2 rounded-full">
                  <Trophy className="w-5 h-5 text-secondary" />
                  <span className="font-medium text-secondary">Dedicated</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Progress */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-xl">{t.progress}</CardTitle>
              <span className="text-sm text-muted-foreground" data-testid="text-progress-count">
                {completedCount} / {tasks.length}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </CardHeader>
        </Card>

        {/* Tasks List */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">{t.todayTasks}</CardTitle>
          </CardHeader>
          <CardContent>
            {tasksLoading ? (
              <p className="text-center text-muted-foreground italic py-8">
                Loading tasks...
              </p>
            ) : tasks.length === 0 ? (
              <p className="text-center text-muted-foreground italic py-8">
                {t.noTasks}
              </p>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-3 rounded-md hover-elevate active-elevate-2 transition-all"
                    data-testid={`task-${task.id}`}
                  >
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id, task.completed)}
                      data-testid={`checkbox-task-${task.id}`}
                      className="mt-0.5"
                    />
                    <span
                      className={`flex-1 ${
                        task.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                      }`}
                    >
                      {task.text}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Task */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Input
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addTask();
                  }
                }}
                placeholder={t.addTask}
                data-testid="input-new-task"
              />
              <Button
                onClick={addTask}
                disabled={createTaskMutation.isPending}
                data-testid="button-add-task"
                className="gap-2 hover-elevate active-elevate-2"
              >
                <Plus className="w-4 h-4" />
                {t.add}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
