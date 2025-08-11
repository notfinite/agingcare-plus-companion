import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Pill, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Camera, 
  Bell,
  Calendar,
  TrendingUp
} from 'lucide-react';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  nextDose: Date;
  adherenceRate: number;
  importance: 'critical' | 'high' | 'medium' | 'low';
  instructions: string;
  color: string;
  shape: string;
}

interface DoseRecord {
  id: string;
  medicationId: string;
  scheduledTime: Date;
  takenTime?: Date;
  status: 'taken' | 'missed' | 'pending';
  photoVerified?: boolean;
}

export const SmartMedicationReminder: React.FC = () => {
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      nextDose: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      adherenceRate: 94,
      importance: 'critical',
      instructions: 'Take with water, preferably in the morning',
      color: 'White',
      shape: 'Round tablet'
    },
    {
      id: '2',
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      nextDose: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
      adherenceRate: 89,
      importance: 'high',
      instructions: 'Take with meals to reduce stomach upset',
      color: 'Blue',
      shape: 'Oval tablet'
    },
    {
      id: '3',
      name: 'Vitamin D3',
      dosage: '1000 IU',
      frequency: 'Once daily',
      nextDose: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
      adherenceRate: 76,
      importance: 'medium',
      instructions: 'Take with fat-containing meal for better absorption',
      color: 'Yellow',
      shape: 'Soft gel capsule'
    }
  ]);

  const [currentTime, setCurrentTime] = useState(new Date());
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTimeUntilDose = (nextDose: Date) => {
    const diff = nextDose.getTime() - currentTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diff < 0) {
      return 'Overdue';
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const isDoseNow = (nextDose: Date) => {
    const diff = Math.abs(nextDose.getTime() - currentTime.getTime());
    return diff <= 15 * 60 * 1000; // Within 15 minutes
  };

  const markAsTaken = (medicationId: string, withPhoto = false) => {
    setMedications(meds => 
      meds.map(med => 
        med.id === medicationId 
          ? { ...med, nextDose: getNextDoseTime(med) }
          : med
      )
    );

    toast({
      title: "Medication Taken",
      description: withPhoto 
        ? "Photo verification recorded successfully"
        : "Marked as taken. Consider using photo verification for better tracking.",
    });
  };

  const getNextDoseTime = (med: Medication) => {
    const next = new Date(med.nextDose);
    if (med.frequency.includes('Once')) {
      next.setDate(next.getDate() + 1);
    } else if (med.frequency.includes('Twice')) {
      next.setHours(next.getHours() + 12);
    } else if (med.frequency.includes('Three')) {
      next.setHours(next.getHours() + 8);
    }
    return next;
  };

  const takePhotoVerification = (medicationId: string) => {
    // Simulate photo capture
    setTimeout(() => {
      markAsTaken(medicationId, true);
    }, 1000);
  };

  const snoozeReminder = (medicationId: string, minutes: number) => {
    setMedications(meds => 
      meds.map(med => 
        med.id === medicationId 
          ? { ...med, nextDose: new Date(med.nextDose.getTime() + minutes * 60 * 1000) }
          : med
      )
    );

    toast({
      title: "Reminder Snoozed",
      description: `Reminder delayed by ${minutes} minutes`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill className="h-6 w-6 text-primary" />
          Smart Medication Reminders
          <Badge variant="outline" className="ml-auto">
            <TrendingUp className="h-3 w-3 mr-1" />
            91% Adherence
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {medications.map((medication) => {
          const timeUntil = getTimeUntilDose(medication.nextDose);
          const isNow = isDoseNow(medication.nextDose);
          
          return (
            <Card 
              key={medication.id} 
              className={`border-2 transition-all ${
                isNow ? 'border-primary shadow-lg animate-pulse' : 'border-border'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{medication.name}</h4>
                      <Badge 
                        variant="outline" 
                        className={getImportanceColor(medication.importance)}
                      >
                        {medication.importance}
                      </Badge>
                      {isNow && (
                        <Badge variant="default" className="animate-pulse">
                          <Bell className="h-3 w-3 mr-1" />
                          Time to Take!
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p><strong>Dosage:</strong> {medication.dosage}</p>
                      <p><strong>Frequency:</strong> {medication.frequency}</p>
                      <p><strong>Description:</strong> {medication.color} {medication.shape}</p>
                      <p><strong>Instructions:</strong> {medication.instructions}</p>
                    </div>

                    {/* Adherence Progress */}
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Adherence Rate</span>
                        <span>{medication.adherenceRate}%</span>
                      </div>
                      <Progress 
                        value={medication.adherenceRate} 
                        className="h-2"
                      />
                    </div>
                  </div>

                  <div className="ml-4 text-right space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4" />
                      <span className={timeUntil === 'Overdue' ? 'text-red-600 font-semibold' : ''}>
                        {timeUntil === 'Overdue' ? 'OVERDUE' : `In ${timeUntil}`}
                      </span>
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      {medication.nextDose.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>

                    {(isNow || timeUntil === 'Overdue') && (
                      <div className="space-y-2">
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => takePhotoVerification(medication.id)}
                            className="flex-1"
                          >
                            <Camera className="h-3 w-3 mr-1" />
                            Photo
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => markAsTaken(medication.id)}
                            className="flex-1"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Taken
                          </Button>
                        </div>
                        
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => snoozeReminder(medication.id, 15)}
                            className="flex-1 text-xs"
                          >
                            15m
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => snoozeReminder(medication.id, 30)}
                            className="flex-1 text-xs"
                          >
                            30m
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Weekly Overview */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold mb-1">This Week's Summary</h4>
                <p className="text-sm text-muted-foreground">
                  31 of 34 doses taken on time • 3 missed doses
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                View Calendar
              </Button>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};