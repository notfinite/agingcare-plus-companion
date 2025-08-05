import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff, Settings, Monitor } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TelehealthSession {
  id: string;
  patient_name: string;
  appointment_time: string;
  status: 'scheduled' | 'waiting' | 'in_progress' | 'completed';
  duration?: number;
  session_link?: string;
}

// Mock data for provider dashboard
const mockSessions: TelehealthSession[] = [
  {
    id: '1',
    patient_name: 'Margaret Johnson',
    appointment_time: '14:30',
    status: 'waiting',
    session_link: 'https://telehealth.example.com/room/123'
  },
  {
    id: '2',
    patient_name: 'Robert Chen',
    appointment_time: '15:00',
    status: 'scheduled',
    session_link: 'https://telehealth.example.com/room/124'
  },
  {
    id: '3',
    patient_name: 'Eleanor Rodriguez',
    appointment_time: '15:30',
    status: 'scheduled',
    session_link: 'https://telehealth.example.com/room/125'
  }
];

export const TelehealthWidget = () => {
  const [sessions] = useState<TelehealthSession[]>(mockSessions);
  const [activeCall, setActiveCall] = useState<TelehealthSession | null>(null);
  const [callControls, setCallControls] = useState({
    video: true,
    audio: true,
    screen: false
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'bg-health-caution text-white animate-pulse';
      case 'in_progress':
        return 'bg-health-excellent text-white';
      case 'scheduled':
        return 'bg-primary text-primary-foreground';
      case 'completed':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const startCall = (session: TelehealthSession) => {
    setActiveCall(session);
    // In a real implementation, this would initialize the video call
  };

  const endCall = () => {
    setActiveCall(null);
    setCallControls({ video: true, audio: true, screen: false });
  };

  const toggleVideo = () => {
    setCallControls(prev => ({ ...prev, video: !prev.video }));
  };

  const toggleAudio = () => {
    setCallControls(prev => ({ ...prev, audio: !prev.audio }));
  };

  const toggleScreenShare = () => {
    setCallControls(prev => ({ ...prev, screen: !prev.screen }));
  };

  const isCallTime = (appointmentTime: string) => {
    const now = new Date();
    const [hours, minutes] = appointmentTime.split(':').map(Number);
    const appointmentDateTime = new Date();
    appointmentDateTime.setHours(hours, minutes, 0, 0);
    
    const timeDiff = Math.abs(now.getTime() - appointmentDateTime.getTime());
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));
    
    return minutesDiff <= 15; // Can join 15 minutes before or after
  };

  if (activeCall) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-accessible-lg flex items-center justify-between">
            <span>Telehealth Session</span>
            <Badge className="bg-health-excellent text-white">
              Live
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Video Area */}
            <div className="bg-muted rounded-lg aspect-video flex items-center justify-center relative">
              <div className="text-center">
                <Video className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-accessible-lg font-medium">{activeCall.patient_name}</p>
                <p className="text-accessible-sm text-muted-foreground">
                  Video call in progress
                </p>
              </div>
              
              {/* Self video preview */}
              <div className="absolute bottom-4 right-4 w-32 h-24 bg-card border rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 bg-primary rounded-full mx-auto mb-1"></div>
                  <p className="text-xs">You</p>
                </div>
              </div>
            </div>

            {/* Call Controls */}
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant={callControls.video ? "default" : "destructive"}
                size="lg"
                onClick={toggleVideo}
                className="rounded-full h-12 w-12"
              >
                {callControls.video ? 
                  <Video className="h-6 w-6" /> : 
                  <VideoOff className="h-6 w-6" />
                }
              </Button>
              
              <Button
                variant={callControls.audio ? "default" : "destructive"}
                size="lg"
                onClick={toggleAudio}
                className="rounded-full h-12 w-12"
              >
                {callControls.audio ? 
                  <Mic className="h-6 w-6" /> : 
                  <MicOff className="h-6 w-6" />
                }
              </Button>
              
              <Button
                variant={callControls.screen ? "secondary" : "outline"}
                size="lg"
                onClick={toggleScreenShare}
                className="rounded-full h-12 w-12"
              >
                <Monitor className="h-6 w-6" />
              </Button>
              
              <Button
                variant="ghost"
                size="lg"
                className="rounded-full h-12 w-12"
              >
                <Settings className="h-6 w-6" />
              </Button>
              
              <Button
                variant="destructive"
                size="lg"
                onClick={endCall}
                className="rounded-full h-12 w-12"
              >
                <PhoneOff className="h-6 w-6" />
              </Button>
            </div>

            {/* Session Info */}
            <div className="text-center text-accessible-sm text-muted-foreground">
              Session started at {activeCall.appointment_time}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-accessible-lg">Telehealth Sessions</CardTitle>
        <CardDescription className="text-accessible-base">
          Upcoming virtual appointments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.length === 0 ? (
            <p className="text-accessible-base text-muted-foreground text-center py-8">
              No telehealth sessions scheduled for today.
            </p>
          ) : (
            sessions.map((session) => (
              <div key={session.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground font-medium">
                        {session.patient_name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-accessible-base font-medium">
                        {session.patient_name}
                      </h4>
                      <p className="text-accessible-sm text-muted-foreground">
                        Scheduled for {session.appointment_time}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(session.status)}>
                      {session.status === 'waiting' ? 'Patient Waiting' : session.status}
                    </Badge>
                    
                    <Button
                      onClick={() => startCall(session)}
                      disabled={!isCallTime(session.appointment_time) && session.status !== 'waiting'}
                      className={session.status === 'waiting' ? 'bg-health-excellent hover:bg-health-good animate-pulse' : ''}
                    >
                      <Video className="mr-2 h-4 w-4" />
                      {session.status === 'waiting' ? 'Join Now' : 'Start Call'}
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="mt-6 pt-6 border-t">
          <div className="text-center">
            <h4 className="text-accessible-base font-medium mb-2">Quick Actions</h4>
            <div className="flex justify-center space-x-4">
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Test Camera
              </Button>
              <Button variant="outline">
                <Monitor className="mr-2 h-4 w-4" />
                Test Audio
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};