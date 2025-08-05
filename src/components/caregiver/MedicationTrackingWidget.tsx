import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, Clock, Pill } from 'lucide-react';

export const MedicationTrackingWidget = () => {
  const medicationData = [
    {
      patient: 'Mom (Eleanor)',
      medications: [
        { name: 'Metformin 500mg', time: '8:00 AM', status: 'taken', nextDue: null },
        { name: 'Lisinopril 10mg', time: '8:00 AM', status: 'taken', nextDue: null },
        { name: 'Metformin 500mg', time: '2:00 PM', status: 'due-soon', nextDue: '15 minutes' },
        { name: 'Insulin (Lantus)', time: '9:00 PM', status: 'upcoming', nextDue: '7 hours' }
      ],
      adherence: 96
    },
    {
      patient: 'Dad (Robert)',
      medications: [
        { name: 'Atorvastatin 20mg', time: '7:00 PM', status: 'missed', nextDue: null },
        { name: 'Carvedilol 6.25mg', time: '8:00 AM', status: 'taken', nextDue: null },
        { name: 'Aspirin 81mg', time: '8:00 AM', status: 'taken', nextDue: null }
      ],
      adherence: 87
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'taken': return <CheckCircle className="h-4 w-4 text-health-excellent" />;
      case 'missed': return <AlertTriangle className="h-4 w-4 text-health-critical" />;
      case 'due-soon': return <Clock className="h-4 w-4 text-health-warning" />;
      default: return <Pill className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'taken': return 'bg-health-excellent/10 text-health-excellent border-health-excellent';
      case 'missed': return 'bg-health-critical/10 text-health-critical border-health-critical';
      case 'due-soon': return 'bg-health-warning/10 text-health-warning border-health-warning';
      default: return 'bg-muted/10 text-muted-foreground border-muted';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-accessible-lg">Medication Tracking</CardTitle>
        <CardDescription className="text-accessible-base">
          Monitor medication compliance across all care recipients
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {medicationData.map((patient, index) => (
          <div key={index} className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-accessible-base font-medium">{patient.patient}</h4>
              <div className="flex items-center space-x-2">
                <span className="text-accessible-sm text-muted-foreground">Adherence:</span>
                <Badge variant="outline" className={patient.adherence >= 90 ? 'text-health-excellent border-health-excellent' : 'text-health-warning border-health-warning'}>
                  {patient.adherence}%
                </Badge>
              </div>
            </div>
            
            <Progress value={patient.adherence} className="h-2" />
            
            <div className="space-y-2">
              {patient.medications.map((med, medIndex) => (
                <div key={medIndex} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(med.status)}
                    <div>
                      <p className="text-accessible-sm font-medium">{med.name}</p>
                      <p className="text-accessible-xs text-muted-foreground">Scheduled: {med.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className={getStatusColor(med.status)}>
                      {med.status === 'taken' && 'Taken'}
                      {med.status === 'missed' && 'Missed'}
                      {med.status === 'due-soon' && `Due in ${med.nextDue}`}
                      {med.status === 'upcoming' && `In ${med.nextDue}`}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div className="mt-6 p-4 bg-secondary/5 rounded-lg">
          <h5 className="text-accessible-base font-medium text-secondary mb-2">💡 Smart Recommendations</h5>
          <div className="space-y-2 text-accessible-sm">
            <p>• Set evening medication reminder for Dad's Atorvastatin</p>
            <p>• Mom's diabetes control is excellent - share this progress with her doctor</p>
            <p>• Consider weekly pill organizers to reduce missed doses</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};