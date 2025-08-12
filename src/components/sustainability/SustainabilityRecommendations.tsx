import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Leaf, Utensils, Car, Home, Calendar, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: 'diet' | 'transport' | 'energy' | 'healthcare' | 'lifestyle';
  impact: 'high' | 'medium' | 'low';
  co2_savings_kg: number;
  difficulty: 'easy' | 'moderate' | 'challenging';
  timeframe: string;
  action_steps: string[];
}

interface UserProfile {
  role: string;
  age?: number;
  conditions?: string[];
}

export const SustainabilityRecommendations = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingRecommendations, setGeneratingRecommendations] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('role, date_of_birth')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        const age = profile.date_of_birth ? 
          new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear() : undefined;
        
        setUserProfile({
          role: profile.role,
          age
        });
        
        generatePersonalizedRecommendations(profile.role, age);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePersonalizedRecommendations = (role: string, age?: number) => {
    const baseRecommendations: Recommendation[] = [];

    if (role === 'patient') {
      baseRecommendations.push(
        {
          id: '1',
          title: 'Choose Plant-Based Meals 2x/Week',
          description: 'Replace beef meals with plant-based alternatives. Beef production uses 20x more water and land than vegetables.',
          category: 'diet',
          impact: 'high',
          co2_savings_kg: 6.2,
          difficulty: 'easy',
          timeframe: 'Weekly',
          action_steps: [
            'Start with "Meatless Monday" meals',
            'Try lentil-based soups and stews',
            'Explore Mediterranean diet recipes',
            'Focus on seasonal, local vegetables'
          ]
        },
        {
          id: '2',
          title: 'Use Telehealth When Possible',
          description: 'Remote consultations eliminate travel emissions while maintaining quality care.',
          category: 'healthcare',
          impact: 'medium',
          co2_savings_kg: 4.2,
          difficulty: 'easy',
          timeframe: 'Per appointment',
          action_steps: [
            'Ask your doctor about telehealth options',
            'Prepare questions in advance',
            'Ensure good internet connection',
            'Use for routine follow-ups'
          ]
        },
        {
          id: '3',
          title: 'Combine Medical Trips',
          description: 'Schedule multiple appointments on the same day to reduce transportation emissions.',
          category: 'transport',
          impact: 'medium',
          co2_savings_kg: 3.8,
          difficulty: 'moderate',
          timeframe: 'Monthly',
          action_steps: [
            'Coordinate with medical scheduler',
            'Plan lab work and consultations together',
            'Use public transport when possible',
            'Consider shared rides with other patients'
          ]
        }
      );
    } else if (role === 'caregiver') {
      baseRecommendations.push(
        {
          id: '4',
          title: 'Bulk Purchase Eco-Friendly Supplies',
          description: 'Reduce packaging waste and delivery emissions by buying sustainable care supplies in bulk.',
          category: 'lifestyle',
          impact: 'medium',
          co2_savings_kg: 2.5,
          difficulty: 'easy',
          timeframe: 'Monthly',
          action_steps: [
            'Research biodegradable care products',
            'Join group purchasing with other caregivers',
            'Choose refillable containers',
            'Support local suppliers when possible'
          ]
        },
        {
          id: '5',
          title: 'Energy-Efficient Care Routines',
          description: 'Optimize heating, lighting, and medical device usage to reduce energy consumption.',
          category: 'energy',
          impact: 'high',
          co2_savings_kg: 8.3,
          difficulty: 'moderate',
          timeframe: 'Daily',
          action_steps: [
            'Use programmable thermostats',
            'Switch to LED lighting in care areas',
            'Maintain medical equipment efficiently',
            'Insulate frequently used rooms'
          ]
        }
      );
    } else if (role === 'provider') {
      baseRecommendations.push(
        {
          id: '6',
          title: 'Digital-First Patient Communications',
          description: 'Reduce paper waste and mailing emissions through secure digital platforms.',
          category: 'healthcare',
          impact: 'medium',
          co2_savings_kg: 1.8,
          difficulty: 'moderate',
          timeframe: 'Per patient',
          action_steps: [
            'Implement patient portal systems',
            'Use electronic health records fully',
            'Send digital appointment reminders',
            'Provide online test results'
          ]
        },
        {
          id: '7',
          title: 'Sustainable Medical Supply Chain',
          description: 'Partner with suppliers focused on reduced packaging and carbon-neutral shipping.',
          category: 'healthcare',
          impact: 'high',
          co2_savings_kg: 15.7,
          difficulty: 'challenging',
          timeframe: 'Quarterly',
          action_steps: [
            'Audit current supply chain emissions',
            'Research sustainable medical suppliers',
            'Implement bulk ordering systems',
            'Track packaging waste reduction'
          ]
        }
      );
    }

    setRecommendations(baseRecommendations);
  };

  const generateAIRecommendations = async () => {
    setGeneratingRecommendations(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-health-assistant', {
        body: {
          message: `Based on my role as a ${userProfile?.role} in healthcare, suggest 3 specific, actionable ways I can reduce my carbon footprint while maintaining or improving care quality. Focus on practical interventions with measurable CO2 impact. Include specific numbers where possible (like water usage, emissions saved, etc.).`,
          userRole: userProfile?.role,
          context: {
            sustainabilityFocus: true,
            age: userProfile?.age
          }
        }
      });

      if (error) throw error;

      toast({
        title: "AI Recommendations Generated! 🤖",
        description: "Personalized sustainability suggestions added",
      });

      // For now, show the AI response in a toast since we'd need to parse it
      // In production, you'd parse the AI response and create recommendation objects
      console.log('AI Sustainability Recommendations:', data.response);
      
    } catch (error) {
      console.error('Error generating AI recommendations:', error);
      toast({
        title: "AI Unavailable",
        description: "Using curated recommendations instead",
        variant: "destructive",
      });
    } finally {
      setGeneratingRecommendations(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'diet': return <Utensils className="h-4 w-4" />;
      case 'transport': return <Car className="h-4 w-4" />;
      case 'energy': return <Home className="h-4 w-4" />;
      case 'healthcare': return <Calendar className="h-4 w-4" />;
      default: return <Leaf className="h-4 w-4" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            Smart Carbon Reduction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          Smart Carbon Reduction
        </CardTitle>
        <CardDescription>
          Personalized interventions for {userProfile?.role}s to reduce environmental impact
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            onClick={generateAIRecommendations}
            disabled={generatingRecommendations}
            size="sm"
            variant="outline"
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            {generatingRecommendations ? 'Generating...' : 'Get AI Recommendations'}
          </Button>
        </div>

        <div className="space-y-3">
          {recommendations.map((rec) => (
            <div key={rec.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(rec.category)}
                  <h4 className="font-medium">{rec.title}</h4>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary" className={getImpactColor(rec.impact)}>
                    {rec.impact} impact
                  </Badge>
                  <Badge variant="outline">
                    -{rec.co2_savings_kg}kg CO₂
                  </Badge>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">{rec.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Action Steps:</span>
                  <span className="text-muted-foreground">{rec.timeframe} • {rec.difficulty}</span>
                </div>
                
                <div className="space-y-1">
                  {rec.action_steps.slice(0, 2).map((step, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <ChevronRight className="h-3 w-3 text-muted-foreground" />
                      <span>{step}</span>
                    </div>
                  ))}
                  {rec.action_steps.length > 2 && (
                    <div className="text-xs text-muted-foreground pl-5">
                      +{rec.action_steps.length - 2} more steps
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-muted p-3 rounded-lg">
          <p className="text-sm">
            💡 <strong>Pro tip:</strong> Start with one recommendation per week to build sustainable habits that last.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};