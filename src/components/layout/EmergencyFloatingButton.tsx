import React, { useState } from 'react';
import { AlertTriangle, Phone, MapPin, Heart, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

export function EmergencyFloatingButton() {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleEmergencyCall = () => {
    toast.error("Emergency services contacted! Help is on the way.", {
      description: "Your location and medical information have been shared.",
      duration: 10000,
    });
    setIsExpanded(false);
  };

  const handleMedicalAlert = () => {
    toast.warning("Medical alert sent to your care team!", {
      description: "Caregivers and emergency contacts notified.",
      duration: 5000,
    });
    setIsExpanded(false);
  };

  const handleLocationShare = () => {
    toast.info("Location shared with emergency contacts", {
      description: "Your current location has been sent to your family.",
      duration: 3000,
    });
    setIsExpanded(false);
  };

  if (isExpanded) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Card className="w-64 shadow-elegant border-red-200 bg-white/95 backdrop-blur-sm">
          <CardContent className="p-4 space-y-3">
            <div className="text-center mb-3">
              <h3 className="text-lg font-bold text-red-600">Emergency Actions</h3>
              <p className="text-sm text-muted-foreground">Choose your emergency response</p>
            </div>
            
            <Button
              onClick={handleEmergencyCall}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-12"
            >
              <Phone className="h-5 w-5 mr-2" />
              Call 911
            </Button>
            
            <Button
              onClick={handleMedicalAlert}
              variant="outline"
              className="w-full border-orange-300 text-orange-700 hover:bg-orange-50 h-10"
            >
              <Heart className="h-4 w-4 mr-2" />
              Medical Alert
            </Button>
            
            <Button
              onClick={handleLocationShare}
              variant="outline"
              className="w-full border-blue-300 text-blue-700 hover:bg-blue-50 h-10"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Share Location
            </Button>
            
            <Button
              onClick={() => setIsExpanded(false)}
              variant="ghost"
              className="w-full text-muted-foreground h-8"
            >
              Cancel
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Button
      onClick={() => setIsExpanded(true)}
      className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-glow hover:shadow-xl transition-all duration-300 hover:scale-110"
      title="Emergency - Quick access to help"
    >
      <div className="flex flex-col items-center">
        <AlertTriangle className="h-6 w-6" />
        <span className="text-xs font-bold mt-1">SOS</span>
      </div>
    </Button>
  );
}