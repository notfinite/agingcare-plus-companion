import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Heart,
  Smile,
  Frown,
  Meh,
  Sun,
  Cloud,
  CloudRain,
  Brain,
  Activity,
  MessageSquare,
  TrendingUp,
  Calendar,
  Target,
  BookOpen,
  Play
} from 'lucide-react';

interface MoodEntry {
  id: string;
  mood_score: number;
  energy_level: number;
  stress_level: number;
  sleep_quality: number;
  notes: string;
  recorded_at: string;
  triggers?: string[];
  coping_strategies?: string[];
}

interface MentalHealthResource {
  id: string;
  title: string;
  resource_type: 'meditation' | 'breathing' | 'article' | 'video' | 'exercise';
  duration_minutes: number;
  description: string;
  content?: any;
  category?: string;
}

export const MoodTracker = () => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [mentalHealthResources, setMentalHealthResources] = useState<MentalHealthResource[]>([]);
  const [currentMood, setCurrentMood] = useState(5);
  const [currentEnergy, setCurrentEnergy] = useState(5);
  const [currentStress, setCurrentStress] = useState(5);
  const [currentSleep, setCurrentSleep] = useState(5);
  const [notes, setNotes] = useState('');
  const [showResources, setShowResources] = useState(false);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const { toast } = useToast();

  const moodEmojis = [
    { score: 1, emoji: '😢', label: 'Very Low', color: 'text-red-600' },
    { score: 2, emoji: '😔', label: 'Low', color: 'text-red-400' },
    { score: 3, emoji: '😐', label: 'Neutral', color: 'text-yellow-500' },
    { score: 4, emoji: '🙂', label: 'Good', color: 'text-green-400' },
    { score: 5, emoji: '😊', label: 'Great', color: 'text-green-600' }
  ];

  const commonTriggers = [
    'Work stress', 'Family concerns', 'Health worries', 'Financial pressure',
    'Sleep issues', 'Social isolation', 'Weather', 'Medication changes',
    'Pain levels', 'Appointment anxiety'
  ];

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (userProfile?.id) {
      fetchMoodData();
      fetchMentalHealthResources();
    }
  }, [userProfile]);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setUserProfile(profile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchMoodData = async () => {
    try {
      if (!userProfile?.id) return;

      const { data: entries, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('patient_id', userProfile.id)
        .order('recorded_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      const formattedEntries: MoodEntry[] = entries?.map(entry => ({
        id: entry.id,
        mood_score: entry.mood_score,
        energy_level: (entry as any).energy_level || 5,
        stress_level: (entry as any).stress_level || 3,
        sleep_quality: (entry as any).sleep_quality || 5,
        notes: entry.notes || '',
        recorded_at: entry.recorded_at,
        triggers: Array.isArray(entry.triggers) ? (entry.triggers as string[]) : [],
        coping_strategies: Array.isArray(entry.coping_strategies) ? (entry.coping_strategies as string[]) : []
      })) || [];

      setMoodEntries(formattedEntries);
    } catch (error) {
      console.error('Error fetching mood data:', error);
    }
  };

  const fetchMentalHealthResources = async () => {
    try {
      // Use fallback data for now since the table might not be fully ready
      setMentalHealthResources([
        {
          id: '1',
          title: 'Gentle Breathing Exercise',
          resource_type: 'breathing',
          duration_minutes: 5,
          description: 'A calming breathing technique to reduce anxiety and promote relaxation',
          content: { steps: ["Sit comfortably", "Breathe in for 4 counts", "Hold for 4 counts", "Breathe out for 6 counts", "Repeat 10 times"] }
        },
        {
          id: '2',
          title: 'Mindful Body Scan',
          resource_type: 'meditation',
          duration_minutes: 10,
          description: 'Progressive relaxation to release tension and increase awareness',
          content: { guide: "Focus on each part of your body from head to toe, noticing any tension and letting it go" }
        },
        {
          id: '3',
          title: 'Gratitude Reflection',
          resource_type: 'exercise',
          duration_minutes: 5,
          description: 'Simple practice to shift focus to positive aspects of your day',
          content: { prompts: ["What am I grateful for today?", "Who made me smile?", "What small victory did I have?"] }
        },
        {
          id: '4',
          title: 'Progressive Muscle Relaxation',
          resource_type: 'meditation',
          duration_minutes: 15,
          description: 'Systematic tensing and relaxing of muscle groups to reduce physical stress',
          content: { instructions: "Tense each muscle group for 5 seconds, then relax for 10 seconds" }
        },
        {
          id: '5',
          title: '5-4-3-2-1 Grounding Technique',
          resource_type: 'exercise',
          duration_minutes: 3,
          description: 'Quick sensory grounding exercise to manage overwhelming feelings',
          content: { method: "Name 5 things you see, 4 things you hear, 3 things you feel, 2 things you smell, 1 thing you taste" }
        }
      ]);
    } catch (error) {
      console.error('Error fetching mental health resources:', error);
    }
  };

  const saveMoodEntry = async () => {
    if (!userProfile?.id) {
      toast({
        title: "Error",
        description: "Please sign in to track your mood.",
        variant: "destructive"
      });
      return;
    }

    setIsTracking(true);

    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .insert({
          patient_id: userProfile.id,
          mood_score: currentMood,
          mood_type: 'daily_checkin',
          notes: notes || null,
          triggers: selectedTriggers.length > 0 ? selectedTriggers : null,
          coping_strategies: [],
          recorded_at: new Date().toISOString()
        } as any)
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      const newEntry: MoodEntry = {
        id: data.id,
        mood_score: data.mood_score,
        energy_level: currentEnergy,
        stress_level: currentStress,
        sleep_quality: currentSleep,
        notes: data.notes || '',
        recorded_at: data.recorded_at,
        triggers: Array.isArray(data.triggers) ? (data.triggers as string[]) : [],
        coping_strategies: Array.isArray(data.coping_strategies) ? (data.coping_strategies as string[]) : []
      };

      setMoodEntries(prev => [newEntry, ...prev]);

      // Reset form
      setCurrentMood(5);
      setCurrentEnergy(5);
      setCurrentStress(5);
      setCurrentSleep(5);
      setNotes('');
      setSelectedTriggers([]);

      toast({
        title: "Mood Logged Successfully",
        description: "Thank you for checking in with yourself. Your wellbeing matters.",
      });

      // Show resources if mood is low
      if (currentMood <= 2 || currentStress >= 4) {
        setShowResources(true);
        toast({
          title: "Support Resources Available",
          description: "I notice you might be having a difficult time. Would you like some gentle support?",
        });
      }
    } catch (error) {
      console.error('Error saving mood entry:', error);
      toast({
        title: "Error",
        description: "Failed to save mood entry. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTracking(false);
    }
  };

  const generatePersonalizedSuggestions = (entry: MoodEntry) => {
    if (entry.mood_score <= 2) {
      return [
        "Consider reaching out to a family member or friend",
        "Try a gentle breathing exercise",
        "Take a short walk if you're able",
        "Listen to calming music"
      ];
    } else if (entry.stress_level >= 4) {
      return [
        "Practice deep breathing for 5 minutes",
        "Try progressive muscle relaxation",
        "Consider gentle movement or stretching",
        "Write down your worries to help process them"
      ];
    } else if (entry.energy_level <= 2) {
      return [
        "Ensure you're staying hydrated",
        "Consider a short, gentle walk",
        "Check if you need rest",
        "Light stretching might help"
      ];
    }
    return [];
  };

  const getMoodIcon = (score: number) => {
    const mood = moodEmojis.find(m => m.score === score) || moodEmojis[2];
    return <span className={`text-2xl ${mood.color}`}>{mood.emoji}</span>;
  };

  const getAverageMood = () => {
    if (moodEntries.length === 0) return 0;
    const sum = moodEntries.reduce((acc, entry) => acc + entry.mood_score, 0);
    return sum / moodEntries.length;
  };

  const startMentalHealthResource = async (resource: MentalHealthResource) => {
    if (resource.resource_type === 'breathing') {
      startBreathingExercise(resource);
    } else if (resource.resource_type === 'meditation') {
      startMeditation(resource);
    } else if (resource.resource_type === 'exercise') {
      startMentalExercise(resource);
    } else {
      toast({
        title: `Starting: ${resource.title}`,
        description: `This ${resource.resource_type} will take about ${resource.duration_minutes} minutes`,
      });
    }
  };

  const startBreathingExercise = (resource: MentalHealthResource) => {
    const steps = resource.content?.steps || [
      "Sit comfortably",
      "Breathe in for 4 counts",
      "Hold for 4 counts", 
      "Breathe out for 6 counts",
      "Repeat 10 times"
    ];
    
    toast({
      title: `${resource.title} Started`,
      description: steps.join(" → "),
    });
  };

  const startMeditation = (resource: MentalHealthResource) => {
    const guide = resource.content?.guide || "Find a comfortable position and focus on your breath. Let thoughts come and go without judgment.";
    
    toast({
      title: `${resource.title} Starting`,
      description: guide,
    });
  };

  const startMentalExercise = (resource: MentalHealthResource) => {
    const prompts = resource.content?.prompts || resource.content?.tips || [resource.description];
    
    toast({
      title: `${resource.title}`,
      description: Array.isArray(prompts) ? prompts[0] : prompts,
    });
  };

  return (
    <div className="space-y-6">
      {/* Current Mood Check-in */}
      <Card className="border-compassion-gentle bg-gradient-to-br from-purple-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-compassion-primary">
            <Heart className="h-5 w-5 text-compassion-heart" />
            How are you feeling today?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mood Scale */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Overall Mood</label>
            <div className="flex justify-between items-center">
              {moodEmojis.map((mood) => (
                <button
                  key={mood.score}
                  onClick={() => setCurrentMood(mood.score)}
                  className={`p-3 rounded-lg transition-all ${
                    currentMood === mood.score 
                      ? 'bg-compassion-primary text-white scale-110' 
                      : 'bg-white border border-compassion-border hover:bg-compassion-gentle'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">{mood.emoji}</div>
                    <div className="text-xs">{mood.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Energy, Stress, Sleep */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <Activity className="h-4 w-4" />
                Energy Level
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm">Low</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={currentEnergy}
                  onChange={(e) => setCurrentEnergy(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm">High</span>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                {currentEnergy}/5
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <Cloud className="h-4 w-4" />
                Stress Level
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm">Low</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={currentStress}
                  onChange={(e) => setCurrentStress(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm">High</span>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                {currentStress}/5
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <Sun className="h-4 w-4" />
                Sleep Quality
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm">Poor</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={currentSleep}
                  onChange={(e) => setCurrentSleep(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm">Great</span>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                {currentSleep}/5
              </div>
            </div>
          </div>

          {/* Triggers */}
          <div className="space-y-3">
            <label className="text-sm font-medium">What's affecting your mood today? (Optional)</label>
            <div className="flex flex-wrap gap-2">
              {commonTriggers.map((trigger) => (
                <button
                  key={trigger}
                  onClick={() => {
                    setSelectedTriggers(prev => 
                      prev.includes(trigger) 
                        ? prev.filter(t => t !== trigger)
                        : [...prev, trigger]
                    );
                  }}
                  className={`px-3 py-1 text-sm rounded-full transition-all ${
                    selectedTriggers.includes(trigger)
                      ? 'bg-compassion-primary text-white'
                      : 'bg-white border border-compassion-border hover:bg-compassion-gentle'
                  }`}
                >
                  {trigger}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Additional thoughts (Optional)</label>
            <Textarea
              placeholder="How are you feeling? Any thoughts you'd like to share..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="resize-none border-compassion-border"
              rows={3}
            />
          </div>

          <Button 
            onClick={saveMoodEntry}
            disabled={isTracking}
            className="w-full bg-compassion-primary hover:bg-compassion-secondary"
          >
            {isTracking ? 'Saving...' : 'Log My Mood'}
          </Button>
        </CardContent>
      </Card>

      {/* Mental Health Resources */}
      {(showResources || currentMood <= 2 || currentStress >= 4) && (
        <Card className="border-compassion-gentle bg-gradient-to-br from-blue-50 to-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-compassion-primary">
              <Brain className="h-5 w-5" />
              Gentle Support Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Here are some gentle activities that might help you feel better. Choose what feels right for you today.
            </p>
            
            <div className="grid gap-3 md:grid-cols-2">
              {mentalHealthResources.map((resource) => (
                <div key={resource.id} className="p-4 bg-white rounded-lg border border-compassion-border hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {resource.resource_type === 'breathing' && <Activity className="h-4 w-4 text-blue-500" />}
                      {resource.resource_type === 'meditation' && <Brain className="h-4 w-4 text-purple-500" />}
                      {resource.resource_type === 'exercise' && <Target className="h-4 w-4 text-green-500" />}
                      {resource.resource_type === 'article' && <BookOpen className="h-4 w-4 text-orange-500" />}
                      {resource.resource_type === 'video' && <Play className="h-4 w-4 text-red-500" />}
                      <h4 className="font-medium text-sm">{resource.title}</h4>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {resource.duration_minutes}m
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startMentalHealthResource(resource)}
                    className="w-full border-compassion-border hover:bg-compassion-gentle"
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Start
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mood History */}
      <Card className="border-compassion-gentle">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-compassion-primary">
            <TrendingUp className="h-5 w-5" />
            Your Mood Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-compassion-gentle rounded-lg">
              <span className="text-sm font-medium">Average mood this week</span>
              <div className="flex items-center gap-2">
                {getMoodIcon(Math.round(getAverageMood()))}
                <span className="font-medium">{getAverageMood().toFixed(1)}/5</span>
              </div>
            </div>

            <div className="space-y-3">
              {moodEntries.slice(0, 5).map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-compassion-border">
                  <div className="flex items-center gap-3">
                    {getMoodIcon(entry.mood_score)}
                    <div>
                      <div className="text-sm font-medium">
                        {new Date(entry.recorded_at).toLocaleDateString()}
                      </div>
                      {entry.notes && (
                        <div className="text-xs text-muted-foreground">
                          "{entry.notes}"
                        </div>
                      )}
                      {entry.triggers && entry.triggers.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {entry.triggers.map((trigger, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {trigger}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right text-xs text-muted-foreground">
                    <div>Energy: {entry.energy_level}/5</div>
                    <div>Stress: {entry.stress_level}/5</div>
                    <div>Sleep: {entry.sleep_quality}/5</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};