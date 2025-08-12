import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SustainabilityRecommendations } from './SustainabilityRecommendations';
import { 
  Leaf, 
  Car, 
  Pill, 
  Smartphone, 
  Lightbulb, 
  Award, 
  TrendingUp,
  Calendar,
  Target,
  Recycle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SustainabilityMetric {
  id: string;
  metric_type: string;
  category: string;
  carbon_footprint_kg: number;
  green_alternative_used: boolean;
  carbon_saved_kg: number;
  data: any;
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

export const SustainabilityDashboard = () => {
  const [metrics, setMetrics] = useState<SustainabilityMetric[]>([]);
  const [goals, setGoals] = useState<SustainabilityGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) return;

      // Fetch all sustainability metrics
      const { data: metricsData } = await supabase
        .from('sustainability_metrics')
        .select('*')
        .eq('patient_id', profile.id)
        .order('recorded_at', { ascending: false });

      // Fetch goals
      const { data: goalsData } = await supabase
        .from('sustainability_goals')
        .select('*')
        .eq('patient_id', profile.id)
        .order('created_at', { ascending: false });

      if (metricsData) setMetrics(metricsData);
      if (goalsData) setGoals(goalsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addQuickAction = async (type: string, category: string, footprint: number, saved: number, isGreen: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) return;

      await supabase
        .from('sustainability_metrics')
        .insert({
          patient_id: profile.id,
          metric_type: type,
          category: category,
          carbon_footprint_kg: footprint,
          green_alternative_used: isGreen,
          carbon_saved_kg: saved
        });

      toast({
        title: isGreen ? "Green Choice Recorded! 🌱" : "Action Recorded",
        description: isGreen ? `You saved ${saved}kg CO₂!` : "Thanks for tracking your impact",
      });

      fetchData();
    } catch (error) {
      console.error('Error adding action:', error);
    }
  };

  const getTotalCarbonSaved = () => {
    return metrics.reduce((sum, metric) => sum + Number(metric.carbon_saved_kg), 0);
  };

  const getTotalFootprint = () => {
    return metrics.reduce((sum, metric) => sum + Number(metric.carbon_footprint_kg), 0);
  };

  const getMetricsByType = (type: string) => {
    return metrics.filter(m => m.metric_type === type);
  };

  const getGreenChoiceRate = () => {
    if (metrics.length === 0) return 0;
    return (metrics.filter(m => m.green_alternative_used).length / metrics.length) * 100;
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">Loading sustainability dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total CO₂ Saved</CardTitle>
            <Leaf className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {getTotalCarbonSaved().toFixed(1)} kg
            </div>
            <p className="text-xs text-muted-foreground">
              Lifetime impact
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Green Choice Rate</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getGreenChoiceRate().toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Of your decisions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goals Achieved</CardTitle>
            <Award className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {goals.filter(g => g.is_achieved).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Milestones reached
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carbon Footprint</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getTotalFootprint().toFixed(1)} kg
            </div>
            <p className="text-xs text-muted-foreground">
              Total emissions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="actions">Quick Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Monthly Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Impact</CardTitle>
                <CardDescription>Your environmental contribution this month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Show monthly metrics */}
                {Object.entries({
                  medication: 'Medications',
                  appointment: 'Appointments', 
                  transport: 'Transportation',
                  energy: 'Energy Use'
                }).map(([type, label]) => {
                  const typeMetrics = getMetricsByType(type);
                  const totalSaved = typeMetrics.reduce((sum, m) => sum + Number(m.carbon_saved_kg), 0);
                  return (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm">{label}</span>
                      <span className="text-sm font-medium text-green-600">
                        -{totalSaved.toFixed(1)} kg CO₂
                      </span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Green Choices</CardTitle>
                <CardDescription>Your latest sustainable health decisions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics.filter(m => m.green_alternative_used).slice(0, 5).map((metric) => (
                    <div key={metric.id} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        {metric.metric_type === 'appointment' && <Calendar className="h-4 w-4 text-green-600" />}
                        {metric.metric_type === 'medication' && <Pill className="h-4 w-4 text-green-600" />}
                        {metric.metric_type === 'transport' && <Car className="h-4 w-4 text-green-600" />}
                        {metric.metric_type === 'device' && <Smartphone className="h-4 w-4 text-green-600" />}
                        <span className="text-sm font-medium">{metric.category.replace('_', ' ')}</span>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        -{metric.carbon_saved_kg}kg CO₂
                      </Badge>
                    </div>
                  ))}
                  
                  {metrics.filter(m => m.green_alternative_used).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No green choices recorded yet. Start making sustainable decisions!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <SustainabilityRecommendations />
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries({
              appointment: { icon: Calendar, label: 'Healthcare Visits', color: 'blue' },
              medication: { icon: Pill, label: 'Medications', color: 'purple' },
              transport: { icon: Car, label: 'Transportation', color: 'orange' },
              device: { icon: Smartphone, label: 'Medical Devices', color: 'green' },
              energy: { icon: Lightbulb, label: 'Energy Usage', color: 'yellow' }
            }).map(([type, config]) => {
              const typeMetrics = getMetricsByType(type);
              const totalSaved = typeMetrics.reduce((sum, m) => sum + Number(m.carbon_saved_kg), 0);
              const totalFootprint = typeMetrics.reduce((sum, m) => sum + Number(m.carbon_footprint_kg), 0);
              const greenChoices = typeMetrics.filter(m => m.green_alternative_used).length;
              
              return (
                <Card key={type}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{config.label}</CardTitle>
                    <config.icon className={`h-4 w-4 text-${config.color}-600`} />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-lg font-bold text-green-600">
                        -{totalSaved.toFixed(1)} kg CO₂
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {greenChoices} green choices
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Total footprint: {totalFootprint.toFixed(1)} kg CO₂
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <div className="space-y-4">
            {goals.map((goal) => (
              <Card key={goal.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {goal.goal_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </CardTitle>
                    <Badge variant={goal.is_achieved ? "default" : "secondary"}>
                      {goal.is_achieved ? "Achieved!" : "In Progress"}
                    </Badge>
                  </div>
                  <CardDescription>
                    Target: {Number(goal.target_value).toFixed(1)} kg CO₂ reduction by {new Date(goal.target_date).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Progress 
                      value={Math.min((Number(goal.current_value) / Number(goal.target_value)) * 100, 100)} 
                      className="h-2"
                    />
                    <div className="flex justify-between text-sm">
                      <span>{Number(goal.current_value).toFixed(1)} kg saved</span>
                      <span>{Number(goal.target_value).toFixed(1)} kg target</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Healthcare Appointments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={() => addQuickAction('appointment', 'telehealth', 0.5, 4.2, true)}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Leaf className="h-4 w-4 mr-2 text-green-600" />
                  Record Telehealth Visit
                </Button>
                <Button
                  onClick={() => addQuickAction('appointment', 'in_person', 4.7, 0, false)}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Car className="h-4 w-4 mr-2 text-orange-600" />
                  Record In-Person Visit
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-purple-600" />
                  Medications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={() => addQuickAction('medication', 'local_pharmacy', 0.2, 1.8, true)}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Leaf className="h-4 w-4 mr-2 text-green-600" />
                  Local Pharmacy Pickup
                </Button>
                <Button
                  onClick={() => addQuickAction('medication', 'shipped', 2.0, 0, false)}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Car className="h-4 w-4 mr-2 text-orange-600" />
                  Shipped Medication
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-green-600" />
                  Medical Devices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={() => addQuickAction('device', 'energy_efficient', 0.3, 0.7, true)}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Leaf className="h-4 w-4 mr-2 text-green-600" />
                  Use Energy Efficient Device
                </Button>
                <Button
                  onClick={() => addQuickAction('device', 'standard', 1.0, 0, false)}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Smartphone className="h-4 w-4 mr-2 text-gray-600" />
                  Use Standard Device
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Recycle className="h-5 w-5 text-green-600" />
                  Sustainable Practices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={() => addQuickAction('energy', 'led_lighting', 0.1, 0.5, true)}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Lightbulb className="h-4 w-4 mr-2 text-yellow-600" />
                  Switch to LED Lighting
                </Button>
                <Button
                  onClick={() => addQuickAction('transport', 'public_transport', 1.5, 2.8, true)}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Car className="h-4 w-4 mr-2 text-green-600" />
                  Use Public Transport
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};