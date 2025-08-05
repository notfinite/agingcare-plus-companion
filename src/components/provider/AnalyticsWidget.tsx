import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Users, Target, Award, DollarSign } from 'lucide-react';

export const AnalyticsWidget = () => {
  const qualityMetrics = [
    {
      metric: 'HbA1c Control (<7%)',
      current: 68,
      target: 80,
      trend: 'up',
      change: '+12%',
      benchmark: 'Above national average (52%)'
    },
    {
      metric: 'BP Control (<130/80)',
      current: 74,
      target: 85,
      trend: 'up',
      change: '+8%',
      benchmark: 'Meeting quality standards'
    },
    {
      metric: 'Medication Adherence',
      current: 87,
      target: 90,
      trend: 'stable',
      change: '+2%',
      benchmark: 'Excellent vs national (71%)'
    },
    {
      metric: 'Emergency Dept Visits',
      current: 23,
      target: 15,
      trend: 'down',
      change: '-34%',
      benchmark: 'Significant improvement'
    }
  ];

  const outcomeStats = [
    {
      title: 'Care Gap Closure',
      value: '89%',
      icon: Target,
      color: 'text-health-excellent',
      description: '156 of 175 identified gaps addressed'
    },
    {
      title: 'Patient Satisfaction',
      value: '4.8/5',
      icon: Award,
      color: 'text-secondary',
      description: 'NPS Score: 78 (Industry: 31)'
    },
    {
      title: 'Cost Savings',
      value: '$284K',
      icon: DollarSign,
      color: 'text-primary',
      description: 'Reduced readmissions & complications'
    },
    {
      title: 'Population Health',
      value: '92%',
      icon: Users,
      color: 'text-health-good',
      description: 'Patients meeting care goals'
    }
  ];

  const riskStratification = [
    { level: 'Low Risk', count: 742, percentage: 59.5, color: 'bg-health-excellent' },
    { level: 'Medium Risk', count: 368, percentage: 29.5, color: 'bg-health-warning' },
    { level: 'High Risk', count: 137, percentage: 11.0, color: 'bg-health-critical' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-accessible-lg">Population Health Analytics</CardTitle>
        <CardDescription className="text-accessible-base">
          Quality metrics and outcomes for 1,247 chronic disease patients
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quality Metrics */}
        <div className="space-y-4">
          <h4 className="text-accessible-base font-medium">Quality Performance Indicators</h4>
          {qualityMetrics.map((metric, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-accessible-sm font-medium">{metric.metric}</span>
                <div className="flex items-center space-x-2">
                  {metric.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-health-excellent" />
                  ) : metric.trend === 'down' ? (
                    <TrendingDown className="h-4 w-4 text-health-excellent" />
                  ) : null}
                  <span className="text-accessible-sm font-bold">{metric.current}%</span>
                  <Badge variant="outline" className="text-health-excellent border-health-excellent">
                    {metric.change}
                  </Badge>
                </div>
              </div>
              <Progress value={metric.current} className="h-2" />
              <p className="text-accessible-xs text-muted-foreground">{metric.benchmark}</p>
            </div>
          ))}
        </div>

        {/* Outcome Statistics */}
        <div className="grid grid-cols-2 gap-4">
          {outcomeStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="p-4 border rounded-lg text-center">
                <IconComponent className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                <div className={`text-accessible-xl font-bold ${stat.color}`}>{stat.value}</div>
                <p className="text-accessible-sm font-medium">{stat.title}</p>
                <p className="text-accessible-xs text-muted-foreground">{stat.description}</p>
              </div>
            );
          })}
        </div>

        {/* Risk Stratification */}
        <div className="space-y-4">
          <h4 className="text-accessible-base font-medium">Patient Risk Distribution</h4>
          {riskStratification.map((risk, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-accessible-sm font-medium">{risk.level}</span>
                <span className="text-accessible-sm font-bold">{risk.count} patients ({risk.percentage}%)</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`${risk.color} h-2 rounded-full transition-all duration-300`}
                  style={{width: `${risk.percentage}%`}}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Clinical Interventions Impact */}
        <div className="mt-6 p-4 bg-primary/5 rounded-lg">
          <h5 className="text-accessible-base font-medium text-primary mb-3">🎯 Clinical Impact This Quarter</h5>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-accessible-xl font-bold text-health-excellent">234</div>
              <p className="text-accessible-xs text-muted-foreground">Prevented Complications</p>
            </div>
            <div>
              <div className="text-accessible-xl font-bold text-secondary">91%</div>
              <p className="text-accessible-xs text-muted-foreground">Goal Achievement Rate</p>
            </div>
          </div>
          <p className="text-accessible-sm text-muted-foreground mt-3">
            Your patient-centered care approach has resulted in 15% better outcomes compared to regional benchmarks.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};