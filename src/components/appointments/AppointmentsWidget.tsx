import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Video, MapPin, Clock, Plus, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Appointment {
  id: string;
  provider_name: string;
  appointment_type: 'in_person' | 'telehealth' | 'phone';
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  location?: string;
  telehealth_link?: string;
  notes?: string;
}

// Mock data - would come from Supabase in real implementation
const mockAppointments: Appointment[] = [
  {
    id: '1',
    provider_name: 'Dr. Sarah Johnson',
    appointment_type: 'telehealth',
    date: new Date().toISOString().split('T')[0],
    time: '14:30',
    duration: 30,
    status: 'confirmed',
    telehealth_link: 'https://telehealth.example.com/room/123',
    notes: 'Regular check-up and medication review'
  },
  {
    id: '2',
    provider_name: 'Dr. Michael Chen',
    appointment_type: 'in_person',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '10:00',
    duration: 45,
    status: 'scheduled',
    location: 'Cardiology Clinic, 123 Health St, Suite 200',
    notes: 'Cardiology consultation'
  },
  {
    id: '3',
    provider_name: 'Dr. Emily Rodriguez',
    appointment_type: 'phone',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '16:00',
    duration: 15,
    status: 'scheduled',
    notes: 'Lab results discussion'
  }
];

export const AppointmentsWidget = () => {
  const [appointments] = useState<Appointment[]>(mockAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const getAppointmentIcon = (type: string) => {
    switch (type) {
      case 'telehealth':
        return <Video className="h-5 w-5 text-primary" />;
      case 'phone':
        return <Phone className="h-5 w-5 text-secondary" />;
      case 'in_person':
        return <MapPin className="h-5 w-5 text-health-good" />;
      default:
        return <Calendar className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-health-excellent text-white';
      case 'scheduled':
        return 'bg-health-caution text-white';
      case 'completed':
        return 'bg-muted text-muted-foreground';
      case 'cancelled':
        return 'bg-health-critical text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const joinTelehealth = (appointment: Appointment) => {
    if (appointment.telehealth_link) {
      window.open(appointment.telehealth_link, '_blank');
    }
  };

  const isAppointmentSoon = (appointment: Appointment) => {
    const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
    const now = new Date();
    const timeDiff = appointmentDateTime.getTime() - now.getTime();
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));
    
    return minutesDiff <= 15 && minutesDiff >= -15; // 15 minutes before or after
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-accessible-lg">Upcoming Appointments</CardTitle>
            <CardDescription className="text-accessible-base">
              Your scheduled healthcare appointments
            </CardDescription>
          </div>
          <Button size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Schedule
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <p className="text-accessible-base text-muted-foreground text-center py-8">
              No upcoming appointments scheduled.
            </p>
          ) : (
            appointments.map((appointment) => (
              <div key={appointment.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getAppointmentIcon(appointment.appointment_type)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-accessible-base font-medium">
                          {appointment.provider_name}
                        </h4>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-accessible-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {formatDate(appointment.date)} at {appointment.time}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{appointment.duration} minutes</span>
                        </div>
                        
                        {appointment.appointment_type === 'in_person' && appointment.location && (
                          <div className="flex items-start space-x-2">
                            <MapPin className="h-4 w-4 mt-0.5" />
                            <span>{appointment.location}</span>
                          </div>
                        )}
                        
                        {appointment.notes && (
                          <p className="text-accessible-sm">{appointment.notes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-4">
                    {appointment.appointment_type === 'telehealth' && (
                      <Button
                        onClick={() => joinTelehealth(appointment)}
                        disabled={!isAppointmentSoon(appointment)}
                        className={isAppointmentSoon(appointment) ? 'bg-health-excellent hover:bg-health-good' : ''}
                      >
                        <Video className="mr-2 h-4 w-4" />
                        {isAppointmentSoon(appointment) ? 'Join Now' : 'Join Call'}
                      </Button>
                    )}
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          onClick={() => setSelectedAppointment(appointment)}
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="text-accessible-xl">
                            Appointment Details
                          </DialogTitle>
                          <DialogDescription className="text-accessible-base">
                            {selectedAppointment?.provider_name}
                          </DialogDescription>
                        </DialogHeader>
                        
                        {selectedAppointment && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-accessible-base font-medium">Date & Time</Label>
                                <p className="text-accessible-sm">
                                  {formatDate(selectedAppointment.date)} at {selectedAppointment.time}
                                </p>
                              </div>
                              <div>
                                <Label className="text-accessible-base font-medium">Duration</Label>
                                <p className="text-accessible-sm">{selectedAppointment.duration} minutes</p>
                              </div>
                              <div>
                                <Label className="text-accessible-base font-medium">Type</Label>
                                <p className="text-accessible-sm capitalize">
                                  {selectedAppointment.appointment_type.replace('_', ' ')}
                                </p>
                              </div>
                              <div>
                                <Label className="text-accessible-base font-medium">Status</Label>
                                <Badge className={getStatusColor(selectedAppointment.status)}>
                                  {selectedAppointment.status}
                                </Badge>
                              </div>
                            </div>
                            
                            {selectedAppointment.location && (
                              <div>
                                <Label className="text-accessible-base font-medium">Location</Label>
                                <p className="text-accessible-sm">{selectedAppointment.location}</p>
                              </div>
                            )}
                            
                            {selectedAppointment.notes && (
                              <div>
                                <Label className="text-accessible-base font-medium">Notes</Label>
                                <p className="text-accessible-sm">{selectedAppointment.notes}</p>
                              </div>
                            )}
                            
                            <div className="flex space-x-2 pt-4">
                              <Button variant="outline" className="flex-1">
                                Reschedule
                              </Button>
                              <Button variant="destructive" className="flex-1">
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Label component for the dialog
const Label: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return <div className={`font-medium ${className}`}>{children}</div>;
};