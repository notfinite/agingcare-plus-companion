import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { AppointmentsWidget } from '@/components/appointments/AppointmentsWidget';

const Appointments = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-accessible-2xl font-bold mb-2">📅 Your Appointments</h2>
          <p className="text-accessible-lg text-muted-foreground">
            Manage your upcoming healthcare appointments
          </p>
        </div>
        
        <AppointmentsWidget />
      </div>
    </AppLayout>
  );
};

export default Appointments;