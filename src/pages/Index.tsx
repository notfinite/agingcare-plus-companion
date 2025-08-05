import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Shield, Users, User, UserCheck, Stethoscope } from 'lucide-react';

const Index = () => {
  const [selectedPersona, setSelectedPersona] = useState<string>('');
  const navigate = useNavigate();

  const handlePersonaSelect = () => {
    if (selectedPersona) {
      // Store selected persona in localStorage for demo purposes
      localStorage.setItem('demoPersona', selectedPersona);
      navigate('/dashboard');
    }
  };

  const personas = [
    {
      value: 'patient',
      label: 'Patient',
      icon: User,
      description: 'Manage your health and medications'
    },
    {
      value: 'caregiver', 
      label: 'Caregiver',
      icon: UserCheck,
      description: 'Support and monitor care recipients'
    },
    {
      value: 'provider',
      label: 'Healthcare Provider',
      icon: Stethoscope,
      description: 'Monitor patient populations and outcomes'
    }
  ];

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
            <Card>
              <CardHeader>
                <CardTitle className="text-accessible-xl">Demo Access</CardTitle>
                <CardDescription className="text-accessible-base">
                  Select your role to explore the dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  {personas.map((persona) => {
                    const IconComponent = persona.icon;
                    return (
                      <Card 
                        key={persona.value}
                        className={`cursor-pointer transition-colors ${
                          selectedPersona === persona.value 
                            ? 'border-primary bg-primary/5' 
                            : 'hover:border-muted-foreground/50'
                        }`}
                        onClick={() => setSelectedPersona(persona.value)}
                      >
                        <CardContent className="flex items-center space-x-3 p-4">
                          <IconComponent className="h-6 w-6 text-primary" />
                          <div className="flex-1">
                            <h4 className="text-accessible-base font-medium">{persona.label}</h4>
                            <p className="text-accessible-sm text-muted-foreground">{persona.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                
                <Button 
                  onClick={handlePersonaSelect}
                  disabled={!selectedPersona}
                  className="w-full text-accessible-base"
                  size="lg"
                >
                  Enter Dashboard
                </Button>
                
                <p className="text-accessible-xs text-muted-foreground text-center mt-4">
                  * Secure authentication procedures excluded for demonstration purposes
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
