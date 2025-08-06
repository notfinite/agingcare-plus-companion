import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PatientsOverview } from '@/components/caregiver/PatientsOverview';
import { AlertsWidget } from '@/components/alerts/AlertsWidget';
import { MedicationTrackingWidget } from '@/components/caregiver/MedicationTrackingWidget';
import { HealthSummaryWidget } from '@/components/caregiver/HealthSummaryWidget';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, AlertTriangle, Heart, CheckCircle, Shield, TrendingUp, Clock, Star } from 'lucide-react';

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
          <Card className="card-premium hover-lift bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-accessible-base font-medium">Care Recipients</CardTitle>
              <div className="p-2 bg-primary/20 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-accessible-xl font-bold text-primary">3</div>
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3 text-primary" />
                <p className="text-accessible-sm text-primary font-medium">Active patients</p>
              </div>
              <p className="text-accessible-xs text-muted-foreground flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                2 stable, 1 needs attention
              </p>
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift bg-gradient-to-br from-health-warning/10 to-health-warning/5 border-health-warning/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-accessible-base font-medium">Priority Alerts</CardTitle>
              <div className="p-2 bg-health-warning/20 rounded-lg animate-pulse">
                <AlertTriangle className="h-5 w-5 text-health-warning" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-accessible-xl font-bold text-health-warning">1</div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-health-warning" />
                <p className="text-accessible-sm text-health-warning font-medium">High priority</p>
              </div>
              <p className="text-accessible-xs text-muted-foreground flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Mom's BP elevated (156/92)
              </p>
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift bg-gradient-to-br from-health-good/10 to-health-good/5 border-health-good/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-accessible-base font-medium">Health Trends</CardTitle>
              <div className="p-2 bg-health-good/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-health-good" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-accessible-xl font-bold text-health-good">Improving</div>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-health-good" />
                <p className="text-accessible-sm text-health-good font-medium">Overall trend</p>
              </div>
              <p className="text-accessible-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                85% metrics on target (+8% this week)
              </p>
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift bg-gradient-to-br from-health-excellent/10 to-health-excellent/5 border-health-excellent/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-accessible-base font-medium">Care Coordination</CardTitle>
              <div className="p-2 bg-health-excellent/20 rounded-lg">
                <Shield className="h-5 w-5 text-health-excellent" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-accessible-xl font-bold text-health-excellent">94%</div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-health-excellent" />
                <p className="text-accessible-sm text-health-excellent font-medium">Medication adherence</p>
              </div>
              <p className="text-accessible-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Up 12% this month (excellent!)
              </p>
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