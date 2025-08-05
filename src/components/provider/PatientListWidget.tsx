import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { AlertTriangle, TrendingUp, TrendingDown, Clock, Phone } from 'lucide-react';

export const PatientListWidget = () => {
  const priorityPatients = [
    {
      id: 1,
      name: 'Robert Martinez',
      age: 68,
      condition: 'Cardiovascular Disease',
      riskLevel: 'high',
      lastContact: '2 days ago',
      alerts: 3,
      trend: 'up',
      keyMetric: 'BP: 165/95',
      nextAction: 'Medication adjustment needed'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      age: 72,
      condition: 'Type 2 Diabetes + CKD',
      riskLevel: 'medium',
      lastContact: '1 day ago',
      alerts: 1,
      trend: 'stable',
      keyMetric: 'HbA1c: 7.8%',
      nextAction: 'Dietary consultation recommended'
    },
    {
      id: 3,
      name: 'Eleanor Chen',
      age: 65,
      condition: 'Type 2 Diabetes',
      riskLevel: 'low',
      lastContact: '3 hours ago',
      alerts: 0,
      trend: 'down',
      keyMetric: 'HbA1c: 6.8%',
      nextAction: 'Continue current plan'
    },
    {
      id: 4,
      name: 'James Wilson',
      age: 74,
      condition: 'COPD + Hypertension',
      riskLevel: 'high',
      lastContact: '6 hours ago',
      alerts: 2,
      trend: 'up',
      keyMetric: 'O2: 88%',
      nextAction: 'Pulmonary function review'
    },
    {
      id: 5,
      name: 'Maria Rodriguez',
      age: 69,
      condition: 'Heart Failure',
      riskLevel: 'medium',
      lastContact: '4 hours ago',
      alerts: 1,
      trend: 'stable',
      keyMetric: 'Weight: +2.5 lbs',
      nextAction: 'Diuretic adjustment'
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-health-critical/10 text-health-critical border-health-critical';
      case 'medium': return 'bg-health-warning/10 text-health-warning border-health-warning';
      case 'low': return 'bg-health-excellent/10 text-health-excellent border-health-excellent';
      default: return 'bg-muted/10 text-muted-foreground border-muted';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-health-warning" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-health-excellent" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-accessible-lg">Priority Patient Queue</CardTitle>
            <CardDescription className="text-accessible-base">
              Patients requiring immediate attention sorted by risk score
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            View All (247)
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {priorityPatients.map((patient) => (
          <div key={patient.id} className="border rounded-lg p-4 space-y-3 hover:bg-muted/20 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-accessible-base font-medium">{patient.name}</h4>
                  <p className="text-accessible-sm text-muted-foreground">Age {patient.age} • {patient.condition}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {patient.alerts > 0 && (
                  <div className="flex items-center space-x-1">
                    <AlertTriangle className="h-4 w-4 text-health-warning" />
                    <span className="text-accessible-sm font-medium text-health-warning">{patient.alerts}</span>
                  </div>
                )}
                <Badge variant="outline" className={getRiskColor(patient.riskLevel)}>
                  {patient.riskLevel.toUpperCase()} RISK
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-accessible-sm">
              <div>
                <span className="text-muted-foreground">Key Metric:</span>
                <div className="flex items-center space-x-1">
                  <p className="font-medium">{patient.keyMetric}</p>
                  {getTrendIcon(patient.trend)}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Last Contact:</span>
                <p className="font-medium">{patient.lastContact}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Next Action:</span>
                <p className="font-medium text-secondary">{patient.nextAction}</p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4 mr-1" />
                Call
              </Button>
              <Button size="sm">
                Review Chart
              </Button>
            </div>
          </div>
        ))}
        
        <div className="mt-6 p-4 bg-secondary/5 rounded-lg">
          <h5 className="text-accessible-base font-medium text-secondary mb-2">⚡ Quick Actions</h5>
          <div className="grid grid-cols-2 gap-2 text-accessible-sm">
            <Button variant="outline" size="sm" className="justify-start">
              Review 12 pending medication adjustments
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              Schedule 8 overdue follow-ups
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};