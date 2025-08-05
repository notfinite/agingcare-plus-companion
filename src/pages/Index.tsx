import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { Button } from '@/components/ui/button';
import { Loader2, Heart, Shield, Users } from 'lucide-react';

const Index = () => {
  const { user, profile, loading, signOut } = useAuth();
  const [showSignUp, setShowSignUp] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && profile) {
      navigate('/dashboard');
    }
  }, [user, profile, navigate]);

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

  // This should never render for authenticated users
  return null;
};

export default Index;
