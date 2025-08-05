import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PatientDashboard } from '@/components/dashboards/PatientDashboard';
import { CaregiverDashboard } from '@/components/dashboards/CaregiverDashboard';
import { ProviderDashboard } from '@/components/dashboards/ProviderDashboard';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  switch (profile.role) {
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