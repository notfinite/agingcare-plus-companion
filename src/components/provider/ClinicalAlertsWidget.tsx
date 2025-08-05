import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, Heart, Activity, Droplets, Thermometer } from 'lucide-react';

export const ClinicalAlertsWidget = () => {
  const alerts = [
    {
      id: 1,
      patient: 'Robert Martinez',
      type: 'critical',
      category: 'Blood Pressure',
      message: 'BP reading 185/110 - Hypertensive Crisis',
      time: '15 minutes ago',
      icon: Heart,
      action: 'Immediate intervention required',
      recommendation: 'Consider ER referral, adjust antihypertensive'
    },
    {
      id: 2,
      patient: 'James Wilson',
      type: 'urgent',
      category: 'Oxygen Saturation',
      message: 'O2 sat dropped to 85% during sleep',
      time: '2 hours ago',
      icon: Activity,
      action: 'Pulmonary consultation needed',
      recommendation: 'Increase oxygen therapy, sleep study'
    },
    {
      id: 3,
      patient: 'Sarah Johnson',
      type: 'warning',
      category: 'Blood Glucose',
      message: 'Persistent hyperglycemia >300 mg/dL',
      time: '4 hours ago',
      icon: Droplets,
      action: 'Medication adjustment',
      recommendation: 'Increase insulin dosage, dietary review'
    },
    {
      id: 4,
      patient: 'Maria Rodriguez',
      type: 'urgent',
      category: 'Weight Gain',
      message: 'Rapid weight gain +5 lbs in 2 days',
      time: '6 hours ago',
      icon: Heart,
      action: 'Heart failure exacerbation',
      recommendation: 'Increase diuretics, fluid restriction'
    },
    {
      id: 5,
      patient: 'Eleanor Chen',
      type: 'info',
      category: 'Medication Adherence',
      message: 'Missed 3 consecutive doses of Metformin',
      time: '1 day ago',
      icon: Clock,
      action: 'Patient education needed',
      recommendation: 'Caregiver notification, pill organizer'
    }
  ];

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-health-critical/10 text-health-critical border-health-critical';
      case 'urgent': return 'bg-health-warning/10 text-health-warning border-health-warning';
      case 'warning': return 'bg-health-caution/10 text-health-caution border-health-caution';
      case 'info': return 'bg-primary/10 text-primary border-primary';
      default: return 'bg-muted/10 text-muted-foreground border-muted';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-5 w-5 text-health-critical" />;
      case 'urgent': return <AlertTriangle className="h-5 w-5 text-health-warning" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-health-caution" />;
      default: return <Clock className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-accessible-lg">Clinical Alerts</CardTitle>
            <CardDescription className="text-accessible-base">
              Real-time patient alerts requiring clinical attention
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-health-warning border-health-warning">
            {alerts.filter(a => a.type === 'critical' || a.type === 'urgent').length} Urgent
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert) => {
          const IconComponent = alert.icon;
          return (
            <div key={alert.id} className={`border rounded-lg p-4 space-y-3 ${alert.type === 'critical' ? 'border-health-critical/50 bg-health-critical/5' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="flex items-center space-x-1">
                    {getAlertIcon(alert.type)}
                    <IconComponent className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-accessible-base font-medium">{alert.patient}</h4>
                      <Badge variant="outline" className={getAlertColor(alert.type)}>
                        {alert.category}
                      </Badge>
                    </div>
                    <p className="text-accessible-sm text-muted-foreground mb-2">{alert.message}</p>
                    <p className="text-accessible-sm font-medium text-secondary">{alert.action}</p>
                  </div>
                </div>
                <span className="text-accessible-xs text-muted-foreground">{alert.time}</span>
              </div>
              
              <div className="bg-muted/30 p-3 rounded text-accessible-sm">
                <strong className="text-secondary">Recommendation:</strong> {alert.recommendation}
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm">
                  Acknowledge
                </Button>
                <Button size="sm" className={alert.type === 'critical' ? 'bg-health-critical hover:bg-health-critical/90' : ''}>
                  Take Action
                </Button>
              </div>
            </div>
          );
        })}
        
        <div className="mt-6 p-4 bg-primary/5 rounded-lg">
          <h5 className="text-accessible-base font-medium text-primary mb-2">🤖 AI Insights</h5>
          <div className="space-y-2 text-accessible-sm">
            <p>• 3 patients showing early signs of medication non-adherence</p>
            <p>• Blood pressure trends suggest seasonal pattern in CVD patients</p>
            <p>• Consider telemedicine follow-ups for stable diabetes patients</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};