import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { CompassionateDashboard } from '@/components/compassion/CompassionateDashboard';

const CompassionateCare = () => {
  return (
    <AppLayout>
      <CompassionateDashboard />
    </AppLayout>
  );
};

export default CompassionateCare;