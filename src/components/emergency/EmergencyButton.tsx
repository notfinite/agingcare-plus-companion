import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const EmergencyButton = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const { toast } = useToast();

  const handleEmergencyClick = () => {
    setShowConfirm(true);
  };

  const confirmEmergency = async () => {
    setShowConfirm(false);
    setEmergencyActive(true);
    
    // Trigger emergency protocols
    try {
      // Here you would integrate with emergency services APIs
      // Send alerts to caregivers, providers, and emergency contacts
      toast({
        title: "Emergency Alert Sent",
        description: "Emergency contacts and care team have been notified. Help is on the way.",
        variant: "destructive",
      });
      
      // Simulate emergency response delay
      setTimeout(() => {
        setEmergencyActive(false);
      }, 30000);
    } catch (error) {
      toast({
        title: "Emergency Alert Failed",
        description: "Please call 911 directly.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Button
        onClick={handleEmergencyClick}
        className={`emergency-button ${emergencyActive ? 'animate-pulse' : ''}`}
        size="lg"
      >
        <AlertTriangle className="mr-2 h-6 w-6" />
        EMERGENCY
      </Button>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-accessible-xl text-center text-destructive">
              Confirm Emergency Alert
            </DialogTitle>
            <DialogDescription className="text-accessible-base text-center">
              This will immediately notify your emergency contacts, caregivers, and healthcare providers.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <Button
              onClick={confirmEmergency}
              className="w-full emergency-button"
              size="lg"
            >
              <Phone className="mr-2 h-6 w-6" />
              YES - SEND EMERGENCY ALERT
            </Button>
            
            <Button
              onClick={() => setShowConfirm(false)}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};