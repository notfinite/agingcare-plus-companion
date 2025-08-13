import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { TelehealthWidget } from '@/components/telehealth/TelehealthWidget';

const Telehealth = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Telehealth</h1>
          <p className="text-muted-foreground">
            Virtual consultations and remote healthcare services
          </p>
        </div>
        
        <TelehealthWidget />
      </div>
    </AppLayout>
  );
};

export default Telehealth;