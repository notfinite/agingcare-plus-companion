import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Leaf, Recycle, Award, TrendingDown, Target, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SustainabilityMetric {
  id: string;
  metric_type: string;
  category: string;
  carbon_footprint_kg: number;
  green_alternative_used: boolean;
  carbon_saved_kg: number;
  recorded_at: string;
}

interface SustainabilityGoal {
  id: string;
  goal_type: string;
  target_value: number;
  current_value: number;
  target_date: string;
  is_achieved: boolean;
}

export const SustainabilityWidget = () => {
  const [metrics, setMetrics] = useState<SustainabilityMetric[]>([]);
  const [goals, setGoals] = useState<SustainabilityGoal[]>([]);
  const [totalCarbonSaved, setTotalCarbonSaved] = useState(0);
  const [monthlyProgress, setMonthlyProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSustainabilityData();
  }, []);

  const fetchSustainabilityData = async () => {
    try {
      // Get current user profile
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) return;

      // Fetch sustainability metrics for current month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: metricsData } = await supabase
        .from('sustainability_metrics')
        .select('*')
        .eq('patient_id', profile.id)
        .gte('recorded_at', startOfMonth.toISOString())
        .order('recorded_at', { ascending: false });

      // Fetch sustainability goals
      const { data: goalsData } = await supabase
        .from('sustainability_goals')
        .select('*')
        .eq('patient_id', profile.id)
        .order('created_at', { ascending: false });

      if (metricsData) {
        setMetrics(metricsData);
        const totalSaved = metricsData.reduce((sum, metric) => sum + Number(metric.carbon_saved_kg), 0);
        setTotalCarbonSaved(totalSaved);
      }

      if (goalsData) {
        setGoals(goalsData);
        const currentGoal = goalsData.find(goal => goal.goal_type === 'monthly_carbon_reduction' && !goal.is_achieved);
        if (currentGoal) {
          const progress = Math.min((Number(currentGoal.current_value) / Number(currentGoal.target_value)) * 100, 100);
          setMonthlyProgress(progress);
        }
      }
    } catch (error) {
      console.error('Error fetching sustainability data:', error);
      toast({
        title: "Error",
        description: "Failed to load sustainability data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addSampleMetric = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) return;

      // Add sample telehealth appointment (green choice)
      await supabase
        .from('sustainability_metrics')
        .insert({
          patient_id: profile.id,
          metric_type: 'appointment',
          category: 'telehealth',
          carbon_footprint_kg: 0.5,
          green_alternative_used: true,
          carbon_saved_kg: 4.2, // Saved from not driving to appointment
          data: { appointment_type: 'consultation', duration_minutes: 30 }
        });

      // Update goal progress
      const currentGoal = goals.find(goal => goal.goal_type === 'monthly_carbon_reduction' && !goal.is_achieved);
      if (currentGoal) {
        const newValue = Number(currentGoal.current_value) + 4.2;
        await supabase
          .from('sustainability_goals')
          .update({ 
            current_value: newValue,
            is_achieved: newValue >= Number(currentGoal.target_value)
          })
          .eq('id', currentGoal.id);
      }

      toast({
        title: "Green Choice Recorded! 🌱",
        description: "You saved 4.2kg CO2 by choosing telehealth",
      });

      fetchSustainabilityData();
    } catch (error) {
      console.error('Error adding metric:', error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Green Health Score</CardTitle>
          <Leaf className="h-4 w-4 text-green-600" />
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

  const currentGoal = goals.find(goal => goal.goal_type === 'monthly_carbon_reduction' && !goal.is_achieved);
  const achievedGoals = goals.filter(goal => goal.is_achieved).length;

  return (
    <div className="space-y-4">
      {/* Main Green Health Score Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Green Health Score</CardTitle>
          <Leaf className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {totalCarbonSaved.toFixed(1)} kg CO₂
          </div>
          <p className="text-xs text-muted-foreground">
            Saved this month
          </p>
          <div className="mt-4 space-y-2">
            {currentGoal && (
              <>
                <div className="flex items-center justify-between text-sm">
                  <span>Monthly Goal Progress</span>
                  <span>{monthlyProgress.toFixed(0)}%</span>
                </div>
                <Progress value={monthlyProgress} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {Number(currentGoal.current_value).toFixed(1)} / {Number(currentGoal.target_value).toFixed(1)} kg CO₂ reduction
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Recycle className="h-5 w-5 text-green-600" />
            Eco-Health Actions
          </CardTitle>
          <CardDescription>
            Track your green healthcare choices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={addSampleMetric}
            variant="outline"
            className="w-full justify-start"
            size="sm"
          >
            <Leaf className="h-4 w-4 mr-2 text-green-600" />
            Record Telehealth Appointment
          </Button>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-500" />
              <span>{achievedGoals} Goals Achieved</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-green-600" />
              <span>{metrics.filter(m => m.green_alternative_used).length} Green Choices</span>
            </div>
          </div>

          {/* Recent Green Actions */}
          {metrics.filter(m => m.green_alternative_used).slice(0, 2).map((metric) => (
            <div key={metric.id} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {metric.category.replace('_', ' ')}
                </Badge>
                <span className="text-sm">-{metric.carbon_saved_kg}kg CO₂</span>
              </div>
              <Leaf className="h-4 w-4 text-green-600" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Monthly Challenge */}
      {currentGoal && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Monthly Challenge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Carbon Reduction Goal</span>
                <Badge variant={monthlyProgress >= 100 ? "default" : "secondary"}>
                  {monthlyProgress >= 100 ? "Achieved!" : "In Progress"}
                </Badge>
              </div>
              
              <div className="text-lg font-semibold">
                Save {Number(currentGoal.target_value).toFixed(1)} kg CO₂ this month
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Target: {new Date(currentGoal.target_date).toLocaleDateString()}</span>
              </div>
              
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm">
                  💡 <strong>Tip:</strong> Choose telehealth appointments when possible to reduce travel emissions!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};