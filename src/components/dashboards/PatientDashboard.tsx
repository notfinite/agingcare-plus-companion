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

        {/* Quick Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-accessible-base font-medium">Today's BP</CardTitle>
              <Heart className="h-5 w-5 text-health-good" />
            </CardHeader>
            <CardContent>
              <div className="text-accessible-xl font-bold">120/80</div>
              <p className="text-accessible-sm text-muted-foreground">Normal range</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-accessible-base font-medium">Heart Rate</CardTitle>
              <Activity className="h-5 w-5 text-health-excellent" />
            </CardHeader>
            <CardContent>
              <div className="text-accessible-xl font-bold">72 BPM</div>
              <p className="text-accessible-sm text-muted-foreground">Excellent</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-accessible-base font-medium">Medications</CardTitle>
              <Pill className="h-5 w-5 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-accessible-xl font-bold">2 due</div>
              <p className="text-accessible-sm text-muted-foreground">Next at 2:00 PM</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-accessible-base font-medium">Risk Score</CardTitle>
              <Brain className="h-5 w-5 text-health-good" />
            </CardHeader>
            <CardContent>
              <div className="text-accessible-xl font-bold">Low</div>
              <p className="text-accessible-sm text-muted-foreground">AI assessment</p>
            </CardContent>
          </Card>
        </div>

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