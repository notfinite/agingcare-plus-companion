import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Heart, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

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
        
        <div className="mt-4 p-4 bg-primary/5 rounded-lg">
          <h5 className="text-accessible-base font-medium text-primary mb-2">🎯 Your Care Impact</h5>
          <p className="text-accessible-sm text-muted-foreground">
            This week you've helped prevent 2 potential emergencies and improved medication adherence by 15%. Your dedication is making a real difference in their health outcomes!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};