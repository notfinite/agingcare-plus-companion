import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Shield, Users, User, UserCheck, Stethoscope, Activity, TrendingUp, Star, CheckCircle, Brain, Zap } from 'lucide-react';

const Index = () => {
  const [selectedPersona, setSelectedPersona] = useState<string>('');
  const navigate = useNavigate();

  const handlePersonaSelect = () => {
    if (selectedPersona) {
      // Store selected persona in localStorage for demo purposes
      localStorage.setItem('demoPersona', selectedPersona);
      // Check if onboarding has been completed
      const onboardingCompleted = localStorage.getItem('onboardingCompleted');
      if (!onboardingCompleted) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
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
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-secondary rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-primary rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="w-full max-w-6xl relative z-10">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl shadow-glow">
              <Heart className="h-16 w-16 text-white animate-pulse" />
            </div>
          </div>
          <h1 className="text-6xl font-bold text-white mb-6 drop-shadow-lg">AgingCare+</h1>
          <p className="text-2xl text-white/90 mb-8 drop-shadow-sm max-w-3xl mx-auto">
            Empowering older adults and caregivers to manage chronic conditions from home with confidence and care
          </p>
          
          {/* Feature highlights with icons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl hover-scale">
              <Shield className="h-8 w-8 text-white mx-auto mb-3" />
              <h4 className="text-white font-medium mb-1">HIPAA Secure</h4>
              <p className="text-xs text-white/80">Enterprise security</p>
            </div>
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl hover-scale">
              <Activity className="h-8 w-8 text-white mx-auto mb-3" />
              <h4 className="text-white font-medium mb-1">Real-time</h4>
              <p className="text-xs text-white/80">Live monitoring</p>
            </div>
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl hover-scale">
              <Brain className="h-8 w-8 text-white mx-auto mb-3" />
              <h4 className="text-white font-medium mb-1">AI-Powered</h4>
              <p className="text-xs text-white/80">Smart insights</p>
            </div>
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl hover-scale">
              <Users className="h-8 w-8 text-white mx-auto mb-3" />
              <h4 className="text-white font-medium mb-1">Connected</h4>
              <p className="text-xs text-white/80">Care coordination</p>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <Card className="card-premium bg-white/95 backdrop-blur-sm hover-lift">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-secondary rounded-lg">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-accessible-xl">Proven Outcomes</CardTitle>
                    <CardDescription>Real results from our platform</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-health-excellent/10 rounded-lg">
                    <div className="text-2xl font-bold text-health-excellent">89%</div>
                    <p className="text-xs text-muted-foreground">Medication adherence</p>
                  </div>
                  <div className="text-center p-3 bg-primary/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary">34%</div>
                    <p className="text-xs text-muted-foreground">Fewer ER visits</p>
                  </div>
                  <div className="text-center p-3 bg-secondary/10 rounded-lg">
                    <div className="text-2xl font-bold text-secondary">$2.4M</div>
                    <p className="text-xs text-muted-foreground">Cost savings</p>
                  </div>
                  <div className="text-center p-3 bg-amber-100 rounded-lg">
                    <div className="text-2xl font-bold text-amber-600">4.8/5</div>
                    <p className="text-xs text-muted-foreground">User satisfaction</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-premium bg-white/95 backdrop-blur-sm hover-lift">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-primary rounded-lg">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-accessible-xl">Key Features</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5 text-health-excellent" />
                  <span className="text-accessible-base">Real-time vital monitoring</span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-amber-500" />
                  <span className="text-accessible-base">Smart medication reminders</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-secondary" />
                  <span className="text-accessible-base">Family care coordination</span>
                </div>
                <div className="flex items-center gap-3">
                  <Brain className="h-5 w-5 text-primary" />
                  <span className="text-accessible-base">AI-powered health insights</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="card-premium bg-white/95 backdrop-blur-sm shadow-glow">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-primary rounded-xl">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-accessible-2xl">Choose Your Experience</CardTitle>
                <CardDescription className="text-accessible-base">
                  Select your role to explore personalized features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  {personas.map((persona) => {
                    const IconComponent = persona.icon;
                    return (
                      <Card 
                        key={persona.value}
                        className={`cursor-pointer transition-all duration-300 hover-scale ${
                          selectedPersona === persona.value 
                            ? 'border-primary bg-gradient-to-r from-primary/10 to-primary/5 shadow-card' 
                            : 'hover:border-primary/50 hover:shadow-card'
                        }`}
                        onClick={() => setSelectedPersona(persona.value)}
                      >
                        <CardContent className="flex items-center space-x-4 p-4">
                          <div className={`p-3 rounded-lg ${
                            selectedPersona === persona.value 
                              ? 'bg-primary/20' 
                              : 'bg-muted/50'
                          }`}>
                            <IconComponent className={`h-6 w-6 ${
                              selectedPersona === persona.value 
                                ? 'text-primary' 
                                : 'text-muted-foreground'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-accessible-lg font-semibold">{persona.label}</h4>
                            <p className="text-accessible-sm text-muted-foreground">{persona.description}</p>
                          </div>
                          {selectedPersona === persona.value && (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                
                <Button 
                  onClick={handlePersonaSelect}
                  disabled={!selectedPersona}
                  className="w-full text-accessible-lg h-14 btn-gradient-primary hover-scale"
                  size="lg"
                >
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Enter Dashboard
                    <Activity className="h-5 w-5" />
                  </div>
                </Button>
                
                <div className="text-center text-xs text-muted-foreground mt-4 p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2 justify-center mb-1">
                    <Shield className="h-4 w-4 text-amber-600" />
                    <span className="font-medium text-amber-800">Demo Environment</span>
                  </div>
                  <p className="text-amber-700">
                    Production authentication system disabled for demonstration. 
                    Full security protocols available in live deployment.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
