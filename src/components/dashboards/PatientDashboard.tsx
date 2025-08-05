import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { HealthMetricsWidget } from '@/components/health/HealthMetricsWidget';
import { MedicationWidget } from '@/components/medication/MedicationWidget';
import { AppointmentsWidget } from '@/components/appointments/AppointmentsWidget';
import { AlertsWidget } from '@/components/alerts/AlertsWidget';
import { VitalsChart } from '@/components/health/VitalsChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Activity, Pill, Calendar, Brain } from 'lucide-react';

export const PatientDashboard = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-accessible-2xl font-bold mb-2">Your Health Dashboard</h2>
          <p className="text-accessible-lg text-muted-foreground">
            Stay on top of your health with real-time monitoring and insights
          </p>
        </div>

        {/* Health Summary Cards - Patient Focused Outcomes */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-health-good">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-accessible-base font-medium">Today's BP</CardTitle>
              <Heart className="h-5 w-5 text-health-good" />
            </CardHeader>
            <CardContent>
              <div className="text-accessible-xl font-bold">118/76</div>
              <p className="text-accessible-sm text-health-good">Within target range</p>
              <p className="text-accessible-xs text-muted-foreground">7-day avg: 122/78</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-health-excellent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-accessible-base font-medium">Heart Rate</CardTitle>
              <Activity className="h-5 w-5 text-health-excellent" />
            </CardHeader>
            <CardContent>
              <div className="text-accessible-xl font-bold">68 BPM</div>
              <p className="text-accessible-sm text-health-excellent">Excellent resting rate</p>
              <p className="text-accessible-xs text-muted-foreground">Improved from 74 BPM</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-secondary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-accessible-base font-medium">Medication Adherence</CardTitle>
              <Pill className="h-5 w-5 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-accessible-xl font-bold">96%</div>
              <p className="text-accessible-sm text-secondary">This month</p>
              <p className="text-accessible-xs text-muted-foreground">Next: Metformin at 2:00 PM</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-health-good">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-accessible-base font-medium">Health Score</CardTitle>
              <Brain className="h-5 w-5 text-health-good" />
            </CardHeader>
            <CardContent>
              <div className="text-accessible-xl font-bold">8.2/10</div>
              <p className="text-accessible-sm text-health-good">Stable condition</p>
              <p className="text-accessible-xs text-muted-foreground">Diabetes well-managed</p>
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
          <MedicationWidget />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VitalsChart />
          <AlertsWidget />
        </div>

        <AppointmentsWidget />
      </div>
    </AppLayout>
  );
};