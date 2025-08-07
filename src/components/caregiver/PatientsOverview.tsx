import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Activity,
  Phone,
  MessageCircle,
  Target,
  Zap,
  Award,
  Calendar
} from 'lucide-react';

export const PatientsOverview = () => {
  const patients = [
    {
      id: 1,
      name: 'Mom (Eleanor)',
      condition: 'Diabetes + Hypertension',
      status: 'stable',
      lastReading: '2 hours ago',
      bp: '118/76',
      glucose: '142 mg/dL',
      medication: 'On track',
      riskLevel: 'low'
    },
    {
      id: 2,
      name: 'Dad (Robert)',
      condition: 'Heart Disease',
      status: 'attention',
      lastReading: '45 minutes ago',
      bp: '165/95',
      heartRate: '89 BPM',
      medication: 'Missed evening dose',
      riskLevel: 'medium'
    },
    {
      id: 3,
      name: 'Aunt Mary',
      condition: 'COPD + Arthritis',
      status: 'excellent',
      lastReading: '1 hour ago',
      oxygen: '96%',
      activity: '5,200 steps today',
      medication: 'All doses taken',
      riskLevel: 'low'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-health-excellent border-health-excellent';
      case 'stable': return 'text-health-good border-health-good';
      case 'attention': return 'text-health-warning border-health-warning';
      default: return 'text-muted-foreground border-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="h-4 w-4" />;
      case 'stable': return <Heart className="h-4 w-4" />;
      case 'attention': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-accessible-lg">Your Care Recipients</CardTitle>
        <CardDescription className="text-accessible-base">
          Real-time health status and medication compliance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {patients.map((patient) => (
          <div key={patient.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {patient.name.split('(')[1]?.charAt(0) || patient.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-accessible-base font-medium">{patient.name}</h4>
                  <p className="text-accessible-sm text-muted-foreground">{patient.condition}</p>
                </div>
              </div>
              <div className={`flex items-center space-x-1 ${getStatusColor(patient.status)}`}>
                {getStatusIcon(patient.status)}
                <Badge variant="outline" className={getStatusColor(patient.status)}>
                  {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-accessible-sm">
              <div>
                <span className="text-muted-foreground">Latest Vitals:</span>
                <p className="font-medium">
                  {patient.bp && `BP: ${patient.bp}`}
                  {patient.glucose && `Blood Sugar: ${patient.glucose}`}
                  {patient.heartRate && `HR: ${patient.heartRate}`}
                  {patient.oxygen && `O2: ${patient.oxygen}`}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Medications:</span>
                <p className={`font-medium ${patient.medication.includes('Missed') ? 'text-health-warning' : 'text-health-good'}`}>
                  {patient.medication}
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-accessible-xs text-muted-foreground">
              <span>Last update: {patient.lastReading}</span>
              {patient.activity && <span>{patient.activity}</span>}
            </div>
          </div>
        ))}
        
        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button variant="outline" className="flex items-center gap-2 h-12">
            <Phone className="h-4 w-4" />
            Emergency Call
          </Button>
          <Button variant="outline" className="flex items-center gap-2 h-12">
            <MessageCircle className="h-4 w-4" />
            Send Reminder
          </Button>
        </div>

        {/* Care Impact Insights */}
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-gradient-to-r from-health-excellent/10 to-health-good/10 rounded-lg border border-health-excellent/20">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-health-excellent/20 rounded-lg">
                <Target className="h-5 w-5 text-health-excellent" />
              </div>
              <div className="flex-1">
                <h5 className="text-accessible-base font-medium text-health-excellent mb-1">🎯 Impact This Week</h5>
                <p className="text-accessible-sm text-muted-foreground mb-3">
                  Prevented 2 emergencies • Improved medication adherence by 15%
                </p>
                <div className="flex items-center gap-4 text-accessible-xs">
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3 text-health-warning" />
                    <span>3 Early Interventions</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="h-3 w-3 text-primary" />
                    <span>Care Excellence Score: 94%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h5 className="text-accessible-base font-medium text-primary mb-1">📋 Upcoming Tasks</h5>
                <div className="space-y-2 text-accessible-sm">
                  <div className="flex items-center justify-between">
                    <span>Mom's BP check (2:00 PM)</span>
                    <Badge variant="outline" className="text-xs">Today</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Dad's cardiology appointment</span>
                    <Badge variant="outline" className="text-xs">Tomorrow</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Aunt Mary's medication refill</span>
                    <Badge variant="outline" className="text-xs">Friday</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};