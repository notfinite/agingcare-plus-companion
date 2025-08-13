import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { PatientDashboard } from '@/components/dashboards/PatientDashboard';
import { CaregiverDashboard } from '@/components/dashboards/CaregiverDashboard';
import { ProviderDashboard } from '@/components/dashboards/ProviderDashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const demoPersona = localStorage.getItem('demoPersona') || 'patient';
  
  // Show compassionate care prompt for new users
  const showCompassionatePrompt = !localStorage.getItem('compassionateCareSeen');

  const handleCompassionateCareClick = () => {
    localStorage.setItem('compassionateCareSeen', 'true');
    navigate('/compassionate-care');
  };

  const CompassionatePrompt = () => (
    <div className="mb-6 p-6 bg-gradient-compassion rounded-xl text-white shadow-glow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-full">
            <Heart className="h-8 w-8 text-white animate-breathe" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-1 flex items-center gap-2">
              Welcome to Compassionate Healthcare
              <Sparkles className="h-5 w-5" />
            </h3>
            <p className="text-white/90">Experience AI-powered emotional support, voice accessibility, and family connections designed with love and care.</p>
          </div>
        </div>
        <Button
          onClick={handleCompassionateCareClick}
          className="px-6 py-3 bg-white text-purple-600 font-semibold hover:bg-gray-100 transition-smooth hover:scale-105 shadow-lg"
        >
          Explore Now
        </Button>
      </div>
    </div>
  );

  const renderDashboard = () => {
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

  return (
    <AppLayout>
      {showCompassionatePrompt && <CompassionatePrompt />}
      {renderDashboard()}
    </AppLayout>
  );
};

export default Dashboard;