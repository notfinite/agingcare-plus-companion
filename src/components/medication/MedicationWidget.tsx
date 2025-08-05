import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Pill, Clock, Plus, Check, X, AlertCircle } from 'lucide-react';
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

interface MedicationSchedule {
  id: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  times_per_day: number;
  schedule_times: string[];
  instructions?: string;
  is_active: boolean;
}

interface MedicationLog {
  id: string;
  medication_schedule_id: string;
  scheduled_time: string;
  taken_at?: string;
  status: 'pending' | 'taken' | 'missed' | 'skipped';
  notes?: string;
}

export const MedicationWidget = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<MedicationSchedule[]>([]);
  const [todayLogs, setTodayLogs] = useState<MedicationLog[]>([]);
  const [isAddingMedication, setIsAddingMedication] = useState(false);
  const [newMedication, setNewMedication] = useState({
    medication_name: '',
    dosage: '',
    frequency: 'daily',
    times_per_day: 1,
    schedule_times: ['08:00'],
    instructions: ''
  });

  useEffect(() => {
    if (profile) {
      fetchMedicationData();
    }
  }, [profile]);

  const fetchMedicationData = async () => {
    try {
      // Fetch medication schedules
      const { data: schedulesData, error: schedulesError } = await supabase
        .from('medication_schedules')
        .select('*')
        .eq('patient_id', profile?.id)
        .eq('is_active', true);

      if (schedulesError) throw schedulesError;
      setSchedules(schedulesData || []);

      // Fetch today's medication logs
      const today = new Date().toISOString().split('T')[0];
      const { data: logsData, error: logsError } = await supabase
        .from('medication_logs')
        .select('*')
        .eq('patient_id', profile?.id)
        .gte('scheduled_time', today)
        .lt('scheduled_time', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      if (logsError) throw logsError;
      setTodayLogs((logsData as MedicationLog[]) || []);
    } catch (error) {
      console.error('Error fetching medication data:', error);
    }
  };

  const addMedicationSchedule = async () => {
    if (!profile || !newMedication.medication_name) return;

    try {
      const { error } = await supabase
        .from('medication_schedules')
        .insert({
          patient_id: profile.id,
          medication_name: newMedication.medication_name,
          dosage: newMedication.dosage,
          frequency: newMedication.frequency,
          times_per_day: newMedication.times_per_day,
          schedule_times: newMedication.schedule_times,
          instructions: newMedication.instructions || null,
          start_date: new Date().toISOString().split('T')[0],
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "Medication added",
        description: "Your medication schedule has been created.",
      });

      setNewMedication({
        medication_name: '',
        dosage: '',
        frequency: 'daily',
        times_per_day: 1,
        schedule_times: ['08:00'],
        instructions: ''
      });
      setIsAddingMedication(false);
      fetchMedicationData();
    } catch (error) {
      toast({
        title: "Error adding medication",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const markMedicationTaken = async (scheduleId: string, scheduledTime: string) => {
    try {
      const { error } = await supabase
        .from('medication_logs')
        .insert({
          patient_id: profile?.id,
          medication_schedule_id: scheduleId,
          scheduled_time: scheduledTime,
          taken_at: new Date().toISOString(),
          status: 'taken'
        });

      if (error) throw error;

      toast({
        title: "Medication taken",
        description: "Great job staying on track with your medication!",
      });

      fetchMedicationData();
    } catch (error) {
      toast({
        title: "Error logging medication",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const getTodayMedicationTimes = () => {
    const today = new Date();
    const medicationTimes: Array<{
      schedule: MedicationSchedule;
      time: string;
      status: 'pending' | 'taken' | 'missed' | 'upcoming';
    }> = [];

    schedules.forEach(schedule => {
      schedule.schedule_times.forEach(time => {
        const [hour, minute] = time.split(':').map(Number);
        const scheduledDateTime = new Date(today);
        scheduledDateTime.setHours(hour, minute, 0, 0);

        const log = todayLogs.find(
          log => log.medication_schedule_id === schedule.id && 
          log.scheduled_time.includes(time)
        );

        let status: 'pending' | 'taken' | 'missed' | 'upcoming' = 'upcoming';
        if (log) {
          status = log.status as 'taken' | 'missed';
        } else if (scheduledDateTime < new Date()) {
          status = 'pending';
        }

        medicationTimes.push({
          schedule,
          time,
          status
        });
      });
    });

    return medicationTimes.sort((a, b) => a.time.localeCompare(b.time));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-accessible-lg">Medications</CardTitle>
            <CardDescription className="text-accessible-base">
              Manage your medication schedule and track compliance
            </CardDescription>
          </div>
          <Dialog open={isAddingMedication} onOpenChange={setIsAddingMedication}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Add Medication
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-accessible-xl">Add Medication</DialogTitle>
                <DialogDescription className="text-accessible-base">
                  Set up a new medication schedule
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="medication_name" className="text-accessible-lg">Medication Name</Label>
                  <Input
                    id="medication_name"
                    value={newMedication.medication_name}
                    onChange={(e) => setNewMedication({...newMedication, medication_name: e.target.value})}
                    placeholder="e.g., Lisinopril"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dosage" className="text-accessible-lg">Dosage</Label>
                  <Input
                    id="dosage"
                    value={newMedication.dosage}
                    onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                    placeholder="e.g., 10mg"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequency" className="text-accessible-lg">Frequency</Label>
                  <Select value={newMedication.frequency} onValueChange={(value) => setNewMedication({...newMedication, frequency: value})}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="twice_daily">Twice Daily</SelectItem>
                      <SelectItem value="three_times_daily">Three Times Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time" className="text-accessible-lg">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newMedication.schedule_times[0]}
                    onChange={(e) => setNewMedication({...newMedication, schedule_times: [e.target.value]})}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions" className="text-accessible-lg">Instructions (Optional)</Label>
                  <Input
                    id="instructions"
                    value={newMedication.instructions}
                    onChange={(e) => setNewMedication({...newMedication, instructions: e.target.value})}
                    placeholder="e.g., Take with food"
                    className="h-12"
                  />
                </div>

                <Button onClick={addMedicationSchedule} className="w-full" size="lg">
                  Add Medication
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {getTodayMedicationTimes().length === 0 ? (
            <p className="text-accessible-base text-muted-foreground text-center py-8">
              No medications scheduled. Add your first medication to get started!
            </p>
          ) : (
            getTodayMedicationTimes().map((item, index) => (
              <div key={`${item.schedule.id}-${item.time}`} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Pill className="h-6 w-6 text-primary" />
                    {item.status === 'taken' && (
                      <Check className="h-4 w-4 text-health-excellent absolute -top-1 -right-1 bg-background rounded-full" />
                    )}
                    {item.status === 'pending' && (
                      <AlertCircle className="h-4 w-4 text-health-warning absolute -top-1 -right-1 bg-background rounded-full" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-accessible-base font-medium">
                      {item.schedule.medication_name} - {item.schedule.dosage}
                    </h4>
                    <p className="text-accessible-sm text-muted-foreground">
                      {item.time} • {item.schedule.instructions}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {item.status === 'pending' && (
                    <Button
                      onClick={() => markMedicationTaken(item.schedule.id, item.time)}
                      size="sm"
                      className="bg-health-excellent hover:bg-health-good"
                    >
                      <Check className="mr-1 h-4 w-4" />
                      Take
                    </Button>
                  )}
                  {item.status === 'taken' && (
                    <span className="text-accessible-sm text-health-excellent font-medium">✓ Taken</span>
                  )}
                  {item.status === 'upcoming' && (
                    <span className="text-accessible-sm text-muted-foreground">Upcoming</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};