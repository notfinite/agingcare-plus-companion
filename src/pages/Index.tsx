import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { Button } from '@/components/ui/button';
import { Loader2, Heart, Shield, Users } from 'lucide-react';

const Index = () => {
  const { user, profile, loading, signOut } = useAuth();
  const [showSignUp, setShowSignUp] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-6xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Heart className="h-12 w-12 text-primary mr-3" />
              <h1 className="text-accessible-2xl font-bold text-primary">AgingCare+</h1>
            </div>
            <p className="text-accessible-lg text-muted-foreground max-w-2xl mx-auto">
              Empowering older adults and caregivers to manage chronic conditions from home with confidence and care.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Shield className="h-8 w-8 text-secondary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-accessible-xl font-semibold mb-2">HIPAA Compliant</h3>
                  <p className="text-accessible-base text-muted-foreground">
                    Your health data is protected with enterprise-grade security and privacy standards.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Users className="h-8 w-8 text-secondary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-accessible-xl font-semibold mb-2">Connected Care</h3>
                  <p className="text-accessible-base text-muted-foreground">
                    Share health insights with caregivers and healthcare providers seamlessly.
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              {showSignUp ? (
                <SignUpForm onToggleForm={() => setShowSignUp(false)} />
              ) : (
                <LoginForm onToggleForm={() => setShowSignUp(true)} />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Heart className="h-8 w-8 text-primary" />
            <h1 className="text-accessible-xl font-bold text-primary">AgingCare+</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-accessible-base">Welcome, {profile.full_name}</span>
            <Button variant="outline" onClick={signOut}>Sign Out</Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-accessible-2xl font-bold mb-4">
            {profile.role === 'patient' && 'Your Health Dashboard'}
            {profile.role === 'caregiver' && 'Caregiver Dashboard'}
            {profile.role === 'provider' && 'Provider Dashboard'}
          </h2>
          <p className="text-accessible-lg text-muted-foreground mb-8">
            Welcome to your personalized health management platform.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-accessible-xl font-semibold mb-2">Health Tracking</h3>
              <p className="text-accessible-base text-muted-foreground">
                Monitor vital signs and health metrics daily
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-accessible-xl font-semibold mb-2">Medications</h3>
              <p className="text-accessible-base text-muted-foreground">
                Track medications and receive reminders
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-accessible-xl font-semibold mb-2">Care Team</h3>
              <p className="text-accessible-base text-muted-foreground">
                Connect with caregivers and providers
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
