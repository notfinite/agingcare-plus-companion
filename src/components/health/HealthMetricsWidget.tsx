import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Heart, Activity, Thermometer, Scale, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HealthMetric {
  id: string;
  metric_type: string;
  value: any;
  unit: string;
  recorded_at: string;
  notes?: string;
}

const metricTypes = [
  { value: 'blood_pressure', label: 'Blood Pressure', icon: Heart, unit: 'mmHg' },
  { value: 'heart_rate', label: 'Heart Rate', icon: Activity, unit: 'BPM' },
  { value: 'blood_glucose', label: 'Blood Glucose', icon: Activity, unit: 'mg/dL' },
  { value: 'temperature', label: 'Temperature', icon: Thermometer, unit: '°F' },
  { value: 'weight', label: 'Weight', icon: Scale, unit: 'lbs' },
];

export const HealthMetricsWidget = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [isAddingMetric, setIsAddingMetric] = useState(false);
  const [newMetric, setNewMetric] = useState({
    metric_type: '',
    systolic: '',
    diastolic: '',
    value: '',
    notes: ''
  });

  useEffect(() => {
    if (profile) {
      fetchMetrics();
    }
  }, [profile]);

  const fetchMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('health_metrics')
        .select('*')
        .eq('patient_id', profile?.id)
        .order('recorded_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setMetrics(data || []);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const addMetric = async () => {
    if (!profile || !newMetric.metric_type) return;

    try {
      let value;
      let unit = metricTypes.find(t => t.value === newMetric.metric_type)?.unit || '';

      if (newMetric.metric_type === 'blood_pressure') {
        value = { systolic: parseInt(newMetric.systolic), diastolic: parseInt(newMetric.diastolic) };
      } else {
        value = parseFloat(newMetric.value);
      }

      const { error } = await supabase
        .from('health_metrics')
        .insert({
          patient_id: profile.id,
          metric_type: newMetric.metric_type,
          value,
          unit,
          notes: newMetric.notes || null
        });

      if (error) throw error;

      toast({
        title: "Health metric added",
        description: "Your health data has been recorded successfully.",
      });

      setNewMetric({ metric_type: '', systolic: '', diastolic: '', value: '', notes: '' });
      setIsAddingMetric(false);
      fetchMetrics();
    } catch (error) {
      toast({
        title: "Error adding metric",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const getMetricIcon = (type: string) => {
    const metricType = metricTypes.find(t => t.value === type);
    return metricType?.icon || Activity;
  };

  const formatValue = (metric: HealthMetric) => {
    if (metric.metric_type === 'blood_pressure') {
      return `${metric.value.systolic}/${metric.value.diastolic}`;
    }
    return `${metric.value} ${metric.unit}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-accessible-lg">Health Metrics</CardTitle>
            <CardDescription className="text-accessible-base">
              Track your vital signs and health indicators
            </CardDescription>
          </div>
          <Dialog open={isAddingMetric} onOpenChange={setIsAddingMetric}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Add Metric
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-accessible-xl">Add Health Metric</DialogTitle>
                <DialogDescription className="text-accessible-base">
                  Record a new health measurement
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metric_type" className="text-accessible-lg">Metric Type</Label>
                  <Select value={newMetric.metric_type} onValueChange={(value) => setNewMetric({...newMetric, metric_type: value})}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select metric type" />
                    </SelectTrigger>
                    <SelectContent>
                      {metricTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {newMetric.metric_type === 'blood_pressure' ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="systolic" className="text-accessible-lg">Systolic</Label>
                      <Input
                        id="systolic"
                        type="number"
                        value={newMetric.systolic}
                        onChange={(e) => setNewMetric({...newMetric, systolic: e.target.value})}
                        placeholder="120"
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="diastolic" className="text-accessible-lg">Diastolic</Label>
                      <Input
                        id="diastolic"
                        type="number"
                        value={newMetric.diastolic}
                        onChange={(e) => setNewMetric({...newMetric, diastolic: e.target.value})}
                        placeholder="80"
                        className="h-12"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="value" className="text-accessible-lg">Value</Label>
                    <Input
                      id="value"
                      type="number"
                      value={newMetric.value}
                      onChange={(e) => setNewMetric({...newMetric, value: e.target.value})}
                      placeholder="Enter value"
                      className="h-12"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-accessible-lg">Notes (Optional)</Label>
                  <Input
                    id="notes"
                    value={newMetric.notes}
                    onChange={(e) => setNewMetric({...newMetric, notes: e.target.value})}
                    placeholder="Any additional notes"
                    className="h-12"
                  />
                </div>

                <Button onClick={addMetric} className="w-full" size="lg">
                  Record Metric
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 bg-primary/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Activity className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-accessible-lg font-medium mb-2">Start Your Health Journey</h3>
              <p className="text-accessible-base text-muted-foreground mb-6">
                Track your vitals to get personalized insights and recommendations for better health outcomes.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {metricTypes.slice(0, 3).map((type) => {
                  const Icon = type.icon;
                  return (
                    <div key={type.value} className="text-center p-3 bg-muted/50 rounded-lg">
                      <Icon className="h-6 w-6 text-primary mx-auto mb-2" />
                      <p className="text-accessible-sm font-medium">{type.label}</p>
                    </div>
                  );
                })}
              </div>
              <p className="text-accessible-sm text-muted-foreground">
                💡 Tip: Regular monitoring helps detect health changes early
              </p>
            </div>
          ) : (
            metrics.map((metric) => {
              const Icon = getMetricIcon(metric.metric_type);
              return (
                <div key={metric.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon className="h-6 w-6 text-primary" />
                    <div>
                      <h4 className="text-accessible-base font-medium">
                        {metricTypes.find(t => t.value === metric.metric_type)?.label || metric.metric_type}
                      </h4>
                      <p className="text-accessible-sm text-muted-foreground">
                        {new Date(metric.recorded_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-accessible-lg font-semibold">{formatValue(metric)}</p>
                    {metric.notes && (
                      <p className="text-accessible-sm text-muted-foreground">{metric.notes}</p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};