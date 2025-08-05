import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PatientsOverview } from '@/components/caregiver/PatientsOverview';
import { AlertsWidget } from '@/components/alerts/AlertsWidget';
import { MedicationTrackingWidget } from '@/components/caregiver/MedicationTrackingWidget';
import { HealthSummaryWidget } from '@/components/caregiver/HealthSummaryWidget';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, AlertTriangle, Heart, CheckCircle } from 'lucide-react';

export const CaregiverDashboard = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-accessible-2xl font-bold mb-2">Caregiver Dashboard</h2>
          <p className="text-accessible-lg text-muted-foreground">
            Monitor and support your care recipients with real-time insights
          </p>
        </div>

        {/* Caregiver Impact Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-accessible-base font-medium">Care Recipients</CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-accessible-xl font-bold">3</div>
              <p className="text-accessible-sm text-primary">Active patients</p>
              <p className="text-accessible-xs text-muted-foreground">2 stable, 1 needs attention</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-health-warning">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-accessible-base font-medium">Priority Alerts</CardTitle>
              <AlertTriangle className="h-5 w-5 text-health-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-accessible-xl font-bold">1</div>
              <p className="text-accessible-sm text-health-warning">High priority</p>
              <p className="text-accessible-xs text-muted-foreground">Mom's BP elevated</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-health-good">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-accessible-base font-medium">Health Trends</CardTitle>
              <Heart className="h-5 w-5 text-health-good" />
            </CardHeader>
            <CardContent>
              <div className="text-accessible-xl font-bold">Improving</div>
              <p className="text-accessible-sm text-health-good">Overall trend</p>
              <p className="text-accessible-xs text-muted-foreground">85% metrics on target</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-health-excellent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-accessible-base font-medium">Care Coordination</CardTitle>
              <CheckCircle className="h-5 w-5 text-health-excellent" />
            </CardHeader>
            <CardContent>
              <div className="text-accessible-xl font-bold">94%</div>
              <p className="text-accessible-sm text-health-excellent">Medication adherence</p>
              <p className="text-accessible-xs text-muted-foreground">Up 12% this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Care Impact Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-accessible-lg">Your Care Impact This Month</CardTitle>
            <CardDescription>How your support is improving health outcomes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-accessible-2xl font-bold text-health-excellent">12</div>
                <p className="text-accessible-base font-medium">Emergency Prevention</p>
                <p className="text-accessible-sm text-muted-foreground">Early interventions that avoided ER visits</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-accessible-2xl font-bold text-secondary">89%</div>
                <p className="text-accessible-base font-medium">Appointment Adherence</p>
                <p className="text-accessible-sm text-muted-foreground">Helped schedule & remind</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-accessible-2xl font-bold text-primary">$2,340</div>
                <p className="text-accessible-base font-medium">Healthcare Savings</p>
                <p className="text-accessible-sm text-muted-foreground">Estimated cost reduction</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PatientsOverview />
          <AlertsWidget />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MedicationTrackingWidget />
          <HealthSummaryWidget />
        </div>
      </div>
    </AppLayout>
  );
};