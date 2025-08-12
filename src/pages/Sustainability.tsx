import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SustainabilityDashboard } from '@/components/sustainability/SustainabilityDashboard';

const Sustainability = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-accessible-2xl font-bold mb-2">🌱 Your Green Health Journey</h2>
          <p className="text-accessible-lg text-muted-foreground">
            Making environmentally conscious healthcare decisions without compromising care
          </p>
        </div>
        
        <SustainabilityDashboard />
      </div>
    </AppLayout>
  );
};

export default Sustainability;