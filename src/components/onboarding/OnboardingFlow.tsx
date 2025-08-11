import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Users, 
  Stethoscope, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle,
  AlertTriangle,
  Phone,
  MapPin,
  Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  content: React.ReactNode;
}

interface FeatureHighlight {
  icon: any;
  title: string;
  description: string;
  benefits: string[];
}

export const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPersona, setSelectedPersona] = useState<string>('');
  const navigate = useNavigate();

  const personaFeatures: Record<string, FeatureHighlight[]> = {
    patient: [
      {
        icon: Heart,
        title: 'Health Monitoring',
        description: 'Track your vital signs and health metrics',
        benefits: ['Real-time health tracking', 'Medication reminders', 'Trend analysis']
      },
      {
        icon: AlertTriangle,
        title: 'Emergency Support',
        description: 'Instant access to emergency services',
        benefits: ['GPS location sharing', 'Automatic notifications', '24/7 monitoring']
      },
      {
        icon: Stethoscope,
        title: 'Telehealth Access',
        description: 'Connect with healthcare providers remotely',
        benefits: ['Video consultations', 'Prescription management', 'Follow-up care']
      }
    ],
    caregiver: [
      {
        icon: Users,
        title: 'Patient Management',
        description: 'Monitor multiple care recipients',
        benefits: ['Centralized dashboard', 'Health alerts', 'Care coordination']
      },
      {
        icon: Bell,
        title: 'Smart Alerts',
        description: 'Receive priority notifications',
        benefits: ['Critical health alerts', 'Medication reminders', 'Appointment updates']
      },
      {
        icon: Phone,
        title: 'Family Communication',
        description: 'Stay connected with care network',
        benefits: ['Secure messaging', 'Progress updates', 'Care team coordination']
      }
    ],
    provider: [
      {
        icon: Stethoscope,
        title: 'Clinical Dashboard',
        description: 'Comprehensive patient overview',
        benefits: ['Population health metrics', 'Risk stratification', 'Quality indicators']
      },
      {
        icon: Heart,
        title: 'Remote Monitoring',
        description: 'Track patient health remotely',
        benefits: ['Continuous monitoring', 'Early intervention', 'Outcome tracking']
      },
      {
        icon: Users,
        title: 'Care Coordination',
        description: 'Collaborate with care teams',
        benefits: ['Team communication', 'Care plans', 'Referral management']
      }
    ]
  };

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to AgingCare+',
      description: 'Your comprehensive platform for aging in place with confidence',
      content: (
        <div className="text-center space-y-6">
          <div className="flex justify-center items-center space-x-4 mb-6">
            <Heart className="h-16 w-16 text-primary animate-pulse" />
            <div className="text-left">
              <h2 className="text-accessible-2xl font-bold text-primary">AgingCare+</h2>
              <p className="text-accessible-lg text-muted-foreground">
                Empowering independence through technology
              </p>
            </div>
          </div>
          
          <Card className="bg-gradient-primary text-white border-0">
            <CardContent className="p-6">
              <h3 className="text-accessible-xl font-semibold mb-4">
                Our Mission
              </h3>
              <p className="text-accessible-base leading-relaxed">
                To enable aging adults to live independently and safely in their homes 
                while providing peace of mind to families and supporting healthcare providers 
                with comprehensive care coordination tools.
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Evidence-Based</h4>
              <p className="text-sm text-muted-foreground">
                Proven interventions that improve health outcomes
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">Person-Centered</h4>
              <p className="text-sm text-muted-foreground">
                Tailored to individual needs and preferences
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Connected Care</h4>
              <p className="text-sm text-muted-foreground">
                Seamless coordination across your care team
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'persona-selection',
      title: 'Choose Your Role',
      description: 'Select the option that best describes how you\'ll use AgingCare+',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                id: 'patient',
                title: 'Aging Adult',
                icon: Heart,
                description: 'I want to monitor my health and maintain my independence',
                features: ['Health tracking', 'Medication management', 'Emergency support']
              },
              {
                id: 'caregiver',
                title: 'Family Caregiver',
                icon: Users,
                description: 'I care for an aging family member or friend',
                features: ['Patient monitoring', 'Care coordination', 'Family communication']
              },
              {
                id: 'provider',
                title: 'Healthcare Provider',
                icon: Stethoscope,
                description: 'I provide professional healthcare services',
                features: ['Clinical dashboard', 'Population health', 'Remote monitoring']
              }
            ].map((persona) => (
              <Card 
                key={persona.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-elegant ${
                  selectedPersona === persona.id 
                    ? 'border-primary shadow-glow bg-primary/5' 
                    : 'hover:border-primary/50'
                }`}
                onClick={() => setSelectedPersona(persona.id)}
              >
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    selectedPersona === persona.id 
                      ? 'bg-primary text-white' 
                      : 'bg-muted'
                  }`}>
                    <persona.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-accessible-lg">{persona.title}</CardTitle>
                  <CardDescription className="text-accessible-base">
                    {persona.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {persona.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-accessible-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {selectedPersona && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <div>
                    <h4 className="font-semibold text-accessible-base">Great Choice!</h4>
                    <p className="text-accessible-sm text-muted-foreground">
                      We'll customize your experience for your role
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )
    },
    {
      id: 'features',
      title: 'Your Personalized Features',
      description: 'Here\'s what AgingCare+ can do for you',
      content: (
        <div className="space-y-6">
          {selectedPersona && personaFeatures[selectedPersona] && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {personaFeatures[selectedPersona].map((feature, index) => (
                <Card key={index} className="hover:shadow-elegant transition-smooth">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-accessible-lg">{feature.title}</CardTitle>
                    <CardDescription className="text-accessible-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-accessible-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          <Card className="bg-gradient-secondary text-white border-0">
            <CardContent className="p-6 text-center">
              <h3 className="text-accessible-xl font-semibold mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-accessible-base leading-relaxed">
                Your personalized dashboard is ready. Let's explore how AgingCare+ 
                can support your {selectedPersona === 'patient' ? 'health journey' : 
                selectedPersona === 'caregiver' ? 'caregiving experience' : 'clinical practice'}.
              </p>
            </CardContent>
          </Card>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      if (selectedPersona) {
        localStorage.setItem('demoPersona', selectedPersona);
        localStorage.setItem('onboardingCompleted', 'true');
        navigate('/dashboard');
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return selectedPersona !== '';
    }
    return true;
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <Card className="bg-white/95 backdrop-blur-sm shadow-elegant border-0">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            
            <Progress value={progressPercentage} className="w-full max-w-md mx-auto mb-6" />
            
            <CardTitle className="text-accessible-2xl font-bold">
              {steps[currentStep].title}
            </CardTitle>
            <CardDescription className="text-accessible-lg">
              {steps[currentStep].description}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pb-8">
            {steps[currentStep].content}
          </CardContent>
          
          <div className="flex justify-between items-center p-6 border-t bg-muted/20">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>
            
            <div className="flex items-center space-x-2 text-accessible-sm text-muted-foreground">
              <span>Step {currentStep + 1} of {steps.length}</span>
            </div>
            
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center space-x-2 btn-gradient-primary"
            >
              <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};