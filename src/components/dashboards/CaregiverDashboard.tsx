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

        {/* Quick Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-accessible-base font-medium">Patients</CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-accessible-xl font-bold">3</div>
              <p className="text-accessible-sm text-muted-foreground">Under your care</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-accessible-base font-medium">Active Alerts</CardTitle>
              <AlertTriangle className="h-5 w-5 text-health-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-accessible-xl font-bold">2</div>
              <p className="text-accessible-sm text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-accessible-base font-medium">Vitals Check</CardTitle>
              <Heart className="h-5 w-5 text-health-good" />
            </CardHeader>
            <CardContent>
              <div className="text-accessible-xl font-bold">All Good</div>
              <p className="text-accessible-sm text-muted-foreground">Last 24 hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-accessible-base font-medium">Medications</CardTitle>
              <CheckCircle className="h-5 w-5 text-health-excellent" />
            </CardHeader>
            <CardContent>
              <div className="text-accessible-xl font-bold">98%</div>
              <p className="text-accessible-sm text-muted-foreground">Compliance rate</p>
            </CardContent>
          </Card>
        </div>

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