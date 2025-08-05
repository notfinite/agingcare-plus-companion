import React from 'react';
import { PatientDashboard } from '@/components/dashboards/PatientDashboard';
import { CaregiverDashboard } from '@/components/dashboards/CaregiverDashboard';
import { ProviderDashboard } from '@/components/dashboards/ProviderDashboard';

const Dashboard = () => {
  // Get demo persona from localStorage
  const demoPersona = localStorage.getItem('demoPersona') || 'patient';

  switch (demoPersona) {
    case 'patient':
      return <PatientDashboard />;
    case 'caregiver':
      return <CaregiverDashboard />;
    case 'provider':
      return <ProviderDashboard />;
    default:
      return <PatientDashboard />;
  }
};

export default Dashboard;