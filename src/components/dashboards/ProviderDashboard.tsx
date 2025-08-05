import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PatientListWidget } from '@/components/provider/PatientListWidget';
import { AppointmentsWidget } from '@/components/appointments/AppointmentsWidget';
import { ClinicalAlertsWidget } from '@/components/provider/ClinicalAlertsWidget';
import { AnalyticsWidget } from '@/components/provider/AnalyticsWidget';
import { TelehealthWidget } from '@/components/telehealth/TelehealthWidget';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, TrendingUp, Video } from 'lucide-react';

export const ProviderDashboard = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-accessible-2xl font-bold mb-2">Provider Dashboard</h2>
          <p className="text-accessible-lg text-muted-foreground">
            Comprehensive patient care management and clinical insights
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-accessible-base font-medium">Total Patients</CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-accessible-xl font-bold">247</div>
              <p className="text-accessible-sm text-muted-foreground">Active patients</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-accessible-base font-medium">Today's Appointments</CardTitle>
              <Calendar className="h-5 w-5 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-accessible-xl font-bold">12</div>
              <p className="text-accessible-sm text-muted-foreground">6 telehealth</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-accessible-base font-medium">High-Risk Patients</CardTitle>
              <TrendingUp className="h-5 w-5 text-health-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-accessible-xl font-bold">8</div>
              <p className="text-accessible-sm text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-accessible-base font-medium">Telehealth Ready</CardTitle>
              <Video className="h-5 w-5 text-health-excellent" />
            </CardHeader>
            <CardContent>
              <div className="text-accessible-xl font-bold">Ready</div>
              <p className="text-accessible-sm text-muted-foreground">Next: 2:30 PM</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PatientListWidget />
          <ClinicalAlertsWidget />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TelehealthWidget />
          <AnalyticsWidget />
        </div>

        <AppointmentsWidget />
      </div>
    </AppLayout>
  );
};