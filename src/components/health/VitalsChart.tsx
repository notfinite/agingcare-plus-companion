import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ChartData {
  date: string;
  systolic?: number;
  diastolic?: number;
  heart_rate?: number;
  weight?: number;
  blood_glucose?: number;
}

export const VitalsChart = () => {
  const { profile } = useAuth();
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [activeMetric, setActiveMetric] = useState<string>('blood_pressure');
  const [trends, setTrends] = useState<{ [key: string]: 'up' | 'down' | 'stable' }>({});

  useEffect(() => {
    if (profile) {
      fetchVitalsData();
    }
  }, [profile]);

  const fetchVitalsData = async () => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('health_metrics')
        .select('*')
        .eq('patient_id', profile?.id)
        .gte('recorded_at', thirtyDaysAgo.toISOString())
        .order('recorded_at', { ascending: true });

      if (error) throw error;

      // Group by date and metric type
      const groupedData: { [date: string]: ChartData } = {};
      
      data?.forEach(metric => {
        const date = new Date(metric.recorded_at).toLocaleDateString();
        
        if (!groupedData[date]) {
          groupedData[date] = { date };
        }

        if (metric.metric_type === 'blood_pressure' && typeof metric.value === 'object') {
          groupedData[date].systolic = (metric.value as any).systolic;
          groupedData[date].diastolic = (metric.value as any).diastolic;
        } else if (metric.metric_type === 'heart_rate') {
          groupedData[date].heart_rate = metric.value as number;
        } else if (metric.metric_type === 'weight') {
          groupedData[date].weight = metric.value as number;
        } else if (metric.metric_type === 'blood_glucose') {
          groupedData[date].blood_glucose = metric.value as number;
        }
      });

      const chartArray = Object.values(groupedData);
      setChartData(chartArray);
      calculateTrends(chartArray);
    } catch (error) {
      console.error('Error fetching vitals data:', error);
    }
  };

  const calculateTrends = (data: ChartData[]) => {
    if (data.length < 2) return;

    const trends: { [key: string]: 'up' | 'down' | 'stable' } = {};
    const metrics = ['systolic', 'diastolic', 'heart_rate', 'weight', 'blood_glucose'];

    metrics.forEach(metric => {
      const values = data
        .map(d => d[metric as keyof ChartData] as number)
        .filter(v => v !== undefined);
      
      if (values.length >= 2) {
        const recent = values.slice(-3).reduce((a, b) => a + b, 0) / Math.min(3, values.length);
        const older = values.slice(0, -3).reduce((a, b) => a + b, 0) / Math.max(1, values.length - 3);
        
        const change = ((recent - older) / older) * 100;
        
        if (Math.abs(change) < 5) {
          trends[metric] = 'stable';
        } else if (change > 0) {
          trends[metric] = 'up';
        } else {
          trends[metric] = 'down';
        }
      }
    });

    setTrends(trends);
  };

  const getTrendIcon = (metric: string) => {
    const trend = trends[metric];
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-health-warning" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-health-good" />;
    return <Minus className="h-4 w-4 text-health-excellent" />;
  };

  const getChartLines = () => {
    switch (activeMetric) {
      case 'blood_pressure':
        return (
          <>
            <Line 
              type="monotone" 
              dataKey="systolic" 
              stroke="hsl(var(--health-warning))" 
              strokeWidth={3}
              name="Systolic"
            />
            <Line 
              type="monotone" 
              dataKey="diastolic" 
              stroke="hsl(var(--health-good))" 
              strokeWidth={3}
              name="Diastolic"
            />
          </>
        );
      case 'heart_rate':
        return (
          <Line 
            type="monotone" 
            dataKey="heart_rate" 
            stroke="hsl(var(--primary))" 
            strokeWidth={3}
            name="Heart Rate (BPM)"
          />
        );
      case 'weight':
        return (
          <Line 
            type="monotone" 
            dataKey="weight" 
            stroke="hsl(var(--secondary))" 
            strokeWidth={3}
            name="Weight (lbs)"
          />
        );
      case 'blood_glucose':
        return (
          <Line 
            type="monotone" 
            dataKey="blood_glucose" 
            stroke="hsl(var(--health-caution))" 
            strokeWidth={3}
            name="Blood Glucose (mg/dL)"
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-accessible-lg">Vital Signs Trends</CardTitle>
        <CardDescription className="text-accessible-base">
          Track your health metrics over time
        </CardDescription>
        
        <div className="flex flex-wrap gap-2 mt-4">
          <Button
            variant={activeMetric === 'blood_pressure' ? 'default' : 'outline'}
            onClick={() => setActiveMetric('blood_pressure')}
            className="flex items-center space-x-2"
          >
            {getTrendIcon('systolic')}
            <span>Blood Pressure</span>
          </Button>
          <Button
            variant={activeMetric === 'heart_rate' ? 'default' : 'outline'}
            onClick={() => setActiveMetric('heart_rate')}
            className="flex items-center space-x-2"
          >
            {getTrendIcon('heart_rate')}
            <span>Heart Rate</span>
          </Button>
          <Button
            variant={activeMetric === 'weight' ? 'default' : 'outline'}
            onClick={() => setActiveMetric('weight')}
            className="flex items-center space-x-2"
          >
            {getTrendIcon('weight')}
            <span>Weight</span>
          </Button>
          <Button
            variant={activeMetric === 'blood_glucose' ? 'default' : 'outline'}
            onClick={() => setActiveMetric('blood_glucose')}
            className="flex items-center space-x-2"
          >
            {getTrendIcon('blood_glucose')}
            <span>Blood Glucose</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-accessible-base text-muted-foreground text-center py-8">
            No data available. Start recording your vitals to see trends!
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
              <Legend />
              {getChartLines()}
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};