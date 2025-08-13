import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CompassionateAI } from '@/components/ai/CompassionateAI';
import { VoiceAccessibility } from '@/components/voice/VoiceAccessibility';
import { FamilyConnection } from '@/components/family/FamilyConnection';
import { MoodTracker } from '@/components/mental-health/MoodTracker';
import { EnhancedEmergencyButton } from '@/components/emergency/EnhancedEmergencyButton';
import { useToast } from '@/hooks/use-toast';
import { 
  Heart,
  Users,
  Mic,
  Brain,
  Shield,
  Sparkles,
  Sun,
  Moon,
  MessageCircle,
  Activity,
  Bell,
  Settings,
  Accessibility,
  HelpCircle
} from 'lucide-react';

interface CompassionMetric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: string;
}

export const CompassionateDashboard = () => {
  const [timeOfDay, setTimeOfDay] = useState('');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [compassionMetrics, setCompassionMetrics] = useState<CompassionMetric[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setTimeOfDay(getTimeOfDayGreeting());
    initializeCompassionMetrics();
    
    // Gentle welcome message
    setTimeout(() => {
      toast({
        title: `${getTimeOfDayGreeting()}! 💙`,
        description: "Your wellbeing matters. I'm here to support you today.",
      });
    }, 1000);
  }, []);

  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const initializeCompassionMetrics = () => {
    setCompassionMetrics([
      {
        title: 'Emotional Wellbeing',
        value: 'Good',
        change: '+2 from yesterday',
        trend: 'up',
        icon: <Heart className="h-5 w-5" />,
        color: 'text-compassion-heart'
      },
      {
        title: 'Family Connection',
        value: '3 messages',
        change: 'Active today',
        trend: 'stable',
        icon: <Users className="h-5 w-5" />,
        color: 'text-compassion-primary'
      },
      {
        title: 'Voice Assistance',
        value: isVoiceEnabled ? 'Active' : 'Ready',
        change: 'Available 24/7',
        trend: 'stable',
        icon: <Mic className="h-5 w-5" />,
        color: 'text-compassion-calm'
      },
      {
        title: 'Care Support',
        value: 'AI Ready',
        change: 'Always listening',
        trend: 'stable',
        icon: <Brain className="h-5 w-5" />,
        color: 'text-compassion-healing'
      }
    ]);
  };

  const enableCompassionateGreeting = async () => {
    const greeting = `${timeOfDay}! I'm so glad you're here. Your health and happiness are my priority. How can I support you today?`;
    
    // Use text-to-speech for warm greeting
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(greeting);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }

    toast({
      title: "Welcome! 🌟",
      description: greeting,
    });
  };

  const quickActions = [
    {
      title: 'Talk to AI Companion',
      description: 'Share your feelings and get support',
      icon: <MessageCircle className="h-5 w-5" />,
      action: () => document.getElementById('ai-companion')?.scrollIntoView({ behavior: 'smooth' }),
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100'
    },
    {
      title: 'Voice Control',
      description: 'Control everything with your voice',
      icon: <Accessibility className="h-5 w-5" />,
      action: () => setIsVoiceEnabled(!isVoiceEnabled),
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100'
    },
    {
      title: 'Connect with Family',
      description: 'Message your care circle',
      icon: <Users className="h-5 w-5" />,
      action: () => document.getElementById('family-connection')?.scrollIntoView({ behavior: 'smooth' }),
      color: 'bg-green-50 border-green-200 hover:bg-green-100'
    },
    {
      title: 'Check Mood',
      description: 'Log how you\'re feeling today',
      icon: <Sun className="h-5 w-5" />,
      action: () => document.getElementById('mood-tracker')?.scrollIntoView({ behavior: 'smooth' }),
      color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
    }
  ];

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Compassionate Header */}
      <div className="text-center space-y-4 py-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Heart className="h-8 w-8 text-compassion-heart animate-breathe" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-compassion-primary to-compassion-secondary bg-clip-text text-transparent">
            Compassionate Healthcare
          </h1>
          <Sparkles className="h-8 w-8 text-compassion-warm animate-pulse" />
        </div>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {timeOfDay}! Your wellbeing journey is supported with AI-powered compassion, 
          voice accessibility, and loving family connections.
        </p>
        
        <div className="flex justify-center gap-4">
          <Button 
            onClick={enableCompassionateGreeting}
            className="bg-compassion-primary hover:bg-compassion-secondary text-white px-6 py-3 rounded-full"
          >
            <Heart className="h-4 w-4 mr-2" />
            Start with Care
          </Button>
          
          <div className="flex items-center">
            <EnhancedEmergencyButton />
          </div>
        </div>
      </div>

      {/* Compassion Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {compassionMetrics.map((metric, index) => (
          <Card key={index} className="card-compassionate hover-gentle">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className="text-xs text-muted-foreground">{metric.change}</p>
                </div>
                <div className={`${metric.color} opacity-80`}>
                  {metric.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="card-compassionate">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-compassion-primary">
            <Activity className="h-5 w-5" />
            How can I help you today?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${action.color} hover:scale-105`}
              >
                <div className="flex items-center gap-3 mb-2">
                  {action.icon}
                  <h3 className="font-medium">{action.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Compassionate Features */}
      <Tabs defaultValue="ai-companion" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-compassion-gentle">
          <TabsTrigger value="ai-companion" className="data-[state=active]:bg-white">
            <Brain className="h-4 w-4 mr-2" />
            AI Companion
          </TabsTrigger>
          <TabsTrigger value="voice-accessibility" className="data-[state=active]:bg-white">
            <Accessibility className="h-4 w-4 mr-2" />
            Voice Control
          </TabsTrigger>
          <TabsTrigger value="family-connection" className="data-[state=active]:bg-white">
            <Users className="h-4 w-4 mr-2" />
            Family Care
          </TabsTrigger>
          <TabsTrigger value="mood-wellness" className="data-[state=active]:bg-white">
            <Heart className="h-4 w-4 mr-2" />
            Mood & Wellness
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai-companion" id="ai-companion" className="animate-fade-in-up">
          <CompassionateAI />
        </TabsContent>

        <TabsContent value="voice-accessibility" className="animate-fade-in-up">
          <VoiceAccessibility />
        </TabsContent>

        <TabsContent value="family-connection" id="family-connection" className="animate-fade-in-up">
          <FamilyConnection />
        </TabsContent>

        <TabsContent value="mood-wellness" id="mood-tracker" className="animate-fade-in-up">
          <MoodTracker />
        </TabsContent>
      </Tabs>

      {/* Compassionate Footer */}
      <Card className="card-compassionate text-center">
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-5 w-5 text-compassion-heart" />
            <span className="font-medium text-compassion-primary">Your wellbeing matters</span>
            <Heart className="h-5 w-5 text-compassion-heart" />
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            This application is designed with love and care for your health journey. 
            Every feature is built to support, understand, and empower you.
          </p>
          
          <div className="flex justify-center gap-4">
            <Button variant="outline" size="sm">
              <HelpCircle className="h-3 w-3 mr-1" />
              Help & Support
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-3 w-3 mr-1" />
              Accessibility Settings
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="h-3 w-3 mr-1" />
              Gentle Reminders
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};