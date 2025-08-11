import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Phone, MapPin, Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  accuracy?: number;
}

export const EnhancedEmergencyButton = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [emergencyStep, setEmergencyStep] = useState<'confirm' | 'location' | 'dispatching' | 'active'>('confirm');
  const { toast } = useToast();

  const getCurrentLocation = (): Promise<LocationData> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          
          try {
            // In a real app, you would use a reverse geocoding service
            // For demo, we'll simulate getting an address
            const mockAddress = "1234 Main St, Anytown, ST 12345";
            
            const locationData: LocationData = {
              latitude,
              longitude,
              accuracy,
              address: mockAddress
            };
            
            setLocation(locationData);
            setLocationLoading(false);
            resolve(locationData);
          } catch (error) {
            setLocationLoading(false);
            reject(error);
          }
        },
        (error) => {
          setLocationLoading(false);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  };

  const handleEmergencyClick = () => {
    setShowConfirm(true);
    setEmergencyStep('confirm');
  };

  const confirmEmergency = async () => {
    setEmergencyStep('location');
    
    try {
      await getCurrentLocation();
      setEmergencyStep('dispatching');
      
      // Simulate emergency dispatch process
      setTimeout(() => {
        setEmergencyStep('active');
        setEmergencyActive(true);
        
        toast({
          title: "Emergency Services Contacted",
          description: "Emergency responders have been dispatched to your location. Stay on the line.",
          variant: "destructive",
        });
        
        // Auto-end emergency mode after 2 minutes for demo
        setTimeout(() => {
          setEmergencyActive(false);
          setShowConfirm(false);
          setEmergencyStep('confirm');
          setLocation(null);
        }, 120000);
      }, 3000);
      
    } catch (error) {
      toast({
        title: "Location Error",
        description: "Unable to get your location. Emergency services will still be contacted.",
        variant: "destructive",
      });
      
      setEmergencyStep('dispatching');
      setTimeout(() => {
        setEmergencyStep('active');
        setEmergencyActive(true);
      }, 2000);
    }
  };

  const cancelEmergency = () => {
    setShowConfirm(false);
    setEmergencyStep('confirm');
    setLocation(null);
    setLocationLoading(false);
  };

  const renderDialogContent = () => {
    switch (emergencyStep) {
      case 'confirm':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="text-accessible-xl text-center text-destructive">
                Confirm Emergency Alert
              </DialogTitle>
              <DialogDescription className="text-accessible-base text-center">
                This will immediately contact emergency services and notify your emergency contacts.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 pt-4">
              <Card className="border-destructive/20 bg-destructive/5">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-8 w-8 text-destructive" />
                    <div>
                      <h4 className="font-semibold text-accessible-base">Emergency Services</h4>
                      <p className="text-accessible-sm text-muted-foreground">
                        911 will be contacted immediately
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-8 w-8 text-primary" />
                    <div>
                      <h4 className="font-semibold text-accessible-base">Location Sharing</h4>
                      <p className="text-accessible-sm text-muted-foreground">
                        Your location will be shared with responders
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Button
                onClick={confirmEmergency}
                className="w-full emergency-button"
                size="lg"
              >
                <Phone className="mr-2 h-6 w-6" />
                YES - CALL EMERGENCY SERVICES
              </Button>
              
              <Button
                onClick={cancelEmergency}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Cancel
              </Button>
            </div>
          </>
        );

      case 'location':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="text-accessible-xl text-center">
                Getting Your Location
              </DialogTitle>
              <DialogDescription className="text-accessible-base text-center">
                We're determining your precise location to send to emergency services
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex flex-col items-center space-y-6 py-8">
              {locationLoading ? (
                <>
                  <Loader2 className="h-16 w-16 animate-spin text-primary" />
                  <p className="text-accessible-base">Locating you...</p>
                </>
              ) : location ? (
                <>
                  <CheckCircle className="h-16 w-16 text-green-500" />
                  <div className="text-center space-y-2">
                    <p className="text-accessible-base font-semibold">Location Found</p>
                    <p className="text-accessible-sm text-muted-foreground">
                      {location.address || `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`}
                    </p>
                    {location.accuracy && (
                      <Badge variant="outline">
                        Accuracy: ±{Math.round(location.accuracy)}m
                      </Badge>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          </>
        );

      case 'dispatching':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="text-accessible-xl text-center text-destructive">
                Contacting Emergency Services
              </DialogTitle>
              <DialogDescription className="text-accessible-base text-center">
                Please stay calm. Help is on the way.
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex flex-col items-center space-y-6 py-8">
              <div className="relative">
                <Phone className="h-16 w-16 text-destructive animate-pulse" />
                <div className="absolute -top-2 -right-2">
                  <div className="h-6 w-6 bg-destructive rounded-full animate-ping"></div>
                </div>
              </div>
              <div className="text-center space-y-2">
                <p className="text-accessible-base font-semibold">Calling 911...</p>
                <p className="text-accessible-sm text-muted-foreground">
                  Emergency responders are being dispatched
                </p>
              </div>
            </div>
          </>
        );

      case 'active':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="text-accessible-xl text-center text-green-600">
                Emergency Services Contacted
              </DialogTitle>
              <DialogDescription className="text-accessible-base text-center">
                Help is on the way. Stay where you are.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="text-center space-y-3">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                    <div>
                      <h4 className="font-semibold text-accessible-base text-green-800">
                        Emergency Response Active
                      </h4>
                      <p className="text-accessible-sm text-green-700">
                        Emergency services have been notified and are en route
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {location && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-6 w-6 text-primary" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-accessible-base">Your Location</h4>
                        <p className="text-accessible-sm text-muted-foreground">
                          {location.address || `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`}
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Shared</Badge>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="text-center text-accessible-sm text-muted-foreground">
                Emergency contacts and care team have also been notified
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Button
        onClick={handleEmergencyClick}
        className={`emergency-button ${emergencyActive ? 'animate-pulse' : ''}`}
        size="lg"
        disabled={emergencyActive}
      >
        <AlertTriangle className="mr-2 h-6 w-6" />
        {emergencyActive ? 'EMERGENCY ACTIVE' : 'EMERGENCY'}
      </Button>

      <Dialog open={showConfirm} onOpenChange={() => !emergencyActive && cancelEmergency()}>
        <DialogContent className="max-w-md">
          {renderDialogContent()}
        </DialogContent>
      </Dialog>
    </>
  );
};