import React from 'react';
import { HealthMetricsWidget } from '@/components/health/HealthMetricsWidget';
import { MedicationWidget } from '@/components/medication/MedicationWidget';
import { SmartMedicationReminder } from '@/components/medication/SmartMedicationReminder';
import { AppointmentsWidget } from '@/components/appointments/AppointmentsWidget';
import { AlertsWidget } from '@/components/alerts/AlertsWidget';
import { VitalsChart } from '@/components/health/VitalsChart';
import { AIHealthAssistant } from '@/components/ai/AIHealthAssistant';
import { FamilyMessaging } from '@/components/communication/FamilyMessaging';
import { SustainabilityWidget } from '@/components/sustainability/SustainabilityWidget';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Activity, Pill, Calendar, Brain, TrendingUp, Target, Award, CheckCircle, Star, Shield } from 'lucide-react';

export const PatientDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-accessible-2xl font-bold mb-2">Your Health Dashboard</h2>
          <p className="text-accessible-lg text-muted-foreground">
            Stay on top of your health with real-time monitoring and insights
          </p>
        </div>

        {/* Health Summary Cards - Patient Focused Outcomes */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="card-premium hover-lift bg-gradient-to-br from-health-good/10 to-health-good/5 border-health-good/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-accessible-base font-medium">Today's BP</CardTitle>
              <div className="p-2 bg-health-good/20 rounded-lg">
                <Heart className="h-5 w-5 text-health-good" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-accessible-xl font-bold text-health-good">118/76</div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-health-good" />
                <p className="text-accessible-sm text-health-good font-medium">Within target range</p>
              </div>
              <p className="text-accessible-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                7-day avg: 122/78 (↓4mmHg)
              </p>
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift bg-gradient-to-br from-health-excellent/10 to-health-excellent/5 border-health-excellent/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-accessible-base font-medium">Heart Rate</CardTitle>
              <div className="p-2 bg-health-excellent/20 rounded-lg">
                <Activity className="h-5 w-5 text-health-excellent" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-accessible-xl font-bold text-health-excellent">68 BPM</div>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-health-excellent" />
                <p className="text-accessible-sm text-health-excellent font-medium">Excellent resting rate</p>
              </div>
              <p className="text-accessible-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Improved from 74 BPM (↓6 BPM)
              </p>
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-accessible-base font-medium">Medication Adherence</CardTitle>
              <div className="p-2 bg-secondary/20 rounded-lg">
                <Pill className="h-5 w-5 text-secondary" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-accessible-xl font-bold text-secondary">96%</div>
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3 text-secondary" />
                <p className="text-accessible-sm text-secondary font-medium">This month</p>
              </div>
              <p className="text-accessible-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Next: Metformin at 2:00 PM
              </p>
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-accessible-base font-medium">Health Score</CardTitle>
              <div className="p-2 bg-primary/20 rounded-lg">
                <Brain className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-accessible-xl font-bold text-primary">8.2/10</div>
              <div className="flex items-center gap-1">
                <Award className="h-3 w-3 text-primary" />
                <p className="text-accessible-sm text-primary font-medium">Stable condition</p>
              </div>
              <p className="text-accessible-xs text-muted-foreground flex items-center gap-1">
                <Target className="h-3 w-3" />
                Diabetes well-managed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Goals & Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-accessible-lg">Weekly Health Goals</CardTitle>
            <CardDescription>Your progress toward better health outcomes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-accessible-base">Steps Goal</span>
                  <span className="text-accessible-base font-semibold">8,200/10,000</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-health-good h-2 rounded-full" style={{width: '82%'}}></div>
                </div>
                <p className="text-accessible-sm text-muted-foreground">82% complete - great progress!</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-accessible-base">Blood Sugar Checks</span>
                  <span className="text-accessible-base font-semibold">13/14</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-health-excellent h-2 rounded-full" style={{width: '93%'}}></div>
                </div>
                <p className="text-accessible-sm text-muted-foreground">Excellent monitoring!</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-accessible-base">Weight Management</span>
                  <span className="text-accessible-base font-semibold">-1.2 lbs</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-secondary h-2 rounded-full" style={{width: '60%'}}></div>
                </div>
                <p className="text-accessible-sm text-muted-foreground">On track to lose 2 lbs this month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <HealthMetricsWidget />
          <div className="space-y-6">
            <MedicationWidget />
            <SmartMedicationReminder />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VitalsChart />
          <AlertsWidget />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AppointmentsWidget />
          <AIHealthAssistant userRole="patient" context={{
            vitals: { bloodPressure: '128/82', heartRate: '72' },
            medications: ['Lisinopril', 'Metformin']
          }} />
        </div>

        {/* Sustainability & Communication */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <SustainabilityWidget />
          </div>
          <div className="lg:col-span-2">
            <FamilyMessaging />
          </div>
        </div>

        {/* Health Interventions & Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-accessible-lg">Personalized Health Recommendations</CardTitle>
            <CardDescription>Evidence-based interventions to improve your health outcomes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="p-4 bg-health-excellent/5 border border-health-excellent/20 rounded-lg">
                <h4 className="text-accessible-base font-medium text-health-excellent mb-3">🥗 Nutrition Interventions</h4>
                <div className="space-y-2 text-accessible-sm">
                  <p><strong>Plant-Based Mediterranean Diet:</strong> Studies show 23% reduction in diabetes complications</p>
                  <p><strong>Target:</strong> 5 servings vegetables, 3 servings whole grains daily</p>
                  <p><strong>Avoid:</strong> Processed meats, refined sugars, saturated fats &gt;10% calories</p>
                  <p><strong>Your Progress:</strong> 85% compliant this week - excellent work!</p>
                </div>
              </div>
              
              <div className="p-4 bg-secondary/5 border border-secondary/20 rounded-lg">
                <h4 className="text-accessible-base font-medium text-secondary mb-3">🏃‍♂️ Exercise Prescription</h4>
                <div className="space-y-2 text-accessible-sm">
                  <p><strong>Cardio Goal:</strong> 150 minutes moderate activity weekly (brisk walking)</p>
                  <p><strong>Strength Training:</strong> 2x per week with resistance bands or light weights</p>
                  <p><strong>Balance Work:</strong> 10 minutes daily to prevent falls</p>
                  <p><strong>Your Achievement:</strong> 82% of weekly goal completed 🎯</p>
                </div>
              </div>
              
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <h4 className="text-accessible-base font-medium text-primary mb-3">💊 Medication Optimization</h4>
                <div className="space-y-2 text-accessible-sm">
                  <p><strong>Current Regimen:</strong> Working excellently - 96% adherence rate</p>
                  <p><strong>Timing Tip:</strong> Take Metformin with meals to reduce GI side effects</p>
                  <p><strong>Monitoring:</strong> Continue daily glucose checks, report patterns</p>
                  <p><strong>Next Review:</strong> January 15th with Dr. Johnson</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-health-excellent/10 to-secondary/10 rounded-lg">
              <h5 className="text-accessible-base font-medium mb-2">🏆 Your Health Achievements</h5>
              <p className="text-accessible-sm text-muted-foreground">
                This month you've reduced your diabetes risk by 18% through consistent medication adherence and healthy lifestyle choices. 
                Your blood pressure has improved to optimal levels, and your energy is at its highest in years!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};