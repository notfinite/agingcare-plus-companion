import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Heart, Activity, Droplets } from 'lucide-react';

export const HealthSummaryWidget = () => {
  const healthSummary = [
    {
      patient: 'Mom (Eleanor)',
      condition: 'Type 2 Diabetes',
      keyMetrics: [
        { label: 'HbA1c', value: '6.8%', trend: 'down', target: '< 7%', status: 'excellent' },
        { label: 'Avg. Blood Sugar', value: '145 mg/dL', trend: 'stable', target: '80-180', status: 'good' },
        { label: 'Blood Pressure', value: '118/76', trend: 'stable', target: '< 130/80', status: 'excellent' }
      ],
      interventions: [
        'Continue Mediterranean diet - 15% improvement in glucose control',
        'Morning walks are helping - keep up 30min daily routine',
        'Medication timing optimized - excellent adherence'
      ]
    },
    {
      patient: 'Dad (Robert)',
      condition: 'Cardiovascular Disease',
      keyMetrics: [
        { label: 'Blood Pressure', value: '165/95', trend: 'up', target: '< 130/80', status: 'warning' },
        { label: 'Resting HR', value: '89 BPM', trend: 'up', target: '60-80', status: 'caution' },
        { label: 'Cholesterol', value: '198 mg/dL', trend: 'down', target: '< 200', status: 'good' }
      ],
      interventions: [
        '🍎 Plant-based diet showing 12% cholesterol reduction',
        '🚶 Increase walking to 45min daily - target HR 120-140',
        '💊 Review evening BP medication timing with doctor'
      ]
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-health-warning" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-health-excellent" />;
      default: return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-health-excellent border-health-excellent';
      case 'good': return 'text-health-good border-health-good';
      case 'warning': return 'text-health-warning border-health-warning';
      case 'caution': return 'text-health-caution border-health-caution';
      default: return 'text-muted-foreground border-muted';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-accessible-lg">Health Trends & Interventions</CardTitle>
        <CardDescription className="text-accessible-base">
          Evidence-based recommendations for better outcomes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {healthSummary.map((patient, index) => (
          <div key={index} className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-accessible-base font-medium">{patient.patient}</h4>
              <Badge variant="outline" className="text-primary border-primary">
                {patient.condition}
              </Badge>
            </div>
            
            <div className="grid gap-3">
              {patient.keyMetrics.map((metric, metricIndex) => (
                <div key={metricIndex} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {metric.label === 'Blood Pressure' && <Heart className="h-4 w-4 text-muted-foreground" />}
                      {metric.label === 'Resting HR' && <Activity className="h-4 w-4 text-muted-foreground" />}
                      {metric.label.includes('Blood Sugar') && <Droplets className="h-4 w-4 text-muted-foreground" />}
                      <span className="text-accessible-sm font-medium">{metric.label}</span>
                    </div>
                    {getTrendIcon(metric.trend)}
                  </div>
                  <div className="text-right">
                    <p className="text-accessible-sm font-bold">{metric.value}</p>
                    <p className="text-accessible-xs text-muted-foreground">Target: {metric.target}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <h5 className="text-accessible-sm font-medium text-secondary">Recommended Interventions:</h5>
              {patient.interventions.map((intervention, intIndex) => (
                <div key={intIndex} className="text-accessible-sm text-muted-foreground bg-secondary/5 p-2 rounded">
                  {intervention}
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div className="mt-6 p-4 bg-primary/5 rounded-lg">
          <h5 className="text-accessible-base font-medium text-primary mb-2">🌟 Care Excellence Achievements</h5>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-accessible-xl font-bold text-health-excellent">12</div>
              <p className="text-accessible-xs text-muted-foreground">Health Goals Met</p>
            </div>
            <div>
              <div className="text-accessible-xl font-bold text-secondary">85%</div>
              <p className="text-accessible-xs text-muted-foreground">Risk Reduction</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};